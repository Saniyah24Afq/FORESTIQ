from pathlib import Path
from typing import Optional

import cv2
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from torchvision import models, transforms

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware


# ============================================================
# FORESTIQ BACKEND CONFIGURATION
# ============================================================

APP_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = APP_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MODEL_DIR = APP_DIR / "models"
MODEL_PATH = MODEL_DIR / "forestiq_eurosat_model.pth"
METRICS_PATH = MODEL_DIR / "training_metrics.json"

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB


ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/tiff",
    "image/bmp",
}


VALID_SOURCES = {
    "satellite",
    "drone",
    "camera",
}


# ============================================================
# MACHINE LEARNING MODEL CONFIGURATION
# ============================================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

MODEL_NAME = "MobileNetV3-Small"

MODEL_CLASSES = [
    "AnnualCrop",
    "Forest",
    "HerbaceousVegetation",
    "Highway",
    "Industrial",
    "Pasture",
    "PermanentCrop",
    "Residential",
    "River",
    "SeaLake",
]


MODEL_TRANSFORM = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ]
)


MODEL = None
MODEL_READY = False
MODEL_ERROR = None


# ============================================================
# LOAD TRAINED FORESTIQ MODEL
# ============================================================

def load_trained_model():
    global MODEL
    global MODEL_READY
    global MODEL_ERROR
    global MODEL_CLASSES

    if not MODEL_PATH.exists():
        MODEL_READY = False
        MODEL_ERROR = (
            f"Trained model not found at: {MODEL_PATH}"
        )

        print("⚠️", MODEL_ERROR)
        return

    try:
        checkpoint = torch.load(
            MODEL_PATH,
            map_location=DEVICE,
            weights_only=False,
        )

        saved_classes = checkpoint.get(
            "classes",
            MODEL_CLASSES,
        )

        MODEL_CLASSES = saved_classes

        model = models.mobilenet_v3_small(
            weights=None
        )

        in_features = model.classifier[-1].in_features

        model.classifier[-1] = nn.Linear(
            in_features,
            len(MODEL_CLASSES),
        )

        model.load_state_dict(
            checkpoint["model_state_dict"]
        )

        model = model.to(DEVICE)
        model.eval()

        MODEL = model
        MODEL_READY = True
        MODEL_ERROR = None

        print()
        print("==============================================")
        print("✅ Trained FORESTIQ model loaded successfully")
        print("==============================================")
        print("📦 Model:", MODEL_PATH)
        print("🧠 Device:", DEVICE)
        print("🏷️ Classes:", MODEL_CLASSES)
        print("==============================================")
        print()

    except Exception as exc:
        MODEL = None
        MODEL_READY = False
        MODEL_ERROR = str(exc)

        print()
        print("❌ Failed to load trained FORESTIQ model")
        print("Reason:", exc)
        print()


# Load model when backend starts
load_trained_model()


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="FORESTIQ API",
    version="1.2.0",
    description=(
        "Backend for automated forest monitoring, "
        "land-cover classification, deforestation analysis, "
        "change detection, GPS validation and research experiments."
    ),
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "FORESTIQ API is running successfully 🌳",
        "docs": "/docs",
        "version": "1.2.0",
        "trained_model_ready": MODEL_READY,
        "model_name": MODEL_NAME,
        "device": str(DEVICE),
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "FORESTIQ API",
        "analysis_engine": "ready",

        "ml_pipeline": (
            "trained_model_ready"
            if MODEL_READY
            else "model_unavailable"
        ),

        "trained_model": {
            "ready": MODEL_READY,
            "model_name": MODEL_NAME,
            "device": str(DEVICE),
            "path": str(MODEL_PATH),
            "classes": MODEL_CLASSES,
            "error": MODEL_ERROR,
        },

        "gps_module": "ready",

        "change_detection": "baseline_ready",

        "supported_sources": [
            "satellite",
            "drone",
            "camera",
        ],
    }


# ============================================================
# ANALYSIS SOURCES
# ============================================================

