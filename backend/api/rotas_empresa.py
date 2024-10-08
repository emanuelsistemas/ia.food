from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from app import db
from modelos.empresa import Empresa

bp = Blueprint('empresa', __name__)

@bp.route('/cadastrar', methods=['POST'])
def cadastrar_empresa():
    data = request.json
    nova_empresa = Empresa(
        nome=data['nome'],
        cnpj=data['cnpj'],
        email=data['email'],
        telefone=data['telefone'],
        senha=generate_password_hash(data['senha'])
    )
    db.session.add(nova_empresa)
    db.session.commit()
    return jsonify({"message": "Empresa cadastrada com sucesso", "id": nova_empresa.id}), 201

@bp.route('/<int:id>', methods=['GET'])
def obter_empresa(id):
    empresa = Empresa.query.get_or_404(id)
    return jsonify({
        "id": empresa.id,
        "nome": empresa.nome,
        "cnpj": empresa.cnpj,
        "email": empresa.email,
        "telefone": empresa.telefone
    })

@bp.route('/<int:id>', methods=['PUT'])
def atualizar_empresa(id):
    empresa = Empresa.query.get_or_404(id)
    data = request.json
    empresa.nome = data.get('nome', empresa.nome)
    empresa.cnpj = data.get('cnpj', empresa.cnpj)
    empresa.email = data.get('email', empresa.email)
    empresa.telefone = data.get('telefone', empresa.telefone)
    if 'senha' in data:
        empresa.senha = generate_password_hash(data['senha'])
    db.session.commit()
    return jsonify({"message": "Empresa atualizada com sucesso"})

@bp.route('/<int:id>', methods=['DELETE'])
def deletar_empresa(id):
    empresa = Empresa.query.get_or_404(id)
    db.session.delete(empresa)
    db.session.commit()
    return jsonify({"message": "Empresa deletada com sucesso"})

@bp.route('/', methods=['GET'])
def listar_empresas():
    empresas = Empresa.query.all()
    return jsonify([{
        "id": e.id,
        "nome": e.nome,
        "cnpj": e.cnpj,
        "email": e.email,
        "telefone": e.telefone
    } for e in empresas])

# Adicione outras rotas relacionadas à empresa aqui, se necessário
