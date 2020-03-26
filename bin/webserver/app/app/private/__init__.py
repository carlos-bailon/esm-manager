from flask import Blueprint

bp = Blueprint('private', __name__)

from app.private import routes