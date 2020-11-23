require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const secret_session = process.env.SECRET_SESSION;

console.log(secret_session);

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

//secret: given to used on the site as a session cookie
//resave: saves session even if it is modified (when true)
//saveUninitialized: if new session, we save it (when true)
const sessionObj = {
    secret: secret_session,
    resave: false,
    saveUninitialized: true
}
app.use(session(sessionObj))


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.use('/auth', require('./routes/auth'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;