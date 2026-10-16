from pathlib import Path

import numpy as np

try:
    import rasterio
except ImportError:
    rasterio = None


ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = ROOT / "datasets" / "raw"

IMAGE_EXTENSIONS = {".tif", ".tiff", ".jpg", ".jpeg", ".png"}


def load_image(path):
    if path.suffix.lower() in {".tif", ".tiff"} and rasterio is not None:
        with rasterio.open(path) as src:
            image = src.read()

        image = image.astype(np.float32)

        if image.max() > 1:
            image /= image.max()

        return image

    from PIL import Image

    image = Image.open(path).convert("RGB")
    image = np.asarray(image).astype(np.float32) / 255.0

    return np.transpose(image, (2, 0, 1))


def main():
    print("=" * 60)
    print("FORESTIQ MULTI-SPECTRAL PREPROCESSING")
    print("=" * 60)

    if not RAW_DIR.exists():
        print(f"Dataset folder not found: {RAW_DIR}")
        return

    class_dirs = sorted(
        [p for p in RAW_DIR.iterdir() if p.is_dir()]
    )

    if not class_dirs:
        print("No class folders found.")
        print("Expected folders such as Forest, River, Residential...")
        return

    total = 0

    for class_dir in class_dirs:
        files = [
            p for p in class_dir.rglob("*")
            if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS
        ]

        if not files:
            continue

        sample = load_image(files[0])

        print(
            f"{class_dir.name:25s} "
            f"{len(files):6d} images | "
            f"sample shape: {sample.shape}"
        )

        total += len(files)

    print("-" * 60)
    print(f"Total images: {total}")
    print("RGB/multi-spectral loading: READY")
    print("Normalization: READY")
    print("Dataset preprocessing pipeline: READY")


if __name__ == "__main__":
    main()