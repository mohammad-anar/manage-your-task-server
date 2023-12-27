const express = require("express");
// CORS
const cors = require("cors");
// DOT ENV
require("dotenv").config();
// MONGO DB
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// MAKE APP
const app = express();
// running port
const port = process.env.PORT || 5001;

// middle ware
app.use(cors());
app.use(express.json());

// mongodb connection uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zav38m0.mongodb.net/?retryWrites=true&w=majority`;

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
    
    const db = client.db("task-management-db")



    const taskCollection = db.collection("tasks");

    //  task api's =========================
    app.get("/tasks", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });

    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result)
    })
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await taskCollection.deleteOne({_id: new ObjectId(id)})
      res.send(result)
    })
    app.patch("/tasks", async (req, res) => {
      const id = req?.query?.id ;
      const status = req?.query?.status;
      const query = {_id: new ObjectId(id)}
      const result = await taskCollection.updateOne(query, {$set:{status: status}});
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    
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
  res.send("Task server is running! ");
});

app.listen(port, () => {
  console.log(`Task server is running in PORT: ${port}`);
});
