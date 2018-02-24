const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlData = {
  "b2xVn2": {
    shortURL: "b2xVn2",
    longURL : "http://www.lighthouselabs.ca",
    userID : "userRamdomID"
  },
  "9sm5xK": {
    shortURL: "9sm5xK",
    longURL : "http://www.facebook.ca",
    userID : "userRamdom2ID"
  },
  "12334": {
    shortURL: '12334',
    longURL : "http://www.yahoo.ca",
    userID : "userRamdom3ID"
  }
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
  if(req.cookies.userID){
    let user = usersDB[req.cookies.userID]
    let urlsTemp = {}
    for(let key in urlData){
       let checkData = urlData[key]
        if(checkData.userID === user.id){
          urlsTemp[key] = checkData
        }
      };
    let templateVars = {
      urls: urlsTemp,
      user: user
    };
    res.render('pages/urls_index', templateVars);
  } else {
    res.render('pages/home')
  }
});

//loads homoe page
app.get('/home', (req, res) => {
  res.render('pages/home');
});

//loads registration page
app.get('/register', (req, res) => {
  res.render('pages/register');
});

//only renders urls/new if user is logged in
app.get("/urls/new", (req, res) => {
  if(req.cookies.userID){
    let templateVars = {
      urlData: urlData,
      user: usersDB[req.cookies.userID]
    };
    res.render("pages/urls_new", templateVars);
  } else {
    res.render('pages/home')
    }
});

//gets data of url to edit and and renders edit page
app.get("/urls/:shortURL", (req, res) => {
  if(req.cookies.userID){
    let user = usersDB[req.cookies.userID];
    let urlsTemp = {};
    let url = urlData[req.params.shortURL]
    let templateVars = {
      url: url,
      user: user
    };
    console.log('tempvars', templateVars)
    res.render('pages/urls_edit', templateVars)
  } else {
    res.render('pages/home')
    }
});

//ALL POST REQUESTS

//shows original plus new short url
app.post("/urls/:shortURL", (req, res) => {
  console.log(req.params.shortURL)
urlData[req.params.shortURL].longURL = req.body.longURL
  res.redirect('/urls/')
});

//adds new url to database
app.post("/urls/", (req, res) => {
  let shortURL = generateRandomString();
  var tempObject = {};
  tempObject = {
    shortURL: shortURL,
    longURL: req.body.longURL,
    userID: req.cookies.userID
  };
  urlData[shortURL] = tempObject;
  res.redirect(`/urls/`);
});

//deletes element in database
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlData[req.params.shortURL]
  res.redirect('/urls/');
});

//sends to registration form
app.post('/registerform', (req, res) => {
    res.render('pages/register');
});

//generates unique user id and adds data to userDB
app.post('/register', (req, res) => {
  let newID = generateRandomString();
  let newUser = {};
  newUser = {
    id : newID,
    email : req.body.email,
    password : req.body.password
  };
  usersDB[newID] = newUser
  res.redirect('/home');
});
// handles login form

//checks userDB for if user email is found then checks if password is correct
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
      res.cookie('userID', user.id)
      res.redirect('/urls')
    } else {
      res.status(401).send('password not there')
    }
  } else {
    res.status(401).send('user not there')
  }
});

//clears userID cookie and redirects home
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
