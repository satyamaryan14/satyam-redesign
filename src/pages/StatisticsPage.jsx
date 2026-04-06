import { useState, useRef, useEffect } from "react";
import { useResponsive, tokens, navbarStyles, inputStyle, primaryBtn } from "../hooks/useResponsive";

// ── Sample data ───────────────────────────────────────────────────────────────
const SAMPLE_DATA = [
  { id:1, coordinator:"Priya Sharma",  institute:"IIT Bombay",      instructor:"Prof. Anil Kumar",   workshop:"Python for Engineers", date:"2025-03-10", state:"Maharashtra" },
  { id:2, coordinator:"Rahul Mehta",   institute:"NIT Warangal",    instructor:"Prof. Suresh Babu",  workshop:"Scilab Basics",        date:"2025-03-22", state:"Telangana"   },
  { id:3, coordinator:"Ananya Singh",  institute:"BITS Pilani",     instructor:"Prof. Kavita Joshi", workshop:"OpenFOAM CFD",         date:"2025-04-01", state:"Rajasthan"   },
  { id:4, coordinator:"Vikram Patel",  institute:"IIT Madras",      instructor:"Prof. Ramesh Iyer",  workshop:"OSDAG Steel Design",   date:"2025-04-14", state:"Tamil Nadu"  },
  { id:5, coordinator:"Sneha Reddy",   institute:"JNTU Hyderabad",  instructor:"Prof. Suresh Babu",  workshop:"Python for Engineers", date:"2025-04-20", state:"Telangana"   },
  { id:6, coordinator:"Arjun Nair",    institute:"NIT Calicut",     instructor:"Prof. Meenal S.",    workshop:"Scilab Basics",        date:"2025-05-02", state:"Kerala"      },
  { id:7, coordinator:"Divya Verma",   institute:"IIT Delhi",       instructor:"Prof. Anil Kumar",   workshop:"Python for Engineers", date:"2025-05-15", state:"Delhi"       },
  { id:8, coordinator:"Karthik Rajan", institute:"Anna University", instructor:"Prof. Ramesh Iyer",  workshop:"OSDAG Steel Design",   date:"2025-05-28", state:"Tamil Nadu"  },
];

const WORKSHOPS = [...new Set(SAMPLE_DATA.map(d => d.workshop))];
const STATES    = [...new Set(SAMPLE_DATA.map(d => d.state))];

// ── Bar chart (canvas) ─────────────────────────────────────────────────────
function BarChart({ data, type, onClose, isMobile }) {
  const canvasRef = useRef(null);

  const counts = {};
  data.forEach(row => {
    const key = type === "state" ? row.state : row.workshop;
    counts[key] = (counts[key] || 0) + 1;
  });
  const labels = Object.keys(counts);
  const values = Object.values(counts);
  const maxVal = Math.max(...values, 1);
  const colors = ["#2563eb","#0891b2","#7c3aed","#059669","#d97706","#dc2626","#db2777"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = { top: 30, right: 16, bottom: isMobile ? 70 : 55, left: 44 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const barW = Math.min(44, Math.floor(chartW / labels.length) - 10);

    ctx.clearRect(0, 0, W, H);

    // Grid
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + chartH - (i / 4) * chartH;
      ctx.beginPath();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px DM Sans, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.round((i / 4) * maxVal), pad.left - 5, y + 4);
    }

    // Bars
    labels.forEach((label, i) => {
      const slotW = chartW / labels.length;
      const x = pad.left + i * slotW + (slotW - barW) / 2;
      const barH = (values[i] / maxVal) * chartH;
      const y = pad.top + chartH - barH;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      else ctx.rect(x, y, barW, barH);
      ctx.fill();

      // Value
      ctx.fillStyle = "#1a202c";
      ctx.font = "bold 11px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(values[i], x + barW / 2, y - 5);

      // X label (rotated on mobile for long labels)
      ctx.save();
      ctx.fillStyle = "#4a5568";
      ctx.font = "10px DM Sans, sans-serif";
      const cx = x + barW / 2;
      const labelY = pad.top + chartH + (isMobile ? 12 : 14);
      if (isMobile && label.length > 8) {
        ctx.translate(cx, labelY);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = "right";
        ctx.fillText(label, 0, 0);
      } else {
        const short = label.length > 12 ? label.slice(0, 11) + "…" : label;
        ctx.textAlign = "center";
        ctx.fillText(short, cx, labelY);
      }
      ctx.restore();
    });

    // X axis line
    ctx.beginPath();
    ctx.strokeStyle = "#cbd5e0";
    ctx.lineWidth = 1.5;
    ctx.moveTo(pad.left, pad.top + chartH);
    ctx.lineTo(W - pad.right, pad.top + chartH);
    ctx.stroke();
  }, [data, type, isMobile]);

  const canvasW = isMobile ? Math.min(window.innerWidth - 64, 360) : 580;
  const canvasH = isMobile ? 260 : 300;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:14, border:`1px solid ${tokens.gray200}`, width:"100%", maxWidth: isMobile ? "100%" : 660, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding: isMobile ? "14px 16px" : "16px 20px", borderBottom:`1px solid ${tokens.gray200}` }}>
          <h2 style={{ fontSize: isMobile ? 14 : 16, fontWeight:700, color:tokens.gray900, margin:0 }}>
            {type === "state" ? "State wise workshops" : "Workshops chart"}
          </h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:tokens.gray600, padding:4, lineHeight:1 }} aria-label="Close">✕</button>
        </div>
        <div style={{ padding: isMobile ? "12px 16px 16px" : 20, overflowX:"auto" }}>
          {data.length === 0
            ? <div style={{ textAlign:"center", padding:"40px 0", color:tokens.gray500, fontSize:14 }}>No data for selected filters.</div>
            : <canvas ref={canvasRef} width={canvasW} height={canvasH} style={{ width:"100%", height:"auto", display:"block" }} />
          }
        </div>
      </div>
    </div>
  );
}

