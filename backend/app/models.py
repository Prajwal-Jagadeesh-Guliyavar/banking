from datetime import datetime
from . import db

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50), nullable=False)
    minit = db.Column(db.String(1))
    lname = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(100))
    phone_no = db.Column(db.String(15))
    
    #1 to many realtions
    accounts = db.relationship('Account', backref='owner', lazy=True)
    loans = db.relationship('Loan', backref='customer', lazy=True)

class Account(db.Model):
    __tablename__ = 'accounts'
    
    account_number = db.Column(db.String(20), primary_key=True)
    balance = db.Column(db.Float, nullable=False)
    acc_type = db.Column(db.String(20))
    monthly_amount = db.Column(db.Float)
    
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    
    # 1 to many relation
    transactions = db.relationship('Transaction', backref='account', lazy=True)

class Loan(db.Model):
    __tablename__ = 'loans'
    
    id = db.Column(db.Integer, primary_key=True)
    loan_amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.Date, default=datetime.now)
    end_date = db.Column(db.Date)
    loan_type = db.Column(db.String(30))
    
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    emi = db.Column(db.Float)
    due_date = db.Column(db.Date)

class Bank(db.Model):
    __tablename__ = 'banks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    
    # 1 to many relation
    branches = db.relationship('Branch', backref='bank', lazy=True)

class Branch(db.Model):
    __tablename__ = 'branches'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    
    bank_id = db.Column(db.Integer, db.ForeignKey('banks.id'), nullable=False)
    # 1 to may relation
    employees = db.relationship('Employee', backref='branch', lazy=True)

class Employee(db.Model):
    __tablename__ = 'employees'
    
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    position = db.Column(db.String(50))
    
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=False)

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    transaction_date = db.Column(db.DateTime, default=datetime.now)
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(50))
    
    account_number = db.Column(db.String(20), db.ForeignKey('accounts.account_number'), nullable=False)