"""
OceanGuard – ML Model Loader & Predictor

Feature vector (4 values):
  0: windSpeed_kmh   – wind speed in km/h
  1: waveHeight      – estimated wave height in meters
  2: weatherCode     – 0=Clear, 1=Clouds, 2=Rain, 3=Storm, 4=Snow, 5=Fog
  3: dayOfWeek       – 0=Monday … 6=Sunday

Label:
  1 = Safe
  0 = High Risk
"""

import os
import numpy as np
import joblib

MODEL_PATH  = os.path.join(os.path.dirname(__file__), "model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "scaler.pkl")

# Loaded lazily so the correct path is always used
_scaler = None


def _get_scaler():
    """Load scaler once and cache it."""
    global _scaler
    if _scaler is None:
        _scaler = joblib.load(SCALER_PATH)
        print(f"📐 Scaler loaded from {SCALER_PATH}")
    return _scaler


def load_model():
    """Load the trained model from disk. Falls back to a rule-based predictor if not found."""
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"📦 Model loaded from {MODEL_PATH}")
        return model
    else:
        print("⚠️  model.pkl not found — using rule-based fallback predictor")
        return None


def predict(model, features: list) -> dict:
    """
    Run prediction with the ML model or fall back to rule-based logic.

    Args:
        model:    Trained sklearn model, or None for rule-based fallback.
        features: List of 4 floats – [windSpeed_kmh, waveHeight, weatherCode, dayOfWeek]

    Returns:
        {"prediction": int, "confidence": float}
    """
    print(f"Features received: {features}")
    print(f"Using ML model: {model is not None}")

    X = np.array(features, dtype=float).reshape(1, -1)
    X = _get_scaler().transform(X)

    if model is not None:
        # ── Trained sklearn model path ──────────────────────────────────────
        prediction = int(model.predict(X)[0])
        proba      = model.predict_proba(X)[0]
        confidence = float(proba[prediction])
    else:
        # ── Rule-based fallback ─────────────────────────────────────────────
        wind_kmh, wave_height, weather_code = features[0], features[1], features[2]
        risk_score = 0

        # Wind contribution
        if wind_kmh > 45:
            risk_score += 2
        elif wind_kmh > 25:
            risk_score += 1

        # Wave contribution
        if wave_height > 3:
            risk_score += 2
        elif wave_height > 1.5:
            risk_score += 1

        # Weather contribution
        if weather_code >= 3:
            risk_score += 2
        elif weather_code == 2:
            risk_score += 1

        # Final decision
        if risk_score >= 4:
            prediction = 0   # High Risk
            confidence = 0.90
        elif risk_score >= 2:
            prediction = 1   # Moderate – treated as safe
            confidence = 0.70
        else:
            prediction = 1   # Safe
            confidence = 0.85

    return {"prediction": prediction, "confidence": confidence}