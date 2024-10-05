from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS  # Importe o CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Adicione esta linha para habilitar CORS para todas as rotas
CORS(app)

db = SQLAlchemy(app)
mail = Mail(app)
jwt = JWTManager(app)

# Importar e registrar blueprints (rotas) aqui

from api.rotas_empresa import bp as rotas_empresa
app.register_blueprint(rotas_empresa, url_prefix='/api/empresa')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
