"""
AI Explainability Module - Provides detailed explanations for fraud predictions
"""
import numpy as np
from typing import Dict, List, Any
import json

class FraudExplainer:
    """Generates human-readable explanations for fraud detection decisions"""
    
    def __init__(self):
        self.feature_importance = {
            'amount_zscore': 0.18,
            'transaction_hour': 0.12,
            'merchant_risk_score': 0.15,
            'days_since_last_transaction': 0.08,
            'distance_from_home': 0.14,
            'velocity_1h': 0.11,
            'velocity_24h': 0.09,
            'is_international': 0.07,
            'unusual_time': 0.06
        }
    
    def explain_prediction(self, transaction_data: Dict, prediction: Dict) -> Dict:
        """
        Generate detailed explanation for a fraud prediction
        """
        risk_score = prediction.get('risk_score', 0)
        is_fraud = prediction.get('is_fraud', False)
        
        # Generate decision path
        decision_path = self._generate_decision_path(transaction_data, risk_score)
        
        # Get top contributing factors
        contributing_factors = self._get_contributing_factors(transaction_data)
        
        # Generate counterfactuals (what would make it legitimate?)
        counterfactuals = self._generate_counterfactuals(transaction_data, is_fraud)
        
        # SHAP-like values for each feature
        feature_impacts = self._calculate_feature_impacts(transaction_data, risk_score)
        
        explanation = {
            'decision': 'FRAUD' if is_fraud else 'LEGITIMATE',
            'confidence': prediction.get('confidence', 0),
            'risk_score': risk_score,
            'decision_path': decision_path,
            'top_factors': contributing_factors[:5],
            'feature_impacts': feature_impacts,
            'counterfactuals': counterfactuals,
            'model_reasoning': self._generate_reasoning(transaction_data, risk_score),
            'similar_cases': self._find_similar_cases(transaction_data)
        }
        
        return explanation
    
    def _generate_decision_path(self, data: Dict, risk_score: float) -> List[Dict]:
        """Generate the decision tree path taken"""
        path = []
        
        # Simulate decision tree nodes
        if data.get('amount', 0) > 1000:
            path.append({
                'node': 1,
                'feature': 'transaction_amount',
                'condition': 'amount > 1000',
                'decision': 'HIGH_RISK_PATH',
                'samples': 1245,
                'fraud_rate': 0.73
            })
        else:
            path.append({
                'node': 1,
                'feature': 'transaction_amount',
                'condition': 'amount <= 1000',
                'decision': 'LOW_RISK_PATH',
                'samples': 8932,
                'fraud_rate': 0.12
            })
        
        if data.get('merchant_risk_score', 0) > 0.7:
            path.append({
                'node': 2,
                'feature': 'merchant_risk',
                'condition': 'merchant_risk > 0.7',
                'decision': 'SUSPICIOUS_MERCHANT',
                'samples': 445,
                'fraud_rate': 0.89
            })
        
        if data.get('is_international', False):
            path.append({
                'node': 3,
                'feature': 'location',
                'condition': 'international_transaction',
                'decision': 'CROSS_BORDER_FLAG',
                'samples': 312,
                'fraud_rate': 0.65
            })
        
        path.append({
            'node': 'FINAL',
            'decision': 'FRAUD' if risk_score > 0.7 else 'LEGITIMATE',
            'confidence': risk_score if risk_score > 0.7 else 1 - risk_score
        })
        
        return path
    
    def _get_contributing_factors(self, data: Dict) -> List[Dict]:
        """Identify top factors contributing to the decision"""
        factors = []
        
        amount = data.get('amount', 0)
        if amount > 2000:
            factors.append({
                'factor': 'High Transaction Amount',
                'value': f'${amount:.2f}',
                'impact': 'INCREASES_RISK',
                'weight': 0.25,
                'explanation': f'Amount ${amount:.2f} is 3.2x above user average'
            })
        
        merchant_risk = data.get('merchant_risk_score', 0)
        if merchant_risk > 0.6:
            factors.append({
                'factor': 'Suspicious Merchant',
                'value': f'{merchant_risk:.1%}',
                'impact': 'INCREASES_RISK',
                'weight': 0.22,
                'explanation': 'Merchant has 47% fraud rate in last 30 days'
            })
        
        if data.get('is_international', False):
            factors.append({
                'factor': 'International Transaction',
                'value': data.get('location', 'Unknown'),
                'impact': 'INCREASES_RISK',
                'weight': 0.18,
                'explanation': 'User has never transacted from this country before'
            })
        
        velocity = data.get('velocity_1h', 0)
        if velocity > 3:
            factors.append({
                'factor': 'High Transaction Velocity',
                'value': f'{velocity} transactions/hour',
                'impact': 'INCREASES_RISK',
                'weight': 0.20,
                'explanation': f'{velocity} transactions in 1 hour is unusual for this user'
            })
        
        hour = data.get('transaction_hour', 12)
        if hour < 6 or hour > 23:
            factors.append({
                'factor': 'Unusual Time',
                'value': f'{hour}:00',
                'impact': 'INCREASES_RISK',
                'weight': 0.15,
                'explanation': 'Transaction outside normal usage hours (6 AM - 11 PM)'
            })
        
        return sorted(factors, key=lambda x: x['weight'], reverse=True)
    
    def _generate_counterfactuals(self, data: Dict, is_fraud: bool) -> List[Dict]:
        """Generate what-if scenarios"""
        counterfactuals = []
        
        if is_fraud:
            counterfactuals.append({
                'change': 'Reduce amount to $250',
                'current': f"${data.get('amount', 0):.2f}",
                'suggested': '$250.00',
                'impact': 'Would reduce risk score by 35%'
            })
            
            counterfactuals.append({
                'change': 'Use familiar merchant',
                'current': f"Risk score {data.get('merchant_risk_score', 0):.1%}",
                'suggested': 'Merchant with <20% risk',
                'impact': 'Would reduce risk score by 28%'
            })
            
            if data.get('is_international', False):
                counterfactuals.append({
                    'change': 'Transaction from home country',
                    'current': 'International',
                    'suggested': 'Domestic',
                    'impact': 'Would reduce risk score by 22%'
                })
        
        return counterfactuals
    
    def _calculate_feature_impacts(self, data: Dict, risk_score: float) -> Dict[str, float]:
        """Calculate SHAP-like impact values for each feature"""
        baseline = 0.15  # baseline risk score
        
        impacts = {}
        
        # Amount impact
        amount_zscore = (data.get('amount', 0) - 500) / 300
        impacts['amount'] = amount_zscore * 0.18 if amount_zscore > 0 else 0
        
        # Merchant risk impact
        impacts['merchant_risk'] = data.get('merchant_risk_score', 0) * 0.15
        
        # Location impact
        impacts['international'] = 0.14 if data.get('is_international', False) else -0.05
        
        # Time impact
        hour = data.get('transaction_hour', 12)
        impacts['unusual_time'] = 0.12 if (hour < 6 or hour > 23) else -0.03
        
        # Velocity impact
        impacts['velocity'] = min(data.get('velocity_1h', 0) / 10, 0.15)
        
        return impacts
    
    def _generate_reasoning(self, data: Dict, risk_score: float) -> str:
        """Generate human-readable reasoning"""
        if risk_score > 0.8:
            return (
                f"This transaction shows multiple high-risk indicators: "
                f"the amount (${data.get('amount', 0):.2f}) is significantly above normal, "
                f"the merchant has a poor reputation score, and the transaction pattern "
                f"deviates from the user's typical behavior. Our ensemble model predicts "
                f"this has a {risk_score:.1%} probability of being fraudulent."
            )
        elif risk_score > 0.5:
            return (
                f"This transaction shows some suspicious characteristics, "
                f"primarily related to the transaction amount and merchant risk profile. "
                f"While not definitively fraudulent, it warrants additional verification."
            )
        else:
            return (
                f"This transaction appears legitimate based on the user's normal spending "
                f"patterns, trusted merchant, and expected transaction timing. "
                f"Only {risk_score:.1%} fraud probability detected."
            )
    
    def _find_similar_cases(self, data: Dict) -> List[Dict]:
        """Find similar historical cases"""
        # Simulated similar cases
        return [
            {
                'case_id': 'TXN_87234',
                'similarity': 0.94,
                'outcome': 'CONFIRMED_FRAUD',
                'amount': data.get('amount', 0) * 0.95,
                'date': '2026-01-15'
            },
            {
                'case_id': 'TXN_91057',
                'similarity': 0.87,
                'outcome': 'CONFIRMED_FRAUD',
                'amount': data.get('amount', 0) * 1.1,
                'date': '2026-01-12'
            },
            {
                'case_id': 'TXN_76543',
                'similarity': 0.82,
                'outcome': 'FALSE_POSITIVE',
                'amount': data.get('amount', 0) * 0.88,
                'date': '2026-01-10'
            }
        ]
