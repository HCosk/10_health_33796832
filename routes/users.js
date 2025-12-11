const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;



// Middleware to protect routes
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); 
    } else {
        next(); 
    }
};

//register get
router.get('/register', function(req, res, next) {
    res.render('register.ejs'); 
});

//register post
router.post('/register', function(req, res, next) {
    const { first_name, last_name, email, password, role } = req.body;

    let status = 'active';
    if (role === 'doctor') {
        status = 'pending';
    }

    bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
        if (err) return next(err);

        const sql = `INSERT INTO users (first_name, last_name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, [first_name, last_name, email, hashedPassword, role, status], function(err, result) {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.send("Error: This email is already registered. <a href='/users/register'>Try again</a>");
                }
                return next(err);
            }

            res.redirect('/users/login');
        });
    });
});

//register render
router.get('/login', function (req, res, next) {
    res.render('login.ejs', { error: undefined });
});

//handle login
router.post('/login', function (req, res, next) {
    const email = req.body.email; 
    const password = req.body.password;

    const sqlquery = "SELECT * FROM users WHERE email = ?";
    
    db.query(sqlquery, [email], function(err, results) {
        if (err) return next(err);

        if (results.length === 0) {
            return res.render('login.ejs', { error: "Login failed: Email not found." });
        }

        const user = results[0];

        bcrypt.compare(password, user.password_hash, function(err, match) {
            if (err) return next(err);

            if (match) {
                if (user.status === 'pending') {
                    return res.render('login.ejs', { 
                        error: "Login failed: Your account is awaiting admin approval." 
                    });
                }

                req.session.userId = user.id;
                req.session.role = user.role; 
                req.session.name = user.first_name;

                if (user.role === 'admin') {
                    res.redirect('/admin/dashboard');
                } 
                else if (user.role === 'doctor') {
                    res.redirect('/doctors/dashboard'); 
                } 
                else if (user.role === 'patient'){
                    res.redirect('/patient/dashboard'); 
                }
                else {
                    res.redirect('/'); 
                }
                
            } else {
                res.render('login.ejs', { error: "Login failed: Incorrect password." });
            }
        });
    });
});


//logout get
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('./');
        res.send('You are now logged out. <a href="/">Home</a>');
    });
});

module.exports = router;
