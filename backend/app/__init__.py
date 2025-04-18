from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    CORS(app)
    JWTManager(app)

    from .routes import customer_routes, account_routes, transaction_routes
    app.register_blueprint(customer_routes.bp, url_prefix='/api/customers')
    app.register_blueprint(account_routes.bp, url_prefix='/api/accounts')
    app.register_blueprint(transaction_routes.bp, url_prefix='/api/transactions')

    from .routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix = '/api/auth')