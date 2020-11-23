const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

//POST 
router.post('/signup', (req, res) => {
    db.user.findOrCreate({
        where: { email: req.body.body },
        defaults: { name: req.body.name, password: req.body.password }
    }).then(([user, created]) => {
        if (created) {
            //redirect to home
            console.log(user.name, ' created')
            passport.authenticate('local', {
                successRedirect: '/',
                successFlash: 'Account created'
            })(req, res);
        } else {
            //already have an exsiting account
            req.flash('error', 'Account already exists for this email')
            res.redirect('/auth/signup');
        }
    }).catch(err => console.log(err))
})

module.exports = router;