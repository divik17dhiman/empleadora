const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Get all applications for a freelancer
router.get("/freelancer/:freelancerId", async (req, res) => {
  try {
    const { freelancerId } = req.params;
    const applications = await prisma.projectApplication.findMany({
      where: { freelancerId: parseInt(freelancerId) },
      include: {
        project: {
          include: {
            client: { select: { id: true, email: true, wallet_address: true } }
          }
        }
      }
    });
    
    // Convert BigInts to strings for safe JSON
    const safeApplications = JSON.parse(JSON.stringify(applications, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));
    
    res.json(safeApplications);
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ error: "Could not fetch applications" });
  }
});

// Get all applications for a project
router.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const applications = await prisma.projectApplication.findMany({
      where: { projectId: parseInt(projectId) },
      include: {
        freelancer: { select: { id: true, email: true, wallet_address: true } }
      }
    });
    
    // Convert BigInts to strings for safe JSON
    const safeApplications = JSON.parse(JSON.stringify(applications, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));
    
    res.json(safeApplications);
  } catch (err) {
    console.error("Get project applications error:", err);
    res.status(500).json({ error: "Could not fetch project applications" });
  }
});

// Create a new application
router.post("/", async (req, res) => {
  try {
    const { projectId, freelancerId, proposal, bid_amount } = req.body;
    
    if (!projectId || !freelancerId || !proposal || !bid_amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if freelancer already applied to this project
    const existingApplication = await prisma.projectApplication.findFirst({
      where: {
        projectId: parseInt(projectId),
        freelancerId: parseInt(freelancerId)
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied to this project" });
    }

    const application = await prisma.projectApplication.create({
      data: {
        projectId: parseInt(projectId),
        freelancerId: parseInt(freelancerId),
        proposal,
        bid_amount
      },
      include: {
        project: {
          include: {
            client: { select: { id: true, email: true, wallet_address: true } }
          }
        },
        freelancer: { select: { id: true, email: true, wallet_address: true } }
      }
    });

    // Convert BigInts to strings for safe JSON
    const safeApplication = JSON.parse(JSON.stringify(application, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));

    res.json(safeApplication);
  } catch (err) {
    console.error("Create application error:", err);
    res.status(500).json({ error: "Could not create application" });
  }
});

// Update application status (accept/reject)
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['ACCEPTED', 'REJECTED', 'WITHDRAWN'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await prisma.projectApplication.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        project: {
          include: {
            client: { select: { id: true, email: true, wallet_address: true } }
          }
        },
        freelancer: { select: { id: true, email: true, wallet_address: true } }
      }
    });

    // If application is accepted, update project status and assign freelancer
    if (status === 'ACCEPTED') {
      await prisma.project.update({
        where: { id: application.projectId },
        data: {
          status: 'IN_PROGRESS',
          freelancerId: application.freelancerId
        }
      });
    }

    // Convert BigInts to strings for safe JSON
    const safeApplication = JSON.parse(JSON.stringify(application, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));

    res.json(safeApplication);
  } catch (err) {
    console.error("Update application status error:", err);
    res.status(500).json({ error: "Could not update application status" });
  }
});

module.exports = router;
