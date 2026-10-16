from pathlib import Path
import json


PROJECT_ROOT = Path(__file__).resolve().parents[2]

RESULTS_DIR = (
    PROJECT_ROOT
    / "ml"
    / "geographic"
    / "results"
)


def validate_coordinates(latitude, longitude):
    """Validate latitude and longitude values."""

    if not -90 <= latitude <= 90:
        return False

    if not -180 <= longitude <= 180:
        return False

    return True


def create_location_record(
    latitude,
    longitude,
    source="satellite",
):
    """Create a geographic observation record."""

    if not validate_coordinates(latitude, longitude):
        raise ValueError(
            "Invalid latitude or longitude."
        )

    return {
        "latitude": latitude,
        "longitude": longitude,
        "source": source,
    }


def main():
    print("FORESTIQ - Geographic Analysis")
    print("=" * 40)

    RESULTS_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    # Example structure only.
    # These are NOT real project observations.
    example_record = create_location_record(
        latitude=19.0760,
        longitude=72.8777,
        source="satellite",
    )

    output_path = (
        RESULTS_DIR
        / "location_schema.json"
    )

    output_path.write_text(
        json.dumps(
            {
                "description": (
                    "Schema for storing geographic "
                    "forest observations."
                ),
                "record_example": example_record,
            },
            indent=4,
        ),
        encoding="utf-8",
    )

    print()
    print("GPS validation: READY")
    print("Latitude range : -90 to 90")
    print("Longitude range: -180 to 180")
    print()
    print(f"Schema saved to:")
    print(output_path)
    print()
    print(
        "Note: The example coordinates are only "
        "a schema test, not research results."
    )


if __name__ == "__main__":
    main()