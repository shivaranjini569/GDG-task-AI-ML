"""
Data Processing and Feature Engineering for Fraud Detection
Extracts advanced features from transaction data
"""

import numpy as np
import pandas as pd
from datetime import datetime
from scipy import stats


class TransactionProcessor:
    """
    Process raw transaction data and extract meaningful features
    for machine learning models
    """
    
    def __init__(self):
        self.feature_names = [
            'amount', 'merchant_category', 'time_of_day', 'day_of_week',
            'transaction_frequency', 'amount_deviation', 'merchant_velocity',
            'geographic_distance', 'device_consistency', 'account_age',
            'mcc_code_risk', 'velocity_24h', 'velocity_1h', 'amount_percentile',
            'late_night_flag'
        ]
        self.transaction_history = {}
    
    def extract_features(self, transaction):
        """
        Extract and engineer features from raw transaction data
        """
        features = []
        
        # 1. Amount-based features
        amount = transaction.get('amount', 0)
        features.append(self._normalize(amount, 0, 10000))
        
        # 2. Merchant category risk score
        merchant_category = transaction.get('merchant_category', 'unknown')
        features.append(self._get_category_risk(merchant_category))
        
        # 3. Time-based features
        timestamp = transaction.get('timestamp', datetime.now())
        features.extend(self._extract_time_features(timestamp))
        
        # 4. Transaction frequency
        user_id = transaction.get('user_id', 'unknown')
        features.append(self._get_transaction_frequency(user_id))
        
        # 5. Amount deviation from user average
        features.append(self._get_amount_deviation(user_id, amount))
        
        # 6. Merchant velocity (how many transactions at this merchant)
        merchant_id = transaction.get('merchant_id', 'unknown')
        features.append(self._get_merchant_velocity(merchant_id))
        
        # 7. Geographic distance from last transaction
        location = transaction.get('location', {'lat': 0, 'lon': 0})
        features.append(self._calculate_geographic_distance(user_id, location))
        
        # 8. Device consistency
        device_id = transaction.get('device_id', 'unknown')
        features.append(self._get_device_consistency(user_id, device_id))
        
        # 9. Account age in days
        account_created = transaction.get('account_created', datetime.now())
        features.append(self._calculate_account_age(account_created))
        
        # 10. MCC Code Risk Score
        mcc_code = transaction.get('mcc_code', '0000')
        features.append(self._get_mcc_risk_score(mcc_code))
        
        # 11. Velocity metrics (transactions in last 24h and 1h)
        features.extend(self._get_velocity_metrics(user_id))
        
        # 12. Amount percentile among user's transactions
        features.append(self._get_amount_percentile(user_id, amount))
        
        # 13. Late night flag
        hour = datetime.fromisoformat(str(timestamp)).hour if isinstance(timestamp, str) else timestamp.hour
        features.append(1.0 if (hour >= 23 or hour <= 5) else 0.0)
        
        return np.array(features)
    
    def _normalize(self, value, min_val, max_val):
        """Normalize value between 0 and 1"""
        if max_val == min_val:
            return 0.0
        normalized = (value - min_val) / (max_val - min_val)
        return min(max(normalized, 0), 1)
    
    def _get_category_risk(self, category):
        """Get risk score for merchant category"""
        high_risk_categories = {
            'gambling': 0.9, 'wire_transfer': 0.85, 'cryptocurrency': 0.8,
            'cash_advance': 0.75, 'forex': 0.7, 'money_transfer': 0.65
        }
        medium_risk_categories = {
            'travel': 0.5, 'hotel': 0.45, 'rental': 0.4, 'online_retail': 0.35
        }
        return high_risk_categories.get(
            category.lower(), 
            medium_risk_categories.get(category.lower(), 0.2)
        )
    
    def _extract_time_features(self, timestamp):
        """Extract time-based features"""
        if isinstance(timestamp, str):
            dt = datetime.fromisoformat(timestamp)
        else:
            dt = timestamp if isinstance(timestamp, datetime) else datetime.now()
        
        hour = dt.hour / 24.0  # Normalized hour
        day_of_week = dt.weekday() / 7.0  # Normalized day
        
        # High-risk hours (late night, early morning)
        high_risk_hours = 1.0 if (dt.hour >= 23 or dt.hour <= 5) else 0.0
        
        return [hour, day_of_week, high_risk_hours]
    
    def _get_transaction_frequency(self, user_id):
        """Get transaction frequency for user"""
        if user_id not in self.transaction_history:
            self.transaction_history[user_id] = {'transactions': [], 'last_location': None}
        
        freq = len(self.transaction_history[user_id]['transactions'])
        # Normalize: 0 for new users, 1 for very frequent users
        return min(freq / 100.0, 1.0)
    
    def _get_amount_deviation(self, user_id, current_amount):
        """Calculate deviation from user's typical transaction amount"""
        if user_id not in self.transaction_history:
            return 0.0
        
        amounts = self.transaction_history[user_id]['transactions']
        if not amounts:
            return 0.0
        
        avg_amount = np.mean(amounts)
        std_amount = np.std(amounts)
        
        if std_amount == 0:
            return 0.0
        
        z_score = (current_amount - avg_amount) / std_amount
        # Return deviation score (0 to 1)
        return min(abs(z_score) / 3.0, 1.0)  # Clamp at 3 standard deviations
    
    def _get_merchant_velocity(self, merchant_id):
        """Get merchant transaction velocity"""
        # In production, this would query transaction history
        # For now, return a mock value
        return np.random.uniform(0, 1)
    
    def _calculate_geographic_distance(self, user_id, location):
        """Calculate distance from last transaction location"""
        if user_id not in self.transaction_history:
            return 0.0
        
        last_location = self.transaction_history[user_id]['last_location']
        if not last_location:
            return 0.0
        
        # Haversine distance (simplified)
        lat_diff = (location.get('lat', 0) - last_location.get('lat', 0)) ** 2
        lon_diff = (location.get('lon', 0) - last_location.get('lon', 0)) ** 2
        distance = np.sqrt(lat_diff + lon_diff)
        
        # Normalize (max distance ~180 degrees)
        return min(distance / 180.0, 1.0)
    
    def _get_device_consistency(self, user_id, device_id):
        """Check device consistency with user's history"""
        if user_id not in self.transaction_history:
            return 0.5  # New user
        
        # In production, track devices used
        return 0.8  # Mock: usually consistent
    
    def _calculate_account_age(self, account_created):
        """Calculate account age in normalized days"""
        if isinstance(account_created, str):
            created = datetime.fromisoformat(account_created)
        else:
            created = account_created if isinstance(account_created, datetime) else datetime.now()
        
        age_days = (datetime.now() - created).days
        # Normalize: 0 for brand new, 1 for >2 years
        return min(age_days / 730.0, 1.0)
    
    def _get_mcc_risk_score(self, mcc_code):
        """Get risk score based on MCC code"""
        high_risk_mccs = {
            '6211', '6051', '6052', '7995', '7994', '5699', '5960', '5962'
        }
        return 0.8 if mcc_code in high_risk_mccs else 0.3
    
    def _get_velocity_metrics(self, user_id):
        """Get velocity metrics for last 24h and 1h"""
        # In production, query actual transaction history
        velocity_24h = np.random.uniform(0, 1)
        velocity_1h = np.random.uniform(0, 1)
        return [velocity_24h, velocity_1h]
    
    def _get_amount_percentile(self, user_id, amount):
        """Get amount percentile among user's transactions"""
        if user_id not in self.transaction_history:
            return 0.5
        
        amounts = self.transaction_history[user_id]['transactions']
        if not amounts:
            return 0.5
        
        percentile = (len([a for a in amounts if a <= amount]) / len(amounts))
        return percentile
    
    def update_history(self, user_id, transaction):
        """Update transaction history for user"""
        if user_id not in self.transaction_history:
            self.transaction_history[user_id] = {'transactions': [], 'last_location': None}
        
        self.transaction_history[user_id]['transactions'].append(
            transaction.get('amount', 0)
        )
        self.transaction_history[user_id]['last_location'] = transaction.get('location')
    
    def get_feature_names(self):
        """Get list of feature names"""
        return self.feature_names
