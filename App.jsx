import { useState, useRef, useEffect } from "react";

/* ═══ BRAND ═══ */
const B = {
  d1:"#070a08",d2:"#0c110e",d3:"#111916",
  srf:"#161e1a",card:"#1a2420",
  bdr:"#1e2d25",bdr2:"#2a3d33",
  tx:"#e4e8e6",mu:"#8fa398",dm:"#556b60",
  g:"#2ecc71",gS:"rgba(46,204,113,0.08)",gB:"rgba(46,204,113,0.22)",
  r:"#ff6b6b",a:"#f5a623",s:"#5dadec",
};
const F = {
  d:"'Instrument Serif','Playfair Display',Georgia,serif",
  b:"'DM Sans','Helvetica Neue',sans-serif",
  m:"'JetBrains Mono','Fira Code',monospace",
};

/* ═══ CSS ═══ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=JetBrains+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
::selection{background:${B.g};color:${B.d1}}
html{scroll-behavior:smooth}
a{color:inherit;text-decoration:none}
input:focus{outline:2px solid ${B.g};outline-offset:-2px}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .55s ease-out,transform .55s ease-out}
.reveal.vis{opacity:1;transform:translateY(0)}
.reveal-d1{transition-delay:.07s}.reveal-d2{transition-delay:.14s}.reveal-d3{transition-delay:.21s}.reveal-d4{transition-delay:.28s}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(46,204,113,0)}50%{box-shadow:0 0 20px 4px rgba(46,204,113,0.12)}}
`;

/* ═══ DATA ═══ */
const SECTIONS = [
  {n:"01",id:"problem",title:"The Problem",sub:"Why ~90% of carriers fail at integration — and the numbers.",c:B.r},
  {n:"02",id:"solution",title:"How 8/0 Works",sub:"Agentic data orchestration: connect, interpret, self-heal.",c:B.g},
  {n:"03",id:"proof",title:"Proof Points",sub:"What carrier CTOs and VPs of Claims are already seeing.",c:B.a},
  {n:"04",id:"diagnostic",title:"Your Debt Score",sub:"8 questions. 4 dimensions. Where does your operation stand?",c:B.s},
  {n:"05",id:"feature",title:"Feature",sub:"Your best engineers are becoming middleware plumbers.",c:B.g},
  {n:"06",id:"podcast",title:"Podcast",sub:"Listen — a 10-minute audio companion to this issue.",c:B.s},
  {n:"07",id:"impact",title:"Impact",sub:"Why broken infrastructure is a financial crisis for workers.",c:B.r},
];

const PAIN = [
  {n:"10+",d:"disparate data sources per claim",s:"Each one a potential failure point"},
  {n:"70%",d:"of claims processing is data gathering",s:"Not adjudication. Just finding information."},
  {n:"6–9 mo",d:"to onboard a new employer",s:"At $100K+ per onboarding"},
  {n:"$750K",d:"to build one HRIS integration",s:"Plus $300K/yr to maintain it"},
];

const CAPS = [
  {n:"01",t:"Connect & Learn",d:"AI agents parse vendor API docs, detect schema changes, and map configurations automatically. New employer systems connected in hours, not months.",c:B.g},
  {n:"02",t:"Workflow Interpretation",d:"Translate employer-specific policies, eligibility rules, and operational requirements into structured workflows your systems understand.",c:B.a},
  {n:"03",t:"Monitor & Self-Heal",d:"Agents monitor data flows, detect anomalies, auto-correct mapping errors, and escalate only when confidence is low.",c:B.s},
];

const COMP = [
  {l:"Connectivity per employer",old:"200 hours",nw:"2–5 hours"},
  {l:"Maintenance ratio",old:"1 FTE : 10–20 employers",nw:"1 FTE : 1,000 employers"},
  {l:"Data accuracy",old:"50–75%",nw:"99%"},
];

const PROOF_CARDS = [
  {stat:"+5%",lbl:"Revenue",q:"The differentiation this would provide will command at least 5% top line increase.",a:"CMO, Top-3 Carrier",c:B.g},
  {stat:"−20%",lbl:"Claims Expense",q:"Claims cost us north of $60M/yr. Having direct access to client systems could easily reduce that by 20%.",a:"VP of Claims, Top-3 TPA",c:B.r},
  {stat:"−40%",lbl:"Onboarding Cost",q:"Having a simplified access point to our clients' systems could mean a 40% implementation cost reduction.",a:"CIO, Top-3 Carrier",c:B.a},
];

