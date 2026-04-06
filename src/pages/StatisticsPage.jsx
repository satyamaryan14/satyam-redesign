import { useState, useRef, useEffect } from "react";

// ── Sample data ───────────────────────────────────────────────────────────────
const SAMPLE_DATA = [
  { id:1, coordinator:"Priya Sharma", institute:"IIT Bombay", instructor:"Prof. Anil Kumar", workshop:"Python for Engineers", date:"2025-03-10", state:"Maharashtra" },
  { id:2, coordinator:"Rahul Mehta", institute:"NIT Warangal", instructor:"Prof. Suresh Babu", workshop:"Scilab Basics", date:"2025-03-22", state:"Telangana" },
  { id:3, coordinator:"Ananya Singh", institute:"BITS Pilani", instructor:"Prof. Kavita Joshi", workshop:"OpenFOAM CFD", date:"2025-04-01", state:"Rajasthan" },
  { id:4, coordinator:"Vikram Patel", institute:"IIT Madras", instructor:"Prof. Ramesh Iyer", workshop:"OSDAG Steel Design", date:"2025-04-14", state:"Tamil Nadu" },
  { id:5, coordinator:"Sneha Reddy", institute:"JNTU Hyderabad", instructor:"Prof. Suresh Babu", workshop:"Python for Engineers", date:"2025-04-20", state:"Telangana" },
  { id:6, coordinator:"Arjun Nair", institute:"NIT Calicut", instructor:"Prof. Meenal S.", workshop:"Scilab Basics", date:"2025-05-02", state:"Kerala" },
  { id:7, coordinator:"Divya Verma", institute:"IIT Delhi", instructor:"Prof. Anil Kumar", workshop:"Python for Engineers", date:"2025-05-15", state:"Delhi" },
];

const WORKSHOPS = [...new Set(SAMPLE_DATA.map(d => d.workshop))];
const STATES    = [...new Set(SAMPLE_DATA.map(d => d.state))];

// ── Chart component ───────────────────────────────────────────────────────────
function StatChart({ data, type, onClose }) {
  const canvasRef = useRef(null);

  // Aggregate
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
    const pad = { top:30, right:20, bottom:60, left:50 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const barW = Math.min(50, chartW / labels.length - 12);

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + chartH - (i / 4) * chartH;
      ctx.beginPath();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px DM Sans, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.round((i / 4) * maxVal), pad.left - 6, y + 4);
    }

    // Bars
    labels.forEach((label, i) => {
      const x = pad.left + (i / labels.length) * chartW + (chartW / labels.length - barW) / 2;
      const barH = (values[i] / maxVal) * chartH;
      const y = pad.top + chartH - barH;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Value label
      ctx.fillStyle = "#1a202c";
      ctx.font = "bold 12px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(values[i], x + barW / 2, y - 6);

      // X label
      ctx.fillStyle = "#4a5568";
      ctx.font = "11px DM Sans, sans-serif";
      ctx.textAlign = "center";
      const maxLabelWidth = chartW / labels.length - 4;
      let shortLabel = label;
      while (ctx.measureText(shortLabel).width > maxLabelWidth && shortLabel.length > 6) {
        shortLabel = shortLabel.slice(0, -4) + "…";
      }
      ctx.fillText(shortLabel, x + barW / 2, pad.top + chartH + 16);
    });

    // X axis
    ctx.beginPath();
    ctx.strokeStyle = "#cbd5e0";
    ctx.lineWidth = 1.5;
    ctx.moveTo(pad.left, pad.top + chartH);
    ctx.lineTo(W - pad.right, pad.top + chartH);
    ctx.stroke();
  }, [data, type]);

  return (
    <div style={cs.overlay}>
      <div style={cs.modal}>
        <div style={cs.modalHeader}>
          <h2 style={cs.modalTitle}>
            Workshops Statistics — {type === "state" ? "State wise" : "Workshop wise"}
          </h2>
          <button style={cs.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div style={cs.modalBody}>
          {data.length === 0 ? (
            <div style={cs.empty}>No data available for the selected filters.</div>
          ) : (
            <canvas ref={canvasRef} width={620} height={320} style={{ width:"100%", height:"auto" }} />
          )}
        </div>
      </div>
    </div>
  );
}

