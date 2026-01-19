"""
Behavioral Biometrics Module - Analyzes user behavior patterns
"""
import numpy as np
from typing import Dict, List, Any
from datetime import datetime
import hashlib

class BiometricAnalyzer:
    """Analyzes behavioral biometrics for fraud detection"""
    
    def __init__(self):
        self.user_profiles = {}  # Store behavioral profiles
        
    def analyze_behavioral_patterns(self, biometric_data: Dict) -> Dict:
        """
        Analyze behavioral biometric data
        
        Biometric factors:
        - Typing rhythm and speed
        - Mouse movement patterns
        - Touch pressure and swipe velocity (mobile)
        - Device fingerprinting
        - Navigation patterns
        - Session behavior
        """
        user_id = biometric_data.get('user_id', 'anonymous')
        
        # Calculate biometric risk score
        typing_score = self._analyze_typing_pattern(biometric_data.get('typing_data', {}))
        mouse_score = self._analyze_mouse_behavior(biometric_data.get('mouse_data', {}))
        device_score = self._analyze_device_fingerprint(biometric_data.get('device_data', {}))
        session_score = self._analyze_session_behavior(biometric_data.get('session_data', {}))
        
        # Combined biometric score
        biometric_risk = (
            typing_score * 0.30 +
            mouse_score * 0.25 +
            device_score * 0.25 +
            session_score * 0.20
        )
        
        analysis = {
            'biometric_risk_score': biometric_risk,
            'risk_level': self._categorize_risk(biometric_risk),
            'typing_analysis': {
                'score': typing_score,
                'avg_keystroke_time': biometric_data.get('typing_data', {}).get('avg_time', 0),
                'pattern_match': 1 - typing_score,
                'anomalies': self._detect_typing_anomalies(biometric_data.get('typing_data', {}))
            },
            'mouse_analysis': {
                'score': mouse_score,
                'movement_speed': biometric_data.get('mouse_data', {}).get('speed', 0),
                'pattern_match': 1 - mouse_score,
                'anomalies': self._detect_mouse_anomalies(biometric_data.get('mouse_data', {}))
            },
            'device_analysis': {
                'score': device_score,
                'fingerprint': self._generate_device_fingerprint(biometric_data.get('device_data', {})),
                'is_known_device': device_score < 0.3,
                'device_attributes': self._extract_device_attributes(biometric_data.get('device_data', {}))
            },
            'session_analysis': {
                'score': session_score,
                'pattern_match': 1 - session_score,
                'anomalies': self._detect_session_anomalies(biometric_data.get('session_data', {}))
            },
            'confidence': self._calculate_confidence(typing_score, mouse_score, device_score, session_score),
            'recommendation': self._generate_recommendation(biometric_risk)
        }
        
        return analysis
    
    def _analyze_typing_pattern(self, typing_data: Dict) -> float:
        """Analyze typing rhythm and patterns"""
        if not typing_data:
            return 0.5  # Unknown = moderate risk
        
        avg_keystroke = typing_data.get('avg_time', 150)  # ms
        variance = typing_data.get('variance', 20)
        
        # Expected range: 100-200ms average, variance 10-30ms
        risk_score = 0.0
        
        # Check if typing is too fast (bot-like)
        if avg_keystroke < 50:
            risk_score += 0.4
        
        # Check if typing is too slow or inconsistent
        if avg_keystroke > 300:
            risk_score += 0.3
        
        if variance > 50:
            risk_score += 0.2
        
        # Check for unnatural rhythm
        if 'rhythm_score' in typing_data:
            rhythm = typing_data['rhythm_score']
            if rhythm < 0.5:  # Unnatural rhythm
                risk_score += 0.3
        
        return min(risk_score, 1.0)
    
    def _analyze_mouse_behavior(self, mouse_data: Dict) -> float:
        """Analyze mouse movement patterns"""
        if not mouse_data:
            return 0.5
        
        speed = mouse_data.get('speed', 1000)  # pixels per second
        curvature = mouse_data.get('curvature', 0.5)
        pauses = mouse_data.get('pauses', 5)
        
        risk_score = 0.0
        
        # Bot-like: perfectly straight lines, no pauses
        if curvature < 0.1 and pauses < 2:
            risk_score += 0.5
        
        # Unusually fast movements
        if speed > 3000:
            risk_score += 0.3
        
        # Unusual pause patterns
        if pauses > 20:
            risk_score += 0.2
        
        return min(risk_score, 1.0)
    
    def _analyze_device_fingerprint(self, device_data: Dict) -> float:
        """Analyze device fingerprint for anomalies"""
        if not device_data:
            return 0.6
        
        fingerprint = self._generate_device_fingerprint(device_data)
        
        # Check if device is known
        is_new_device = device_data.get('is_new', True)
        if is_new_device:
            risk_score = 0.6
        else:
            risk_score = 0.1
        
        # Check for suspicious attributes
        if device_data.get('vpn_detected', False):
            risk_score += 0.2
        
        if device_data.get('tor_detected', False):
            risk_score += 0.3
        
        if device_data.get('emulator_detected', False):
            risk_score += 0.4
        
        return min(risk_score, 1.0)
    
    def _analyze_session_behavior(self, session_data: Dict) -> float:
        """Analyze session behavior patterns"""
        if not session_data:
            return 0.5
        
        duration = session_data.get('duration', 0)  # seconds
        pages_visited = session_data.get('pages_visited', 0)
        
        risk_score = 0.0
        
        # Too quick (bot-like behavior)
        if duration < 10 and pages_visited > 3:
            risk_score += 0.5
        
        # Unusual navigation pattern
        if session_data.get('direct_to_payment', False):
            risk_score += 0.3
        
        # Multiple failed login attempts
        failed_logins = session_data.get('failed_logins', 0)
        if failed_logins > 2:
            risk_score += 0.4
        
        return min(risk_score, 1.0)
    
    def _generate_device_fingerprint(self, device_data: Dict) -> str:
        """Generate unique device fingerprint"""
        fingerprint_string = (
            f"{device_data.get('user_agent', '')}|"
            f"{device_data.get('screen_resolution', '')}|"
            f"{device_data.get('timezone', '')}|"
            f"{device_data.get('language', '')}|"
            f"{device_data.get('plugins', '')}"
        )
        return hashlib.sha256(fingerprint_string.encode()).hexdigest()[:16]
    
    def _extract_device_attributes(self, device_data: Dict) -> Dict:
        """Extract key device attributes"""
        return {
            'browser': device_data.get('browser', 'Unknown'),
            'os': device_data.get('os', 'Unknown'),
            'screen': device_data.get('screen_resolution', 'Unknown'),
            'timezone': device_data.get('timezone', 'Unknown'),
            'language': device_data.get('language', 'Unknown'),
            'vpn': device_data.get('vpn_detected', False),
            'tor': device_data.get('tor_detected', False)
        }
    
    def _detect_typing_anomalies(self, typing_data: Dict) -> List[str]:
        """Detect specific typing anomalies"""
        anomalies = []
        
        if typing_data.get('avg_time', 150) < 50:
            anomalies.append('Bot-like typing speed detected')
        
        if typing_data.get('variance', 20) > 50:
            anomalies.append('Inconsistent typing rhythm')
        
        if typing_data.get('copy_paste_detected', False):
            anomalies.append('Extensive copy-paste behavior')
        
        return anomalies
    
    def _detect_mouse_anomalies(self, mouse_data: Dict) -> List[str]:
        """Detect specific mouse anomalies"""
        anomalies = []
        
        if mouse_data.get('curvature', 0.5) < 0.1:
            anomalies.append('Suspiciously straight mouse movements')
        
        if mouse_data.get('speed', 1000) > 3000:
            anomalies.append('Unusually fast cursor movements')
        
        if mouse_data.get('pauses', 5) < 2:
            anomalies.append('Lack of natural pauses')
        
        return anomalies
    
    def _detect_session_anomalies(self, session_data: Dict) -> List[str]:
        """Detect specific session anomalies"""
        anomalies = []
        
        if session_data.get('direct_to_payment', False):
            anomalies.append('Direct navigation to payment page')
        
        if session_data.get('failed_logins', 0) > 2:
            anomalies.append('Multiple failed login attempts')
        
        if session_data.get('rapid_clicks', 0) > 10:
            anomalies.append('Rapid clicking pattern detected')
        
        return anomalies
    
    def _categorize_risk(self, score: float) -> str:
        """Categorize biometric risk level"""
        if score < 0.3:
            return 'LOW'
        elif score < 0.6:
            return 'MEDIUM'
        elif score < 0.8:
            return 'HIGH'
        else:
            return 'CRITICAL'
    
    def _calculate_confidence(self, typing: float, mouse: float, device: float, session: float) -> float:
        """Calculate confidence in biometric analysis"""
        # Higher confidence when all scores agree
        scores = [typing, mouse, device, session]
        variance = np.var(scores)
        
        # Low variance = high confidence
        confidence = 1.0 - min(variance * 2, 0.5)
        return confidence
    
    def _generate_recommendation(self, risk_score: float) -> str:
        """Generate action recommendation"""
        if risk_score < 0.3:
            return 'ALLOW - Behavioral patterns match user profile'
        elif risk_score < 0.6:
            return 'CHALLENGE - Request additional verification (2FA, security questions)'
        elif risk_score < 0.8:
            return 'REVIEW - Flag for manual review before proceeding'
        else:
            return 'BLOCK - High-risk behavioral patterns detected, deny transaction'
