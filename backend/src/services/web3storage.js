const { Web3Storage, File } = require("web3.storage");
const fs = require("fs");
require("dotenv").config();

const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });

async function uploadFile(filePath) {
  const file = await fs.promises.readFile(filePath);
  const files = [new File([file], filePath)];
  const cid = await client.put(files);
  return cid;
}

module.exports = { uploadFile };
