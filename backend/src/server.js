// Load environment variables from the .env file.
require("dotenv").config();

// Import the configured Express app.
const app = require("./app");

// Use the port from .env, or fallback to 5000.
const PORT = process.env.PORT || 5000;

// Start the backend server and listen for incoming requests.
app.listen(PORT, () => {
  console.log(`Work Zone backend running on port ${PORT}`);
});
