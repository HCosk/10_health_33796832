// Setup express and ejs
var express = require ('express')
var ejs = require('ejs')

require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.HEALTH_HOST,
  user: process.env.HEALTH_USER,
  password: process.env.HEALTH_PASSWORD,
  database: process.env.HEALTH_DATABASE
});

connection.connect(err => {
  if (err) throw err;
  console.log("Connected to DB");
});

// Create the express application object
const app = express()
const port = 8000

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Load the route handlers
const mainRoutes = require("./routes/main");  
app.use('/', mainRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
