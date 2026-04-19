"""
OceanGuard – ML Prediction Microservice (FastAPI)
Runs on: http://localhost:8001

Routes:
  GET  /health     → health check
  POST /predict    → run risk prediction
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn

from model import load_model, predict

app = FastAPI(
    title="OceanGuard ML Service",
    description="Marine Risk Prediction Microservice",
    version="1.0.0",
)

# Load model at startup
ml_model = None

@app.on_event("startup")
def startup_event():
    global ml_model
    ml_model = load_model()
    print("✅ ML model loaded successfully")


# ── Schemas ───────────────────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    features: List[float]  # [windSpeed_kmh, waveHeight, weatherCode, dayOfWeek, boatCount]

class PredictResponse(BaseModel):
    prediction: int         # 1 = Safe, 0 = High Risk
    confidence: float       # probability (0.0–1.0)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "OceanGuard ML"}


@app.post("/predict", response_model=PredictResponse)
def predict_risk(body: PredictRequest):
    # Backend buildFeatures() sends 5 values:
    # [windSpeed_kmh, waveHeight, weatherCode, dayOfWeek, boatCount]
    # We accept 4 or 5 features (boatCount extra is ignored by the model)
    if len(body.features) < 4:
        raise HTTPException(
            status_code=422,
            detail=f"Expected at least 4 features, got {len(body.features)}. "
                   "Format: [windSpeed_kmh, waveHeight, weatherCode, dayOfWeek]"
        )

    # Use only the first 4 features for the model
    features = body.features[:4]

    # ml_model may be None — predict() has a rule-based fallback for that case
    result = predict(ml_model, features)
    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=10000, reload=False)
