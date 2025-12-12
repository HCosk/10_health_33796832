const express = require('express');
const router = express.Router();

const requireDoctor = (req, res, next) => {
    if (req.session && req.session.userId && req.session.role === 'doctor') {
        next();
    } else {
        res.redirect('/users/login');
    }
};

// GET /doctors/search
router.get('/search', function(req, res, next) {
    let searchTerm = req.query.q || ''; 
    
    let sql = "SELECT * FROM users WHERE role = 'doctor'";
    let params = [];

    if (searchTerm) {
        sql += " AND (first_name LIKE ? OR last_name LIKE ?)";
        params = [`%${searchTerm}%`, `%${searchTerm}%`];
    }

    db.query(sql, params, function(err, rows) {
        if (err) return next(err);

        const formattedResults = rows.map(user => ({
            name: `${user.first_name} ${user.last_name}`,
            specialty: user.specialty || 'General Practice', 
            bio: user.email 
        }));

        res.render("search.ejs", { 
            query: searchTerm,   
            results: formattedResults 
        });
    });
});

// GET /doctors/dashboard
router.get('/dashboard', requireDoctor, function(req, res, next) {
    const doctor_id = req.session.userId;
    
    const { date, search } = req.query;

    let sql = `
        SELECT appointments.id, appointments.appointment_datetime, appointments.reason, appointments.status,
               users.first_name, users.last_name
        FROM appointments
        JOIN users ON appointments.patient_id = users.id
        WHERE appointments.doctor_id = ?
    `;

    const params = [doctor_id];

    if (date) {
        sql += " AND DATE(appointment_datetime) = ?";
        params.push(date);
    }
    if (search) {
        sql += " AND (users.first_name LIKE ? OR users.last_name LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY appointment_datetime DESC";

    db.query(sql, params, function(err, results) {
        if (err) return next(err);

        const now = new Date();
        const upcoming = [];
        const past = [];

        results.forEach(app => {
            const appDate = new Date(app.appointment_datetime);
            
            const formattedApp = {
                ...app,
                dateStr: appDate.toISOString().split('T')[0],
                timeStr: appDate.toTimeString().split(' ')[0].substring(0,5)
            };

            if (app.status === 'completed' || app.status === 'cancelled' || appDate < now) {
                past.push(formattedApp);
            } else {
                upcoming.push(formattedApp);
            }
        });

        res.render('dashboard_doctor', { 
            doctorName: req.session.name,
            upcoming: upcoming,
            past: past,
            query: req.query 
        });
    });
});



// Handle Status Changes (Approve, Cancel, Complete)
router.post('/appointment/update', function(req, res, next) {
    const { appointment_id, new_status } = req.body;

    const sql = "UPDATE appointments SET status = ? WHERE id = ?";
    
    db.query(sql, [new_status, appointment_id], function(err, result) {
        if (err) return next(err);
        
        res.redirect('../doctors/dashboard');
    });
});


module.exports = router;
