"""
Consolidated service layers for Social, Governance, Gamification, Notifications, and Settings modules.
All inherit from BaseService.
"""
from app.services.base_service import BaseService
from app.models.social import CSRActivity
from app.models.governance import Policy, ComplianceIssue
from app.models.gamification import ESGChallenge, Reward
from app.models.notification import UserNotification
from app.models.setting import SystemSetting
from app.extensions import db


class CSRActivityService(BaseService):
    model = CSRActivity

    @classmethod
    def get_statistics(cls):
        """Aggregate volunteering statistics."""
        from sqlalchemy import func
        stats = db.session.query(
            func.sum(CSRActivity.volunteer_hours).label('hours'),
            func.sum(CSRActivity.points_awarded).label('points'),
            func.count(CSRActivity.id).label('count')
        ).filter(CSRActivity.status == 'Approved', CSRActivity.is_active == True).first()

        by_dept = db.session.query(
            CSRActivity.department,
            func.sum(CSRActivity.volunteer_hours).label('hours'),
            func.sum(CSRActivity.points_awarded).label('points')
        ).filter(CSRActivity.status == 'Approved', CSRActivity.is_active == True).group_by(CSRActivity.department).all()

        return {
            'total_volunteer_hours': float(stats.hours or 0),
            'total_csr_points': int(stats.points or 0),
            'total_activities': int(stats.count or 0),
            'by_department': [{
                'department': r.department,
                'hours': float(r.hours or 0),
                'points': int(r.points or 0)
            } for r in by_dept]
        }


class PolicyService(BaseService):
    model = Policy

    @classmethod
    def acknowledge_policy(cls, policy_id: str):
        policy = cls.get_by_id(policy_id)
        if not policy:
            return None
        policy.acknowledged_count += 1
        db.session.commit()
        return policy


class ComplianceIssueService(BaseService):
    model = ComplianceIssue


class ESGChallengeService(BaseService):
    model = ESGChallenge

    @classmethod
    def join_challenge(cls, challenge_id: str):
        challenge = cls.get_by_id(challenge_id)
        if not challenge:
            return None
        challenge.participant_count += 1
        db.session.commit()
        return challenge


class RewardService(BaseService):
    model = Reward

    @classmethod
    def redeem(cls, reward_id: str):
        reward = cls.get_by_id(reward_id)
        if not reward or reward.available_stock <= 0:
            return None
        reward.available_stock -= 1
        reward.redeemed_count += 1
        db.session.commit()
        return reward


class UserNotificationService(BaseService):
    model = UserNotification

    @classmethod
    def get_unread(cls, recipient_id=None):
        return cls.model.query.filter_by(recipient_id=recipient_id, is_read=False, is_active=True).all()

    @classmethod
    def mark_all_read(cls, recipient_id=None):
        cls.model.query.filter_by(recipient_id=recipient_id, is_read=False, is_active=True).update({UserNotification.is_read: True})
        db.session.commit()
        return True


class SystemSettingService(BaseService):
    model = SystemSetting

    @classmethod
    def get_by_key(cls, key: str):
        return cls.model.query.filter_by(key=key, is_active=True).first()

    @classmethod
    def get_group(cls, group: str):
        return cls.model.query.filter_by(group=group, is_active=True).all()