const ARTICLE = [
  {t:"lede",v:"Somewhere inside every mid-to-large carrier, there's a dev team hired to build smart claims automation. Instead, they spend 60% of their time maintaining point-to-point integrations with TPAs, brokers, and employer platforms that were duct-taped together years ago."},
  {t:"p",v:"Nobody planned it this way. Each integration made sense at the time — a new TPA partner needed an eligibility feed, a broker portal required a status API, an employer group wanted real-time FMLA tracking. But compounded over a decade, the result is a Rube Goldberg machine held together by batch files, SFTP drops, and institutional memory."},
  {t:"q",v:"We have engineers who could be building predictive models for return-to-work timing. Instead they're debugging why a CSV from 2016 started dropping middle initials on Tuesdays.",a:"VP of Technology, Top-15 Group Disability Carrier"},
  {t:"h",v:"The math nobody does"},
  {t:"p",v:"Take your integration team's fully loaded cost. Multiply by the percentage of time on maintenance versus net-new capability. That delta — usually 40–70% of the team's capacity — is your connectivity debt, compounding silently every quarter."},
  {t:"p",v:"It's not a technology problem. It's an architecture problem. Every new partner, every new product line adds another spoke to a hub that was never designed to be a hub."},
  {t:"h",v:"This isn't a build vs. buy conversation"},
  {t:"p",v:"Your systems work. Your team is good. The problem is that your good team is doing work that shouldn't require a good team — or any team. An interoperability layer normalizes data, manages connection state, handles translation. Your engineers stop plumbing and start building again. They become the heroes."},
  {t:"q",v:"The carriers that modernize fastest aren't the ones with the biggest IT budgets. They're the ones that stop asking dev teams to solve infrastructure problems with application code.",a:"Dawn McMaster, 2nd VP, Munich Re"},
];

/* ═══ HOOKS ═══ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function Rev({ children, delay = 0, style = {} }) {
  const r = useReveal();
  return <div ref={r} className={`reveal${delay ? ` reveal-d${delay}` : ""}`} style={style}>{children}</div>;
}

/* ═══ ATOMS ═══ */
const Inner = ({ children, style }) => <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 28px", ...style }}>{children}</div>;
const InnerWide = ({ children, style }) => <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 28px", ...style }}>{children}</div>;

function Tag({ children, color = B.g }) {
  return <span style={{ fontFamily: F.m, fontSize: 10, fontWeight: 500, letterSpacing: 1.5, color, background: color + "15", padding: "3px 10px", borderRadius: 4, textTransform: "uppercase", display: "inline-block" }}>{children}</span>;
}

function SectionNum({ n, title, color, id }) {
  return (
    <div id={id} style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 20, scrollMarginTop: 60 }}>
      <span style={{ fontFamily: F.m, fontSize: 42, fontWeight: 500, color: color + "44", lineHeight: 1 }}>{n}</span>
      <h2 style={{ fontFamily: F.d, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: B.tx, lineHeight: 1.1, letterSpacing: -0.5 }}>{title}</h2>
    </div>
  );
}

function Sub({ email, setEmail, done, setDone }) {
  if (done) return <div style={{ padding: 16, background: B.gS, borderRadius: 8, border: `1px solid ${B.gB}`, textAlign: "center" }}><span style={{ fontFamily: F.b, fontSize: 14, fontWeight: 600, color: B.g }}>You're in. ✓</span></div>;
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input type="email" placeholder="you@carrier.com" value={email} onChange={e => setEmail(e.target.value)}
        style={{ flex: 1, fontFamily: F.b, fontSize: 14, padding: "10px 14px", borderRadius: 8, border: `1px solid ${B.bdr}`, background: B.card, color: B.tx }} />
      <button onClick={() => email.includes("@") && setDone(true)} style={{
        fontFamily: F.b, fontSize: 14, fontWeight: 600, color: B.d1, background: B.g,
        border: "none", borderRadius: 8, padding: "10px 22px", cursor: "pointer",
        opacity: email.includes("@") ? 1 : 0.4,
      }}>Subscribe</button>
    </div>
  );
}

