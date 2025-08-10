const express = require("express");
const prisma = require("../config/db");
const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
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
        },
        milestones: true
      }
    });

    // Convert BigInts to strings for safe JSON
    const safeProjects = JSON.parse(JSON.stringify(projects, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));

    res.json(safeProjects);
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ error: "Could not fetch projects" });
  }
});

// GET available projects for freelancers (OPEN status)
router.get("/available", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: 'OPEN'
      },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            wallet_address: true,
            role: true
          }
        },
        applications: {
          include: {
            freelancer: {
              select: {
                id: true,
                email: true,
                wallet_address: true
              }
            }
          }
        }
      }
    });

    // Convert BigInts to strings for safe JSON
    const safeProjects = JSON.parse(JSON.stringify(projects, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));

    res.json(safeProjects);
  } catch (err) {
    console.error("Get available projects error:", err);
    res.status(500).json({ error: "Could not fetch available projects" });
  }
});

// GET project by ID
router.get("/:id", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
        },
        milestones: true
      }
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Convert BigInts to strings for safe JSON
    const safeProject = JSON.parse(JSON.stringify(project, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));

    res.json(safeProject);
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ error: "Could not fetch project" });
  }
});

// GET projects by user wallet address
router.get("/user/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { client: { wallet_address: walletAddress } },
          { freelancer: { wallet_address: walletAddress } }
        ]
      },
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
        },
        milestones: true
      }
    });

    // Convert BigInts to strings for safe JSON
    const safeProjects = JSON.parse(JSON.stringify(projects, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));

    res.json(safeProjects);
  } catch (err) {
    console.error("Get user projects error:", err);
    res.status(500).json({ error: "Could not fetch user projects" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { 
      onchain_pid, 
      client_wallet, 
      title, 
      description, 
      budget, 
      skills, 
      amounts_wei 
    } = req.body;

    if (!Array.isArray(amounts_wei)) {
      return res.status(400).json({ error: "amounts_wei must be an array" });
    }

    // Check if client exists
    let client = await prisma.user.findUnique({
      where: { wallet_address: client_wallet }
    });

    if (!client) {
      return res.status(400).json({ error: "Client user not found. Please register first." });
    }

    const project = await prisma.project.create({
      data: {
        onchain_pid: BigInt(onchain_pid),
        title: title || `Project #${Date.now()}`,
        description: description || 'Project description',
        budget: budget || '1000000000000000000',
        skills: skills || [],
        status: 'OPEN',
        clientId: client.id,
        milestones: {
          create: amounts_wei.map((amt, idx) => ({
            mid: idx,
            amount_wei: amt
          }))
        }
      },
      include: { 
        client: { select: { id: true, email: true, wallet_address: true } },
        milestones: true 
      }
    });

    // Convert BigInts to strings for safe JSON
    const safeProject = JSON.parse(JSON.stringify(project, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));

    res.json(safeProject);
  } catch (err) {
    console.error("Project creation error:", err);
    console.error("Request body:", req.body);
    res.status(500).json({ error: "Could not create project", details: err.message });
  }
});

module.exports = router;
