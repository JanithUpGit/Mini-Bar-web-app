// backend/api/index.js
const serverless = require("serverless-http");
const app = require("../app"); // Express app instance එක import කිරීම

// ✅ serverless handler එක export කිරීම
module.exports.handler = serverless(app);