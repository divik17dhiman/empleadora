const express = require("express");
const prisma = require("../config/db");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { onchain_pid, client_wallet, freelancer_wallet, amounts_wei } = req.body;

    if (!Array.isArray(amounts_wei)) {
      return res.status(400).json({ error: "amounts_wei must be an array" });
    }

    let client = await prisma.user.upsert({
      where: { wallet_address: client_wallet },
      update: {},
      create: { wallet_address: client_wallet, role: "client" }
    });

    let freelancer = await prisma.user.upsert({
      where: { wallet_address: freelancer_wallet },
      update: {},
      create: { wallet_address: freelancer_wallet, role: "freelancer" }
    });

    const project = await prisma.project.create({
      data: {
        onchain_pid: BigInt(onchain_pid),
        clientId: client.id,
        freelancerId: freelancer.id,
        milestones: {
          create: amounts_wei.map((amt, idx) => ({
            mid: idx,
            amount_wei: amt
          }))
        }
      },
      include: { milestones: true }
    });

    // Convert BigInts to strings for safe JSON
    const safeProject = JSON.parse(JSON.stringify(project, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));

    res.json(safeProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create project" });
  }
});


module.exports = router;
