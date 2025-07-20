// server-test.js
require("dotenv").config();
const http = require("http");

// Set a timeout to exit after a few seconds, since we just want to test startup
setTimeout(() => {
  console.log("✅ Server startup test complete");
  process.exit(0);
}, 5000);

// Import the server with minimal initialization
try {
  console.log("🚀 Testing server initialization...");
  console.log("(This will exit automatically after 5 seconds)");

  // Import server.js which should initialize Express and the routes
  const app = require("./server");

  // Start the server on a random port
  const port = 0; // 0 = random available port
  const server = http.createServer(app);

  server.on("error", (error) => {
    console.error("❌ Server startup error:", error.message);
    process.exit(1);
  });

  server.listen(port, () => {
    const actualPort = server.address().port;
    console.log(`✅ Server started successfully on port ${actualPort}`);
  });
} catch (error) {
  console.error("❌ Failed to initialize server:", error);
  process.exit(1);
}
