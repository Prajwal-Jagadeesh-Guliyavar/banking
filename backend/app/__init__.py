from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    CORS(app)

    from .routes import customer_routes, account_routes, transaction_routes
    app.register_blueprint(customer_routes.bp, url_prefix='/api/customers')
    app.register_blueprint(account_routes.bp, url_prefix='/api/accounts')
    app.register_blueprint(transaction_routes.bp, url_prefix='/api/transactions')

    return app