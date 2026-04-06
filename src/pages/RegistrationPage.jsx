import { useState } from "react";
import { useResponsive, tokens, navbarStyles, inputStyle, primaryBtn } from "../hooks/useResponsive";

const TITLES = ["Mr", "Ms", "Mrs", "Dr", "Prof"];
const DEPARTMENTS = [
  "Computer Science", "Electrical Engineering", "Mechanical Engineering",
  "Civil Engineering", "Chemical Engineering", "Electronics & Communication",
  "Information Technology", "Physics", "Mathematics", "Other",
];
const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Other",
];
const HEARD_FROM = [
  "From other College","Social Media","Email","Friend/Colleague",
  "FOSSEE Website","Professor","Other",
];

const EMPTY = {
  username:"", email:"", password:"", confirmPassword:"",
  title:"", firstName:"", lastName:"", phone:"",
  institute:"", department:"", location:"", state:"", heardFrom:"",
};

function validate(form) {
  const e = {};
  if (!form.username.trim()) e.username = "Required";
  else if (!/^[\w.]+$/.test(form.username)) e.username = "Letters, digits, period and underscore only";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
  if (form.password.length < 8) e.password = "Minimum 8 characters";
  if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
  if (!form.title) e.title = "Required";
  if (!form.firstName.trim()) e.firstName = "Required";
  if (!form.lastName.trim()) e.lastName = "Required";
  if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Valid 10-digit Indian mobile";
  if (!form.institute.trim()) e.institute = "Required";
  if (!form.department) e.department = "Required";
  if (!form.location.trim()) e.location = "Required";
  if (!form.state) e.state = "Required";
  if (!form.heardFrom) e.heardFrom = "Required";
  return e;
}

