const fs = require('fs');
const express = require('express');
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;

// Use environment variables for sensitive information
const mongoConnectionString = "mongodb+srv://ankur1037:Ankurqwerty2003@cluster0.apokfz1.mongodb.net/?retryWrites=true&w=majority";

let dbInstance;

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

MongoClient.connect(mongoConnectionString)
  .then((client) => {
    dbInstance = client.db("Globe");
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process on database connection error
  });

app.get('/', (req, res) => {
  res.render('index');
});

app.get("/todo1", async (req, res) => {
  try {
    const data = await dbInstance.collection("Work").find({}).toArray();
    let currentIndex = data[0].i;
    let nextIndex = (currentIndex % data.length) + 1;

    await dbInstance.collection("Work").updateOne({ "i": currentIndex }, { $set: { "i": nextIndex } });

    res.json(data[nextIndex - 1]);
    console.log(data[nextIndex - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/todo', async (req, res) => {
  try {
    const data = await dbInstance.collection("Work").find({}).toArray();
    let currentIndex = data[0].i;
    let nextIndex = (currentIndex % data.length) + 1;

    await dbInstance.collection("Work").updateOne({ "i": currentIndex }, { $set: { "i": nextIndex } });

    res.render('todo', { "work": data[nextIndex - 1] });
    console.log(data[nextIndex - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// ... (Other routes remain unchanged)
app.get('/add', (req, res) => {
    res.render('add');
});
app.get('/edit', (req, res) => {
    let k;
    dbinstance.collection("Work").find({}).toArray().then((data) => {
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
app.post('/editLink', (req, res) => {
    let Title = req.body.Title;
    let Link = req.body.Link;
    let data = { "Title": Title, "Link": Link };
    dbinstance.collection("Work").updateOne({ "Title": Title }, { $set: { "Link": Link } }).then(() => {
        console.log("data edited");
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
    });
});
app.post('/submit', (req, res) => {
    let Title = req.body.Title;
    let Description = req.body.Description;
    let Link = req.body.Link;
    let data = { "Title": Title, "Description": Description, "Link": Link };
    dbinstance.collection("Work").insertOne(data).then(() => {
        console.log("data inserted");
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
    });
});
app.get('/delete', (req, res) => {
    let k;
    dbinstance.collection("Work").find({}).toArray().then((data) => {
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
app.post('/deleteLink', (req, res) => {
    dbinstance.collection("Work").deleteOne({'Title':req.body.Title}).then(() => {
        console.log("data deleted");
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
    });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Close MongoDB connection on process termination
process.on('SIGINT', () => {
  dbInstance.close();
  process.exit();
});
