from flask import Blueprint, jsonify, request
from app.models import db, Empresa, Usuario

bp = Blueprint('empresa', __name__, url_prefix='/empresas')

@bp.route('/', methods=['GET'])
def get_empresas():
    empresas = Empresa.query.all()
    return jsonify([empresa.to_dict() for empresa in empresas])

@bp.route('/', methods=['POST'])
def create_empresa():
    data = request.json
    nova_empresa = Empresa(
        segmento=data['segmento'],
        tipo_documento=data['documento'],
        cnpj=data.get('cnpj'),
        cpf=data.get('cpf'),
        razao_social=data['razao_social'],
        nome_fantasia=data['nome_fantasia'],
        telefone=data['telefone'],
        email=data['email']
    )
    db.session.add(nova_empresa)
    db.session.flush()  # Isso atribui um ID à nova empresa

    novo_usuario = Usuario(
        empresa_id=nova_empresa.id,
        nome_usuario=data['nome_usuario'],
        email=data['email'],
        tipo_usuario='administrador'
    )
    novo_usuario.set_senha(data['senha'])
    db.session.add(novo_usuario)

    db.session.commit()
    return jsonify({
        'message': 'Empresa e usuário administrador criados com sucesso',
        'empresa': nova_empresa.to_dict(),
        'usuario': novo_usuario.to_dict()
    }), 201

@bp.route('/<int:id>', methods=['GET'])
def get_empresa(id):
    empresa = Empresa.query.get_or_404(id)
    return jsonify(empresa.to_dict())

@bp.route('/<int:id>', methods=['PUT'])
def update_empresa(id):
    empresa = Empresa.query.get_or_404(id)
    data = request.json
    for key, value in data.items():
        setattr(empresa, key, value)
    db.session.commit()
    return jsonify(empresa.to_dict())

@bp.route('/<int:id>', methods=['DELETE'])
def delete_empresa(id):
    empresa = Empresa.query.get_or_404(id)
    db.session.delete(empresa)
    db.session.commit()
    return '', 204