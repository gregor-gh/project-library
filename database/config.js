require("dotenv").config()

const config = {
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
  databaseId: "FreeCodeCamp",
  containerId: "Library",
  partitionKey: {kind: "Hash", paths: ["/title"]}
};

module.exports = config
