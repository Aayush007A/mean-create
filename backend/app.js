const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const path = require("path");

const app = express();

mongoose.connect("mongodb+srv://Ronaldo:a7b7e777@cluster0.k1roqv4.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(()=>{
    console.log("Connected to Database!!");
})
.catch(()=>{
    console.log("Connection Fialed !!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");

    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");

    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");

    next();
});

app.use("/api/posts",postsRoutes);

module.exports = app;

  