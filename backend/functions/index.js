const functions = require("firebase-functions");
const app = require("../app"); // import your Express app

// Export Express app as Firebase Function
exports.api = functions.https.onRequest(app);