// ── Filter panel (used in sidebar on desktop, drawer on mobile) ───────────────
function FilterPanel({ filters, setFilters, onView, onDownload, hasResults, isMobile, onClose }) {
  const setF = (k) => (e) => setFilters(f => ({ ...f, [k]: e.target.value }));

  const labelStyle = { display:"block", fontSize:11, fontWeight:700, color:tokens.gray700, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" };
  const groupStyle = { marginBottom:14 };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h2 style={{ fontSize:16, fontWeight:800, color:tokens.gray900, margin:0 }}>Filters</h2>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button
            style={{ fontSize:12, color:tokens.red, background:"#fff5f5", border:`1px solid #feb2b2`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontFamily:tokens.font, fontWeight:600 }}
            onClick={() => setFilters({ fromDate:"", toDate:"", workshop:"", state:"", sortBy:"oldest" })}
          >✕ Clear</button>
          {isMobile && (
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:tokens.gray600, padding:2, lineHeight:1 }} aria-label="Close filters">✕</button>
          )}
        </div>
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>From date</label>
        <input style={inputStyle()} type="date" value={filters.fromDate} onChange={setF("fromDate")} />
      </div>
      <div style={groupStyle}>
        <label style={labelStyle}>To date</label>
        <input style={inputStyle()} type="date" value={filters.toDate} onChange={setF("toDate")} />
      </div>
      <div style={groupStyle}>
        <label style={labelStyle}>Workshop</label>
        <select style={inputStyle()} value={filters.workshop} onChange={setF("workshop")}>
          <option value="">All workshops</option>
          {WORKSHOPS.map(w => <option key={w}>{w}</option>)}
        </select>
      </div>
      <div style={groupStyle}>
        <label style={labelStyle}>State</label>
        <select style={inputStyle()} value={filters.state} onChange={setF("state")}>
          <option value="">All states</option>
          {STATES.map(st => <option key={st}>{st}</option>)}
        </select>
      </div>
      <div style={groupStyle}>
        <label style={labelStyle}>Sort by</label>
        <select style={inputStyle()} value={filters.sortBy} onChange={setF("sortBy")}>
          <option value="oldest">Oldest first</option>
          <option value="newest">Newest first</option>
        </select>
      </div>

      <div style={{ display:"flex", gap:10, marginTop:"auto", paddingTop:16 }}>
        <button
          style={{ flex:1, padding:"11px 0", background:"#16a34a", color:"#fff", border:"none", borderRadius:tokens.radius.md, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:tokens.font, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
          onClick={() => { onView(); onClose?.(); }}
        >👁 View</button>
        <button
          style={{ flex:1, padding:"11px 0", background:tokens.blue, color:"#fff", border:"none", borderRadius:tokens.radius.md, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:tokens.font, display:"flex", alignItems:"center", justifyContent:"center", gap:6, opacity: hasResults ? 1 : 0.5 }}
          onClick={onDownload}
          disabled={!hasResults}
        >⬇ Download</button>
      </div>
    </div>
  );
}

