from flask import Flask, jsonify
from app.config import Config
from app.extensions import db, jwt, cors, migrate

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    migrate.init_app(app, db)

    # Register blueprints (placeholders)
    # from app.api.routes.auth import auth_bp
    # from app.api.routes.dashboard import dashboard_bp
    # app.register_blueprint(auth_bp, url_prefix='/api/auth')
    # app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

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

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
