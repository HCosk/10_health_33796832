const express = require('express');
const router = express.Router();


// Middleware: Ensure user is Admin
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
        next();
    } else {
        res.redirect('/users/login');
    }
};

//dahboard get
router.get('/dashboard', requireAdmin, function(req, res, next) {
    const searchTerm = req.query.search || ''; 
    const searchWildcard = `%${searchTerm}%`;

    const sqlPending = "SELECT * FROM users WHERE role = 'doctor' AND status = 'pending'"; 
    
    const sqlUsers = `
        SELECT * FROM users 
        WHERE role IN ('doctor', 'patient') 
        AND status = 'active'
        AND (first_name LIKE ? OR last_name LIKE ?)
        ORDER BY role, first_name`;

    const sqlAppointments = `
        SELECT 
            appointments.id, 
            appointments.appointment_datetime, 
            appointments.reason, 
            appointments.status,
            patient.first_name AS patient_first, 
            patient.last_name AS patient_last,
            doctor.first_name AS doctor_first, 
            doctor.last_name AS doctor_last
        FROM appointments
        JOIN users AS patient ON appointments.patient_id = patient.id
        JOIN users AS doctor ON appointments.doctor_id = doctor.id
        WHERE 
            patient.first_name LIKE ? OR patient.last_name LIKE ?
            OR doctor.first_name LIKE ? OR doctor.last_name LIKE ?
        ORDER BY appointment_datetime DESC`;

    db.query(sqlPending, function(err, pendingDoctors) {
        if (err) return next(err);
        
        db.query(sqlUsers, [searchWildcard, searchWildcard], function(err, allUsers) {
            if (err) return next(err);

            db.query(sqlAppointments, [searchWildcard, searchWildcard, searchWildcard, searchWildcard], function(err, allAppointments) {
                if (err) return next(err);

                const doctors = allUsers.filter(u => u.role === 'doctor');
                const patients = allUsers.filter(u => u.role === 'patient');

                const formattedApps = allAppointments.map(app => {
                    const d = new Date(app.appointment_datetime);
                    return {
                        ...app,
                        dateStr: d.toISOString().split('T')[0],
                        timeStr: d.toTimeString().split(' ')[0].substring(0,5)
                    };
                });

                res.render('dashboard_admin', {
                    pending: pendingDoctors, 
                    doctors: doctors,
                    patients: patients,
                    appointments: formattedApps,
                    search: searchTerm
                });
            });
        });
    });
});

//aprove doctor
router.post('/approve-doctor', requireAdmin, function(req, res, next) {
    const doctorId = req.body.user_id;

    const sql = "UPDATE users SET status = 'active' WHERE id = ?";
    db.query(sql, [doctorId], function(err, result) {
        if (err) return next(err);
        res.redirect('/admin/dashboard');
    });
});

//reject doctor
router.post('/reject-doctor', requireAdmin, function(req, res, next) {
    const doctorId = req.body.user_id;

    // Delete the user request entirely
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [doctorId], function(err, result) {
        if (err) return next(err);
        res.redirect('/admin/dashboard');
    });
});

//update user
router.post('/update-user', requireAdmin, function(req, res, next) {
    const { user_id, first_name, last_name, email } = req.body;
    
    const sql = "UPDATE users SET first_name=?, last_name=?, email=? WHERE id=?";
    db.query(sql, [first_name, last_name, email, user_id], function(err, result) {
        if (err) return next(err);
        res.redirect('/admin/dashboard');
    });
});

//delete user
router.post('/delete-user', requireAdmin, function(req, res, next) {
    const userId = req.body.user_id;

    // Delete their appointments first to avoid foreign key errors
    const sqlApps = "DELETE FROM appointments WHERE patient_id = ? OR doctor_id = ?";
    
    db.query(sqlApps, [userId, userId], function(err) {
        if (err) return next(err);

        // Now delete the user
        const sqlUser = "DELETE FROM users WHERE id = ?";
        db.query(sqlUser, [userId], function(err) {
            if (err) return next(err);
            res.redirect('/admin/dashboard');
        });
    });
});

//update appointment
router.post('/update-appointment', requireAdmin, function(req, res, next) {
    const { app_id, date, time, reason, status } = req.body;
    const fullDateTime = `${date} ${time}`;
    
    const sql = "UPDATE appointments SET appointment_datetime=?, reason=?, status=? WHERE id=?";
    db.query(sql, [fullDateTime, reason, status, app_id], function(err, result) {
        if (err) return next(err);
        res.redirect('/admin/dashboard');
    });
});

module.exports = router;
