const fs=require('fs');
const express=require('express');
const app=express();
app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
});
app.post('/do',(req,res)=>{
    let data=fs.readFileSync(__dirname+'/public/data.json');
    let q=JSON.parse(data);
    let k; 
    //console.log(data[0].i+"data[0].i");
    if(q[0].i<q.length-1){
        //k=data[0];
        k=q[0].i;
        q[0].i++;
        //console.log(data[0].i+"data[0].i");
    }
    else if(q[0].i>=q.length-1){
        q[0].i=1;
    }
    //console.log(data.length);
    let a=q[0].i;
    //console.log(k+"data[k].value");
    fs.writeFileSync("public/data.json",JSON.stringify(q));
    //console.log(k);
    console.log(a);
    res.send(q[a]);
    console.log(q[a]);
});
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});