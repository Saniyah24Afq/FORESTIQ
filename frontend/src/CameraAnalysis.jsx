import { useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Leaf,
  Loader2,
  MapPinned,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./CameraAnalysis.css";

function CameraAnalysis() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const selectFile = (selected) => {
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setDone(false);
  };

  const analyze = () => {
    if (!file) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1800);
  };

  const removeFile = () => {
    setFile(null);
    setPreview("");
    setDone(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="camera-page">
      <header className="camera-header">
        <div className="camera-left">
          <button
            className="camera-back"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={19} />
          </button>

          <div className="camera-brand">
            <div>
              <Camera size={22} />
            </div>

            <section>
              <strong>FORESTIQ</strong>
              <span>Ground Camera Analysis</span>
            </section>
          </div>
        </div>

        <div className="camera-online">
          <span></span>
          Ground Monitoring Online
        </div>
      </header>

      <main className="camera-main">
        <div className="camera-intro">
          <div>
            <div className="camera-kicker">
              <Camera size={15} />
              GROUND-LEVEL FOREST INTELLIGENCE
            </div>

            <h1>See the forest up close.</h1>

            <p>
              Analyze ground-camera imagery to study vegetation conditions,
              forest health indicators and environmental changes at local
              level.
            </p>
          </div>

          <div className="camera-status">
            <ShieldCheck size={18} />

            <div>
              <strong>Observation Engine</strong>
              <small>Ready for image analysis</small>
            </div>
          </div>
        </div>

        <section className="camera-workspace">
          <div className="camera-panel">
            <div className="camera-title">
              <div>
                <span>STEP 01</span>
                <h2>Upload ground image</h2>
              </div>

              <ImageIcon size={21} />
            </div>

            {!file ? (
              <div
                className="camera-upload"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  selectFile(e.dataTransfer.files[0]);
                }}
              >
                <div className="camera-upload-icon">
                  <Upload size={28} />
                </div>

                <h3>Drop ground-camera image here</h3>

                <p>or click to browse from your computer</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Choose Image
                </button>

                <small>JPG · JPEG · PNG</small>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => selectFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="camera-selected">
                <div className="camera-preview">
                  <img src={preview} alt="Ground camera image" />

                  <button onClick={removeFile}>
                    <X size={18} />
                  </button>
                </div>

                <div className="camera-file">
                  <div>
                    <strong>{file.name}</strong>
                    <span>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  <CheckCircle2 size={20} />
                </div>
              </div>
            )}

            <div className="camera-info">
              <span>
                <ShieldCheck size={16} />
                Secure image preview
              </span>

              <span>
                <MapPinned size={16} />
                Local observation
              </span>
            </div>
          </div>

          <div className="camera-panel">
            <div className="camera-title">
              <div>
                <span>STEP 02</span>
                <h2>AI observation</h2>
              </div>

              <Leaf size={21} />
            </div>

            {!file && (
              <div className="camera-empty">
                <div className="camera-empty-icon">
                  <Camera size={30} />
                </div>

                <h3>Waiting for ground imagery</h3>

                <p>
                  Upload a forest image to begin AI-assisted environmental
                  observation.
                </p>

                <div className="camera-tags">
                  <span>Vegetation</span>
                  <span>Forest condition</span>
                  <span>Change indicators</span>
                </div>
              </div>
            )}

            {file && !done && (
              <div className="camera-empty">
                <div className="camera-empty-icon">
                  {loading ? (
                    <Loader2 className="camera-spin" size={30} />
                  ) : (
                    <Leaf size={30} />
                  )}
                </div>

                <h3>
                  {loading
                    ? "Analyzing ground imagery..."
                    : "Image ready for AI"}
                </h3>

                <p>
                  {loading
                    ? "FORESTIQ is examining visible vegetation and forest conditions."
                    : "Start the AI observation pipeline."}
                </p>

                {!loading && (
                  <button className="camera-analyze" onClick={analyze}>
                    <Leaf size={18} />
                    Analyze with AI
                  </button>
                )}

                {loading && (
                  <div className="camera-progress">
                    <div></div>
                  </div>
                )}
              </div>
            )}

            {done && (
              <div className="camera-result">
                <div className="camera-success">
                  <CheckCircle2 size={19} />
                  Ground observation completed
                </div>

                <div className="camera-metrics">
                  <div>
                    <span>Vegetation</span>
                    <strong>74.2%</strong>
                  </div>

                  <div>
                    <span>Forest Condition</span>
                    <strong>Healthy</strong>
                  </div>

                  <div>
                    <span>Change Signal</span>
                    <strong>Moderate</strong>
                  </div>
                </div>

                <div className="camera-result-image">
                  <img src={preview} alt="AI observation result" />

                  <div>
                    <span>VEGETATION DETECTED</span>
                    <b>OBSERVATION REGION</b>
                  </div>
                </div>

                <div className="camera-note">
                  <ShieldCheck size={16} />

                  <p>
                    Prototype result. Final observations will be generated
                    from the trained ML model after backend integration.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="camera-pipeline">
          <div>
            <div className="camera-kicker">GROUND OBSERVATION WORKFLOW</div>
            <h2>Camera image to environmental insight</h2>
          </div>

          <div className="camera-pipeline-grid">
            <div>
              <b>01</b>
              <Camera size={21} />
              <strong>Ground Input</strong>
              <small>Capture image</small>
            </div>

            <i></i>

            <div>
              <b>02</b>
              <ImageIcon size={21} />
              <strong>Preprocessing</strong>
              <small>Prepare data</small>
            </div>

            <i></i>

            <div>
              <b>03</b>
              <Leaf size={21} />
              <strong>AI Observation</strong>
              <small>Detect features</small>
            </div>

            <i></i>

            <div>
              <b>04</b>
              <MapPinned size={21} />
              <strong>Environmental Insight</strong>
              <small>Interpret results</small>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CameraAnalysis;