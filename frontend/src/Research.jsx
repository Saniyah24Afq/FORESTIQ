import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Database,
  FileText,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Leaf,
  LineChart,
  Microscope,
  Search,
  ShieldCheck,
  Target,
  Trees,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Research.css";

const sections = [
  {
    id: "problem",
    number: "01",
    title: "Problem Statement",
    icon: Target,
    text:
      "Deforestation monitoring requires timely identification of forest-cover loss across large and geographically distributed areas. Manual inspection of imagery can be time-consuming, while changes may be difficult to detect consistently across different image sources.",
  },
  {
    id: "literature",
    number: "02",
    title: "Literature Review",
    icon: BookOpen,
    text:
      "The research reviews existing approaches for satellite-based forest monitoring, image classification, semantic segmentation, remote-sensing change detection, and computer-vision-assisted environmental analysis.",
  },
  {
    id: "gap",
    number: "03",
    title: "Research Gap",
    icon: Search,
    text:
      "A key research direction is integrating multiple imagery sources and combining forest-cover detection with temporal or before-after change analysis in a practical monitoring workflow.",
  },
  {
    id: "objectives",
    number: "04",
    title: "Objectives",
    icon: Target,
    text:
      "Develop a reproducible prototype for forest detection and change analysis, evaluate suitable models using research metrics, visualize geographic changes, and generate structured monitoring outputs.",
  },
  {
    id: "methodology",
    number: "05",
    title: "Methodology",
    icon: FlaskConical,
    text:
      "The proposed pipeline follows data collection, preprocessing, exploratory analysis, feature preparation, model training, validation, performance evaluation, change detection, visualization, and report generation.",
  },
  {
    id: "dataset",
    number: "06",
    title: "Dataset",
    icon: Database,
    text:
      "The project is designed to work with satellite imagery, drone imagery, and ground-camera images. Dataset metadata will record source, location, acquisition information, labels, and preprocessing status.",
  },
  {
    id: "experiments",
    number: "07",
    title: "Experiments",
    icon: Microscope,
    text:
      "Experiments will compare selected machine-learning or deep-learning approaches under a documented train-validation-test design, with consistent preprocessing and evaluation criteria.",
  },
  {
    id: "evaluation",
    number: "08",
    title: "Evaluation",
    icon: LineChart,
    text:
      "Model performance will be assessed using appropriate metrics such as accuracy, precision, recall, F1-score, IoU, and confusion matrices. Final values will come from the validated experiments.",
  },
  {
    id: "reproducibility",
    number: "09",
    title: "Reproducibility",
    icon: GitBranch,
    text:
      "Code, dataset documentation, preprocessing steps, experiment configurations, model details, evaluation outputs, and version-control history will be documented to support repeatable research.",
  },
];

const researchQuestions = [
  "How accurately can forest cover be detected from available imagery?",
  "How can before-after imagery be used to identify meaningful forest-cover change?",
  "How do different imagery sources affect detection and monitoring?",
  "Which evaluation metrics provide reliable evidence for the proposed approach?",
];

