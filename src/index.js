const envConfig = {
  path: process.env.NODE_ENV === "production" ? "prod.env" : ".env",
};
require("dotenv").config(envConfig);
const express = require('express')
require('./db/mongoose')
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
// const cookieSession = require("cookie-session")
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user')
const problemRoutes = require('./routes/problem')
const bodyParser = require("body-parser");




const app = express()
const port = process.env.PORT || 5000
const path = require("path");
// * Passport Setup
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: `${process.env.CLIENT_URL}`, credentials: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser(process.env.SECRET_KEY));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport-config");

// app.use(cookieSession({
//    maxAge:24 * 60 * 60 * 1000,
//    keys: [process.env.COOKIE_KEY],
// }))


app.use(userRoutes)
app.use(problemRoutes)


app.listen(port, ()=>{
    console.log('Server is running on ' + port)
})


// * Production setup
if (process.env.NODE_ENV === "production") {
  console.log("prod");
  app.use(express.static(path.resolve(__dirname, "../client/build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
  });

  process.on("uncaughtException", (err, promise) => {
    console.log(`Error: ${err.message}`);
  });
}