@app.get("/api/analysis/sources")
def analysis_sources():
    return {
        "sources": [
            {
                "id": "satellite",
                "name": "Satellite Imagery",
                "status": "ready",
                "description": (
                    "Analyze uploaded satellite imagery "
                    "using the FORESTIQ trained image "
                    "classification pipeline."
                ),
            },
            {
                "id": "drone",
                "name": "Drone Imagery",
                "status": "ready",
                "description": (
                    "Analyze uploaded drone imagery "
                    "using the FORESTIQ trained image "
                    "classification pipeline."
                ),
            },
            {
                "id": "camera",
                "name": "Field Camera",
                "status": "ready",
                "description": (
                    "Analyze uploaded field camera images "
                    "using the FORESTIQ trained image "
                    "classification pipeline."
                ),
            },
        ]
    }


# ============================================================
# GPS VALIDATION
# ============================================================

def validate_gps(
    latitude: Optional[float],
    longitude: Optional[float],
):
    if latitude is None and longitude is None:
        return {
            "provided": False,
            "latitude": None,
            "longitude": None,
            "valid": True,
        }

    if latitude is None or longitude is None:
        raise HTTPException(
            status_code=400,
            detail=(
                "Both latitude and longitude "
                "must be provided together."
            ),
        )

    if not -90 <= latitude <= 90:
        raise HTTPException(
            status_code=400,
            detail="Latitude must be between -90 and 90.",
        )

    if not -180 <= longitude <= 180:
        raise HTTPException(
            status_code=400,
            detail="Longitude must be between -180 and 180.",
        )

    return {
        "provided": True,
        "latitude": latitude,
        "longitude": longitude,
        "valid": True,
    }


# ============================================================
# IMAGE UPLOAD / VALIDATION
# ============================================================

async def read_uploaded_image(file: UploadFile):

    if not file:
        raise HTTPException(
            status_code=400,
            detail="Image file is required.",
        )

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported image type. "
                "Please upload JPG, PNG, WEBP, TIFF or BMP."
            ),
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image size must not exceed 25 MB.",
        )

    image_array = np.frombuffer(
        contents,
        dtype=np.uint8,
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_UNCHANGED,
    )

    if image is None:
        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded file could not be "
                "decoded as an image."
            ),
        )

    return contents, image


# ============================================================
# IMAGE METADATA
# ============================================================

def get_image_metadata(image):

    height, width = image.shape[:2]

    if len(image.shape) == 2:
        channels = 1
    else:
        channels = image.shape[2]

    return {
        "width": int(width),
        "height": int(height),
        "channels": int(channels),
    }


# ============================================================
# BASELINE VEGETATION ANALYSIS
# ============================================================

def calculate_baseline_analysis(image):

    if image is None:
        return {
            "baseline_vegetation_indicator": 0,
            "classification": "unavailable",
            "trained_model_used": False,
        }

    # Grayscale image
    if len(image.shape) == 2:

        image_bgr = cv2.cvtColor(
            image,
            cv2.COLOR_GRAY2BGR,
        )

    # RGBA image
    elif image.shape[2] == 4:

        image_bgr = cv2.cvtColor(
            image,
            cv2.COLOR_BGRA2BGR,
        )

    # Normal BGR image
    else:

        image_bgr = image

    image_rgb = cv2.cvtColor(
        image_bgr,
        cv2.COLOR_BGR2RGB,
    ).astype(np.float32)

    red = image_rgb[:, :, 0]
    green = image_rgb[:, :, 1]
    blue = image_rgb[:, :, 2]

    denominator = (
        green + red + blue + 1e-6
    )

    vegetation_score = (
        (green - red) / denominator
    )

    vegetation_pixels = (
        vegetation_score > 0.05
    )

    indicator = float(
        np.mean(vegetation_pixels) * 100
    )

    indicator = round(
        max(0.0, min(100.0, indicator)),
        2,
    )

    if indicator >= 70:
        classification = "high vegetation"

    elif indicator >= 40:
        classification = "moderate vegetation"

    else:
        classification = "low vegetation"

    return {
        "baseline_vegetation_indicator": indicator,
        "classification": classification,

        "trained_model_used": False,

        "deforestation_detection": (
            "not_directly_predicted_by_eurosat_classifier"
        ),

        "model_status": (
            "trained_model_available"
            if MODEL_READY
            else "trained_model_unavailable"
        ),
    }


