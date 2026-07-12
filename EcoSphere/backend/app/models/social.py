"""
Social module SQLAlchemy models.
CSR Activities, employee participation, approval states, and evidence metadata.
"""
from app.extensions import db
from app.models.base import BaseModel


class CSRActivity(BaseModel):
    """CSR Activities and volunteering efforts."""
    __tablename__ = 'csr_activities'

    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    department = db.Column(db.String(100), nullable=False, index=True)
    volunteer_hours = db.Column(db.Float, nullable=False, default=0.0)
    points_awarded = db.Column(db.Integer, nullable=False, default=0)
    status = db.Column(
        db.Enum('Pending', 'Approved', 'Rejected', name='csr_status_enum'),
        nullable=False,
        default='Pending'
    )
    evidence_file = db.Column(db.String(255), nullable=True)
    participant_count = db.Column(db.Integer, nullable=False, default=0)
    date = db.Column(db.Date, nullable=False)
    organization_id = db.Column(db.String(36), nullable=True, index=True)

    def to_dict(self):
        base = super().to_dict()
        base['date'] = self.date.isoformat() if self.date else None
        return base
