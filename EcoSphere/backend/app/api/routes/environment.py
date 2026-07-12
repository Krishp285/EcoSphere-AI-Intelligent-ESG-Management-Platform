"""
Environmental module REST API routes.
Blueprint: environment_bp — prefix: /api/environment
Designed for extensibility; Social/Governance controllers follow the same pattern.
"""
from flask import Blueprint, request, jsonify
from app.services.environmental_service import (
    CarbonTransactionService, EmissionFactorService,
    EnvironmentalGoalService, DepartmentScoreService, ESGReportService
)
from app.services.ai_service import AIService

environment_bp = Blueprint('environment', __name__)


def success(data, status=200):
    return jsonify({'status': 'success', 'data': data}), status


def error(msg, status=400):
    return jsonify({'status': 'error', 'message': msg}), status


# ── Dashboard ─────────────────────────────────────────────────────────────────

@environment_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """GET /api/environment/dashboard — aggregated summary for both dashboards."""
    summary = CarbonTransactionService.get_dashboard_summary()
    ai = AIService.get_recommendations(domain='environmental', count=3)
    return success({'summary': summary, 'ai_insights': ai})


# ── Carbon Transactions ───────────────────────────────────────────────────────

@environment_bp.route('/carbon', methods=['GET'])
def list_transactions():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    department = request.args.get('department')
    status = request.args.get('status')
    filters = {}
    if department:
        filters['department'] = department
    if status:
        filters['verification_status'] = status
    result = CarbonTransactionService.get_all(filters=filters, page=page, per_page=per_page)
    return success({
        'items': [tx.to_dict() for tx in result.items],
        'total': result.total,
        'pages': result.pages,
        'page': page,
    })


@environment_bp.route('/carbon/calculate', methods=['POST'])
def calculate_carbon():
    """POST /api/environment/carbon/calculate — calculate CO2 and store transaction."""
    data = request.get_json()
    required = ['department', 'source', 'quantity', 'unit', 'emission_factor', 'date']
    missing = [f for f in required if f not in data]
    if missing:
        return error(f"Missing fields: {', '.join(missing)}")

    try:
        tx = CarbonTransactionService.calculate_and_store(data)
        equivalents = CarbonTransactionService.co2_equivalents(tx.total_co2)
        return success({'transaction': tx.to_dict(), 'equivalents': equivalents}, 201)
    except Exception as e:
        return error(str(e), 500)


@environment_bp.route('/carbon/<string:tx_id>', methods=['GET'])
def get_transaction(tx_id):
    tx = CarbonTransactionService.get_by_id(tx_id)
    if not tx:
        return error('Transaction not found', 404)
    return success(tx.to_dict())


@environment_bp.route('/carbon/<string:tx_id>', methods=['PUT'])
def update_transaction(tx_id):
    data = request.get_json()
    tx = CarbonTransactionService.update(tx_id, data)
    if not tx:
        return error('Transaction not found', 404)
    return success(tx.to_dict())


@environment_bp.route('/carbon/<string:tx_id>', methods=['DELETE'])
def delete_transaction(tx_id):
    deleted = CarbonTransactionService.delete(tx_id)
    if not deleted:
        return error('Transaction not found', 404)
    return success({'deleted': tx_id})


@environment_bp.route('/carbon/<string:tx_id>/verify', methods=['POST'])
def verify_transaction(tx_id):
    """POST /api/environment/carbon/:id/verify — initiate blockchain verification."""
    tx = CarbonTransactionService.initiate_verification(tx_id)
    if not tx:
        return error('Transaction not found or not in verifiable state', 404)
    return success({'transaction': tx.to_dict(), 'message': 'Verification initiated'})


# ── Emission Factors ──────────────────────────────────────────────────────────

@environment_bp.route('/emission-factors', methods=['GET'])
def list_emission_factors():
    category = request.args.get('category')
    if category:
        factors = EmissionFactorService.get_by_category(category)
        return success([f.to_dict() for f in factors])
    result = EmissionFactorService.get_all()
    return success([f.to_dict() for f in result.items])


@environment_bp.route('/emission-factors', methods=['POST'])
def create_emission_factor():
    data = request.get_json()
    ef = EmissionFactorService.create(data)
    return success(ef.to_dict(), 201)


@environment_bp.route('/emission-factors/<string:ef_id>', methods=['PUT'])
def update_emission_factor(ef_id):
    data = request.get_json()
    ef = EmissionFactorService.update(ef_id, data)
    if not ef:
        return error('Emission factor not found', 404)
    return success(ef.to_dict())


@environment_bp.route('/emission-factors/<string:ef_id>', methods=['DELETE'])
def delete_emission_factor(ef_id):
    deleted = EmissionFactorService.delete(ef_id)
    if not deleted:
        return error('Emission factor not found', 404)
    return success({'deleted': ef_id})


# ── Sustainability Goals ──────────────────────────────────────────────────────

@environment_bp.route('/goals', methods=['GET'])
def list_goals():
    result = EnvironmentalGoalService.get_all()
    return success([g.to_dict() for g in result.items])


@environment_bp.route('/goals', methods=['POST'])
def create_goal():
    data = request.get_json()
    goal = EnvironmentalGoalService.create(data)
    return success(goal.to_dict(), 201)


@environment_bp.route('/goals/<string:goal_id>', methods=['PUT'])
def update_goal(goal_id):
    data = request.get_json()
    goal = EnvironmentalGoalService.update(goal_id, data)
    if not goal:
        return error('Goal not found', 404)
    return success(goal.to_dict())


@environment_bp.route('/goals/<string:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    deleted = EnvironmentalGoalService.delete(goal_id)
    if not deleted:
        return error('Goal not found', 404)
    return success({'deleted': goal_id})


# ── Department Scores ─────────────────────────────────────────────────────────

@environment_bp.route('/departments/scores', methods=['GET'])
def get_department_scores():
    result = DepartmentScoreService.get_all()
    return success([s.to_dict() for s in result.items])


# ── AI Recommendations ────────────────────────────────────────────────────────

@environment_bp.route('/ai/recommendations', methods=['GET'])
def get_ai_recommendations():
    domain = request.args.get('domain', 'environmental')
    count = request.args.get('count', 3, type=int)
    insights = AIService.get_recommendations(domain=domain, count=count)
    return success(insights)


@environment_bp.route('/ai/recommendations/<string:rec_id>/apply', methods=['POST'])
def apply_recommendation(rec_id):
    user_id = request.get_json().get('user_id', 'anonymous')
    result = AIService.apply_recommendation(rec_id, user_id)
    return success(result)


# ── ESG Reports ───────────────────────────────────────────────────────────────

@environment_bp.route('/reports', methods=['GET'])
def list_reports():
    result = ESGReportService.get_all()
    return success([r.to_dict() for r in result.items])


@environment_bp.route('/reports', methods=['POST'])
def create_report():
    data = request.get_json()
    required = ['title', 'category', 'format', 'generated_by']
    missing = [f for f in required if f not in data]
    if missing:
        return error(f"Missing fields: {', '.join(missing)}")
    report = ESGReportService.create(data)
    return success(report.to_dict(), 201)


@environment_bp.route('/reports/<string:report_id>', methods=['DELETE'])
def delete_report(report_id):
    deleted = ESGReportService.delete(report_id)
    if not deleted:
        return error('Report not found', 404)
    return success({'deleted': report_id})