# ============================================================
# TRAINED MODEL PREDICTION
# ============================================================

def predict_land_cover(image):

    if not MODEL_READY or MODEL is None:

        return {
            "available": False,
            "trained_model_used": False,
            "model_name": MODEL_NAME,
            "dataset": "EuroSAT RGB",
            "prediction": None,
            "confidence": None,
            "top_predictions": [],
            "error": MODEL_ERROR,
        }

    try:

        # Convert image to RGB
        if len(image.shape) == 2:

            rgb_image = cv2.cvtColor(
                image,
                cv2.COLOR_GRAY2RGB,
            )

        elif image.shape[2] == 4:

            rgb_image = cv2.cvtColor(
                image,
                cv2.COLOR_BGRA2RGB,
            )

        else:

            rgb_image = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2RGB,
            )

        # Convert OpenCV image to PIL
        pil_image = Image.fromarray(
            rgb_image
        ).convert("RGB")

        # Apply model preprocessing
        tensor = MODEL_TRANSFORM(
            pil_image
        ).unsqueeze(0)

        tensor = tensor.to(DEVICE)

        # Model inference
        with torch.no_grad():

            outputs = MODEL(tensor)

            probabilities = torch.softmax(
                outputs,
                dim=1,
            )

            confidence, predicted_index = (
                torch.max(
                    probabilities,
                    dim=1,
                )
            )

        class_index = int(
            predicted_index.item()
        )

        confidence_value = float(
            confidence.item() * 100
        )

        prediction = MODEL_CLASSES[
            class_index
        ]

        # Top 3 predictions
        top_count = min(
            3,
            len(MODEL_CLASSES),
        )

        top_probabilities, top_indices = (
            torch.topk(
                probabilities,
                k=top_count,
                dim=1,
            )
        )

        top_predictions = []

        for probability, index in zip(
            top_probabilities[0],
            top_indices[0],
        ):

            top_predictions.append(
                {
                    "class": MODEL_CLASSES[
                        int(index.item())
                    ],
                    "confidence": round(
                        float(
                            probability.item()
                            * 100
                        ),
                        2,
                    ),
                }
            )

        return {
            "available": True,

            "trained_model_used": True,

            "model_name": MODEL_NAME,

            "dataset": "EuroSAT RGB",

            "prediction": prediction,

            "class_index": class_index,

            "confidence": round(
                confidence_value,
                2,
            ),

            "top_predictions": top_predictions,

            "device": str(DEVICE),

            "classification_type": (
                "land_cover_classification"
            ),

            "note": (
                "This trained model performs "
                "10-class EuroSAT land-cover "
                "classification. Temporal "
                "deforestation detection requires "
                "before/after change analysis."
            ),
        }

    except Exception as exc:

        return {
            "available": False,
            "trained_model_used": False,
            "model_name": MODEL_NAME,
            "dataset": "EuroSAT RGB",
            "prediction": None,
            "confidence": None,
            "top_predictions": [],
            "error": str(exc),
        }


# ============================================================
# SAVE UPLOAD
# ============================================================

def save_upload(
    contents: bytes,
    filename: str,
):

    safe_name = Path(filename).name

    if not safe_name:
        safe_name = "forest_image"

    destination = (
        UPLOAD_DIR / safe_name
    )

    if destination.exists():

        stem = destination.stem
        suffix = destination.suffix

        counter = 1

        while destination.exists():

            destination = (
                UPLOAD_DIR
                / f"{stem}_{counter}{suffix}"
            )

            counter += 1

    destination.write_bytes(
        contents
    )

    return destination


