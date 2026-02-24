const { MongoClient } = require('mongodb');
let Database;

const connectDatabase = async () => {
    const uri = "mongodb://localhost:27017"; 

    const client = new MongoClient(uri);

    try {
        // await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        Database = client.db('SrinivasServer'); 
        return Database;
    } catch (err) {
        console.error("MongoDB have some  error", err);
        // process.exit(1); 
    }
};

const getDB = () => {
    if (!Database) {
        throw new Error('database is not connected');
    }
    return Database;
};

module.exports = { connectDatabase, getDB };