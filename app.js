var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var grant = require("grant-express");
const request = require("request");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("oauthValues", {});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// //oauth authentication
// app.use(session({ secret: "grant", saveUninitialized: true, resave: true }));
// app.use(grant(require("./config.json")));
// app.get("/hello", (req, res) => {
//   res.end(JSON.stringify(req.query, null, 2));
// });
// app.get("/hi", (req, res) => {
//   res.end(JSON.stringify(req.query, null, 2));
// });

// app.get("/khan", (req, res) => {
//   console.log(req.body);
//   res.send(JSON.stringify(req.query.oauth_token_secret, null, 2));
// });

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