# ============================================================
# MAIN IMAGE ANALYSIS ENDPOINT
# ============================================================

@app.post("/api/analyze")
async def analyze_image(

    file: UploadFile = File(...),

    source: str = Form("satellite"),

    latitude: Optional[float] = Form(None),

    longitude: Optional[float] = Form(None),

):

    source = source.lower().strip()

    if source not in VALID_SOURCES:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid source '{source}'. "
                "Supported sources: "
                "satellite, drone, camera."
            ),
        )

    # GPS validation
    gps_data = validate_gps(
        latitude,
        longitude,
    )

    # Read image
    contents, image = (
        await read_uploaded_image(file)
    )

    # Metadata
    metadata = get_image_metadata(
        image
    )

    # Baseline analysis
    baseline = (
        calculate_baseline_analysis(
            image
        )
    )

    # Trained ML prediction
    ml_prediction = (
        predict_land_cover(
            image
        )
    )

    # Save uploaded image
    saved_file = save_upload(
        contents,
        file.filename or "forest_image",
    )

    return {

        "success": True,

        "message": (
            "Image analyzed successfully "
            "using the FORESTIQ trained ML pipeline."
        ),

        "analysis": {

            "source": source,

            "filename": file.filename,

            "saved_file": saved_file.name,

            "file_size_bytes": len(contents),

            "image_metadata": metadata,

            "gps": gps_data,

            "baseline": baseline,

            "trained_model": ml_prediction,

            "pipeline": {

                "upload": "completed",

                "validation": "completed",

                "metadata_extraction": "completed",

                "vegetation_baseline": "completed",

                "trained_model_classification": (
                    "completed"
                    if ml_prediction.get(
                        "trained_model_used"
                    )
                    else "unavailable"
                ),

            },

        },

    }


# ============================================================
# CHANGE DETECTION
# ============================================================

@app.post("/api/change-detection")
async def change_detection(

    before: UploadFile = File(...),

    after: UploadFile = File(...),

):

    before_contents, before_image = (
        await read_uploaded_image(
            before
        )
    )

    after_contents, after_image = (
        await read_uploaded_image(
            after
        )
    )

    # BEFORE → grayscale
    if len(before_image.shape) == 2:

        before_gray = before_image

    elif before_image.shape[2] == 4:

        before_gray = cv2.cvtColor(
            before_image,
            cv2.COLOR_BGRA2GRAY,
        )

    else:

        before_gray = cv2.cvtColor(
            before_image,
            cv2.COLOR_BGR2GRAY,
        )

    # AFTER → grayscale
    if len(after_image.shape) == 2:

        after_gray = after_image

    elif after_image.shape[2] == 4:

        after_gray = cv2.cvtColor(
            after_image,
            cv2.COLOR_BGRA2GRAY,
        )

    else:

        after_gray = cv2.cvtColor(
            after_image,
            cv2.COLOR_BGR2GRAY,
        )

    # Resize after image if dimensions differ
    if before_gray.shape != after_gray.shape:

        after_gray = cv2.resize(
            after_gray,
            (
                before_gray.shape[1],
                before_gray.shape[0],
            ),
            interpolation=cv2.INTER_AREA,
        )

    # Pixel difference
    difference = cv2.absdiff(
        before_gray,
        after_gray,
    )

    threshold = 30

    changed_pixels = (
        difference > threshold
    )

    total_pixels = (
        changed_pixels.size
    )

    changed_pixel_count = int(
        np.sum(changed_pixels)
    )

    changed_area_percentage = (

        changed_pixel_count
        / total_pixels
        * 100

        if total_pixels
        else 0

    )

    changed_area_percentage = round(
        changed_area_percentage,
        2,
    )

    # Severity
    if changed_area_percentage >= 30:

        severity = "critical"

    elif changed_area_percentage >= 15:

        severity = "high"

    elif changed_area_percentage >= 5:

        severity = "moderate"

    else:

        severity = "low"

    # Save images
    before_saved = save_upload(
        before_contents,
        f"before_{before.filename or 'image'}",
    )

    after_saved = save_upload(
        after_contents,
        f"after_{after.filename or 'image'}",
    )

    return {

        "success": True,

        "message": "Change detection completed.",

        "change_detection": {

            "before_filename": before.filename,

            "after_filename": after.filename,

            "before_saved_file": before_saved.name,

            "after_saved_file": after_saved.name,

            "before_dimensions": {

                "width": int(
                    before_gray.shape[1]
                ),

                "height": int(
                    before_gray.shape[0]
                ),

            },

            "after_dimensions": {

                "width": int(
                    after_gray.shape[1]
                ),

                "height": int(
                    after_gray.shape[0]
                ),

            },

            "changed_area_percentage": (
                changed_area_percentage
            ),

            "severity": severity,

            "pixel_difference_threshold": (
                threshold
            ),

            "method": (
                "grayscale_pixel_difference"
            ),

            "trained_model_used": False,

            "note": (
                "Temporal change detection is "
                "currently performed using image "
                "difference analysis. The EuroSAT "
                "classifier is a land-cover model "
                "and is not used as a temporal "
                "deforestation detector."
            ),

        },

    }


