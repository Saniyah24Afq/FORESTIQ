import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Camera,
  CheckCircle2,
  Database,
  FileText,
  FlaskConical,
  Globe2,
  Leaf,
  Map,
  MapPinned,
  Radar,
  Satellite,
  Settings,
  ShieldCheck,
  TreePine,
  Upload,
  Users,
} from "lucide-react";
import "./RoleDashboard.css";

const ROLE_CONFIG = {
  admin: {
    icon: "👑",
    label: "Super Admin",
    accent: "admin",
    description:
      "Manage the complete FORESTIQ platform, access control, data workflows and system operations.",
    eyebrow: "ADMIN CONTROL CENTER",
    heroTitle: "Your command center for FORESTIQ.",
    heroText:
      "Oversee users, research data, monitoring modules and platform operations from one workspace.",
    primary: ["Open System Dashboard", "/dashboard/system"],
    secondary: ["Manage Reports", "/dashboard/reports"],
    stats: [
      ["Active modules", "12", "Platform coverage"],
      ["User roles", "06", "Access profiles"],
      ["Data workflows", "04", "Connected sources"],
      ["System status", "Ready", "All core services"],
    ],
    cards: [
      [
        "System Overview",
        "Open the complete operational dashboard and platform KPIs.",
        "/dashboard/system",
        BarChart3,
      ],
      [
        "User Management",
        "Review registered users, roles and workspace access.",
        "/dashboard/users",
        Users,
      ],
      [
        "Research & Data",
        "Monitor datasets, methodology and experiment workflows.",
        "/dashboard/research",
        Database,
      ],
      [
        "Reports",
        "Review generated monitoring and research documentation.",
        "/dashboard/reports",
        FileText,
      ],
    ],
    spotlight: {
      icon: ShieldCheck,
      label: "PLATFORM CONTROL",
      title: "One workspace, six access profiles",
      text: "FORESTIQ separates the working experience by role while keeping the monitoring platform connected.",
    },
  },

  "super-admin": {
    icon: "👑",
    label: "Super Admin",
    accent: "admin",
    description:
      "Manage the complete FORESTIQ platform, access control, data workflows and system operations.",
    eyebrow: "ADMIN CONTROL CENTER",
    heroTitle: "Your command center for FORESTIQ.",
    heroText:
      "Oversee users, research data, monitoring modules and platform operations from one workspace.",
    primary: ["Open System Dashboard", "/dashboard/system"],
    secondary: ["Manage Reports", "/dashboard/reports"],
    stats: [
      ["Active modules", "12", "Platform coverage"],
      ["User roles", "06", "Access profiles"],
      ["Data workflows", "04", "Connected sources"],
      ["System status", "Ready", "All core services"],
    ],
    cards: [
      [
        "System Overview",
        "Open the complete operational dashboard and platform KPIs.",
        "/dashboard/system",
        BarChart3,
      ],
      [
        "User Management",
        "Review registered users, roles and workspace access.",
        "/dashboard/users",
        Users,
      ],
      [
        "Research & Data",
        "Monitor datasets, methodology and experiment workflows.",
        "/dashboard/research",
        Database,
      ],
      [
        "Reports",
        "Review generated monitoring and research documentation.",
        "/dashboard/reports",
        FileText,
      ],
    ],
    spotlight: {
      icon: ShieldCheck,
      label: "PLATFORM CONTROL",
      title: "One workspace, six access profiles",
      text: "FORESTIQ separates the working experience by role while keeping the monitoring platform connected.",
    },
  },

  "forest-officer": {
    icon: "🌲",
    label: "Forest Department Officer",
    accent: "forest",
    description:
      "Monitor forest zones, investigate alerts and review operational reports.",
    eyebrow: "FOREST OPERATIONS",
    heroTitle: "Monitor the forest. Act on change.",
    heroText:
      "Keep track of monitored regions, investigate alerts and review evidence from forest intelligence workflows.",
    primary: ["Open Forest Map", "/dashboard/forest-map"],
    secondary: ["Review Alerts", "/dashboard/alerts"],
    stats: [
      ["Monitored zones", "36", "Operational coverage"],
      ["Open alerts", "08", "Review required"],
      ["Change cases", "14", "Awaiting validation"],
      ["Reports", "24", "Available records"],
    ],
    cards: [
      [
        "Forest Map",
        "Inspect monitored forest regions, status layers and alert locations.",
        "/dashboard/forest-map",
        Map,
      ],
      [
        "Alerts",
        "Review critical, high and moderate monitoring alerts.",
        "/dashboard/alerts",
        Bell,
      ],
      [
        "Satellite Analysis",
        "Upload satellite imagery and process it through the FORESTIQ analysis pipeline.",
        "/dashboard/satellite",
        Satellite,
      ],
      [
        "Change Detection",
        "Compare before-and-after imagery to validate forest change.",
        "/dashboard/change-detection",
        MapPinned,
      ],
      [
        "Operational Reports",
        "Create and review forest monitoring reports.",
        "/dashboard/reports",
        FileText,
      ],
    ],
    spotlight: {
      icon: Radar,
      label: "FIELD PRIORITY",
      title: "Alert-first monitoring workflow",
      text: "Move from a geographic alert to imagery comparison and reporting without leaving the FORESTIQ workflow.",
    },
  },

  researcher: {
    icon: "🔬",
    label: "Researcher",
    accent: "research",
    description:
      "Work with datasets, experiments, methodology and model evaluation.",
    eyebrow: "RESEARCH WORKSPACE",
    heroTitle: "Turn forest imagery into evidence.",
    heroText:
      "Organize datasets, experiments, methodology and evaluation results in a research-focused workspace.",
    primary: ["Open Research Workspace", "/dashboard/research"],
    secondary: ["View Analytics", "/dashboard/analytics"],
    stats: [
      ["Dataset sources", "03", "Satellite • Drone • Camera"],
      ["Experiments", "06", "Registered workflows"],
      ["Evaluation", "Pending", "Awaiting trained model"],
      ["Reproducibility", "Ready", "Pipeline documented"],
    ],
    cards: [
      [
        "Research Workspace",
        "Track research questions, methodology, experiments and findings.",
        "/dashboard/research",
        FlaskConical,
      ],
      [
        "Analytics",
        "Explore trends and research-oriented analysis views.",
        "/dashboard/analytics",
        BarChart3,
      ],
      [
        "AI Detection",
        "Upload imagery to the current analysis pipeline.",
        "/dashboard/ai-detection",
        Leaf,
      ],
      [
        "Research Reports",
        "Document methodology, experiments and validated outputs.",
        "/dashboard/reports",
        FileText,
      ],
    ],
    spotlight: {
      icon: FlaskConical,
      label: "RESEARCH STATUS",
      title: "Evidence before conclusions",
      text: "Model metrics stay pending until the dataset is trained and evaluated, keeping the research workflow reproducible.",
    },
  },

  "gis-analyst": {
    icon: "🛰️",
    label: "GIS / Remote Sensing Analyst",
    accent: "gis",
    description:
      "Analyze satellite and drone imagery with spatial change-detection tools.",
    eyebrow: "GEOINT WORKSPACE",
    heroTitle: "See forest change from above.",
    heroText:
      "Process satellite and drone imagery, inspect spatial patterns and compare imagery across time.",
    primary: ["Open Satellite Analysis", "/dashboard/satellite"],
    secondary: ["Open Change Detection", "/dashboard/change-detection"],
    stats: [
      ["Imagery sources", "02", "Satellite + Drone"],
      ["Spatial layers", "08", "Map-ready views"],
      ["Change workflow", "Live", "Baseline pipeline"],
      ["GIS workspace", "Ready", "Interactive mapping"],
    ],
    cards: [
      [
        "Satellite Analysis",
        "Process large-area satellite imagery and inspect analysis outputs.",
        "/dashboard/satellite",
        Satellite,
      ],
      [
        "Drone Analysis",
        "Inspect high-resolution aerial imagery for local forest monitoring.",
        "/dashboard/drone",
        Globe2,
      ],
      [
        "Forest Map",
        "Explore spatial observations and monitoring locations.",
        "/dashboard/forest-map",
        Map,
      ],
      [
        "Change Detection",
        "Compare before-and-after imagery for spatial change analysis.",
        "/dashboard/change-detection",
        MapPinned,
      ],
    ],
    spotlight: {
      icon: Globe2,
      label: "SPATIAL INTELLIGENCE",
      title: "Multi-scale imagery workflow",
      text: "Use satellite coverage for broad monitoring and drone imagery for detailed local inspection.",
    },
  },

  "field-officer": {
    icon: "📷",
    label: "Field Officer",
    accent: "field",
    description:
      "Capture ground observations, upload imagery and support field validation.",
    eyebrow: "FIELD VALIDATION",
    heroTitle: "Bring the forest on the ground into focus.",
    heroText:
      "Capture field observations, connect imagery with location context and support validation of detected changes.",
    primary: ["Upload Ground Camera", "/dashboard/camera"],
    secondary: ["Open Forest Map", "/dashboard/forest-map"],
    stats: [
      ["Field uploads", "128", "Prototype activity"],
      ["GPS observations", "42", "Recorded locations"],
      ["Validation cases", "17", "Review queue"],
      ["Camera pipeline", "Ready", "Upload enabled"],
    ],
    cards: [
      [
        "Ground Camera",
        "Upload ground-level forest observations for analysis.",
        "/dashboard/camera",
        Camera,
      ],
      [
        "AI Detection",
        "Run a field image through the current analysis pipeline.",
        "/dashboard/ai-detection",
        Upload,
      ],
      [
        "Forest Map",
        "Inspect monitored zones and field observation locations.",
        "/dashboard/forest-map",
        MapPinned,
      ],
      [
        "Field Reports",
        "Review documented observations and monitoring outputs.",
        "/dashboard/reports",
        FileText,
      ],
    ],
    spotlight: {
      icon: MapPinned,
      label: "FIELD VALIDATION",
      title: "Observation → location → evidence",
      text: "Connect ground imagery with geographic context so field observations can support the wider monitoring workflow.",
    },
  },

  viewer: {
    icon: "👤",
    label: "Viewer / Public User",
    accent: "viewer",
    description:
      "Explore selected forest maps, analytics and published monitoring information.",
    eyebrow: "PUBLIC INSIGHTS",
    heroTitle: "Explore the state of our forests.",
    heroText:
      "Discover selected maps, statistics and published monitoring information through a simplified public workspace.",
    primary: ["Explore Forest Map", "/dashboard/forest-map"],
    secondary: ["View Analytics", "/dashboard/analytics"],
    stats: [
      ["Forest coverage", "78.4%", "Prototype indicator"],
      ["Regions visible", "36", "Selected monitoring areas"],
      ["Published reports", "24", "Available records"],
      ["Map view", "Global", "Interactive coverage"],
    ],
    cards: [
      [
        "Forest Map",
        "Explore the geographic forest monitoring view and status locations.",
        "/dashboard/forest-map",
        Map,
      ],
      [
        "Analytics",
        "View selected forest statistics and trends.",
        "/dashboard/analytics",
        BarChart3,
      ],
      [
        "Published Reports",
        "Read available monitoring and research reports.",
        "/dashboard/reports",
        FileText,
      ],
      [
        "Research Overview",
        "Explore the documented research workflow and methodology.",
        "/dashboard/research",
        FlaskConical,
      ],
    ],
    spotlight: {
      icon: Leaf,
      label: "PUBLIC VIEW",
      title: "Understand forest change at a glance",
      text: "A simplified view keeps public information accessible while the specialist workflows remain role-specific.",
    },
  },
};

