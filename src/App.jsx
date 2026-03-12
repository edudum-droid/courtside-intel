
const ROSTER = [
  { id: 1,  name: "Angelo Ciarravino",  team: "Northwestern",           league: "NCAA",        position: "G"  },
  { id: 2,  name: "Kendrick Nunn",      team: "Panathinaikos",          league: "EuroLeague",  position: "G"  },
  { id: 3,  name: "Micah Robinson",     team: "TCU",                    league: "NCAA",        position: "G"  },
  { id: 4,  name: "Kobe Bufkin",        team: "Atlanta Hawks",          league: "NBA",         position: "G"  },
  { id: 5,  name: "Joan Beringer",      team: "Minnesota Timberwolves", league: "NBA",         position: "C"  },
  { id: 6,  name: "Nolan Traore",       team: "Brooklyn Nets",          league: "NBA",         position: "PG" },
  { id: 7,  name: "Kyshawn George",     team: "Washington Wizards",     league: "NBA",         position: "G"  },
  { id: 8,  name: "Yves Missi",         team: "New Orleans Pelicans",   league: "NBA",         position: "C"  },
  { id: 9,  name: "Robert Wright III",  team: "BYU",                    league: "NCAA",        position: "G"  },
  { id: 10, name: "Nils Cooper",        team: "UC Davis",               league: "NCAA",        position: "G"  },
  { id: 11, name: "Wenyen Gabriel",     team: "Bayern Munich",          league: "EuroLeague",  position: "F"  },
  { id: 12, name: "Justin Thomas",      team: "Bowling Green",          league: "NCAA",        position: "G"  },
  { id: 13, name: "Richard Barron",     team: "Providence",             league: "NCAA",        position: "F"  },
  { id: 14, name: "Sailou Niang",       team: "Virtus Bologna",         league: "EuroLeague",  position: "F"  },
  { id: 15, name: "Brice Sensabaugh",   team: "Utah Jazz",              league: "NBA",         position: "G"  },
  { id: 16, name: "Bilal Coulibaly",    team: "Washington Wizards",     league: "NBA",         position: "F"  },
  { id: 17, name: "JB Brown",           team: "North Carolina",         league: "NCAA",        position: "G"  },
  { id: 18, name: "Adama Bal",          team: "Westchester Knicks",     league: "NBAGL",       position: "F"  },
  { id: 19, name: "Sam Lewis",          team: "Virginia",               league: "NCAA",        position: "G"  },
  { id: 20, name: "Javonte Green",      team: "Detroit Pistons",        league: "NBA",         position: "F"  },
  { id: 21, name: "Langston Love",      team: "Georgetown",             league: "NCAA",        position: "G"  },
  { id: 22, name: "Desmond Watson",     team: "Free Agent",             league: "—",           position: "G"  },
];

const LEAGUE_COLORS = {
  NBA:        { accent: "#1d3a6b", badge: "#5b9bd5" },
  NCAA:       { accent: "#1a4a2a", badge: "#5bd58a" },
  EuroLeague: { accent: "#4a1a4a", badge: "#d55bd5" },
  NBAGL:      { accent: "#4a2a10", badge: "#d59b5b" },
  "—":        { accent: "#2a2a2a", badge: "#666"    },
};

const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

function buildSystemPrompt(player) {
  return `You are an elite sports intelligence analyst for a top basketball agent. Generate a professional daily briefing for ${player.name} (${player.team}, ${player.league}).

Search the web for the most current, accurate information. Today is ${todayStr}.

Respond ONLY with a valid JSON object — no markdown fences, no commentary:
{
  "recentStats": {
    "seasonAvg": { "pts": "00.0", "reb": "00.0", "ast": "00.0", "fg": "00.0%" },
    "summary": "2-3 sentence analysis of current form and season trajectory",
    "lastGame": {
      "opponent": "Team Name",
      "date": "Mon DD, YYYY",
      "result": "W 110-98",
      "pts": 00, "reb": 00, "ast": 00, "fg": "00.0%",
      "highlight": "One specific standout moment from the game"
    }
  },
  "nextGame": {
    "opponent": "Team Name",
    "date": "Mon DD, YYYY",
    "time": "7:30 PM ET",
    "location": "Arena, City",
    "preview": "2 sentence matchup preview"
  },
  "news": [
    { "headline": "...", "summary": "1-2 sentences", "sentiment": "positive|neutral|negative", "category": "Performance|Contract|Health|Media|League" },
    { "headline": "...", "summary": "1-2 sentences", "sentiment": "positive|neutral|negative", "category": "Performance|Contract|Health|Media|League" },
    { "headline": "...", "summary": "1-2 sentences", "sentiment": "positive|neutral|negative", "category": "Performance|Contract|Health|Media|League" }
  ],
  "agentAlert": "The single most important action item or opportunity for the agent today — be specific and actionable"
}

Adapt for non-NBA players (NCAA/EuroLeague/G-League) using their league's schedule and stats. Be accurate and specific.`;
}

