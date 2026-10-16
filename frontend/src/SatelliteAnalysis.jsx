import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  Satellite,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { analyzeImage } from "./services/api";
import "./SatelliteAnalysis.css";


function SatelliteAnalysis() {
  const [selectedFile, setSelectedFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");


  // =====================================================
  // FILE SELECTION
  // =====================================================

  function handleFileChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    setPreviewUrl(
      URL.createObjectURL(file)
    );

    setResult(null);
    setError("");
  }


  // =====================================================
  // REMOVE FILE
  // =====================================================

  function removeFile() {
    setSelectedFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
  }


  // =====================================================
  // ANALYZE IMAGE
  // =====================================================

  async function handleAnalyze() {
    if (!selectedFile) {
      setError(
        "Please select a satellite image first."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response =
        await analyzeImage({
          file: selectedFile,
          source: "satellite",
          latitude,
          longitude,
        });

      setResult(response);
    } catch (err) {
      setError(
        err.message ||
        "Unable to analyze image."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="satellite-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="satellite-header">

        <button
          className="back-button"
          onClick={() =>
            window.history.back()
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="header-title">

          <div className="title-icon">
            <Satellite size={25} />
          </div>

          <div>
            <p className="eyebrow">
              FORESTIQ ANALYSIS
            </p>

            <h1>
              Satellite Analysis
            </h1>
          </div>

        </div>

        <div className="live-badge">
          <span />
          Analysis Engine Ready
        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="satellite-content">

        <section className="intro-section">

          <div>

            <span className="section-tag">
              <Sparkles size={15} />
              AI-POWERED FOREST INTELLIGENCE
            </span>

            <h2>
              Analyze satellite imagery
              <span> intelligently.</span>
            </h2>

            <p>
              Upload satellite imagery and let
              FORESTIQ process the image through
              its forest-monitoring analysis
              pipeline.
            </p>

          </div>

        </section>


        <section className="analysis-grid">

          {/* =================================================
              UPLOAD CARD
          ================================================= */}

          <div className="upload-card">

            <div className="card-heading">

              <div>
                <h3>
                  Satellite Image
                </h3>

                <p>
                  JPG, PNG, WEBP, TIFF or BMP
                </p>
              </div>

              <ImageIcon size={22} />

            </div>


            {!selectedFile ? (

              <label
                className="drop-zone"
              >

                <input
                  type="file"
                  accept="
                    image/jpeg,
                    image/png,
                    image/webp,
                    image/tiff,
                    image/bmp
                  "
                  onChange={
                    handleFileChange
                  }
                />

                <div className="upload-icon">
                  <Upload size={28} />
                </div>

                <h4>
                  Upload satellite imagery
                </h4>

                <p>
                  Click here to browse
                  your computer
                </p>

                <span>
                  Maximum file size: 25 MB
                </span>

              </label>

            ) : (

              <div className="preview-wrapper">

                <img
                  src={previewUrl}
                  alt="Satellite preview"
                  className="image-preview"
                />

                <div className="file-info">

                  <div>
                    <strong>
                      {selectedFile.name}
                    </strong>

                    <span>
                      {(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </span>
                  </div>

                  <button
                    onClick={removeFile}
                    className="remove-button"
                    title="Remove image"
                  >
                    <X size={18} />
                  </button>

                </div>

              </div>

            )}


            {/* =================================================
                GPS
            ================================================= */}

            <div className="gps-section">

              <div className="gps-heading">

                <MapPin size={18} />

                <div>
                  <strong>
                    Geographic Location
                  </strong>

                  <span>
                    Optional GPS coordinates
                  </span>
                </div>

              </div>


              <div className="gps-inputs">

                <div className="input-group">

                  <label>
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 19.0760"
                    value={latitude}
                    onChange={(e) =>
                      setLatitude(
                        e.target.value
                      )
                    }
                  />

                </div>


                <div className="input-group">

                  <label>
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 72.8777"
                    value={longitude}
                    onChange={(e) =>
                      setLongitude(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}


            {/* =================================================
                ANALYZE BUTTON
            ================================================= */}

            <button
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={
                !selectedFile ||
                loading
              }
            >

              {loading ? (
                <>
                  <span className="spinner" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Sparkles size={19} />
                  Analyze Satellite Image
                </>
              )}

            </button>

          </div>


          {/* =================================================
              RESULTS CARD
          ================================================= */}

          <div className="results-card">

            <div className="results-header">

              <div>

                <span>
                  ANALYSIS OUTPUT
                </span>

                <h3>
                  Intelligence Results
                </h3>

              </div>

              <div className="result-status">
                <span />
                Ready
              </div>

            </div>


            {!result ? (

              <div className="empty-results">

                <div className="empty-icon">
                  <Satellite size={34} />
                </div>

                <h3>
                  Waiting for imagery
                </h3>

                <p>
                  Upload a satellite image
                  and start analysis to view
                  image metadata and baseline
                  vegetation results here.
                </p>

                <div className="pipeline-preview">

                  <div>
                    <span>01</span>
                    Upload
                  </div>

                  <div>
                    <span>02</span>
                    Validate
                  </div>

                  <div>
                    <span>03</span>
                    Analyze
                  </div>

                  <div>
                    <span>04</span>
                    Results
                  </div>

                </div>

              </div>

            ) : (

              <div className="result-content">

                <div className="success-banner">

                  <CheckCircle2 size={21} />

                  <div>
                    <strong>
                      Analysis completed
                    </strong>

                    <span>
                      Backend processed the
                      uploaded imagery successfully.
                    </span>
                  </div>

                </div>


                {/* =========================================
                    BASIC INFO
                ========================================= */}

                <div className="result-section">

                  <h4>
                    Image Information
                  </h4>

                  <div className="result-grid">

                    <div className="result-item">
                      <span>Source</span>
                      <strong>
                        {result.analysis?.source}
                      </strong>
                    </div>

                    <div className="result-item">
                      <span>File</span>
                      <strong>
                        {result.analysis?.filename}
                      </strong>
                    </div>

                    <div className="result-item">
                      <span>Dimensions</span>
                      <strong>
                        {
                          result.analysis
                            ?.image_metadata
                            ?.width
                        }{" "}
                        ×{" "}
                        {
                          result.analysis
                            ?.image_metadata
                            ?.height
                        }
                      </strong>
                    </div>

                    <div className="result-item">
                      <span>Channels</span>
                      <strong>
                        {
                          result.analysis
                            ?.image_metadata
                            ?.channels
                        }
                      </strong>
                    </div>

                  </div>

                </div>


                {/* =========================================
                    VEGETATION
                ========================================= */}

                <div className="vegetation-result">

                  <div>

                    <span>
                      BASELINE VEGETATION INDICATOR
                    </span>

                    <strong>
                      {
                        result.analysis
                          ?.baseline
                          ?.baseline_vegetation_indicator
                      }%
                    </strong>

                  </div>

                  <p>
                    RGB-based baseline indicator.
                    This is a preprocessing-stage
                    result and does not represent
                    trained-model accuracy.
                  </p>

                </div>


                {/* =========================================
                    GPS
                ========================================= */}

                <div className="result-section">

                  <h4>
                    Geographic Data
                  </h4>

                  <div className="gps-result">

                    <MapPin size={19} />

                    {result.analysis?.gps
                      ?.provided ? (

                      <span>
                        Latitude:{" "}
                        {
                          result.analysis.gps
                            .latitude
                        }
                        {"  •  "}
                        Longitude:{" "}
                        {
                          result.analysis.gps
                            .longitude
                        }
                      </span>

                    ) : (

                      <span>
                        No GPS coordinates
                        supplied
                      </span>

                    )}

                  </div>

                </div>


                {/* =========================================
                    PIPELINE
                ========================================= */}

                <div className="result-section">

                  <h4>
                    Processing Pipeline
                  </h4>

                  <div className="pipeline-list">

                    <div>
                      <CheckCircle2 size={17} />
                      Upload completed
                    </div>

                    <div>
                      <CheckCircle2 size={17} />
                      Image validation completed
                    </div>

                    <div>
                      <CheckCircle2 size={17} />
                      Metadata extraction completed
                    </div>

                    <div>
                      <CheckCircle2 size={17} />
                      Vegetation baseline completed
                    </div>

                    <div className="pending-pipeline">
                      <span />
                      Trained-model classification
                      pending dataset
                    </div>

                  </div>

                </div>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default SatelliteAnalysis;