function getUser() {
  try {
    const raw = localStorage.getItem("forestiqUser");
    const user = raw ? JSON.parse(raw) : null;

    return user?.loggedIn ? user : null;
  } catch {
    return null;
  }
}

function normalizeRole(value) {
  if (!value) return "viewer";

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  const aliases = {
    admin: "admin",
    "super-admin": "super-admin",
    "superadmin": "super-admin",

    "forest-officer": "forest-officer",
    "forest-department-officer": "forest-officer",
    "forest-department": "forest-officer",

    researcher: "researcher",
    research: "researcher",

    "gis-analyst": "gis-analyst",
    gis: "gis-analyst",
    "remote-sensing-analyst": "gis-analyst",

    "field-officer": "field-officer",
    field: "field-officer",

    viewer: "viewer",
    user: "viewer",
    "public-user": "viewer",
    "viewer-public-user": "viewer",
  };

  return aliases[normalized] || "viewer";
}

function resolveRole(user) {
  const key = normalizeRole(user?.role);
  return ROLE_CONFIG[key] || ROLE_CONFIG.viewer;
}

export default function RoleDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const role = resolveRole(user);

  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = useMemo(() => {
    const parts = displayName.split(/\s+/).filter(Boolean);

    return (
      parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "U"
    );
  }, [displayName]);

  const open = (path) => {
    if (path) navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("forestiqUser");
    localStorage.removeItem("forestiq_token");
    navigate("/login", { replace: true });
  };

  const SpotlightIcon = role.spotlight.icon;

  return (
    <div className={`role-dashboard role-${role.accent}`}>
      <header className="role-header">
        <button
          className="role-brand"
          onClick={() => navigate("/")}
          aria-label="Go to FORESTIQ home"
        >
          <span className="role-brand-icon">
            <TreePine size={23} strokeWidth={2.4} />
          </span>

          <span className="role-brand-copy">
            <b>FORESTIQ</b>
            <small>FOREST INTELLIGENCE</small>
          </span>
        </button>

        <div className="role-header-center">
          <span className="role-live">
            <i />
            WORKSPACE ACTIVE
          </span>

          <span className="role-header-role">
            <span>{role.icon}</span>
            {role.label}
          </span>
        </div>

        <div className="role-user">
          <div className="role-avatar">{initials}</div>

          <div className="role-user-text">
            <b>{displayName}</b>
            <span>{role.label}</span>
          </div>

          <button
            className="role-settings"
            onClick={() => open("/dashboard/settings")}
            aria-label="Open settings"
            title="Settings"
          >
            <Settings size={17} />
          </button>

          <button
            className="role-logout"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="role-main">
        <section className="role-hero">
          <div className="role-hero-copy">
            <div className="role-eyebrow">
              <ShieldCheck size={15} />
              {role.eyebrow}
            </div>

            <h1>{role.heroTitle}</h1>

            <p>{role.heroText}</p>

            <div className="role-hero-actions">
              <button onClick={() => open(role.primary[1])}>
                {role.accent === "gis" ? (
                  <Satellite size={17} />
                ) : (
                  <Map size={17} />
                )}

                {role.primary[0]}

                <ArrowRight size={16} />
              </button>

              <button
                className="secondary"
                onClick={() => open(role.secondary[1])}
              >
                {role.accent === "forest" ? (
                  <Bell size={17} />
                ) : (
                  <BarChart3 size={17} />
                )}

                {role.secondary[0]}
              </button>
            </div>
          </div>

          <div className="role-hero-panel">
            <div className="role-panel-glow" />

            <div className="role-hero-icon">
              {role.icon}
            </div>

            <span className="role-panel-kicker">
              CURRENT ACCESS
            </span>

            <strong>{role.label}</strong>

            <small>{role.description}</small>

            <div className="role-panel-status">
              <CheckCircle2 size={15} />
              Workspace configured
            </div>
          </div>
        </section>

        <section className="role-stat-grid">
          {role.stats.map(
            ([label, value, note], index) => (
              <article
                className="role-stat-card"
                key={label}
              >
                <div className="role-stat-top">
                  <span>{label}</span>

                  <span className="role-stat-index">
                    0{index + 1}
                  </span>
                </div>

                <strong>{value}</strong>

                <small>{note}</small>
              </article>
            )
          )}
        </section>

        <section className="role-section-heading">
          <div>
            <span>{role.eyebrow}</span>
            <h2>Workspace modules</h2>
          </div>

          <div className="role-count">
            <Activity size={15} />
            {role.cards.length} focused modules
          </div>
        </section>

        <section className="role-card-grid">
          {role.cards.map(
            ([title, description, path, Icon]) => (
              <button
                className="role-module-card"
                key={title}
                onClick={() => open(path)}
              >
                <div className="role-module-icon">
                  <Icon
                    size={22}
                    strokeWidth={2.1}
                  />
                </div>

                <div className="role-module-copy">
                  <span>FORESTIQ MODULE</span>

                  <h3>{title}</h3>

                  <p>{description}</p>
                </div>

                <ArrowRight
                  className="role-module-arrow"
                  size={19}
                />
              </button>
            )
          )}
        </section>

        <section className="role-bottom-grid">
          <article className="role-spotlight">
            <div className="role-spotlight-icon">
              <SpotlightIcon size={21} />
            </div>

            <div>
              <span>{role.spotlight.label}</span>

              <h3>{role.spotlight.title}</h3>

              <p>{role.spotlight.text}</p>
            </div>
          </article>

          <article className="role-access-card">
            <div className="role-access-head">
              <div className="role-access-icon">
                <ShieldCheck size={19} />
              </div>

              <div>
                <span>ACCESS PROFILE</span>
                <h3>{role.label}</h3>
              </div>
            </div>

            <div className="role-access-line">
              <CheckCircle2 size={15} />
              Role-specific workspace active
            </div>

            <div className="role-access-line">
              <Leaf size={15} />
              FORESTIQ monitoring platform
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}