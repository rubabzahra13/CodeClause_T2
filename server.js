const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const app = express();

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://localhost/url-shortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("MongoDB connected successfully.");
});

// Define a URL schema for the MongoDB collection
const urlSchema = new mongoose.Schema({
  longURL: String,
  shortURL: String,
});

const URL = mongoose.model("URL", urlSchema);

const mongoURI =
  "mongodb+srv://aaleehaider:aaleehaider@mernstack.4sdqbjt.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the MongoDB Atlas server
    await client.connect();
    console.log("Connected to MongoDB Atlas.");

    // Define a MongoDB database and collection
    const database = client.db("urlshort"); // Replace with your actual database name
    const collection = database.collection("short"); // Replace with your actual collection name

    // Create a short URL
    app.post("/api/shorten", async (req, res) => {
      const longURL = req.body.longURL;
      const shortURL = shortid.generate();

      // Save the URL in the database
      const urlEntry = new URL({ longURL, shortURL });

      // Save to MongoDB Atlas collection
      const result = await collection.insertOne(urlEntry.toObject());

      if (result && result.insertedId) {
        res.json({ shortURL });
      } else {
        res.status(500).send("Failed to create a short URL.");
      }
    });
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close(); // You might want to close the client when the server stops
  }
}

run().catch(console.dir);

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to the URL shortener!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`URL shortener is running on port ${PORT}`);
});
