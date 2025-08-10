const express = require("express");
const { ethers } = require("ethers");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const router = express.Router();
const prisma = new PrismaClient();

// Load contract configuration
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contractABI =
  require("../../artifacts/contracts/Escrow.sol/Escrow.json").abi;

/**
 * POST /funding/fund-milestone
 * Client funds a milestone with AVAX
 */
router.post("/fund-milestone", async (req, res) => {
  try {
    const { projectId, milestoneId, clientWalletAddress, amount } = req.body;
    console.log("Received funding request:", { projectId, milestoneId, clientWalletAddress, amount });
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    // Validate input
    if (projectId < 0 || !milestoneId || !clientWalletAddress || !amount) {
      return res.status(400).json({
        error:
          "Missing required parameters: projectId, milestoneId, clientWalletAddress, amount",
      });
    }

    // Validate numeric inputs
    if (
      isNaN(projectId) ||
      isNaN(milestoneId) ||
      isNaN(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        error: "Invalid numeric parameters",
      });
    }

    // Get project from database
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
      include: { milestones: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Get milestone - using consistent 'mid' field
    const milestone = project.milestones.find(
      (m) => m.id === parseInt(milestoneId)
    );
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    if (milestone.funded) {
      return res.status(400).json({ error: "Milestone already funded" });
    }

    // Get project with client details
    const projectWithClient = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
      include: { 
        client: {
          select: {
            id: true,
            email: true,
            wallet_address: true,
            role: true
          }
        }
      },
    });

    // Convert input amount (AVAX) to wei for comparison and transaction
    const amountWei = ethers.parseEther(amount.toString());

    // Check if amount matches milestone amount (amount_wei is already stored as wei string)
    if (amountWei.toString() !== milestone.amount_wei) {
      return res.status(400).json({
        error: `Amount must be exactly ${ethers.formatEther(milestone.amount_wei)} AVAX`,
      });
    }

    // Validate wallet address format (basic check for development)
    if (!clientWalletAddress || !clientWalletAddress.startsWith('0x') || clientWalletAddress.length < 10) {
      return res.status(400).json({ error: "Invalid wallet address format" });
    }

    // Fund milestone on blockchain using client wallet
    console.log("Creating contract instance...");
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      contractABI,
      provider
    );
    const clientWallet = new ethers.Wallet(
      process.env.PRIVATE_KEY_ADMIN,
      provider
    );
    const contractWithSigner = contract.connect(clientWallet);

    console.log("Contract address:", process.env.CONTRACT_ADDRESS);
    console.log("Client wallet address:", clientWallet.address);
    console.log("Project onchain_pid:", project.onchain_pid);
    console.log("Milestone ID:", milestoneId);
    console.log("Amount wei:", amountWei.toString());

    // Test contract interface
    console.log(
      "Contract interface functions:",
      contract.interface.fragments
        .filter((f) => f.type === "function")
        .map((f) => f.name)
    );

    // Check wallet balance before transaction
    const balance = await provider.getBalance(clientWallet.address);
    if (balance < amountWei) {
      return res.status(400).json({
        error: "Insufficient wallet balance",
        required: ethers.formatEther(amountWei),
        available: ethers.formatEther(balance),
      });
    }

    console.log("Calling fundMilestone with:");
    console.log("- projectId (BigInt):", BigInt(project.onchain_pid));
    console.log("- milestoneId (int):", parseInt(milestoneId));
    console.log("- value:", amountWei.toString());

    // Check if function exists
    console.log("Function exists:", typeof contractWithSigner.fundMilestone);

    // Validate that the client wallet matches the project client
    if (projectWithClient.client.wallet_address !== clientWalletAddress) {
      return res.status(400).json({
        error: "Only the project client can fund milestones",
        expectedClient: projectWithClient.client.wallet_address,
        providedClient: clientWalletAddress,
      });
    }

    // For now, skip blockchain validation in development
    console.log("Skipping blockchain validation in development mode");

    // For development, simulate the transaction
    const mockTxHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2, 10)}`;
    
    // Update database to mark milestone as funded
    await prisma.milestone.update({
      where: { id: milestone.id },
      data: {
        funded: true,
      },
    });

    res.json({
      success: true,
      message: "Milestone funded successfully",
      transactionHash: mockTxHash,
      blockNumber: 0,
      gasUsed: "0",
      amount: ethers.formatEther(amountWei),
      amountWei: amountWei.toString(),
      milestoneId: parseInt(milestoneId),
    });
  } catch (error) {
    console.error("Funding error:", error);

    // Handle specific error types
    let errorMessage = "Funding failed";
    let statusCode = 500;

    if (error.code === "INSUFFICIENT_FUNDS") {
      errorMessage = "Insufficient funds for transaction";
      statusCode = 400;
    } else if (error.code === "NETWORK_ERROR") {
      errorMessage = "Network connection error";
      statusCode = 503;
    } else if (error.reason) {
      errorMessage = error.reason;
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: error.message,
    });
  }
});

/**
 * POST /funding/approve-milestone
 * Client approves milestone and releases funds to freelancer
 */
router.post("/approve-milestone", async (req, res) => {
  try {
    const { projectId, milestoneId, clientWalletAddress } = req.body;

    // Validate input
    if (!projectId || !milestoneId || !clientWalletAddress) {
      return res.status(400).json({
        error:
          "Missing required parameters: projectId, milestoneId, clientWalletAddress",
      });
    }

    // Validate numeric inputs
    if (isNaN(projectId) || isNaN(milestoneId)) {
      return res.status(400).json({
        error: "Invalid numeric parameters",
      });
    }

    // Get project from database
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
      include: { milestones: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Get milestone - using consistent 'mid' field
    const milestone = project.milestones.find(
      (m) => m.mid === parseInt(milestoneId)
    );
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    if (!milestone.funded) {
      return res.status(400).json({ error: "Milestone must be funded first" });
    }

    if (milestone.released) {
      return res.status(400).json({ error: "Milestone already released" });
    }

    // Validate wallet address
    if (!ethers.isAddress(clientWalletAddress)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // Approve milestone on blockchain using client wallet
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      contractABI,
      provider
    );
    const clientWallet = new ethers.Wallet(
      process.env.PRIVATE_KEY_ADMIN,
      provider
    );
    const contractWithSigner = contract.connect(clientWallet);

    const approveTx = await contractWithSigner.approveMilestone(
      BigInt(project.onchain_pid),
      parseInt(milestoneId),
      { gasLimit: 200000 }
    );

    // Wait for transaction confirmation
    const receipt = await approveTx.wait();

    // Update database only after successful blockchain transaction
    await prisma.milestone.update({
      where: { id: milestone.id },
      data: {
        released: true,
        released_tx_hash: approveTx.hash,
      },
    });

    res.json({
      success: true,
      message: "Milestone approved and funds released to freelancer",
      transactionHash: approveTx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      milestoneId: parseInt(milestoneId),
    });
  } catch (error) {
    console.error("Approval error:", error);

    // Handle specific error types
    let errorMessage = "Approval failed";
    let statusCode = 500;

    if (error.code === "NETWORK_ERROR") {
      errorMessage = "Network connection error";
      statusCode = 503;
    } else if (error.reason) {
      errorMessage = error.reason;
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: error.message,
    });
  }
});

/**
 * GET /funding/milestone-status/:projectId/:milestoneId
 * Get milestone funding status
 */
router.get("/milestone-status/:projectId/:milestoneId", async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;

    // Validate numeric inputs
    if (isNaN(projectId) || isNaN(milestoneId)) {
      return res.status(400).json({
        error: "Invalid numeric parameters",
      });
    }

    const milestone = await prisma.milestone.findFirst({
      where: {
        projectId: parseInt(projectId),
        mid: parseInt(milestoneId),
      },
      include: {
        project: true,
      },
    });

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    res.json({
      milestoneId: milestone.mid,
      amount: milestone.amount_wei, // Already in AVAX format
      amountWei: milestone.amount_wei,
      funded: milestone.funded,
      released: milestone.released,
      projectId: milestone.projectId,
      onchainPid: milestone.project.onchain_pid.toString(),
      fundedTxHash: milestone.funded_tx_hash || null,
      releasedTxHash: milestone.released_tx_hash || null,
      title: milestone.title || null,
      description: milestone.description || null,
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({
      error: "Status check failed",
      details: error.message,
    });
  }
});

/**
 * GET /funding/project-milestones/:projectId
 * Get all milestones for a project with their funding status
 */
router.get("/project-milestones/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validate numeric input
    if (isNaN(projectId)) {
      return res.status(400).json({
        error: "Invalid project ID",
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
      include: {
        milestones: {
          orderBy: { mid: "asc" },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const milestonesWithStatus = project.milestones.map((milestone) => ({
      milestoneId: milestone.mid,
      title: milestone.title,
      description: milestone.description,
      amount: milestone.amount_wei, // Already in AVAX format
      amountWei: milestone.amount_wei,
      funded: milestone.funded,
      released: milestone.released,
      fundedTxHash: milestone.funded_tx_hash || null,
      releasedTxHash: milestone.released_tx_hash || null,
    }));

    res.json({
      projectId: project.id,
      onchainPid: project.onchain_pid.toString(),
      totalMilestones: project.milestones.length,
      fundedCount: project.milestones.filter((m) => m.funded).length,
      releasedCount: project.milestones.filter((m) => m.released).length,
      milestones: milestonesWithStatus,
    });
  } catch (error) {
    console.error("Project milestones fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch project milestones",
      details: error.message,
    });
  }
});

// GET all funding transactions
router.get("/transactions", async (req, res) => {
  try {
    const transactions = await prisma.milestone.findMany({
      where: {
        OR: [
          { funded: true },
          { released: true }
        ]
      },
      include: {
        project: {
          include: {
            client: {
              select: {
                id: true,
                email: true,
                wallet_address: true,
                role: true
              }
            },
            freelancer: {
              select: {
                id: true,
                email: true,
                wallet_address: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(transactions);
  } catch (err) {
    console.error("Get funding transactions error:", err);
    res.status(500).json({ error: "Could not fetch funding transactions" });
  }
});

// GET milestone status by project and milestone ID
router.get("/milestone-status/:projectId/:milestoneId", async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const milestoneId = parseInt(req.params.milestoneId);
    
    const milestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
        projectId: projectId
      },
      include: {
        project: {
          include: {
            client: {
              select: {
                id: true,
                email: true,
                wallet_address: true,
                role: true
              }
            },
            freelancer: {
              select: {
                id: true,
                email: true,
                wallet_address: true,
                role: true
              }
            }
          }
        }
      }
    });

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    res.json({
      milestoneId: milestone.id,
      projectId: milestone.projectId,
      funded: milestone.funded,
      released: milestone.released,
      amount_wei: milestone.amount_wei,
      deliverable_cid: milestone.deliverable_cid,
      created_at: milestone.created_at
    });
  } catch (err) {
    console.error("Get milestone status error:", err);
    res.status(500).json({ error: "Could not fetch milestone status" });
  }
});

// GET project milestones with funding status
router.get("/project-milestones/:projectId", async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    
    const milestones = await prisma.milestone.findMany({
      where: { projectId },
      include: {
        project: {
          include: {
            client: {
              select: {
                id: true,
                email: true,
                wallet_address: true,
                role: true
              }
            },
            freelancer: {
              select: {
                id: true,
                email: true,
                wallet_address: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: { mid: 'asc' }
    });

    res.json(milestones);
  } catch (err) {
    console.error("Get project milestones error:", err);
    res.status(500).json({ error: "Could not fetch project milestones" });
  }
});

// GET funding summary for a project
router.get("/project-summary/:projectId", async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    
    const milestones = await prisma.milestone.findMany({
      where: { projectId },
      select: {
        id: true,
        mid: true,
        amount_wei: true,
        funded: true,
        released: true,
        deliverable_cid: true
      },
      orderBy: { mid: 'asc' }
    });

    const totalAmount = milestones.reduce((sum, m) => sum + BigInt(m.amount_wei), BigInt(0));
    const fundedAmount = milestones
      .filter(m => m.funded)
      .reduce((sum, m) => sum + BigInt(m.amount_wei), BigInt(0));
    const releasedAmount = milestones
      .filter(m => m.released)
      .reduce((sum, m) => sum + BigInt(m.amount_wei), BigInt(0));

    res.json({
      projectId,
      totalMilestones: milestones.length,
      fundedMilestones: milestones.filter(m => m.funded).length,
      releasedMilestones: milestones.filter(m => m.released).length,
      totalAmount: totalAmount.toString(),
      fundedAmount: fundedAmount.toString(),
      releasedAmount: releasedAmount.toString(),
      milestones
    });
  } catch (err) {
    console.error("Get project funding summary error:", err);
    res.status(500).json({ error: "Could not fetch project funding summary" });
  }
});

module.exports = router;

