// database.js

const { MongoClient } = require('mongodb');

const mongoConnectionString = "mongodb+srv://ankur1037:Ankurqwerty2003@cluster0.apokfz1.mongodb.net/?retryWrites=true&w=majority";

let dbInstance;

async function connectToDatabase() {
  if (!dbInstance) {
    try {
      const client = await MongoClient.connect(mongoConnectionString);
      dbInstance = client.db("Globe");
      console.log("Connected to the database");
    } catch (err) {
      console.error("Error connecting to the database:", err);
      process.exit(1); // Exit the process on database connection error
    }
  }

  return dbInstance;
}

module.exports = { connectToDatabase };