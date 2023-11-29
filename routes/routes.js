// routes.js

const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../database/database');

router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));

// Middleware to handle MongoDB connection
router.use(async (req, res, next) => {
    req.db = req.db || (await connectToDatabase());
    next();
  });

// Define routes

router.get('/', (req, res) => {
  res.render('index');
});

// ... (Other routes)

router.get("/todo1", async (req, res) => {
  try {
      const data = await req.db.collection("Work").find({}).toArray();
      if (data.length === 0) {
          console.error("No data found");
          res.status(404).send("Not Found");
          return;
      }

      let currentIndex = data[0].i;
      let nextIndex = (currentIndex % data.length) + 1;

      await req.db.collection("Work").updateOne({ "i": currentIndex }, { $set: { "i": nextIndex } });

      res.json(data[nextIndex - 1]);
      console.log(data[nextIndex - 1]);
  } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
});

router.get('/todo', async (req, res) => {
  try {
      const data = await req.db.collection("Work").find({}).toArray();
      if (data.length === 0) {
          console.error("No data found");
          res.status(404).send("Not Found");
          return;
      }
      let currentIndex = data[0].i;
      let nextIndex = (currentIndex % data.length) + 1;

      await req.db.collection("Work").updateOne({ "i": currentIndex }, { $set: { "i": nextIndex } });

      res.render('todo', { "work": data[nextIndex - 1] });
      console.log(data[nextIndex - 1]);
  } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
});

// ... (Other routes remain unchanged)

router.get('/prev', async (req, res) => {
  try {
      const data = await req.db.collection("Work").find({}).toArray();
      if (data.length === 0) {
          console.error("No data found");
          res.status(404).send("Not Found");
          return;
      }

      let currentIndex = data[0].i;
      let nextIndex = (currentIndex - 1 + data.length) % data.length;

      await req.db.collection("Work").updateOne({ "i": currentIndex }, { $set: { "i": nextIndex } });

      res.render('todo', { "work": data[nextIndex] });
      console.log(data[nextIndex]);
  } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
});
  
  // ... (Other routes remain unchanged)
  router.get('/add', (req, res) => {
      res.render('add');
  });
  router.get('/edit', (req, res) => {
      let k;
      req.db.collection("Work").find({}).toArray().then((data) => {
          k = data;
          let c = k[0].i;
          if(c==1){
              res.render('edit', { "work": k[c] });
          }
          if (c <= k.length) {
              let b=c-1;
              res.render('edit', { "work": k[b] });
          }
      }).catch((err) => {
          console.log(err);
      });
  });
  router.post('/editLink', (req, res) => {
      let Title = req.body.Title;
      let Link = req.body.Link;
      let data = { "Title": Title, "Link": Link };
      req.db.collection("Work").updateOne({ "Title": Title }, { $set: { "Link": Link } }).then(() => {
          console.log("data edited");
          res.redirect('/');
      }).catch((err) => {
          console.log(err);
      });
  });
  router.post('/submit', (req, res) => {
      let Title = req.body.Title;
      let Description = req.body.Description;
      let Link = req.body.Link;
      let data = { "Title": Title, "Description": Description, "Link": Link };
      req.db.collection("Work").insertOne(data).then(() => {
          console.log("data inserted");
          res.redirect('/');
      }).catch((err) => {
          console.log(err);
      });
  });
  router.get('/delete', (req, res) => {
      let k;
      req.db.collection("Work").find({}).toArray().then((data) => {
          k = data;
          let c = k[0].i;
          if(c==1){
              res.render('delete', { "work": k[c] });
          }
          if (c <= k.length) {
              let b=c-1;
              res.render('delete', { "work": k[b] });
          }
      }).catch((err) => {
          console.log(err);
      });
  });
  router.post('/deleteLink', (req, res) => {
      req.db.collection("Work").deleteOne({'Title':req.body.Title}).then(() => {
          console.log("data deleted");
          req.db.collection("WorkDone").insertOne({'Title':req.body.Title,'Description':req.body.Description,'Link':req.body.Link}).then(()=>{
              console.log("data inserted in WorkDone");
          }).catch((err)=>{
              console.log(err);
          });
          res.redirect('/');
      }).catch((err) => {
          console.log(err);
      });
  });
  
  router.post('/afterSomeTime', (req, res) => {
    req.db.collection("Work").deleteOne({'Title':req.body.Title}).then(() => {
        console.log("data deleted");
        req.db.collection("AfterSomeTime").insertOne({'Title':req.body.Title,'Description':req.body.Description,'Link':req.body.Link}).then(()=>{
            console.log("Will do it after some time");
        }).catch((err)=>{
            console.log(err);
        });
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
    });
  });
  
  router.get('/next',(req,res)=>{
    res.redirect("/todo");
  });
  

  
  router.get('/all',(req,res)=>{
    req.db.collection("Work").find({}).toArray().then((data)=>{
      res.render('all',{work:data});
    }).catch((err)=>{
      console.log(err);
    });
  });
  

module.exports = router;