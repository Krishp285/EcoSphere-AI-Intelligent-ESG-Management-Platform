"""
Notifications Blueprint — Fetching user alerts, marks read.
"""
from flask import Blueprint, request, jsonify
from app.services.esg_services import UserNotificationService

notification_bp = Blueprint('notification', __name__)

def ok(data, code=200):
    return jsonify({'status': 'success', 'data': data}), code

def err(msg, code=400):
    return jsonify({'status': 'error', 'message': msg}), code


@notification_bp.route('', methods=['GET'])
def list_notifications():
    recipient_id = request.args.get('recipient_id')
    unread = request.args.get('unread', 'false').lower() == 'true'
    
    if unread:
        notes = UserNotificationService.get_unread(recipient_id)
    else:
        filters = {}
        if recipient_id:
            filters['recipient_id'] = recipient_id
        result = UserNotificationService.get_all(filters=filters)
        notes = result.items
        
    return ok([n.to_dict() for n in notes])


@notification_bp.route('', methods=['POST'])
def create_notification():
    data = request.get_json() or {}
    required = ['title', 'message', 'category']
    missing = [r for r in required if r not in data]
    if missing:
        return err(f"Missing required fields: {', '.join(missing)}")
    note = UserNotificationService.create(data)
    return ok(note.to_dict(), 201)


@notification_bp.route('/read', methods=['POST'])
def mark_all_read():
    recipient_id = request.get_json().get('recipient_id')
    UserNotificationService.mark_all_read(recipient_id)
    return ok({'message': 'All notifications marked as read'})


@notification_bp.route('/<string:note_id>/read', methods=['POST'])
def mark_read(note_id):
    note = UserNotificationService.update(note_id, {'is_read': True})
    if not note:
        return err('Notification not found', 404)
    return ok(note.to_dict())
