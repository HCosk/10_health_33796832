const express = require('express');
const router = express.Router();

const requirePatient = (req, res, next) => {
    if (req.session && req.session.userId && req.session.role === 'patient') {
        next();
    } else {
        res.redirect('/users/login');
    }
};

router.get('/dashboard', requirePatient, function(req, res, next) {
    
    const sqlDoctors = "SELECT * FROM users WHERE role = 'doctor' AND status = 'active'";

    db.query(sqlDoctors, function(err, doctors) {
        if (err) return next(err);

        const sqlAppointments = `
            SELECT appointments.*, users.first_name AS doc_first, users.last_name AS doc_last 
            FROM appointments 
            JOIN users ON appointments.doctor_id = users.id 
            WHERE appointments.patient_id = ?
        `;

        db.query(sqlAppointments, [req.session.userId], function(err, appointments) {
            if (err) return next(err);


            res.render('dashboard_patient', { 
                doctors: doctors,
                appointments: appointments, 
                patientName: req.session.name 
            });
        });
    });
});

module.exports = router;
