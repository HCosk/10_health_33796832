# Insert data into the tables

USE health;

INSERT INTO users (first_name, last_name, email, phone_number, age, role, status, password_hash)
VALUES (
    'System', 
    'Admin', 
    'admin@gold.ac.uk', 
    '+440000000000', 
    20, 
    'admin', 
    'active', 
    '$2a$10$3xXiFFRjy/DXYiLhS9RLB.FCDEaQaZbdw4xqXKmMSAT8H1A9LGoJ.'
);


-- DOCTORS
INSERT INTO users (first_name, last_name, email, phone_number, age, password_hash, role, status)
VALUES 
(
    'Gregory', 
    'House', 
    'house@clinic.com', 
    '555-0101', 
    52, 
    '$2a$10$3xXiFFRjy/DXYiLhS9RLB.FCDEaQaZbdw4xqXKmMSAT8H1A9LGoJ.',
    'doctor', 
    'active'
),
(
    'Meredith', 
    'Grey', 
    'grey@clinic.com', 
    '555-0102', 
    40, 
    '$2a$10$3xXiFFRjy/DXYiLhS9RLB.FCDEaQaZbdw4xqXKmMSAT8H1A9LGoJ.', 
    'doctor', 
    'active'
    ),
(
    'Stephen', 
    'Strange', 
    'strange@clinic.com', 
    '555-0103', 
    45, 
    '$2a$10$3xXiFFRjy/DXYiLhS9RLB.FCDEaQaZbdw4xqXKmMSAT8H1A9LGoJ.', 
    'doctor', 
    'pending'
    );

-- PATIENTS
INSERT INTO users (first_name, last_name, email, phone_number, age, password_hash, role, status)
VALUES 
(
    'John', 
    'Doe', 
    'john@gmail.com', 
    '555-0201', 
    25, 
    '$2a$10$3xXiFFRjy/DXYiLhS9RLB.FCDEaQaZbdw4xqXKmMSAT8H1A9LGoJ.', 
    'patient', 
    'active'
),
(
    'Alice', 
    'Smith', 
    'alice@gmail.com', 
    '555-0202', 
    30, 
    '$2a$10$3xXiFFRjy/DXYiLhS9RLB.FCDEaQaZbdw4xqXKmMSAT8H1A9LGoJ.', 
    'patient', 
    'active'
);

-- insert appointments

-- Appointment 1
INSERT INTO appointments (patient_id, doctor_id, appointment_datetime, reason, status)
VALUES (
    (SELECT id FROM users WHERE email='john@gmail.com'),
    (SELECT id FROM users WHERE email='house@clinic.com'),
    '2023-11-15 09:00:00', 
    'Severe leg pain', 
    'completed'
);

-- Appointment 2
INSERT INTO appointments (patient_id, doctor_id, appointment_datetime, reason, status)
VALUES (
    (SELECT id FROM users WHERE email='alice@gmail.com'),
    (SELECT id FROM users WHERE email='grey@clinic.com'),
    '2024-12-25 14:30:00', 
    'Consultation for surgery', 
    'pending'
);

-- Appointment 3
INSERT INTO appointments (patient_id, doctor_id, appointment_datetime, reason, status)
VALUES (
    (SELECT id FROM users WHERE email='john@gmail.com'),
    (SELECT id FROM users WHERE email='grey@clinic.com'),
    '2023-12-01 10:00:00', 
    'Follow up checkup', 
    'cancelled'
);