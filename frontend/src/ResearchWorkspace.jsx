import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Database,
  FileText,
  FlaskConical,
  GitBranch,
  Layers3,
  Play,
  Search,
  ShieldCheck,
  Target,
  Upload,
} from "lucide-react";
import "./ResearchWorkspace.css";

const stages = [
  ["Problem", "Automated forest-loss detection", "Formulated"],
  ["Literature", "Satellite, drone & CV research", "Reviewed"],
  ["Dataset", "EuroSAT + change datasets", "In progress"],
  ["Preprocessing", "Cleaning, normalization & splits", "Ready"],
  ["Models", "Baseline + deep learning", "Planned"],
  ["Evaluation", "Accuracy, F1, IoU & matrix", "Planned"],
];

export default function ResearchWorkspace() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("Overview");
  const [experimentStarted, setExperimentStarted] = useState(false);

  function handleRunExperiment() {
    setExperimentStarted(true);
    setTab("Experiments");
  }

  return (
    <div className="research-page">
      <header className="research-top">
        <button
          className="research-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>

        <div className="research-brand">
          <div className="research-logo">
            <ShieldCheck size={21} />
          </div>

          <div>
            <b>FORESTIQ</b>
            <span>RESEARCH WORKSPACE</span>
          </div>
        </div>

        <div className="research-top-actions">
          <button onClick={() => navigate("/dashboard/reports")}>
            <FileText size={15} />
            Reports
          </button>

          <button
            className="research-primary"
            onClick={handleRunExperiment}
          >
            <Play size={14} />
            Run experiment
          </button>
        </div>
      </header>

      <main className="research-main">
        <div className="research-hero">
          <div>
            <span>RESEARCH & EXPERIMENTATION</span>

            <h1>Forest Intelligence Research Workspace</h1>

            <p>
              Organize the complete research lifecycle from problem
              formulation to validated model results.
            </p>
          </div>

          <div className="research-status">
            <i />
            Pipeline workspace active
          </div>
        </div>

        <nav className="research-tabs">
          {["Overview", "Dataset", "Experiments", "Methodology", "Results"].map(
            (t) => (
              <button
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            )
          )}
        </nav>

        {tab === "Overview" && (
          <>
            <section className="research-grid">
              <article className="research-card research-progress">
                <div className="research-card-title">
                  <div>
                    <span>RESEARCH PIPELINE</span>
                    <h2>Project progress</h2>
                  </div>

                  <strong>4 / 6</strong>
                </div>

                <div className="progress-track">
                  <i style={{ width: "67%" }} />
                </div>

                <div className="stage-list">
                  {stages.map(([name, desc, status], i) => (
                    <div className="stage" key={name}>
                      <div
                        className={`stage-icon ${
                          i < 4 ? "done" : ""
                        }`}
                      >
                        {i < 4 ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>

                      <div>
                        <b>{name}</b>
                        <small>{desc}</small>
                      </div>

                      <em className={i < 4 ? "complete" : ""}>
                        {status}
                      </em>
                    </div>
                  ))}
                </div>
              </article>

              <article className="research-card">
                <div className="research-card-title">
                  <div>
                    <span>RESEARCH DESIGN</span>
                    <h2>Study framework</h2>
                  </div>

                  <Target size={19} />
                </div>

                <div className="framework">
                  <div>
                    <b>RQ1</b>
                    <p>
                      Can satellite imagery identify forest-cover
                      classes reliably?
                    </p>
                  </div>

                  <div>
                    <b>RQ2</b>
                    <p>
                      Can temporal imagery reveal meaningful forest
                      loss?
                    </p>
                  </div>

                  <div>
                    <b>RQ3</b>
                    <p>
                      Which model provides the best validation
                      metrics?
                    </p>
                  </div>
                </div>
              </article>

              <article className="research-card">
                <div className="research-card-title">
                  <div>
                    <span>DATA ASSETS</span>
                    <h2>Dataset readiness</h2>
                  </div>

                  <Database size={19} />
                </div>

                <div className="dataset-item">
                  <Database size={16} />

                  <div>
                    <b>EuroSAT Multi-Spectral</b>
                    <small>
                      Land-cover classification · 13 bands
                    </small>
                  </div>

                  <em>Selected</em>
                </div>

                <div className="dataset-item">
                  <Layers3 size={16} />

                  <div>
                    <b>Forest change dataset</b>
                    <small>
                      Temporal disturbance / loss labels
                    </small>
                  </div>

                  <em>Pending</em>
                </div>

                <button
                  className="outline-action"
                  onClick={() => setTab("Dataset")}
                >
                  <Upload size={14} />
                  Manage datasets
                </button>
              </article>

              <article className="research-card">
                <div className="research-card-title">
                  <div>
                    <span>REPRODUCIBILITY</span>
                    <h2>Experiment controls</h2>
                  </div>

                  <GitBranch size={19} />
                </div>

                <div className="control-row">
                  <span>Dataset split</span>
                  <b>70 / 15 / 15</b>
                </div>

                <div className="control-row">
                  <span>Random seed</span>
                  <b>42</b>
                </div>

                <div className="control-row">
                  <span>Evaluation</span>
                  <b>Accuracy · F1 · IoU</b>
                </div>

                <div className="control-row">
                  <span>Versioning</span>
                  <b>Git tracked</b>
                </div>
              </article>
            </section>
          </>
        )}

        {tab === "Dataset" && (
          <section className="research-wide-card">
            <Database size={25} />

            <h2>Dataset workspace</h2>

            <p>
              EuroSAT Multi-Spectral is selected for the land-cover
              baseline. A dedicated forest-loss/change dataset is
              required for the deforestation detection experiment.
            </p>

            <div className="dataset-table">
              <div>
                <b>Dataset</b>
                <b>Purpose</b>
                <b>Status</b>
              </div>

              <div>
                <span>EuroSAT MS</span>
                <span>Forest / land-cover classification</span>
                <em>Selected</em>
              </div>

              <div>
                <span>Forest change dataset</span>
                <span>Deforestation / temporal change</span>
                <em>To add</em>
              </div>

              <div>
                <span>Ground camera set</span>
                <span>Field validation</span>
                <em>Prototype</em>
              </div>
            </div>
          </section>
        )}

        {tab === "Experiments" && (
          <section className="research-wide-card">
            <FlaskConical size={25} />

            <h2>Experiment registry</h2>

            <p>
              Track each model run with its dataset version,
              preprocessing configuration and evaluation metrics.
            </p>

            {experimentStarted && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "#edf9f1",
                  border: "1px solid #b9e5c8",
                  color: "#167a3b",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                ✓ Experiment workspace opened. Select an experiment
                below to continue the research workflow.
              </div>
            )}

            <div className="experiment-card">
              <div>
                <b>EXP-001 · Random Forest baseline</b>
                <span>
                  Feature statistics from imagery bands
                </span>
              </div>

              <em>Ready</em>
            </div>

            <div className="experiment-card">
              <div>
                <b>EXP-002 · CNN / segmentation model</b>
                <span>
                  Pixel-level forest mask and change analysis
                </span>
              </div>

              <em>Planned</em>
            </div>

            <div className="experiment-card">
              <div>
                <b>EXP-003 · Temporal change detection</b>
                <span>
                  Before/after image comparison
                </span>
              </div>

              <em>Planned</em>
            </div>
          </section>
        )}

        {tab === "Methodology" && (
          <section className="research-wide-card">
            <BookOpen size={25} />

            <h2>Methodology</h2>

            <div className="method-flow">
              {[
                "Data collection",
                "Preprocessing",
                "EDA",
                "Feature engineering",
                "Model training",
                "Validation",
                "Interpretation",
              ].map((x, i) => (
                <div key={x}>
                  <b>0{i + 1}</b>
                  <span>{x}</span>
                </div>
              ))}
            </div>

            <div className="responsible-note">
              <Search size={16} />

              <span>
                Responsible research: record dataset sources,
                preprocessing decisions, prompts/AI assistance,
                limitations and reproducible experiment settings.
              </span>
            </div>
          </section>
        )}

        {tab === "Results" && (
          <section className="research-wide-card">
            <CheckCircle2 size={25} />

            <h2>Validated results</h2>

            <p>
              Evaluation values are intentionally shown as pending
              until the trained models are actually executed on the
              selected test split.
            </p>

            <div className="pending-results">
              {[
                "Accuracy",
                "Precision",
                "Recall",
                "F1 Score",
                "IoU",
              ].map((x) => (
                <div key={x}>
                  <span>{x}</span>
                  <b>Pending</b>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}