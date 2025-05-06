class Config:
    SQLALCHEMY_DATABASE_URI = '########add your path for the .db file##########'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True
    SQLALCHEMY_ECHO = True
    JWT_SECRET_KEY = 'your-super-secret-key' 
    JWT_ACCESS_TOKEN_EXPIRES = 1200
    PROPAGATE_EXCEPTIONS = True
