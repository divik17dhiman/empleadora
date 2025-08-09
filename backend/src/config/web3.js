const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");

// Admin signer for refund (server only)
const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY_ADMIN, provider);

const escrowAbi = require("../../artifacts/contracts/Escrow.sol/Escrow.json").abi;
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, escrowAbi, provider);

module.exports = { provider, adminWallet, contract };
