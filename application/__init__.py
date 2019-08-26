"""Initialize app."""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
from flask_cors import CORS
from sqlalchemy import text
from werkzeug.security import generate_password_hash

db = SQLAlchemy()
login_manager = LoginManager()

def createCred():
    data = {'email':'admin', 'password':generate_password_hash('admin','sha256')}
    with db.engine.connect() as con:
       sql = text('insert into flaskloginusers(email, password) values(:email,:password)')
       con.execute(sql,data)       
    
	
def create_app():
    """Construct the core application."""
    app = Flask(__name__, instance_relative_config=False)

    app.config.from_object('config.Config')
    CORS(app)
    db.init_app(app)
    login_manager.init_app(app)
    with app.app_context():
        from .controllers import auth, routes
#        from .models import users, groups, survey
        app.register_blueprint(routes.main_bp)
        app.register_blueprint(auth.auth_bp)
        db.create_all()
        try:
          createCred()
        except:
          print('User already there')
        return app
