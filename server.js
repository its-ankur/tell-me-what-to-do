const fs = require('fs');
const express = require('express');
const schedule = require('node-schedule');
const client = require("mongodb").MongoClient;
const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
let dbinstance;
client.connect("mongodb+srv://ankur1037:Ankurqwerty2003@cluster0.apokfz1.mongodb.net/?retryWrites=true&w=majority").then((server) => {
    dbinstance = server.db("Globe");
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});
app.get('/', (req, res) => {
    let k;
    dbinstance.collection("Work").find({}).toArray().then((data) => {
        k = data;
        let b;
        let c = k[0].i;
        if (c <= k.length - 1) {
            b = c;
            c++;
            res.render('index', { "work": k[b] });
            //console.log(k[b]);
            // schedule.scheduleJob('Work-a', '*/2 * * * * *', () => {
            //     b = c;
            //     c++;
            //     res.render('index', { "work": k[b] });
            //     //schedule.cancelJob('Work-a');
            //     dbinstance.collection("Work").updateOne({ "i": b }, { $set: { "i": c } });
            //});
        }
        else if (c > k.length - 1) {
            b = c;
            c = 1;
            res.render('index', { "work": k[c] });
            //console.log(k[c]);
        }
        dbinstance.collection("Work").updateOne({ "i": b }, { $set: { "i": c } });
    }).catch((err) => {
        console.log(err);
    });
});
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
        // else if (c > k.length - 1) {;
        //     c=1;
        //     res.render('edit', { "work": k[c] });
        // }
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
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});