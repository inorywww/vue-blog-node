const app = require('../app');
const mongoose = require("mongoose");
const marked = require("marked");
const fs = require('fs');

// mongodb connect
const DB_URL = require("../config/keys").mongoURI;
mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on("error", (error) => {
      console.error(error);
    });
    db.once("open", () => {
      console.log("Database connect");
    });

// fs.readFile('public/articles/mdFile/python.md','utf-8',(err, data) => {
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(data);
//         // str = marked(data.toString());
//         // console.log(str)
//     }
// })

const port = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`server is running on ${port}`);
});


    