const cs = {
  overlay: { position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 },
  modal: { background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", width:"100%", maxWidth:680, overflow:"hidden" },
  modalHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #e2e8f0" },
  modalTitle: { fontSize:16, fontWeight:700, color:"#1a202c", margin:0 },
  closeBtn: { background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#718096", padding:4, lineHeight:1 },
  modalBody: { padding:20 },
  empty: { textAlign:"center", padding:"40px 0", color:"#a0aec0", fontSize:14 },
};

// ── Main Statistics page ──────────────────────────────────────────────────────
export default function StatisticsPage() {
  const [filters, setFilters] = useState({ fromDate:"", toDate:"", workshop:"", state:"", sortBy:"oldest" });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [chart, setChart] = useState(null); // "state" | "workshop" | null
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const setF = (k) => (e) => setFilters(f => ({ ...f, [k]: e.target.value }));

  function applyFilters() {
    let data = [...SAMPLE_DATA];
    if (filters.fromDate) data = data.filter(d => d.date >= filters.fromDate);
    if (filters.toDate)   data = data.filter(d => d.date <= filters.toDate);
    if (filters.workshop) data = data.filter(d => d.workshop === filters.workshop);
    if (filters.state)    data = data.filter(d => d.state === filters.state);
    data.sort((a,b) => filters.sortBy === "newest"
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date));
    setResults(data);
    setSearched(true);
    setPage(1);
  }

  function clearFilters() {
    setFilters({ fromDate:"", toDate:"", workshop:"", state:"", sortBy:"oldest" });
    setResults([]);
    setSearched(false);
    setPage(1);
  }

  function downloadCSV() {
    const header = "Sr No,Coordinator Name,Institute Name,Instructor Name,Workshop Name,Workshop Date,State";
    const rows = results.map((r,i) =>
      [i+1, r.coordinator, r.institute, r.instructor, r.workshop, r.date, r.state].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type:"text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "fossee_workshops.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.ceil(results.length / PER_PAGE);
  const pageData = results.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <div style={s.page}>
      {/* Navbar */}
      <header style={s.navbar}>
        <div style={s.navInner}>
          <span style={s.navLogo}>FOSSEE Workshops</span>
          <nav style={s.navLinks}>
            <a href="#" style={{ ...s.navLink, color:"#fff", fontWeight:700 }}>Home</a>
            <a href="#" style={s.navLink}>Workshop Statistics</a>
          </nav>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.layout}>

          {/* ── Sidebar Filters ── */}
          <aside style={s.sidebar}>
            <div style={s.sidebarHead}>
              <h2 style={s.sidebarTitle}>Filters</h2>
              <button style={s.clearBtn} onClick={clearFilters} aria-label="Clear filters">
                ✕ Clear
              </button>
            </div>

            <div style={s.filterGroup}>
              <label style={s.filterLabel}>From date</label>
              <input style={s.filterInput} type="date" value={filters.fromDate} onChange={setF("fromDate")} />
            </div>
            <div style={s.filterGroup}>
              <label style={s.filterLabel}>To date</label>
              <input style={s.filterInput} type="date" value={filters.toDate} onChange={setF("toDate")} />
            </div>
            <div style={s.filterGroup}>
              <label style={s.filterLabel}>Workshop</label>
              <select style={s.filterInput} value={filters.workshop} onChange={setF("workshop")}>
                <option value="">All workshops</option>
                {WORKSHOPS.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div style={s.filterGroup}>
              <label style={s.filterLabel}>State</label>
              <select style={s.filterInput} value={filters.state} onChange={setF("state")}>
                <option value="">All states</option>
                {STATES.map(st => <option key={st}>{st}</option>)}
              </select>
            </div>
            <div style={s.filterGroup}>
              <label style={s.filterLabel}>Sort by</label>
              <select style={s.filterInput} value={filters.sortBy} onChange={setF("sortBy")}>
                <option value="oldest">Oldest first</option>
                <option value="newest">Newest first</option>
              </select>
            </div>

            <div style={s.filterActions}>
              <button style={s.viewBtn} onClick={applyFilters}>
                <span style={{ fontSize:14 }}>👁</span> View
              </button>
              <button style={s.downloadBtn} onClick={downloadCSV} disabled={!results.length}>
                <span style={{ fontSize:14 }}>⬇</span> Download
              </button>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <section style={s.content}>
            {/* Top bar: pagination + chart buttons */}
            <div style={s.topBar}>
              <div style={s.pagination}>
                {totalPages > 0 && Array.from({ length: totalPages }, (_,i) => (
                  <button
                    key={i}
                    style={{ ...s.pageBtn, ...(page===i+1 ? s.pageBtnActive : {}) }}
                    onClick={() => setPage(i+1)}
                  >{i+1}</button>
                ))}
                {!searched && <span style={s.pageBtn}>{1}</span>}
              </div>
              <div style={s.chartBtns}>
                <button style={s.chartBtn} onClick={() => setChart("state")} disabled={!results.length}>
                  📊 State chart
                </button>
                <button style={s.chartBtn} onClick={() => setChart("workshop")} disabled={!results.length}>
                  📊 Workshops chart
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Sr No","Coordinator Name","Institute Name","Instructor Name","Workshop Name","Workshop Date","State"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageData.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={s.emptyCell}>
                        {searched
                          ? "No records match the selected filters."
                          : "Use the filters on the left and click View to see results."}
                      </td>
                    </tr>
                  ) : (
                    pageData.map((row, i) => (
                      <tr key={row.id} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                        <td style={s.td}>{(page-1)*PER_PAGE + i + 1}</td>
                        <td style={s.td}>{row.coordinator}</td>
                        <td style={s.td}>{row.institute}</td>
                        <td style={s.td}>{row.instructor}</td>
                        <td style={s.td}>
                          <span style={s.workshopBadge}>{row.workshop}</span>
                        </td>
                        <td style={s.td}>{row.date}</td>
                        <td style={s.td}>{row.state}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom pagination */}
            {totalPages > 1 && (
              <div style={s.bottomPag}>
                {Array.from({ length: totalPages }, (_,i) => (
                  <button
                    key={i}
                    style={{ ...s.pageBtn, ...(page===i+1 ? s.pageBtnActive : {}) }}
                    onClick={() => setPage(i+1)}
                  >{i+1}</button>
                ))}
              </div>
            )}

            {searched && results.length > 0 && (
              <div style={s.resultCount}>{results.length} record{results.length !== 1 ? "s" : ""} found</div>
            )}
          </section>
        </div>
      </main>

      <footer style={s.footer}>Developed by FOSSEE group, IIT Bombay</footer>

      {/* Chart modal */}
      {chart && (
        <StatChart data={results} type={chart} onClose={() => setChart(null)} />
      )}
    </div>
  );
}

const s = {
  page: { minHeight:"100vh", background:"#f4f6f9", fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", flexDirection:"column" },
  navbar: { background:"#2d3748", borderBottom:"1px solid #3a4a5c" },
  navInner: { maxWidth:1200, margin:"0 auto", padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" },
  navLogo: { fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"-0.01em" },
  navLinks: { display:"flex", gap:24 },
  navLink: { fontSize:14, color:"#cbd5e0", textDecoration:"none", fontWeight:500 },
  main: { flex:1, padding:"24px 16px 40px" },
  layout: { maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"280px 1fr", gap:20, alignItems:"start" },
  // Sidebar
  sidebar: { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"18px 20px", position:"sticky", top:20 },
  sidebarHead: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 },
  sidebarTitle: { fontSize:16, fontWeight:800, color:"#1a202c", margin:0, letterSpacing:"-0.01em" },
  clearBtn: { fontSize:12, color:"#e53e3e", background:"#fff5f5", border:"1px solid #feb2b2", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontFamily:"inherit", fontWeight:600 },
  filterGroup: { marginBottom:14 },
  filterLabel: { display:"block", fontSize:12, fontWeight:600, color:"#4a5568", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" },
  filterInput: { width:"100%", padding:"8px 10px", border:"1px solid #e2e8f0", borderRadius:7, fontSize:13, color:"#1a202c", background:"#f7fafc", fontFamily:"inherit", boxSizing:"border-box" },
  filterActions: { display:"flex", gap:10, marginTop:20 },
  viewBtn: { flex:1, padding:"10px", background:"#16a34a", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 },
  downloadBtn: { flex:1, padding:"10px", background:"#2563eb", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 },
  // Content
  content: { minWidth:0 },
  topBar: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 },
  pagination: { display:"flex", gap:6 },
  pageBtn: { width:34, height:34, borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, color:"#4a5568", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center" },
  pageBtnActive: { background:"#2563eb", color:"#fff", border:"1px solid #2563eb" },
  chartBtns: { display:"flex", gap:10 },
  chartBtn: { padding:"8px 16px", background:"#0891b2", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 },
  tableWrap: { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden" },
  table: { width:"100%", borderCollapse:"collapse", fontSize:13 },
  th: { padding:"12px 14px", background:"#f7fafc", borderBottom:"1px solid #e2e8f0", color:"#4a5568", fontWeight:700, fontSize:12, textAlign:"left", whiteSpace:"nowrap", letterSpacing:"0.02em" },
  td: { padding:"11px 14px", color:"#2d3748", verticalAlign:"middle" },
  trEven: { background:"#fff" },
  trOdd: { background:"#f7fafc" },
  workshopBadge: { background:"#eff6ff", color:"#1d4ed8", border:"1px solid #bfdbfe", borderRadius:5, padding:"2px 8px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" },
  emptyCell: { padding:"40px 20px", textAlign:"center", color:"#a0aec0", fontSize:14 },
  bottomPag: { display:"flex", gap:6, marginTop:14, justifyContent:"flex-end" },
  resultCount: { fontSize:12, color:"#a0aec0", marginTop:10, textAlign:"right" },
  footer: { textAlign:"center", padding:"14px 0", fontSize:12, background:"#2d3748", color:"#cbd5e0", marginTop:"auto" },
};