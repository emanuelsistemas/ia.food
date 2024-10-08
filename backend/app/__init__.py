from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.config.Config')
    
    CORS(app)
    
    db.init_app(app)
    migrate.init_app(app, db)

    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app