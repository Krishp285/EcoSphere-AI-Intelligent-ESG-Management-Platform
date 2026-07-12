"""
Notification module SQLAlchemy models.
Notification logs, alerts, policy reminders, and compliance notifications.
"""
from app.extensions import db
from app.models.base import BaseModel


class UserNotification(BaseModel):
    """Notification logs to send/show alerts to users."""
    __tablename__ = 'user_notifications'

    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    category = db.Column(
        db.Enum('Policy Reminder', 'Compliance Reminder', 'Challenge Reminder', 'Badge Unlock', 'CSR Approval', 'General', name='notification_type_enum'),
        nullable=False,
        default='General'
    )
    recipient_id = db.Column(db.String(36), nullable=True, index=True)  # Null = broadcast to all
    is_read = db.Column(db.Boolean, nullable=False, default=False)
    created_at_dt = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def to_dict(self):
        base = super().to_dict()
        base['created_at_dt'] = self.created_at_dt.isoformat() if self.created_at_dt else None
        return base
