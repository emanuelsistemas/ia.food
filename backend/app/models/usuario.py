from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresa.id'), nullable=False)
    nome_usuario = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128))
    tipo_usuario = db.Column(db.String(20), default='usuario')
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='ativo')

    empresa = db.relationship('Empresa', backref=db.backref('usuarios', lazy=True))

    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)

    def check_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)

    def to_dict(self):
        return {
            'id': self.id,
            'empresa_id': self.empresa_id,
            'nome_usuario': self.nome_usuario,
            'email': self.email,
            'tipo_usuario': self.tipo_usuario,
            'data_criacao': self.data_criacao.isoformat(),
            'status': self.status
        }
