import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Leaf,
  MapPinned,
  Satellite,
  ShieldCheck,
  Trees,
  TrendingDown,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Reports.css";

const reportHistory = [
  {
    id: 1,
    title: "Southern Forest Zone — Change Analysis",
    type: "Change Detection Report",
    date: "16 Sep 2026",
    status: "Ready",
    area: "14.2 ha",
  },
  {
    id: 2,
    title: "Central Forest Zone — Monitoring Summary",
    type: "Forest Monitoring Report",
    date: "15 Sep 2026",
    status: "Ready",
    area: "31.4 ha",
  },
  {
    id: 3,
    title: "ForestIQ Monthly Research Summary",
    type: "Research Analytics Report",
    date: "01 Sep 2026",
    status: "Ready",
    area: "106.8 ha",
  },
];

function Reports() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("Change Detection");
  const [generated, setGenerated] = useState(false);

  const generateReport = () => {
    setGenerated(false);
    setTimeout(() => setGenerated(true), 900);
  };

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div className="reports-brand" onClick={() => navigate("/")}>
          <div className="reports-brand-icon">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <div>
            <strong>FORESTIQ</strong>
            <span>FOREST INTELLIGENCE</span>
          </div>
        </div>

        <div className="reports-header-right">
          <div className="reports-status">
            <span />
            MONITORING SYSTEM ONLINE
          </div>
          <button
            className="reports-dashboard-button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="reports-main">
        <div className="reports-topbar">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="reports-label">
            <FileText size={16} />
            RESEARCH REPORT CENTER
          </div>
        </div>

        <section className="reports-hero">
          <div>
            <div className="eyebrow">
              <span />
              DOCUMENTATION &amp; RESEARCH OUTPUT
            </div>
            <h1>
              Forest <span>Reports.</span>
            </h1>
            <p>
              Turn monitoring observations, change analysis, and research
              metrics into structured reports for review and documentation.
            </p>
          </div>

          <div className="hero-document">
            <div className="paper-icon">
              <FileText size={27} />
            </div>
            <div>
              <span>REPORT ENGINE</span>
              <strong>READY</strong>
              <small>Structured analysis output</small>
            </div>
          </div>
        </section>

        <section className="report-builder">
          <div className="builder-heading">
            <div>
              <span className="section-kicker">CREATE REPORT</span>
              <h2>Generate a Monitoring Report</h2>
            </div>
            <div className="builder-step">01 / 03</div>
          </div>

          <div className="report-options">
            <button
              className={selectedType === "Change Detection" ? "selected" : ""}
              onClick={() => setSelectedType("Change Detection")}
            >
              <div className="option-icon orange">
                <TrendingDown size={21} />
              </div>
              <div>
                <strong>Change Detection</strong>
                <span>Before / after forest-cover comparison</span>
              </div>
              {selectedType === "Change Detection" && (
                <CheckCircle2 className="option-check" size={19} />
              )}
            </button>

            <button
              className={selectedType === "Forest Monitoring" ? "selected" : ""}
              onClick={() => setSelectedType("Forest Monitoring")}
            >
              <div className="option-icon green">
                <Trees size={21} />
              </div>
              <div>
                <strong>Forest Monitoring</strong>
                <span>Coverage, zones, imagery and observations</span>
              </div>
              {selectedType === "Forest Monitoring" && (
                <CheckCircle2 className="option-check" size={19} />
              )}
            </button>

            <button
              className={selectedType === "Research Analytics" ? "selected" : ""}
              onClick={() => setSelectedType("Research Analytics")}
            >
              <div className="option-icon blue">
                <BarChart3 size={21} />
              </div>
              <div>
                <strong>Research Analytics</strong>
                <span>Experiments, metrics and analytical summary</span>
              </div>
              {selectedType === "Research Analytics" && (
                <CheckCircle2 className="option-check" size={19} />
              )}
            </button>
          </div>

          <div className="builder-footer">
            <div className="selected-report">
              <span>SELECTED REPORT</span>
              <strong>{selectedType}</strong>
            </div>
            <button className="generate-button" onClick={generateReport}>
              <FileText size={17} />
              Generate Report
            </button>
          </div>

          {generated && (
            <div className="generated-message">
              <CheckCircle2 size={18} />
              <div>
                <strong>Report structure generated successfully.</strong>
                <span>
                  The prototype is ready to connect with validated analysis
                  outputs and downloadable report generation.
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="report-preview-grid">
          <div className="preview-card">
            <div className="preview-top">
              <div className="preview-title">
                <div className="preview-logo">
                  <Leaf size={18} />
                </div>
                <div>
                  <span>FORESTIQ ANALYSIS REPORT</span>
                  <strong>{selectedType}</strong>
                </div>
              </div>
              <span className="preview-status">DRAFT</span>
            </div>

            <div className="preview-line wide" />
            <div className="preview-meta">
              <div>
                <span>REPORT DATE</span>
                <strong>16 Sep 2026</strong>
              </div>
              <div>
                <span>MONITORING AREA</span>
                <strong>106.8 ha</strong>
              </div>
              <div>
                <span>DATA SOURCES</span>
                <strong>3 imagery types</strong>
              </div>
            </div>

            <div className="preview-section">
              <div className="mini-heading">
                <Trees size={15} />
                Forest Monitoring Summary
              </div>
              <div className="mini-bars">
                <span style={{ width: "82%" }} />
                <span style={{ width: "67%" }} />
                <span style={{ width: "48%" }} />
              </div>
            </div>

            <div className="preview-stats">
              <div>
                <strong>76.8%</strong>
                <span>Forest Coverage</span>
              </div>
              <div>
                <strong>14.8 ha</strong>
                <span>Change Detected</span>
              </div>
              <div>
                <strong>18</strong>
                <span>Monitored Zones</span>
              </div>
            </div>

            <div className="preview-footer">
              <span>FORESTIQ • RESEARCH PROTOTYPE</span>
              <span>Page 01</span>
            </div>
          </div>

          <div className="report-includes">
            <span className="section-kicker">REPORT CONTENT</span>
            <h2>What the report contains</h2>

            <div className="include-item">
              <div><Satellite size={17} /></div>
              <span>Imagery source and acquisition information</span>
            </div>
            <div className="include-item">
              <div><Trees size={17} /></div>
              <span>Forest-cover and monitored-area statistics</span>
            </div>
            <div className="include-item">
              <div><TrendingDown size={17} /></div>
              <span>Change detection and hotspot observations</span>
            </div>
            <div className="include-item">
              <div><MapPinned size={17} /></div>
              <span>Geographic / GPS information where available</span>
            </div>
            <div className="include-item">
              <div><BarChart3 size={17} /></div>
              <span>Analytics, evaluation metrics and visualizations</span>
            </div>
            <div className="include-item">
              <div><ShieldCheck size={17} /></div>
              <span>Methodology, validation and research notes</span>
            </div>
          </div>
        </section>

        <section className="history-section">
          <div className="history-heading">
            <div>
              <span className="section-kicker">REPORT HISTORY</span>
              <h2>Recent Reports</h2>
            </div>
            <button className="history-filter">
              <CalendarDays size={15} />
              Latest
            </button>
          </div>

          <div className="history-list">
            {reportHistory.map((report) => (
              <div className="history-row" key={report.id}>
                <div className="history-file">
                  <FileText size={19} />
                </div>
                <div className="history-name">
                  <strong>{report.title}</strong>
                  <span>{report.type}</span>
                </div>
                <div className="history-area">
                  <span>AREA</span>
                  <strong>{report.area}</strong>
                </div>
                <div className="history-date">
                  <span>DATE</span>
                  <strong>{report.date}</strong>
                </div>
                <span className="ready-badge">
                  <CheckCircle2 size={13} />
                  {report.status}
                </span>
                <button className="download-button" title="Prototype download action">
                  <Download size={17} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="data-flow">
          <div className="flow-icon">
            <Upload size={21} />
          </div>
          <div>
            <strong>From imagery to research-ready documentation</strong>
            <p>
              Imagery → preprocessing → detection → validation → analytics →
              report generation.
            </p>
          </div>
          <button onClick={() => navigate("/dashboard/analytics")}>
            View Analytics
          </button>
        </section>

        <section className="methodology-note">
          <ShieldCheck size={20} />
          <div>
            <span>RESEARCH PROTOTYPE NOTE</span>
            <p>
              Report values and history shown in this interface are
              demonstration values. Final reports will be populated from the
              project's collected dataset, preprocessing pipeline, trained
              models, validated experiments, geographic information, and
              reproducible analysis outputs.
            </p>
          </div>
        </section>
      </main>

      <footer className="reports-footer">
        <div>
          <strong>FORESTIQ</strong>
          <span>Automated Forest Monitoring &amp; Change Analysis</span>
        </div>
        <span>Research Prototype • 2026–2027</span>
      </footer>
    </div>
  );
}

export default Reports;
