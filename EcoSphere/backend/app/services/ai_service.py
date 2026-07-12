"""
Mock AI Recommendation Engine.
Returns realistic ESG insights without any external API dependency.
Designed generically: accepts any ESG domain data dict, not just environmental.
"""
import random
from datetime import datetime


# ── Insight Template Library ──────────────────────────────────────────────────

_ENV_INSIGHTS = [
    {
        'category': 'Energy Efficiency',
        'root_cause': 'Manufacturing department electricity usage up {pct}% YoY due to aging equipment running below efficiency thresholds.',
        'recommendation': 'Replace legacy compressors in Plant A with ISO 50001–certified energy-efficient models. Pilot target: 3 units by Q2.',
        'expected_carbon_reduction': '{reduction}%',
        'estimated_cost_savings': '₹{savings},00,000/year',
        'esg_score_improvement': '+{pts} pts',
        'confidence': None,
        'priority': 'Critical',
        'risk_level': 'High',
    },
    {
        'category': 'Fleet Optimization',
        'root_cause': 'Logistics fleet operating {fleet_pct}% diesel vehicles on routes with viable CNG alternatives.',
        'recommendation': 'Transition top 5 high-emission delivery routes to CNG. Evaluate EV lease options for short-haul routes.',
        'expected_carbon_reduction': '{reduction}%',
        'estimated_cost_savings': '₹{savings},50,000/year',
        'esg_score_improvement': '+{pts} pts',
        'confidence': None,
        'priority': 'High',
        'risk_level': 'Medium',
    },
    {
        'category': 'Data Center Efficiency',
        'root_cause': 'IT data center PUE ratio at {pue} vs industry benchmark of 1.2. Over-provisioned cooling identified.',
        'recommendation': 'Implement hot-aisle containment; upgrade server rows A & B to liquid cooling. Estimated PUE improvement to 1.35.',
        'expected_carbon_reduction': '{reduction}%',
        'estimated_cost_savings': '₹{savings},00,000/year',
        'esg_score_improvement': '+{pts} pts',
        'confidence': None,
        'priority': 'Medium',
        'risk_level': 'Low',
    },
    {
        'category': 'Supplier Chain Emissions',
        'root_cause': 'Scope 3 emissions from Supplier B account for {scope3_pct}% of total supply chain carbon footprint.',
        'recommendation': 'Transition procurement for raw materials to Supplier C (ISO 14001 certified). Estimated switch timeline: 3 months.',
        'expected_carbon_reduction': '{reduction}%',
        'estimated_cost_savings': '₹{savings},00,000/year',
        'esg_score_improvement': '+{pts} pts',
        'confidence': None,
        'priority': 'High',
        'risk_level': 'Medium',
    },
]


def _fill_template(template: dict) -> dict:
    """Fill template placeholders with randomized realistic values."""
    pct = random.randint(8, 22)
    reduction = random.randint(12, 35)
    savings = random.randint(8, 28)
    pts = round(random.uniform(1.5, 8.5), 1)
    confidence = random.randint(78, 97)
    fleet_pct = random.randint(60, 85)
    pue = round(random.uniform(1.6, 2.1), 1)
    scope3_pct = random.randint(18, 40)

    filled = {}
    for key, val in template.items():
        if isinstance(val, str):
            filled[key] = val.format(
                pct=pct, reduction=reduction, savings=savings, pts=pts,
                fleet_pct=fleet_pct, pue=pue, scope3_pct=scope3_pct
            )
        elif val is None and key == 'confidence':
            filled[key] = confidence
        else:
            filled[key] = val
    filled['id'] = f"AI-{random.randint(1000, 9999)}"
    filled['generated_at'] = datetime.utcnow().isoformat()
    return filled


class AIService:
    """
    Generic ESG AI Recommendation Service.
    Accepts any domain context dict — does not assume environmental-only data.
    """

    @staticmethod
    def get_recommendations(domain: str = 'environmental', context: dict = None, count: int = 3) -> list:
        """
        Return AI-generated recommendations.

        :param domain: 'environmental' | 'social' | 'governance' | 'gamification'
        :param context: optional dict with domain-specific KPIs for personalisation
        :param count: number of recommendations to return
        """
        # For now, all domains use the environmental template set.
        # In production, add domain-specific insight libraries here.
        pool = _ENV_INSIGHTS.copy()
        random.shuffle(pool)
        selected = pool[:min(count, len(pool))]
        return [_fill_template(t) for t in selected]

    @staticmethod
    def apply_recommendation(recommendation_id: str, user_id: str) -> dict:
        """Placeholder for one-click Apply Recommendation action."""
        return {
            'status': 'queued',
            'recommendation_id': recommendation_id,
            'applied_by': user_id,
            'message': 'Recommendation has been queued for implementation review. A task has been created in the ESG action backlog.',
            'queued_at': datetime.utcnow().isoformat(),
        }
