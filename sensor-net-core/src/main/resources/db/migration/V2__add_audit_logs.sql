-- Migration to add audit_logs table

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP NOT NULL,
    ip_address VARCHAR(45)
);