function Field({ label, error, required, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: "block", fontSize: 13, fontWeight: 600,
        color: tokens.gray700, marginBottom: 5,
      }}>
        {label}{required && <span style={{ color: tokens.red, marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <div style={{ fontSize: 11, color: tokens.gray500, marginTop: 4, lineHeight: 1.4 }}>{hint}</div>
      )}
      {error && (
        <div style={{ fontSize: 12, color: tokens.red, marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
}

function Section({ num, title, children, isMobile }) {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${tokens.gray200}`,
      borderRadius: tokens.radius.lg,
      padding: isMobile ? "16px 16px" : "20px 24px",
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: tokens.blue, color: "#fff",
          fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>{num}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: tokens.gray800 }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

export default function RegistrationPage({ onSuccess }) {
  const { isMobile, isTablet } = useResponsive();
  const nav = navbarStyles(isMobile);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Responsive grid: 1 col on mobile, 2 on tablet+
  const grid2 = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? 0 : 16,
  };
  const grid3 = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "0.6fr 1fr 1fr",
    gap: isMobile ? 0 : 16,
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setDone(true);
    onSuccess?.(form);
  }

  if (done) return (
    <div style={{ minHeight: "100vh", background: tokens.gray100, fontFamily: tokens.font, display: "flex", flexDirection: "column" }}>
      <header style={nav.navbar}><div style={nav.navInner}><span style={nav.navLogo}>FOSSEE Workshops</span></div></header>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", border: "2px solid #86efac", color: "#16a34a", fontSize: 28, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>✓</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: tokens.gray900, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Registration successful!</h2>
        <p style={{ fontSize: 14, color: tokens.gray600, margin: "0 0 24px" }}>Your coordinator account has been created.</p>
        <button style={primaryBtn({ padding: "12px 28px", borderRadius: tokens.radius.lg, fontSize: 15 })} onClick={() => setDone(false)}>Back to sign in</button>
      </div>
      <footer style={{ textAlign: "center", padding: "12px 0", fontSize: 12, background: tokens.navy, color: "#cbd5e0" }}>Developed by FOSSEE group, IIT Bombay</footer>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: tokens.gray100, fontFamily: tokens.font, display: "flex", flexDirection: "column" }}>
      <header style={nav.navbar}>
        <div style={nav.navInner}>
          <span style={nav.navLogo}>FOSSEE Workshops</span>
          <nav style={nav.navLinks}>
            <a href="#" style={nav.navLink}>Home</a>
            {!isMobile && <a href="#" style={nav.navLink}>Workshop Statistics</a>}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, padding: isMobile ? "20px 12px 40px" : "32px 16px 48px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <div style={{ width: 5, height: isMobile ? 44 : 52, background: tokens.blue, borderRadius: 99, flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: tokens.gray900, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                Coordinator Registration
              </h1>
              <p style={{ fontSize: 13, color: tokens.gray600, margin: 0 }}>
                Create your FOSSEE workshop coordinator account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Section 1: Account */}
            <Section num="1" title="Account credentials" isMobile={isMobile}>
              <div style={grid2}>
                <Field label="Username" error={errors.username} required hint="Letters, digits, period and underscore only">
                  <input style={inputStyle(!!errors.username)} type="text" placeholder="e.g. john_doe" value={form.username} onChange={set("username")} autoComplete="username" />
                </Field>
                <Field label="Email" error={errors.email} required>
                  <input style={inputStyle(!!errors.email)} type="email" placeholder="you@college.edu" value={form.email} onChange={set("email")} autoComplete="email" />
                </Field>
              </div>
              <div style={grid2}>
                <Field label="Password" error={errors.password} required>
                  <div style={{ position: "relative" }}>
                    <input style={inputStyle(!!errors.password, { paddingRight: 40 })} type={showPwd ? "text" : "password"} placeholder="Min 8 characters" value={form.password} onChange={set("password")} />
                    <button type="button" style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15,padding:2 }} onClick={() => setShowPwd(v => !v)}>{showPwd ? "🙈" : "👁"}</button>
                  </div>
                </Field>
                <Field label="Confirm password" error={errors.confirmPassword} required>
                  <div style={{ position: "relative" }}>
                    <input style={inputStyle(!!errors.confirmPassword, { paddingRight: 40 })} type={showCPwd ? "text" : "password"} placeholder="Re-enter password" value={form.confirmPassword} onChange={set("confirmPassword")} />
                    <button type="button" style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15,padding:2 }} onClick={() => setShowCPwd(v => !v)}>{showCPwd ? "🙈" : "👁"}</button>
                  </div>
                </Field>
              </div>
            </Section>

            {/* Section 2: Personal */}
            <Section num="2" title="Personal details" isMobile={isMobile}>
              <div style={grid3}>
                <Field label="Title" error={errors.title} required>
                  <select style={inputStyle(!!errors.title)} value={form.title} onChange={set("title")}>
                    <option value="">Select</option>
                    {TITLES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="First name" error={errors.firstName} required>
                  <input style={inputStyle(!!errors.firstName)} type="text" placeholder="First name" value={form.firstName} onChange={set("firstName")} autoComplete="given-name" />
                </Field>
                <Field label="Last name" error={errors.lastName} required>
                  <input style={inputStyle(!!errors.lastName)} type="text" placeholder="Last name" value={form.lastName} onChange={set("lastName")} autoComplete="family-name" />
                </Field>
              </div>
              <div style={isMobile ? {} : { maxWidth: "49%" }}>
                <Field label="Phone number" error={errors.phone} required>
                  <div style={{ position: "relative" }}>
                    <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:tokens.gray600,fontWeight:500,pointerEvents:"none" }}>+91</span>
                    <input style={inputStyle(!!errors.phone, { paddingLeft: 44 })} type="tel" placeholder="98765 43210" maxLength={10} value={form.phone} onChange={set("phone")} autoComplete="tel" />
                  </div>
                </Field>
              </div>
            </Section>

            {/* Section 3: Institution */}
            <Section num="3" title="Institution details" isMobile={isMobile}>
              <Field label="Institute" error={errors.institute} required hint="Please write the full name of your Institute/Organization">
                <input style={inputStyle(!!errors.institute)} type="text" placeholder="Full institute name" value={form.institute} onChange={set("institute")} />
              </Field>
              <div style={grid2}>
                <Field label="Department" error={errors.department} required hint="Department you work/study">
                  <select style={inputStyle(!!errors.department)} value={form.department} onChange={set("department")}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Location" error={errors.location} required hint="Place/City">
                  <input style={inputStyle(!!errors.location)} type="text" placeholder="City" value={form.location} onChange={set("location")} />
                </Field>
              </div>
              <div style={grid2}>
                <Field label="State" error={errors.state} required>
                  <select style={inputStyle(!!errors.state)} value={form.state} onChange={set("state")}>
                    <option value="">Select state</option>
                    {STATES.map(st => <option key={st}>{st}</option>)}
                  </select>
                </Field>
                <Field label="How did you hear about us" error={errors.heardFrom} required>
                  <select style={inputStyle(!!errors.heardFrom)} value={form.heardFrom} onChange={set("heardFrom")}>
                    <option value="">Select</option>
                    {HEARD_FROM.map(h => <option key={h}>{h}</option>)}
                  </select>
                </Field>
              </div>
            </Section>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 12 : 20, marginTop: 4 }}>
              <button
                type="submit"
                disabled={loading}
                style={primaryBtn({
                  padding: isMobile ? "14px" : "12px 36px",
                  fontSize: isMobile ? 16 : 15,
                  borderRadius: tokens.radius.lg,
                  opacity: loading ? 0.75 : 1,
                  minHeight: isMobile ? 52 : 44,
                })}
              >
                {loading ? "Registering…" : "Register"}
              </button>
              <p style={{ fontSize: 14, color: tokens.gray600, margin: 0, textAlign: isMobile ? "center" : "left" }}>
                Already have an account?{" "}
                <a href="#" style={{ color: tokens.blue, fontWeight: 600, textDecoration: "none" }}>Sign in</a>
              </p>
            </div>
          </form>
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "12px 0", fontSize: 12, background: tokens.navy, color: "#cbd5e0" }}>
        Developed by FOSSEE group, IIT Bombay
      </footer>
    </div>
  );
}