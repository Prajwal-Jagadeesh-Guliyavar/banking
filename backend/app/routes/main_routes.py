from flask import Blueprint, send_from_directory

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return "Welcome to the Banking Management System API!"

@main_bp.route('/favicon.ico')
def favicon():
    return send_from_directory('static', 'favicon.ico')