import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const workshops = [
  {
    id: "1",
    title: "Python for Engineers",
    topic: "Python",
    date: "Jun 12–14, 2026",
    duration: "3 days",
    mode: "Online",
    fee: "Free",
    seats: 68,
    totalSeats: 100,
    status: "open",
    instructor: "Prof. Anil Kumar",
    level: "Beginner",
    description: "Learn Python fundamentals, data analysis with NumPy/Pandas, and visualisation using Matplotlib.",
  },
  {
    id: "2",
    title: "Scilab Basics",
    topic: "Scilab",
    date: "Jun 20, 2026",
    duration: "1 day",
    mode: "In-person · IIT Bombay",
    fee: "Free",
    seats: 92,
    totalSeats: 100,
    status: "filling",
    instructor: "Prof. Meenal Srivastava",
    level: "Beginner",
    description: "Introduction to Scilab for numerical computation and simulation, with hands-on exercises.",
  },
  {
    id: "3",
    title: "OpenFOAM for CFD",
    topic: "OpenFOAM",
    date: "Jul 3–4, 2026",
    duration: "2 days",
    mode: "Online",
    fee: "Free",
    seats: 30,
    totalSeats: 80,
    status: "open",
    instructor: "Prof. Ketan Chaudhari",
    level: "Intermediate",
    description: "Hands-on CFD simulation workshop covering meshing, boundary conditions, and post-processing.",
  },
  {
    id: "4",
    title: "OSDAG: Steel Design",
    topic: "OSDAG",
    date: "Jul 10, 2026",
    duration: "1 day",
    mode: "In-person · IIT Bombay",
    fee: "Free",
    seats: 55,
    totalSeats: 60,
    status: "filling",
    instructor: "Prof. Siddhartha Ghosh",
    level: "Intermediate",
    description: "Design steel connections and structures using the open-source OSDAG software.",
  },
  {
    id: "5",
    title: "Advanced Python: Django & APIs",
    topic: "Python",
    date: "Jul 18–19, 2026",
    duration: "2 days",
    mode: "Online",
    fee: "Free",
    seats: 10,
    totalSeats: 80,
    status: "open",
    instructor: "Prof. Anil Kumar",
    level: "Advanced",
    description: "Build REST APIs and web applications using Django. Requires prior Python knowledge.",
  },
];

const topics = ["All", "Python", "Scilab", "OpenFOAM", "OSDAG"];
const modes = ["All modes", "Online", "In-person"];

