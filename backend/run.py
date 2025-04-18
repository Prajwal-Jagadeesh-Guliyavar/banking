from app import create_app
from app.db import db
from app.models import Account, Customer, Transaction, Loan, Bank, Branch, Employee, Administrator
app = create_app()

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run()