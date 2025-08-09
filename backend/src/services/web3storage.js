const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch"); // if not installed: npm install node-fetch

const IPFS_API = "http://127.0.0.1:5001/api/v0/add"; // local IPFS API

async function uploadFile(filePath) {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const response = await fetch(IPFS_API, {
    method: "POST",
    body: formData,
    // 🔹 Needed for Node.js >= 18 when sending FormData
    duplex: "half"
  });

  const data = await response.json();
  return data.Hash; // CID
}

module.exports = { uploadFile };
