import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  Leaf,
  Loader2,
  MapPinned,
  ShieldAlert,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeChange } from "./services/api";
import "./ChangeDetection.css";

const CHANGE_THRESHOLD = 30;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () =>
      reject(
        new Error("Unable to load image for comparison.")
      );

    image.src = url;
  });
}

function getGrayValue(r, g, b) {
  return (
    0.299 * r +
    0.587 * g +
    0.114 * b
  );
}

async function buildActualChangeMap(
  beforeUrl,
  afterUrl
) {
  const before = await loadImage(beforeUrl);
  const after = await loadImage(afterUrl);

  const maxWidth = 1200;
  const maxHeight = 650;

  const sourceWidth = Math.min(
    before.naturalWidth,
    after.naturalWidth
  );

  const sourceHeight = Math.min(
    before.naturalHeight,
    after.naturalHeight
  );

  const scale = Math.min(
    maxWidth / sourceWidth,
    maxHeight / sourceHeight,
    1
  );

  const width = Math.max(
    1,
    Math.round(sourceWidth * scale)
  );

  const height = Math.max(
    1,
    Math.round(sourceHeight * scale)
  );

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!ctx) {
    throw new Error(
      "Unable to create change visualization canvas."
    );
  }

  const beforeCanvas =
    document.createElement("canvas");

  beforeCanvas.width = width;
  beforeCanvas.height = height;

  const afterCanvas =
    document.createElement("canvas");

  afterCanvas.width = width;
  afterCanvas.height = height;

  const beforeCtx =
    beforeCanvas.getContext("2d", {
      willReadFrequently: true,
    });

  const afterCtx =
    afterCanvas.getContext("2d", {
      willReadFrequently: true,
    });

  if (!beforeCtx || !afterCtx) {
    throw new Error(
      "Unable to prepare imagery comparison."
    );
  }

  /*
   * Draw both images into the same normalized
   * comparison space.
   */
  beforeCtx.drawImage(
    before,
    0,
    0,
    before.naturalWidth,
    before.naturalHeight,
    0,
    0,
    width,
    height
  );

  afterCtx.drawImage(
    after,
    0,
    0,
    after.naturalWidth,
    after.naturalHeight,
    0,
    0,
    width,
    height
  );

  const beforeData =
    beforeCtx.getImageData(
      0,
      0,
      width,
      height
    );

  const afterData =
    afterCtx.getImageData(
      0,
      0,
      width,
      height
    );

  /*
   * Start with the AFTER image.
   * Changed pixels will be highlighted
   * with a red overlay.
   */
  const outputData = new ImageData(
    new Uint8ClampedArray(afterData.data),
    width,
    height
  );

  let changedPixels = 0;

  for (
    let i = 0;
    i < beforeData.data.length;
    i += 4
  ) {
    const beforeGray = getGrayValue(
      beforeData.data[i],
      beforeData.data[i + 1],
      beforeData.data[i + 2]
    );

    const afterGray = getGrayValue(
      afterData.data[i],
      afterData.data[i + 1],
      afterData.data[i + 2]
    );

    const difference = Math.abs(
      beforeGray - afterGray
    );

    if (difference > CHANGE_THRESHOLD) {
      changedPixels += 1;

      /*
       * Stronger difference = stronger red overlay.
       */
      const intensity = Math.min(
        1,
        Math.max(
          0,
          (difference - CHANGE_THRESHOLD) / 100
        )
      );

      outputData.data[i] =
        220 + Math.round(intensity * 35);

      outputData.data[i + 1] = 55;

      outputData.data[i + 2] = 45;

      outputData.data[i + 3] = 220;
    } else {
      /*
       * Keep stable regions visible but slightly
       * desaturated so detected regions stand out.
       */
      const r = outputData.data[i];
      const g = outputData.data[i + 1];
      const b = outputData.data[i + 2];

      const gray = getGrayValue(
        r,
        g,
        b
      );

      outputData.data[i] = Math.round(
        r * 0.78 + gray * 0.22
      );

      outputData.data[i + 1] = Math.round(
        g * 0.78 + gray * 0.22
      );

      outputData.data[i + 2] = Math.round(
        b * 0.78 + gray * 0.22
      );

      outputData.data[i + 3] = 255;
    }
  }

  ctx.putImageData(
    outputData,
    0,
    0
  );

  const percentage = Number(
    (
      (changedPixels /
        (width * height)) *
      100
    ).toFixed(2)
  );

  return {
    image: canvas.toDataURL(
      "image/png"
    ),
    percentage,
    width,
    height,
    changedPixels,
    totalPixels:
      width * height,
  };
}

