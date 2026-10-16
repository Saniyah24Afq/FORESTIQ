import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Leaf,
  MapPinned,
  Satellite,
  ShieldCheck,
  TrendingDown,
  Trees,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Alerts.css";

const alertsData = [
  {
    id: 1,
    severity: "critical",
    title: "Potential Deforestation Detected",
    zone: "Southern Forest Zone",
    location: "23.1842° N, 72.6418° E",
    area: "14.2 ha",
    change: "-11.6%",
    source: "Satellite Imagery",
    time: "18 min ago",
    description:
      "A substantial vegetation-cover change was detected in the monitored southern zone.",
  },
  {
    id: 2,
    severity: "significant",
    title: "Significant Forest Change",
    zone: "Central Forest Zone",
    location: "23.2674° N, 72.5821° E",
    area: "31.4 ha",
    change: "-8.2%",
    source: "Drone Imagery",
    time: "42 min ago",
    description:
      "Recent imagery indicates a notable reduction in observed forest cover.",
  },
  {
    id: 3,
    severity: "moderate",
    title: "Moderate Vegetation Change",
    zone: "Eastern Forest Zone",
    location: "23.2418° N, 72.7146° E",
    area: "18.6 ha",
    change: "-5.8%",
    source: "Satellite Imagery",
    time: "1 hr ago",
    description:
      "Moderate change detected. Continued monitoring is recommended.",
  },
  {
    id: 4,
    severity: "stable",
    title: "Forest Zone Stable",
    zone: "Northern Forest Zone",
    location: "23.3186° N, 72.6014° E",
    area: "42.8 ha",
    change: "-2.4%",
    source: "Ground Camera",
    time: "2 hrs ago",
    description:
      "Observed vegetation conditions remain within the current monitoring baseline.",
  },
];

const severityConfig = {
  critical: {
    label: "CRITICAL",
    icon: XCircle,
  },
  significant: {
    label: "SIGNIFICANT",
    icon: AlertTriangle,
  },
  moderate: {
    label: "MODERATE",
    icon: AlertTriangle,
  },
  stable: {
    label: "STABLE",
    icon: CheckCircle2,
  },
};

