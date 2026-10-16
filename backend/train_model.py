import os
import json
import random
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Subset
from torchvision import datasets, transforms, models
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)


# ============================================================
# FORESTIQ - EUROsat LAND COVER MODEL TRAINING
# ============================================================

PROJECT_DIR = Path(__file__).resolve().parent
DATASET_DIR = PROJECT_DIR / "dataset" / "EuroSAT_RGB"
MODEL_DIR = PROJECT_DIR / "models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "forestiq_eurosat_model.pth"
METRICS_PATH = MODEL_DIR / "training_metrics.json"

SEED = 42
IMAGE_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 3
LEARNING_RATE = 0.0005

NUM_WORKERS = 0

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ============================================================
# REPRODUCIBILITY
# ============================================================

random.seed(SEED)
torch.manual_seed(SEED)

if torch.cuda.is_available():
    torch.cuda.manual_seed_all(SEED)


# ============================================================
# CHECK DATASET
# ============================================================

print("=" * 70)
print("FORESTIQ - AI MODEL TRAINING")
print("=" * 70)

print(f"Project directory : {PROJECT_DIR}")
print(f"Dataset directory : {DATASET_DIR}")
print(f"Device            : {DEVICE}")
print()


if not DATASET_DIR.exists():
    print("ERROR: EuroSAT dataset was not found.")
    print()
    print("Expected location:")
    print(DATASET_DIR)
    print()
    print("Please make sure the extracted dataset is inside:")
    print("backend/dataset/EuroSAT_RGB/")
    raise SystemExit(1)


# ============================================================
# TRANSFORMS
# ============================================================

train_transform = transforms.Compose(
    [
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(
            brightness=0.15,
            contrast=0.15,
            saturation=0.15,
        ),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ]
)


validation_transform = transforms.Compose(
    [
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ]
)


# ============================================================
# LOAD DATASET
# ============================================================

print("Loading EuroSAT dataset...")

base_dataset = datasets.ImageFolder(
    root=str(DATASET_DIR)
)

classes = base_dataset.classes
targets = base_dataset.targets

print(f"Total images : {len(base_dataset)}")
print(f"Classes      : {len(classes)}")
print()

print("Detected classes:")

for index, class_name in enumerate(classes):
    count = targets.count(index)
    print(f"  {index}: {class_name:<25} {count} images")

print()


# ============================================================
# TRAIN / VALIDATION SPLIT
# ============================================================

indices = list(range(len(base_dataset)))

train_indices, validation_indices = train_test_split(
    indices,
    test_size=0.20,
    random_state=SEED,
    stratify=targets,
)


# Create separate datasets so training gets augmentation
train_dataset_full = datasets.ImageFolder(
    root=str(DATASET_DIR),
    transform=train_transform,
)

validation_dataset_full = datasets.ImageFolder(
    root=str(DATASET_DIR),
    transform=validation_transform,
)

train_dataset = Subset(
    train_dataset_full,
    train_indices,
)

validation_dataset = Subset(
    validation_dataset_full,
    validation_indices,
)


print("Dataset split:")
print(f"  Training images   : {len(train_dataset)}")
print(f"  Validation images : {len(validation_dataset)}")
print()


# ============================================================
# DATA LOADERS
# ============================================================

train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=NUM_WORKERS,
    pin_memory=False,
)

validation_loader = DataLoader(
    validation_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=NUM_WORKERS,
    pin_memory=False,
)


# ============================================================
# MODEL
# ============================================================

print("Loading MobileNetV3-Small pretrained model...")

weights = models.MobileNet_V3_Small_Weights.DEFAULT

model = models.mobilenet_v3_small(
    weights=weights
)

# Freeze feature extractor initially
for parameter in model.features.parameters():
    parameter.requires_grad = False


# Replace classifier for EuroSAT's 10 classes
in_features = model.classifier[-1].in_features

model.classifier[-1] = nn.Linear(
    in_features,
    len(classes),
)

model = model.to(DEVICE)


# ============================================================
# LOSS + OPTIMIZER
# ============================================================

criterion = nn.CrossEntropyLoss()

optimizer = torch.optim.Adam(
    model.classifier.parameters(),
    lr=LEARNING_RATE,
)


# ============================================================
# TRAINING
# ============================================================

best_validation_accuracy = 0.0

training_history = []


