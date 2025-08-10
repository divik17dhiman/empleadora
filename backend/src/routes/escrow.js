const express = require("express");
const { ethers } = require("ethers");
const router = express.Router();

require("dotenv").config();

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI =
  require("../../artifacts/contracts/Escrow.sol/Escrow.json").abi;

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL,
  undefined, // network (auto-detect)
  {
    timeout: 30000, // 30 seconds
    throttleLimit: 1,
    throttleSlotInterval: 100,
  }
);
console.log(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Create a new project

router.post("/create-project", async (req, res) => {
  try {
    const { freelancer, milestoneAmounts } = req.body;

    if (!freelancer || !ethers.isAddress(freelancer)) {
      return res.status(400).json({ error: "Invalid freelancer address" });
    }
    if (
      !Array.isArray(milestoneAmounts) ||
      milestoneAmounts.length === 0 ||
      !milestoneAmounts.every((a) => typeof a === "string")
    ) {
      return res.status(400).json({
        error: "milestoneAmounts must be a non-empty array of strings",
      });
    }

    // Convert milestone amounts strings to BigInt array
    const amountsBigInt = milestoneAmounts.map((a) => BigInt(a));

    // Call createProject on contract
    const tx = await contract.createProject(freelancer, amountsBigInt);
    const receipt = await tx.wait();

    // Extract projectId from emitted event ProjectCreated (index 0)
    const event = receipt.events.find((e) => e.event === "ProjectCreated");
    const projectId = event ? event.args.projectId.toString() : null;

    res.json({
      success: true,
      message: "Project created successfully",
      projectId,
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Fund a milestone
router.post("/fund-milestone", async (req, res) => {
  try {
    const { projectId, milestoneId, amount } = req.body;
    if (!projectId || milestoneId === undefined || !amount) {
      return res
        .status(400)
        .json({ error: "Missing projectId, milestoneId or amount" });
    }

    const weiAmount = ethers.parseEther(amount.toString());

    const tx = await contract.fundMilestone(
      ethers.BigNumber.from(projectId),
      ethers.BigNumber.from(milestoneId),
      { value: weiAmount }
    );
    const receipt = await tx.wait();

    res.json({ success: true, txHash: receipt.transactionHash });
  } catch (error) {
    console.error("Fund milestone error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Approve a milestone
router.post("/approve-milestone", async (req, res) => {
  try {
    const { projectId, milestoneId } = req.body;
    if (!projectId || milestoneId === undefined) {
      return res
        .status(400)
        .json({ error: "Missing projectId or milestoneId" });
    }

    const tx = await contract.approveMilestone(
      ethers.BigNumber.from(projectId),
      ethers.BigNumber.from(milestoneId)
    );
    const receipt = await tx.wait();

    res.json({ success: true, txHash: receipt.transactionHash });
  } catch (error) {
    console.error("Approve milestone error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Raise dispute on a project
router.post("/raise-dispute", async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ error: "Missing projectId" });
    }

    const tx = await contract.raiseDispute(ethers.BigNumber.from(projectId));
    const receipt = await tx.wait();

    res.json({ success: true, txHash: receipt.transactionHash });
  } catch (error) {
    console.error("Raise dispute error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Refund a milestone after dispute
router.post("/refund-milestone", async (req, res) => {
  try {
    const { projectId, milestoneId } = req.body;
    if (!projectId || milestoneId === undefined) {
      return res
        .status(400)
        .json({ error: "Missing projectId or milestoneId" });
    }

    const tx = await contract.refundMilestone(
      ethers.BigNumber.from(projectId),
      ethers.BigNumber.from(milestoneId)
    );
    const receipt = await tx.wait();

    res.json({ success: true, txHash: receipt.transactionHash });
  } catch (error) {
    console.error("Refund milestone error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
