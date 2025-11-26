// 2. server.js
const express = require('express')
const cors = require('cors') 
const path = require('path');


const userRouter = require("./routes/user");
const feedRouter = require("./routes/feed");
const app = express()
app.use(cors({
    origin : "*",
    credentials : true
}))
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//router영역

app.use("/user", userRouter);
app.use("/feed", feedRouter);


app.listen(3015, ()=>{
    console.log("server start!");
})