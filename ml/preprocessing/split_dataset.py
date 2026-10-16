from pathlib import Path
import random
import shutil


ROOT = Path(__file__).resolve().parents[2]

RAW_DIR = ROOT / "datasets" / "raw"
SPLIT_DIR = ROOT / "datasets" / "splits"

TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

SEED = 42

IMAGE_EXTENSIONS = {
    ".tif",
    ".tiff",
    ".jpg",
    ".jpeg",
    ".png",
}


def main():
    print("=" * 60)
    print("FORESTIQ DATASET SPLITTING")
    print("=" * 60)

    if not RAW_DIR.exists():
        print("Raw dataset folder not found.")
        return

    class_dirs = sorted(
        [p for p in RAW_DIR.iterdir() if p.is_dir()]
    )

    if not class_dirs:
        print("No class folders found.")
        return

    random.seed(SEED)

    for split in ["train", "val", "test"]:
        split_path = SPLIT_DIR / split
        split_path.mkdir(parents=True, exist_ok=True)

    for class_dir in class_dirs:

        images = [
            p for p in class_dir.rglob("*")
            if p.is_file()
            and p.suffix.lower() in IMAGE_EXTENSIONS
        ]

        if not images:
            continue

        random.shuffle(images)

        total = len(images)

        train_end = int(total * TRAIN_RATIO)
        val_end = train_end + int(total * VAL_RATIO)

        train_files = images[:train_end]
        val_files = images[train_end:val_end]
        test_files = images[val_end:]

        for split_name, files in [
            ("train", train_files),
            ("val", val_files),
            ("test", test_files),
        ]:

            destination = SPLIT_DIR / split_name / class_dir.name
            destination.mkdir(parents=True, exist_ok=True)

            for source in files:
                target = destination / source.name

                if not target.exists():
                    shutil.copy2(source, target)

        print(
            f"{class_dir.name:25s} "
            f"train={len(train_files):5d} "
            f"val={len(val_files):5d} "
            f"test={len(test_files):5d}"
        )

    print("-" * 60)
    print("Dataset split completed.")
    print("Train: 70%")
    print("Validation: 15%")
    print("Test: 15%")
    print("Random seed:", SEED)


if __name__ == "__main__":
    main()