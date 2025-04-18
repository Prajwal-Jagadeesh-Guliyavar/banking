from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from app.models import Customer, Administrator
from app.db import db

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('user_type', 'customer')

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    if user_type == 'customer':
        user = Customer.query.filter_by(email=email).first()
    elif user_type == 'admin':
        user = Administrator.query.filter_by(email=email).first()
    else:
        return jsonify({"msg": "Invalid user type"}), 400

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity={
        'id': user.id,
        'type': user_type
    })
    
    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": f"{user.fname} {user.lname}" if user_type == 'customer' else user.username
        }
    }), 200

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not all(key in data for key in ['fname', 'lname', 'email', 'password']):
        return jsonify({"msg": "Missing required fields"}), 400
    
    if Customer.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 409
    
    try:
        new_customer = Customer(
            fname=data['fname'],
            lname=data['lname'],
            email=data['email'],
            password=generate_password_hash(data['password'])
        )
        db.session.add(new_customer)
        db.session.commit()
        
        return jsonify({
            "message": "Customer created successfully",
            "id": new_customer.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500