function generateEmailHTML(player, b) {
  const sc = s => s === "positive" ? "#4ade80" : s === "negative" ? "#f87171" : "#facc15";
  const lg = b.recentStats?.lastGame;
  const ng = b.nextGame;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:Georgia,serif;background:#f0f0f0;margin:0;padding:20px}
.wrap{max-width:600px;margin:0 auto;background:#111;border-radius:14px;overflow:hidden;color:#ddd}
.hdr{background:#161616;padding:22px 26px;border-bottom:2px solid #FFA500}
.pname{font-size:24px;font-weight:800;color:#FFA500;margin:6px 0 2px}
.sub{font-size:11px;color:#666}
.sec{padding:18px 26px;border-bottom:1px solid #1e1e1e}
.stitle{font-size:9px;text-transform:uppercase;letter-spacing:.14em;color:#FFA500;margin-bottom:12px;font-family:Arial,sans-serif}
.srow{display:flex;gap:8px;margin:10px 0}
.sbox{background:rgba(255,165,0,.07);border:1px solid rgba(255,165,0,.18);border-radius:6px;padding:8px 12px;text-align:center}
.sv{font-size:19px;font-weight:800;color:#FFA500;display:block}
.sl{font-size:9px;color:#777;text-transform:uppercase;letter-spacing:.08em}
.alert{background:#110e00;border:1px solid rgba(255,165,0,.35);border-radius:8px;padding:14px 16px}
.ni{margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #1e1e1e}
.ni:last-child{border:none;margin:0;padding:0}
.ftr{padding:14px 26px;text-align:center;font-size:10px;color:#333}
</style></head><body><div class="wrap">
<div class="hdr">
  <div style="font-size:10px;color:#FFA500;font-family:Arial;font-weight:700;text-transform:uppercase;letter-spacing:.1em">🏀 Daily Briefing · ${todayStr}</div>
  <div class="pname">${player.name}</div>
  <div class="sub">${player.position} · ${player.team} · ${player.league}</div>
</div>
${b.agentAlert ? `<div class="sec"><div class="stitle">⚡ Agent Alert</div><div class="alert"><p style="margin:0;font-size:13px;line-height:1.6;color:#ddd">${b.agentAlert}</p></div></div>` : ""}
<div class="sec">
  <div class="stitle">📊 Season Averages</div>
  <div class="srow">
    <div class="sbox"><span class="sv">${b.recentStats?.seasonAvg?.pts ?? "—"}</span><span class="sl">PTS</span></div>
    <div class="sbox"><span class="sv">${b.recentStats?.seasonAvg?.reb ?? "—"}</span><span class="sl">REB</span></div>
    <div class="sbox"><span class="sv">${b.recentStats?.seasonAvg?.ast ?? "—"}</span><span class="sl">AST</span></div>
    <div class="sbox"><span class="sv">${b.recentStats?.seasonAvg?.fg ?? "—"}</span><span class="sl">FG%</span></div>
  </div>
  <p style="font-size:12px;color:#888;line-height:1.6;margin:10px 0 0">${b.recentStats?.summary ?? ""}</p>
</div>
${lg ? `<div class="sec"><div class="stitle">🏀 Last Game · vs ${lg.opponent} · ${lg.date}</div>
<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
  <span style="font-size:11px;font-weight:700;padding:3px 9px;border-radius:4px;background:${lg.result?.startsWith("W") ? "rgba(74,222,128,.12)" : "rgba(248,113,113,.12)"};color:${lg.result?.startsWith("W") ? "#4ade80" : "#f87171"};border:1px solid ${lg.result?.startsWith("W") ? "#4ade8044" : "#f8717144"}">${lg.result}</span>
</div>
<div class="srow">
  <div class="sbox"><span class="sv">${lg.pts}</span><span class="sl">PTS</span></div>
  <div class="sbox"><span class="sv">${lg.reb}</span><span class="sl">REB</span></div>
  <div class="sbox"><span class="sv">${lg.ast}</span><span class="sl">AST</span></div>
  <div class="sbox"><span class="sv">${lg.fg}</span><span class="sl">FG%</span></div>
</div>
<p style="font-size:12px;color:#888;font-style:italic;margin:10px 0 0">"${lg.highlight}"</p></div>` : ""}
${ng ? `<div class="sec"><div class="stitle">📅 Next Game</div>
<div style="font-weight:700;font-size:14px;color:#eee;margin-bottom:8px">vs ${ng.opponent}</div>
<div style="font-size:12px;color:#777;margin-bottom:3px">📅 ${ng.date} · ${ng.time}</div>
<div style="font-size:12px;color:#777;margin-bottom:10px">📍 ${ng.location}</div>
<p style="font-size:12px;color:#888;line-height:1.6;margin:0">${ng.preview}</p></div>` : ""}
${b.news?.length ? `<div class="sec"><div class="stitle">📰 Latest News</div>
${b.news.map(n => `<div class="ni">
  <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:4px">
    <span style="width:7px;height:7px;border-radius:50%;background:${sc(n.sentiment)};flex-shrink:0;margin-top:4px;display:inline-block"></span>
    <span style="font-size:13px;font-weight:700;color:#eee;line-height:1.4">${n.headline}</span>
  </div>
  <p style="margin:0;padding-left:15px;font-size:12px;color:#888;line-height:1.5">${n.summary}</p>
</div>`).join("")}</div>` : ""}
<div class="ftr">Courtside Intel · AI-Powered · ${todayStr}<br><span style="color:#2a2a2a">Confidential — Agent Use Only</span></div>
</div></body></html>`;
}

function LeagueBadge({ league }) {
  const c = LEAGUE_COLORS[league] || LEAGUE_COLORS["—"];
  return <span style={{ fontSize: "0.58rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", padding: "2px 7px", borderRadius: 4, background: c.accent, color: c.badge, border: `1px solid ${c.badge}33` }}>{league}</span>;
}

function StatBox({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,165,0,0.07)", border: "1px solid rgba(255,165,0,0.18)", borderRadius: 8, padding: "8px 13px", minWidth: 56 }}>
      <span style={{ fontSize: "1.2rem", fontWeight: "800", color: "#FFA500", fontFamily: "'Bebas Neue', cursive", lineHeight: 1 }}>{value ?? "—"}</span>
      <span style={{ fontSize: "0.58rem", color: "#777", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 3 }}>{label}</span>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [briefings, setBriefings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("All");
  const [genAll, setGenAll] = useState(false);
  const [progress, setProgress] = useState({ n: 0, total: 0, name: "" });

  const leagues = ["All", ...Array.from(new Set(ROSTER.map(p => p.league)))];
  const filtered = ROSTER.filter(p =>
    (leagueFilter === "All" || p.league === leagueFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase()))
  );

  async function callAI(player) {
    const res = await fetch("https://api/brief/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: buildSystemPrompt(player),
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: `Generate today's full briefing for ${player.name}. You MUST end your response with a valid JSON object containing the briefing data.` }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();

    // Collect all text blocks (web search returns multiple content blocks)
    const allText = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n");

    if (!allText) throw new Error("No text in response");

    // Extract JSON — find the last { ... } block in the full response
    const jsonMatch = allText.match(/\{[\s\S]*\}(?=[^}]*$)/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // Try cleaning common issues
      const cleaned = jsonMatch[0]
        .replace(/```json|```/g, "")
        .replace(/[\x00-\x1F\x7F]/g, " ") // strip control chars
        .trim();
      return JSON.parse(cleaned);
    }
  }

  async function fetchBriefing(player) {
    setSelected(player);
    if (briefings[player.id]) return;
    setLoading(true);
    setError(null);
    try {
      const parsed = await callAI(player);
      setBriefings(prev => ({ ...prev, [player.id]: parsed }));
    } catch (e) {
      console.error("Briefing error:", e);
      setError(`Failed to load briefing for ${player.name}: ${e.message}. Click ↻ to retry.`);
    }
    setLoading(false);
  }

  async function generateAllNBA() {
    const nba = ROSTER.filter(p => p.league === "NBA");
    setGenAll(true);
    setProgress({ n: 0, total: nba.length, name: "" });
    for (let i = 0; i < nba.length; i++) {
      const p = nba[i];
      setProgress({ n: i + 1, total: nba.length, name: p.name });
      if (!briefings[p.id]) {
        try {
          const parsed = await callAI(p);
          setBriefings(prev => ({ ...prev, [p.id]: parsed }));
        } catch (e) { console.error(p.name, e); }
        await new Promise(r => setTimeout(r, 700));
      }
    }
    setGenAll(false);
  }

  function downloadEmail() {
    const b = briefings[selected?.id];
    if (!b || !selected) return;
    const html = generateEmailHTML(selected, b);
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    Object.assign(document.createElement("a"), { href: url, download: `${selected.name.replace(/ /g,"_")}_${new Date().toISOString().slice(0,10)}.html` }).click();
    URL.revokeObjectURL(url);
  }

  const briefing = selected ? briefings[selected.id] : null;
  const lg = briefing?.recentStats?.lastGame;
  const ng = briefing?.nextGame;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "Georgia, serif", color: "#fff", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#111", borderBottom: "1px solid rgba(255,140,0,0.2)", padding: "14px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#FFA500,#FF4500)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🏀</div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.4rem", letterSpacing: "0.06em", color: "#FFA500", lineHeight: 1 }}>COURTSIDE INTEL</div>
            <div style={{ fontSize: "0.6rem", color: "#444", letterSpacing: "0.14em", textTransform: "uppercase" }}>Daily Player Briefing · AI-Powered</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {genAll && (
            <div style={{ fontSize: "0.72rem", color: "#666", display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 12, height: 12, border: "2px solid rgba(255,140,0,0.2)", borderTop: "2px solid #FFA500", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              {progress.n}/{progress.total} · {progress.name}
            </div>
          )}
          <button onClick={generateAllNBA} disabled={genAll} style={{ background: "rgba(255,165,0,0.08)", border: "1px solid rgba(255,165,0,0.25)", borderRadius: 8, color: "#FFA500", padding: "7px 13px", cursor: genAll ? "not-allowed" : "pointer", fontSize: "0.72rem", fontFamily: "Georgia, serif" }}>
            {genAll ? "Generating…" : "⚡ Brief All NBA"}
          </button>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.68rem", color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>{todayStr}</div>
            <div style={{ fontSize: "0.68rem", color: "#333", marginTop: 1 }}>{ROSTER.length} clients · {Object.keys(briefings).length} briefed</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 67px)" }}>

        {/* SIDEBAR */}
        <div style={{ width: 262, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…"
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "7px 11px", color: "#ccc", fontSize: "0.78rem", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 4, marginTop: 7, flexWrap: "wrap" }}>
              {leagues.map(l => (
                <button key={l} onClick={() => setLeagueFilter(l)} style={{ fontSize: "0.58rem", padding: "3px 7px", borderRadius: 4, cursor: "pointer", fontFamily: "Arial", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", background: leagueFilter === l ? "#FFA500" : "rgba(255,255,255,0.04)", color: leagueFilter === l ? "#000" : "#555", border: leagueFilter === l ? "1px solid #FFA500" : "1px solid rgba(255,255,255,0.07)" }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
            <div style={{ fontSize: "0.58rem", color: "#333", textTransform: "uppercase", letterSpacing: "0.12em", margin: "4px 4px 6px", display: "flex", justifyContent: "space-between" }}>
              <span>{filtered.length} clients</span><span style={{ color: "#3a3a3a" }}>{Object.keys(briefings).length} briefed</span>
            </div>
            {filtered.map(p => {
              const c = LEAGUE_COLORS[p.league] || LEAGUE_COLORS["—"];
              const isSel = selected?.id === p.id;
              const hasBriefing = !!briefings[p.id];
              return (
                <button key={p.id} onClick={() => fetchBriefing(p)} style={{ display: "flex", alignItems: "center", gap: 9, background: isSel ? `${c.accent}55` : "rgba(255,255,255,0.018)", border: isSel ? `1px solid ${c.badge}66` : "1px solid rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 3, position: "relative" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: isSel ? "linear-gradient(135deg,#FFA500,#FF4500)" : "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: "700", color: isSel ? "#000" : "#777" }}>{p.position}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Georgia, serif", fontWeight: "700", color: isSel ? "#FFA500" : "#ccc", fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ fontSize: "0.62rem", color: "#555", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.team}</div>
                  </div>
                  <LeagueBadge league={p.league} />
                  {hasBriefing && <div style={{ position: "absolute", top: 6, right: 6, width: 5, height: 5, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 5px #4ade80" }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, overflowY: "auto", padding: "26px 30px" }}>

          {!selected && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 14 }}>🏀</div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.8rem", color: "#1e1e1e", letterSpacing: "0.06em" }}>SELECT A CLIENT</div>
              <div style={{ fontSize: "0.8rem", color: "#2a2a2a", marginTop: 6 }}>Click any player on the left to generate their daily briefing</div>
              <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, maxWidth: 440 }}>
                {Object.entries(ROSTER.reduce((acc, p) => { acc[p.league] = (acc[p.league]||0)+1; return acc; }, {})).map(([league, count]) => (
                  <div key={league} style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, padding: "12px 8px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.6rem", color: "#FFA500" }}>{count}</div>
                    <div style={{ fontSize: "0.58rem", color: "#333", textTransform: "uppercase" }}>{league}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected && loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60%", gap: 14 }}>
              <div style={{ width: 48, height: 48, border: "3px solid rgba(255,140,0,0.12)", borderTop: "3px solid #FFA500", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <div style={{ color: "#333", fontSize: "0.82rem" }}>Pulling intel on {selected.name}…</div>
            </div>
          )}

          {error && !loading && (
            <div style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: 16, color: "#f87171", fontSize: "0.82rem" }}>{error}</div>
          )}

          {briefing && selected && !loading && (
            <div style={{ animation: "fadeIn 0.25s ease", maxWidth: 800 }}>

              {/* Player header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#FFA500,#FF4500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "700", color: "#000" }}>{selected.position}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.7rem", letterSpacing: "0.04em" }}>{selected.name}</span>
                    <LeagueBadge league={selected.league} />
                  </div>
                  <div style={{ color: "#555", fontSize: "0.75rem", marginTop: 2 }}>{selected.team}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setBriefings(prev => { const n={...prev}; delete n[selected.id]; return n; }); setError(null); setLoading(true); callAI(selected).then(parsed => { setBriefings(prev => ({ ...prev, [selected.id]: parsed })); setLoading(false); }).catch(e => { setError(`Retry failed: ${e.message}`); setLoading(false); }); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, color: "#555", padding: "6px 12px", cursor: "pointer", fontSize: "0.72rem", fontFamily: "Georgia, serif" }}>↻</button>
                  <button onClick={downloadEmail} style={{ background: "rgba(255,165,0,0.08)", border: "1px solid rgba(255,165,0,0.25)", borderRadius: 7, color: "#FFA500", padding: "6px 13px", cursor: "pointer", fontSize: "0.72rem", fontFamily: "Georgia, serif" }}>📧 Download Email</button>
                </div>
              </div>

              {/* Alert */}
              {briefing.agentAlert && (
                <div style={{ background: "rgba(255,140,0,0.06)", border: "1px solid rgba(255,140,0,0.22)", borderRadius: 11, padding: "14px 18px", marginBottom: 18, display: "flex", gap: 11 }}>
                  <span style={{ flexShrink: 0, fontSize: "1rem" }}>⚡</span>
                  <div>
                    <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#FFA500", marginBottom: 5 }}>Agent Alert</div>
                    <div style={{ fontSize: "0.84rem", color: "#bbb", lineHeight: 1.65 }}>{briefing.agentAlert}</div>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

                {/* Stats card */}
                <div style={{ background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 11, padding: 16 }}>
                  <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#FFA500", marginBottom: 11 }}>Season Averages</div>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 }}>
                    <StatBox label="PTS" value={briefing.recentStats?.seasonAvg?.pts} />
                    <StatBox label="REB" value={briefing.recentStats?.seasonAvg?.reb} />
                    <StatBox label="AST" value={briefing.recentStats?.seasonAvg?.ast} />
                    <StatBox label="FG%" value={briefing.recentStats?.seasonAvg?.fg} />
                  </div>
                  <p style={{ fontSize: "0.76rem", color: "#777", lineHeight: 1.6, margin: 0 }}>{briefing.recentStats?.summary}</p>

                  {lg && <>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "13px 0" }} />
                    <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#FFA500", marginBottom: 10 }}>Last Game</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 9 }}>
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "0.88rem" }}>vs {lg.opponent}</div>
                        <div style={{ color: "#444", fontSize: "0.7rem", marginTop: 2 }}>{lg.date}</div>
                      </div>
                      <span style={{ fontSize: "0.72rem", fontWeight: "700", padding: "3px 8px", borderRadius: 5, background: lg.result?.startsWith("W") ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)", color: lg.result?.startsWith("W") ? "#4ade80" : "#f87171", border: `1px solid ${lg.result?.startsWith("W") ? "#4ade8044" : "#f8717144"}` }}>{lg.result}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}>
                      <StatBox label="PTS" value={lg.pts} />
                      <StatBox label="REB" value={lg.reb} />
                      <StatBox label="AST" value={lg.ast} />
                      <StatBox label="FG%" value={lg.fg} />
                    </div>
                    <p style={{ fontSize: "0.73rem", color: "#555", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>"{lg.highlight}"</p>
                  </>}
                </div>

                {/* Next game */}
                <div style={{ background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 11, padding: 16 }}>
                  <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#FFA500", marginBottom: 11 }}>Next Game</div>
                  {ng ? <>
                    <div style={{ fontWeight: "700", fontSize: "1.05rem", marginBottom: 11 }}>vs {ng.opponent}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 13 }}>
                      <div style={{ display: "flex", gap: 8, fontSize: "0.78rem", color: "#666" }}><span>📅</span><span>{ng.date} · {ng.time}</span></div>
                      <div style={{ display: "flex", gap: 8, fontSize: "0.78rem", color: "#666" }}><span>📍</span><span>{ng.location}</span></div>
                    </div>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 13 }} />
                    <p style={{ fontSize: "0.76rem", color: "#777", lineHeight: 1.65, margin: 0 }}>{ng.preview}</p>
                  </> : <div style={{ color: "#2a2a2a", fontSize: "0.8rem" }}>No upcoming game data</div>}
                </div>
              </div>

              {/* News */}
              {briefing.news?.length > 0 && (
                <div style={{ background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 11, padding: 16 }}>
                  <div style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#FFA500", marginBottom: 14 }}>Latest News</div>
                  {briefing.news.map((item, i) => (
                    <div key={i} style={{ paddingBottom: i < briefing.news.length - 1 ? 12 : 0, marginBottom: i < briefing.news.length - 1 ? 12 : 0, borderBottom: i < briefing.news.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, marginTop: 5, background: item.sentiment === "positive" ? "#4ade80" : item.sentiment === "negative" ? "#f87171" : "#facc15", display: "inline-block" }} />
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "0.84rem", color: "#ccc", lineHeight: 1.4 }}>{item.headline}</div>
                          <span style={{ display: "inline-block", marginTop: 3, fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(255,255,255,0.04)", borderRadius: 4, padding: "2px 6px", color: "#555" }}>{item.category}</span>
                        </div>
                      </div>
                      <p style={{ margin: 0, paddingLeft: 15, fontSize: "0.76rem", color: "#555", lineHeight: 1.6 }}>{item.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
