from flask import Flask, jsonify
from app.config import Config
from app.extensions import db, jwt, cors, migrate


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    migrate.init_app(app, db)

    # Register blueprints
    from app.api.routes.auth import auth_bp
    from app.api.routes.environment import environment_bp
    from app.api.routes.social import social_bp
    from app.api.routes.governance import governance_bp
    from app.api.routes.gamification import gamification_bp
    from app.api.routes.notification import notification_bp
    from app.api.routes.setting import setting_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(environment_bp, url_prefix='/api/environment')
    app.register_blueprint(social_bp, url_prefix='/api/social')
    app.register_blueprint(governance_bp, url_prefix='/api/governance')
    app.register_blueprint(gamification_bp, url_prefix='/api/gamification')
    app.register_blueprint(notification_bp, url_prefix='/api/notification')
    app.register_blueprint(setting_bp, url_prefix='/api/setting')

    # Auto-create tables (safe for SQLite + demo)
    with app.app_context():
        # Import all models so SQLAlchemy knows about them
        from app.models import user, environment, social, governance, gamification, notification, setting  # noqa
        db.create_all()

    # Health check
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "success", "message": "EcoSphere API is running!"}), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"status": "error", "message": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"status": "error", "message": "Internal server error"}), 500

    return app


# Create app instance for Gunicorn
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)