function Research() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("problem");
  const [openQuestion, setOpenQuestion] = useState(null);

  const active = sections.find((section) => section.id === activeSection);

  return (
    <div className="research-page">
      <header className="research-header">
        <div className="research-brand" onClick={() => navigate("/")}>
          <div className="research-brand-icon">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <div>
            <strong>FORESTIQ</strong>
            <span>FOREST INTELLIGENCE</span>
          </div>
        </div>

        <div className="research-header-right">
          <div className="research-status">
            <span />
            RESEARCH WORKSPACE
          </div>
          <button
            className="research-dashboard-button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="research-main">
        <div className="research-topbar">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="research-label">
            <GraduationCap size={16} />
            RESEARCH METHODOLOGY
          </div>
        </div>

        <section className="research-hero">
          <div>
            <div className="eyebrow">
              <span />
              RESEARCH • EXPERIMENTS • VALIDATION
            </div>
            <h1>
              Research <span>Hub.</span>
            </h1>
            <p>
              A structured research workspace connecting the problem statement,
              literature, methodology, dataset, experiments, and validated
              findings behind FORESTIQ.
            </p>
          </div>

          <div className="research-hero-card">
            <div className="hero-card-icon">
              <Leaf size={25} />
            </div>
            <div>
              <span>PROJECT STATUS</span>
              <strong>RESEARCH PIPELINE</strong>
              <small>Documentation framework ready</small>
            </div>
          </div>
        </section>

        <section className="research-overview">
          <div className="overview-card green">
            <BookOpen size={20} />
            <strong>Literature</strong>
            <span>Review &amp; gap</span>
          </div>
          <div className="overview-card blue">
            <Database size={20} />
            <strong>Dataset</strong>
            <span>3 imagery sources</span>
          </div>
          <div className="overview-card orange">
            <FlaskConical size={20} />
            <strong>Experiments</strong>
            <span>Model comparison</span>
          </div>
          <div className="overview-card purple">
            <LineChart size={20} />
            <strong>Evaluation</strong>
            <span>Metrics &amp; validation</span>
          </div>
        </section>

        <section className="research-workspace">
          <aside className="research-sidebar">
            <div className="sidebar-title">
              <span>RESEARCH STRUCTURE</span>
              <strong>Project Framework</strong>
            </div>

            <div className="research-nav">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    className={activeSection === section.id ? "active" : ""}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <span className="nav-number">{section.number}</span>
                    <Icon size={16} />
                    <span>{section.title}</span>
                    {activeSection === section.id && (
                      <CheckCircle2 size={14} />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="research-content">
            <div className="content-heading">
              <div className="content-icon">
                <active.icon size={24} />
              </div>
              <div>
                <span>SECTION {active.number}</span>
                <h2>{active.title}</h2>
              </div>
            </div>

            <p className="active-description">{active.text}</p>

            {active.id === "problem" && (
              <div className="content-grid">
                <div className="info-box">
                  <Target size={18} />
                  <span>CORE CHALLENGE</span>
                  <strong>Large-area forest monitoring</strong>
                  <p>
                    Identify changes consistently while handling imagery from
                    different observation platforms.
                  </p>
                </div>
                <div className="info-box">
                  <Trees size={18} />
                  <span>APPLICATION CONTEXT</span>
                  <strong>Environmental monitoring</strong>
                  <p>
                    Support monitoring teams with structured visual evidence
                    and geographic change information.
                  </p>
                </div>
              </div>
            )}

            {active.id === "literature" && (
              <div className="literature-grid">
                <div className="literature-item">
                  <BookOpen size={18} />
                  <div>
                    <strong>Remote Sensing</strong>
                    <span>Satellite imagery for forest observation</span>
                  </div>
                </div>
                <div className="literature-item">
                  <BookOpen size={18} />
                  <div>
                    <strong>Computer Vision</strong>
                    <span>Image classification and segmentation</span>
                  </div>
                </div>
                <div className="literature-item">
                  <BookOpen size={18} />
                  <div>
                    <strong>Change Detection</strong>
                    <span>Before-after and temporal comparison</span>
                  </div>
                </div>
                <div className="literature-item">
                  <BookOpen size={18} />
                  <div>
                    <strong>Environmental Analytics</strong>
                    <span>Forest-cover statistics and monitoring</span>
                  </div>
                </div>
              </div>
            )}

            {active.id === "gap" && (
              <div className="gap-box">
                <div className="gap-badge">RESEARCH OPPORTUNITY</div>
                <h3>Multi-source monitoring workflow</h3>
                <p>
                  The prototype brings satellite, drone, and ground-camera
                  observations into one research-oriented workflow instead of
                  treating each source as an isolated analysis task.
                </p>
                <div className="gap-flow">
                  <span>Satellite</span>
                  <b>+</b>
                  <span>Drone</span>
                  <b>+</b>
                  <span>Ground Camera</span>
                  <b>→</b>
                  <span>Forest Change Analysis</span>
                </div>
              </div>
            )}

            {active.id === "objectives" && (
              <div className="objective-list">
                {[
                  "Collect and organize suitable forest imagery.",
                  "Build a documented preprocessing and analysis pipeline.",
                  "Develop forest-cover and change-detection components.",
                  "Compare and validate selected models using research metrics.",
                  "Present results through maps, analytics, alerts, and reports.",
                ].map((item, index) => (
                  <div key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                    <CheckCircle2 size={17} />
                  </div>
                ))}
              </div>
            )}

            {active.id === "methodology" && (
              <div className="method-flow">
                {[
                  ["01", "Data Collection"],
                  ["02", "Preprocessing"],
                  ["03", "EDA"],
                  ["04", "Feature Preparation"],
                  ["05", "Model Training"],
                  ["06", "Validation"],
                  ["07", "Change Detection"],
                  ["08", "Visualization"],
                  ["09", "Reporting"],
                ].map(([num, label], index) => (
                  <div className="method-step" key={label}>
                    <span>{num}</span>
                    <strong>{label}</strong>
                    {index < 8 && <b>→</b>}
                  </div>
                ))}
              </div>
            )}

            {active.id === "dataset" && (
              <div className="dataset-grid">
                <div className="dataset-card satellite">
                  <SatelliteIcon />
                  <strong>Satellite Imagery</strong>
                  <span>Large-area observation &amp; temporal analysis</span>
                </div>
                <div className="dataset-card drone">
                  <Trees size={21} />
                  <strong>Drone Imagery</strong>
                  <span>High-resolution local monitoring</span>
                </div>
                <div className="dataset-card camera">
                  <Leaf size={21} />
                  <strong>Ground Camera</strong>
                  <span>On-ground visual observations</span>
                </div>
              </div>
            )}

            {active.id === "experiments" && (
              <div className="experiment-table">
                <div className="table-head">
                  <span>EXPERIMENT</span>
                  <span>INPUT</span>
                  <span>OUTPUT</span>
                  <span>STATUS</span>
                </div>
                {[
                  ["E01", "Forest imagery", "Forest mask", "Planned"],
                  ["E02", "Before / after", "Change map", "Planned"],
                  ["E03", "Model comparison", "Metrics", "Planned"],
                  ["E04", "Multi-source", "Analysis summary", "Planned"],
                ].map((row) => (
                  <div className="table-row" key={row[0]}>
                    <strong>{row[0]}</strong>
                    <span>{row[1]}</span>
                    <span>{row[2]}</span>
                    <em>{row[3]}</em>
                  </div>
                ))}
              </div>
            )}

            {active.id === "evaluation" && (
              <div className="metric-grid">
                {[
                  ["Accuracy", "Overall classification correctness"],
                  ["Precision", "Correct positive detections"],
                  ["Recall", "Detected relevant positive cases"],
                  ["F1-score", "Balance of precision and recall"],
                  ["IoU", "Overlap quality for segmentation"],
                  ["Confusion Matrix", "Class-wise error analysis"],
                ].map(([name, description]) => (
                  <div className="metric-card" key={name}>
                    <LineChart size={17} />
                    <strong>{name}</strong>
                    <span>{description}</span>
                  </div>
                ))}
              </div>
            )}

            {active.id === "reproducibility" && (
              <div className="repro-grid">
                {[
                  ["Version Control", "GitHub repository and tracked changes"],
                  ["Environment", "Dependencies and setup instructions"],
                  ["Data Documentation", "Sources, labels and metadata"],
                  ["Experiments", "Configurations and evaluation records"],
                  ["Results", "Metrics, plots and interpretation"],
                  ["Technical Docs", "Methodology and implementation notes"],
                ].map(([name, description]) => (
                  <div className="repro-card" key={name}>
                    <GitBranch size={17} />
                    <div>
                      <strong>{name}</strong>
                      <span>{description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="questions-section">
          <div className="questions-heading">
            <div>
              <span className="section-kicker">RESEARCH QUESTIONS</span>
              <h2>What this study investigates</h2>
            </div>
            <FileText size={21} />
          </div>

          <div className="questions-list">
            {researchQuestions.map((question, index) => (
              <button
                className={`question-row ${
                  openQuestion === index ? "open" : ""
                }`}
                key={question}
                onClick={() =>
                  setOpenQuestion(openQuestion === index ? null : index)
                }
              >
                <span>RQ{index + 1}</span>
                <strong>{question}</strong>
                <ChevronDown size={17} />
                {openQuestion === index && (
                  <p>
                    This question will be answered using the project's
                    documented dataset, experiments, validation results, and
                    analysis outputs.
                  </p>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="research-deliverables">
          <div className="deliverable-icon">
            <GraduationCap size={23} />
          </div>
          <div>
            <strong>Research Deliverables</strong>
            <p>
              Literature review • research gap • methodology • dataset
              documentation • experiments • evaluation • technical report •
              presentation
            </p>
          </div>
          <button onClick={() => navigate("/dashboard/reports")}>
            <FileText size={16} />
            Open Reports
          </button>
        </section>

        <section className="research-note">
          <ShieldCheck size={20} />
          <div>
            <span>IMPORTANT RESEARCH NOTE</span>
            <p>
              This page defines the research framework and prototype structure.
              It does not claim experimental accuracy or validated findings.
              Final conclusions will be based on collected data, documented
              experiments, statistical/model evaluation, and reproducible
              results.
            </p>
          </div>
        </section>
      </main>

      <footer className="research-footer">
        <div>
          <strong>FORESTIQ</strong>
          <span>Automated Forest Monitoring &amp; Change Analysis</span>
        </div>
        <span>Research Prototype • 2026–2027</span>
      </footer>
    </div>
  );
}

function SatelliteIcon() {
  return <span className="satellite-icon"><Satellite size={21} /></span>;
}

export default Research;
