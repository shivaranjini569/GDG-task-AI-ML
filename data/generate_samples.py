"""
Sample transaction data for testing
"""

import json
from datetime import datetime, timedelta
import random

def generate_sample_transactions(count=100):
    """Generate sample transaction data for testing"""
    
    merchants = [
        {'name': 'Amazon', 'category': 'retail', 'mcc': '5411'},
        {'name': 'Walmart', 'category': 'retail', 'mcc': '5411'},
        {'name': 'United Airlines', 'category': 'travel', 'mcc': '4511'},
        {'name': 'Marriott Hotels', 'category': 'travel', 'mcc': '7011'},
        {'name': 'Starbucks', 'category': 'food', 'mcc': '5814'},
        {'name': 'McDonald\'s', 'category': 'food', 'mcc': '5814'},
        {'name': 'Casino Royal', 'category': 'gambling', 'mcc': '7994'},
        {'name': 'Bitcoin Exchange', 'category': 'cryptocurrency', 'mcc': '6211'},
        {'name': 'Western Union', 'category': 'money_transfer', 'mcc': '7271'},
        {'name': 'Best Buy', 'category': 'retail', 'mcc': '5731'},
    ]
    
    transactions = []
    base_time = datetime.now()
    
    for i in range(count):
        merchant = random.choice(merchants)
        
        # Normal transactions mostly, some fraudulent
        is_fraud = random.random() < 0.05  # 5% fraud rate
        
        if is_fraud:
            amount = random.uniform(5000, 15000)
            hour = random.choice([23, 0, 1, 2, 3, 4])  # Late night
        else:
            amount = random.uniform(10, 500)
            hour = random.randint(9, 20)
        
        transaction = {
            'transaction_id': f'TXN{i+1:06d}',
            'amount': round(amount, 2),
            'merchant_id': f'MER{random.randint(1000, 9999)}',
            'merchant': merchant['name'],
            'merchant_category': merchant['category'],
            'mcc_code': merchant['mcc'],
            'user_id': f'USR{random.randint(1, 1000):04d}',
            'device_id': f'DEV{random.randint(1, 100):03d}',
            'location': {
                'lat': round(random.uniform(25, 50), 4),
                'lon': round(random.uniform(-130, -65), 4),
                'city': random.choice(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'])
            },
            'timestamp': (base_time - timedelta(hours=random.randint(0, 24), minutes=random.randint(0, 60))).isoformat(),
            'account_created': (base_time - timedelta(days=random.randint(30, 730))).isoformat(),
            'is_fraud': is_fraud,
            'status': 'blocked' if is_fraud else random.choice(['approved', 'approved', 'approved', 'review'])
        }
        
        transactions.append(transaction)
    
    return transactions


def save_sample_data(filepath, count=100):
    """Save sample transactions to JSON file"""
    transactions = generate_sample_transactions(count)
    
    with open(filepath, 'w') as f:
        json.dump(transactions, f, indent=2)
    
    print(f"✓ Generated {count} sample transactions")
    print(f"✓ Saved to: {filepath}")


def load_sample_data(filepath):
    """Load sample transactions from JSON file"""
    with open(filepath, 'r') as f:
        transactions = json.load(f)
    
    print(f"✓ Loaded {len(transactions)} transactions from {filepath}")
    return transactions


if __name__ == '__main__':
    # Generate and save sample data
    save_sample_data('data/sample_transactions.json', count=1000)
    
    # Display first few samples
    data = load_sample_data('data/sample_transactions.json')
    print("\nSample transactions:")
    for txn in data[:3]:
        print(json.dumps(txn, indent=2))
