import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'chave_secreta_padrao'
    SQLALCHEMY_DATABASE_URI = 'mysql://usuario:senha@localhost/iafood'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configurações de e-mail
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'seu_email@gmail.com'
    MAIL_PASSWORD = 'sua_senha'
