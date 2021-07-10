const app = require('../app');
const mongoose = require("mongoose");
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

const port = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`server is running on ${port}`);
});
    