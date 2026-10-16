from pathlib import Path

import cv2
import numpy as np


PROJECT_ROOT = Path(__file__).resolve().parents[2]

RESULTS_DIR = (
    PROJECT_ROOT
    / "ml"
    / "change_detection"
    / "results"
)

IMAGE_SIZE = (224, 224)


def load_image(image_path):
    """Load and normalize an image."""
    image = cv2.imread(str(image_path))

    if image is None:
        raise ValueError(f"Unable to read image: {image_path}")

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, IMAGE_SIZE)

    return image.astype(np.float32) / 255.0


def calculate_change(before_image, after_image):
    """
    Calculate pixel-level visual change between
    before and after images.

    This is a baseline image-difference method.
    It is NOT a trained deforestation model.
    """

    difference = np.abs(
        before_image - after_image
    )

    difference = np.mean(
        difference,
        axis=2,
    )

    change_map = (difference * 255).astype(
        np.uint8
    )

    return change_map


def calculate_change_percentage(change_map):
    """Estimate pixels with significant visual change."""

    threshold = 40

    changed_pixels = np.sum(
        change_map > threshold
    )

    total_pixels = change_map.size

    percentage = (
        changed_pixels / total_pixels
    ) * 100

    return percentage


def main():
    print("FORESTIQ - Change Detection Pipeline")
    print("=" * 45)

    RESULTS_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    print()
    print("Pipeline components:")
    print("1. Before-image loading")
    print("2. After-image loading")
    print("3. Image normalization")
    print("4. Pixel-level difference")
    print("5. Change-map generation")
    print("6. Change-percentage estimation")

    print()
    print("Status: READY")
    print()
    print(
        "Note: This is a baseline change-detection "
        "pipeline. Final deforestation results will "
        "require validated imagery and research labels."
    )


if __name__ == "__main__":
    main()