const fs = require("fs");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const seedTopics = async () => {
  try {
    // Read the JSON file and transform ObjectIds
    const rawData = fs.readFileSync(path.join(__dirname, "topic-seeds.json"), "utf-8");
    const seedData = JSON.parse(rawData, (key, value) => {
      if (value && value.$oid) {
        return new ObjectId(value.$oid);
      }
      return value;
    });

    // Connect to MongoDB
    const client = await MongoClient.connect(
      "mongodb://localhost:27017/convosense-api",
    );
    const db = client.db("convosense-api");
    const collection = db.collection("aitopics");

    // Clear existing data
    await collection.deleteMany({});

    // Insert seed data
    await collection.insertMany(seedData);

    console.log("Topics seeded successfully");
    client.close();
  } catch (error) {
    console.error("Error seeding topics:", error);
    throw error;
  }
};

seedTopics();
