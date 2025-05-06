# app/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import Customer
from app.db import db

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    try:
        user = Customer.query.filter_by(email=email).first()

        if not user:
            return jsonify({"msg": "User not found"}), 404

        if not check_password_hash(user.password, password):
            return jsonify({"msg": "Invalid password"}), 401

        access_token = create_access_token(identity={
            'id': user.id,
            'type': 'customer',
            'email': user.email
        })

        return jsonify({
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": f"{user.fname} {user.lname}",
                "type": "customer"
            }
        }), 200

    except Exception as e:
        return jsonify({"msg": "Login failed", "error": str(e)}), 500

@bp.route('/customer/signup', methods=['POST'])
def customer_signup():
    data = request.get_json()

    required_fields = ['fname', 'lname', 'email', 'password', 'phone_no']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({
            "msg": "Missing required fields",
            "missing": missing_fields
        }), 400

    if Customer.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 409

    try:
        new_customer = Customer(
            fname=data['fname'],
            lname=data['lname'],
            email=data['email'],
            phone_no=data['phone_no'],
            password=generate_password_hash(data['password']),
        )

        db.session.add(new_customer)
        db.session.commit()

        return jsonify({
            "message": "Customer created successfully",
            "id": new_customer.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "msg": "Server error",
            "error": str(e)
        }), 500

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()

    if not current_user:
        return jsonify({"msg": "Invalid token"}), 401

    user_id = current_user.get('id')

    user = Customer.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": f"{user.fname} {user.lname}",
        "type": "customer"
    }), 200

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # JWT is stateless, so logout is handled client-side by removing the token
    return jsonify({"msg": "Successfully logged out"}), 200
