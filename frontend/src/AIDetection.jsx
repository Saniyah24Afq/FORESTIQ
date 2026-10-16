import { useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileSearch,
  Image as ImageIcon,
  Leaf,
  Loader2,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeImage as analyzeImageAPI } from "./services/api";
import "./AIDetection.css";

function AIDetection() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [source, setSource] = useState("satellite");

  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ============================================================
  // IMAGE SELECTION
  // ============================================================

  const selectImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));

    setAnalyzed(false);
    setResult(null);
    setError("");
  };

  const handleFile = (event) => {
    selectImage(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    selectImage(event.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview("");
    setAnalyzed(false);
    setResult(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // ============================================================
  // ACTUAL FASTAPI + TRAINED MODEL ANALYSIS
  // ============================================================

  const analyzeImage = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setAnalyzing(true);
    setAnalyzed(false);
    setResult(null);
    setError("");

    try {
      const response = await analyzeImageAPI({
        file: image,
        source,
      });

      setResult(response);
      setAnalyzed(true);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to analyze the image. Please make sure the FORESTIQ backend is running."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ============================================================
  // RESPONSE DATA
  // ============================================================

  const analysis = result?.analysis || {};

  const trainedModel = analysis?.trained_model || {};

  const baseline = analysis?.baseline || {};

  const prediction =
    trainedModel?.prediction || "Unavailable";

  const confidence =
    Number(trainedModel?.confidence || 0);

  const vegetationIndicator =
    Number(
      baseline?.baseline_vegetation_indicator || 0
    );

  const topPredictions =
    trainedModel?.top_predictions || [];

  const modelReady =
    trainedModel?.trained_model_used === true;

  // ============================================================
  // HELPERS
  // ============================================================

  const formatClassName = (value) => {
    if (!value) {
      return "Unavailable";
    }

    return String(value)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (char) => char.toUpperCase());
  };

  const getPredictionDescription = () => {
    if (!modelReady) {
      return "Trained model prediction unavailable.";
    }

    if (prediction === "Forest") {
      return "Model classified the uploaded imagery as forest land cover.";
    }

    return `Model classified the uploaded imagery as ${formatClassName(
      prediction
    )} land cover.`;
  };

  const sourceLabel =
    source === "satellite"
      ? "Satellite"
      : source === "drone"
        ? "Drone"
        : "Ground Camera";

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="ai-detection-page">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <header className="ai-navbar">

        <div className="ai-nav-inner">

          <button
            className="ai-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>


          <div className="ai-brand">

            <div className="ai-brand-icon">
              <Sparkles size={21} />
            </div>

            <div>

              <div className="ai-brand-name">
                FORESTIQ
              </div>

              <div className="ai-brand-tagline">
                AI DETECTION
              </div>

            </div>

          </div>


          <div className="ai-status">

            <span></span>

            Trained AI Model Ready

          </div>

        </div>

      </header>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main>

        <section className="ai-hero">

          <div className="ai-container">

            {/* =================================================
                INTRO
            ================================================= */}

            <div className="ai-kicker">
              TRAINED AI FOREST ANALYSIS
            </div>


            <div className="ai-title-row">

              <div>

                <h1>
                  Turn imagery into
                  <span> forest intelligence.</span>
                </h1>

                <p>
                  Upload satellite, drone or ground-camera
                  imagery and run the trained FORESTIQ
                  land-cover classification model.
                </p>

              </div>


              <div className="ai-title-icon">

                <ShieldCheck size={34} />

              </div>

            </div>


            {/* =================================================
                WORKSPACE
            ================================================= */}

            <div className="ai-workspace">

              {/* =================================================
                  STEP 01
              ================================================= */}

              <div className="upload-column">

                <div className="workspace-heading">

                  <div>

                    <div className="workspace-kicker">
                      STEP 01
                    </div>

                    <h2>
                      Provide forest imagery
                    </h2>

                  </div>


                  <div className="workspace-pill">

                    <ImageIcon size={15} />

                    Image input

                  </div>

                </div>


                {/* =================================================
                    SOURCE SELECTOR
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "14px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    background: "#fff7fb",
                    border: "1px solid #eadde6",
                  }}
                >

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#7e7180",
                    }}
                  >
                    Imagery source
                  </span>


                  <select
                    value={source}
                    onChange={(event) =>
                      setSource(event.target.value)
                    }
                    style={{
                      flex: 1,
                      border: "1px solid #eadde6",
                      borderRadius: "9px",
                      padding: "8px 10px",
                      background: "#ffffff",
                      color: "#33253a",
                      fontWeight: 700,
                      outline: "none",
                    }}
                  >

                    <option value="satellite">
                      Satellite
                    </option>

                    <option value="drone">
                      Drone
                    </option>

                    <option value="camera">
                      Ground Camera
                    </option>

                  </select>

                </div>


                {/* =================================================
                    UPLOAD AREA
                ================================================= */}

                {!preview ? (

                  <div
                    className={`ai-dropzone ${
                      dragActive ? "drag-active" : ""
                    }`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() =>
                      setDragActive(false)
                    }
                    onDrop={handleDrop}
                    onClick={() =>
                      inputRef.current?.click()
                    }
                  >

                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      hidden
                    />


                    <div className="upload-icon">

                      <Upload size={27} />

                    </div>


                    <h3>
                      Upload forest image
                    </h3>


                    <p>
                      Drag & drop an image here,
                      or click to browse
                    </p>


                    <span>
                      PNG · JPG · JPEG · WEBP
                    </span>

                  </div>

                ) : (

                  <div className="image-preview-card">

                    <img
                      src={preview}
                      alt="Uploaded forest imagery"
                    />


                    <div className="preview-overlay">

                      <div>

                        <span>
                          INPUT IMAGE
                        </span>

                        <strong>
                          {image?.name}
                        </strong>

                      </div>


                      <button
                        type="button"
                        onClick={removeImage}
                        aria-label="Remove image"
                      >

                        <X size={17} />

                      </button>

                    </div>

                  </div>

                )}


                {/* =================================================
                    ANALYZE BUTTON
                ================================================= */}

                <button
                  className="analyze-btn"
                  disabled={!image || analyzing}
                  onClick={analyzeImage}
                >

                  {analyzing ? (

                    <>

                      <Loader2
                        size={18}
                        className="spin"
                      />

                      Running trained AI model...

                    </>

                  ) : (

                    <>

                      <Sparkles size={18} />

                      Analyze with FORESTIQ AI

                    </>

                  )}

                </button>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                  <div
                    style={{
                      marginTop: "14px",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "#fff0f3",
                      border: "1px solid #f7c9d6",
                      color: "#c23d63",
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >

                    {error}

                  </div>

                )}

              </div>


              {/* =================================================
                  STEP 02
              ================================================= */}

              <div className="results-column">

                <div className="workspace-heading">

                  <div>

                    <div className="workspace-kicker">
                      STEP 02
                    </div>

                    <h2>
                      AI analysis result
                    </h2>

                  </div>


                  <div
                    className={`result-state ${
                      analyzed ? "ready" : ""
                    }`}
                  >

                    <span></span>

                    {analyzing
                      ? "Processing"
                      : analyzed
                        ? "Analysis complete"
                        : "Awaiting image"}

                  </div>

                </div>


                {/* =================================================
                    EMPTY RESULT
                ================================================= */}

                {!analyzed ? (

                  <div className="empty-result">

                    <div className="empty-result-icon">

                      <FileSearch size={29} />

                    </div>


                    <h3>
                      Your analysis will appear here
                    </h3>


                    <p>
                      FORESTIQ will send the uploaded
                      imagery to the trained MobileNetV3-Small
                      model and return land-cover prediction,
                      confidence and vegetation indicators.
                    </p>


                    <div className="analysis-steps">

                      <div>

                        <span>01</span>

                        Image preprocessing

                      </div>


                      <div>

                        <span>02</span>

                        Trained ML classification

                      </div>


                      <div>

                        <span>03</span>

                        Confidence & research output

                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="result-content">

                    {/* =================================================
                        RESULT HEADER
                    ================================================= */}

                    <div className="result-top">

                      <div className="result-check">

                        <CheckCircle2 size={19} />

                        Trained AI analysis completed

                      </div>


                      <span>
                        MobileNetV3-Small
                      </span>

                    </div>


                    {/* =================================================
                        RESULT CARDS
                    ================================================= */}

                    <div className="result-grid">

                      {/* LAND COVER */}

                      <div className="result-card green-result">

                        <span>
                          Land Cover
                        </span>


                        <strong>
                          {formatClassName(
                            prediction
                          )}
                        </strong>


                        <small>
                          Trained model prediction
                        </small>

                      </div>


                      {/* CONFIDENCE */}

                      <div className="result-card orange-result">

                        <span>
                          Model Confidence
                        </span>


                        <strong>
                          {confidence.toFixed(2)}%
                        </strong>


                        <small>
                          Prediction confidence
                        </small>

                      </div>


                      {/* VEGETATION */}

                      <div className="result-card red-result">

                        <span>
                          Vegetation Indicator
                        </span>


                        <strong>
                          {vegetationIndicator.toFixed(2)}%
                        </strong>


                        <small>
                          Baseline vegetation signal
                        </small>

                      </div>

                    </div>


                    {/* =================================================
                        MODEL SUMMARY
                    ================================================= */}

                    <div
                      style={{
                        marginTop: "18px",
                        padding: "16px",
                        borderRadius: "14px",
                        background:
                          "linear-gradient(135deg, #fff5fa, #f7f3ff)",
                        border: "1px solid #eadde6",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "8px",
                        }}
                      >

                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            display: "grid",
                            placeItems: "center",
                            background: "#f7a8c4",
                            color: "#8f315e",
                          }}
                        >

                          <ShieldCheck size={18} />

                        </div>


                        <div>

                          <strong
                            style={{
                              display: "block",
                              color: "#33253a",
                              fontSize: "13px",
                            }}
                          >
                            Trained FORESTIQ Classification
                          </strong>


                          <span
                            style={{
                              fontSize: "11px",
                              color: "#7e7180",
                            }}
                          >
                            EuroSAT RGB · 10 land-cover classes
                          </span>

                        </div>

                      </div>


                      <p
                        style={{
                          margin: 0,
                          color: "#6e6270",
                          fontSize: "12px",
                          lineHeight: 1.6,
                        }}
                      >

                        {getPredictionDescription()}

                      </p>

                    </div>


                    {/* =================================================
                        TOP PREDICTIONS
                    ================================================= */}

                    {topPredictions.length > 0 && (

                      <div
                        style={{
                          marginTop: "18px",
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >

                          <strong
                            style={{
                              color: "#33253a",
                              fontSize: "13px",
                            }}
                          >
                            Top model predictions
                          </strong>


                          <span
                            style={{
                              color: "#9a8795",
                              fontSize: "11px",
                            }}
                          >
                            Ranked output
                          </span>

                        </div>


                        <div
                          style={{
                            display: "grid",
                            gap: "8px",
                          }}
                        >

                          {topPredictions.map(
                            (item, index) => (

                              <div
                                key={`${item.class}-${index}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  padding: "10px 12px",
                                  borderRadius: "11px",
                                  background: "#ffffff",
                                  border:
                                    "1px solid #eadde6",
                                }}
                              >

                                <div
                                  style={{
                                    width: "26px",
                                    height: "26px",
                                    borderRadius: "8px",
                                    display: "grid",
                                    placeItems: "center",
                                    background:
                                      index === 0
                                        ? "#f7a8c4"
                                        : "#f2edff",
                                    color:
                                      index === 0
                                        ? "#8f315e"
                                        : "#7653a8",
                                    fontSize: "11px",
                                    fontWeight: 800,
                                  }}
                                >

                                  {index + 1}

                                </div>


                                <div
                                  style={{
                                    flex: 1,
                                  }}
                                >

                                  <strong
                                    style={{
                                      display: "block",
                                      fontSize: "12px",
                                      color: "#33253a",
                                    }}
                                  >

                                    {formatClassName(
                                      item.class
                                    )}

                                  </strong>


                                  <div
                                    style={{
                                      height: "5px",
                                      marginTop: "6px",
                                      borderRadius: "99px",
                                      background: "#f1e9ef",
                                      overflow: "hidden",
                                    }}
                                  >

                                    <div
                                      style={{
                                        width: `${Math.min(
                                          100,
                                          Number(
                                            item.confidence || 0
                                          )
                                        )}%`,
                                        height: "100%",
                                        borderRadius: "99px",
                                        background:
                                          index === 0
                                            ? "#d94f87"
                                            : "#a78bfa",
                                      }}
                                    />

                                  </div>

                                </div>


                                <strong
                                  style={{
                                    fontSize: "12px",
                                    color: "#33253a",
                                  }}
                                >

                                  {Number(
                                    item.confidence || 0
                                  ).toFixed(2)}
                                  %

                                </strong>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    )}


                    {/* =================================================
                        IMAGE VISUALIZATION
                    ================================================= */}

                    <div
                      className="detection-visual"
                      style={{
                        marginTop: "18px",
                      }}
                    >

                      <div className="detection-image">

                        {preview && (

                          <img
                            src={preview}
                            alt="AI analyzed forest"
                          />

                        )}


                        <div className="detection-overlay overlay-one"></div>

                        <div className="detection-overlay overlay-two"></div>

                        <div className="detection-overlay overlay-three"></div>


                        <div className="detection-tag tag-one">

                          {formatClassName(
                            prediction
                          )}

                        </div>


                        <div className="detection-tag tag-two">

                          {confidence.toFixed(1)}% confidence

                        </div>


                        <div className="detection-tag tag-three">

                          {sourceLabel}

                        </div>

                      </div>

                    </div>


                    {/* =================================================
                        CONFIDENCE BAR
                    ================================================= */}

                    <div className="confidence-row">

                      <div>

                        <span>
                          Model confidence
                        </span>


                        <strong>
                          {confidence.toFixed(2)}%
                        </strong>

                      </div>


                      <div className="confidence-track">

                        <div
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                confidence
                              )
                            )}%`,
                          }}
                        ></div>

                      </div>

                    </div>


                    {/* =================================================
                        RESEARCH NOTE
                    ================================================= */}

                    <div
                      style={{
                        marginTop: "16px",
                        padding: "12px 14px",
                        borderRadius: "11px",
                        background: "#faf7fb",
                        border: "1px solid #eadde6",
                        color: "#756775",
                        fontSize: "11px",
                        lineHeight: 1.55,
                      }}
                    >

                      <strong
                        style={{
                          color: "#33253a",
                        }}
                      >
                        Research note:
                      </strong>{" "}

                      The trained model performs
                      10-class EuroSAT land-cover
                      classification. A single image
                      classification is not itself a
                      temporal deforestation measurement.
                      Before/after imagery is used by the
                      separate change-detection workflow.

                    </div>

                  </div>

                )}

              </div>

            </div>


            {/* ==================================================
                INFORMATION CARDS
            ================================================== */}

            <div className="ai-info-grid">

              <div className="info-card">

                <div className="info-icon">

                  <Leaf size={19} />

                </div>


                <div>

                  <strong>
                    Land-Cover Classification
                  </strong>


                  <span>
                    Classify imagery using the trained
                    EuroSAT MobileNetV3-Small model.
                  </span>

                </div>

              </div>


              <div className="info-card">

                <div className="info-icon orange">

                  <MapPinned size={19} />

                </div>


                <div>

                  <strong>
                    Multi-Source Imagery
                  </strong>


                  <span>
                    Satellite, drone and ground-camera
                    uploads are supported.
                  </span>

                </div>

              </div>


              <div className="info-card">

                <div className="info-icon blue">

                  <FileSearch size={19} />

                </div>


                <div>

                  <strong>
                    Research Output
                  </strong>


                  <span>
                    Prediction, confidence and top-class
                    probabilities support reproducible analysis.
                  </span>

                </div>

              </div>

            </div>


            {/* ==================================================
                METHODOLOGY NOTE
            ================================================== */}

            <div className="ai-method-note">

              <strong>
                Research methodology:
              </strong>{" "}

              FORESTIQ now uses the trained
              MobileNetV3-Small classifier for
              EuroSAT RGB land-cover prediction.
              The model was trained and evaluated
              using the project dataset. Temporal
              deforestation detection remains a
              separate before/after change-analysis
              task.

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AIDetection;