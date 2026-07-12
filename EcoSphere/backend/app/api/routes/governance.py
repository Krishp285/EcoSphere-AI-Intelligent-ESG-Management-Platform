"""
Governance Blueprint — Policy management, compliance audits, acknowledgements.
"""
from datetime import datetime
from flask import Blueprint, request, jsonify
from app.services.esg_services import PolicyService, ComplianceIssueService

governance_bp = Blueprint('governance', __name__)

def ok(data, code=200):
    return jsonify({'status': 'success', 'data': data}), code

def err(msg, code=400):
    return jsonify({'status': 'error', 'message': msg}), code


# ── Policies ──────────────────────────────────────────────────────────────────

@governance_bp.route('/policies', methods=['GET'])
def list_policies():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    category = request.args.get('category')
    
    filters = {}
    if category:
        filters['category'] = category
        
    result = PolicyService.get_all(filters=filters, page=page, per_page=per_page)
    return ok({
        'items': [p.to_dict() for p in result.items],
        'total': result.total,
        'pages': result.pages,
        'page': page
    })


@governance_bp.route('/policies', methods=['POST'])
def create_policy():
    data = request.get_json() or {}
    required = ['title', 'category', 'published_date']
    missing = [r for r in required if r not in data]
    if missing:
        return err(f"Missing required fields: {', '.join(missing)}")
        
    try:
        data['published_date'] = datetime.strptime(data['published_date'], '%Y-%m-%d').date()
        policy = PolicyService.create(data)
        return ok(policy.to_dict(), 201)
    except Exception as e:
        return err(str(e), 500)


@governance_bp.route('/policies/<string:policy_id>/acknowledge', methods=['POST'])
def acknowledge_policy(policy_id):
    policy = PolicyService.acknowledge_policy(policy_id)
    if not policy:
        return err('Policy not found', 404)
    return ok(policy.to_dict())


@governance_bp.route('/policies/<string:policy_id>', methods=['DELETE'])
def delete_policy(policy_id):
    deleted = PolicyService.delete(policy_id)
    if not deleted:
        return err('Policy not found', 404)
    return ok({'deleted': policy_id})


# ── Compliance Issues ─────────────────────────────────────────────────────────

@governance_bp.route('/compliance', methods=['GET'])
def list_compliance_issues():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    severity = request.args.get('severity')
    status = request.args.get('status')
    
    filters = {}
    if severity:
        filters['severity'] = severity
    if status:
        filters['status'] = status
        
    result = ComplianceIssueService.get_all(filters=filters, page=page, per_page=per_page)
    return ok({
        'items': [i.to_dict() for i in result.items],
        'total': result.total,
        'pages': result.pages,
        'page': page
    })


@governance_bp.route('/compliance', methods=['POST'])
def create_compliance_issue():
    data = request.get_json() or {}
    required = ['title', 'severity', 'owner', 'due_date']
    missing = [r for r in required if r not in data]
    if missing:
        return err(f"Missing required fields: {', '.join(missing)}")
        
    try:
        data['due_date'] = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
        issue = ComplianceIssueService.create(data)
        return ok(issue.to_dict(), 201)
    except Exception as e:
        return err(str(e), 500)


@governance_bp.route('/compliance/<string:issue_id>', methods=['PUT'])
def update_compliance_issue(issue_id):
    data = request.get_json() or {}
    if 'due_date' in data and data['due_date']:
        data['due_date'] = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
    issue = ComplianceIssueService.update(issue_id, data)
    if not issue:
        return err('Compliance issue not found', 404)
    return ok(issue.to_dict())


@governance_bp.route('/compliance/<string:issue_id>', methods=['DELETE'])
def delete_compliance_issue(issue_id):
    deleted = ComplianceIssueService.delete(issue_id)
    if not deleted:
        return err('Compliance issue not found', 404)
    return ok({'deleted': issue_id})
