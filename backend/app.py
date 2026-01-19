"""
Advanced Fraud Detection System - Flask Backend
Real-time transaction processing with ensemble ML models
"""

import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import numpy as np
import json
from models import FraudDetectionEnsemble
from data_processor import TransactionProcessor
from explainability import FraudExplainer
from behavioral_biometrics import BiometricAnalyzer
from fraud_predictor import FraudPatternPredictor

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize ML models
fraud_detector = FraudDetectionEnsemble()
transaction_processor = TransactionProcessor()
fraud_explainer = FraudExplainer()
biometric_analyzer = BiometricAnalyzer()
pattern_predictor = FraudPatternPredictor()

# Store active connections
active_users = {}


# ==================== WebSocket Events ====================
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    emit('response', {'data': 'Connected to Fraud Detection System'})
    print(f"Client connected: {request.sid}")


@socketio.on('join')
def on_join(data):
    """Join a room for real-time updates"""
    user_id = data.get('user_id')
    join_room(user_id)
    active_users[request.sid] = user_id
    emit('status', {'msg': f'User {user_id} joined'})


@socketio.on('analyze_transaction')
def analyze_transaction(transaction_data):
    """Real-time transaction analysis via WebSocket"""
    try:
        # Process transaction
        features = transaction_processor.extract_features(transaction_data)
        
        # Get predictions from ensemble model
        prediction = fraud_detector.predict(features)
        risk_score = fraud_detector.get_risk_score(features)
        model_contributions = fraud_detector.get_model_contributions(features)
        
        response = {
            'transaction_id': transaction_data.get('transaction_id'),
            'is_fraud': bool(prediction),
            'risk_score': float(risk_score),
            'confidence': float(fraud_detector.get_confidence(features)),
            'model_insights': model_contributions,
            'timestamp': datetime.now().isoformat(),
            'recommendation': 'BLOCK' if risk_score > 0.8 else 'REVIEW' if risk_score > 0.5 else 'APPROVE'
        }
        
        emit('prediction', response, room=active_users.get(request.sid))
        
    except Exception as e:
        emit('error', {'message': str(e)})


# ==================== REST API Endpoints ====================
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models_loaded': fraud_detector.is_loaded()
    })


