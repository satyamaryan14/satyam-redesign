import { useState } from "react";

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
  "From other College", "Social Media", "Email", "Friend/Colleague",
  "FOSSEE Website", "Professor", "Other",
];

function validate(form) {
  const errs = {};
  if (!form.username.trim()) errs.username = "Required";
  else if (!/^[\w.]+$/.test(form.username)) errs.username = "Letters, digits, period and underscore only";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
  if (form.password.length < 8) errs.password = "Minimum 8 characters";
  if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
  if (!form.title) errs.title = "Required";
  if (!form.firstName.trim()) errs.firstName = "Required";
  if (!form.lastName.trim()) errs.lastName = "Required";
  if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) errs.phone = "Enter a valid 10-digit number";
  if (!form.institute.trim()) errs.institute = "Please write the full name";
  if (!form.department) errs.department = "Required";
  if (!form.location.trim()) errs.location = "Required";
  if (!form.state) errs.state = "Required";
  if (!form.heardFrom) errs.heardFrom = "Required";
  return errs;
}

function Field({ label, error, required, hint, children }) {
  return (
    <div style={s.field}>
      <label style={s.label}>
        {label}{required && <span style={s.req}>*</span>}
      </label>
      <div style={s.inputWrap}>{children}</div>
      {hint && !error && <div style={s.hint}>{hint}</div>}
      {error && <div style={s.errMsg}>{error}</div>}
    </div>
  );
}

const EMPTY = {
  username:"", email:"", password:"", confirmPassword:"",
  title:"", firstName:"", lastName:"", phone:"",
  institute:"", department:"", location:"", state:"", heardFrom:"",
};

