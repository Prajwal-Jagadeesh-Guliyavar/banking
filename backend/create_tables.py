from app import create_app
from app.db import db
from app.models import *

app = create_app()

with app.app_context():
    db.create_all()
    print("database tables are created or atleast hope so....")