/* ═══ STICKY NAV ═══ */
function StickyNav() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: B.d1 + "ee", backdropFilter: "blur(14px)",
      borderBottom: `1px solid ${B.bdr}`,
    }}>
      <div style={{
        maxWidth: 1000, margin: "0 auto", padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 44,
      }}>
        <a href="#masthead" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: F.m, fontSize: 11, fontWeight: 700, color: B.d1, background: B.g, padding: "2px 7px", borderRadius: 3, letterSpacing: 1 }}>8/0</span>
          <span style={{ fontFamily: F.d, fontSize: 14, color: B.tx }}>The Connector</span>
          <span style={{ fontFamily: F.m, fontSize: 10, color: B.dm }}>· 001</span>
        </a>
        <div style={{ display: "flex", gap: 1, overflow: "auto" }}>
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{ fontFamily: F.m, fontSize: 10, color: B.dm, padding: "4px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>{s.n}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══ MASTHEAD ═══ */
function Masthead() {
  return (
    <section id="masthead" style={{ background: B.d1, padding: "48px 0 0" }}>
      <InnerWide>
        {/* Masthead header */}
        <div style={{ borderBottom: `2px solid ${B.g}`, paddingBottom: 20, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontFamily: F.m, fontSize: 16, fontWeight: 700, color: B.d1, background: B.g, padding: "6px 12px", borderRadius: 5, letterSpacing: 1.5 }}>8/0</span>
              <div>
                <div style={{ fontFamily: F.d, fontSize: "clamp(32px, 5vw, 50px)", fontWeight: 400, color: B.tx, lineHeight: 1, letterSpacing: -1 }}>The Connector</div>
                <div style={{ fontFamily: F.b, fontSize: 13, color: B.dm, marginTop: 4 }}>Published by Eight by Zero · Agentic interoperability for absence & disability</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: F.m, fontSize: 12, color: B.g, letterSpacing: 2 }}>ISSUE 001</div>
              <div style={{ fontFamily: F.b, fontSize: 13, color: B.dm }}>April 2026</div>
            </div>
          </div>
        </div>

        {/* Lead headline + In This Issue */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, paddingBottom: 48 }}>
          {/* Lead */}
          <div>
            <Tag>Inaugural Issue</Tag>
            <h1 style={{ fontFamily: F.d, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: -0.8, color: B.tx, marginTop: 14, marginBottom: 14 }}>
              The data infrastructure holding absence & disability together is breaking.
            </h1>
            <p style={{ fontFamily: F.b, fontSize: 16, color: B.mu, lineHeight: 1.65, marginBottom: 24 }}>
              Every carrier knows it. Most have tried to fix it in-house. This issue maps the problem, the emerging solution, and what the smartest operators are doing about it. Plus: an interactive diagnostic to score your own integration debt.
            </p>
            <div style={{ fontFamily: F.b, fontSize: 13, color: B.dm, fontStyle: "italic" }}>Written by Sam Kasle & JP Carmona · 12 min read</div>
          </div>

          {/* In This Issue */}
          <div style={{ background: B.d3, border: `1px solid ${B.bdr}`, borderRadius: 12, padding: "20px 18px" }}>
            <div style={{ fontFamily: F.m, fontSize: 10, color: B.g, letterSpacing: 2, marginBottom: 14 }}>IN THIS ISSUE</div>
            {SECTIONS.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < SECTIONS.length - 1 ? `1px solid ${B.bdr}` : "none" }}>
                <span style={{ fontFamily: F.m, fontSize: 11, color: s.c, minWidth: 20 }}>{s.n}</span>
                <div>
                  <div style={{ fontFamily: F.b, fontSize: 13, fontWeight: 600, color: B.tx, lineHeight: 1.3 }}>{s.title}</div>
                  <div style={{ fontFamily: F.b, fontSize: 11, color: B.dm, marginTop: 1 }}>{s.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </InnerWide>
    </section>
  );
}

/* ═══ 01 · PROBLEM ═══ */
function Problem() {
  return (
    <section style={{ background: B.d2, padding: "64px 0" }}>
      <InnerWide>
        <Rev><SectionNum n="01" title="The absence & disability ecosystem runs on broken plumbing." color={B.r} id="problem" /></Rev>
        <Rev><p style={{ fontFamily: F.b, fontSize: 16, color: B.mu, lineHeight: 1.65, maxWidth: 600, marginBottom: 40 }}>Every carrier knows it. Most have tried to fix it in-house. ~90% fail. Here's why the numbers don't work.</p></Rev>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 40 }}>
          {PAIN.map((s, i) => (
            <Rev key={i} delay={i + 1}>
              <div style={{ padding: "24px 20px", background: B.d1, border: `1px solid ${B.bdr}`, borderRadius: 12, height: "100%" }}>
                <div style={{ fontFamily: F.d, fontSize: 36, color: B.r, lineHeight: 1, marginBottom: 6 }}>{s.n}</div>
                <div style={{ fontFamily: F.b, fontSize: 13, fontWeight: 600, color: B.tx, marginBottom: 4, lineHeight: 1.35 }}>{s.d}</div>
                <div style={{ fontFamily: F.b, fontSize: 12, color: B.dm, lineHeight: 1.4 }}>{s.s}</div>
              </div>
            </Rev>
          ))}
        </div>
        <Rev>
          <div style={{ padding: "24px 28px", background: B.d1, borderRadius: 12, borderLeft: `3px solid ${B.r}`, marginBottom: 20 }}>
            <p style={{ fontFamily: F.d, fontSize: 18, fontStyle: "italic", lineHeight: 1.55, color: B.tx, marginBottom: 8 }}>
              "Our internal integration with Workday took 9 months and cost us more than $750,000 in engineering — and now we have 2–3 FTEs just to maintain it."
            </p>
            <cite style={{ fontFamily: F.m, fontSize: 11, color: B.r, fontStyle: "normal" }}>— Dir. of Engineering, Top-10 Carrier</cite>
          </div>
        </Rev>
        <Rev>
          <Inner>
            <div style={{ padding: "18px 22px", borderRadius: 8, background: B.gS, border: `1px solid ${B.gB}` }}>
              <p style={{ fontFamily: F.b, fontSize: 13, color: B.g, fontWeight: 600, marginBottom: 3 }}>The structural insight</p>
              <p style={{ fontFamily: F.b, fontSize: 13, color: B.mu, lineHeight: 1.55 }}>
                No one in the ecosystem is incentivized to solve this holistically. Carriers can't justify building integrations to every HR system. HR vendors have no incentive to standardize for carriers. The result: a connectivity vacuum that costs the industry billions.
              </p>
            </div>
          </Inner>
        </Rev>
      </InnerWide>
    </section>
  );
}