// ── Mobile card view for table data ──────────────────────────────────────────
function MobileCards({ data, pageStart }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {data.map((row, i) => (
        <div key={row.id} style={{ background:"#fff", border:`1px solid ${tokens.gray200}`, borderRadius:tokens.radius.lg, padding:"12px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <div style={{ fontSize:11, fontWeight:700, color:tokens.gray500, letterSpacing:"0.04em" }}>#{pageStart + i + 1}</div>
            <span style={{ background:tokens.blueLight, color:"#1d4ed8", border:`1px solid ${tokens.blueBorder}`, borderRadius:5, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
              {row.workshop}
            </span>
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:tokens.gray900, marginBottom:6 }}>{row.coordinator}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 10px" }}>
            {[
              ["Institute", row.institute],
              ["Instructor", row.instructor],
              ["Date", row.date],
              ["State", row.state],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize:10, color:tokens.gray500, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>{label}</div>
                <div style={{ fontSize:12, color:tokens.gray800, fontWeight:500, marginTop:1 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StatisticsPage() {
  const { isMobile, isTablet } = useResponsive();
  const nav = navbarStyles(isMobile);

  const [filters, setFilters] = useState({ fromDate:"", toDate:"", workshop:"", state:"", sortBy:"oldest" });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [chart, setChart] = useState(null);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const PER_PAGE = isMobile ? 4 : 5;

  function applyFilters() {
    let data = [...SAMPLE_DATA];
    if (filters.fromDate) data = data.filter(d => d.date >= filters.fromDate);
    if (filters.toDate)   data = data.filter(d => d.date <= filters.toDate);
    if (filters.workshop) data = data.filter(d => d.workshop === filters.workshop);
    if (filters.state)    data = data.filter(d => d.state === filters.state);
    data.sort((a, b) => filters.sortBy === "newest"
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date));
    setResults(data);
    setSearched(true);
    setPage(1);
  }

  function downloadCSV() {
    const header = "Sr No,Coordinator Name,Institute Name,Instructor Name,Workshop Name,Workshop Date,State";
    const rows = results.map((r, i) =>
      [i+1, r.coordinator, r.institute, r.instructor, r.workshop, r.date, r.state].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type:"text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "fossee_workshops.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const pageData   = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ minHeight:"100vh", background:tokens.gray100, fontFamily:tokens.font, display:"flex", flexDirection:"column" }}>

      {/* Navbar */}
      <header style={nav.navbar}>
        <div style={nav.navInner}>
          <span style={nav.navLogo}>FOSSEE Workshops</span>
          <nav style={nav.navLinks}>
            <a href="#" style={{ ...nav.navLink, color:"#fff", fontWeight:700 }}>Home</a>
            {!isMobile && <a href="#" style={nav.navLink}>Workshop Statistics</a>}
          </nav>
        </div>
      </header>

      {/* Mobile filter drawer */}
      {isMobile && drawerOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:200 }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }} onClick={() => setDrawerOpen(false)} />
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"85%", maxWidth:320, background:"#fff", padding:"20px 18px", display:"flex", flexDirection:"column", overflowY:"auto" }}>
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onView={applyFilters}
              onDownload={downloadCSV}
              hasResults={results.length > 0}
              isMobile={true}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      <main style={{ flex:1, padding: isMobile ? "16px 12px 40px" : "24px 16px 40px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>

          {isMobile ? (
            // ── Mobile layout ──────────────────────────────────────────────
            <>
              {/* Mobile top bar */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <button
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 14px", background:"#fff", border:`1px solid ${tokens.gray200}`, borderRadius:tokens.radius.md, fontSize:13, fontWeight:600, color:tokens.gray800, cursor:"pointer", fontFamily:tokens.font }}
                  onClick={() => setDrawerOpen(true)}
                >
                  <span>☰</span> Filters
                </button>
                <div style={{ display:"flex", gap:8 }}>
                  <button
                    style={{ padding:"9px 12px", background:"#0891b2", color:"#fff", border:"none", borderRadius:tokens.radius.md, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:tokens.font, opacity: results.length ? 1 : 0.5 }}
                    onClick={() => setChart("state")} disabled={!results.length}
                  >📊 State</button>
                  <button
                    style={{ padding:"9px 12px", background:"#0891b2", color:"#fff", border:"none", borderRadius:tokens.radius.md, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:tokens.font, opacity: results.length ? 1 : 0.5 }}
                    onClick={() => setChart("workshop")} disabled={!results.length}
                  >📊 Workshops</button>
                </div>
              </div>

              {/* Results */}
              {searched && results.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 20px", color:tokens.gray500, fontSize:14 }}>No records match the selected filters.</div>
              ) : !searched ? (
                <div style={{ textAlign:"center", padding:"40px 20px", color:tokens.gray500, fontSize:14 }}>Tap Filters and click View to see results.</div>
              ) : (
                <>
                  <MobileCards data={pageData} pageStart={(page-1)*PER_PAGE} />
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:16 }}>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i} onClick={() => setPage(i+1)} style={{ width:36, height:36, borderRadius:8, border:`1px solid ${tokens.gray200}`, background: page===i+1 ? tokens.blue : "#fff", color: page===i+1 ? "#fff" : tokens.gray700, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:tokens.font }}>{i+1}</button>
                      ))}
                    </div>
                  )}
                  <div style={{ textAlign:"center", fontSize:12, color:tokens.gray500, marginTop:10 }}>{results.length} record{results.length !== 1 ? "s" : ""}</div>
                </>
              )}
            </>
          ) : (
            // ── Desktop layout ─────────────────────────────────────────────
            <div style={{ display:"grid", gridTemplateColumns: isTablet ? "240px 1fr" : "280px 1fr", gap:20, alignItems:"start" }}>
              {/* Sidebar */}
              <aside style={{ background:"#fff", border:`1px solid ${tokens.gray200}`, borderRadius:tokens.radius.lg, padding:"18px 20px", position:"sticky", top:20, minHeight:200 }}>
                <FilterPanel
                  filters={filters}
                  setFilters={setFilters}
                  onView={applyFilters}
                  onDownload={downloadCSV}
                  hasResults={results.length > 0}
                  isMobile={false}
                />
              </aside>

              {/* Content */}
              <section style={{ minWidth:0 }}>
                {/* Top bar */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", gap:6 }}>
                    {(searched ? Array.from({ length: totalPages }, (_, i) => i+1) : [1]).map(n => (
                      <button key={n} onClick={() => setPage(n)} style={{ width:34, height:34, borderRadius:7, border:`1px solid ${tokens.gray200}`, background: page===n ? tokens.blue : "#fff", color: page===n ? "#fff" : tokens.gray700, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:tokens.font }}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:10 }}>
                    <button style={{ padding:"8px 16px", background:"#0891b2", color:"#fff", border:"none", borderRadius:tokens.radius.md, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:tokens.font, opacity: results.length ? 1 : 0.5 }} onClick={() => setChart("state")} disabled={!results.length}>📊 State chart</button>
                    <button style={{ padding:"8px 16px", background:"#0891b2", color:"#fff", border:"none", borderRadius:tokens.radius.md, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:tokens.font, opacity: results.length ? 1 : 0.5 }} onClick={() => setChart("workshop")} disabled={!results.length}>📊 Workshops chart</button>
                  </div>
                </div>

                {/* Table */}
                <div style={{ background:"#fff", border:`1px solid ${tokens.gray200}`, borderRadius:tokens.radius.lg, overflow:"hidden" }}>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:640 }}>
                      <thead>
                        <tr>
                          {["Sr No","Coordinator Name","Institute Name","Instructor Name","Workshop Name","Workshop Date","State"].map(h => (
                            <th key={h} style={{ padding:"12px 14px", background:tokens.gray50, borderBottom:`1px solid ${tokens.gray200}`, color:tokens.gray700, fontWeight:700, fontSize:12, textAlign:"left", whiteSpace:"nowrap", letterSpacing:"0.02em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pageData.length === 0 ? (
                          <tr><td colSpan={7} style={{ padding:"40px 20px", textAlign:"center", color:tokens.gray500, fontSize:14 }}>
                            {searched ? "No records match the selected filters." : "Use the filters and click View to see results."}
                          </td></tr>
                        ) : pageData.map((row, i) => (
                          <tr key={row.id} style={{ background: i % 2 === 0 ? "#fff" : tokens.gray50 }}>
                            <td style={{ padding:"11px 14px", color:tokens.gray700 }}>{(page-1)*PER_PAGE + i + 1}</td>
                            <td style={{ padding:"11px 14px", color:tokens.gray800, fontWeight:500 }}>{row.coordinator}</td>
                            <td style={{ padding:"11px 14px", color:tokens.gray700 }}>{row.institute}</td>
                            <td style={{ padding:"11px 14px", color:tokens.gray700 }}>{row.instructor}</td>
                            <td style={{ padding:"11px 14px" }}>
                              <span style={{ background:tokens.blueLight, color:"#1d4ed8", border:`1px solid ${tokens.blueBorder}`, borderRadius:5, padding:"2px 8px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{row.workshop}</span>
                            </td>
                            <td style={{ padding:"11px 14px", color:tokens.gray700, whiteSpace:"nowrap" }}>{row.date}</td>
                            <td style={{ padding:"11px 14px", color:tokens.gray700 }}>{row.state}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {searched && results.length > 0 && (
                  <div style={{ fontSize:12, color:tokens.gray500, marginTop:10, textAlign:"right" }}>{results.length} record{results.length !== 1 ? "s" : ""} found</div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>

      <footer style={{ textAlign:"center", padding:"12px 0", fontSize:12, background:tokens.navy, color:"#cbd5e0" }}>
        Developed by FOSSEE group, IIT Bombay
      </footer>

      {chart && (
        <BarChart data={results} type={chart} onClose={() => setChart(null)} isMobile={isMobile} />
      )}
    </div>
  );
}