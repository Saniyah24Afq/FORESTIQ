import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import "./Auth.css";

const ROLES = [
  { value: "admin", label: "Super Admin", icon: "👑" },
  { value: "forest-officer", label: "Forest Department Officer", icon: "🌲" },
  { value: "researcher", label: "Researcher", icon: "🔬" },
  { value: "gis-analyst", label: "GIS / Remote Sensing Analyst", icon: "🛰️" },
  { value: "field-officer", label: "Field Officer", icon: "📷" },
  { value: "viewer", label: "Viewer / Public User", icon: "👤" },
];

const getRole = (value) =>
  ROLES.find((role) => role.value === value) || ROLES[2];

const readAccounts = () => {
  try {
    const accounts = JSON.parse(localStorage.getItem("forestiqAccounts") || "[]");
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
};

const saveAccounts = (accounts) => {
  localStorage.setItem("forestiqAccounts", JSON.stringify(accounts));
};

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-one" />
      <div className="auth-bg-orb auth-bg-orb-two" />

      <div className="auth-layout">
        <div className="auth-brand-panel">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <ShieldCheck size={25} />
            </div>
            <div>
              <strong>FORESTIQ</strong>
              <span>FOREST INTELLIGENCE</span>
            </div>
          </div>

          <div className="auth-hero-copy">
            <span className="auth-eyebrow">SMART FOREST MONITORING</span>
            <h1>
              Intelligence for a
              <span> greener future.</span>
            </h1>
            <p>
              Monitor forests, detect change, analyze imagery and turn
              environmental data into actionable intelligence.
            </p>
          </div>

          <div className="auth-trust-row">
            <span>Satellite</span>
            <span>Drone</span>
            <span>Ground Camera</span>
            <span>AI Analysis</span>
          </div>
        </div>

        <div className="auth-card-wrap">
          <div className="auth-card">
            <div className="auth-card-heading">
              <span className="auth-card-kicker">FORESTIQ WORKSPACE</span>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleSelect({ value, onChange }) {
  return (
    <div className="auth-field">
      <label htmlFor="role">Workspace role</label>
      <div className="auth-input-wrap">
        <ShieldCheck size={17} />
        <select id="role" value={value} onChange={onChange}>
          {ROLES.map((role) => (
            <option key={role.value} value={role.value}>
              {role.icon} {role.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function PasswordField({ id, value, onChange, placeholder, label }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <LockKeyhole size={17} />
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={id === "password" ? "current-password" : "new-password"}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const accounts = readAccounts();
    const account = accounts.find(
      (item) =>
        item.email === normalizedEmail &&
        item.password === password &&
        item.role === role
    );

    if (!account) {
      setError(
        "Account not found. Check your email, password and selected role, or create an account first."
      );
      return;
    }

    setLoading(true);

    const loggedInUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      roleName: account.roleName,
      roleIcon: account.roleIcon,
      loggedIn: true,
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem("forestiqUser", JSON.stringify(loggedInUser));

    setTimeout(() => navigate("/dashboard", { replace: true }), 250);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your forest intelligence workspace."
    >
      <form className="auth-form" onSubmit={handleLogin}>
        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label htmlFor="email">Email address</label>
          <div className="auth-input-wrap">
            <Mail size={17} />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
        />

        <RoleSelect
          value={role}
          onChange={(event) => setRole(event.target.value)}
        />

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight size={17} />}
        </button>

        <div className="auth-switch">
          <span>Don't have an account?</span>
          <Link to="/register">Create account</Link>
        </div>

        <Link className="auth-back-link" to="/">
          ← Back to FORESTIQ website
        </Link>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("researcher");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!cleanName || !normalizedEmail || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const accounts = readAccounts();

    if (accounts.some((account) => account.email === normalizedEmail)) {
      setError("An account with this email already exists. Please login.");
      return;
    }

    const selectedRole = getRole(role);

    const account = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: normalizedEmail,
      password,
      role: selectedRole.value,
      roleName: selectedRole.label,
      roleIcon: selectedRole.icon,
      createdAt: new Date().toISOString(),
    };

    saveAccounts([...accounts, account]);

    // IMPORTANT: registration does NOT log the user in.
    // The user must login after creating the account.
    localStorage.removeItem("forestiqUser");

    setSuccess("Account created successfully. Redirecting you to login...");

    setTimeout(() => {
      navigate("/login", {
        replace: true,
        state: {
          registeredEmail: normalizedEmail,
          registeredRole: selectedRole.value,
        },
      });
    }, 900);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up your FORESTIQ workspace and choose your role."
    >
      <form className="auth-form" onSubmit={handleRegister}>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div className="auth-field">
          <label htmlFor="name">Full name</label>
          <div className="auth-input-wrap">
            <UserRound size={17} />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="register-email">Email address</label>
          <div className="auth-input-wrap">
            <Mail size={17} />
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <RoleSelect
          value={role}
          onChange={(event) => setRole(event.target.value)}
        />

        <PasswordField
          id="register-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 6 characters"
        />

        <PasswordField
          id="confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter your password"
        />

        <button className="auth-submit" type="submit">
          Create account
          <ArrowRight size={17} />
        </button>

        <div className="auth-switch">
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </div>

        <Link className="auth-back-link" to="/">
          ← Back to FORESTIQ website
        </Link>
      </form>
    </AuthShell>
  );
}
