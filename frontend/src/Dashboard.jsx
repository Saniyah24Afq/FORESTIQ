import {
  Activity,
  AlertTriangle,
  LineChart,
  BarChart3,
  Camera,
  ChevronRight,
  Cloud,
  Download,
  Filter,
  Globe2,
  Leaf,
  LocateFixed,
  Map,
  Search,
  Satellite,
  TreePine,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./Dashboard.css";

const ROLES = {
  admin: { label: "Super Admin", icon: "👑" },
  "forest-officer": { label: "Forest Department Officer", icon: "🌲" },
  researcher: { label: "Researcher", icon: "🔬" },
  "gis-analyst": { label: "GIS / Remote Sensing Analyst", icon: "🛰️" },
  "field-officer": { label: "Field Officer", icon: "📷" },
  viewer: { label: "Viewer / Public User", icon: "👤" },
};

function getStoredUser() {
  try {
    const stored = localStorage.getItem("forestiqUser");

    if (!stored) return null;

    const user = JSON.parse(stored);

    if (!user || user.loggedIn !== true) return null;

    return user;
  } catch {
    return null;
  }
}

function getRoleDetails(user) {
  if (!user) {
    return {
      label: "User",
      icon: "👤",
    };
  }

  if (user.roleName) {
    return {
      label: user.roleName,
      icon: user.roleIcon || ROLES[user.role]?.icon || "👤",
    };
  }

  return ROLES[user.role] || {
    label: "User",
    icon: "👤",
  };
}

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(getStoredUser);

  const [filterOpen, setFilterOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");
  const [selectedYear, setSelectedYear] = useState("2026");

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [gpsLocation, setGpsLocation] = useState(null);

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    setCurrentUser(user);
  }, [navigate, location.pathname]);

  const role = getRoleDetails(currentUser);
  const displayName = currentUser?.name || role.label;

  const getCurrentLocation = () => {
    setGpsError("");

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by this browser.");
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);

        if (error.code === 1) {
          setGpsError(
            "Location permission denied. Please allow location access in your browser."
          );
        } else if (error.code === 2) {
          setGpsError("Unable to determine your location.");
        } else {
          setGpsError("Location request timed out. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const formatCoordinate = (value) => {
    if (typeof value !== "number") return "--";
    return value.toFixed(5);
  };

  const handleLogout = () => {
    localStorage.removeItem("forestiqUser");
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  const handleExportReport = () => {
    const report = [
      "FORESTIQ DASHBOARD EXPORT",
      "=========================",
      `User: ${displayName}`,
      `Role: ${role.label}`,
      `Period: ${selectedPeriod}`,
      `Year: ${selectedYear}`,
      "",
      "Dashboard snapshot",
      "Forest coverage: 78.4%",
      "Deforested area: 12.7 ha",
      "Regions requiring attention: 36%",
      "Images analyzed: 10,248",
      "",
      "Note: Dashboard KPI values are prototype display values until live ML results are connected.",
    ].join("\n");

    const blob = new Blob([report], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `forestiq-dashboard-${selectedYear}.txt`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="dashboard-page">
      {/* ================= SIDEBAR ================= */}
      <aside className="dashboard-sidebar">
        <div
          className="dashboard-brand"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="dashboard-brand-icon">
            <TreePine size={22} />
          </div>

          <div>
            <div className="dashboard-brand-name">FORESTIQ</div>

            <div className="dashboard-brand-subtitle">
              FOREST INTELLIGENCE
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">OVERVIEW</span>

          <button
            className="sidebar-item active"
            onClick={() => navigate("/dashboard")}
          >
            <BarChart3 size={18} />
            Dashboard
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard/forest-map")}
          >
            <Map size={18} />
            Forest Map
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard/change-detection")}
          >
            <Activity size={18} />
            Change Detection
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">ANALYSIS</span>

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard/satellite")}
          >
            <Satellite size={18} />
            Satellite
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard/drone")}
          >
            <Cloud size={18} />
            Drone
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard/camera")}
          >
            <Camera size={18} />
            Ground Camera
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">INSIGHTS</span>

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard/ai-detection")}
          >
            <Leaf size={18} />
            AI Detection
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard/alerts")}
          >
            <AlertTriangle size={18} />
            Alerts
            <span className="alert-count">3</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard/reports")}
          >
            <Download size={18} />
            Reports
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard/analytics")}
          >
            <LineChart size={18} />
            Analytics
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard/research")}
          >
            <TreePine size={18} />
            Research
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="monitoring-status">
            <span className="monitoring-dot"></span>

            <div>
              <strong>Monitoring active</strong>
              <span>System operational</span>
            </div>
          </div>

          <button
            className="back-home"
            onClick={() => navigate("/")}
          >
            <ChevronRight size={15} />
            Back to website
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">

        {/* ================= DASHBOARD BACK BUTTON ================= */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: "18px",
          }}
        >
          <button
            type="button"
            onClick={handleBack}
            title="Go back"
            aria-label="Go back"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #dce7df",
              background: "#ffffff",
              color: "#315847",
              borderRadius: "11px",
              padding: "9px 15px",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 5px 16px rgba(20, 60, 40, 0.06)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "#f4faf5";
              event.currentTarget.style.borderColor = "#c9ddd0";
              event.currentTarget.style.transform = "translateX(-2px)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "#ffffff";
              event.currentTarget.style.borderColor = "#dce7df";
              event.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>←</span>
            <span>Back</span>
          </button>
        </div>

        {/* ================= TOPBAR ================= */}
        <header className="dashboard-topbar">
          <div>
            <div className="dashboard-kicker">
              FOREST MONITORING
            </div>

            <h1>
              Good morning, {displayName} <span>{role.icon}</span>
            </h1>

            <p>
              Here's the latest intelligence from your forest monitoring
              workspace.
            </p>
          </div>

          <div className="topbar-actions">
            <button
              className="date-btn"
              onClick={() => navigate("/dashboard/forest-map")}
              title="Open global forest map"
            >
              <Globe2 size={16} />
              Global View
            </button>

            <div style={{ position: "relative" }}>
              <button
                className="notification-btn"
                onClick={() =>
                  setNotificationOpen((value) => !value)
                }
                title="Open notifications"
                aria-label="Open notifications"
              >
                <AlertTriangle size={17} />
                <span></span>
              </button>

              {notificationOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "52px",
                    width: "300px",
                    background: "#fff",
                    border: "1px solid #dce7df",
                    borderRadius: "16px",
                    padding: "14px",
                    boxShadow:
                      "0 18px 45px rgba(20, 60, 40, 0.14)",
                    zIndex: 100,
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
                        color: "#173b28",
                        fontSize: "13px",
                      }}
                    >
                      Notifications
                    </strong>

                    <span
                      style={{
                        color: "#c24b3f",
                        fontSize: "10px",
                        fontWeight: 800,
                      }}
                    >
                      3 active
                    </span>
                  </div>

                  {[
                    [
                      "Critical",
                      "Forest-cover change detected",
                      "High priority",
                    ],
                    [
                      "Warning",
                      "New satellite imagery available",
                      "Monitoring",
                    ],
                    [
                      "Info",
                      "Ground validation queue updated",
                      "Today",
                    ],
                  ].map(([level, message, meta]) => (
                    <button
                      key={message}
                      onClick={() => {
                        setNotificationOpen(false);
                        navigate("/dashboard/alerts");
                      }}
                      style={{
                        width: "100%",
                        border: "0",
                        borderTop: "1px solid #edf1ee",
                        background: "#fff",
                        padding: "11px 3px",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "9px",
                          fontWeight: 800,
                          color:
                            level === "Critical"
                              ? "#c94b42"
                              : level === "Warning"
                              ? "#c68121"
                              : "#4f7b67",
                          marginBottom: "4px",
                        }}
                      >
                        {level}
                      </span>

                      <span
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#304b3d",
                        }}
                      >
                        {message}
                      </span>

                      <span
                        style={{
                          display: "block",
                          fontSize: "9px",
                          color: "#8a9891",
                          marginTop: "3px",
                        }}
                      >
                        {meta}
                      </span>
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setNotificationOpen(false);
                      navigate("/dashboard/alerts");
                    }}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      height: "34px",
                      border: "1px solid #cfe0d4",
                      borderRadius: "9px",
                      background: "#f5faf6",
                      color: "#237442",
                      fontSize: "10px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    View all alerts
                  </button>
                </div>
              )}
            </div>

            <div style={{ position: "relative" }}>
              <button
                className="profile-avatar"
                onClick={() =>
                  setProfileOpen((value) => !value)
                }
                title="Open profile"
              >
                {(displayName?.charAt(0) || "U").toUpperCase()}
              </button>

              {profileOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "54px",
                    width: "260px",
                    background: "#ffffff",
                    border: "1px solid #dce7df",
                    borderRadius: "16px",
                    padding: "16px",
                    boxShadow:
                      "0 18px 45px rgba(20, 60, 40, 0.14)",
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "12px",
                        background: "#e8f5eb",
                        color: "#19733d",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "18px",
                      }}
                    >
                      {role.icon}
                    </div>

                    <div>
                      <strong
                        style={{
                          display: "block",
                          color: "#123b25",
                        }}
                      >
                        {displayName}
                      </strong>

                      <span
                        style={{
                          display: "block",
                          fontSize: "11px",
                          color: "#19733d",
                          fontWeight: 700,
                          marginTop: "2px",
                        }}
                      >
                        {role.label}
                      </span>

                      <span
                        style={{
                          display: "block",
                          fontSize: "10px",
                          color: "#7b8c83",
                          marginTop: "2px",
                        }}
                      >
                        {currentUser?.email ||
                          "FORESTIQ Workspace"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/dashboard/research");
                    }}
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px",
                      background: "#f2f7f3",
                      color: "#195d35",
                      cursor: "pointer",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    Open Research Workspace
                  </button>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      border: "1px solid #f0d8d4",
                      borderRadius: "10px",
                      padding: "10px",
                      background: "#fff7f5",
                      color: "#b43c30",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= TOOLBAR ================= */}
        <div className="dashboard-toolbar">
          <div className="toolbar-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search forest regions..."
              aria-label="Search forest regions"
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;

                const query = event.target.value
                  .trim()
                  .toLowerCase();

                if (query.includes("satellite")) {
                  navigate("/dashboard/satellite");
                } else if (query.includes("drone")) {
                  navigate("/dashboard/drone");
                } else if (
                  query.includes("camera") ||
                  query.includes("ground")
                ) {
                  navigate("/dashboard/camera");
                } else if (
                  query.includes("map") ||
                  query.includes("forest")
                ) {
                  navigate("/dashboard/forest-map");
                } else if (
                  query.includes("alert") ||
                  query.includes("risk")
                ) {
                  navigate("/dashboard/alerts");
                } else if (query.includes("report")) {
                  navigate("/dashboard/reports");
                } else if (
                  query.includes("analytic") ||
                  query.includes("trend")
                ) {
                  navigate("/dashboard/analytics");
                } else if (
                  query.includes("research") ||
                  query.includes("experiment") ||
                  query.includes("dataset")
                ) {
                  navigate("/dashboard/research");
                }
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <button
              className="filter-btn"
              onClick={() =>
                setFilterOpen((value) => !value)
              }
            >
              <Filter size={16} />
              {selectedPeriod}
            </button>

            {filterOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "48px",
                  left: 0,
                  width: "170px",
                  background: "#fff",
                  border: "1px solid #dce7df",
                  borderRadius: "12px",
                  padding: "6px",
                  boxShadow:
                    "0 15px 35px rgba(20,60,40,.12)",
                  zIndex: 50,
                }}
              >
                {[
                  "Last 7 days",
                  "Last 30 days",
                  "Last 90 days",
                  "This year",
                ].map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setFilterOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background:
                        selectedPeriod === period
                          ? "#edf7ef"
                          : "transparent",
                      padding: "9px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      color: "#234936",
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="export-btn"
            onClick={handleExportReport}
            title="Download a dashboard snapshot"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>

        {/* ================= KPI CARDS ================= */}
        <section className="kpi-grid">
          <div className="kpi-card forest">
            <div className="kpi-top">
              <div className="kpi-icon">
                <TreePine size={20} />
              </div>

              <span className="kpi-change positive">
                <TrendingUp size={13} />
                2.4%
              </span>
            </div>

            <span className="kpi-label">
              FOREST COVERAGE
            </span>

            <strong className="kpi-value">78.4%</strong>

            <p>Across monitored regions</p>
          </div>

          <div className="kpi-card danger">
            <div className="kpi-top">
              <div className="kpi-icon">
                <TrendingDown size={20} />
              </div>

              <span className="kpi-change negative">
                <TrendingDown size={13} />
                1.8%
              </span>
            </div>

            <span className="kpi-label">
              DEFORESTED AREA
            </span>

            <strong className="kpi-value">
              12.7 ha
            </strong>

            <p>Change detected this period</p>
          </div>

          <div className="kpi-card warning">
            <div className="kpi-top">
              <div className="kpi-icon">
                <Activity size={20} />
              </div>

              <span className="kpi-change warning-text">
                Monitoring
              </span>
            </div>

            <span className="kpi-label">
              CHANGE DETECTION
            </span>

            <strong className="kpi-value">
              36%
            </strong>

            <p>Regions requiring attention</p>
          </div>

          <div className="kpi-card blue">
            <div className="kpi-top">
              <div className="kpi-icon">
                <Satellite size={20} />
              </div>

              <span className="kpi-change positive">
                Active
              </span>
            </div>

            <span className="kpi-label">
              IMAGES ANALYZED
            </span>

            <strong className="kpi-value">
              10,248
            </strong>

            <p>From 3 imagery sources</p>
          </div>
        </section>

        {/* ================= ANALYTICS ================= */}
        <section className="analytics-grid">
          <div className="analytics-card trend-card">
            <div className="card-heading">
              <div>
                <span className="card-kicker">
                  FOREST COVER
                </span>

                <h2>Forest coverage trend</h2>
              </div>

              <div style={{ position: "relative" }}>
                <button
                  className="small-select"
                  onClick={() =>
                    setYearOpen((value) => !value)
                  }
                >
                  {selectedYear}
                  <ChevronRight size={14} />
                </button>

                {yearOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "44px",
                      background: "#fff",
                      border: "1px solid #dce7df",
                      borderRadius: "10px",
                      padding: "5px",
                      width: "90px",
                      boxShadow:
                        "0 15px 35px rgba(20,60,40,.12)",
                      zIndex: 40,
                    }}
                  >
                    {["2026", "2025", "2024"].map(
                      (year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setSelectedYear(year);
                            setYearOpen(false);
                          }}
                          style={{
                            width: "100%",
                            border: "none",
                            background:
                              selectedYear === year
                                ? "#edf7ef"
                                : "transparent",
                            padding: "8px",
                            borderRadius: "7px",
                            cursor: "pointer",
                          }}
                        >
                          {year}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="trend-summary">
              <div>
                <strong>78.4%</strong>
                <span>Current coverage</span>
              </div>

              <div className="trend-indicator">
                <TrendingUp size={15} />
                +2.4%
              </div>
            </div>

            <div className="chart-area">
              <div className="chart-y">
                <span>90%</span>
                <span>80%</span>
                <span>70%</span>
                <span>60%</span>
                <span>50%</span>
              </div>

              <div className="chart">
                <div className="chart-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <svg
                  className="trend-line"
                  viewBox="0 0 620 210"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="forestGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#42a85e"
                        stopOpacity="0.28"
                      />

                      <stop
                        offset="100%"
                        stopColor="#42a85e"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0,145 C45,138 65,150 100,130 C135,110 155,120 190,103 C225,87 240,112 275,92 C310,72 325,82 360,70 C395,57 415,75 445,58 C480,42 500,53 530,39 C560,28 590,36 620,21 L620,210 L0,210 Z"
                    fill="url(#forestGradient)"
                  />

                  <path
                    d="M0,145 C45,138 65,150 100,130 C135,110 155,120 190,103 C225,87 240,112 275,92 C310,72 325,82 360,70 C395,57 415,75 445,58 C480,42 500,53 530,39 C560,28 590,36 620,21"
                    fill="none"
                    stroke="#27884a"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="620"
                    cy="21"
                    r="6"
                    fill="#27884a"
                  />
                </svg>

                <div className="chart-x">
                  <span>JAN</span>
                  <span>MAR</span>
                  <span>MAY</span>
                  <span>JUL</span>
                  <span>SEP</span>
                  <span>NOW</span>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-card source-analysis-card">
            <div className="card-heading">
              <div>
                <span className="card-kicker">
                  DATA SOURCES
                </span>

                <h2>Imagery distribution</h2>
              </div>

              <button
                className="dots-btn"
                onClick={() =>
                  setMoreOpen((value) => !value)
                }
              >
                •••
              </button>

              {moreOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: "25px",
                    marginTop: "100px",
                    background: "#fff",
                    border: "1px solid #dce7df",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    boxShadow:
                      "0 12px 30px rgba(20,60,40,.12)",
                    zIndex: 30,
                    fontSize: "12px",
                    color: "#567066",
                  }}
                >
                  Imagery source overview
                </div>
              )}
            </div>

            <div className="source-donut">
              <div className="donut">
                <div className="donut-center">
                  <strong>10.2K</strong>
                  <span>Images</span>
                </div>
              </div>
            </div>

            <div className="source-legend">
              <div>
                <span className="legend-color satellite"></span>

                <div>
                  <strong>Satellite</strong>
                  <small>5,830 images</small>
                </div>

                <b>57%</b>
              </div>

              <div>
                <span className="legend-color drone"></span>

                <div>
                  <strong>Drone</strong>
                  <small>2,970 images</small>
                </div>

                <b>29%</b>
              </div>

              <div>
                <span className="legend-color camera"></span>

                <div>
                  <strong>Ground Camera</strong>
                  <small>1,448 images</small>
                </div>

                <b>14%</b>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MAP + ALERTS ================= */}
        <section className="bottom-grid">
          <div className="analytics-card map-card">
            <div className="card-heading">
              <div>
                <span className="card-kicker">
                  GEOGRAPHIC MONITORING
                </span>

                <h2>Forest change map</h2>
              </div>

              <button
                className="map-view-btn"
                onClick={() =>
                  navigate("/dashboard/forest-map")
                }
              >
                Full map
                <ChevronRight size={14} />
              </button>
            </div>

            <div
              className="dashboard-map real-leaflet-map"
              style={{
                height: "360px",
                width: "100%",
                minHeight: "360px",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <MapContainer
                center={[19.20587, 72.9833]}
                zoom={11}
                scrollWheelZoom={true}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <CircleMarker
                  center={[19.20587, 72.9833]}
                  radius={11}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 4,
                    fillColor: "#1677ff",
                    fillOpacity: 1,
                  }}
                >
                  <Popup>
                    <strong>
                      FORESTIQ Monitoring Point
                    </strong>
                    <br />
                    Latitude: 19.20587
                    <br />
                    Longitude: 72.98330
                  </Popup>
                </CircleMarker>

                <CircleMarker
                  center={[19.2245, 72.972]}
                  radius={10}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 3,
                    fillColor: "#2e9b57",
                    fillOpacity: 0.95,
                  }}
                >
                  <Popup>
                    <strong>Healthy Zone</strong>
                    <br />
                    North Monitoring Zone
                    <br />
                    Forest coverage: 84.2%
                  </Popup>
                </CircleMarker>

                <CircleMarker
                  center={[19.1865, 72.991]}
                  radius={10}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 3,
                    fillColor: "#ef476f",
                    fillOpacity: 0.95,
                  }}
                >
                  <Popup>
                    <strong>Critical Zone</strong>
                    <br />
                    South Monitoring Zone
                    <br />
                    Forest coverage: 61.4%
                  </Popup>
                </CircleMarker>

                <CircleMarker
                  center={[19.214, 73.008]}
                  radius={10}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 3,
                    fillColor: "#f59e0b",
                    fillOpacity: 0.95,
                  }}
                >
                  <Popup>
                    <strong>Moderate Change</strong>
                    <br />
                    East Forest Zone
                    <br />
                    Forest coverage: 76.8%
                  </Popup>
                </CircleMarker>

                {gpsLocation && (
                  <CircleMarker
                    center={[
                      gpsLocation.latitude,
                      gpsLocation.longitude,
                    ]}
                    radius={9}
                    pathOptions={{
                      color: "#ffffff",
                      weight: 4,
                      fillColor: "#1677ff",
                      fillOpacity: 1,
                    }}
                  >
                    <Popup>
                      <strong>Your GPS location</strong>
                      <br />
                      Lat:{" "}
                      {formatCoordinate(
                        gpsLocation.latitude
                      )}
                      <br />
                      Lng:{" "}
                      {formatCoordinate(
                        gpsLocation.longitude
                      )}
                      <br />
                      Accuracy: ±
                      {Math.round(
                        gpsLocation.accuracy
                      )}
                      m
                    </Popup>
                  </CircleMarker>
                )}
              </MapContainer>

              <div
                style={{
                  position: "absolute",
                  left: "14px",
                  bottom: "14px",
                  zIndex: 1000,
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  background: "rgba(255,255,255,.96)",
                  border: "1px solid #dce7df",
                  borderRadius: "11px",
                  padding: "9px 11px",
                  boxShadow:
                    "0 8px 24px rgba(20,60,40,.12)",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#486457",
                }}
              >
                <span>🟢 Healthy</span>
                <span>🟠 Moderate</span>
                <span>🔴 Critical</span>
                <span>🔵 GPS</span>
              </div>
            </div>

            <div
              style={{
                marginTop: "14px",
                padding: "13px 15px",
                borderRadius: "13px",
                background: "#f4faf5",
                border: "1px solid #dcecdf",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "#e2f2e6",
                    color: "#21824a",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <LocateFixed size={18} />
                </div>

                <div>
                  <strong
                    style={{
                      display: "block",
                      color: "#174d2d",
                      fontSize: "13px",
                    }}
                  >
                    Geographic location
                  </strong>

                  {gpsLocation ? (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#708279",
                      }}
                    >
                      Lat{" "}
                      {formatCoordinate(
                        gpsLocation.latitude
                      )}
                      {" · "}
                      Lng{" "}
                      {formatCoordinate(
                        gpsLocation.longitude
                      )}
                      {" · "}±
                      {Math.round(
                        gpsLocation.accuracy
                      )}
                      m
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#708279",
                      }}
                    >
                      No GPS coordinates captured yet
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={getCurrentLocation}
                disabled={gpsLoading}
                style={{
                  border: "none",
                  borderRadius: "9px",
                  padding: "9px 13px",
                  background: gpsLoading
                    ? "#a9cbb4"
                    : "#176c39",
                  color: "#fff",
                  cursor: gpsLoading
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: 700,
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <LocateFixed size={14} />

                {gpsLoading
                  ? "Locating..."
                  : gpsLocation
                  ? "Refresh GPS"
                  : "Use my location"}
              </button>
            </div>

            {gpsError && (
              <div
                style={{
                  marginTop: "9px",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  background: "#fff2f0",
                  color: "#c23b2d",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <X size={14} />
                {gpsError}
              </div>
            )}

            <div className="map-legend">
              <span>
                <i className="healthy-color"></i>
                Healthy forest
              </span>

              <span>
                <i className="moderate-color"></i>
                Moderate change
              </span>

              <span>
                <i className="critical-color"></i>
                Critical zone
              </span>
            </div>
          </div>

          <div className="analytics-card alerts-card">
            <div className="card-heading">
              <div>
                <span className="card-kicker">
                  ATTENTION REQUIRED
                </span>

                <h2>Recent alerts</h2>
              </div>

              <span className="alerts-number">03</span>
            </div>

            <div className="alert-list">
              <div
                className="alert-item critical-alert"
                onClick={() =>
                  navigate("/dashboard/alerts")
                }
                style={{ cursor: "pointer" }}
              >
                <div className="alert-icon">
                  <AlertTriangle size={17} />
                </div>

                <div>
                  <strong>
                    Critical forest change
                  </strong>

                  <span>
                    Amazon Basin · 12.7 ha
                  </span>

                  <small>
                    18 minutes ago
                  </small>
                </div>

                <ChevronRight size={16} />
              </div>

              <div
                className="alert-item warning-alert"
                onClick={() =>
                  navigate("/dashboard/alerts")
                }
                style={{ cursor: "pointer" }}
              >
                <div className="alert-icon">
                  <TrendingDown size={17} />
                </div>

                <div>
                  <strong>
                    Vegetation decline
                  </strong>

                  <span>
                    Region B · Moderate risk
                  </span>

                  <small>
                    2 hours ago
                  </small>
                </div>

                <ChevronRight size={16} />
              </div>

              <div
                className="alert-item info-alert"
                onClick={() =>
                  navigate("/dashboard/satellite")
                }
                style={{ cursor: "pointer" }}
              >
                <div className="alert-icon">
                  <Satellite size={17} />
                </div>

                <div>
                  <strong>
                    New imagery available
                  </strong>

                  <span>
                    Satellite source · 248 images
                  </span>

                  <small>
                    5 hours ago
                  </small>
                </div>

                <ChevronRight size={16} />
              </div>
            </div>

            <button
              className="view-alerts-btn"
              onClick={() =>
                navigate("/dashboard/alerts")
              }
            >
              View all alerts
              <ArrowRightIcon />
            </button>
          </div>
        </section>

        <footer className="dashboard-footer">
          <span>
            FORESTIQ · AI-Powered Forest Intelligence
          </span>

          <span>
            Research Methodology · 2026–2027
          </span>
        </footer>
      </main>
    </div>
  );
}

function ArrowRightIcon() {
  return <ChevronRight size={16} />;
}

export default Dashboard;