export default function RegistrationPage({ onSuccess }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
    <div style={s.page}>
      <Navbar />
      <div style={s.successPage}>
        <div style={s.successIcon}>✓</div>
        <h2 style={s.successTitle}>Registration successful!</h2>
        <p style={s.successSub}>Your coordinator account has been created. You can now sign in.</p>
        <button style={s.successBtn} onClick={() => setDone(false)}>Back to sign in</button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={s.page}>
      <Navbar />
      <main style={s.main}>
        <div style={s.container}>
          <div style={s.pageHeader}>
            <div style={s.pageAccent} />
            <div>
              <h1 style={s.pageTitle}>Coordinator Registration</h1>
              <p style={s.pageSub}>Create your FOSSEE workshop coordinator account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1: Account */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <div style={s.sectionNum}>1</div>
                <div style={s.sectionTitle}>Account credentials</div>
              </div>
              <div style={s.grid2}>
                <Field label="Username" error={errors.username} required hint="Letters, digits, period and underscore only">
                  <input style={inp(errors.username)} type="text" placeholder="e.g. john_doe" value={form.username} onChange={set("username")} autoComplete="username" />
                </Field>
                <Field label="Email" error={errors.email} required>
                  <input style={inp(errors.email)} type="email" placeholder="you@college.edu" value={form.email} onChange={set("email")} autoComplete="email" />
                </Field>
              </div>
              <div style={s.grid2}>
                <Field label="Password" error={errors.password} required>
                  <div style={{ position:"relative" }}>
                    <input style={{ ...inp(errors.password), paddingRight: 40 }} type={showPwd?"text":"password"} placeholder="Min 8 characters" value={form.password} onChange={set("password")} />
                    <button type="button" style={s.eye} onClick={()=>setShowPwd(v=>!v)}>{showPwd?"🙈":"👁"}</button>
                  </div>
                </Field>
                <Field label="Confirm password" error={errors.confirmPassword} required>
                  <div style={{ position:"relative" }}>
                    <input style={{ ...inp(errors.confirmPassword), paddingRight: 40 }} type={showCPwd?"text":"password"} placeholder="Re-enter password" value={form.confirmPassword} onChange={set("confirmPassword")} />
                    <button type="button" style={s.eye} onClick={()=>setShowCPwd(v=>!v)}>{showCPwd?"🙈":"👁"}</button>
                  </div>
                </Field>
              </div>
            </div>

            {/* Section 2: Personal */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <div style={s.sectionNum}>2</div>
                <div style={s.sectionTitle}>Personal details</div>
              </div>
              <div style={s.grid3}>
                <Field label="Title" error={errors.title} required>
                  <select style={inp(errors.title)} value={form.title} onChange={set("title")}>
                    <option value="">Select</option>
                    {TITLES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="First name" error={errors.firstName} required>
                  <input style={inp(errors.firstName)} type="text" placeholder="First name" value={form.firstName} onChange={set("firstName")} autoComplete="given-name" />
                </Field>
                <Field label="Last name" error={errors.lastName} required>
                  <input style={inp(errors.lastName)} type="text" placeholder="Last name" value={form.lastName} onChange={set("lastName")} autoComplete="family-name" />
                </Field>
              </div>
              <div style={s.grid2}>
                <Field label="Phone number" error={errors.phone} required>
                  <div style={{ position:"relative" }}>
                    <span style={s.prefix}>+91</span>
                    <input style={{ ...inp(errors.phone), paddingLeft: 44 }} type="tel" placeholder="98765 43210" maxLength={10} value={form.phone} onChange={set("phone")} autoComplete="tel" />
                  </div>
                </Field>
              </div>
            </div>

            {/* Section 3: Institution */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <div style={s.sectionNum}>3</div>
                <div style={s.sectionTitle}>Institution details</div>
              </div>
              <Field label="Institute" error={errors.institute} required hint="Please write the full name of your Institute/Organization">
                <input style={inp(errors.institute)} type="text" placeholder="Full institute name" value={form.institute} onChange={set("institute")} />
              </Field>
              <div style={s.grid2}>
                <Field label="Department" error={errors.department} required hint="Department you work/study">
                  <select style={inp(errors.department)} value={form.department} onChange={set("department")}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Location" error={errors.location} required hint="Place/City">
                  <input style={inp(errors.location)} type="text" placeholder="City" value={form.location} onChange={set("location")} />
                </Field>
              </div>
              <div style={s.grid2}>
                <Field label="State" error={errors.state} required>
                  <select style={inp(errors.state)} value={form.state} onChange={set("state")}>
                    <option value="">Select state</option>
                    {STATES.map(st=><option key={st}>{st}</option>)}
                  </select>
                </Field>
                <Field label="How did you hear about us" error={errors.heardFrom} required>
                  <select style={inp(errors.heardFrom)} value={form.heardFrom} onChange={set("heardFrom")}>
                    <option value="">Select</option>
                    {HEARD_FROM.map(h=><option key={h}>{h}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div style={s.actions}>
              <button
                type="submit"
                style={{ ...s.registerBtn, opacity: loading ? 0.75 : 1 }}
                disabled={loading}
              >
                {loading ? "Registering…" : "Register"}
              </button>
              <p style={s.loginHint}>
                Already have an account?{" "}
                <a href="#" style={s.loginLink}>Sign in</a>
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Helpers
function inp(err) {
  return {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${err ? "#fc8181" : "#e2e8f0"}`,
    borderRadius: 8,
    fontSize: 14,
    color: "#1a202c",
    background: err ? "#fff5f5" : "#f7fafc",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  };
}

function Navbar() {
  return (
    <header style={s.navbar}>
      <div style={s.navInner}>
        <span style={s.navLogo}>FOSSEE Workshops</span>
        <nav style={s.navLinks}>
          <a href="#" style={s.navLink}>Home</a>
          <a href="#" style={s.navLink}>Workshop Statistics</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return <div style={s.footer}>Developed by FOSSEE group, IIT Bombay</div>;
}

const s = {
  page: { minHeight:"100vh", background:"#f4f6f9", fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", flexDirection:"column" },
  navbar: { background:"#2d3748", borderBottom:"1px solid #3a4a5c" },
  navInner: { maxWidth:1100, margin:"0 auto", padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" },
  navLogo: { fontSize:18, fontWeight:700, color:"#ffffff", letterSpacing:"-0.01em" },
  navLinks: { display:"flex", gap:24 },
  navLink: { fontSize:14, color:"#cbd5e0", textDecoration:"none", fontWeight:500 },
  main: { flex:1, padding:"32px 16px 48px" },
  container: { maxWidth:780, margin:"0 auto" },
  pageHeader: { display:"flex", alignItems:"center", gap:16, marginBottom:28 },
  pageAccent: { width:5, height:52, background:"#2563eb", borderRadius:99, flexShrink:0 },
  pageTitle: { fontSize:22, fontWeight:800, color:"#1a202c", margin:"0 0 4px", letterSpacing:"-0.02em" },
  pageSub: { fontSize:14, color:"#718096", margin:0 },
  section: { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"20px 24px", marginBottom:16 },
  sectionHeader: { display:"flex", alignItems:"center", gap:10, marginBottom:18 },
  sectionNum: { width:26, height:26, borderRadius:"50%", background:"#2563eb", color:"#fff", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  sectionTitle: { fontSize:14, fontWeight:700, color:"#2d3748", letterSpacing:"0.01em" },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
  grid3: { display:"grid", gridTemplateColumns:"0.6fr 1fr 1fr", gap:16 },
  field: { marginBottom:14 },
  label: { display:"block", fontSize:13, fontWeight:600, color:"#4a5568", marginBottom:5 },
  req: { color:"#e53e3e", marginLeft:3 },
  inputWrap: {},
  hint: { fontSize:11, color:"#a0aec0", marginTop:4, lineHeight:1.4 },
  errMsg: { fontSize:12, color:"#c53030", marginTop:4 },
  eye: { position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:15, padding:2 },
  prefix: { position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#718096", fontWeight:500, pointerEvents:"none" },
  actions: { display:"flex", alignItems:"center", gap:20, marginTop:8 },
  registerBtn: { padding:"12px 36px", background:"#2563eb", color:"#fff", border:"none", borderRadius:9, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:"-0.01em" },
  loginHint: { fontSize:14, color:"#718096", margin:0 },
  loginLink: { color:"#2563eb", fontWeight:600, textDecoration:"none" },
  footer: { textAlign:"center", padding:"14px 0", fontSize:12, color:"#a0aec0", background:"#2d3748", color:"#cbd5e0", marginTop:"auto" },
  successPage: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40 },
  successIcon: { width:64, height:64, borderRadius:"50%", background:"#f0fdf4", border:"2px solid #86efac", color:"#16a34a", fontSize:28, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 },
  successTitle: { fontSize:22, fontWeight:800, color:"#1a202c", margin:"0 0 8px", letterSpacing:"-0.02em" },
  successSub: { fontSize:14, color:"#718096", margin:"0 0 24px", textAlign:"center" },
  successBtn: { padding:"12px 28px", background:"#2563eb", color:"#fff", border:"none", borderRadius:9, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" },
};