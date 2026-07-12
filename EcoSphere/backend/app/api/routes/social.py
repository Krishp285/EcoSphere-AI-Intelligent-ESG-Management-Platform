"""
Social Blueprint — CSR volunteering, activities list, approval endpoint.
"""
from datetime import datetime
from flask import Blueprint, request, jsonify
from app.services.esg_services import CSRActivityService

social_bp = Blueprint('social', __name__)

def ok(data, code=200):
    return jsonify({'status': 'success', 'data': data}), code

def err(msg, code=400):
    return jsonify({'status': 'error', 'message': msg}), code


@social_bp.route('/activities', methods=['GET'])
def list_activities():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    department = request.args.get('department')
    status = request.args.get('status')
    
    filters = {}
    if department:
        filters['department'] = department
    if status:
        filters['status'] = status
        
    result = CSRActivityService.get_all(filters=filters, page=page, per_page=per_page)
    return ok({
        'items': [a.to_dict() for a in result.items],
        'total': result.total,
        'pages': result.pages,
        'page': page
    })


@social_bp.route('/activities', methods=['POST'])
def create_activity():
    data = request.get_json() or {}
    required = ['title', 'department', 'volunteer_hours', 'points_awarded', 'date']
    missing = [r for r in required if r not in data]
    if missing:
        return err(f"Missing required fields: {', '.join(missing)}")
        
    try:
        data['date'] = datetime.strptime(data['date'], '%Y-%m-%d').date()
        act = CSRActivityService.create(data)
        return ok(act.to_dict(), 201)
    except Exception as e:
        return err(str(e), 500)


@social_bp.route('/activities/<string:act_id>', methods=['PUT'])
def update_activity(act_id):
    data = request.get_json() or {}
    if 'date' in data:
        data['date'] = datetime.strptime(data['date'], '%Y-%m-%d').date()
    act = CSRActivityService.update(act_id, data)
    if not act:
        return err('Activity not found', 404)
    return ok(act.to_dict())


@social_bp.route('/activities/<string:act_id>', methods=['DELETE'])
def delete_activity(act_id):
    deleted = CSRActivityService.delete(act_id)
    if not deleted:
        return err('Activity not found', 404)
    return ok({'deleted': act_id})


@social_bp.route('/activities/<string:act_id>/approve', methods=['POST'])
def approve_activity(act_id):
    act = CSRActivityService.update(act_id, {'status': 'Approved'})
    if not act:
        return err('Activity not found', 404)
    return ok(act.to_dict())


@social_bp.route('/activities/<string:act_id>/reject', methods=['POST'])
def reject_activity(act_id):
    act = CSRActivityService.update(act_id, {'status': 'Rejected'})
    if not act:
        return err('Activity not found', 404)
    return ok(act.to_dict())


@social_bp.route('/statistics', methods=['GET'])
def get_stats():
    return ok(CSRActivityService.get_statistics())
