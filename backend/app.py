
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import os
import sqlite3
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity
import bcrypt

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080"],  # Adjust to your React app's URL
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configuration
app.config["JWT_SECRET_KEY"] = "bank-hive-secret-key"  # Change this in production!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt = JWTManager(app)

# Database helper functions
def get_db_connection():
    conn = sqlite3.connect('banking.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize the database
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Accounts table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        account_number TEXT UNIQUE NOT NULL,
        account_type TEXT NOT NULL,
        balance REAL NOT NULL DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')

    # Transactions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        merchant TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts (id)
    )
    ''')

    # Loans table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS loans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        loan_type TEXT NOT NULL,
        amount REAL NOT NULL,
        interest_rate REAL NOT NULL,
        term_months INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')

    # Loan Applications table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS loan_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        loan_type TEXT NOT NULL,
        amount REAL NOT NULL,
        purpose TEXT,
        income REAL,
        employment_status TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')

    # Create a view for account balances
    cursor.execute('''
    CREATE VIEW IF NOT EXISTS account_balances AS
    SELECT
        a.id,
        a.user_id,
        a.account_number,
        a.account_type,
        a.balance
    FROM accounts a
    ''')

    # Create a view for transaction summaries
    cursor.execute('''
    CREATE VIEW IF NOT EXISTS transaction_summary AS
    SELECT
        strftime('%Y-%m', t.created_at) as month,
        a.user_id,
        t.type,
        SUM(t.amount) as total_amount,
        COUNT(*) as transaction_count
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    GROUP BY month, a.user_id, t.type
    ''')

    # Create an audit table for important changes
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_trail (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_name TEXT NOT NULL,
        record_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Create a trigger to update account balance after transactions
    cursor.execute('''
    CREATE TRIGGER IF NOT EXISTS update_balance_after_transaction
    AFTER INSERT ON transactions
    BEGIN
        UPDATE accounts
        SET balance = CASE
            WHEN NEW.type = 'deposit' THEN balance + NEW.amount
            WHEN NEW.type = 'withdrawal' THEN balance - NEW.amount
            ELSE balance
        END
        WHERE id = NEW.account_id;
    END;
    ''')

    # Create a trigger to add to audit trail on user update
    cursor.execute('''
    CREATE TRIGGER IF NOT EXISTS audit_user_update
    AFTER UPDATE ON users
    BEGIN
        INSERT INTO audit_trail (table_name, record_id, action)
        VALUES ('users', NEW.id, 'update');
    END;
    ''')

    # Insert some initial data for testing if the tables are empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        # Create a test user
        hashed_password = generate_password_hash("password123")
        cursor.execute(
            "INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)",
            ("Test User", "test@example.com", hashed_password, "123-456-7890", "123 Test St, Test City")
        )
        user_id = cursor.lastrowid

        # Create an account for the test user
        account_number = "1000000001"
        cursor.execute(
            "INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?)",
            (user_id, account_number, "Savings", 1000.00)
        )
        account_id = cursor.lastrowid

        # Add some sample transactions
        transactions = [
            (account_id, "deposit", 500.00, "Initial deposit", "Bank Transfer", datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
            (account_id, "withdrawal", 200.00, "ATM withdrawal", "ATM", (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")),
            (account_id, "deposit", 700.00, "Salary", "Employer", (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d %H:%M:%S"))
        ]
        cursor.executemany(
            "INSERT INTO transactions (account_id, type, amount, description, merchant, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            transactions
        )

        # Add a sample loan
        cursor.execute(
            "INSERT INTO loans (user_id, loan_type, amount, interest_rate, term_months, status) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, "Personal", 5000.00, 5.5, 36, "active")
        )

        # Add a sample loan application
        cursor.execute(
            "INSERT INTO loan_applications (user_id, loan_type, amount, purpose, income, employment_status, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user_id, "Personal", 3000.00, "Home renovation", 50000.00, "Employed", "approved")
        )

    conn.commit()
    conn.close()
    print("Database initialized with sample data")

# Initialize the database when the app starts
if not os.path.exists('banking.db'):
    print("Creating new database...")
    init_db()
else:
    print("Database already exists")

# Routes for authentication
@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        name = data.get("name", "")
        email = data.get("email", "")
        password = data.get("password", "")

        if not name or not email or not password:
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user with email already exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            conn.close()
            return jsonify({"error": "User with this email already exists"}), 409

        # Create the new user
        hashed_password = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, hashed_password)
        )
        user_id = cursor.lastrowid

        # Create a default account for the user
        account_number = f"10{user_id:08d}"
        cursor.execute(
            "INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?)",
            (user_id, account_number, "Savings", 1000.00)  # Start with $1000 for demo purposes
        )

        conn.commit()
        conn.close()

        # Create and return the access token
        access_token = create_access_token(identity=str(user_id))

        return jsonify({
            "message": "Registration successful",
            "token": access_token,
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }), 201

    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({"error": "Registration failed"}), 500

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email", "")
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Find the user by email
        cursor.execute("SELECT id, name, email, password FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user or not check_password_hash(user["password"], password):
            conn.close()
            return jsonify({"error": "Invalid email or password"}), 401

        # Get the user's account information
        cursor.execute(
            "SELECT id, account_number, account_type, balance FROM accounts WHERE user_id = ?",
            (user["id"],)
        )
        account = cursor.fetchone()
        conn.close()

        # Create access token
        access_token = create_access_token(identity=str(user["id"]))

        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "accountNumber": account["account_number"],
                "accountType": account["account_type"],
                "balance": float(account["balance"])
            }
        }), 200

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"error": "Login failed"}), 500

@app.route("/api/user", methods=["GET"])
@jwt_required()
def get_user():
    try:
        user_id = get_jwt_identity()

        conn = get_db_connection()
        cursor = conn.cursor()

        # Get user details
        cursor.execute("SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return jsonify({"error": "User not found"}), 404

        # Get account details
        cursor.execute(
            "SELECT id, account_number, account_type, balance, created_at FROM accounts WHERE user_id = ?",
            (user_id,)
        )
        account = cursor.fetchone()
        conn.close()

        # Format the timestamp
        joined_date = datetime.strptime(user["created_at"], "%Y-%m-%d %H:%M:%S").strftime("%B %Y")

        return jsonify({
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "address": user["address"],
            "joined": joined_date,
            "accountId": account["id"],
            "accountNumber": account["account_number"],
            "accountType": account["account_type"],
            "balance": float(account["balance"])
        }), 200

    except Exception as e:
        print(f"Get user error: {str(e)}")
        return jsonify({"error": "Failed to retrieve user data"}), 500

# Route to update user profile
@app.route("/api/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        name = data.get("name")
        phone = data.get("phone")
        address = data.get("address")

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?",
            (name, phone, address, user_id)
        )

        conn.commit()
        conn.close()

        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        print(f"Update profile error: {str(e)}")
        return jsonify({"error": "Failed to update profile"}), 500

# Route to change password
@app.route("/api/profile/password", methods=["PUT"])
@jwt_required()
def change_password():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        current_password = data.get("currentPassword")
        new_password = data.get("newPassword")

        if not current_password or not new_password:
            return jsonify({"error": "Current and new passwords are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Verify current password
        cursor.execute("SELECT password FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()

        if not user or not check_password_hash(user["password"], current_password):
            conn.close()
            return jsonify({"error": "Current password is incorrect"}), 401

        # Update to new password
        hashed_password = generate_password_hash(new_password)
        cursor.execute("UPDATE users SET password = ? WHERE id = ?", (hashed_password, user_id))

        conn.commit()
        conn.close()

        return jsonify({"message": "Password changed successfully"}), 200

    except Exception as e:
        print(f"Change password error: {str(e)}")
        return jsonify({"error": "Failed to change password"}), 500

# Routes for transactions
@app.route("/api/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    try:
        user_id = get_jwt_identity()

        conn = get_db_connection()
        cursor = conn.cursor()

        # First get the account ID
        cursor.execute("SELECT id FROM accounts WHERE user_id = ?", (user_id,))
        account = cursor.fetchone()

        if not account:
            conn.close()
            return jsonify({"error": "Account not found"}), 404

        account_id = account["id"]

        # Get all transactions for this account
        cursor.execute("""
            SELECT id, type, amount, description, merchant, created_at
            FROM transactions
            WHERE account_id = ?
            ORDER BY created_at DESC
        """, (account_id,))

        transactions = []
        for row in cursor.fetchall():
            transactions.append({
                "id": row["id"],
                "type": row["type"],
                "amount": float(row["amount"]),
                "description": row["description"],
                "merchant": row["merchant"],
                "date": row["created_at"]
            })

        conn.close()
        return jsonify({"transactions": transactions}), 200

    except Exception as e:
        print(f"Get transactions error: {str(e)}")
        return jsonify({"error": "Failed to retrieve transactions"}), 500

@app.route("/api/transactions", methods=["POST"])
@jwt_required()
def create_transaction():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        transaction_type = data.get("type")
        amount = float(data.get("amount", 0))
        description = data.get("description", "")
        merchant = data.get("merchant", "")

        if not transaction_type or amount <= 0:
            return jsonify({"error": "Transaction type and positive amount are required"}), 400

        if transaction_type not in ["deposit", "withdrawal", "transfer"]:
            return jsonify({"error": "Invalid transaction type"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Get the account
        cursor.execute("SELECT id, balance FROM accounts WHERE user_id = ?", (user_id,))
        account = cursor.fetchone()

        if not account:
            conn.close()
            return jsonify({"error": "Account not found"}), 404

        account_id = account["id"]
        current_balance = float(account["balance"])

        # Check if enough funds for withdrawal
        if transaction_type == "withdrawal" and amount > current_balance:
            conn.close()
            return jsonify({"error": "Insufficient funds"}), 400

        # Insert the transaction
        cursor.execute("""
            INSERT INTO transactions (account_id, type, amount, description, merchant)
            VALUES (?, ?, ?, ?, ?)
        """, (account_id, transaction_type, amount, description, merchant))

        # The balance update is handled by the trigger

        conn.commit()

        # Get updated balance
        cursor.execute("SELECT balance FROM accounts WHERE id = ?", (account_id,))
        new_balance = float(cursor.fetchone()["balance"])

        conn.close()

        return jsonify({
            "message": "Transaction completed successfully",
            "newBalance": new_balance
        }), 201

    except Exception as e:
        print(f"Create transaction error: {str(e)}")
        return jsonify({"error": "Failed to process transaction"}), 500

# Routes for loans
@app.route("/api/loan", methods=["GET"])
@jwt_required()
def get_loans():
    try:
        user_id = get_jwt_identity()

        if not user_id:
            return jsonify({"error": "Invalid user identity"}), 422

        conn = get_db_connection()
        cursor = conn.cursor()

        # Get active loans
        cursor.execute("""
            SELECT id, loan_type, amount, interest_rate, term_months, status, created_at
            FROM loans
            WHERE user_id = ?
            ORDER BY created_at DESC
        """, (user_id,))

        loans = []
        for row in cursor.fetchall():
            loans.append({
                "id": row["id"],
                "type": row["loan_type"],
                "amount": float(row["amount"]),
                "interestRate": float(row["interest_rate"]),
                "termMonths": row["term_months"],
                "status": row["status"],
                "date": row["created_at"]
            })

        conn.close()
        return jsonify({"loans": loans}), 200

    except Exception as e:
        print(f"Get loans error: {str(e)}")
        return jsonify({"error": "Failed to retrieve loans", "details" : str(e)}), 500

@app.route("/api/loan/apply", methods=["POST"])
@jwt_required()
def apply_for_loan():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        loan_type = data.get("type")
        amount = float(data.get("amount", 0))
        purpose = data.get("purpose", "")
        income = float(data.get("income", 0))
        employment_status = data.get("employmentStatus", "")

        if not loan_type or amount <= 0:
            return jsonify({"error": "Loan type and positive amount are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO loan_applications
            (user_id, loan_type, amount, purpose, income, employment_status)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, loan_type, amount, purpose, income, employment_status))

        # For demo purposes, automatically approve small loans
        application_id = cursor.lastrowid
        status = "approved" if amount <= 5000 else "pending"

        cursor.execute(
            "UPDATE loan_applications SET status = ? WHERE id = ?",
            (status, application_id)
        )

        # If approved, create an actual loan
        if status == "approved":
            # Calculate interest rate based on amount and term
            # This is a simplified calculation
            interest_rate = 5.0  # Base rate
            term_months = 36     # Default term

            if amount > 1000:
                interest_rate += 0.5

            if amount > 3000:
                interest_rate += 0.5

            cursor.execute("""
                INSERT INTO loans
                (user_id, loan_type, amount, interest_rate, term_months, status)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (user_id, loan_type, amount, interest_rate, term_months, "active"))

            # Add loan amount to account balance
            cursor.execute("""
                UPDATE accounts
                SET balance = balance + ?
                WHERE user_id = ?
            """, (amount, user_id))

        conn.commit()
        conn.close()

        return jsonify({
            "message": f"Loan application {status}",
            "status": status
        }), 201

    except Exception as e:
        print(f"Loan application error: {str(e)}")
        return jsonify({"error": "Failed to process loan application"}), 500

@app.route("/api/loan/applications", methods=["GET"])
@jwt_required()
def get_loan_applications():
    try:
        user_id = get_jwt_identity()

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, loan_type, amount, purpose, status, created_at
            FROM loan_applications
            WHERE user_id = ?
            ORDER BY created_at DESC
        """, (user_id,))

        applications = []
        for row in cursor.fetchall():
            applications.append({
                "id": row["id"],
                "type": row["loan_type"],
                "amount": float(row["amount"]),
                "purpose": row["purpose"],
                "status": row["status"],
                "date": row["created_at"]
            })

        conn.close()
        return jsonify({"applications": applications}), 200

    except Exception as e:
        print(f"Get loan applications error: {str(e)}")
        return jsonify({"error": "Failed to retrieve loan applications"}), 500

@app.route("/api/loan/applications/<int:application_id>", methods=["DELETE"])
@jwt_required()
def delete_loan_application(application_id):
    try:
        user_id = get_jwt_identity()
        conn = get_db_connection()
        cursor = conn.cursor()

        # Verify the application belongs to the user
        cursor.execute("""
            SELECT id FROM loan_applications
            WHERE id = ? AND user_id = ?
        """, (application_id, user_id))

        if not cursor.fetchone():
            return jsonify({"error": "Application not found or access denied"}), 404

        # Delete the application
        cursor.execute("""
            DELETE FROM loan_applications
            WHERE id = ?
        """, (application_id,))

        conn.commit()
        conn.close()

        return jsonify({"message": "Application cancelled successfully"}), 200

    except Exception as e:
        print(f"Error deleting application: {str(e)}")
        return jsonify({"error": "Failed to cancel application"}), 500


from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import bcrypt
from datetime import datetime

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        user_id = get_jwt_identity()
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get user info
        cursor.execute("""
            SELECT u.id, u.name, u.email, u.phone, u.address, u.created_at,
                   a.account_number, a.account_type
            FROM users u
            LEFT JOIN accounts a ON u.id = a.user_id
            WHERE u.id = ?
        """, (user_id,))

        user = cursor.fetchone()
        conn.close()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "address": user["address"],
            "accountNumber": user["account_number"],
            "accountType": user["account_type"],
            "joinDate": datetime.strptime(user["created_at"], "%Y-%m-%d %H:%M:%S").strftime("%B %Y")
        }), 200

    except Exception as e:
        print(f"Error fetching profile: {str(e)}")
        return jsonify({"error": "Failed to fetch profile"}), 500

@app.route('/api/profile/update', methods=['PUT'])  # Changed endpoint to avoid conflict
@jwt_required()
def update_user_profile():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        required_fields = ['name', 'email', 'phone', 'address']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if email already exists for another user
        cursor.execute("SELECT id FROM users WHERE email = ? AND id != ?", (data['email'], user_id))
        if cursor.fetchone():
            conn.close()
            return jsonify({"error": "Email already in use"}), 400

        cursor.execute("""
            UPDATE users SET
                name = ?,
                email = ?,
                phone = ?,
                address = ?
            WHERE id = ?
        """, (
            data['name'],
            data['email'],
            data['phone'],
            data['address'],
            user_id
        ))

        conn.commit()

        # Get updated user data
        cursor.execute("""
            SELECT u.name, u.email, u.phone, u.address,
                   a.account_number, a.account_type
            FROM users u
            LEFT JOIN accounts a ON u.id = a.user_id
            WHERE u.id = ?
        """, (user_id,))
        updated_user = cursor.fetchone()

        conn.close()

        return jsonify({
            "message": "Profile updated successfully",
            "user": {
                "name": updated_user["name"],
                "email": updated_user["email"],
                "phone": updated_user["phone"],
                "address": updated_user["address"],
                "accountNumber": updated_user["account_number"],
                "accountType": updated_user["account_type"]
            }
        }), 200

    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        return jsonify({"error": "Failed to update profile"}), 500

@app.route('/api/profile/password', methods=['PUT'])
@jwt_required()
def update_user_password():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data.get('currentPassword') or not data.get('newPassword'):
            return jsonify({"error": "Missing password fields"}), 400

        if len(data['newPassword']) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Get current password hash
        cursor.execute("SELECT password FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()

        if not user or not bcrypt.checkpw(data['currentPassword'].encode('utf-8'), user['password']):
            conn.close()
            return jsonify({"error": "Invalid current password"}), 401

        # Hash new password
        new_password_hash = bcrypt.hashpw(data['newPassword'].encode('utf-8'), bcrypt.gensalt())

        cursor.execute("""
            UPDATE users SET
                password = ?
            WHERE id = ?
        """, (new_password_hash, user_id))

        conn.commit()
        conn.close()

        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
        print(f"Error updating password: {str(e)}")
        return jsonify({"error": "Failed to update password"}), 500

if __name__ == "__main__":
    if not os.path.exists('banking.db'):
        init_db()
    app.run(debug=True)
