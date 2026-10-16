import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Camera,
  CheckCircle2,
  ChevronDown,
  Cloud,
  FileText,
  Globe2,
  Leaf,
  Menu,
  Satellite,
  Settings,
  ShieldCheck,
  TreePine,
  Users,
  X,
} from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Dashboard from "./Dashboard";
import RoleDashboard from "./RoleDashboard";
import SatelliteAnalysis from "./SatelliteAnalysis";
import DroneAnalysis from "./DroneAnalysis";
import CameraAnalysis from "./CameraAnalysis";
import ChangeDetection from "./ChangeDetection";
import ForestMap from "./ForestMap";
import AIDetection from "./AIDetection";
import Alerts from "./Alerts";
import Reports from "./Reports";
import Analytics from "./Analytics";
import ResearchWorkspace from "./ResearchWorkspace";
import { Login, Register } from "./Auth";

/* =====================================================
   HOME
===================================================== */

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const scrollToSection = (id) => {
    closeMenu();

    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="nav-container">
          <a
            href="#home"
            className="brand"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            <div className="brand-icon">
              <TreePine size={25} strokeWidth={2.4} />
            </div>

            <div>
              <div className="brand-name">FORESTIQ</div>

              <div className="brand-tagline">
                FOREST INTELLIGENCE
              </div>
            </div>
          </a>

          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
            >
              Home
            </a>

            <a
              href="#monitoring"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("monitoring");
              }}
            >
              Monitoring
            </a>

            <a
              href="#technology"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("technology");
              }}
            >
              Technology
            </a>

            <a
              href="#research"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("research");
              }}
            >
              Research
            </a>

            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
            >
              About
            </a>
          </nav>

          <div className="nav-actions">
            <button className="language-btn">
              <Globe2 size={17} />
              EN
              <ChevronDown size={15} />
            </button>

            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Launch Dashboard
            </button>

            <button
              className="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main>
        {/* ================= HERO ================= */}

        <section className="hero" id="home">
          <div className="hero-background">
            <div className="hero-orb orb-one"></div>
            <div className="hero-orb orb-two"></div>
          </div>

          <div className="container hero-grid">
            <div className="hero-content">
              <div className="status-pill">
                <span className="status-dot"></span>
                AI-POWERED FOREST MONITORING
              </div>

              <h1>
                Understand forests.
                <br />
                <span>Detect change.</span>
                <br />
                Protect tomorrow.
              </h1>

              <p className="hero-description">
                FORESTIQ combines satellite imagery, drone intelligence,
                ground-camera observations and AI-driven analytics to detect
                forest cover changes and deforestation.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-btn"
                  onClick={() => navigate("/login")}
                >
                  Explore FORESTIQ
                  <ArrowRight size={19} />
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => scrollToSection("research")}
                >
                  <Leaf size={18} />
                  View Research
                </button>
              </div>

              <div className="hero-trust">
                <div className="trust-icons">
                  <div className="trust-icon green">
                    <Satellite size={18} />
                  </div>

                  <div className="trust-icon blue">
                    <Cloud size={18} />
                  </div>

                  <div className="trust-icon orange">
                    <Camera size={18} />
                  </div>
                </div>

                <div>
                  <strong>3 imagery sources</strong>

                  <span>
                    Satellite · Drone · Ground Camera
                  </span>
                </div>
              </div>
            </div>

            {/* ================= FOREST VISUAL ================= */}

            <div className="hero-visual">
              <div className="visual-card">
                <div className="visual-top">
                  <div>
                    <span className="visual-label">
                      LIVE FOREST INTELLIGENCE
                    </span>

                    <h3>Amazon Basin</h3>
                  </div>

                  <div className="live-badge">
                    <span></span>
                    LIVE
                  </div>
                </div>

                <div className="forest-map">
                  <div className="map-grid"></div>

                  <div className="map-glow glow-green"></div>
                  <div className="map-glow glow-red"></div>
                  <div className="map-glow glow-yellow"></div>

                  <div className="forest-shape shape-one"></div>
                  <div className="forest-shape shape-two"></div>
                  <div className="forest-shape shape-three"></div>

                  <div className="map-marker marker-green">
                    <span></span>
                  </div>

                  <div className="map-marker marker-red">
                    <span></span>
                  </div>

                  <div className="map-marker marker-orange">
                    <span></span>
                  </div>

                  <div className="map-label label-one">
                    Forest Zone
                  </div>

                  <div className="map-label label-two">
                    Change Detected
                  </div>
                </div>

                <div className="visual-bottom">
                  <div className="mini-stat">
                    <span className="mini-dot healthy"></span>

                    <div>
                      <small>Forest Cover</small>
                      <strong>78.4%</strong>
                    </div>
                  </div>

                  <div className="mini-stat">
                    <span className="mini-dot warning"></span>

                    <div>
                      <small>Change Detected</small>
                      <strong>12.7 ha</strong>
                    </div>
                  </div>

                  <div className="mini-stat">
                    <span className="mini-dot danger"></span>

                    <div>
                      <small>Critical Zones</small>
                      <strong>03</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="floating-card floating-ai">
                <div className="floating-icon">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <strong>AI Analysis</strong>
                  <span>Monitoring active</span>
                </div>
              </div>

              <div className="floating-card floating-data">
                <BarChart3 size={18} />

                <div>
                  <strong>Change Analysis</strong>
                  <span>Multi-source data</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-bottom">
            <div>
              <strong>10K+</strong>
              <span>Images analyzed</span>
            </div>

            <div>
              <strong>3</strong>
              <span>Data sources</span>
            </div>

            <div>
              <strong>AI</strong>
              <span>Powered detection</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Monitoring concept</span>
            </div>
          </div>
        </section>

        {/* ================= MONITORING ================= */}

        <section className="monitoring-section" id="monitoring">
          <div className="container">
            <div className="section-heading">
              <div className="section-kicker">
                MULTI-SOURCE INTELLIGENCE
              </div>

              <h2>
                One forest.
                <span>Multiple perspectives.</span>
              </h2>

              <p>
                FORESTIQ brings different forms of environmental imagery into
                one intelligent analysis workflow.
              </p>
            </div>

            <div className="source-grid">
              <div className="source-card satellite-card">
                <div className="source-number">01</div>

                <div className="source-icon">
                  <Satellite size={28} />
                </div>

                <h3>Satellite Imagery</h3>

                <p>
                  Monitor large forest regions and identify changes across
                  geographical areas using satellite-based imagery.
                </p>

                <div
                  className="source-link"
                  onClick={() => navigate("/dashboard/satellite")}
                >
                  Explore satellite analysis
                  <ArrowRight size={17} />
                </div>
              </div>

              <div className="source-card drone-card">
                <div className="source-number">02</div>

                <div className="source-icon">
                  <Cloud size={28} />
                </div>

                <h3>Drone Imagery</h3>

                <p>
                  Analyze high-resolution aerial imagery for localized forest
                  monitoring and detailed vegetation assessment.
                </p>

                <div
                  className="source-link"
                  onClick={() => navigate("/dashboard/drone")}
                >
                  Explore drone analysis
                  <ArrowRight size={17} />
                </div>
              </div>

              <div className="source-card camera-card">
                <div className="source-number">03</div>

                <div className="source-icon">
                  <Camera size={28} />
                </div>

                <h3>Ground Camera</h3>

                <p>
                  Study ground-level forest conditions through camera imagery
                  and AI-assisted environmental observations.
                </p>

                <div
                  className="source-link"
                  onClick={() => navigate("/dashboard/camera")}
                >
                  Explore camera analysis
                  <ArrowRight size={17} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TECHNOLOGY ================= */}

        <section className="technology-section" id="technology">
          <div className="container technology-grid">
            <div className="technology-content">
              <div className="section-kicker">
                FROM IMAGE TO INSIGHT
              </div>

              <h2>
                Turning forest imagery into
                <span>measurable intelligence.</span>
              </h2>

              <p>
                The FORESTIQ research pipeline connects data collection,
                preprocessing, AI-based detection, change analysis and
                visualization into one workflow.
              </p>

              <div className="process-list">
                <div className="process-item">
                  <div className="process-number">01</div>

                  <div>
                    <strong>Collect</strong>
                    <span>
                      Satellite, drone and ground-camera imagery
                    </span>
                  </div>
                </div>

                <div className="process-item">
                  <div className="process-number">02</div>

                  <div>
                    <strong>Prepare</strong>
                    <span>
                      Cleaning, preprocessing and feature extraction
                    </span>
                  </div>
                </div>

                <div className="process-item">
                  <div className="process-number">03</div>

                  <div>
                    <strong>Analyze</strong>
                    <span>
                      AI/ML-based forest and change detection
                    </span>
                  </div>
                </div>

                <div className="process-item">
                  <div className="process-number">04</div>

                  <div>
                    <strong>Interpret</strong>
                    <span>
                      Metrics, visualizations and research findings
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="technology-panel">
              <div className="panel-header">
                <span>FORESTIQ ANALYTICS</span>

                <div className="panel-status">
                  <span></span>
                  ANALYSIS READY
                </div>
              </div>

              <div className="analysis-circle">
                <div className="circle-inner">
                  <Leaf size={35} />

                  <strong>AI</strong>

                  <span>DETECTION</span>
                </div>
              </div>

              <div className="analysis-bars">
                <div>
                  <span>Forest</span>

                  <div className="bar">
                    <i style={{ width: "82%" }}></i>
                  </div>

                  <strong>82%</strong>
                </div>

                <div>
                  <span>Change</span>

                  <div className="bar">
                    <i style={{ width: "36%" }}></i>
                  </div>

                  <strong>36%</strong>
                </div>

                <div>
                  <span>Risk</span>

                  <div className="bar">
                    <i style={{ width: "21%" }}></i>
                  </div>

                  <strong>21%</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RESEARCH ================= */}

        <section className="research-section" id="research">
          <div className="container research-box">
            <div>
              <div className="section-kicker">
                RESEARCH METHODOLOGY
              </div>

              <h2>
                Built as a research project.
                <span>Designed like a real product.</span>
              </h2>

              <p>
                From research problem formulation and literature review to
                experimentation, validation and prototype development,
                FORESTIQ connects the complete research workflow.
              </p>
            </div>

            <button
              className="research-btn"
              onClick={() => navigate("/dashboard/research")}
            >
              Explore Research
              <ArrowRight size={19} />
            </button>
          </div>
        </section>

        {/* ================= FOOTER ================= */}

        <footer id="about">
          <div className="container footer-content">
            <div className="footer-brand">
              <div className="brand">
                <div className="brand-icon">
                  <TreePine size={23} />
                </div>

                <div>
                  <div className="brand-name">FORESTIQ</div>

                  <div className="brand-tagline">
                    FOREST INTELLIGENCE
                  </div>
                </div>
              </div>

              <p>
                AI-powered forest monitoring and deforestation research
                platform.
              </p>
            </div>

            <div className="footer-copy">
              <span>
                Research Methodology · 2026–2027
              </span>

              <span>
                Built for intelligent environmental monitoring 🌿
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* =====================================================
   AUTH HELPERS
