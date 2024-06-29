const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gumuqu0.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("layean_blog");
    const categories = database.collection("categories");
    const authors = database.collection("authors");
    const posts = database.collection("posts");

    app.get("/categories", async (req, res) => {
      const cursor = categories.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/authors", async (req, res) => {
      const cursor = authors.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/posts", async (req, res) => {
      const cursor = posts.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await posts.findOne(query);
      res.send(result);
    });

    app.post("/categories", async (req, res) => {
      const data = req.body;
      const result = await categories.insertOne(data);
      res.send(result);
    });
    app.post("/posts", async (req, res) => {
      const data = req.body;
      const result = await posts.insertOne(data);
      res.send(result);
    });

    app.post("/authors", async (req, res) => {
      const data = req.body;
      const result = await authors.insertOne(data);
      res.send(result);
    });

    app.delete("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await posts.deleteOne(query);
      res
        .status(200)
        .send({ success: true, deletedCount: result.deletedCount });
    });

    app.delete("/authors/:id", async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await authors.deleteOne(query);
      res
        .status(200)
        .send({ success: true, deletedCount: result.deletedCount });
      
    });

    app.delete("/categories/:id", async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await categories.deleteOne(query);
      res
        .status(200)
        .send({ success: true, deletedCount: result.deletedCount });
      
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
