#  Health Clinic Management System  
A full-stack web application designed to streamline medical clinic operations. This system manages interactions between **Patients**, **Doctors**, and **Administrators**, handling everything from user registration to appointment scheduling.

---

##  Features

* **Role-Based Access Control:** Distinct dashboards and permissions for Admins, Doctors, and Patients.  
* **User Authentication:** Secure login and registration using hashed passwords (`bcrypt`).  
* **Appointment Management:**  
  * **Patients:** Search doctors and book appointments.  
  * **Doctors:** View schedules and patient details.  
  * **Admins:** Oversee users and system data.  
* **Search Functionality:** Easily filter doctors and records.  
* **Security:** Input validation & sanitization to prevent web attacks.

---

##  Tech Stack & Dependencies

**Backend:** Node.js (Express v5.x)  
**Database:** MySQL (`mysql2` driver)  
**Frontend:** EJS templates  

### Key Dependencies
- `bcrypt` — secure password hashing  
- `express-session` — user session management  
- `express-sanitizer` — XSS prevention  
- `express-validator` — input validation  
- `dotenv` — environment configuration  
- `body-parser` — request body parsing  
- `request` — external HTTP calls  
- `pug` — optional templating engine  

---

##  Project Structure

```
├── public/              # Static files (CSS, images)
├── routes/              # Express route handlers
│   ├── admin.js         # Admin routes
│   ├── appointments.js  # Appointment handling
│   ├── doctors.js       # Doctor routes
│   ├── main.js          # General routes
│   ├── patient.js       # Patient routes
│   └── users.js         # User & auth routes
├── views/               # EJS templates
│   ├── dashboard_*.ejs  # Role dashboards
│   ├── login.ejs        # Login page
│   ├── register.ejs     # Registration page
│   └── search.ejs       # Search interface
├── create_db.sql        # Database schema setup
├── insert_test_data.sql # Sample data
├── index.js             # App entry point
└── .env                 # Env variables
```

---

##  Installation & Setup

### **1. Install Dependencies**
```
npm install
```

### **2. Database Setup**

Run in this order:

**A. Create database & tables**
```
sudo mysql < create_db.sql
```

**B. Insert test data**
```
sudo mysql < insert_test_data.sql
```

### **3. Configure `.env`**
Ensure correct DB credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clinic_db
```

### **4. Start the Application**
```
node index.js
```

Visit: **http://localhost:8000**

---

##  Test Accounts

| Role | Email | Password |
|------|--------|-----------|
| Admin | admin@gold.ac.uk | (see SQL file) |
| Doctor | house@clinic.com | (see SQL file) |
| Patient | john@gmail.com | (see SQL file) |
