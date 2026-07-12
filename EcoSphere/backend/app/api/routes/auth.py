"""
Auth routes: /api/auth/register, /api/auth/login, /api/auth/me, /api/auth/logout
Uses Flask-JWT-Extended for token management.
Falls back to SQLite if MySQL is unavailable.
"""
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)


def ok(data, code=200):
    return jsonify({'status': 'success', 'data': data}), code


def err(msg, code=400):
    return jsonify({'status': 'error', 'message': msg}), code


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    organization = (data.get('organization') or 'EcoSphere Demo Org').strip()

    if not name or not email or not password:
        return err('name, email and password are required')
    if len(password) < 6:
        return err('Password must be at least 6 characters')

    if User.query.filter_by(email=email).first():
        return err('An account with this email already exists', 409)

    user = User(name=name, email=email, role='Admin', organization=organization)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    return ok({
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token,
    }, 201)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return err('email and password are required')

    user = User.query.filter_by(email=email, is_active=True).first()
    if not user or not user.check_password(password):
        return err('Invalid email or password', 401)

    user.last_login = datetime.now(timezone.utc)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    return ok({
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token,
    })


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = db.session.get(User, uid)
    if not user:
        return err('User not found', 404)
    return ok(user.to_dict())


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Stateless JWT — client drops the token
    return ok({'message': 'Logged out successfully'})


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    uid = get_jwt_identity()
    access_token = create_access_token(identity=uid)
    return ok({'access_token': access_token})
