"""
Environmental module service layer.
Inherits from BaseService and adds domain-specific carbon calculation logic.
"""
from datetime import datetime, date
from app.services.base_service import BaseService
from app.models.environment import CarbonTransaction, EmissionFactor, EnvironmentalGoal, DepartmentScore, ESGReport
from app.extensions import db


class CarbonTransactionService(BaseService):
    model = CarbonTransaction

    # ── Carbon Calculation ────────────────────────────────────────────────────
    @staticmethod
    def calculate_co2(quantity: float, emission_factor: float) -> float:
        """Core calculation: tCO2 = quantity × emission_factor."""
        return round(quantity * emission_factor, 6)

    @staticmethod
    def co2_equivalents(total_co2: float) -> dict:
        """Convert tCO2 to human-readable equivalents."""
        return {
            'trees_per_year': round(total_co2 / 0.021),
            'liters_of_diesel': round(total_co2 / 0.00268),
            'kwh_of_electricity': round(total_co2 / 0.0004),
        }

    @classmethod
    def calculate_and_store(cls, data: dict) -> CarbonTransaction:
        """Calculate CO2, attach equivalents, persist transaction."""
        ef = data.get('emission_factor', 0)
        qty = data.get('quantity', 0)
        total_co2 = cls.calculate_co2(qty, ef)
        data['total_co2'] = total_co2
        data['verification_status'] = 'Pending'
        return cls.create(data)

    # ── Verification Placeholder ──────────────────────────────────────────────
    @classmethod
    def initiate_verification(cls, transaction_id: str) -> CarbonTransaction:
        """Placeholder — triggers async blockchain verification flow."""
        tx = cls.get_by_id(transaction_id)
        if not tx or tx.verification_status not in ('Pending', 'Failed'):
            return None
        return cls.update(transaction_id, {'verification_status': 'Verifying'})

    # ── Dashboard Summary ─────────────────────────────────────────────────────
    @classmethod
    def get_dashboard_summary(cls):
        from sqlalchemy import func
        totals = db.session.query(
            func.sum(CarbonTransaction.total_co2).label('total_co2'),
            func.count(CarbonTransaction.id).label('count'),
        ).filter_by(is_active=True).first()

        by_dept = db.session.query(
            CarbonTransaction.department,
            func.sum(CarbonTransaction.total_co2).label('co2')
        ).filter_by(is_active=True).group_by(CarbonTransaction.department).all()

        return {
            'total_co2': float(totals.total_co2 or 0),
            'transaction_count': int(totals.count or 0),
            'by_department': [{'department': r.department, 'co2': float(r.co2)} for r in by_dept],
        }


class EmissionFactorService(BaseService):
    model = EmissionFactor

    @classmethod
    def get_by_category(cls, category: str):
        return cls.model.query.filter_by(category=category, is_active=True).all()


class EnvironmentalGoalService(BaseService):
    model = EnvironmentalGoal

    @classmethod
    def update_progress(cls, goal_id: str, current_value: float) -> EnvironmentalGoal:
        goal = cls.get_by_id(goal_id)
        if not goal:
            return None
        pct = (current_value / goal.target * 100) if goal.target else 0
        status = 'Achieved' if pct >= 100 else ('At Risk' if pct < 30 else 'In Progress')
        return cls.update(goal_id, {'current': current_value, 'status': status})


class DepartmentScoreService(BaseService):
    model = DepartmentScore

    @classmethod
    def upsert_month(cls, department: str, year: int, month: int, scores: dict):
        """Insert or update a department's monthly ESG score."""
        existing = cls.model.query.filter_by(
            department=department, period_year=year, period_month=month, is_active=True
        ).first()
        if existing:
            return cls.update(existing.id, scores)
        return cls.create({'department': department, 'period_year': year, 'period_month': month, **scores})

    # ── ESG Score Recalculation ───────────────────────────────────────────────
    @staticmethod
    def compute_environmental_score(total_co2: float, baseline_co2: float = 10.0) -> float:
        """Generic score: higher emissions = lower score. Not env-specific logic hard-coded."""
        ratio = total_co2 / baseline_co2 if baseline_co2 else 1
        return round(max(0, min(100, 100 - (ratio * 30))), 2)

    @staticmethod
    def compute_overall_score(module_scores: dict, weights: dict = None) -> float:
        """
        Generic weighted ESG score combiner.
        weights: {module_key: weight} — designed to accept any future module.
        """
        if not weights:
            weights = {'environmental': 0.4, 'social': 0.3, 'governance': 0.2, 'gamification': 0.1}
        total_weight = sum(weights.values())
        weighted_sum = sum(
            module_scores.get(k, 0) * w for k, w in weights.items()
        )
        return round(weighted_sum / total_weight, 2) if total_weight else 0


class ESGReportService(BaseService):
    model = ESGReport
