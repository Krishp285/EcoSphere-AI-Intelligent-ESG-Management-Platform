"""
Auth model - users table.
Reuses BaseModel for audit fields.
"""
import hashlib
import os
from datetime import datetime
from app.models.base import BaseModel
from app.extensions import db


class User(BaseModel):
    """Application user stored in MySQL (or SQLite for demo)."""
    __tablename__ = 'users'

    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='User')
    organization = db.Column(db.String(200), nullable=True, default='EcoSphere Demo Org')
    last_login = db.Column(db.DateTime, nullable=True)

    def set_password(self, password: str):
        salt = os.urandom(16).hex()
        h = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
        self.password_hash = f"{salt}:{h}"

    def check_password(self, password: str) -> bool:
        try:
            salt, h = self.password_hash.split(':', 1)
            return hashlib.sha256(f"{salt}{password}".encode()).hexdigest() == h
        except Exception:
            return False

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'organization': self.organization,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
