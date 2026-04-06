
import { useState } from "react";
import { useResponsive, tokens, navbarStyles, inputStyle, primaryBtn } from "../hooks/useResponsive";

export default function LoginPage({ onLogin, onSignUp, onForgotPassword }) {
  const { isMobile } = useResponsive();
  const nav = navbarStyles(isMobile);

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.password) e.password = "Password is required";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onLogin?.(form);
  }

  const s = styles(isMobile);

  return (
    <div style={s.page}>
      <header style={nav.navbar}>
        <div style={nav.navInner}>
          <span style={nav.navLogo}>FOSSEE Workshops</span>
          <nav style={nav.navLinks}>
            <a href="#" style={nav.navLink}>Home</a>
            {!isMobile && <a href="#" style={nav.navLink}>Workshop Statistics</a>}
          </nav>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.card}>
          <div style={s.accentBar} />
          <div style={s.cardBody}>
            <div style={s.logoMark}>FW</div>
            <h1 style={s.heading}>Welcome back</h1>
            <p style={s.sub}>Sign in to your FOSSEE account</p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={s.field}>
                <label style={s.label} htmlFor="username">Username</label>
                <input
                  id="username"
                  style={inputStyle(!!errors.username)}
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={set("username")}
                  autoComplete="username"
                />
                {errors.username && <div style={s.errMsg}>{errors.username}</div>}
              </div>

              <div style={s.field}>
                <label style={s.label} htmlFor="password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    style={inputStyle(!!errors.password, { paddingRight: 44 })}
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
                {errors.password && <div style={s.errMsg}>{errors.password}</div>}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={primaryBtn({
                  width: "100%",
                  padding: isMobile ? "14px" : "12px",
                  fontSize: isMobile ? 16 : 15,
                  borderRadius: tokens.radius.lg,
                  marginTop: 4,
                  opacity: loading ? 0.75 : 1,
                  minHeight: isMobile ? 52 : 44,
                })}
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
      </main>

      <footer style={s.footer}>Developed by FOSSEE group, IIT Bombay</footer>
    </div>
  );
}

function styles(isMobile) {
  return {
    page: {
      minHeight: "100vh",
      background: tokens.gray100,
      fontFamily: tokens.font,
      display: "flex",
      flexDirection: "column",
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "24px 16px" : "40px 16px",
    },
    card: {
      width: "100%",
      maxWidth: 420,
      background: "#fff",
      borderRadius: tokens.radius.xl,
      border: `1px solid ${tokens.gray200}`,
      overflow: "hidden",
      display: "flex",
    },
    accentBar: { width: 5, background: tokens.blue, flexShrink: 0 },
    cardBody: {
      flex: 1,
      padding: isMobile ? "24px 20px" : "32px 28px",
    },
    logoMark: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: tokens.blue,
      color: "#fff",
      fontSize: 13,
      fontWeight: 800,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    heading: {
      fontSize: isMobile ? 20 : 22,
      fontWeight: 800,
      color: tokens.gray900,
      margin: "0 0 4px",
      letterSpacing: "-0.02em",
    },
    sub: { fontSize: 14, color: tokens.gray600, margin: "0 0 22px" },
    field: { marginBottom: 16 },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 600,
      color: tokens.gray700,
      marginBottom: 5,
    },
    errMsg: { fontSize: 12, color: tokens.red, marginTop: 4 },
    eyeBtn: {
      position: "absolute",
      right: 10,
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 16,
      padding: 2,
      lineHeight: 1,
    },
    divider: {
      position: "relative",
      textAlign: "center",
      margin: "20px 0",
      borderTop: `1px solid ${tokens.gray200}`,
    },
    dividerText: {
      position: "relative",
      top: -11,
      background: "#fff",
      padding: "0 10px",
      fontSize: 12,
      color: tokens.gray500,
    },
    links: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? 12 : 8,
    },
    linkBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: isMobile ? 15 : 14,
      color: tokens.gray700,
      fontFamily: tokens.font,
      padding: isMobile ? "4px 0" : 0,
      textAlign: "left",
    },
    linkAccent: { color: tokens.blue, fontWeight: 600 },
    footer: {
      textAlign: "center",
      padding: "12px 0",
      fontSize: 12,
      background: tokens.navy,
      color: "#cbd5e0",
    },
  };
}