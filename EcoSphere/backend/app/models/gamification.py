"""
Gamification module SQLAlchemy models.
Sustainability challenges, user participation, points, rewards, and leaderboards.
"""
from app.extensions import db
from app.models.base import BaseModel


class ESGChallenge(BaseModel):
    """Sustainability challenges organized by departments or corporate-wide."""
    __tablename__ = 'esg_challenges'

    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    xp_reward = db.Column(db.Integer, nullable=False, default=100)
    category = db.Column(db.String(100), nullable=False)  # Carbon reduction, Waste, Recycling, Volunteering
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    participant_count = db.Column(db.Integer, nullable=False, default=0)
    status = db.Column(
        db.Enum('Upcoming', 'Active', 'Completed', name='challenge_status_enum'),
        nullable=False,
        default='Upcoming'
    )

    def to_dict(self):
        base = super().to_dict()
        base['start_date'] = self.start_date.isoformat() if self.start_date else None
        base['end_date'] = self.end_date.isoformat() if self.end_date else None
        return base


class Reward(BaseModel):
    """Sustainability rewards catalog."""
    __tablename__ = 'rewards'

    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    cost_xp = db.Column(db.Integer, nullable=False, default=500)
    available_stock = db.Column(db.Integer, nullable=False, default=100)
    redeemed_count = db.Column(db.Integer, nullable=False, default=0)
    category = db.Column(db.String(100), nullable=False)  # Eco-friendly, Gifts, Corporate Perks
