import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const WORKSHOP = {
  title: "Python for Engineers",
  date: "Jun 12–14, 2025",
  time: "10:00 AM – 4:00 PM IST",
  mode: "Online (Zoom)",
  instructor: "Prof. Anil Kumar",
};

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Electronics & Communication",
  "Information Technology",
  "Other",
];

const DEGREES = ["B.Tech", "B.E.", "M.Tech", "M.E.", "MCA", "M.Sc", "PhD", "Other"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year+"];

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(step, form) {
  const errs = {};
  if (step === 1) {
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\s/g, "")))
      errs.mobile = "Enter a valid 10-digit Indian mobile number";
  }
  if (step === 2) {
    if (!form.institution.trim()) errs.institution = "Required";
    if (!form.department) errs.department = "Select a department";
    if (!form.degree) errs.degree = "Select your degree";
    if (!form.year) errs.year = "Select your year";
    if (!form.agreed) errs.agreed = "Please accept to continue";
  }
  return errs;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div style={s.stepDots} aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            ...s.dot,
            background: i < current ? "#2563eb" : i === current - 1 ? "#2563eb" : "#e5e7eb",
            width: i === current - 1 ? 20 : 8,
          }}
        />
      ))}
    </div>
  );
}

function Field({ label, error, required, children }) {
  return (
    <div style={s.field}>
      <label style={s.label}>
        {label}
        {required && <span style={s.req}>*</span>}
      </label>
      {children}
      {error && <div style={s.errorMsg}>{error}</div>}
    </div>
  );
}

function Input({ error, ...props }) {
  return (
    <input
      style={{ ...s.input, ...(error ? s.inputError : {}) }}
      {...props}
    />
  );
}