@app.route('/api/predict', methods=['POST'])
def predict_fraud():
    """Predict fraud for a single transaction"""
    try:
        data = request.json
        
        # Extract and process features
        features = transaction_processor.extract_features(data)
        
        # Get ensemble predictions
        prediction = fraud_detector.predict(features)
        risk_score = fraud_detector.get_risk_score(features)
        confidence = fraud_detector.get_confidence(features)
        model_contributions = fraud_detector.get_model_contributions(features)
        
        return jsonify({
            'success': True,
            'transaction_id': data.get('transaction_id'),
            'is_fraud': bool(prediction),
            'risk_score': float(risk_score),
            'confidence': float(confidence),
            'model_insights': model_contributions,
            'explanation': generate_explanation(features, risk_score, model_contributions),
            'recommendation': 'BLOCK' if risk_score > 0.8 else 'REVIEW' if risk_score > 0.5 else 'APPROVE'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    """Batch predict fraud for multiple transactions"""
    try:
        data = request.json
        transactions = data.get('transactions', [])
        
        results = []
        for transaction in transactions:
            features = transaction_processor.extract_features(transaction)
            prediction = fraud_detector.predict(features)
            risk_score = fraud_detector.get_risk_score(features)
            
            results.append({
                'transaction_id': transaction.get('transaction_id'),
                'is_fraud': bool(prediction),
                'risk_score': float(risk_score),
                'recommendation': 'BLOCK' if risk_score > 0.8 else 'REVIEW' if risk_score > 0.5 else 'APPROVE'
            })
        
        return jsonify({
            'success': True,
            'total': len(transactions),
            'fraud_detected': sum(1 for r in results if r['is_fraud']),
            'results': results
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/model-stats', methods=['GET'])
def get_model_stats():
    """Get model statistics and performance metrics"""
    return jsonify({
        'models': fraud_detector.get_model_info(),
        'ensemble_method': 'Voting Classifier with weighted averaging',
        'features_used': transaction_processor.get_feature_names(),
        'feature_importance': fraud_detector.get_feature_importance(),
        'last_updated': datetime.now().isoformat()
    })


@app.route('/api/analytics', methods=['POST'])
def get_analytics():
    """Get analytics for a set of transactions"""
    try:
        data = request.json
        transactions = data.get('transactions', [])
        
        fraud_patterns = analyze_patterns(transactions)
        
        return jsonify({
            'success': True,
            'total_transactions': len(transactions),
            'fraud_patterns': fraud_patterns,
            'risk_distribution': calculate_risk_distribution(transactions),
            'anomalies': detect_anomalies(transactions)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ==================== Helper Functions ====================
def generate_explanation(features, risk_score, model_contributions):
    """Generate human-readable explanation for fraud prediction"""
    if risk_score > 0.8:
        return "High fraud risk detected. Multiple anomalies found in transaction pattern."
    elif risk_score > 0.5:
        return "Moderate fraud risk. Transaction requires manual review."
    else:
        return "Low fraud risk. Transaction appears legitimate."


def analyze_patterns(transactions):
    """Analyze fraud patterns in transactions"""
    patterns = {
        'high_amount_transactions': 0,
        'unusual_timing': 0,
        'geographic_anomalies': 0,
        'velocity_issues': 0
    }
    
    for transaction in transactions:
        features = transaction_processor.extract_features(transaction)
        if features['amount'] > np.percentile([t['amount'] for t in transactions], 95):
            patterns['high_amount_transactions'] += 1
    
    return patterns


def calculate_risk_distribution(transactions):
    """Calculate distribution of risk scores"""
    risk_scores = []
    for transaction in transactions:
        features = transaction_processor.extract_features(transaction)
        risk_score = fraud_detector.get_risk_score(features)
        risk_scores.append(risk_score)
    
    return {
        'high_risk': sum(1 for s in risk_scores if s > 0.8),
        'medium_risk': sum(1 for s in risk_scores if 0.5 <= s <= 0.8),
        'low_risk': sum(1 for s in risk_scores if s < 0.5),
        'average_score': float(np.mean(risk_scores))
    }


def detect_anomalies(transactions):
    """Detect anomalies in transaction data"""
    anomalies = []
    # Implement anomaly detection logic
    return anomalies


# ==================== NEW UNIQUE FEATURES ====================

@app.route('/api/explain', methods=['POST'])
def explain_prediction():
    """Get detailed AI explainability for a transaction"""
    try:
        data = request.json
        
        # Process transaction
        features = transaction_processor.extract_features(data)
        prediction = {
            'is_fraud': bool(fraud_detector.predict(features)),
            'risk_score': float(fraud_detector.get_risk_score(features)),
            'confidence': float(fraud_detector.get_confidence(features))
        }
        
        # Generate detailed explanation
        explanation = fraud_explainer.explain_prediction(data, prediction)
        
        return jsonify({
            'success': True,
            'transaction_id': data.get('transaction_id'),
            'explanation': explanation
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/biometric-analysis', methods=['POST'])
def analyze_biometrics():
    """Analyze behavioral biometrics"""
    try:
        data = request.json
        
        # Analyze behavioral patterns
        analysis = biometric_analyzer.analyze_behavioral_patterns(data)
        
        return jsonify({
            'success': True,
            'user_id': data.get('user_id'),
            'analysis': analysis
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/predict-patterns', methods=['GET'])
def predict_fraud_patterns():
    """Predict emerging fraud patterns for next 30 days"""
    try:
        days = request.args.get('days', 30, type=int)
        
        # Get predictions
        predictions = pattern_predictor.predict_emerging_patterns(days)
        
        return jsonify({
            'success': True,
            'predictions': predictions
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/geographic-heatmap', methods=['POST'])
def get_geographic_heatmap():
    """Get geographic fraud heatmap data"""
    try:
        data = request.json
        transactions = data.get('transactions', [])
        
        # Generate heatmap data
        heatmap_data = generate_heatmap_data(transactions)
        
        return jsonify({
            'success': True,
            'heatmap': heatmap_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/realtime-alerts', methods=['GET'])
def get_realtime_alerts():
    """Get real-time fraud alerts"""
    try:
        # Generate mock real-time alerts
        alerts = generate_mock_alerts()
        
        return jsonify({
            'success': True,
            'alerts': alerts,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/export-report', methods=['POST'])
def export_report():
    """Export fraud detection report"""
    try:
        data = request.json
        report_type = data.get('type', 'summary')
        date_range = data.get('date_range', {})
        
        report = generate_report(report_type, date_range)
        
        return jsonify({
            'success': True,
            'report': report,
            'generated_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


def generate_heatmap_data(transactions):
    """Generate geographic heatmap data"""
    locations = {}
    
    for transaction in transactions:
        loc = transaction.get('location', 'Unknown')
        features = transaction_processor.extract_features(transaction)
        risk_score = fraud_detector.get_risk_score(features)
        
        if loc not in locations:
            locations[loc] = {
                'count': 0,
                'total_risk': 0,
                'lat': transaction.get('latitude', 0),
                'lng': transaction.get('longitude', 0)
            }
        
        locations[loc]['count'] += 1
        locations[loc]['total_risk'] += risk_score
    
    # Convert to heatmap format
    heatmap = []
    for loc, data in locations.items():
        heatmap.append({
            'location': loc,
            'lat': data['lat'],
            'lng': data['lng'],
            'intensity': data['total_risk'] / data['count'],
            'transaction_count': data['count']
        })
    
    return heatmap


def generate_mock_alerts():
    """Generate mock real-time alerts"""
    return [
        {
            'id': 'ALT-001',
            'severity': 'HIGH',
            'type': 'Unusual Transaction Pattern',
            'message': 'Multiple high-value transactions from new device',
            'timestamp': datetime.now().isoformat(),
            'affected_accounts': 3
        },
        {
            'id': 'ALT-002',
            'severity': 'CRITICAL',
            'type': 'Credential Stuffing Attack',
            'message': 'Bot-like login attempts detected',
            'timestamp': datetime.now().isoformat(),
            'affected_accounts': 15
        }
    ]


def generate_report(report_type, date_range):
    """Generate fraud detection report"""
    return {
        'type': report_type,
        'date_range': date_range,
        'summary': {
            'total_transactions': 5420,
            'fraud_detected': 147,
            'fraud_rate': 2.71,
            'amount_saved': '$284,500'
        },
        'top_fraud_types': [
            {'type': 'Card Fraud', 'count': 54},
            {'type': 'Account Takeover', 'count': 42},
            {'type': 'Identity Theft', 'count': 31}
        ]
    }


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
