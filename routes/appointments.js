const express = require('express');
const router = express.Router();

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/users/login');
    }
};

//get booking form
router.get('/book', requireLogin, function(req, res, next) {
    const sql = "SELECT id, first_name, last_name, specialty FROM users WHERE role = 'doctor'";
    
    db.query(sql, function(err, results) {
        if (err) return next(err);

        const doctorList = results.map(doc => ({
            id: doc.id,
            name: `${doc.first_name} ${doc.last_name}`,
            specialty: doc.specialty || 'General'
        }));

        res.render('book_appointment', { doctors: doctorList });
    });
});

//precess booking
router.post('/book', requireLogin, function(req, res, next) {
    // Get data from the form
    const { doctor_id, date, time, reason } = req.body;
    const patient_id = req.session.userId;

    // Combine date and time into one string for MySQL (YYYY-MM-DD HH:MM:SS)
    const appointment_datetime = `${date} ${time}:00`;

    const sql = `
        INSERT INTO appointments 
        (patient_id, doctor_id, appointment_datetime, reason, status) 
        VALUES (?, ?, ?, ?, 'pending')
    `;

    db.query(sql, [patient_id, doctor_id, appointment_datetime, reason], function(err, result) {
        if (err) return next(err);


        res.redirect('/patient/dashboard');
    });
});

module.exports = router;
