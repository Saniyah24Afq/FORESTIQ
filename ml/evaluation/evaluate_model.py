from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
)

from ml.training.train_model import load_dataset


ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = ROOT / "ml" / "models" / "forestiq_random_forest.joblib"
ENCODER_PATH = ROOT / "ml" / "models" / "label_encoder.joblib"

RESULTS_DIR = ROOT / "ml" / "evaluation" / "results"

RESULTS_DIR.mkdir(parents=True, exist_ok=True)


def main():

    print("=" * 60)
    print("FORESTIQ MODEL EVALUATION")
    print("=" * 60)

    if not MODEL_PATH.exists():
        print("Trained model not found.")
        print("Run train_model.py first.")
        return

    model = joblib.load(MODEL_PATH)
    encoder = joblib.load(ENCODER_PATH)

    X_test, y_test = load_dataset("test")

    if len(X_test) == 0:
        print("No test images found.")
        return

    y_test_encoded = encoder.transform(y_test)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test_encoded,
        predictions,
    )

    precision = precision_score(
        y_test_encoded,
        predictions,
        average="weighted",
        zero_division=0,
    )

    recall = recall_score(
        y_test_encoded,
        predictions,
        average="weighted",
        zero_division=0,
    )

    f1 = f1_score(
        y_test_encoded,
        predictions,
        average="weighted",
        zero_division=0,
    )

    print(f"\nAccuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")

    print("\nClassification Report:")
    print(
        classification_report(
            y_test_encoded,
            predictions,
            target_names=encoder.classes_,
            zero_division=0,
        )
    )

    matrix = confusion_matrix(
        y_test_encoded,
        predictions,
    )

    fig, ax = plt.subplots(figsize=(10, 8))

    display = ConfusionMatrixDisplay(
        confusion_matrix=matrix,
        display_labels=encoder.classes_,
    )

    display.plot(
        ax=ax,
        xticks_rotation=45,
    )

    plt.title("FORESTIQ Land-Cover Classification Confusion Matrix")
    plt.tight_layout()

    matrix_path = RESULTS_DIR / "confusion_matrix.png"

    plt.savefig(matrix_path, dpi=200)
    plt.close()

    metrics_path = RESULTS_DIR / "metrics.txt"

    metrics_path.write_text(
        f"""FORESTIQ MODEL EVALUATION

Task:
EuroSAT multi-spectral land-cover classification baseline

Model:
Random Forest

Accuracy: {accuracy:.4f}
Precision: {precision:.4f}
Recall: {recall:.4f}
F1 Score: {f1:.4f}

Classes:
{chr(10).join(encoder.classes_)}
""",
        encoding="utf-8",
    )

    print("\nConfusion matrix saved:")
    print(matrix_path)

    print("\nMetrics saved:")
    print(metrics_path)


if __name__ == "__main__":
    main()