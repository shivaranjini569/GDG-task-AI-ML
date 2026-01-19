"""
Model training and evaluation script
Trains the ensemble fraud detection model on transaction data
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
import sys
sys.path.insert(0, '../backend')

from models import FraudDetectionEnsemble
from data_processor import TransactionProcessor

# Configuration
RANDOM_STATE = 42
TEST_SIZE = 0.2
N_FOLDS = 5


def generate_synthetic_data(n_samples=10000):
    """
    Generate synthetic transaction data for training
    In production, this would load real transaction data
    """
    np.random.seed(RANDOM_STATE)
    
    n_features = 15
    X = np.random.randn(n_samples, n_features)
    
    # Create fraud patterns
    y = np.zeros(n_samples)
    fraud_indices = np.random.choice(n_samples, size=int(n_samples * 0.02), replace=False)
    
    # Make fraud transactions have different distributions
    X[fraud_indices] += np.random.randn(len(fraud_indices), n_features) * 2
    y[fraud_indices] = 1
    
    return X, y


def train_ensemble_model():
    """Train the ensemble model"""
    print("=" * 60)
    print("FRAUD DETECTION ENSEMBLE MODEL TRAINING")
    print("=" * 60)
    
    # Generate synthetic data
    print("\n1. Generating synthetic transaction data...")
    X, y = generate_synthetic_data(n_samples=10000)
    print(f"   - Total samples: {len(X)}")
    print(f"   - Fraud cases: {np.sum(y)} ({np.sum(y)/len(y)*100:.2f}%)")
    print(f"   - Legitimate cases: {len(y) - np.sum(y)} ({(1-np.sum(y)/len(y))*100:.2f}%)")
    
    # Split data
    print("\n2. Splitting data into train/test sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    print(f"   - Training set: {len(X_train)} samples")
    print(f"   - Test set: {len(X_test)} samples")
    
    # Initialize and train ensemble
    print("\n3. Training ensemble models...")
    ensemble = FraudDetectionEnsemble()
    ensemble.train(X_train, y_train)
    
    # Cross-validation
    print("\n4. Performing cross-validation...")
    skf = StratifiedKFold(n_splits=N_FOLDS, shuffle=True, random_state=RANDOM_STATE)
    cv_scores = []
    
    for fold, (train_idx, val_idx) in enumerate(skf.split(X_train, y_train)):
        X_cv_train = X_train[train_idx]
        y_cv_train = y_train[train_idx]
        X_cv_val = X_train[val_idx]
        y_cv_val = y_train[val_idx]
        
        # Train on fold
        ensemble.train(X_cv_train, y_cv_train)
        
        # Evaluate
        predictions = np.array([ensemble.predict(x) for x in X_cv_val])
        accuracy = np.mean(predictions == y_cv_val)
        cv_scores.append(accuracy)
        print(f"   Fold {fold+1}/{N_FOLDS}: Accuracy = {accuracy:.4f}")
    
    print(f"   Average CV Accuracy: {np.mean(cv_scores):.4f} (+/- {np.std(cv_scores):.4f})")
    
    # Test set evaluation
    print("\n5. Evaluating on test set...")
    y_pred = np.array([ensemble.predict(x) for x in X_test])
    y_proba = np.array([ensemble.get_risk_score(x) for x in X_test])
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, 
                              target_names=['Legitimate', 'Fraud']))
    
    # ROC-AUC
    roc_auc = roc_auc_score(y_test, y_proba)
    print(f"\nROC-AUC Score: {roc_auc:.4f}")
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    print(f"\nConfusion Matrix:")
    print(cm)
    
    tn, fp, fn, tp = cm.ravel()
    print(f"  - True Negatives: {tn}")
    print(f"  - False Positives: {fp}")
    print(f"  - False Negatives: {fn}")
    print(f"  - True Positives: {tp}")
    
    # Save models
    print("\n6. Saving trained models...")
    ensemble.save_models('models/')
    print("   Models saved successfully!")
    
    # Generate visualizations
    print("\n7. Generating visualizations...")
    generate_visualizations(y_test, y_pred, y_proba, cm)
    
    print("\n" + "=" * 60)
    print("TRAINING COMPLETE!")
    print("=" * 60)
    
    return ensemble, (X_train, X_test, y_train, y_test)


def generate_visualizations(y_test, y_pred, y_proba, cm):
    """Generate evaluation visualizations"""
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    
    # Confusion Matrix
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[0, 0],
                xticklabels=['Legitimate', 'Fraud'],
                yticklabels=['Legitimate', 'Fraud'])
    axes[0, 0].set_title('Confusion Matrix')
    axes[0, 0].set_ylabel('True Label')
    axes[0, 0].set_xlabel('Predicted Label')
    
    # ROC Curve
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    roc_auc = roc_auc_score(y_test, y_proba)
    axes[0, 1].plot(fpr, tpr, color='darkorange', lw=2, 
                   label=f'ROC curve (AUC = {roc_auc:.3f})')
    axes[0, 1].plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    axes[0, 1].set_xlim([0.0, 1.0])
    axes[0, 1].set_ylim([0.0, 1.05])
    axes[0, 1].set_xlabel('False Positive Rate')
    axes[0, 1].set_ylabel('True Positive Rate')
    axes[0, 1].set_title('ROC Curve')
    axes[0, 1].legend(loc="lower right")
    
    # Probability Distribution
    axes[1, 0].hist(y_proba[y_test == 0], bins=30, alpha=0.7, label='Legitimate', color='green')
    axes[1, 0].hist(y_proba[y_test == 1], bins=30, alpha=0.7, label='Fraud', color='red')
    axes[1, 0].set_xlabel('Risk Score')
    axes[1, 0].set_ylabel('Frequency')
    axes[1, 0].set_title('Risk Score Distribution')
    axes[1, 0].legend()
    
    # Metrics Comparison
    metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    values = [
        accuracy_score(y_test, y_pred),
        precision_score(y_test, y_pred),
        recall_score(y_test, y_pred),
        f1_score(y_test, y_pred)
    ]
    axes[1, 1].bar(metrics, values, color=['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'])
    axes[1, 1].set_ylim([0, 1.1])
    axes[1, 1].set_ylabel('Score')
    axes[1, 1].set_title('Model Performance Metrics')
    
    for i, v in enumerate(values):
        axes[1, 1].text(i, v + 0.02, f'{v:.3f}', ha='center', va='bottom')
    
    plt.tight_layout()
    plt.savefig('model_evaluation.png', dpi=150, bbox_inches='tight')
    print("   Saved: model_evaluation.png")
    plt.close()


if __name__ == '__main__':
    ensemble, data = train_ensemble_model()
