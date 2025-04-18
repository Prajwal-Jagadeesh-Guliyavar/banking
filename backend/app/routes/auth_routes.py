# app/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from app.models import Customer, Administrator, db
from flask_jwt_extended import create_access_token
import datetime

auth_bp = Blueprint('auth', __name__)

# --- customer Endpoints ---

@auth_bp.route('/customer/signup', methods=['POST'])
def customer_signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    fname = data.get('fname')
    lname = data.get('lname')
    
    if Customer.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400
        
    new_customer = Customer(fname=fname, lname=lname, email=email)
    new_customer.set_password(password)
    
    db.session.add(new_customer)
    db.session.commit()
    
    return jsonify({"message": "Customer registered successfully"}), 201

@auth_bp.route('/customer/login', methods=['POST'])
def customer_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    customer = Customer.query.filter_by(email=email).first()
    if not customer or not customer.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401
        
    access_token = create_access_token(
        identity={'id': customer.id, 'role': 'customer'},
        expires_delta=datetime.timedelta(hours=1)
    )
    return jsonify({"access_token": access_token}), 200

# --- administrator Endpoints ---

@auth_bp.route('/admin/signup', methods=['POST'])
def admin_signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if Administrator.query.filter((Administrator.email == email) | (Administrator.username == username)).first():
        return jsonify({"message": "Administrator already exists"}), 400
        
    new_admin = Administrator(username=username, email=email)
    new_admin.set_password(password)
    
    db.session.add(new_admin)
    db.session.commit()
    
    return jsonify({"message": "Administrator registered successfully"}), 201

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    admin = Administrator.query.filter_by(email=email).first()
    if not admin or not admin.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401
        
    access_token = create_access_token(
        identity={'id': admin.id, 'role': 'admin'},
        expires_delta=datetime.timedelta(hours=1)
    )
    return jsonify({"access_token": access_token}), 200
