"""
API client for testing fraud detection endpoints
"""

import requests
import json
import websocket
from datetime import datetime

BASE_URL = 'http://localhost:5000'


class FraudDetectionClient:
    """Client for interacting with fraud detection API"""
    
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
    
    def predict_single_transaction(self, transaction_data):
        """
        Predict fraud for a single transaction
        
        Example transaction:
        {
            'transaction_id': 'TXN001',
            'amount': 1250.50,
            'merchant_id': 'MER123',
            'merchant_category': 'retail',
            'user_id': 'USR001',
            'device_id': 'DEV001',
            'location': {'lat': 40.7128, 'lon': -74.0060},
            'timestamp': '2024-01-18T12:30:00',
            'account_created': '2023-01-01T00:00:00',
            'mcc_code': '5411'
        }
        """
        response = requests.post(
            f'{self.base_url}/api/predict',
            json=transaction_data,
            headers={'Content-Type': 'application/json'}
        )
        return response.json()
    
    def predict_batch(self, transactions):
        """Predict fraud for multiple transactions"""
        response = requests.post(
            f'{self.base_url}/api/batch-predict',
            json={'transactions': transactions},
            headers={'Content-Type': 'application/json'}
        )
        return response.json()
    
    def get_model_stats(self):
        """Get model statistics"""
        response = requests.get(f'{self.base_url}/api/model-stats')
        return response.json()
    
    def get_analytics(self, transactions):
        """Get analytics for transactions"""
        response = requests.post(
            f'{self.base_url}/api/analytics',
            json={'transactions': transactions},
            headers={'Content-Type': 'application/json'}
        )
        return response.json()
    
    def health_check(self):
        """Check API health"""
        response = requests.get(f'{self.base_url}/api/health')
        return response.json()


def test_api():
    """Test the API with sample transactions"""
    client = FraudDetectionClient()
    
    # Test 1: Health check
    print("1. Health Check")
    print("-" * 50)
    health = client.health_check()
    print(json.dumps(health, indent=2))
    print()
    
    # Test 2: Single prediction
    print("2. Single Transaction Prediction")
    print("-" * 50)
    transaction = {
        'transaction_id': 'TXN001',
        'amount': 1250.50,
        'merchant_id': 'MER123',
        'merchant_category': 'retail',
        'user_id': 'USR001',
        'device_id': 'DEV001',
        'location': {'lat': 40.7128, 'lon': -74.0060},
        'timestamp': datetime.now().isoformat(),
        'account_created': '2023-01-01T00:00:00',
        'mcc_code': '5411'
    }
    
    result = client.predict_single_transaction(transaction)
    print(json.dumps(result, indent=2))
    print()
    
    # Test 3: Model stats
    print("3. Model Statistics")
    print("-" * 50)
    stats = client.get_model_stats()
    print(json.dumps(stats, indent=2))
    print()
    
    # Test 4: Batch prediction
    print("4. Batch Prediction (Multiple Transactions)")
    print("-" * 50)
    transactions = [
        {
            'transaction_id': f'TXN{i:03d}',
            'amount': 100 * i,
            'merchant_id': f'MER{i}',
            'merchant_category': 'retail' if i % 2 == 0 else 'travel',
            'user_id': 'USR001',
            'device_id': 'DEV001',
            'location': {'lat': 40.7128 + i*0.01, 'lon': -74.0060 + i*0.01},
            'timestamp': datetime.now().isoformat(),
            'account_created': '2023-01-01T00:00:00',
            'mcc_code': '5411'
        }
        for i in range(1, 6)
    ]
    
    batch_result = client.predict_batch(transactions)
    print(json.dumps(batch_result, indent=2))
    print()


if __name__ == '__main__':
    print("=" * 50)
    print("FRAUD DETECTION API TEST")
    print("=" * 50)
    print()
    
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to API. Is the server running?")
        print("Start the server with: python backend/app.py")