# ============================================================
# GEOGRAPHIC VALIDATION
# ============================================================

@app.post("/api/geographic/validate")
async def geographic_validate(

    latitude: float = Form(...),

    longitude: float = Form(...),

):

    gps = validate_gps(
        latitude,
        longitude,
    )

    return {

        "success": True,

        "message": "Coordinates are valid.",

        "location": gps,

    }


# ============================================================
# RESEARCH STATUS
# ============================================================

@app.get("/api/research/status")
def research_status():

    if MODEL_READY:

        model_training_status = "completed"

        model_evaluation_status = "completed"

        prediction_status = (
            "trained_classifier_available"
        )

    else:

        model_training_status = "pending"

        model_evaluation_status = "pending"

        prediction_status = (
            "pending_trained_model"
        )

    return {

        "project": "FORESTIQ",

        "status": (
            "trained_model_integrated"
            if MODEL_READY
            else "development"
        ),

        "model": {

            "name": MODEL_NAME,

            "ready": MODEL_READY,

            "device": str(DEVICE),

            "dataset": "EuroSAT RGB",

            "classes": MODEL_CLASSES,

            "model_path": str(
                MODEL_PATH
            ),

            "metrics_path": str(
                METRICS_PATH
            ),

            "error": MODEL_ERROR,

        },

        "research_pipeline": {

            "data_collection": "completed",

            "image_preprocessing": "completed",

            "feature_extraction": "completed",

            "model_training": model_training_status,

            "model_evaluation": model_evaluation_status,

            "land_cover_prediction": (
                prediction_status
            ),

            "deforestation_prediction": (
                "requires_temporal_change_analysis"
            ),

        },

        "available_experiments": [

            "vegetation_baseline_analysis",

            "image_change_detection",

            "eurosat_land_cover_classification",

            "geographic_validation",

        ],

        "evaluation_metrics": {

            "accuracy": 90.69,

            "precision": 91.86,

            "recall": 90.69,

            "f1_score": 90.79,

        },

        "metric_note": (
            "These metrics represent validation "
            "performance of the EuroSAT RGB "
            "10-class land-cover classifier, "
            "not direct temporal deforestation "
            "detection accuracy."
        ),

    }


# ============================================================
# STARTUP
# ============================================================

@app.on_event("startup")
async def startup_event():

    UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    print()
    print("==============================================")
    print("🌳 FORESTIQ API started successfully")
    print("==============================================")
    print("📁 Upload directory:", UPLOAD_DIR)
    print(
        "🧠 ML model:",
        "READY" if MODEL_READY else "NOT AVAILABLE",
    )
    print("🚀 Analysis engine: READY")
    print("==============================================")
    print()