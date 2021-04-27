const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

app.route("/")
.get((req,res)=>{
    res.send("<h1> Hello World!</h1>");
});

const PORT = process.env.PORT ? process.env.PORT : 3001;

app.listen(PORT, () =>{console.log(`Running server on ${PORT}`);});