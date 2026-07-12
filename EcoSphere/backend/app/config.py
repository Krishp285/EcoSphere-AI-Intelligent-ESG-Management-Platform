import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'ecosphere-dev-secret-key-2024')

    # Use SQLite for demo if MySQL not configured
    _mysql_url = os.environ.get('DATABASE_URL')
    SQLALCHEMY_DATABASE_URI = _mysql_url if _mysql_url else 'sqlite:///ecosphere_demo.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 280,
        'pool_pre_ping': True,
    }

    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'ecosphere-jwt-secret-2024')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*')