function Select({ error, children, ...props }) {
  return (
    <select style={{ ...s.input, ...(error ? s.inputError : {}) }} {...props}>
      {children}
    </select>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <div style={s.summaryRow}>
      <span style={s.summaryLabel}>{label}</span>
      <span style={{ ...s.summaryValue, fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  );
}

// ─── Step 1: Personal info ─────────────────────────────────────────────────
function StepPersonal({ form, setForm, errors }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div>
      <div style={s.sectionLabel}>Personal information</div>
      <div style={s.row}>
        <Field label="First name" error={errors.firstName} required>
          <Input
            type="text"
            placeholder="Arun"
            value={form.firstName}
            onChange={set("firstName")}
            error={errors.firstName}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Last name" error={errors.lastName} required>
          <Input
            type="text"
            placeholder="Kumar"
            value={form.lastName}
            onChange={set("lastName")}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </Field>
      </div>
      <Field label="Email address" error={errors.email} required>
        <Input
          type="email"
          placeholder="arun@college.edu"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
        />
      </Field>
      <Field label="Mobile number" error={errors.mobile} required>
        <div style={{ position: "relative" }}>
          <span style={s.prefix}>+91</span>
          <input
            type="tel"
            placeholder="98765 43210"
            value={form.mobile}
            onChange={set("mobile")}
            autoComplete="tel"
            maxLength={10}
            style={{
              ...s.input,
              paddingLeft: 44,
              ...(errors.mobile ? s.inputError : {}),
            }}
          />
        </div>
        {errors.mobile && <div style={s.errorMsg}>{errors.mobile}</div>}
      </Field>
    </div>
  );
}

// ─── Step 2: Academic details ─────────────────────────────────────────────
function StepAcademic({ form, setForm, errors }) {
  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  return (
    <div>
      <div style={s.sectionLabel}>Academic details</div>
      <Field label="Institution / College" error={errors.institution} required>
        <Input
          type="text"
          placeholder="IIT Bombay"
          value={form.institution}
          onChange={set("institution")}
          error={errors.institution}
          autoComplete="organization"
        />
      </Field>
      <Field label="Department" error={errors.department} required>
        <Select value={form.department} onChange={set("department")} error={errors.department}>
          <option value="">Select department</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </Select>
      </Field>
      <div style={s.row}>
        <Field label="Degree" error={errors.degree} required>
          <Select value={form.degree} onChange={set("degree")} error={errors.degree}>
            <option value="">Degree</option>
            {DEGREES.map((d) => <option key={d}>{d}</option>)}
          </Select>
        </Field>
        <Field label="Year" error={errors.year} required>
          <Select value={form.year} onChange={set("year")} error={errors.year}>
            <option value="">Year</option>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </Select>
        </Field>
      </div>

      {/* Summary */}
      <div style={s.summaryBox}>
        <div style={s.summaryTitle}>Booking summary</div>
        <SummaryRow label="Workshop" value={WORKSHOP.title} />
        <SummaryRow label="Date" value={WORKSHOP.date} />
        <SummaryRow label="Mode" value={WORKSHOP.mode} />
        <SummaryRow label="Instructor" value={WORKSHOP.instructor} />
        <div style={s.summaryDivider} />
        <SummaryRow label="Registration fee" value="Free" bold />
      </div>

      {/* Consent */}
      <label style={s.checkLabel}>
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={set("agreed")}
          style={s.checkbox}
        />
        <span style={s.checkText}>
          I agree to the{" "}
          <a href="#" style={s.link}>terms & conditions</a>{" "}
          and confirm that my details are correct.
        </span>
      </label>
      {errors.agreed && <div style={{ ...s.errorMsg, marginTop: -6, marginBottom: 8 }}>{errors.agreed}</div>}
    </div>
  );
}

// ─── Confirmation screen ──────────────────────────────────────────────────
function Confirmation({ form, onDone }) {
  return (
    <div style={s.confirmPage}>
      <div style={s.confirmIconWrap}>
        <div style={s.confirmIcon}>✓</div>
      </div>
      <h2 style={s.confirmTitle}>You're registered!</h2>
      <p style={s.confirmSub}>
        A confirmation email has been sent to{" "}
        <strong>{form.email}</strong>.
      </p>

      <div style={s.confirmCard}>
        <SummaryRow label="Name" value={`${form.firstName} ${form.lastName}`} />
        <SummaryRow label="Workshop" value={WORKSHOP.title} />
        <SummaryRow label="Date" value={WORKSHOP.date} />
        <SummaryRow label="Mode" value={WORKSHOP.mode} />
        <div style={s.summaryDivider} />
        <SummaryRow label="Fee paid" value="₹0 — Free" bold />
      </div>

      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: "0 0 20px" }}>
        You'll receive joining instructions 24 hours before the workshop. Add it to your calendar so you don't miss it.
      </p>

      <button style={s.ctaBtn} onClick={onDone}>
        Browse more workshops →
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const EMPTY = {
  firstName: "", lastName: "", email: "", mobile: "",
  institution: "", department: "", degree: "", year: "",
  agreed: false,
};

export default function BookingForm({ onBack, onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const TOTAL_STEPS = 2;

  function next() {
    const errs = validate(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    if (step === 1) { onBack?.(); return; }
    setStep((s) => s - 1);
    setErrors({});
  }

  async function submit() {
    const errs = validate(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) return <Confirmation form={form} onDone={onDone} />;

  return (
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <button style={s.backBtn} onClick={back} aria-label="Go back">
          ← {step === 1 ? "Back" : "Step 1"}
        </button>
        <span style={s.headerTitle}>Register</span>
        <span style={s.stepLabel}>Step {step} of {TOTAL_STEPS}</span>
      </header>

      {/* Workshop pill */}
      <div style={s.workshopPill}>
        <span style={s.workshopPillIcon}>🎓</span>
        <div>
          <div style={s.workshopPillTitle}>{WORKSHOP.title}</div>
          <div style={s.workshopPillMeta}>{WORKSHOP.date} · Free</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={s.progressTrack}>
        <div style={{ ...s.progressFill, width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* Step dots */}
      <div style={{ padding: "14px 16px 0" }}>
        <StepDots current={step} total={TOTAL_STEPS} />
      </div>

      {/* Form body */}
      <div style={s.formBody}>
        {step === 1 && <StepPersonal form={form} setForm={setForm} errors={errors} />}
        {step === 2 && <StepAcademic form={form} setForm={setForm} errors={errors} />}
      </div>

      {/* CTA */}
      <div style={s.ctaWrap}>
        {step < TOTAL_STEPS ? (
          <button style={s.ctaBtn} onClick={next} aria-label="Continue to next step">
            Continue →
          </button>
        ) : (
          <button
            style={{ ...s.ctaBtn, ...(loading ? s.ctaBtnLoading : {}) }}
            onClick={submit}
            disabled={loading}
            aria-label="Confirm registration"
          >
            {loading ? (
              <span style={s.spinner} />
            ) : (
              "Confirm registration →"
            )}
          </button>
        )}
        <p style={s.secureNote}>
          🔒 Your data is secure and will only be used for this workshop registration.
        </p>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    maxWidth: 480,
    margin: "0 auto",
    paddingBottom: 40,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
  },
  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "#2563eb",
    fontFamily: "inherit",
    fontWeight: 500,
    padding: "4px 0",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
  },
  stepLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: 500,
  },
  workshopPill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "12px 16px",
    padding: "10px 12px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: 10,
  },
  workshopPillIcon: { fontSize: 18 },
  workshopPillTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1e40af",
  },
  workshopPillMeta: {
    fontSize: 11,
    color: "#3b82f6",
    marginTop: 1,
  },
  progressTrack: {
    height: 3,
    background: "#e5e7eb",
    margin: "0 16px",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#2563eb",
    borderRadius: 99,
    transition: "width .4s ease",
  },
  stepDots: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    height: 8,
    borderRadius: 99,
    transition: "all .3s ease",
  },
  formBody: {
    padding: "16px 16px 0",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 14,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 5,
  },
  req: {
    color: "#ef4444",
    marginLeft: 3,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    color: "#111827",
    background: "#ffffff",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .15s",
  },
  inputError: {
    borderColor: "#ef4444",
    background: "#fff5f5",
  },
  errorMsg: {
    fontSize: 12,
    color: "#dc2626",
    marginTop: 4,
  },
  prefix: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 14,
    color: "#6b7280",
    fontWeight: 500,
    pointerEvents: "none",
  },
  summaryBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 10,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6b7280",
    flexShrink: 0,
  },
  summaryValue: {
    fontSize: 13,
    color: "#111827",
    textAlign: "right",
  },
  summaryDivider: {
    height: 1,
    background: "#e5e7eb",
    margin: "8px 0",
  },
  checkLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    cursor: "pointer",
    marginBottom: 14,
  },
  checkbox: {
    width: 16,
    height: 16,
    marginTop: 2,
    flexShrink: 0,
    accentColor: "#2563eb",
    cursor: "pointer",
  },
  checkText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 1.5,
  },
  link: {
    color: "#2563eb",
    textDecoration: "underline",
  },
  ctaWrap: {
    padding: "16px 16px 0",
  },
  ctaBtn: {
    width: "100%",
    padding: "13px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "-0.01em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    transition: "background .15s, opacity .15s",
  },
  ctaBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTop: "2.5px solid #ffffff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  secureNote: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 1.5,
  },
  // ── Confirmation ──
  confirmPage: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    maxWidth: 480,
    margin: "0 auto",
    padding: "40px 20px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  confirmIconWrap: {
    marginBottom: 20,
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "#f0fdf4",
    border: "2px solid #86efac",
    color: "#16a34a",
    fontSize: 28,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: "#111827",
    margin: "0 0 8px",
    letterSpacing: "-0.02em",
  },
  confirmSub: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
    margin: "0 0 24px",
  },
  confirmCard: {
    width: "100%",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 16,
    textAlign: "left",
  },
};

// Inject spinner keyframes
const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);