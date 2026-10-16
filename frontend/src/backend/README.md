# FORESTIQ Backend

FastAPI backend foundation for the FORESTIQ forest monitoring research project.

## Current endpoints

- `GET /` — backend status
- `GET /api/health` — health check
- `GET /api/analysis/sources` — supported imagery sources
- `POST /api/analyze` — image upload + metadata/GPS intake

Interactive API documentation:

`http://127.0.0.1:8000/docs`

## Supported sources

- Satellite imagery
- Drone imagery
- Ground camera

## Important research note

The `/api/analyze` endpoint currently handles image intake and metadata only.
It intentionally does **not** invent forest-cover percentages, accuracy, F1,
IoU, or deforestation results.

The trained ML/DL pipeline will later be connected after:

1. Dataset collection
2. Data preprocessing
3. EDA and feature engineering
4. Model training
5. Model comparison
6. Validation and performance evaluation
7. Change-detection integration

GPS latitude and longitude fields are already supported so the later
geographic visualization can use real coordinates.
