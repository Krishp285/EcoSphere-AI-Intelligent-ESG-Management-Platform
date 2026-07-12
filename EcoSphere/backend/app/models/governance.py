"""
Governance module SQLAlchemy models.
Policies, acknowledgements, compliance audit entries, and compliance issues.
"""
from app.extensions import db
from app.models.base import BaseModel


class Policy(BaseModel):
    """Corporate ESG governance policies and acknowledgements."""
    __tablename__ = 'policies'

    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)  # Environmental, Social, Governance, Ethics
    content = db.Column(db.Text, nullable=True)
    published_date = db.Column(db.Date, nullable=False)
    version = db.Column(db.String(20), nullable=False, default='1.0')
    acknowledged_count = db.Column(db.Integer, nullable=False, default=0)
    total_required_count = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        base = super().to_dict()
        base['published_date'] = self.published_date.isoformat() if self.published_date else None
        return base


class ComplianceIssue(BaseModel):
    """Compliance audit issues and corrective actions."""
    __tablename__ = 'compliance_issues'

    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    severity = db.Column(
        db.Enum('Low', 'Medium', 'High', 'Critical', name='severity_enum'),
        nullable=False,
        default='Medium'
    )
    status = db.Column(
        db.Enum('Open', 'In Investigation', 'Resolved', 'Closed', name='compliance_status_enum'),
        nullable=False,
        default='Open'
    )
    owner = db.Column(db.String(100), nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    action_taken = db.Column(db.Text, nullable=True)
    organization_id = db.Column(db.String(36), nullable=True, index=True)

    def to_dict(self):
        base = super().to_dict()
        base['due_date'] = self.due_date.isoformat() if self.due_date else None
        return base
