from flask import Blueprint
from .empresa import bp as empresa_bp

main_bp = Blueprint('main', __name__)
main_bp.register_blueprint(empresa_bp)