"""
Environmental module SQLAlchemy models.
Includes blockchain verification placeholders for future integration.
"""
from datetime import datetime
from app.extensions import db
from app.models.base import BaseModel


class CarbonTransaction(BaseModel):
    """Records individual carbon emission activities."""
    __tablename__ = 'carbon_transactions'

    # Core fields
    department = db.Column(db.String(100), nullable=False, index=True)
    source = db.Column(db.String(100), nullable=False)          # e.g. Electricity, Fuel
    activity_type = db.Column(db.String(200), nullable=True)    # e.g. Grid Power Consumption
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50), nullable=False)             # e.g. kWh, Liters
    emission_factor = db.Column(db.Float, nullable=False)       # tCO2 per unit
    total_co2 = db.Column(db.Float, nullable=False)             # metric tons CO2e
    date = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(200), nullable=True)
    description = db.Column(db.Text, nullable=True)

    # Blockchain verification placeholder
    verification_status = db.Column(
        db.Enum('Pending', 'Verifying', 'Verified', 'Failed', name='verification_status_enum'),
        nullable=False,
        default='Pending',
        index=True
    )
    blockchain_hash = db.Column(db.String(100), nullable=True)
    blockchain_certificate = db.Column(db.Text, nullable=True)   # JSON certificate
    verification_timestamp = db.Column(db.DateTime, nullable=True)

    # Relationships
    organization_id = db.Column(db.String(36), nullable=True, index=True)

    def to_dict(self):
        base = super().to_dict()
        base['date'] = self.date.isoformat() if self.date else None
        base['verification_timestamp'] = self.verification_timestamp.isoformat() if self.verification_timestamp else None
        return base


class EmissionFactor(BaseModel):
    """Reference emission factors per activity category."""
    __tablename__ = 'emission_factors'

    name = db.Column(db.String(200), nullable=False)
    category = db.Column(
        db.Enum('Electricity', 'Fuel', 'Waste', 'Transport', 'Manufacturing', 'Water', name='ef_category_enum'),
        nullable=False,
        index=True
    )
    value = db.Column(db.Float, nullable=False)     # tCO2 per unit
    unit = db.Column(db.String(100), nullable=False)  # e.g. tCO2/kWh
    source = db.Column(db.String(200), nullable=True)   # e.g. IPCC 2021
    region = db.Column(db.String(100), nullable=True)
    valid_from = db.Column(db.Date, nullable=True)
    valid_to = db.Column(db.Date, nullable=True)

    def to_dict(self):
        base = super().to_dict()
        base['valid_from'] = self.valid_from.isoformat() if self.valid_from else None
        base['valid_to'] = self.valid_to.isoformat() if self.valid_to else None
        return base


class EnvironmentalGoal(BaseModel):
    """Tracks sustainability goals per department or org-wide."""
    __tablename__ = 'environmental_goals'

    name = db.Column(db.String(300), nullable=False)
    description = db.Column(db.Text, nullable=True)
    department = db.Column(db.String(100), nullable=True)   # NULL = org-wide
    target = db.Column(db.Float, nullable=False)
    current = db.Column(db.Float, nullable=False, default=0.0)
    unit = db.Column(db.String(50), nullable=False, default='%')
    deadline = db.Column(db.Date, nullable=True)
    status = db.Column(
        db.Enum('Not Started', 'In Progress', 'At Risk', 'Achieved', name='goal_status_enum'),
        nullable=False,
        default='Not Started'
    )
    organization_id = db.Column(db.String(36), nullable=True, index=True)

    @property
    def completion_pct(self):
        if self.target and self.target > 0:
            return round((self.current / self.target) * 100, 1)
        return 0.0

    def to_dict(self):
        base = super().to_dict()
        base['deadline'] = self.deadline.isoformat() if self.deadline else None
        base['completion_pct'] = self.completion_pct
        return base


class DepartmentScore(BaseModel):
    """Stores monthly ESG sub-scores per department for historical tracking."""
    __tablename__ = 'department_scores'

    department = db.Column(db.String(100), nullable=False, index=True)
    period_year = db.Column(db.Integer, nullable=False)
    period_month = db.Column(db.Integer, nullable=False)

    # Module scores (0–100)
    environmental_score = db.Column(db.Float, nullable=True)
    social_score = db.Column(db.Float, nullable=True)
    governance_score = db.Column(db.Float, nullable=True)
    gamification_score = db.Column(db.Float, nullable=True)
    overall_score = db.Column(db.Float, nullable=True)

    # Carbon metrics
    total_co2_emitted = db.Column(db.Float, nullable=True)
    carbon_rank = db.Column(db.Integer, nullable=True)

    organization_id = db.Column(db.String(36), nullable=True, index=True)

    __table_args__ = (
        db.UniqueConstraint('department', 'period_year', 'period_month', 'organization_id', name='uq_dept_period'),
    )


class ESGReport(BaseModel):
    """Stores metadata of generated ESG reports."""
    __tablename__ = 'esg_reports'

    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)      # e.g. Environmental, Executive
    format = db.Column(db.String(50), nullable=False)        # e.g. PDF, CSV, Excel
    generated_by = db.Column(db.String(200), nullable=False)
    file_path = db.Column(db.String(500), nullable=True)
    report_data = db.Column(db.Text, nullable=True)          # JSON representation of summary metrics

    def to_dict(self):
        return super().to_dict()
