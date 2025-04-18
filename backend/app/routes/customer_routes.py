from flask import Blueprint, request, jsonify
from app.models import Customer
from app.db import db

bp = Blueprint('customers', __name__)

@bp.route('/', methods = ['GET'])
def get_customers():
    customers = Customer.query.all()

    customers_list = [{
        'id' : c.id,
        'fname': c.fname,
        'lname' : c.lname,
        'address' : c.address,
        'phone_no' : c.phone_no
    } for c in customers ]

    return jsonify(customers_list)

@bp.route('/', methods = ['POST'])
def create_customer():
    data = request.get_json()

    new_customer = Customer(
        fname = data.get('fname'),
        minit = data.get('minit'),
        lname = data.get('lname'),
        address = data.get('address'),
        phone_no = data.get('phone_no')
    )

    db.session.add(new_customer)
    db.session.commit()

    return jsonify({'messsage' : "costumer is created", 'id': new_customer.id}),201