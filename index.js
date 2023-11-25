const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khqul4z.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const surveyCollection = client.db("survey").collection("allSurveys");
    const userCollection = client.db("survey").collection("users");

    //users data

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.patch('/users', async (req, res) => {
      const role = req.query.role
      const id = req.query.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: role,
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })


    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //All surveys
    app.get("/allSurveys", async (req, res) => {
      const result = await surveyCollection.find().toArray();
      res.send(result);
    });
    app.post("/allSurveys", async (req, res) => {
      const { title, description, category, options, likeDislike } = req.body;
      const timestamp = new Date();
      const newSurvey = {
        title,
        description,
        category,
        options,
        likeDislike,
        like: 0, // Initialize like to 0
        dislike: 0, // Initialize dislike to 0
        timestamp,
      };
      const result = await surveyCollection.insertOne(newSurvey);
      res.json({ insertedId: result.insertedId });
    });



    // Send a ping to confirm a successful connection
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
  res.send("Survey are going");
});

app.listen(port, () => {
  console.log(`Survey are going ${port}`);
});
