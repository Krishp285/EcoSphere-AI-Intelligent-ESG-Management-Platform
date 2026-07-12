"""
Settings Blueprint — ESG configuration parameters.
"""
from flask import Blueprint, request, jsonify
from app.services.esg_services import SystemSettingService

setting_bp = Blueprint('setting', __name__)

def ok(data, code=200):
    return jsonify({'status': 'success', 'data': data}), code

def err(msg, code=400):
    return jsonify({'status': 'error', 'message': msg}), code


@setting_bp.route('', methods=['GET'])
def list_settings():
    group = request.args.get('group')
    if group:
        settings = SystemSettingService.get_group(group)
    else:
        result = SystemSettingService.get_all()
        settings = result.items
    return ok([s.to_dict() for s in settings])


@setting_bp.route('', methods=['POST'])
def save_setting():
    data = request.get_json() or {}
    key = data.get('key')
    value = data.get('value')
    
    if not key or value is None:
        return err('key and value are required')
        
    existing = SystemSettingService.get_by_key(key)
    if existing:
        setting = SystemSettingService.update(existing.id, {'value': value})
    else:
        setting = SystemSettingService.create(data)
        
    return ok(setting.to_dict())