const statusMap = {
  open: { label: "Open", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  filling: { label: "Filling fast", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
};

const levelColor = {
  Beginner: { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  Intermediate: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  Advanced: { color: "#be123c", bg: "#fff1f2", border: "#fecdd3" },
};

export default function WorkshopHome() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState("All");
  const [activeMode, setActiveMode] = useState("All modes");
  const [selected, setSelected] = useState(null);

  const filtered = workshops.filter((w) => {
    const matchTopic = activeTopic === "All" || w.topic === activeTopic;
    const matchMode =
      activeMode === "All modes" ||
      (activeMode === "Online" && w.mode.includes("Online")) ||
      (activeMode === "In-person" && w.mode.includes("In-person"));
    const matchSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.topic.toLowerCase().includes(search.toLowerCase());
    return matchTopic && matchMode && matchSearch;
  });

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.logoTag}>IIT Bombay</div>
            <div style={styles.logo}>FOSSEE Workshops</div>
          </div>
          <button style={styles.hamburger} aria-label="Menu">
            <span style={styles.hLine} />
            <span style={styles.hLine} />
            <span style={styles.hLine} />
          </button>
        </div>
      </header>

      {/* Hero strip */}
      <div style={styles.hero}>
        <p style={styles.heroText}>
          Free, open-source software workshops for students across India — powered by IIT Bombay.
        </p>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <div style={styles.searchBox}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            style={styles.searchInput}
            placeholder="Search workshops…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search workshops"
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch("")} aria-label="Clear search">✕</button>
          )}
        </div>
      </div>

      {/* Topic filter chips */}
      <div style={styles.chipsRow}>
        {topics.map((t) => (
          <button
            key={t}
            style={{ ...styles.chip, ...(activeTopic === t ? styles.chipActive : {}) }}
            onClick={() => setActiveTopic(t)}
          >
            {t}
          </button>
        ))}
        <div style={styles.chipDivider} />
        {modes.map((m) => (
          <button
            key={m}
            style={{ ...styles.chip, ...(activeMode === m ? styles.chipActiveSecondary : {}) }}
            onClick={() => setActiveMode(m)}
          >
            {m === "Online" ? "🌐 " : m === "In-person" ? "📍 " : ""}{m}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={styles.resultCount}>
        {filtered.length} workshop{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* Cards */}
      <div style={styles.cardList}>
        {filtered.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>No workshops found</div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Try a different topic or search term.</div>
          </div>
        )}
        {filtered.map((w) => {
          const st = statusMap[w.status];
          const lv = levelColor[w.level];
          const fillPct = Math.round((w.seats / w.totalSeats) * 100);
          const isSelected = selected === w.id;

          return (
            <div key={w.id} style={{ ...styles.card, ...(isSelected ? styles.cardSelected : {}) }}>
              <div style={styles.cardTop}>
                <div style={styles.topicPill}>{w.topic}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ ...styles.badge, background: lv.bg, color: lv.color, border: `1px solid ${lv.border}` }}>
                    {w.level}
                  </span>
                  <span style={{ ...styles.badge, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                    {st.label}
                  </span>
                </div>
              </div>

              <h2 style={styles.cardTitle}>{w.title}</h2>
              <p style={styles.cardDesc}>{w.description}</p>

              <div style={styles.metaGrid}>
                <MetaItem icon="📅" label={w.date} />
                <MetaItem icon="⏱" label={w.duration} />
                <MetaItem icon="📍" label={w.mode} />
                <MetaItem icon="👤" label={w.instructor} />
              </div>

              <div style={styles.seatSection}>
                <div style={styles.seatLabel}>
                  <span style={{ color: "#6b7280", fontSize: 12 }}>Seats filled</span>
                  <span style={{ color: w.status === "filling" ? "#d97706" : "#374151", fontSize: 12, fontWeight: 500 }}>
                    {w.seats} / {w.totalSeats}
                  </span>
                </div>
                <div style={styles.seatTrack}>
                  <div style={{ ...styles.seatFill, width: `${fillPct}%`, background: w.status === "filling" ? "#f59e0b" : "#3b82f6" }} />
                </div>
              </div>

              <button
                style={styles.cta}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
                onClick={() => setSelected(isSelected ? null : w.id)}
              >
                {isSelected ? "Selected ✓" : "Register — Free →"}
              </button>

              {isSelected && (
                <div style={styles.confirmBox}>
                  <p style={{ margin: 0, fontSize: 13, color: "#1e40af" }}>
                    ✓ Ready to book <strong>{w.title}</strong>. Click below to view details.
                  </p>
                  <button style={styles.confirmBtn} onClick={() => navigate(`/workshop/${w.id}`)}>
                    Continue to details →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <nav style={styles.bottomNav} aria-label="Main navigation">
        <NavItem icon="⊞" label="Explore" active />
        <NavItem icon="📋" label="My bookings" />
        <NavItem icon="👤" label="Profile" />
      </nav>
    </div>
  );
}

function MetaItem({ icon, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#4b5563" }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button style={{ ...styles.navItem, color: active ? "#2563eb" : "#6b7280" }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 11 }}>{label}</span>
    </button>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f9fafb", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", paddingBottom: 72, maxWidth: 480, margin: "0 auto", position: "relative" },
  header: { background: "#ffffff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 50 },
  headerInner: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px" },
  logoTag: { fontSize: 10, color: "#2563eb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 },
  logo: { fontSize: 17, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" },
  hamburger: { display: "flex", flexDirection: "column", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 6 },
  hLine: { display: "block", width: 22, height: 2, background: "#374151", borderRadius: 2 },
  hero: { background: "#eff6ff", borderBottom: "1px solid #dbeafe", padding: "12px 16px" },
  heroText: { fontSize: 13, color: "#1e40af", lineHeight: 1.6, margin: 0 },
  searchWrap: { padding: "12px 16px 0" },
  searchBox: { display: "flex", alignItems: "center", gap: 8, background: "#ffffff", border: "1px solid #d1d5db", borderRadius: 10, padding: "9px 12px" },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 14, color: "#111827", background: "transparent" },
  clearBtn: { background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 0, lineHeight: 1 },
  chipsRow: { display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto", scrollbarWidth: "none", alignItems: "center" },
  chip: { padding: "5px 12px", border: "1px solid #e5e7eb", borderRadius: 20, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", background: "#ffffff", color: "#374151", fontFamily: "inherit", transition: "all .15s" },
  chipActive: { background: "#2563eb", color: "#ffffff", border: "1px solid #2563eb", fontWeight: 600 },
  chipActiveSecondary: { background: "#111827", color: "#ffffff", border: "1px solid #111827" },
  chipDivider: { width: 1, height: 20, background: "#e5e7eb", flexShrink: 0, margin: "0 2px" },
  resultCount: { fontSize: 12, color: "#6b7280", padding: "0 16px 8px" },
  cardList: { padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 },
  card: { background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "14px", transition: "box-shadow .15s, border-color .15s" },
  cardSelected: { border: "1.5px solid #2563eb" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  topicPill: { fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" },
  badge: { fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 500 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 5px", lineHeight: 1.4, letterSpacing: "-0.01em" },
  cardDesc: { fontSize: 13, color: "#6b7280", lineHeight: 1.55, margin: "0 0 10px" },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 10px", marginBottom: 12 },
  seatSection: { marginBottom: 12 },
  seatLabel: { display: "flex", justifyContent: "space-between", marginBottom: 5 },
  seatTrack: { height: 5, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" },
  seatFill: { height: "100%", borderRadius: 99, transition: "width .4s ease" },
  cta: { width: "100%", padding: "11px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background .15s", letterSpacing: "-0.01em" },
  confirmBox: { marginTop: 10, padding: "10px 12px", background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe" },
  confirmBtn: { marginTop: 8, width: "100%", padding: "8px", background: "#1e40af", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  empty: { textAlign: "center", padding: "40px 20px", color: "#374151", fontSize: 15 },
  bottomNav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, display: "flex", justifyContent: "space-around", background: "#ffffff", borderTop: "1px solid #e5e7eb", padding: "8px 0 12px", zIndex: 50 },
  navItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "4px 20px" },
};