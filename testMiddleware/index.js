const express = require('express');
const app = express();



app.use( (req, res, next) =>{
    req.time = new Date(Date.now()).toString();
    console.log(req.method, req.time)
    next()
})

app.use('/api', (req,res,next)=>{
    let {token} = req.query;
    if (token === 'giveacess'){
        next()
    }
    else{
        throw new Error("Access Denied")
    }
})

app.listen(8080, (req,res)=>{
    console.log("Connected to port 8080")
})

app.get('/', (req,res)=>{
    res.send('<H1>Welcome to the Home Page</H1>')
})

app.get('/api', (req,res)=>{
    res.send('<h1>Access Granted !!</h1>')
})

app.use((req,res)=>{
    res.status(404).send("Page not found - Error: 404")
})