===================================================== */

function getLoggedInUser() {
  const storedUser = localStorage.getItem("forestiqUser");

  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser);

    return user?.loggedIn === true ? user : null;
  } catch {
    localStorage.removeItem("forestiqUser");
    return null;
  }
}

function ProtectedRoute({ children }) {
  const user = getLoggedInUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const user = getLoggedInUser();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* =====================================================
   USER MANAGEMENT
===================================================== */

function UserManagement() {
  const navigate = useNavigate();

  const users = [
    {
      name: "Forest Admin",
      email: "admin@forestiq.com",
      role: "Super Admin",
      status: "Active",
    },
    {
      name: "Forest Officer",
      email: "officer@forestiq.com",
      role: "Forest Department Officer",
      status: "Active",
    },
    {
      name: "Research User",
      email: "research@forestiq.com",
      role: "Researcher",
      status: "Active",
    },
    {
      name: "GIS Analyst",
      email: "gis@forestiq.com",
      role: "GIS / Remote Sensing Analyst",
      status: "Active",
    },
    {
      name: "Field Officer",
      email: "field@forestiq.com",
      role: "Field Officer",
      status: "Active",
    },
    {
      name: "Public User",
      email: "viewer@forestiq.com",
      role: "Viewer / Public User",
      status: "Active",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7faf8",
        color: "#123126",
      }}
    >
      {/* ================= USER MANAGEMENT HEADER ================= */}

      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2ece6",
          padding: "18px 45px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "24px",
          minHeight: "72px",
          boxSizing: "border-box",
        }}
      >
        {/* LEFT - BACK */}

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            ...pageButtonStyle,
            justifySelf: "start",
            minWidth: "120px",
            height: "44px",
            whiteSpace: "nowrap",
            position: "relative",
            zIndex: 10,
          }}
        >
          ← Back
        </button>

        {/* CENTER - BRAND */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            justifySelf: "center",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              background: "#eaf7ef",
              display: "grid",
              placeItems: "center",
              color: "#168447",
            }}
          >
            <Users size={21} />
          </div>

          <div>
            <strong
              style={{
                fontSize: "20px",
              }}
            >
              FORESTIQ
            </strong>

            <div
              style={{
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#799085",
              }}
            >
              USER MANAGEMENT
            </div>
          </div>
        </div>

        {/* RIGHT - SETTINGS */}

        <button
          onClick={() => navigate("/dashboard/settings")}
          style={{
            ...pageButtonStyle,
            justifySelf: "end",
            height: "44px",
            whiteSpace: "nowrap",
          }}
        >
          <Settings size={16} />
          Settings
        </button>
      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 28px",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              color: "#17864a",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            ADMIN CONTROL CENTER
          </div>

          <h1
            style={{
              fontSize: "42px",
              margin: "0 0 12px",
            }}
          >
            User Management
          </h1>

          <p
            style={{
              color: "#6c7d75",
              fontSize: "16px",
            }}
          >
            Review FORESTIQ users, roles and workspace access.
          </p>
        </div>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e1ebe5",
            borderRadius: "22px",
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(20,60,40,0.06)",
          }}
        >
          {users.map((user, index) => (
            <div
              key={user.email}
              style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 1.4fr 1.6fr 100px",
                alignItems: "center",
                gap: "20px",
                padding: "22px 24px",
                borderBottom:
                  index !== users.length - 1
                    ? "1px solid #edf2ef"
                    : "none",
              }}
            >
              <div>
                <strong>{user.name}</strong>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#7c8d85",
                    marginTop: "4px",
                  }}
                >
                  {user.email}
                </div>
              </div>

              <span
                style={{
                  color: "#536960",
                  fontSize: "14px",
                }}
              >
                {user.role}
              </span>

              <span
                style={{
                  color: "#168447",
                  background: "#eaf8ef",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  width: "fit-content",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                ● {user.status}
              </span>

              <button
                onClick={() => navigate("/dashboard/settings")}
                style={{
                  border: "1px solid #dce7e1",
                  background: "#fff",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  color: "#345248",
                }}
              >
                Manage
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

/* =====================================================
   SETTINGS
===================================================== */

function SettingsPage() {
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const [notifications, setNotifications] = useState(true);

  const [liveMonitoring, setLiveMonitoring] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7faf8",
        color: "#123126",
      }}
    >
      {/* ================= SETTINGS HEADER ================= */}

      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2ece6",
          padding: "18px 45px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "24px",
          minHeight: "72px",
          boxSizing: "border-box",
        }}
      >
        {/* LEFT - BACK */}

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            ...pageButtonStyle,
            justifySelf: "start",
            minWidth: "120px",
            height: "44px",
            whiteSpace: "nowrap",
            position: "relative",
            zIndex: 10,
          }}
        >
          ← Back
        </button>

        {/* CENTER - BRAND */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            justifySelf: "center",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              background: "#f1eafd",
              display: "grid",
              placeItems: "center",
              color: "#7652c9",
            }}
          >
            <Settings size={21} />
          </div>

          <div>
            <strong style={{ fontSize: "20px" }}>
              FORESTIQ
            </strong>

            <div
              style={{
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#799085",
              }}
            >
              WORKSPACE SETTINGS
            </div>
          </div>
        </div>

        {/* RIGHT - STATUS */}

        <div
          style={{
            color: "#168447",
            fontSize: "13px",
            fontWeight: "700",
            justifySelf: "end",
            whiteSpace: "nowrap",
          }}
        >
          ● Workspace active
        </div>
      </header>

      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "60px 28px",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              color: "#7652c9",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            CONFIGURATION
          </div>

          <h1
            style={{
              fontSize: "42px",
              margin: "0 0 12px",
            }}
          >
            Settings
          </h1>

          <p
            style={{
              color: "#6c7d75",
              fontSize: "16px",
            }}
          >
            Configure your FORESTIQ workspace.
          </p>
        </div>

        <section
          style={{
            background: "#fff",
            border: "1px solid #e1ebe5",
            borderRadius: "22px",
            padding: "28px",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "25px",
            }}
          >
            <ShieldCheck size={22} color="#168447" />

            <div>
              <strong>Access Profile</strong>

              <div
                style={{
                  color: "#7a8b83",
                  fontSize: "13px",
                  marginTop: "4px",
                }}
              >
                {user?.role || "Viewer"}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "#f7faf8",
                borderRadius: "14px",
                padding: "18px",
              }}
            >
              <small>Name</small>

              <strong
                style={{
                  display: "block",
                  marginTop: "6px",
                }}
              >
                {user?.name || "FORESTIQ User"}
              </strong>
            </div>

            <div
              style={{
                background: "#f7faf8",
                borderRadius: "14px",
                padding: "18px",
              }}
            >
              <small>Email</small>

              <strong
                style={{
                  display: "block",
                  marginTop: "6px",
                }}
              >
                {user?.email || "Not available"}
              </strong>
            </div>
          </div>
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid #e1ebe5",
            borderRadius: "22px",
            padding: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 0",
              borderBottom: "1px solid #edf2ef",
            }}
          >
            <div>
              <strong>Monitoring notifications</strong>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#7a8b83",
                  fontSize: "13px",
                }}
              >
                Receive alerts and monitoring updates.
              </p>
            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              style={{
                border: "none",
                background: notifications ? "#168447" : "#cfd9d4",
                width: "54px",
                height: "30px",
                borderRadius: "999px",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  width: "22px",
                  height: "22px",
                  background: "#fff",
                  borderRadius: "50%",
                  top: "4px",
                  left: notifications ? "28px" : "4px",
                  transition: "0.2s",
                }}
              />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 0",
            }}
          >
            <div>
              <strong>Live monitoring</strong>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#7a8b83",
                  fontSize: "13px",
                }}
              >
                Keep monitoring workspace status active.
              </p>
            </div>

            <button
              onClick={() => setLiveMonitoring(!liveMonitoring)}
              style={{
                border: "none",
                background: liveMonitoring ? "#7652c9" : "#cfd9d4",
                width: "54px",
                height: "30px",
                borderRadius: "999px",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  width: "22px",
                  height: "22px",
                  background: "#fff",
                  borderRadius: "50%",
                  top: "4px",
                  left: liveMonitoring ? "28px" : "4px",
                  transition: "0.2s",
                }}
              />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =====================================================
   SMALL SHARED BUTTON STYLE
