import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'uma_chave_secreta_muito_segura'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://aifud_user:%40Vs949207234@localhost/aifud'
    SQLALCHEMY_TRACK_MODIFICATIONS = False