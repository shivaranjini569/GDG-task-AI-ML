"""
Configuration file for Fraud Detection System
"""

import os
from datetime import timedelta

class Config:
    """Base configuration"""
    
    # Flask
    DEBUG = os.getenv('FLASK_DEBUG', True)
    TESTING = os.getenv('TESTING', False)
    SECRET_KEY = os.getenv('API_SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Server
    HOST = os.getenv('API_HOST', '0.0.0.0')
    PORT = int(os.getenv('API_PORT', 5000))
    
    # ML Models
    ML_MODEL_PATH = os.getenv('ML_MODEL_PATH', './models/')
    MODEL_UPDATE_INTERVAL = int(os.getenv('MODEL_UPDATE_INTERVAL', 86400))
    
    # Thresholds
    HIGH_RISK_THRESHOLD = float(os.getenv('HIGH_RISK_THRESHOLD', 0.8))
    MEDIUM_RISK_THRESHOLD = float(os.getenv('MEDIUM_RISK_THRESHOLD', 0.5))
    ALERT_THRESHOLD = float(os.getenv('ALERT_THRESHOLD', 0.75))
    
    # Features
    ENABLE_REAL_TIME_MONITORING = os.getenv('ENABLE_REAL_TIME_MONITORING', 'true').lower() == 'true'
    ENABLE_BATCH_PROCESSING = os.getenv('ENABLE_BATCH_PROCESSING', 'true').lower() == 'true'
    ENABLE_ALERTS = os.getenv('ENABLE_ALERTS', 'true').lower() == 'true'
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5000')
    
    # Database
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///fraudshield.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', './logs/app.log')


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    DATABASE_URL = 'sqlite:///:memory:'


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'development')
    return config.get(env, config['default'])
