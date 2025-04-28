# Banking Management System

A full-stack banking application with Flask backend and React frontend.

## Features
- Customer account management
- Transaction processing
- User authentication
- Admin dashboard
- Account overview

## Project Structure
banking-system/
- backend/       # Flask API (Python)
- frontend/      # React Application
- .gitignore
- README.md



## Installation

### Backend Setup
```bash
cd banking-system/backend
python -m venv venv
source venv/bin/activate  # Linux/MacOS
venv\Scripts\activate    # Windows

pip install -r requirements.txt
python create_tables.py
python run.py

### Frontend Setup
cd banking-system/frontend
npm install
npm start

##Technologies

    Python/Flask

    React.js

    SQLAlchemy

    Alembic (Migrations)

    JWT Authentication
