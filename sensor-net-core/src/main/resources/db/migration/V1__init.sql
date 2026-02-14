-- Initial Schema Migration

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    roles VARCHAR(255) NOT NULL
);

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    location VARCHAR(100),
    status VARCHAR(20),
    last_seen TIMESTAMP
);

CREATE TABLE telemetry_data (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    telemetry_key VARCHAR(50) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMP NOT NULL
);

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    message TEXT NOT NULL,
    severity VARCHAR(20),
    timestamp TIMESTAMP NOT NULL,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE alert_rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    telemetry_key VARCHAR(50) NOT NULL,
    operator VARCHAR(10) NOT NULL,
    threshold DOUBLE PRECISION NOT NULL,
    severity VARCHAR(20),
    enabled BOOLEAN DEFAULT TRUE
);
