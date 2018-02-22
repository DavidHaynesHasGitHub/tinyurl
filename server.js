var express = require("express");
var app = express();
var express = require('express')
var cookieParser = require('cookie-parser')
var PORT = process.env.PORT || 8080;

var app = express()
app.use(cookieParser())

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.get('/urls', (req, res) => {
  let templateVars = {
       urlDatabase: urlDatabase,
       username: req.cookies.usernameCookie
     };
     console.log(templateVars.username)
  res.render('pages/urls_index', templateVars);
});


app.get('/register', (req, res){
  res.render('pages/register')
})
app.get("/urls/new", (req, res) => {
  let templateVars = {
       urlDatabase: urlDatabase,
       username: req.cookies.usernameCookie
     };
  res.render("pages/urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
        shortURL: req.params.shortURL,
        urlDatabase: urlDatabase,
        username: req.cookies.usernameCookie
    };
  res.render('pages/urls_edit', templateVars)
});

//shows original plus new short url
app.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect('/urls')
});

//adds new url to database
app.post("/urls/", (req, res) => {
  let shortURL = generateRandomString();
   urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/`);
});

//deletes element in database
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls/');
});


// handles login form
app.post("/login", (req, res) =>{
  let username = req.body.username
  res.cookie('usernameCookie', username)
  res.redirect("/urls");
});

app.post("/logout", (req, res) =>{
  let username = req.body.username
  res.clearCookie('usernameCookie')
  res.redirect("/urls");
});

//generates random number for hash generator
function generateRandomString() {
  let rando = Math.floor(Math.random() * 6969696969).toString();
    return rando.hashCode()
};

//generates hash code
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(32);
};


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//this is on the login branch saasdfawef
