const app = require('./app');

// const express = require('express');
// const app = express();
require('dotenv').config();
const { connectDatabase, getDB } = require('./src/config/connectDB');
const port = process.env.PORT || 5000;


// app.use(express.json());


connectDatabase();
// const uri = "mongodb://localhost:27017";
// const client = new MongoClient(uri);

// async function run() {
//   try {
//     const database = client.db('server');
//     const userCollection = database.collection('user');

//     app.post('/register',async (req,res) => {
//         const user = req.body;
//         console.log(user)
//         await userCollection.insertOne(user)
//     })

//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
    
//   }
// }
// run().catch(console.dir);



app.get('/', (req, res) => {
    console.log('server is running');
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});