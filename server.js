const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const route = require("./route");

mongoose
  .connect("mongodb://localhost:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected successfully"))
  .catch((err) => console.log("error Occured while connecting" + err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/chat", route);

const server = app.listen(5000, () =>
  console.log(`Server started on port 5000`)
);
module.exports = server;
