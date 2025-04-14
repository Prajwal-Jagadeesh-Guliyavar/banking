from flask import Blueprint, request, jsonify
from app.models import Account, db

bp =Blueprint('transaction', __name__)

@bp.route('/', methods = ['GET'])
def get_accounts():
    accounts = Account.query.all()
    accounts_list = [{
        'account_number': a.account_number,
        'balance' : a.balance,
        'acc_type' : a.acc_type,
        'customer_id' : a.customer_id
    } for a in accounts]

    return jsonify(accounts_list)


@bp.route('/', methods = ['POST'])
def create_account():
    data = request.get_json()

    new_account = Account(
        account_number = data.get('account_number'),
        balance = data.get('balance'),
        acc_type = data.get('acc_type'),
        customer_id = data.get('customer_id')
    )
    db.session.add(new_account)
    db.session.commit()
    return jsonify({ 'message' : 'Account has been created', 'account_number': new_account.account_number}), 201