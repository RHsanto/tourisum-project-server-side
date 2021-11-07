var express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;
var cors = require('cors')
var app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhafc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

  try {
    await client.connect();
    const database = client.db("touroffers");
    const offersCollection = database.collection("offers");
    const database2 = client.db("travelers")
    const orderCollection = database2.collection("orders");

  //ADD OFFERS COLLECTION 
    app.post('/offers', async (req,res) => {
      const offer = req.body;
      const result = await offersCollection.insertOne(offer);
      res.json( result)
    })

    // GET API OFFERS
   app.get('/offers', async (req,res)=>{
    const cursor = offersCollection.find({});
    const offers = await cursor.toArray();
    res.send(offers);

   });

   // GET SINGLE OFFERS
   app.get('/offers/:id', async (req,res)=>{
     const id = req.params.id;
     const query = {_id: ObjectId(id)};
     const booking = await offersCollection.findOne(query)
   res.json(booking);
   });


 

    // GET API ORDERS
    app.get('/orders', async (req,res)=>{
      const cursor = orderCollection.find({})
      const orders = await cursor.toArray();
      res.send(orders);

     });

      //DELETE API ORDERS
    app.delete('/orders/:id', async(req,res)=>{
      const id     = req.params.id;
      const query  = {_id:ObjectId(id)} ;
      const result = await orderCollection.deleteOne(query)
      res.json(result);
     })

     // UPDATE STATUS 
     app.put('/orders/:id', async(req,res)=>{
       const id = req.params.id;
       const filter ={_id: ObjectId(id)}
       const option = {upsert : true};
       const updateStatus ={
         $set:{
           status: 'approved',
         },
       };

       const result = await orderCollection.updateOne(filter,updateStatus,option);
       res.json(result)
     })

    // GET LOGGED USER ORDERS
    app.get('/orders/:email', async (req,res)=>{
      const result = await orderCollection.find({email: req.params.email}).toArray();
      res.json(result)
    })

    //POST API ORDERS
    app.post('/orders', async (req,res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json( result)
    })

   
  } finally {
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
  res.send('Running is Coming with Data base on MongoDb')
})

app.listen(port,()=>{
  console.log('Running Server on port',port);
})
