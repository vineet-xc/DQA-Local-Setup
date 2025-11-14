-- Initialize databases for DQA microservices

-- Create separate databases for each service
CREATE DATABASE dqa_users;
CREATE DATABASE dqa_data;
CREATE DATABASE dqa_auth;

-- Create users for each service
CREATE USER dqa_user WITH ENCRYPTED PASSWORD 'password';
CREATE USER dqa_data WITH ENCRYPTED PASSWORD 'password';
CREATE USER dqa_auth WITH ENCRYPTED PASSWORD 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE dqa_users TO dqa_user;
GRANT ALL PRIVILEGES ON DATABASE dqa_data TO dqa_data;
GRANT ALL PRIVILEGES ON DATABASE dqa_auth TO dqa_auth;

-- Connect to each database and grant schema privileges
\c dqa_users;
GRANT ALL ON SCHEMA public TO dqa_user;

\c dqa_data;
GRANT ALL ON SCHEMA public TO dqa_data;

\c dqa_auth;
GRANT ALL ON SCHEMA public TO dqa_auth;