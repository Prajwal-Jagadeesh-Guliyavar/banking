from flask import Blueprint, request, jsonify
from app.models import Transaction, db

bp = Blueprint('transactions', __name__)

@bp.route('/', methods = ['GET'])
def get_transactions():
    transactions = Transaction.query.all()

    transactions_list = [{
        'id':t.id,
        'transaction_date' : t.transaction_date,
        'amount' : t.amount,
        'transaction_type' : t.transaction_type,
        'account_number' : t.account_number
    } for t in transactions]

    return jsonify(transactions_list)

@bp.route('/', methods = ['POST'])
def create_transaction():
    data = request.get_json()

    new_transaction = Transaction(
        transaction_date = data.get('transaction_date'),
        amount = data.get('amount'),
        transaction_type = data.get('transaction_type'),
        account_number = data.get('account_number')
    )
    
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({'message' : 'Trasactions is logged', 'id': new_transaction.id}),201