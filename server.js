var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("pages/urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {shortURL: urlDatabase};
  res.render("pages/urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
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