function Alerts() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts =
    filter === "all"
      ? alertsData
      : alertsData.filter((alert) => alert.severity === filter);

  return (
    <div className="alerts-page">
      <header className="alerts-header">
        <div className="alerts-brand" onClick={() => navigate("/")}>
          <div className="alerts-brand-icon">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <div>
            <strong>FORESTIQ</strong>
            <span>FOREST INTELLIGENCE</span>
          </div>
        </div>

        <div className="alerts-header-right">
          <div className="alerts-status">
            <span className="status-dot" />
            MONITORING SYSTEM ONLINE
          </div>

          <button className="alerts-icon-button active" aria-label="Alerts">
            <Bell size={19} />
            <span className="notification-dot" />
          </button>

          <button
            className="alerts-home-button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="alerts-main">
        <div className="alerts-topbar">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="alerts-top-label">
            <Bell size={16} />
            LIVE FOREST ALERTS
          </div>
        </div>

        <section className="alerts-hero">
          <div>
            <div className="eyebrow">
              <span />
              ENVIRONMENTAL MONITORING
            </div>

            <h1>
              Forest <span>Alerts.</span>
            </h1>

            <p>
              Monitor detected forest-cover changes and review important zones
              requiring attention.
            </p>
          </div>

          <div className="alert-summary-card">
            <div className="summary-icon">
              <TrendingDown size={23} />
            </div>
            <div>
              <span>ACTIVE CHANGES</span>
              <strong>03</strong>
              <small>requiring monitoring</small>
            </div>
          </div>
        </section>

        <section className="alert-kpis">
          <div className="alert-kpi critical-kpi">
            <div className="kpi-icon">
              <XCircle size={20} />
            </div>
            <div>
              <span>Critical</span>
              <strong>01</strong>
              <small>Immediate review</small>
            </div>
          </div>

          <div className="alert-kpi significant-kpi">
            <div className="kpi-icon">
              <AlertTriangle size={20} />
            </div>
            <div>
              <span>Significant</span>
              <strong>01</strong>
              <small>Monitor closely</small>
            </div>
          </div>

          <div className="alert-kpi moderate-kpi">
            <div className="kpi-icon">
              <Clock3 size={20} />
            </div>
            <div>
              <span>Moderate</span>
              <strong>01</strong>
              <small>Continue monitoring</small>
            </div>
          </div>

          <div className="alert-kpi stable-kpi">
            <div className="kpi-icon">
              <Leaf size={20} />
            </div>
            <div>
              <span>Stable</span>
              <strong>01</strong>
              <small>Within baseline</small>
            </div>
          </div>
        </section>

        <section className="alerts-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">DETECTION FEED</span>
              <h2>Recent Monitoring Alerts</h2>
            </div>

            <div className="filter-wrap">
              <ChevronDown size={16} />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="all">All Alerts</option>
                <option value="critical">Critical</option>
                <option value="significant">Significant</option>
                <option value="moderate">Moderate</option>
                <option value="stable">Stable</option>
              </select>
            </div>
          </div>

          <div className="alert-list">
            {filteredAlerts.map((alert) => {
              const config = severityConfig[alert.severity];
              const SeverityIcon = config.icon;

              return (
                <article
                  className={`alert-row ${alert.severity}`}
                  key={alert.id}
                >
                  <div className="severity-icon">
                    <SeverityIcon size={21} />
                  </div>

                  <div className="alert-content">
                    <div className="alert-title-line">
                      <h3>{alert.title}</h3>
                      <span className={`severity-badge ${alert.severity}`}>
                        {config.label}
                      </span>
                    </div>

                    <div className="alert-meta">
                      <span>
                        <Trees size={14} />
                        {alert.zone}
                      </span>
                      <span>
                        <MapPinned size={14} />
                        {alert.location}
                      </span>
                      <span>
                        <Clock3 size={14} />
                        {alert.time}
                      </span>
                    </div>

                    <p>{alert.description}</p>

                    <div className="alert-details">
                      <div>
                        <span>MONITORED AREA</span>
                        <strong>{alert.area}</strong>
                      </div>
                      <div>
                        <span>FOREST CHANGE</span>
                        <strong>{alert.change}</strong>
                      </div>
                      <div>
                        <span>IMAGERY SOURCE</span>
                        <strong>{alert.source}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    className="view-alert-button"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    View Details
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="monitoring-strip">
          <div className="strip-icon">
            <Satellite size={23} />
          </div>
          <div>
            <strong>Continuous Forest Monitoring</strong>
            <p>
              Alerts can be connected to satellite, drone, and ground-camera
              analysis as the research pipeline is integrated.
            </p>
          </div>
          <button onClick={() => navigate("/dashboard/forest-map")}>
            <MapPinned size={16} />
            View Forest Map
          </button>
        </section>

        <section className="alert-methodology">
          <div className="method-icon">
            <ShieldCheck size={21} />
          </div>
          <div>
            <span>RESEARCH PROTOTYPE NOTE</span>
            <p>
              The alert locations, areas, percentages, and timestamps shown
              here are demonstration values for the prototype interface.
              Final alerts will be generated from validated imagery,
              preprocessing, trained models, change-detection analysis, and
              geographic coordinates.
            </p>
          </div>
        </section>
      </main>

      <footer className="alerts-footer">
        <div>
          <strong>FORESTIQ</strong>
          <span>Automated Forest Monitoring &amp; Change Analysis</span>
        </div>
        <span>Research Prototype • 2026–2027</span>
      </footer>

      {selectedAlert && (
        <div
          className="alert-modal-backdrop"
          onClick={() => setSelectedAlert(null)}
        >
          <div
            className="alert-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedAlert(null)}
              aria-label="Close"
            >
              <XCircle size={20} />
            </button>

            <div className={`modal-severity ${selectedAlert.severity}`}>
              {(() => {
                const Icon = severityConfig[selectedAlert.severity].icon;
                return <Icon size={21} />;
              })()}
              {severityConfig[selectedAlert.severity].label} ALERT
            </div>

            <h2>{selectedAlert.title}</h2>
            <p>{selectedAlert.description}</p>

            <div className="modal-grid">
              <div>
                <span>ZONE</span>
                <strong>{selectedAlert.zone}</strong>
              </div>
              <div>
                <span>GPS LOCATION</span>
                <strong>{selectedAlert.location}</strong>
              </div>
              <div>
                <span>AREA</span>
                <strong>{selectedAlert.area}</strong>
              </div>
              <div>
                <span>CHANGE</span>
                <strong>{selectedAlert.change}</strong>
              </div>
              <div>
                <span>SOURCE</span>
                <strong>{selectedAlert.source}</strong>
              </div>
              <div>
                <span>DETECTED</span>
                <strong>{selectedAlert.time}</strong>
              </div>
            </div>

            <button
              className="modal-map-button"
              onClick={() => {
                setSelectedAlert(null);
                navigate("/dashboard/forest-map");
              }}
            >
              <MapPinned size={17} />
              Open Forest Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;
