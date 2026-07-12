"""
Gamification Blueprint — Active challenges, joining, reward items, redemption.
"""
from datetime import datetime
from flask import Blueprint, request, jsonify
from app.services.esg_services import ESGChallengeService, RewardService

gamification_bp = Blueprint('gamification', __name__)

def ok(data, code=200):
    return jsonify({'status': 'success', 'data': data}), code

def err(msg, code=400):
    return jsonify({'status': 'error', 'message': msg}), code


# ── Challenges ────────────────────────────────────────────────────────────────

@gamification_bp.route('/challenges', methods=['GET'])
def list_challenges():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    category = request.args.get('category')
    status = request.args.get('status')
    
    filters = {}
    if category:
        filters['category'] = category
    if status:
        filters['status'] = status
        
    result = ESGChallengeService.get_all(filters=filters, page=page, per_page=per_page)
    return ok({
        'items': [c.to_dict() for c in result.items],
        'total': result.total,
        'pages': result.pages,
        'page': page
    })


@gamification_bp.route('/challenges', methods=['POST'])
def create_challenge():
    data = request.get_json() or {}
    required = ['title', 'category', 'start_date', 'end_date']
    missing = [r for r in required if r not in data]
    if missing:
        return err(f"Missing required fields: {', '.join(missing)}")
        
    try:
        data['start_date'] = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        data['end_date'] = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        challenge = ESGChallengeService.create(data)
        return ok(challenge.to_dict(), 201)
    except Exception as e:
        return err(str(e), 500)


@gamification_bp.route('/challenges/<string:challenge_id>/join', methods=['POST'])
def join_challenge(challenge_id):
    challenge = ESGChallengeService.join_challenge(challenge_id)
    if not challenge:
        return err('Challenge not found', 404)
    return ok(challenge.to_dict())


# ── Rewards ───────────────────────────────────────────────────────────────────

@gamification_bp.route('/rewards', methods=['GET'])
def list_rewards():
    result = RewardService.get_all()
    return ok([r.to_dict() for r in result.items])


@gamification_bp.route('/rewards', methods=['POST'])
def create_reward():
    data = request.get_json() or {}
    required = ['title', 'cost_xp', 'category']
    missing = [r for r in required if r not in data]
    if missing:
        return err(f"Missing required fields: {', '.join(missing)}")
    reward = RewardService.create(data)
    return ok(reward.to_dict(), 201)


@gamification_bp.route('/rewards/<string:reward_id>/redeem', methods=['POST'])
def redeem_reward(reward_id):
    reward = RewardService.redeem(reward_id)
    if not reward:
        return err('Reward unavailable or stock exhausted', 400)
    return ok(reward.to_dict())
