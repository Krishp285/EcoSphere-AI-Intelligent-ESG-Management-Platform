"""
Generic base service providing CRUD repository operations.
All module-specific services (Environmental, Social, Governance) inherit from this.
"""
from app.extensions import db


class BaseService:
    """
    Generic repository service.
    Subclasses set `model` to their SQLAlchemy model class.
    """
    model = None

    @classmethod
    def get_all(cls, filters=None, page=1, per_page=20, sort_by='created_at', sort_dir='desc'):
        query = cls.model.query.filter_by(is_active=True)
        if filters:
            for key, val in filters.items():
                if hasattr(cls.model, key) and val is not None:
                    query = query.filter(getattr(cls.model, key) == val)
        col = getattr(cls.model, sort_by, None)
        if col is not None:
            query = query.order_by(col.desc() if sort_dir == 'desc' else col.asc())
        return query.paginate(page=page, per_page=per_page, error_out=False)

    @classmethod
    def get_by_id(cls, record_id):
        return cls.model.query.filter_by(id=record_id, is_active=True).first()

    @classmethod
    def create(cls, data: dict):
        record = cls.model(**data)
        db.session.add(record)
        db.session.commit()
        return record

    @classmethod
    def update(cls, record_id, data: dict):
        record = cls.get_by_id(record_id)
        if not record:
            return None
        for key, val in data.items():
            if hasattr(record, key):
                setattr(record, key, val)
        db.session.commit()
        return record

    @classmethod
    def delete(cls, record_id, soft=True):
        record = cls.get_by_id(record_id)
        if not record:
            return False
        if soft:
            record.is_active = False
            db.session.commit()
        else:
            db.session.delete(record)
            db.session.commit()
        return True

    @classmethod
    def bulk_create(cls, data_list: list):
        records = [cls.model(**d) for d in data_list]
        db.session.bulk_save_objects(records)
        db.session.commit()
        return records
