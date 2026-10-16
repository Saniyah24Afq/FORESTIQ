from pathlib import Path
from collections import Counter

import matplotlib.pyplot as plt


ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = ROOT / "datasets" / "raw"
OUTPUT_DIR = ROOT / "datasets" / "processed"

IMAGE_EXTENSIONS = {
    ".tif",
    ".tiff",
    ".jpg",
    ".jpeg",
    ".png",
}


def main():
    print("=" * 60)
    print("FORESTIQ EXPLORATORY DATA ANALYSIS")
    print("=" * 60)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if not RAW_DIR.exists():
        print("Raw dataset folder not found.")
        return

    counts = Counter()

    for class_dir in RAW_DIR.iterdir():

        if not class_dir.is_dir():
            continue

        count = sum(
            1
            for p in class_dir.rglob("*")
            if p.is_file()
            and p.suffix.lower() in IMAGE_EXTENSIONS
        )

        counts[class_dir.name] = count

    if not counts:
        print("No images found.")
        return

    print("\nClass distribution:")

    for name, count in sorted(counts.items()):
        print(f"{name:25s}: {count}")

    plt.figure(figsize=(12, 6))

    names = list(counts.keys())
    values = list(counts.values())

    plt.bar(names, values)

    plt.title("EuroSAT Multi-Spectral Class Distribution")
    plt.xlabel("Land-cover class")
    plt.ylabel("Number of images")

    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()

    output = OUTPUT_DIR / "class_distribution.png"

    plt.savefig(output, dpi=200)
    plt.close()

    print("\nEDA chart saved:")
    print(output)


if __name__ == "__main__":
    main()