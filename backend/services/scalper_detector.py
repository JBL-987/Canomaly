import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import pickle

class ScalperDetectorAPI:
    """
    Scalper detection model dengan 14 features.
    Support ticket class validation.
    """
    
    def __init__(self, contamination=0.05, random_state=42):
        self.contamination = contamination
        self.random_state = random_state
        self.scaler = StandardScaler()
        self.model = IsolationForest(
            contamination=contamination,
            random_state=random_state,
            n_estimators=150,
            max_samples='auto',
            max_features=0.8
        )
        
        self.feature_names = [
            'final_price',
            'base_price',
            'discount_amount',
            'price_markup_ratio',
            'num_tickets',
            'ticket_class_id',
            'station_from_id',
            'station_to_id',
            'payment_method_id',
            'booking_channel_id',
            'is_refund',
            'is_popular_route',
            'is_price_above_max',
            'discount_ratio'
        ]
        
    def prepare_features(self, data):
        """Extract features dari data dict atau list."""
        if isinstance(data, dict):
            features = [data.get(feat, 0) for feat in self.feature_names]
            return np.array([features])
        else:
            features_list = []
            for item in data:
                features = [item.get(feat, 0) for feat in self.feature_names]
                features_list.append(features)
            return np.array(features_list)
    
    def predict(self, data):
        """Predict anomaly untuk single atau batch data."""
        X = self.prepare_features(data)
        X_scaled = self.scaler.transform(X)
        
        predictions = self.model.predict(X_scaled)
        scores = self.model.score_samples(X_scaled)
        
        # Convert to risk score (0-100)
        score_range = scores.max() - scores.min()
        if score_range == 0:
            risk_scores = np.zeros_like(scores)
        else:
            risk_scores = 100 * (1 - (scores - scores.min()) / score_range)
        
        if isinstance(data, dict):
            risk_score = risk_scores[0]
            return {
                'prediction': 'anomaly' if predictions[0] == -1 else 'normal',
                'score': float(scores[0]),
                'risk_score': float(risk_score),
                'risk_level': self._get_risk_level(risk_score),
                'is_scalper': predictions[0] == -1
            }
        else:
            results = []
            for i, (pred, score, risk_score) in enumerate(zip(predictions, scores, risk_scores)):
                results.append({
                    'transaction_id': data[i].get('transaction_id', f'trx_{i}'),
                    'user_id': data[i].get('user_id', 'unknown'),
                    'prediction': 'anomaly' if pred == -1 else 'normal',
                    'score': float(score),
                    'risk_score': float(risk_score),
                    'risk_level': self._get_risk_level(risk_score),
                    'is_scalper': pred == -1
                })
            return results
    
    def _get_risk_level(self, risk_score):
        """Convert risk score to category."""
        if risk_score < 30:
            return "Low"
        elif risk_score < 60:
            return "Medium"
        elif risk_score < 80:
            return "High"
        else:
            return "Critical"