/* ═══ 02 · SOLUTION ═══ */
function Solution() {
  return (
    <section style={{ background: B.d1, padding: "64px 0" }}>
      <InnerWide>
        <Rev><SectionNum n="02" title="Hard-coded integrations break. 8/0 agents adapt." color={B.g} id="solution" /></Rev>
        <Rev><p style={{ fontFamily: F.b, fontSize: 16, color: B.mu, lineHeight: 1.65, maxWidth: 600, marginBottom: 40 }}>An agentic data orchestration layer that connects to any employer system, learns its schema, and delivers clean data to your platform — continuously.</p></Rev>

        {/* Architecture */}
        <Rev>
          <div style={{ marginBottom: 40, padding: "32px 28px", background: B.d2, borderRadius: 14, border: `1px solid ${B.bdr}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: F.m, fontSize: 10, color: B.r, letterSpacing: 1.5, marginBottom: 14, textTransform: "uppercase" }}>Employer Ecosystem</div>
                {["HRIS · 20+ vendors", "Payroll · 10+ vendors", "Time & Attendance · 25+ vendors", "Benefits Admin · 5+ vendors"].map((s, i) => (
                  <div key={i} style={{ padding: "9px 14px", background: B.d1, border: `1px solid ${B.bdr}`, borderRadius: 7, marginBottom: 5, fontFamily: F.b, fontSize: 12, color: B.mu }}>{s}</div>
                ))}
              </div>
              <div style={{ textAlign: "center", padding: "0 24px" }}>
                <div style={{ fontSize: 10, color: B.dm, fontFamily: F.m, marginBottom: 6 }}>← data →</div>
                <div style={{ width: 68, height: 68, borderRadius: 14, background: `linear-gradient(135deg,${B.g}22,${B.g}08)`, border: `2px solid ${B.gB}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", animation: "pulseGlow 3s ease-in-out infinite" }}>
                  <span style={{ fontFamily: F.m, fontSize: 16, fontWeight: 700, color: B.g }}>8/0</span>
                </div>
                <div style={{ fontFamily: F.m, fontSize: 9, color: B.g, letterSpacing: 1, marginTop: 6 }}>AI AGENTS</div>
                <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 6 }}>
                  {["MCP", "A2A", "API"].map(p => <span key={p} style={{ fontFamily: F.m, fontSize: 8, color: B.g, padding: "2px 6px", border: `1px solid ${B.gB}`, borderRadius: 3 }}>{p}</span>)}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: F.m, fontSize: 10, color: B.g, letterSpacing: 1.5, marginBottom: 14, textTransform: "uppercase" }}>Carrier / TPA Systems</div>
                {["Policy Administration", "Underwriting", "Claims", "Customer Service Portals"].map((s, i) => (
                  <div key={i} style={{ padding: "9px 14px", background: B.d1, border: `1px solid ${B.bdr}`, borderRadius: 7, marginBottom: 5, fontFamily: F.b, fontSize: 12, color: B.mu }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </Rev>

        {/* Capabilities */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 40 }}>
          {CAPS.map((c, i) => (
            <Rev key={i} delay={i + 1}>
              <div style={{ padding: "28px 22px", background: B.d2, border: `1px solid ${B.bdr}`, borderRadius: 12, borderTop: `3px solid ${c.c}`, height: "100%" }}>
                <div style={{ fontFamily: F.m, fontSize: 11, color: c.c, letterSpacing: 1.5, marginBottom: 12 }}>{c.n}</div>
                <h3 style={{ fontFamily: F.d, fontSize: 20, color: B.tx, marginBottom: 8, lineHeight: 1.2 }}>{c.t}</h3>
                <p style={{ fontFamily: F.b, fontSize: 13, color: B.mu, lineHeight: 1.55 }}>{c.d}</p>
              </div>
            </Rev>
          ))}
        </div>

        {/* Comparison */}
        <Rev>
          <div style={{ background: B.d2, borderRadius: 12, border: `1px solid ${B.bdr}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", borderBottom: `1px solid ${B.bdr}` }}>
              <div style={{ padding: "12px 18px" }} />
              <div style={{ padding: "12px 18px", fontFamily: F.m, fontSize: 10, color: B.r, letterSpacing: 1.5, textAlign: "center", borderLeft: `1px solid ${B.bdr}` }}>LEGACY</div>
              <div style={{ padding: "12px 18px", fontFamily: F.m, fontSize: 10, color: B.g, letterSpacing: 1.5, textAlign: "center", borderLeft: `1px solid ${B.bdr}` }}>WITH 8/0</div>
            </div>
            {COMP.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", borderBottom: i < COMP.length - 1 ? `1px solid ${B.bdr}` : "none" }}>
                <div style={{ padding: "14px 18px", fontFamily: F.b, fontSize: 13, color: B.tx }}>{r.l}</div>
                <div style={{ padding: "14px 18px", fontFamily: F.m, fontSize: 13, color: B.r, textAlign: "center", borderLeft: `1px solid ${B.bdr}`, opacity: .6, textDecoration: "line-through" }}>{r.old}</div>
                <div style={{ padding: "14px 18px", fontFamily: F.m, fontSize: 13, color: B.g, textAlign: "center", fontWeight: 600, borderLeft: `1px solid ${B.bdr}` }}>{r.nw}</div>
              </div>
            ))}
          </div>
        </Rev>
      </InnerWide>
    </section>
  );
}

/* ═══ 03 · PROOF ═══ */
function Proof() {
  return (
    <section style={{ background: B.d2, padding: "64px 0" }}>
      <InnerWide>
        <Rev><SectionNum n="03" title="The people who run this world are already seeing it." color={B.a} id="proof" /></Rev>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 32 }}>
          {PROOF_CARDS.map((q, i) => (
            <Rev key={i} delay={i + 1}>
              <div style={{ padding: "28px 22px", background: B.d1, border: `1px solid ${B.bdr}`, borderRadius: 12, height: "100%" }}>
                <div style={{ fontFamily: F.d, fontSize: 48, color: q.c, lineHeight: 1, marginBottom: 4 }}>{q.stat}</div>
                <div style={{ fontFamily: F.m, fontSize: 10, color: q.c, letterSpacing: 1.5, marginBottom: 16, textTransform: "uppercase" }}>{q.lbl}</div>
                <p style={{ fontFamily: F.d, fontSize: 15, fontStyle: "italic", color: B.tx, lineHeight: 1.5, marginBottom: 10 }}>"{q.q}"</p>
                <cite style={{ fontFamily: F.m, fontSize: 11, color: B.dm, fontStyle: "normal" }}>— {q.a}</cite>
              </div>
            </Rev>
          ))}
        </div>
        <Rev>
          <div style={{ padding: "22px 26px", background: B.d1, borderRadius: 10, borderLeft: `3px solid ${B.s}` }}>
            <p style={{ fontFamily: F.d, fontSize: 16, fontStyle: "italic", lineHeight: 1.5, color: B.tx, marginBottom: 6 }}>
              "A carrier has to approve an employee with chronic migraines for 15-minute breaks, 4 to 5 times per week — getting that right is very complex."
            </p>
            <cite style={{ fontFamily: F.m, fontSize: 11, color: B.s, fontStyle: "normal" }}>— Sr. Director of Claims</cite>
          </div>
        </Rev>
      </InnerWide>
    </section>
  );
}

/* ═══ 04 · DIAGNOSTIC ═══ */
function Diagnostic() {
  const [h, setH] = useState(false);
  return (
    <section style={{ background: B.d1, padding: "64px 0" }}>
      <InnerWide>
        <Rev><SectionNum n="04" title="How deep is your integration debt?" color={B.s} id="diagnostic" /></Rev>
        <Rev>
          <div style={{ padding: "48px 36px", background: `linear-gradient(135deg,${B.d2},${B.d3})`, borderRadius: 16, border: `1px solid ${B.bdr}`, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%,${B.g}06,transparent 65%)`, pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <p style={{ fontFamily: F.b, fontSize: 16, color: B.mu, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 14px" }}>
                8 questions across 4 dimensions — cost burden, coverage gaps, maintenance load, and onboarding speed.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 36, margin: "28px 0 36px", flexWrap: "wrap" }}>
                {[{ n: "01", l: "Cost Burden", c: B.g }, { n: "02", l: "Coverage Gaps", c: B.r }, { n: "03", l: "Maintenance Load", c: B.a }, { n: "04", l: "Onboarding Speed", c: B.s }].map(d => (
                  <div key={d.n}>
                    <div style={{ fontFamily: F.m, fontSize: 20, fontWeight: 500, color: d.c }}>{d.n}</div>
                    <div style={{ fontFamily: F.b, fontSize: 11, color: B.dm, marginTop: 2 }}>{d.l}</div>
                  </div>
                ))}
              </div>
              <a href="https://diagnostic.eightbyzero.com/" target="_blank" rel="noopener noreferrer"
                onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
                style={{ fontFamily: F.b, fontSize: 15, fontWeight: 600, color: B.d1, background: B.g, borderRadius: 10, padding: "14px 40px", display: "inline-block", transition: "transform .15s,box-shadow .15s", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? `0 6px 20px ${B.g}33` : "none" }}>
                Run the Diagnostic →
              </a>
              <p style={{ fontFamily: F.m, fontSize: 10, color: B.dm, marginTop: 16 }}>Takes 3 minutes. Results are private.</p>
            </div>
          </div>
        </Rev>
      </InnerWide>
    </section>
  );
}

/* ═══ 05 · FEATURE ═══ */
function Feature({ email, setEmail, subDone, setSubDone }) {
  const [open, setOpen] = useState(false);
  const pre = ARTICLE.slice(0, 3), rest = ARTICLE.slice(3);
  const renderB = (b, i) => {
    if (b.t === "lede") return <p key={i} style={{ fontFamily: F.b, fontSize: 17, lineHeight: 1.7, color: B.tx, marginBottom: 22, fontWeight: 300, borderLeft: `3px solid ${B.g}`, paddingLeft: 16 }}>{b.v}</p>;
    if (b.t === "p") return <p key={i} style={{ fontFamily: F.b, fontSize: 15, lineHeight: 1.78, color: B.mu, marginBottom: 18 }}>{b.v}</p>;
    if (b.t === "h") return <h3 key={i} style={{ fontFamily: F.d, fontSize: 22, color: B.tx, marginTop: 28, marginBottom: 10 }}>{b.v}</h3>;
    if (b.t === "q") return <blockquote key={i} style={{ margin: "24px 0", padding: "20px 24px", background: B.d1, borderRadius: 10, borderLeft: `3px solid ${B.g}` }}>
      <p style={{ fontFamily: F.d, fontSize: 16, fontStyle: "italic", lineHeight: 1.5, color: B.tx, marginBottom: 6 }}>"{b.v}"</p>
      <cite style={{ fontFamily: F.m, fontSize: 11, color: B.g, fontStyle: "normal" }}>— {b.a}</cite>
    </blockquote>;
    return null;
  };
  return (
    <section style={{ background: B.d2, padding: "64px 0" }}>
      <Inner>
        <Rev><SectionNum n="05" title="Your Best Engineers Are Becoming Middleware Plumbers" color={B.g} id="feature" /></Rev>
        <Rev><p style={{ fontFamily: F.b, fontSize: 14, color: B.dm, marginBottom: 28, fontStyle: "italic" }}>Feature · Issue 001 · 5 min read</p></Rev>
        <Rev>
          <div>
            {pre.map(renderB)}
            {!open && <button onClick={() => setOpen(true)} style={{ fontFamily: F.b, fontSize: 14, fontWeight: 600, color: B.g, background: B.gS, border: `1px solid ${B.gB}`, borderRadius: 8, padding: "10px 24px", cursor: "pointer", marginTop: 4 }}>Continue reading →</button>}
            {open && <>
              {rest.map(renderB)}
              <div style={{ marginTop: 36, padding: "24px", background: B.d1, borderRadius: 12, border: `1px solid ${B.bdr}` }}>
                <p style={{ fontFamily: F.d, fontSize: 18, color: B.tx, marginBottom: 10 }}>Get the next issue of The Connector</p>
                <p style={{ fontFamily: F.b, fontSize: 13, color: B.dm, marginBottom: 14, lineHeight: 1.5 }}>Published biweekly. Each issue maps a different dimension of the interoperability problem. Direct to your inbox.</p>
                <Sub email={email} setEmail={setEmail} done={subDone} setDone={setSubDone} />
              </div>
            </>}
          </div>
        </Rev>
      </Inner>
    </section>
  );
}

/* ═══ 06 · PODCAST ═══ */
function Podcast() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => setProgress(p => { if (p >= 100) { setPlaying(false); return 0; } return p + 0.15; }), 50);
    return () => clearInterval(iv);
  }, [playing]);
  const bars = Array.from({ length: 55 }, (_, i) => Math.max(10, Math.min(55, Math.sin(i * 0.4) * 20 + Math.sin(i * 0.7) * 15 + Math.cos(i * 0.2) * 10 + 30)));
  return (
    <section style={{ background: B.d1, padding: "64px 0" }}>
      <InnerWide>
        <Rev><SectionNum n="06" title="Same story. Easier to consume." color={B.s} id="podcast" /></Rev>
        <Rev>
          <div style={{ padding: "24px", background: B.d2, borderRadius: 14, border: `1px solid ${B.bdr}`, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 8, background: `linear-gradient(135deg,${B.g}22,${B.s}22)`, border: `1px solid ${B.gB}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: F.m, fontSize: 12, fontWeight: 700, color: B.g }}>8/0</span>
                </div>
                <div>
                  <div style={{ fontFamily: F.b, fontSize: 14, fontWeight: 600, color: B.tx }}>Your Best Engineers Are Becoming Middleware Plumbers</div>
                  <div style={{ fontFamily: F.m, fontSize: 10, color: B.dm }}>Episode 001 · 10:24</div>
                </div>
              </div>
              <Tag color={B.s}>PILOT</Tag>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => setPlaying(!playing)} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: B.g, color: B.d1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{playing ? "❚❚" : "▶"}</button>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 1.5, height: 48 }}>
                {bars.map((h, i) => <div key={i} style={{ width: 3, height: h + "%", borderRadius: 2, background: i / bars.length < progress / 100 ? B.g : B.bdr2, flexShrink: 0 }} />)}
              </div>
              <span style={{ fontFamily: F.m, fontSize: 11, color: B.dm, flexShrink: 0 }}>{playing ? `${Math.floor(progress / 100 * 10)}:${String(Math.floor((progress / 100 * 24) % 60)).padStart(2, "0")}` : "10:24"}</span>
            </div>
            <div style={{ marginTop: 10, height: 3, background: B.bdr, borderRadius: 2, overflow: "hidden", cursor: "pointer" }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProgress((e.clientX - r.left) / r.width * 100); }}>
              <div style={{ height: "100%", width: `${progress}%`, background: B.g, borderRadius: 2 }} />
            </div>
          </div>
        </Rev>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Rev delay={1}>
            <div style={{ padding: "20px", background: B.d2, borderRadius: 12, border: `1px solid ${B.bdr}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><Tag color={B.g}>EP 001</Tag><span style={{ fontFamily: F.m, fontSize: 10, color: B.dm }}>April 2026 · 10:24</span></div>
              <h4 style={{ fontFamily: F.d, fontSize: 17, color: B.tx, lineHeight: 1.25, marginBottom: 6 }}>Your Best Engineers Are Becoming Middleware Plumbers</h4>
              <p style={{ fontFamily: F.b, fontSize: 12, color: B.dm, lineHeight: 1.5 }}>Sam and JP break down why 60% of carrier dev capacity goes to integration maintenance and why this isn't a build vs. buy conversation.</p>
            </div>
          </Rev>
          <Rev delay={2}>
            <div style={{ padding: "20px", background: B.d2, borderRadius: 12, border: `1px solid ${B.bdr}`, opacity: .45 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><Tag color={B.a}>EP 002</Tag><span style={{ fontFamily: F.m, fontSize: 10, color: B.dm }}>Coming May 2026</span></div>
              <h4 style={{ fontFamily: F.d, fontSize: 17, color: B.tx, lineHeight: 1.25, marginBottom: 6 }}>The Broker Channel Is Quietly Forcing Carriers to Interoperate</h4>
              <p style={{ fontFamily: F.b, fontSize: 12, color: B.dm, lineHeight: 1.5 }}>How distribution pressure is doing what IT roadmaps couldn't.</p>
            </div>
          </Rev>
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontFamily: F.m, fontSize: 10, color: B.dm, letterSpacing: 1 }}>COMING SOON ON</span>
          {["Apple Podcasts", "Spotify", "YouTube"].map(p => <span key={p} style={{ fontFamily: F.b, fontSize: 11, color: B.dm, padding: "5px 12px", background: B.card, border: `1px solid ${B.bdr}`, borderRadius: 5 }}>{p}</span>)}
        </div>
      </InnerWide>
    </section>
  );
}

/* ═══ 07 · IMPACT ═══ */
function Impact() {
  return (
    <section style={{ background: B.d2, padding: "64px 0" }}>
      <InnerWide>
        <Rev><SectionNum n="07" title="Every improvement hits hardest for the people at the bottom." color={B.r} id="impact" /></Rev>
        <Rev><p style={{ fontFamily: F.b, fontSize: 16, color: B.mu, lineHeight: 1.65, maxWidth: 600, marginBottom: 40 }}>Broken data infrastructure isn't just an operations problem. It's a financial crisis for the workers this system was built to protect.</p></Rev>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 40 }}>
          {[{ n: "59%", d: "of Americans can't cover a $1K emergency", c: B.r }, { n: "72.8%", d: "of workers under $50K live paycheck to paycheck", c: B.r }, { n: "4–8 wks", d: "from last paycheck to first benefit", c: B.a }, { n: "231 days", d: "average SSDI processing — up from 110", c: B.a }].map((s, i) => (
            <Rev key={i} delay={i + 1}>
              <div style={{ padding: "22px 18px", background: B.d1, borderRadius: 10, border: `1px solid ${B.bdr}`, height: "100%" }}>
                <div style={{ fontFamily: F.d, fontSize: 30, color: s.c, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: F.b, fontSize: 12, color: B.mu, marginTop: 6, lineHeight: 1.4 }}>{s.d}</div>
              </div>
            </Rev>
          ))}
        </div>

        <Rev>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 40 }}>
            <div style={{ padding: "28px 24px", background: B.d1, borderRadius: 12, borderTop: `3px solid ${B.r}` }}>
              <div style={{ fontFamily: F.m, fontSize: 10, color: B.r, letterSpacing: 1.5, marginBottom: 12 }}>TODAY</div>
              <div style={{ fontFamily: F.d, fontSize: 28, color: B.tx, marginBottom: 4 }}>10–15+</div>
              <p style={{ fontFamily: F.b, fontSize: 13, color: B.mu, marginBottom: 16 }}>individual touchpoints per claim</p>
              <div style={{ fontFamily: F.d, fontSize: 28, color: B.tx, marginBottom: 4 }}>$2,900–$4,600</div>
              <p style={{ fontFamily: F.b, fontSize: 13, color: B.mu }}>lost income during delays for a $38K worker</p>
            </div>
            <div style={{ padding: "28px 24px", background: B.d1, borderRadius: 12, borderTop: `3px solid ${B.g}` }}>
              <div style={{ fontFamily: F.m, fontSize: 10, color: B.g, letterSpacing: 1.5, marginBottom: 12 }}>WITH 8/0</div>
              <div style={{ fontFamily: F.d, fontSize: 28, color: B.tx, marginBottom: 4 }}>1 entry</div>
              <p style={{ fontFamily: F.b, fontSize: 13, color: B.mu, marginBottom: 16 }}>Eligibility auto-confirmed. Claim opens instantly.</p>
              <div style={{ fontFamily: F.d, fontSize: 28, color: B.tx, marginBottom: 4 }}>Days, not weeks</div>
              <p style={{ fontFamily: F.b, fontSize: 13, color: B.mu }}>Gap compressed to elimination period only.</p>
            </div>
          </div>
        </Rev>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { t: "Speed", c: B.g, d: "Compresses delays from weeks to days. Preserves $1,450–$2,900 in take-home pay that would otherwise go to late fees, overdrafts, or predatory lending." },
            { t: "Accuracy", c: B.s, d: "Eliminates data-driven denials at the source — stale files, salary mismatches, ambiguous job codes. Prevents financial injuries to workers who can't appeal." },
            { t: "Access", c: B.a, d: "Enables carriers to deliver supplemental products ($6–$70/mo) to the lower-income workers they were designed for. Clean data makes it viable at scale." },
          ].map((c, i) => (
            <Rev key={i} delay={i + 1}>
              <div style={{ padding: "24px 20px", background: B.d1, border: `1px solid ${B.bdr}`, borderRadius: 12, borderTop: `3px solid ${c.c}`, height: "100%" }}>
                <h4 style={{ fontFamily: F.d, fontSize: 20, color: B.tx, marginBottom: 8 }}>{c.t}</h4>
                <p style={{ fontFamily: F.b, fontSize: 13, color: B.mu, lineHeight: 1.55 }}>{c.d}</p>
              </div>
            </Rev>
          ))}
        </div>

        <Rev>
          <div style={{ padding: "22px 26px", background: B.d1, borderRadius: 10, borderLeft: `3px solid ${B.a}` }}>
            <p style={{ fontFamily: F.d, fontSize: 16, fontStyle: "italic", lineHeight: 1.5, color: B.tx, marginBottom: 6 }}>
              "Financial services should provide stability, not stress. But too often, gaps in the system leave families struggling with everyday financial shocks."
            </p>
            <cite style={{ fontFamily: F.m, fontSize: 11, color: B.a, fontStyle: "normal" }}>— Vikas Raj, Co-Founder, ResilienceVC</cite>
          </div>
        </Rev>
      </InnerWide>
    </section>
  );
}

