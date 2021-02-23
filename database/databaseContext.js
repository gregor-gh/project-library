const config = require("./config");
const CosmosClient = require("@azure/cosmos").CosmosClient;

// Ensure database is setup and populated correctly
async function create(client, databaseId, containerId) {
    const partitionKey = config.partitionKey;

    // create database if not exists
    const { database } = await client.databases.createIfNotExists({
        id: databaseId
    });

    // Create container if not exists
    const { container } = await client
        .database(databaseId)
        .containers.createIfNotExists(
            { id: containerId, partitionKey },
            { offerThroughput: 400 }
        );
}

module.exports = { create };