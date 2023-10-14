const fs = require('fs');
const express = require('express');
const client = require("mongodb").MongoClient;
const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
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
        if (k[1].i < k.length - 1) {
            b = k[1].i;
            k[1].i++;
            res.render('index', { data: k[b] });
        }
        else if (k[1].i >= k.length - 1) {
            b = 2;
            res.render('index', { data: k[b] });
        }
        // dbinstance.collection("Work").updateOne({ $set: { "i": b } });
    }).catch((err) => {
        console.log(err);
    });
    // let b;
    // //console.log(k+"data[0].i");
    // if(k[1]<k.length-1){
    //     //k=data[0];
    //     b=k[1];
    //     k[1]++;
    //     console.log(k[1]+"data[0].i");
    // }
    // else if(q[0].i>=q.length-1){
    //     q[0].i=1;
    // }
    // //console.log(data.length);
    // let a=q[0].i;
    // //console.log(k+"data[k].value");
    // fs.writeFileSync("public/data.json",JSON.stringify(q));
    // //console.log(k);
    // console.log(a);
    // res.send(q[a]);
    // console.log(q[a]);
    // res.render('index');
});
// app.post('/do',(req,res)=>{
//     let data=fs.readFileSync(__dirname+'/public/data.json');
//     let q=JSON.parse(data);
//     let k; 
//     //console.log(data[0].i+"data[0].i");
//     if(q[0].i<q.length-1){
//         //k=data[0];
//         k=q[0].i;
//         q[0].i++;
//         //console.log(data[0].i+"data[0].i");
//     }
//     else if(q[0].i>=q.length-1){
//         q[0].i=1;
//     }
//     //console.log(data.length);
//     let a=q[0].i;
//     //console.log(k+"data[k].value");
//     fs.writeFileSync("public/data.json",JSON.stringify(q));
//     //console.log(k);
//     console.log(a);
//     res.send(q[a]);
//     console.log(q[a]);
// });
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});