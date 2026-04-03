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
    if len(body.features) != 4:
        raise HTTPException(
            status_code=422,
            detail=f"Expected 4 features, got {len(body.features)}. "
                   "Format: [windSpeed_kmh, waveHeight, weatherCode, dayOfWeek]"
        )

    if ml_model is None:
        raise HTTPException(status_code=503, detail="ML model not loaded")

    result = predict(ml_model, body.features)
    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
