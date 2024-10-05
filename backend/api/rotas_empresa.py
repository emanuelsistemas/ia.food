from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from app import db
from modelos.empresa import Empresa

bp = Blueprint('empresa', __name__)

@bp.route('/cadastrar', methods=['POST'])
def cadastrar_empresa():
    data = request.json
    print("Dados recebidos:", data)  # Para debug

    # Aqui você deve implementar a lógica para salvar os dados no banco de dados
    # Por enquanto, vamos apenas retornar uma resposta de sucesso

    return jsonify({"message": "Empresa cadastrada com sucesso"}), 201

@bp.route('/cadastro-empresa', methods=['POST'])
def cadastro_empresa():
    # Lógica para cadastrar empresa
    data = request.json
    print("Dados recebidos:", data)  # Para debug
    # Processe os dados e salve no banco de dados
    return jsonify({"message": "Empresa cadastrada com sucesso"}), 201

# Adicione outras rotas relacionadas à empresa aqui, se necessário