function ChangeDetection() {
  const navigate = useNavigate();

  const beforeInput = useRef(null);
  const afterInput = useRef(null);

  const [beforeFile, setBeforeFile] =
    useState(null);

  const [afterFile, setAfterFile] =
    useState(null);

  const [beforeImage, setBeforeImage] =
    useState("");

  const [afterImage, setAfterImage] =
    useState("");

  const [analyzing, setAnalyzing] =
    useState(false);

  const [analyzed, setAnalyzed] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");

  const [changeMapImage, setChangeMapImage] =
    useState("");

  const [
    visualChangePercent,
    setVisualChangePercent,
  ] = useState(null);

  const handleImage = (
    file,
    type
  ) => {
    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    if (
      file.size >
      25 * 1024 * 1024
    ) {
      setError(
        "Image size must be 25 MB or less."
      );
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setError("");
    setAnalyzed(false);
    setResult(null);
    setChangeMapImage("");
    setVisualChangePercent(null);

    if (type === "before") {
      if (beforeImage) {
        URL.revokeObjectURL(
          beforeImage
        );
      }

      setBeforeFile(file);
      setBeforeImage(imageUrl);
    } else {
      if (afterImage) {
        URL.revokeObjectURL(
          afterImage
        );
      }

      setAfterFile(file);
      setAfterImage(imageUrl);
    }
  };

  const handleDrop = (
    event,
    type
  ) => {
    event.preventDefault();

    const file =
      event.dataTransfer.files?.[0];

    handleImage(
      file,
      type
    );
  };

  const clearImage = (
    type
  ) => {
    setAnalyzed(false);
    setResult(null);
    setError("");
    setChangeMapImage("");
    setVisualChangePercent(null);

    if (type === "before") {
      if (beforeImage) {
        URL.revokeObjectURL(
          beforeImage
        );
      }

      setBeforeImage("");
      setBeforeFile(null);

      if (beforeInput.current) {
        beforeInput.current.value =
          "";
      }
    } else {
      if (afterImage) {
        URL.revokeObjectURL(
          afterImage
        );
      }

      setAfterImage("");
      setAfterFile(null);

      if (afterInput.current) {
        afterInput.current.value =
          "";
      }
    }
  };

  const analyzeForestChange =
    async () => {
      if (
        !beforeFile ||
        !afterFile
      ) {
        setError(
          "Please upload both before and after images."
        );
        return;
      }

      try {
        setAnalyzing(true);
        setAnalyzed(false);
        setResult(null);
        setError("");
        setChangeMapImage("");
        setVisualChangePercent(null);

        /*
         * Backend temporal change analysis.
         */
        const response =
          await analyzeChange({
            beforeFile,
            afterFile,
          });

        setResult(response);

        /*
         * Frontend visual change map.
         * This creates an actual image-space
         * overlay from the uploaded imagery.
         */
        try {
          const visualMap =
            await buildActualChangeMap(
              beforeImage,
              afterImage
            );

          setChangeMapImage(
            visualMap.image
          );

          setVisualChangePercent(
            visualMap.percentage
          );
        } catch (
          visualError
        ) {
          console.warn(
            "Visual change map generation failed:",
            visualError
          );
        }

        setAnalyzed(true);
      } catch (err) {
        console.error(
          "Change detection error:",
          err
        );

        setError(
          err?.message ||
            "Unable to analyze forest change."
        );
      } finally {
        setAnalyzing(false);
      }
    };

  useEffect(() => {
    return () => {
      if (beforeImage) {
        URL.revokeObjectURL(
          beforeImage
        );
      }

      if (afterImage) {
        URL.revokeObjectURL(
          afterImage
        );
      }
    };
  }, []);

  /*
   * Backend response compatibility.
   *
   * Current backend returns:
   * result.change_detection.changed_area_percentage
   */
  const changeData =
    result?.change_detection ||
    result?.analysis ||
    result?.result ||
    result ||
    {};

  const backendChangedAreaPercent =
    changeData.changed_area_percentage ??
    changeData.changed_area_percent ??
    changeData.change_percentage ??
    changeData.change_percent ??
    null;

  /*
   * Backend result is authoritative.
   *
   * Visual percentage is only used if the
   * backend does not provide a percentage.
   */
  const changedAreaPercent =
    backendChangedAreaPercent !== null
      ? Number(
          backendChangedAreaPercent
        )
      : visualChangePercent !== null
        ? Number(
            visualChangePercent
          )
        : 0;

  const severity =
    changeData.severity ||
    changeData.change_signal ||
    "low";

  const beforeMetadata =
    changeData.before_metadata ||
    changeData.before_image_metadata ||
    {};

  const afterMetadata =
    changeData.after_metadata ||
    changeData.after_image_metadata ||
    {};

  const beforeCover =
    changeData.before_forest_cover ??
    changeData.forest_cover_before ??
    null;

  const afterCover =
    changeData.after_forest_cover ??
    changeData.forest_cover_after ??
    null;

  const changeArea =
    changeData.change_area_hectares ??
    changeData.changed_area_hectares ??
    null;

  const method =
    changeData.method ||
    "grayscale_pixel_difference";

  const trainedModelUsed =
    changeData.trained_model_used ??
    false;

  const getSeverityClass =
    () => {
      const value =
        String(
          severity
        ).toLowerCase();

      if (
        value.includes(
          "critical"
        )
      ) {
        return "risk-high";
      }

      if (
        value.includes(
          "high"
        )
      ) {
        return "risk-high";
      }

      if (
        value.includes(
          "moderate"
        )
      ) {
        return "risk-medium";
      }

      return "risk-low";
    };

  const displaySeverity =
    String(
      severity
    ).charAt(0).toUpperCase() +
    String(
      severity
    ).slice(1);

  return (
    <div className="change-page">

      {/* HEADER */}
      <header className="change-header">
        <div className="change-header-inner">

          <button
            className="back-btn"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <div className="change-brand">

            <div className="change-brand-icon">
              <Leaf size={20} />
            </div>

            <div>
              <strong>
                FORESTIQ
              </strong>

              <span>
                CHANGE DETECTION
              </span>
            </div>

          </div>

          <div className="header-status">
            <span></span>
            Analysis Module
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="change-main">

        {/* INTRO */}
        <section className="change-intro">

          <div>

            <div className="change-kicker">
              TEMPORAL FOREST ANALYSIS
            </div>

            <h1>
              Compare forests.
              <span>
                {" "}
                Detect change.
              </span>
            </h1>

            <p>
              Upload forest imagery
              from two different
              time periods to
              identify measurable
              image changes and
              potential forest
              cover change zones.
            </p>

          </div>

          <div className="intro-icon">
            <BarChart3 size={34} />
          </div>

        </section>

        {/* UPLOAD / COMPARISON */}
        <section className="comparison-section">

          <div className="section-title">

            <div>

              <h2>
                Before & After Imagery
              </h2>

              <p>
                Provide two images
                of the same forest
                region captured at
                different times.
              </p>

            </div>

            <div className="time-badge">
              <Clock3 size={16} />
              Temporal Comparison
            </div>

          </div>

          <div className="upload-grid">

            {/* BEFORE */}
            <div className="upload-panel">

              <div className="panel-title">

                <div className="panel-number before-number">
                  01
                </div>

                <div>
                  <strong>
                    Before Image
                  </strong>

                  <span>
                    Earlier forest
                    condition
                  </span>
                </div>

              </div>

              {!beforeImage ? (

                <div
                  className="drop-zone before-zone"
                  onDragOver={(event) =>
                    event.preventDefault()
                  }
                  onDrop={(event) =>
                    handleDrop(
                      event,
                      "before"
                    )
                  }
                  onClick={() =>
                    beforeInput.current?.click()
                  }
                >

                  <div className="upload-icon">
                    <Upload size={25} />
                  </div>

                  <strong>
                    Upload Before Image
                  </strong>

                  <span>
                    Drag & drop or click
                    to browse
                  </span>

                  <small>
                    JPG, PNG, WEBP
                  </small>

                  <input
                    ref={beforeInput}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) =>
                      handleImage(
                        event.target
                          .files?.[0],
                        "before"
                      )
                    }
                  />

                </div>

              ) : (

                <div className="preview-box">

                  <img
                    src={beforeImage}
                    alt="Before forest"
                  />

                  <div className="preview-overlay">

                    <span>
                      BEFORE
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        clearImage(
                          "before"
                        )
                      }
                      aria-label="Remove before image"
                    >
                      <X size={17} />
                    </button>

                  </div>

                </div>

              )}

            </div>

            {/* AFTER */}
            <div className="upload-panel">

              <div className="panel-title">

                <div className="panel-number after-number">
                  02
                </div>

                <div>
                  <strong>
                    After Image
                  </strong>

                  <span>
                    Recent forest
                    condition
                  </span>
                </div>

              </div>

              {!afterImage ? (

                <div
                  className="drop-zone after-zone"
                  onDragOver={(event) =>
                    event.preventDefault()
                  }
                  onDrop={(event) =>
                    handleDrop(
                      event,
                      "after"
                    )
                  }
                  onClick={() =>
                    afterInput.current?.click()
                  }
                >

                  <div className="upload-icon">
                    <Upload size={25} />
                  </div>

                  <strong>
                    Upload After Image
                  </strong>

                  <span>
                    Drag & drop or click
                    to browse
                  </span>

                  <small>
                    JPG, PNG, WEBP
                  </small>

                  <input
                    ref={afterInput}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) =>
                      handleImage(
                        event.target
                          .files?.[0],
                        "after"
                      )
                    }
                  />

                </div>

              ) : (

                <div className="preview-box">

                  <img
                    src={afterImage}
                    alt="After forest"
                  />

                  <div className="preview-overlay">

                    <span>
                      AFTER
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        clearImage(
                          "after"
                        )
                      }
                      aria-label="Remove after image"
                    >
                      <X size={17} />
                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="change-error">
              {error}
            </div>
          )}

          {/* ANALYZE BUTTON */}
          <div className="analyze-area">

            <button
              className="analyze-change-btn"
              disabled={
                !beforeFile ||
                !afterFile ||
                analyzing
              }
              onClick={
                analyzeForestChange
              }
            >

              {analyzing ? (
                <>
                  <Loader2
                    size={19}
                    className="spin"
                  />

                  Comparing imagery...
                </>
              ) : (
                <>
                  <ShieldAlert
                    size={19}
                  />

                  Analyze Forest Change
                </>
              )}

            </button>

            {(!beforeFile ||
              !afterFile) && (
              <span className="helper-text">
                Upload both images
                to start analysis.
              </span>
            )}

          </div>

        </section>

        {/* RESULTS */}
        {analyzed &&
          result && (

            <section className="results-section">

              <div className="results-header">

                <div>

                  <div className="change-kicker">
                    BACKEND CHANGE ANALYSIS
                  </div>

                  <h2>
                    Forest Change Results
                  </h2>

                  <p>
                    Results generated
                    from the FORESTIQ
                    temporal
                    change-detection
                    analysis engine.
                  </p>

                </div>

                <div className="result-ready">
                  <CheckCircle2
                    size={17}
                  />

                  Analysis Complete
                </div>

              </div>

              {/* RESULT CARDS */}
              <div className="result-grid">

                <div className="result-card">

                  <div className="result-card-icon green-result">
                    <Leaf size={20} />
                  </div>

                  <span>
                    Before Image
                  </span>

                  <strong>
                    {beforeCover !==
                    null
                      ? `${beforeCover}%`
                      : beforeMetadata.width &&
                          beforeMetadata.height
                        ? `${beforeMetadata.width} × ${beforeMetadata.height}`
                        : "Processed"}
                  </strong>

                  <small>
                    Earlier observation
                  </small>

                </div>

                <div className="result-card">

                  <div className="result-card-icon blue-result">
                    <Leaf size={20} />
                  </div>

                  <span>
                    After Image
                  </span>

                  <strong>
                    {afterCover !==
                    null
                      ? `${afterCover}%`
                      : afterMetadata.width &&
                          afterMetadata.height
                        ? `${afterMetadata.width} × ${afterMetadata.height}`
                        : "Processed"}
                  </strong>

                  <small>
                    Recent observation
                  </small>

                </div>

                <div className="result-card">

                  <div className="result-card-icon orange-result">
                    <MapPinned
                      size={20}
                    />
                  </div>

                  <span>
                    Changed Area
                  </span>

                  <strong>
                    {changeArea !==
                    null
                      ? `${changeArea} ha`
                      : `${changedAreaPercent.toFixed(
                          2
                        )}%`}
                  </strong>

                  <small>
                    Detected image-space
                    difference
                  </small>

                </div>

                <div className="result-card">

                  <div className="result-card-icon red-result">
                    <ShieldAlert
                      size={20}
                    />
                  </div>

                  <span>
                    Change Signal
                  </span>

                  <strong>
                    {displaySeverity}
                  </strong>

                  <small>
                    Backend classification
                  </small>

                </div>

              </div>

              {/* ACTUAL CHANGE MAP */}
              <div className="change-map-card">

                <div className="map-card-header">

                  <div>

                    <h3>
                      Change Detection
                      Map
                    </h3>

                    <p>
                      Actual visual
                      comparison
                      generated from
                      the uploaded
                      before and after
                      imagery.
                    </p>

                  </div>

                  <div className="map-source">
                    Actual Pixel
                    Difference
                  </div>

                </div>

                {changeMapImage ? (

                  <div className="actual-map-wrapper">

                    <img
                      className="actual-change-map"
                      src={
                        changeMapImage
                      }
                      alt="Actual forest change detection overlay"
                    />

                    <div className="actual-map-label">
                      <MapPinned
                        size={15}
                      />

                      DETECTED CHANGE
                      OVERLAY
                    </div>

                    <div className="actual-map-stat">

                      <span>
                        Backend change
                      </span>

                      <strong>
                        {changedAreaPercent.toFixed(
                          2
                        )}
                        %
                      </strong>

                    </div>

                  </div>

                ) : (

                  <div className="map-empty-state">

                    <Loader2
                      size={25}
                      className="spin"
                    />

                    Generating actual
                    change
                    visualization...

                  </div>

                )}

                <div className="map-legend">

                  <div>
                    <span className="legend-dot stable"></span>

                    Stable / low
                    difference
                  </div>

                  <div>
                    <span className="legend-dot deforested"></span>

                    Detected pixel
                    difference
                  </div>

                </div>

                <div className="map-note">

                  Red pixels show
                  locations where the
                  grayscale
                  difference crosses
                  the current baseline
                  threshold of{" "}

                  <strong>
                    {CHANGE_THRESHOLD}
                  </strong>
                  .

                  {" "}
                  This is an
                  image-space change
                  visualization, not
                  a GPS map.

                </div>

              </div>

              {/* VISUAL VS BACKEND */}
              {visualChangePercent !==
                null &&
                backendChangedAreaPercent !==
                  null && (
                  <div className="methodology-card">

                    <div className="methodology-icon">
                      <BarChart3
                        size={22}
                      />
                    </div>

                    <div>

                      <h3>
                        Change Analysis
                        Validation
                      </h3>

                      <p>
                        The backend
                        calculates the
                        official change
                        percentage.
                        FORESTIQ also
                        generates an
                        independent
                        browser-side
                        visualization
                        from the same
                        uploaded imagery.
                      </p>

                      <div className="methodology-status">

                        <span>
                          Backend
                        </span>

                        <strong>
                          {Number(
                            backendChangedAreaPercent
                          ).toFixed(2)}
                          %
                        </strong>

                        <span>
                          Visual map
                        </span>

                        <strong>
                          {Number(
                            visualChangePercent
                          ).toFixed(2)}
                          %
                        </strong>

                      </div>

                    </div>

                  </div>
                )}

              {/* SUMMARY */}
              <div className="hotspots-card">

                <div className="hotspots-heading">

                  <div>

                    <h3>
                      Detected Change
                      Summary
                    </h3>

                    <p>
                      Temporal
                      difference
                      statistics
                      generated by
                      FORESTIQ.
                    </p>

                  </div>

                  <BarChart3
                    size={22}
                  />

                </div>

                <div className="hotspot-list">

                  <div className="hotspot-row">

                    <div className="hotspot-id">
                      01
                    </div>

                    <div className="hotspot-info">

                      <strong>
                        Changed Pixel
                        Area
                      </strong>

                      <span>
                        Percentage of
                        imagery showing
                        measurable
                        difference
                      </span>

                    </div>

                    <div className="hotspot-area">
                      {changedAreaPercent.toFixed(
                        2
                      )}
                      %
                    </div>

                    <span
                      className={getSeverityClass()}
                    >
                      {String(
                        severity
                      ).toUpperCase()}
                    </span>

                  </div>

                  <div className="hotspot-row">

                    <div className="hotspot-id">
                      02
                    </div>

                    <div className="hotspot-info">

                      <strong>
                        Before Imagery
                      </strong>

                      <span>
                        Uploaded earlier
                        observation
                      </span>

                    </div>

                    <div className="hotspot-area">
                      {beforeFile?.name ||
                        "Image"}
                    </div>

                    <span className="risk-low">
                      READY
                    </span>

                  </div>

                  <div className="hotspot-row">

                    <div className="hotspot-id">
                      03
                    </div>

                    <div className="hotspot-info">

                      <strong>
                        After Imagery
                      </strong>

                      <span>
                        Uploaded recent
                        observation
                      </span>

                    </div>

                    <div className="hotspot-area">
                      {afterFile?.name ||
                        "Image"}
                    </div>

                    <span className="risk-low">
                      READY
                    </span>

                  </div>

                </div>

              </div>

              {/* METHODOLOGY */}
              <div className="methodology-card">

                <div className="methodology-icon">
                  <ImageIcon
                    size={22}
                  />
                </div>

                <div>

                  <h3>
                    Change Detection
                    Methodology
                  </h3>

                  <p>
                    FORESTIQ compares
                    the two uploaded
                    observations using
                    a reproducible
                    image-processing
                    pipeline. The
                    current temporal
                    baseline calculates
                    pixel-level
                    grayscale
                    differences using
                    a threshold of{" "}
                    <strong>
                      {CHANGE_THRESHOLD}
                    </strong>
                    , then classifies
                    the detected change
                    percentage as Low,
                    Moderate, High, or
                    Critical.
                  </p>

                  <p>
                    The trained
                    MobileNetV3-Small
                    model is used
                    separately for
                    EuroSAT 10-class
                    land-cover
                    classification.
                    It is not presented
                    as a temporal
                    deforestation
                    predictor.
                  </p>

                  <div className="methodology-status">

                    <span>
                      Method
                    </span>

                    <strong>
                      {method}
                    </strong>

                    <span>
                      Trained model
                    </span>

                    <strong>
                      {trainedModelUsed
                        ? "Used"
                        : "Separate land-cover classifier"}
                    </strong>

                  </div>

                </div>

              </div>

            </section>
          )}

        {/* WORKFLOW */}
        <section className="workflow-section">

          <div className="workflow-heading">

            <div className="change-kicker">
              RESEARCH PIPELINE
            </div>

            <h2>
              How change detection
              works
            </h2>

            <p>
              A reproducible workflow
              from imagery collection
              to research
              interpretation.
            </p>

          </div>

          <div className="workflow-grid">

            <div className="workflow-step">

              <div className="workflow-number">
                01
              </div>

              <strong>
                Collect
              </strong>

              <span>
                Capture imagery
                from different
                time periods.
              </span>

            </div>

            <div className="workflow-step">

              <div className="workflow-number">
                02
              </div>

              <strong>
                Preprocess
              </strong>

              <span>
                Normalize and
                align imagery
                for comparison.
              </span>

            </div>

            <div className="workflow-step">

              <div className="workflow-number">
                03
              </div>

              <strong>
                Compare
              </strong>

              <span>
                Analyze pixel-level
                grayscale
                differences.
              </span>

            </div>

            <div className="workflow-step">

              <div className="workflow-number">
                04
              </div>

              <strong>
                Interpret
              </strong>

              <span>
                Generate change
                statistics and
                severity insights.
              </span>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="change-footer">

        <span>
          FORESTIQ · Change Detection
        </span>

        <span>
          Research Methodology
          2026–2027 🌿
        </span>

      </footer>

    </div>
  );
}

export default ChangeDetection;