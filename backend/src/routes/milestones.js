const express = require("express");
const prisma = require("../config/db");
const { uploadFile } = require("../services/web3storage");
const router = express.Router();

// Upload deliverable & mark DB
router.post("/:id/deliver", async (req, res) => {
  try {
    const { file } = req.body; // base64 or path for hackathon
    const cid = await uploadFile(file);

    const milestone = await prisma.milestone.update({
      where: { id: parseInt(req.params.id) },
      data: { deliverable_cid: cid }
    });

    res.json({ milestone, cid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
