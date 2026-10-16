import { useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Cloud,
  Image as ImageIcon,
  Leaf,
  Loader2,
  MapPinned,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./DroneAnalysis.css";

function DroneAnalysis() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setComplete(false);
  };

  const analyze = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setComplete(true);
    }, 1800);
  };

  const remove = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setComplete(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="drone-page">
      <header className="drone-header">
        <div className="drone-header-left">
          <button
            className="drone-back"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={19} />
          </button>

          <div className="drone-brand">
            <div className="drone-brand-icon">
              <Cloud size={22} />
            </div>

            <div>
              <strong>FORESTIQ</strong>
              <span>Drone Analysis</span>
            </div>
          </div>
        </div>

        <div className="drone-online">
          <span></span>
          Drone Intelligence Online
        </div>
      </header>

      <main className="drone-main">
        <div className="drone-intro">
          <div>
            <div className="drone-kicker">
              <Cloud size={15} />
              AERIAL FOREST INTELLIGENCE
            </div>

            <h1>Inspect forests from above.</h1>

            <p>
              Upload high-resolution drone imagery for localized vegetation
              monitoring, forest assessment and potential change detection.
            </p>
          </div>

          <div className="drone-ready">
            <ShieldCheck size={18} />
            <div>
              <strong>AI Pipeline</strong>
              <small>Ready for aerial imagery</small>
            </div>
          </div>
        </div>

        <section className="drone-workspace">
          <div className="drone-panel">
            <div className="drone-panel-title">
              <div>
                <span>STEP 01</span>
                <h2>Upload drone imagery</h2>
              </div>

              <Camera size={21} />
            </div>

            {!selectedFile ? (
              <div
                className="drone-upload"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files[0]);
                }}
              >
                <div className="drone-upload-icon">
                  <Upload size={28} />
                </div>

                <h3>Drop aerial imagery here</h3>

                <p>or browse high-resolution drone images</p>

                <button
                  className="drone-browse"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose Image
                </button>

                <small>JPG · JPEG · PNG · High-resolution recommended</small>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="drone-selected">
                <div className="drone-preview">
                  <img src={previewUrl} alt="Selected drone imagery" />

                  <button onClick={remove}>
                    <X size={18} />
                  </button>
                </div>

                <div className="drone-file">
                  <div>
                    <strong>{selectedFile.name}</strong>
                    <span>
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  <CheckCircle2 size={20} />
                </div>
              </div>
            )}

            <div className="drone-info">
              <span>
                <ShieldCheck size={16} />
                Secure local preview
              </span>

              <span>
                <MapPinned size={16} />
                Localized monitoring
              </span>
            </div>
          </div>

          <div className="drone-panel">
            <div className="drone-panel-title">
              <div>
                <span>STEP 02</span>
                <h2>AI aerial analysis</h2>
              </div>

              <Leaf size={21} />
            </div>

            {!selectedFile && (
              <div className="drone-empty">
                <div className="drone-empty-icon">
                  <Cloud size={30} />
                </div>

                <h3>Waiting for drone imagery</h3>

                <p>
                  Upload an aerial image to activate the AI analysis
                  workspace.
                </p>

                <div className="drone-analysis-list">
                  <span>01 Forest segmentation</span>
                  <span>02 Vegetation assessment</span>
                  <span>03 Change detection</span>
                </div>
              </div>
            )}

            {selectedFile && !complete && (
              <div className="drone-empty">
                <div className="drone-empty-icon">
                  {isAnalyzing ? (
                    <Loader2 className="drone-spin" size={30} />
                  ) : (
                    <Leaf size={30} />
                  )}
                </div>

                <h3>
                  {isAnalyzing
                    ? "Analyzing aerial imagery..."
                    : "Drone image ready"}
                </h3>

                <p>
                  {isAnalyzing
                    ? "FORESTIQ is processing vegetation and forest regions."
                    : "Start the AI pipeline to inspect the selected drone image."}
                </p>

                {!isAnalyzing && (
                  <button className="drone-analyze" onClick={analyze}>
                    <Leaf size={18} />
                    Analyze with AI
                  </button>
                )}

                {isAnalyzing && (
                  <div className="drone-progress">
                    <div></div>
                  </div>
                )}
              </div>
            )}

            {complete && (
              <div className="drone-result">
                <div className="drone-success">
                  <CheckCircle2 size={19} />
                  Aerial analysis completed
                </div>

                <div className="drone-metrics">
                  <div>
                    <span>Vegetation Cover</span>
                    <strong>81.6%</strong>
                  </div>

                  <div>
                    <span>Change Detected</span>
                    <strong>8.3 ha</strong>
                  </div>

                  <div>
                    <span>Risk Level</span>
                    <strong>Moderate</strong>
                  </div>
                </div>

                <div className="drone-result-image">
                  <img src={previewUrl} alt="Drone analysis result" />

                  <div>
                    <span>VEGETATION REGION</span>
                    <b>CHANGE DETECTED</b>
                  </div>
                </div>

                <div className="drone-note">
                  <ShieldCheck size={16} />

                  <p>
                    Prototype result. Final values will come from the trained
                    ML model after backend integration.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="drone-pipeline">
          <div>
            <span className="drone-kicker">DRONE WORKFLOW</span>
            <h2>Aerial imagery to environmental insight</h2>
          </div>

          <div className="drone-pipeline-grid">
            <div>
              <b>01</b>
              <Cloud size={21} />
              <strong>Drone Input</strong>
              <small>Capture imagery</small>
            </div>

            <div className="drone-line"></div>

            <div>
              <b>02</b>
              <ImageIcon size={21} />
              <strong>Preprocessing</strong>
              <small>Clean imagery</small>
            </div>

            <div className="drone-line"></div>

            <div>
              <b>03</b>
              <Leaf size={21} />
              <strong>AI Detection</strong>
              <small>Analyze vegetation</small>
            </div>

            <div className="drone-line"></div>

            <div>
              <b>04</b>
              <MapPinned size={21} />
              <strong>Change Map</strong>
              <small>Interpret results</small>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DroneAnalysis;