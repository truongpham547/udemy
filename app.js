var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var app = express();
var dotenv = require("dotenv");
var fs = require("fs");
var cors = require("cors");
var bodyParser = require("body-parser");
// var upload = require("express-fileupload");
var expressValidator = require('express-validator');



dotenv.config();
app.use(
  cors({ credentials: true, origin: true, exposedHeaders: ["auth-token"] })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use(upload());

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use("/", indexRouter);

//connect mongodb

const { URL_DB_LOCAL, URL_DB_SERVER } = process.env;

mongoose.connect(
  `${URL_DB_LOCAL}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log("connect fail");
      console.log(err);
    } else {
      console.log("connected to mongodb");
    }
  }
);

app.listen(9000, () => {
  console.log("server is running on port 9000");
});

module.exports = app;
