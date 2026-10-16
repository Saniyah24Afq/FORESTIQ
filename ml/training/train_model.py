from pathlib import Path

import joblib
import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

try:
    import rasterio
except ImportError:
    rasterio = None

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]

SPLIT_DIR = ROOT / "datasets" / "splits"
MODEL_DIR = ROOT / "ml" / "models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

IMAGE_EXTENSIONS = {
    ".tif",
    ".tiff",
    ".jpg",
    ".jpeg",
    ".png",
}


def load_features(path):
    if path.suffix.lower() in {".tif", ".tiff"} and rasterio is not None:

        with rasterio.open(path) as src:
            image = src.read().astype(np.float32)

        if image.max() > 1:
            image = image / image.max()

        features = []

        for band in image:
            features.extend([
                float(np.mean(band)),
                float(np.std(band)),
                float(np.min(band)),
                float(np.max(band)),
            ])

        return features

    image = Image.open(path).convert("RGB")
    image = np.asarray(image).astype(np.float32) / 255.0

    features = []

    for channel in range(3):
        band = image[:, :, channel]

        features.extend([
            float(np.mean(band)),
            float(np.std(band)),
            float(np.min(band)),
            float(np.max(band)),
        ])

    return features


def load_dataset(split):
    split_path = SPLIT_DIR / split

    X = []
    y = []

    if not split_path.exists():
        return np.array([]), np.array([])

    for class_dir in sorted(split_path.iterdir()):

        if not class_dir.is_dir():
            continue

        for image_path in class_dir.rglob("*"):

            if (
                image_path.is_file()
                and image_path.suffix.lower() in IMAGE_EXTENSIONS
            ):
                try:
                    X.append(load_features(image_path))
                    y.append(class_dir.name)
                except Exception as error:
                    print(
                        f"Skipping {image_path.name}: {error}"
                    )

    return np.asarray(X), np.asarray(y)


def main():

    print("=" * 60)
    print("FORESTIQ RANDOM FOREST BASELINE")
    print("=" * 60)

    X_train, y_train = load_dataset("train")
    X_val, y_val = load_dataset("val")
    X_test, y_test = load_dataset("test")

    print(f"Training samples:   {len(X_train)}")
    print(f"Validation samples: {len(X_val)}")
    print(f"Testing samples:    {len(X_test)}")

    if len(X_train) == 0:
        print("\nNo training images found.")
        print("Run dataset splitting first.")
        return

    encoder = LabelEncoder()

    y_train_encoded = encoder.fit_transform(y_train)

    y_val_encoded = encoder.transform(y_val)
    y_test_encoded = encoder.transform(y_test)

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1,
        class_weight="balanced",
    )

    print("\nTraining Random Forest...")

    model.fit(X_train, y_train_encoded)

    val_predictions = model.predict(X_val)
    test_predictions = model.predict(X_test)

    val_accuracy = accuracy_score(
        y_val_encoded,
        val_predictions,
    )

    test_accuracy = accuracy_score(
        y_test_encoded,
        test_predictions,
    )

    print("\nValidation accuracy:", round(val_accuracy, 4))
    print("Test accuracy:", round(test_accuracy, 4))

    model_path = MODEL_DIR / "forestiq_random_forest.joblib"
    encoder_path = MODEL_DIR / "label_encoder.joblib"

    joblib.dump(model, model_path)
    joblib.dump(encoder, encoder_path)

    print("\nModel saved:")
    print(model_path)

    print("\nLabel encoder saved:")
    print(encoder_path)

    print("\nClasses:")
    print(list(encoder.classes_))


if __name__ == "__main__":
    main()