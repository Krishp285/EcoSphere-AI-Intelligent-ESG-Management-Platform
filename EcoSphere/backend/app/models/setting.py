"""
Settings module SQLAlchemy models.
Organization parameters, category mapping, ESG thresholds, and target values.
"""
from app.extensions import db
from app.models.base import BaseModel


class SystemSetting(BaseModel):
    """Dynamic configuration values, categories, settings, etc."""
    __tablename__ = 'system_settings'

    key = db.Column(db.String(100), nullable=False, unique=True, index=True)
    value = db.Column(db.Text, nullable=False)
    group = db.Column(db.String(100), nullable=False, default='General')  # ESG Configuration, Notification Settings, Organization Settings
    description = db.Column(db.String(255), nullable=True)
