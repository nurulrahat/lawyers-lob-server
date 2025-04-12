require('dotenv').config()
const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port =5000;
const cors= require('cors')
const bodyParser = require('body-parser')
const ObjectId=require('mongodb').ObjectId;
app.use(bodyParser.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hi7wk.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
client.connect(err => {
  const serviceCollection = client.db("lawyersLobbying").collection("services");
  const bookingCollection = client.db("lawyersLobbying").collection("bookings");
  const reviewCollection = client.db("lawyersLobbying").collection("reviews");
  const adminCollection = client.db("lawyersLobbying").collection("admins");


  // app.get("/services",(req, res) =>{
  //   serviceCollection.find()
  //   .toArray((err, items) =>{
  //     console.log(items)
  //     res.send(items)
  //     console.log("this service api")
  //   })
  // })

  app.get("/services", (req, res) => {
    serviceCollection.find().toArray((err, items) => {
      if (err) {
        console.error('❌ MongoDB query failed:', err);
        return res.status(500).send('Failed to fetch services');
      }
      console.log('✅ Services fetched:', items); // <-- See what it logs
      res.send(items);
    });
  });
  
  app.post("/admin",(req, res)=>{
    const service =req.body;
    console.log(service)
    serviceCollection.insertOne(service)
    .then(result=>{
      res.send(result.insertedCount>0)
      // console.log("inserted count",result)
    })

    // console.log('adding new service: ',service)
  })

  app.delete('/delete/:id',(req, res)=>{
    // console.log(req.params.id);
    serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
      console.log(result)
      res.send(result.deletedCount>0)
    })
  })

  app.get("/book/:id",(req, res) =>{
    serviceCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err, items) =>{
      console.log(items[0])
      res.send(items[0])
    })
  })
  //bookingsCollectionInsertion

  app.post("/insertBooking",(req, res)=>{
    const bookingService =req.body;
    bookingCollection.insertOne(bookingService)
    .then(result=>{
      res.send(result.insertedCount>0)
      console.log("inserted count",result)
    })
  })

  app.get("/bookedData",(req, res) =>{
    bookingCollection.find({email:req.query.eml})
    .toArray((err, items) =>{
      console.log("this is booked data")
      res.send("this is booked data")
    })
  })
  //add review 

  app.post("/addreview",(req, res)=>{
    const reviewData =req.body;
   reviewCollection.insertOne(reviewData)
    .then(result=>{
      res.send(result.insertedCount>0)
      console.log("inserted count",result)
    })
  })

  //get dynamic reviews
  app.get("/reviewsData",(req, res) =>{
    reviewCollection.find()
    .toArray((err, items) =>{
      res.send(items)
      console.log("this is ok")
    })
  })

  //add admin
  app.post("/addAdmin",(req, res)=>{
    const adminData =req.body;
    adminCollection.insertOne(adminData)
    .then(result=>{
      res.send(result.insertedCount>0)
      console.log("inserted count",result)
    })
  })
  
  //get admin
  app.get("/adminEmail",(req, res) =>{
    adminCollection.find({email:req.query.eml})
    .toArray((err, items) =>{
      res.send(items)
      
      
    })
  })

});


app.get('/', (req, res) => {
    res.send('Sever is Running!')
    console.log("this is home")
  })
  
  app.listen(process.env.PORT || port)
  