===================================================== */

const pageButtonStyle = {
  border: "1px solid #dce7e1",
  background: "#fff",
  borderRadius: "12px",
  padding: "10px 18px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  cursor: "pointer",
  color: "#345248",
  fontWeight: "600",
  fontSize: "15px",
  minWidth: "112px",
  boxShadow: "0 6px 18px rgba(20, 60, 40, 0.06)",
};

/* =====================================================
   APPLICATION ROUTES
===================================================== */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}

        <Route path="/" element={<Home />} />

        {/* AUTHENTICATION */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* =================================================
            ROLE DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleDashboard />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN SYSTEM OVERVIEW
        ================================================= */}

        <Route
          path="/dashboard/system"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN USER MANAGEMENT
        ================================================= */}

        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            SETTINGS
        ================================================= */}

        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ANALYSIS MODULES
        ================================================= */}

        <Route
          path="/dashboard/satellite"
          element={
            <ProtectedRoute>
              <SatelliteAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/drone"
          element={
            <ProtectedRoute>
              <DroneAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/camera"
          element={
            <ProtectedRoute>
              <CameraAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/change-detection"
          element={
            <ProtectedRoute>
              <ChangeDetection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/forest-map"
          element={
            <ProtectedRoute>
              <ForestMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/ai-detection"
          element={
            <ProtectedRoute>
              <AIDetection />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ALERTS
        ================================================= */}

        <Route
          path="/dashboard/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            REPORTS
        ================================================= */}

        <Route
          path="/dashboard/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ANALYTICS
        ================================================= */}

        <Route
          path="/dashboard/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            RESEARCH
        ================================================= */}

        <Route
          path="/dashboard/research"
          element={
            <ProtectedRoute>
              <ResearchWorkspace />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;