for epoch in range(EPOCHS):

    print()
    print("-" * 70)
    print(f"Epoch {epoch + 1}/{EPOCHS}")
    print("-" * 70)

    model.train()

    running_loss = 0.0
    correct = 0
    total = 0

    for batch_number, (images, labels) in enumerate(train_loader, start=1):

        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(
            outputs,
            labels,
        )

        loss.backward()

        optimizer.step()

        running_loss += loss.item() * images.size(0)

        predictions = torch.argmax(
            outputs,
            dim=1,
        )

        correct += (
            predictions == labels
        ).sum().item()

        total += labels.size(0)

        if batch_number % 50 == 0:
            print(
                f"  Batch {batch_number}/{len(train_loader)} "
                f"| Loss: {loss.item():.4f}"
            )

    train_loss = running_loss / total
    train_accuracy = correct / total


    # ========================================================
    # VALIDATION
    # ========================================================

    model.eval()

    validation_loss = 0.0

    all_labels = []
    all_predictions = []

    with torch.no_grad():

        for images, labels in validation_loader:

            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            outputs = model(images)

            loss = criterion(
                outputs,
                labels,
            )

            validation_loss += (
                loss.item() * images.size(0)
            )

            predictions = torch.argmax(
                outputs,
                dim=1,
            )

            all_labels.extend(
                labels.cpu().numpy().tolist()
            )

            all_predictions.extend(
                predictions.cpu().numpy().tolist()
            )

    validation_loss /= len(validation_dataset)

    validation_accuracy = accuracy_score(
        all_labels,
        all_predictions,
    )

    validation_precision = precision_score(
        all_labels,
        all_predictions,
        average="weighted",
        zero_division=0,
    )

    validation_recall = recall_score(
        all_labels,
        all_predictions,
        average="weighted",
        zero_division=0,
    )

    validation_f1 = f1_score(
        all_labels,
        all_predictions,
        average="weighted",
        zero_division=0,
    )


    print()
    print(f"Training Loss       : {train_loss:.4f}")
    print(f"Training Accuracy   : {train_accuracy * 100:.2f}%")
    print(f"Validation Loss     : {validation_loss:.4f}")
    print(f"Validation Accuracy : {validation_accuracy * 100:.2f}%")
    print(f"Precision           : {validation_precision * 100:.2f}%")
    print(f"Recall              : {validation_recall * 100:.2f}%")
    print(f"F1 Score            : {validation_f1 * 100:.2f}%")


    epoch_result = {
        "epoch": epoch + 1,
        "train_loss": round(train_loss, 6),
        "train_accuracy": round(train_accuracy, 6),
        "validation_loss": round(validation_loss, 6),
        "validation_accuracy": round(validation_accuracy, 6),
        "precision": round(validation_precision, 6),
        "recall": round(validation_recall, 6),
        "f1_score": round(validation_f1, 6),
    }

    training_history.append(epoch_result)


    # ========================================================
    # SAVE BEST MODEL
    # ========================================================

    if validation_accuracy > best_validation_accuracy:

        best_validation_accuracy = validation_accuracy

        checkpoint = {
            "model_state_dict": model.state_dict(),
            "classes": classes,
            "image_size": IMAGE_SIZE,
            "model_name": "MobileNetV3-Small",
            "dataset": "EuroSAT RGB",
            "num_classes": len(classes),
            "validation_accuracy": validation_accuracy,
        }

        torch.save(
            checkpoint,
            MODEL_PATH,
        )

        print()
        print("✓ Best model saved.")
        print(f"  {MODEL_PATH}")


# ============================================================
# FINAL EVALUATION
# ============================================================

print()
print("=" * 70)
print("FINAL MODEL EVALUATION")
print("=" * 70)

# Load best checkpoint
checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=False,
)

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model.eval()

all_labels = []
all_predictions = []

with torch.no_grad():

    for images, labels in validation_loader:

        images = images.to(DEVICE)

        outputs = model(images)

        predictions = torch.argmax(
            outputs,
            dim=1,
        )

        all_labels.extend(
            labels.numpy().tolist()
        )

        all_predictions.extend(
            predictions.cpu().numpy().tolist()
        )


final_accuracy = accuracy_score(
    all_labels,
    all_predictions,
)

final_precision = precision_score(
    all_labels,
    all_predictions,
    average="weighted",
    zero_division=0,
)

final_recall = recall_score(
    all_labels,
    all_predictions,
    average="weighted",
    zero_division=0,
)

final_f1 = f1_score(
    all_labels,
    all_predictions,
    average="weighted",
    zero_division=0,
)


print(f"Accuracy  : {final_accuracy * 100:.2f}%")
print(f"Precision : {final_precision * 100:.2f}%")
print(f"Recall    : {final_recall * 100:.2f}%")
print(f"F1 Score  : {final_f1 * 100:.2f}%")
print()


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

report = classification_report(
    all_labels,
    all_predictions,
    target_names=classes,
    output_dict=True,
    zero_division=0,
)


print("Classification Report:")
print(
    classification_report(
        all_labels,
        all_predictions,
        target_names=classes,
        zero_division=0,
    )
)


# ============================================================
# CONFUSION MATRIX
# ============================================================

matrix = confusion_matrix(
    all_labels,
    all_predictions,
)


# ============================================================
# SAVE METRICS
# ============================================================

metrics = {
    "project": "FORESTIQ",
    "task": "EuroSAT land-cover classification",
    "dataset": "EuroSAT RGB",
    "dataset_path": str(DATASET_DIR),
    "model": "MobileNetV3-Small",
    "device": str(DEVICE),
    "image_size": IMAGE_SIZE,
    "batch_size": BATCH_SIZE,
    "epochs": EPOCHS,
    "learning_rate": LEARNING_RATE,
    "total_images": len(base_dataset),
    "training_images": len(train_dataset),
    "validation_images": len(validation_dataset),
    "classes": classes,
    "accuracy": round(final_accuracy, 6),
    "precision": round(final_precision, 6),
    "recall": round(final_recall, 6),
    "f1_score": round(final_f1, 6),
    "classification_report": report,
    "confusion_matrix": matrix.tolist(),
    "training_history": training_history,
}


with open(
    METRICS_PATH,
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        metrics,
        file,
        indent=2,
    )


# ============================================================
# COMPLETE
# ============================================================

print("=" * 70)
print("TRAINING COMPLETE")
print("=" * 70)

print()
print("Model:")
print(MODEL_PATH)

print()
print("Metrics:")
print(METRICS_PATH)

print()
print("Next FORESTIQ step:")
print("Integrate the trained model into FastAPI /api/analyze")
print()