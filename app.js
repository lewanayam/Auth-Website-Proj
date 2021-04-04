//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = {
  email: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("home");
});

app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(function (req, res) {
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({ email: email }, function (err, userFound) {
      if (err) {
        console.log(err);
      } else {
        if (userFound.password === password) {
          res.render("secrets");
        } else {
          console.log("Wrong Password");
        }
      }
    });
  });

app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser.save(function (err) {
      if (err) {
        console.log("Sorry, There was a problem with Registeration");
        console.log(err);
      } else {
        res.render("secrets");
        console.log("Registeration was successfull");
      }
    });
  });

app.get("/logout", function (req, res) {
  res.render("home");
});

app.listen(3000, function (req, res) {
  console.log("Server has started on port 3000");
});
