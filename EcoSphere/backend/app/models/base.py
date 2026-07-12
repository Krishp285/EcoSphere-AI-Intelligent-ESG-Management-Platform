"""
Abstract base model providing common fields for all ESG module models.
Designed for extensibility: Social, Governance, Gamification modules inherit this.
"""
import uuid
from datetime import datetime
from app.extensions import db


class BaseModel(db.Model):
    """Abstract SQLAlchemy model with audit fields."""
    __abstract__ = True

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    def to_dict(self):
        """Serialize model fields to dict. Override in child classes."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return f"<{self.__class__.__name__} id={self.id}>"
