import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Mock data
const workshopData = {
  id: "1",
  title: "Python for Engineers",
  topic: "Python",
  level: "Beginner",
  status: "filling",
  seats: 85,
  totalSeats: 100,
  date: "Jun 12–14, 2026",
  time: "10:00 AM - 4:00 PM",
  mode: "Online",
  duration: "3 days",
  instructor: "Prof. Anil Kumar",
  instructorTitle: "Dept. of Computer Science, IIT Bombay",
  description: "Learn Python fundamentals, data analysis with NumPy/Pandas, and visualization using Matplotlib specifically tailored for engineering applications.",
  prerequisites: ["Basic understanding of programming logic", "A laptop with internet access"],
  outcomes: ["Write functional Python scripts", "Analyze datasets using Pandas", "Generate engineering plots"],
  curriculum: [
    { day: 1, title: "Python Fundamentals & Logic", details: "Variables, loops, functions, and standard libraries." },
    { day: 2, title: "Data Handling with Pandas", details: "Importing CSVs, cleaning data, and dataframe operations." },
    { day: 3, title: "Visualization & Projects", details: "Matplotlib plotting and final mini-project." }
  ]
};

export default function WorkshopDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);
  const [openDay, setOpenDay] = useState(1);

  const fillPct = Math.round((workshopData.seats / workshopData.totalSeats) * 100);
  const isFillingFast = fillPct > 80;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSticky(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      </nav>

      <div ref={heroRef} style={styles.hero}>
        <div style={styles.badgeRow}>
          <span style={styles.topicBadge}>{workshopData.topic}</span>
          <span style={styles.levelBadge}>{workshopData.level}</span>
        </div>
        <h1 style={styles.title}>{workshopData.title}</h1>
        <p style={styles.description}>{workshopData.description}</p>
        <button style={styles.mainCta} onClick={() => <button style={styles.mainCta} onClick={() => navigate(`/book/${workshopData.id}`)}>
  Book free →
</button>}>
          Book free →
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <div style={styles.seatLabel}>
            <span>Seats filled</span>
            <span style={{ color: isFillingFast ? "#d97706" : "#374151", fontWeight: 600 }}>
              {workshopData.seats} / {workshopData.totalSeats}
            </span>
          </div>
          <div style={styles.seatTrack}>
            <div style={{ ...styles.seatFill, width: `${fillPct}%`, background: isFillingFast ? "#f59e0b" : "#3b82f6" }} />
          </div>
          {isFillingFast && <p style={styles.hurryText}>🔥 Filling fast! Only {workshopData.totalSeats - workshopData.seats} seats left.</p>}
        </div>

        <div style={styles.grid}>
          <InfoBox icon="📅" label="Date" value={workshopData.date} />
          <InfoBox icon="⏰" label="Time" value={workshopData.time} />
          <InfoBox icon="📍" label="Mode" value={workshopData.mode} />
          <InfoBox icon="⏱" label="Duration" value={workshopData.duration} />
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Instructor</h3>
          <div style={styles.instructorCard}>
            <div style={styles.avatar}>
              {workshopData.instructor.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p style={styles.instructorName}>{workshopData.instructor}</p>
              <p style={styles.instructorDesc}>{workshopData.instructorTitle}</p>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Curriculum</h3>
          <div style={styles.accordionGroup}>
            {workshopData.curriculum.map((day) => (
              <div key={day.day} style={styles.accordionItem}>
                <button style={styles.accordionBtn} onClick={() => setOpenDay(openDay === day.day ? null : day.day)}>
                  <span style={styles.dayLabel}>Day {day.day}: {day.title}</span>
                  <span>{openDay === day.day ? "−" : "+"}</span>
                </button>
                {openDay === day.day && (
                  <div style={styles.accordionContent}>
                    <p style={{ margin: 0, color: "#4b5563", fontSize: 14 }}>{day.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>What you'll learn</h3>
          <ul style={styles.list}>
            {workshopData.outcomes.map((item, i) => <li key={i}>✓ {item}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ ...styles.stickyBar, transform: showSticky ? "translateY(0)" : "translateY(100%)" }}>
        <div style={styles.stickyContent}>
          <div>
            <p style={styles.stickyPrice}>Free</p>
            <p style={styles.stickyDate}>{workshopData.date}</p>
          </div>
          <button style={styles.stickyBtn} onClick={() => <button style={styles.stickyBtn} onClick={() => navigate(`/book/${workshopData.id}`)}>
  Book Now
</button>}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div style={styles.infoBox}>
      <span style={styles.infoIcon}>{icon}</span>
      <div>
        <p style={styles.infoLabel}>{label}</p>
        <p style={styles.infoValue}>{value}</p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f9fafb", fontFamily: "'DM Sans', sans-serif", maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 100 },
  nav: { padding: "16px", background: "#fff", position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid #e5e7eb" },
  backBtn: { background: "none", border: "none", fontSize: 15, color: "#2563eb", fontWeight: 600, cursor: "pointer" },
  hero: { background: "#fff", padding: "24px 16px", borderBottom: "1px solid #e5e7eb" },
  badgeRow: { display: "flex", gap: 8, marginBottom: 12 },
  topicBadge: { fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },
  levelBadge: { fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 500 },
  title: { fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 12px", lineHeight: 1.2 },
  description: { fontSize: 14, color: "#4b5563", lineHeight: 1.6, margin: "0 0 20px" },
  mainCta: { width: "100%", padding: "14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" },
  content: { padding: "16px" },
  section: { background: "#fff", padding: "20px", borderRadius: 14, border: "1px solid #e5e7eb", marginBottom: 16 },
  seatLabel: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "#6b7280" },
  seatTrack: { height: 6, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" },
  seatFill: { height: "100%", borderRadius: 99, transition: "width 0.4s" },
  hurryText: { fontSize: 12, color: "#d97706", margin: "8px 0 0", fontWeight: 500 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 },
  infoBox: { background: "#fff", padding: "12px", borderRadius: 12, border: "1px solid #e5e7eb", display: "flex", gap: 10, alignItems: "center" },
  infoIcon: { fontSize: 20 },
  infoLabel: { fontSize: 11, color: "#6b7280", margin: 0, textTransform: "uppercase" },
  infoValue: { fontSize: 13, fontWeight: 600, color: "#111827", margin: "2px 0 0" },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" },
  instructorCard: { display: "flex", gap: 12, alignItems: "center" },
  avatar: { width: 44, height: 44, borderRadius: "50%", background: "#dbeafe", color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 },
  instructorName: { fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 },
  instructorDesc: { fontSize: 13, color: "#6b7280", margin: "2px 0 0" },
  accordionGroup: { display: "flex", flexDirection: "column", gap: 8 },
  accordionItem: { border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" },
  accordionBtn: { width: "100%", padding: "12px", background: "#f9fafb", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 600, color: "#374151", cursor: "pointer" },
  dayLabel: { fontSize: 14 },
  accordionContent: { padding: "12px", background: "#fff", borderTop: "1px solid #e5e7eb" },
  list: { paddingLeft: 0, listStyle: "none", margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#374151" },
  stickyBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #e5e7eb", padding: "16px", zIndex: 50, transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.05)" },
  stickyContent: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  stickyPrice: { margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" },
  stickyDate: { margin: 0, fontSize: 12, color: "#6b7280" },
  stickyBtn: { padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: "pointer" }
};