/* ═══ FOOTER ═══ */
function Footer({ email, setEmail, subDone, setSubDone }) {
  return (
    <footer style={{ background: B.d1, borderTop: `1px solid ${B.bdr}`, padding: "48px 0 28px" }}>
      <InnerWide>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, marginBottom: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: F.m, fontSize: 12, fontWeight: 700, color: B.d1, background: B.g, padding: "3px 8px", borderRadius: 3 }}>8/0</span>
              <span style={{ fontFamily: F.d, fontSize: 15, color: B.tx }}>Eight by Zero</span>
            </div>
            <p style={{ fontFamily: F.b, fontSize: 13, color: B.dm, lineHeight: 1.5, maxWidth: 320, marginBottom: 14 }}>The intelligent data layer for carriers and TPAs. Agentic interoperability for absence & disability.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href="mailto:sam@eightbyzero.com" style={{ fontFamily: F.m, fontSize: 11, color: B.g, padding: "5px 10px", border: `1px solid ${B.gB}`, borderRadius: 4 }}>sam@eightbyzero.com</a>
              <a href="https://eightbyzero.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: F.m, fontSize: 11, color: B.dm, padding: "5px 10px", border: `1px solid ${B.bdr}`, borderRadius: 4 }}>eightbyzero.com</a>
            </div>
          </div>
          <div style={{ background: B.d2, borderRadius: 12, border: `1px solid ${B.bdr}`, padding: "20px" }}>
            <p style={{ fontFamily: F.d, fontSize: 18, color: B.tx, marginBottom: 8 }}>Get the next issue</p>
            <p style={{ fontFamily: F.b, fontSize: 12, color: B.dm, marginBottom: 12, lineHeight: 1.5 }}>Published biweekly. No spam. Just The Connector.</p>
            <Sub email={email} setEmail={setEmail} done={subDone} setDone={setSubDone} />
          </div>
        </div>
        <div style={{ paddingTop: 16, borderTop: `1px solid ${B.bdr}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontFamily: F.m, fontSize: 10, color: B.dm }}>© 2026 EightByZero</span>
          <div style={{ display: "flex", gap: 14 }}>
            {SECTIONS.map(s => <a key={s.id} href={`#${s.id}`} style={{ fontFamily: F.m, fontSize: 10, color: B.dm }}>{s.n} {s.title}</a>)}
          </div>
        </div>
      </InnerWide>
    </footer>
  );
}

/* ═══ APP ═══ */
export default function App() {
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);
  return (
    <div style={{ background: B.d1, minHeight: "100vh", fontFamily: F.b, color: B.tx }}>
      <style>{css}</style>
      <StickyNav />
      <Masthead />
      <Problem />
      <Solution />
      <Proof />
      <Diagnostic />
      <Feature email={email} setEmail={setEmail} subDone={subDone} setSubDone={setSubDone} />
      <Podcast />
      <Impact />
      <Footer email={email} setEmail={setEmail} subDone={subDone} setSubDone={setSubDone} />
    </div>
  );
}
