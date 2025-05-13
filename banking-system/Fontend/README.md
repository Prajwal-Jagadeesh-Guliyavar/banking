
# BankHive - Full Stack Banking Application

BankHive is a comprehensive banking web application with a React frontend and a Flask backend. This application provides user authentication, account management, transactions, loan applications, and more.

## Features

- **User Authentication**: Register, login, and secure account management
- **Dashboard**: Overview of account balances, recent transactions, and financial summaries
- **Transactions**: View transaction history, make deposits and withdrawals
- **Profile Management**: Update user information and settings
- **Loan System**: Apply for different types of loans, view active loans and applications
- **Responsive Design**: Full mobile and desktop support

## Technologies Used

### Frontend
- React (JavaScript/JSX)
- React Router for navigation
- Tailwind CSS for styling
- shadcn/ui component library
- Recharts for data visualization
- Lucide icons

### Backend
- Flask (Python)
- SQLite3 database
- SQL features including views and triggers for data management

## Project Structure

```
bankhive/
├── frontend/       # React frontend
│   ├── public/     # Static assets
│   └── src/        # Source files
├── backend/        # Flask backend
│   ├── app.py      # Main application file
│   ├── models/     # Database models
│   ├── routes/     # API routes
│   └── banking.db  # SQLite database
└── README.md       # Project documentation
```

## Setup and Installation

### Prerequisites
- Node.js and npm
- Python 3.7+
- Git

### Backend Setup
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/bankhive.git
   cd bankhive/backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```
   python init_db.py
   ```

5. Run the Flask server:
   ```
   flask run
   ```
   
   The backend will be available at http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd ../frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   
   The frontend will be available at http://localhost:8080

## Backend API Documentation

The backend provides the following API endpoints:

### Authentication
- `POST /api/register`: Register a new user
- `POST /api/login`: Login a user and get JWT token

### User Management
- `GET /api/user`: Get user details
- `PUT /api/profile`: Update user profile information
- `PUT /api/profile/password`: Change user password

### Transactions
- `GET /api/transactions`: List user transactions
- `POST /api/transactions`: Create a new transaction
- `GET /api/transactions/:id`: Get details of a specific transaction

### Loans
- `GET /api/loans`: List active loans
- `POST /api/loan/apply`: Submit a new loan application
- `GET /api/loan/applications`: List loan applications

## Database Schema

The SQLite database (`banking.db`) includes the following tables:

- **Users**: User account information
- **Accounts**: Bank accounts linked to users
- **Transactions**: Record of all financial transactions
- **Loans**: Active loans
- **LoanApplications**: Submitted loan applications

### Views
- **account_balances**: Shows current balance for each account
- **transaction_summary**: Monthly transaction summaries

### Triggers
- **update_balance**: Updates account balances after transactions
- **audit_trail**: Maintains an audit log of important changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.
