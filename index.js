// Setup express and ejs
require('dotenv').config();
var express = require ('express')
var session = require ('express-session')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2');

// Define the database connection pool
const db = mysql.createConnection({
    host: process.env.HEALTH_HOST,     
    user: process.env.HEALTH_USER,       
    password: process.env.HEALTH_PASSWORD, 
    database: process.env.HEALTH_DATABASE 
});
global.db = db;


// Create the express application object
const app = express()
const port = 8000

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser 
app.use(express.urlencoded({ extended: true }));
// Define our application-specific data

app.locals.Data = {Name: "Hakan's Clinic"}

// Load the route handlers
const mainRoutes = require("./routes/main");  
app.use('/', mainRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

const doctorsRoutes = require("./routes/doctors");
app.use("/doctors", doctorsRoutes);

const appointmentsRoutes = require("./routes/appointments");
app.use("/appointments", appointmentsRoutes);

const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes);

const patientRoutes = require('./routes/patient');
app.use('/patient', patientRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
