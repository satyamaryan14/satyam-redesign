import { useState } from "react";

export default function LoginPage({ onLogin, onSignUp, onForgotPassword }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onLogin?.(form);
  }

  return (
    <div style={s.page}>
      <header style={s.navbar}>
        <div style={s.navInner}>
          <span style={s.navLogo}>FOSSEE Workshops</span>
          <nav style={s.navLinks}>
            <a href="#" style={s.navLink}>Home</a>
            <a href="#" style={s.navLink}>Workshop Statistics</a>
          </nav>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.card}>
          {/* Left accent bar */}
          <div style={s.accentBar} />

          <div style={s.cardBody}>
            <div style={s.logoMark}>FW</div>
            <h1 style={s.heading}>Welcome back</h1>
            <p style={s.subheading}>Sign in to your FOSSEE account</p>

            {error && <div style={s.errorBanner}>{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div style={s.field}>
                <label style={s.label} htmlFor="username">Username</label>
                <input
                  id="username"
                  style={s.input}
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={set("username")}
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div style={s.field}>
                <label style={s.label} htmlFor="password">Password</label>
                <div style={s.pwdWrap}>
                  <input
                    id="password"
                    style={{ ...s.input, paddingRight: 44 }}
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    style={s.eyeBtn}
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                style={{ ...s.submitBtn, opacity: loading ? 0.75 : 1 }}
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div style={s.divider}><span style={s.dividerText}>or</span></div>

            <div style={s.links}>
              <button style={s.linkBtn} onClick={onSignUp}>
                New around here? <span style={s.linkAccent}>Sign up</span>
              </button>
              <button style={s.linkBtn} onClick={onForgotPassword}>
                <span style={s.linkAccent}>Forgot password?</span>
              </button>
            </div>
          </div>
        </div>

        <p style={s.footer}>Developed by FOSSEE group, IIT Bombay</p>
      </main>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f9",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    background: "#2d3748",
    borderBottom: "1px solid #3a4a5c",
  },
  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: {
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "-0.01em",
  },
  navLinks: { display: "flex", gap: 24 },
  navLink: {
    fontSize: 14,
    color: "#cbd5e0",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color .15s",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#ffffff",
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    display: "flex",
  },
  accentBar: {
    width: 5,
    background: "#2563eb",
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    padding: "32px 28px",
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    letterSpacing: "0.02em",
  },
  heading: {
    fontSize: 22,
    fontWeight: 800,
    color: "#1a202c",
    margin: "0 0 4px",
    letterSpacing: "-0.02em",
  },
  subheading: {
    fontSize: 14,
    color: "#718096",
    margin: "0 0 24px",
  },
  errorBanner: {
    background: "#fff5f5",
    border: "1px solid #feb2b2",
    color: "#c53030",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 16,
  },
  field: { marginBottom: 16 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#4a5568",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    color: "#1a202c",
    background: "#f7fafc",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .15s",
  },
  pwdWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
    padding: 2,
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 9,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 4,
    letterSpacing: "-0.01em",
    transition: "background .15s",
  },
  divider: {
    position: "relative",
    textAlign: "center",
    margin: "20px 0",
    borderTop: "1px solid #e2e8f0",
  },
  dividerText: {
    position: "relative",
    top: -11,
    background: "#fff",
    padding: "0 10px",
    fontSize: 12,
    color: "#a0aec0",
  },
  links: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "flex-start",
  },
  linkBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "#4a5568",
    fontFamily: "inherit",
    padding: 0,
  },
  linkAccent: { color: "#2563eb", fontWeight: 600 },
  footer: {
    marginTop: 28,
    fontSize: 12,
    color: "#a0aec0",
    textAlign: "center",
  },
};