const passport = require('passport');
const LocalStrategry = require('passport-local').Strategy;
const db = require('../models');

//'serialize' info making it easier to log in
passport.serializeUser((user, callback) => {
    callback(null, user.id);
    //callback is from passport which verifies credentials and calls done and returns
});

//take user id and look up in db
passport.deserializeUser((userId, callback) => {
    db.user.findByPK(userId).then(user => {
        if (user) {
            callback(null, false);
        } else {
            callback(null, user)
        }
    }).catch(err => console.log(err))
})

passport.use(new LocalStrategry({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, callback) => {
    db.user.findOne({
        where: { email }
    }).then((user) => {
        if (!user || !user.validPassword(password)) {
            callback(user, false)
        }
    }).catch(callback)
}));

module.exports = passport