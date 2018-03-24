const express = require("express");
const PORT = process.env.PORT || 8080;
const cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const app = express();
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2', 'key3'],
    maxAge: 2 * 60 * 60 * 1000
}));

//database of urls by key of shortURL
let urlData = {
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

//database of users by userID
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

app.get('/', (req, res)=>{
  res.render('pages/urls_home')
})
//ALL GET REQUESTS
app.get('/urls', (req, res) => {
  if(req.session.userID){
    let user = usersDB[req.session.userID]
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
    res.render('pages/urls_home')
  }
});

//loads home page
app.get('/tinyApp', (req, res) => {
  res.render('pages/urls_home');
});

//loads registration page
app.get('/register', (req, res) => {
  res.render('pages/register');
});

//only renders urls/new if user is logged in
app.get("/urls/new", (req, res) => {
  if(req.session.userID){
    let templateVars = {
      urlData: urlData,
      user: usersDB[req.session.userID]
    };
    res.render("pages/urls_new", templateVars);
  } else {
    res.render('pages/urls_home')
    }
});

//gets data of url to edit and and renders edit page
app.get("/urls/:shortURL", (req, res) => {
  if(req.session.userID){
    let user = usersDB[req.session.userID];
    let urlsTemp = {};
    let url = urlData[req.params.shortURL]
    let templateVars = {
      url: url,
      user: user
    };
    res.render('pages/urls_edit', templateVars)
  } else {
    res.render('pages/urls_home')
    }
});

//redirects to the longURL
app.get("/u/:shortURL", (req, res) => {
 let url = urlData[req.params.shortURL]
 let longURL = url.longURL
 res.redirect(longURL)
});

//ALL POST REQUESTS

//sends to registration form
app.post('/registerform', (req, res) => {
    res.render('pages/register');
});

//generates unique user id and adds data to userDB
//saves userID, email and password. used bcrypt to hash the password
app.post('/register', (req, res) => {
  let newID = generateRandomString();
  let newUser = {};
  const password = req.body.password
  newUser = {
    id : newID,
    email : req.body.email,
    password :  bcrypt.hashSync(password, 10)
  };
  req.session.userID = newID
  usersDB[newID] = newUser
  res.redirect('/urls');
});

//checks userDB for if user email is found then checks if password is correct
//if all is correct then it redirects to the index page where they can see their urls
app.post("/login", (req, res) => {
  let user;
  for (let userID in usersDB){
    const usrChek = usersDB[userID]
    if(usrChek.email === req.body.email){
        user = usrChek
        break
    }
  }
  if(user){
    if(bcrypt.compareSync(req.body.password, user.password,)){
      req.session.userID = user.id
      res.redirect('/urls')
    } else {
      res.status(401).send('password not there')
    }
  } else {
    res.status(401).send('user not there')
  }
});

//clears userID session and redirects home
app.post("/logout", (req, res) => {
  let username = req.body.email
  res.session = null
  res.status(302).redirect('http://localhost:8080/tinyApp/');
});

//adds new url to database
app.post("/urls/", (req, res) => {
  let shortURL = generateRandomString();
  var tempObject = {};
  tempObject = {
    shortURL: shortURL,
    longURL: req.body.longURL,
    userID: req.session.userID
  };
  urlData[shortURL] = tempObject;
  res.redirect(`/urls/`);
});

//shows original plus new short url
app.post("/urls/:shortURL", (req, res) => {
  urlData[req.params.shortURL].longURL = req.body.longURL
  res.redirect('/urls/')
});

//deletes element in database
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlData[req.params.shortURL]
  res.redirect('/urls/');
});

//generates random number for hash generator
function generateRandomString() {
  let randNum = Math.floor(Math.random() * 6969696969).toString();
    return randNum.hashCode();
};

//generates hash code with the input provided by the RNG above
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
