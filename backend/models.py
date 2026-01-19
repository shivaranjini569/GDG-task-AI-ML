"""
Ensemble Machine Learning Models for Fraud Detection
Combines multiple algorithms for robust predictions
"""

import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import xgboost as xgb
import lightgbm as lgb
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
import joblib


class FraudDetectionEnsemble:
    """
    Ensemble model combining multiple algorithms:
    - XGBoost
    - LightGBM
    - Random Forest
    - Gradient Boosting
    - Logistic Regression
    - SVM
    """
    
    def __init__(self, model_path='models/'):
        self.model_path = model_path
        self.models = {}
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=15)
        self.ensemble = None
        self.feature_importance = None
        self.model_weights = {
            'xgboost': 0.3,
            'lightgbm': 0.3,
            'random_forest': 0.2,
            'gradient_boosting': 0.1,
            'logistic_regression': 0.05,
            'svm': 0.05
        }
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize all base models"""
        # XGBoost
        self.models['xgboost'] = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=7,
            learning_rate=0.1,
            random_state=42,
            scale_pos_weight=10  # Handle class imbalance
        )
        
        # LightGBM
        self.models['lightgbm'] = lgb.LGBMClassifier(
            n_estimators=100,
            max_depth=7,
            learning_rate=0.1,
            random_state=42,
            is_unbalance=True
        )
        
        # Random Forest
        self.models['random_forest'] = RandomForestClassifier(
            n_estimators=100,
            max_depth=15,
            random_state=42,
            class_weight='balanced'
        )
        
        # Gradient Boosting
        self.models['gradient_boosting'] = GradientBoostingClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42
        )
        
        # Logistic Regression
        self.models['logistic_regression'] = LogisticRegression(
            max_iter=1000,
            random_state=42,
            class_weight='balanced'
        )
        
        # SVM
        self.models['svm'] = SVC(
            kernel='rbf',
            probability=True,
            random_state=42,
            class_weight='balanced'
        )
    
    def train(self, X_train, y_train):
        """Train all models"""
        # Scale features
        X_scaled = self.scaler.fit_transform(X_train)
        X_pca = self.pca.fit_transform(X_scaled)
        
        # Train each model
        for name, model in self.models.items():
            print(f"Training {name}...")
            model.fit(X_scaled, y_train)
            print(f"{name} trained successfully")
        
        # Store feature importance from tree-based models
        if hasattr(self.models['xgboost'], 'feature_importances_'):
            self.feature_importance = self.models['xgboost'].feature_importances_
        
        print("All models trained successfully!")
    
    def predict(self, features):
        """
        Make predictions using ensemble voting
        Returns 1 for fraud, 0 for legitimate
        """
        features_scaled = self.scaler.transform([features]).reshape(1, -1)
        
        predictions = {}
        for name, model in self.models.items():
            pred = model.predict(features_scaled)[0]
            predictions[name] = pred
        
        # Weighted voting
        weighted_sum = sum(predictions[name] * self.model_weights[name] 
                          for name in predictions)
        
        return 1 if weighted_sum > 0.5 else 0
    
    def get_risk_score(self, features):
        """
        Get fraud risk score (0-1)
        """
        features_scaled = self.scaler.transform([features]).reshape(1, -1)
        
        probabilities = []
        for name, model in self.models.items():
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(features_scaled)[0][1]
            else:
                # For SVM, use decision_function
                decision = model.decision_function(features_scaled)[0]
                proba = 1 / (1 + np.exp(-decision))  # Sigmoid conversion
            
            probabilities.append(proba * self.model_weights[name])
        
        risk_score = np.sum(probabilities)
        return min(max(risk_score, 0), 1)  # Clamp between 0 and 1
    
    def get_confidence(self, features):
        """Get confidence level of prediction"""
        features_scaled = self.scaler.transform([features]).reshape(1, -1)
        
        probabilities = []
        for name, model in self.models.items():
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(features_scaled)[0][1]
            else:
                decision = model.decision_function(features_scaled)[0]
                proba = 1 / (1 + np.exp(-decision))
            probabilities.append(proba)
        
        # Confidence is inversely related to variance in predictions
        variance = np.var(probabilities)
        confidence = 1 - variance
        return min(max(confidence, 0), 1)
    
    def get_model_contributions(self, features):
        """Get individual model contributions to prediction"""
        features_scaled = self.scaler.transform([features]).reshape(1, -1)
        
        contributions = {}
        for name, model in self.models.items():
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(features_scaled)[0][1]
            else:
                decision = model.decision_function(features_scaled)[0]
                proba = 1 / (1 + np.exp(-decision))
            
            contributions[name] = {
                'probability': float(proba),
                'weight': self.model_weights[name],
                'contribution': float(proba * self.model_weights[name])
            }
        
        return contributions
    
    def get_feature_importance(self):
        """Get feature importance scores"""
        if self.feature_importance is not None:
            return {
                'values': self.feature_importance.tolist(),
                'method': 'XGBoost Gain'
            }
        return {}
    
    def get_model_info(self):
        """Get information about all models"""
        return {
            model_name: {
                'type': type(model).__name__,
                'weight': self.model_weights[model_name]
            }
            for model_name, model in self.models.items()
        }
    
    def is_loaded(self):
        """Check if models are properly loaded"""
        return len(self.models) > 0
    
    def save_models(self, path='models/'):
        """Save trained models"""
        os.makedirs(path, exist_ok=True)
        for name, model in self.models.items():
            joblib.dump(model, f'{path}/{name}_model.pkl')
        joblib.dump(self.scaler, f'{path}/scaler.pkl')
        joblib.dump(self.pca, f'{path}/pca.pkl')
    
    def load_models(self, path='models/'):
        """Load pre-trained models"""
        try:
            for name in self.models.keys():
                self.models[name] = joblib.load(f'{path}/{name}_model.pkl')
            self.scaler = joblib.load(f'{path}/scaler.pkl')
            self.pca = joblib.load(f'{path}/pca.pkl')
            return True
        except:
            return False
