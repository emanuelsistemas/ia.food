from app import db
from datetime import datetime
import random

class Empresa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    codigo_aifud = db.Column(db.String(5), unique=True, nullable=False)
    segmento = db.Column(db.String(100), nullable=False)
    tipo_documento = db.Column(db.String(4), nullable=False)
    cnpj = db.Column(db.String(14), unique=True, nullable=True)
    cpf = db.Column(db.String(11), unique=True, nullable=True)
    razao_social = db.Column(db.String(200), nullable=False)
    nome_fantasia = db.Column(db.String(200), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='ativo')

    @staticmethod
    def gerar_codigo_aifud():
        while True:
            codigo = ''.join([str(random.randint(0, 9)) for _ in range(5)])
            if not Empresa.query.filter_by(codigo_aifud=codigo).first():
                return codigo

    def __init__(self, **kwargs):
        super(Empresa, self).__init__(**kwargs)
        self.codigo_aifud = self.gerar_codigo_aifud()

    def to_dict(self):
        return {
            'id': self.id,
            'codigo_aifud': self.codigo_aifud,
            'segmento': self.segmento,
            'tipo_documento': self.tipo_documento,
            'cnpj': self.cnpj,
            'cpf': self.cpf,
            'razao_social': self.razao_social,
            'nome_fantasia': self.nome_fantasia,
            'telefone': self.telefone,
            'email': self.email,
            'data_criacao': self.data_criacao.isoformat(),
            'status': self.status
        }