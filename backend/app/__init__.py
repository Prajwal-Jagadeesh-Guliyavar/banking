from flask import Flask, jsonify
import traceback
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from app.routes.auth_routes import bp as auth_bp
from app.routes.main_routes import main_bp
from app.db import db

migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
    jwt.init_app(app)

    @app.errorhandler(500)
    def handle_500_error(e):
        return jsonify({
            "msg": "Internal server error",
            "error": str(e),
            "stack": traceback.format_exc()
        }), 500

    from .routes import customer_routes, account_routes, transaction_routes
    app.register_blueprint(customer_routes.bp, url_prefix='/api/customers')
    app.register_blueprint(account_routes.bp, url_prefix='/api/accounts')
    app.register_blueprint(transaction_routes.bp, url_prefix='/api/transactions')
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    return app