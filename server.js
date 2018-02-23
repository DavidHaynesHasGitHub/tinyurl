const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


let usersDB = {
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
//ALL GET REQUESTS
app.get('/urls', (req, res) => {
  let userID = req.cookies.userID
    let templateVars = {
         urlDatabase: urlDatabase,
         user: usersDB[userID]
      };

  res.render('pages/urls_index', templateVars);
});

app.get('/home', (req, res) => {
  res.render('pages/home');
});

app.get('/register', (req, res) => {
  console.log('REGISTER PAGE RENDERED')
  res.render('pages/register');
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
       urlDatabase: urlDatabase,
       usersDB: usersDB
     };
  res.render("pages/urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
        shortURL: req.params.shortURL,
        urlDatabase: urlDatabase,
        username: req.cookies.username
    };
  res.render('pages/urls_edit', templateVars)
});

//ALL POST REQUESTS

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

app.post('/registerform', (req, res) => {
    res.render('pages/register');
});

app.post('/register', (req, res) => {
  let newID = generateRandomString();
  let newUser = {};
  newUser = {
    id : newID,
    email : req.body.email,
    password : req.body.password
  };
  res.cookie('userID', newUser.id)
  usersDB[newID] = newUser
  res.redirect('/home');
});
// handles login form

app.post("/login", (req, res) =>{
  let user;
  for (let userID in usersDB){
    const usrChek = usersDB[userID]
    if(usrChek.email === req.body.email){
        user = usrChek
        break
    }
  }
  if(user){
    if(user.password === req.body.password){
      console.log('IT WORKED', user)
      res.cookie('userID', user.id)
      res.redirect('/urls')
    } else {
      res.status(401).send('password not there')
    }
  } else {
    res.status(401).send('user not there')
  }

});

app.post("/logout", (req, res) =>{
  let username = req.body.email
  res.clearCookie('userID')
  res.redirect("/home");
});

//generates random number for hash generator
function generateRandomString() {
  let rando = Math.floor(Math.random() * 6969696969).toString();
    return rando.hashCode();
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

//this is on the login branch weFCAWEVWAevawevq
