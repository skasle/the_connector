import { useState, useRef, useEffect } from "react";

/* ═══ BRAND (shared with Issue 001) ═══ */
const B = {
  black:"#070a08",grey:"#141a16",card:"#1a2320",cardLt:"#1f2a26",
  bdr:"#243029",bdr2:"#2f3f37",
  tx:"#e4e8e6",mu:"#8ea398",dm:"#556b60",
  g:"#2ecc71",gS:"rgba(46,204,113,0.07)",gB:"rgba(46,204,113,0.2)",
  r:"#ff6b6b",a:"#f5a623",s:"#5dadec",
};
const F = {
  d:"'Instrument Serif','Playfair Display',Georgia,serif",
  b:"'DM Sans','Helvetica Neue',sans-serif",
  m:"'JetBrains Mono','Fira Code',monospace",
};
const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=JetBrains+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${B.g};color:${B.black}}html{scroll-behavior:smooth}a{color:inherit;text-decoration:none}input:focus{outline:2px solid ${B.g};outline-offset:-2px}
.reveal{opacity:0;transform:translateY(16px);transition:opacity .5s ease-out,transform .5s ease-out}.reveal.vis{opacity:1;transform:translateY(0)}
.reveal-d1{transition-delay:.06s}.reveal-d2{transition-delay:.12s}.reveal-d3{transition-delay:.18s}.reveal-d4{transition-delay:.24s}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(46,204,113,0)}50%{box-shadow:0 0 16px 3px rgba(46,204,113,0.1)}}
#progress-bar{position:fixed;top:0;left:0;height:3px;background:${B.g};z-index:200;transition:width .1s linear;width:0}
.diag-strip-btn:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(46,204,113,0.3)}
.issue-nav-link:hover{color:${B.tx} !important}
`;

/* ═══ DATA ═══ */
const ISSUES = [
  { n:"001", label:"April 2026", title:"Your Best Engineers Are Becoming Middleware Plumbers", href:"https://connector.eightbyzero.com/issues/001" },
  { n:"002", label:"May 2026",   title:"When Your Vendor Pivots, Who Pays?", href:"#", current:true },
];

const TOC = [
  {n:"01",id:"problem",  t:"The Vendor Pivot",      s:"One announcement. Your integration gone.",       c:B.r},
  {n:"02",id:"carrier",  t:"The Carrier's Blind Spot",s:"The infrastructure problem carriers can't solve alone.", c:B.a},
  {n:"03",id:"solution", t:"What Real-Time Costs",   s:"The flat-file question nobody answers upfront.",  c:B.g},
  {n:"04",id:"field",    t:"Field Notes",            s:"The same answer from two people who didn't compare notes.", c:B.s},
  {n:"05",id:"diagnostic",t:"Debt Score",            s:"4 dimensions. Where are you?",                  c:B.s},
  {n:"06",id:"feature",  t:"Feature Article",        s:"The vendor pivot nobody planned for.",           c:B.g},
];

const PAIN = [
  {n:"$750K",d:"to build one HRIS integration",     s:"Plus $300K/yr to maintain it"},
  {n:"20+",  d:"HRIS platforms in a mid-market book",s:"Each one a potential rebuild when it pivots"},
  {n:"0 days",d:"notice before a vendor changes their model",s:"It's announced when it's already decided"},
  {n:"9 mo", d:"average timeline to rebuild a broken integration",s:"Your engineers — not building claims automation"},
];

const SYNC_Q = [
  "What format does the file arrive in — CSV, fixed-width, pipe-delimited?",
  "Is it a full snapshot or a delta of changes only?",
  "Who controls the export schedule — the employer, the HRIS, or the TPA?",
  "What's the acceptable latency — if the file arrives at midnight, when must it be reflected?",
  "What happens when a record in the incoming file contradicts what's already in Salesforce?",
  "Who owns the SFTP credentials and directory — the employer or the TPA?",
  "Are field names standardized across all clients on the same platform, or does each employer configure their own export?",
  "Who do you contact when a file is malformed or missing?",
];

const ARTICLE = [
  {t:"lede", v:"A carrier recently learned that its primary HRIS vendor was moving to a 'new offering.' Not a warning. A fact. The integration they'd built SLAs around — deprecated. The eligibility feed their claims team depended on — renegotiated unilaterally. This is not an edge case. It is the product roadmap."},
  {t:"p",    v:"Every HRIS vendor is a software company. Software companies pivot. They sunset legacy APIs, launch enterprise tiers that change pricing without notice, or get acquired by a platform that reorients their product entirely. The carrier had no seat at the table when that decision was made."},
  {t:"q",    v:"We built a direct Workday integration over 9 months. Then Workday changed their API model and we had to rebuild the data layer from scratch. The team that was supposed to be working on AI-assisted adjudication spent the entire quarter on infrastructure we'd already paid for.", a:"Director of Engineering, Top-10 Group Disability Carrier"},
  {t:"h",    v:"The math that doesn't get done"},
  {t:"p",    v:"Take the number of HRIS vendors represented in your employer book. Multiply by the cost to build and maintain a single integration. A mid-market carrier touching 20+ HR platforms is carrying a potential rebuild liability measured in the tens of millions — held together by point-to-point connections that were never designed to survive a vendor product decision."},
  {t:"p",    v:"This is not a technology problem. It's an architecture problem. Each integration made sense individually. Compounded over years, across dozens of employers and half a dozen vendors, the result is a Rube Goldberg machine held in place by institutional memory and maintenance contracts."},
  {t:"h",    v:"The carriers who don't have this problem"},
  {t:"p",    v:"The carriers navigating vendor pivots without crises have made one architectural decision: they don't own HRIS connectivity directly. A normalized data layer handles vendor changes upstream — so when Workday pivots, it's someone else's rebuild. When a new employer brings an HRIS the carrier has never seen, it's covered."},
  {t:"q",    v:"The middleware doesn't take the spotlight. It just makes sure the carrier gets to keep it.", a:"Dawn McMaster, 2nd VP, Munich Re"},
  {t:"p",    v:"The carriers who look like operational superheroes to their employer clients aren't doing more engineering work. They're doing less of it, in exactly the right places — and letting someone else own the infrastructure problem that was never theirs to solve."},
];

/* ═══ HOOKS ═══ */
function useReveal(){
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if(!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if(e.isIntersecting){ e.target.classList.add("vis"); obs.unobserve(e.target); }
    }, {threshold:.08});
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}
function Rev({children, delay=0, style={}}){
  const r = useReveal();
  return <div ref={r} className={`reveal${delay ? ` reveal-d${delay}` : ""}`} style={style}>{children}</div>;
}
function useProgress(){
  useEffect(() => {
    const bar = document.getElementById("progress-bar"); if(!bar) return;
    const u = () => { const h = document.documentElement.scrollHeight - window.innerHeight; bar.style.width = h > 0 ? `${(window.scrollY/h)*100}%` : "0%"; };
    window.addEventListener("scroll", u, {passive:true}); return () => window.removeEventListener("scroll", u);
  }, []);
}

/* ═══ ATOMS ═══ */
const W = ({children, style}) => <div style={{maxWidth:940, margin:"0 auto", padding:"0 28px", ...style}}>{children}</div>;
const N = ({children, style}) => <div style={{maxWidth:720, margin:"0 auto", padding:"0 28px", ...style}}>{children}</div>;
const P = ({children}) => <Rev><p style={{fontFamily:F.b, fontSize:15, color:B.mu, lineHeight:1.75, marginBottom:18}}>{children}</p></Rev>;

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz4gEEB_-9mbYsIcuwgYuu6C4c2xAyrdrRnbPxswmdMoelQ7UNcxUXlT0P4fbeWiAUo/exec";
function Sub({email, setEmail, done, setDone}){
  const [sending, setSending] = useState(false);
  if(done) return <div style={{padding:14, background:B.gS, borderRadius:6, border:`1px solid ${B.gB}`, textAlign:"center"}}><span style={{fontFamily:F.b, fontSize:13, fontWeight:600, color:B.g}}>You're in. ✓</span></div>;
  const submit = () => {
    if(!email.includes("@") || sending) return;
    setSending(true);
    new Image().src = SHEET_URL + "?email=" + encodeURIComponent(email) + "&source=connector-002&t=" + Date.now();
    setTimeout(() => setDone(true), 800);
  };
  return <div style={{display:"flex", gap:8}}>
    <input type="email" placeholder="you@carrier.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} style={{flex:1, fontFamily:F.b, fontSize:13, padding:"9px 12px", borderRadius:6, border:`1px solid ${B.bdr}`, background:B.card, color:B.tx}}/>
    <button onClick={submit} style={{fontFamily:F.b, fontSize:13, fontWeight:600, color:B.black, background:B.g, border:"none", borderRadius:6, padding:"9px 20px", cursor:"pointer", opacity:email.includes("@") ? 1 : .4}}>{sending ? "..." : "Subscribe"}</button>
  </div>;
}

function SectionBreak({n, title, color, id, total="06"}){
  return <div id={id} style={{scrollMarginTop:16, maxWidth:940, margin:"0 auto", padding:"0 28px"}}>
    <div style={{height:3, background:`linear-gradient(90deg,${color},${color}44)`, borderRadius:2}}/>
    <div style={{display:"flex", alignItems:"center", gap:10, padding:"14px 0 6px"}}>
      <span style={{fontFamily:F.m, fontSize:11, color, letterSpacing:1.5}}>SECTION {n} OF {total}</span>
      <span style={{fontFamily:F.m, fontSize:11, color:B.dm}}>—</span>
      <span style={{fontFamily:F.m, fontSize:11, color:B.dm, letterSpacing:.5, textTransform:"uppercase"}}>{title}</span>
    </div>
  </div>;
}

function Quote({text, attr, color}){
  return <Rev><div style={{padding:"22px 24px", background:B.black, borderRadius:10, borderLeft:`3px solid ${color}`, marginBottom:20}}>
    <p style={{fontFamily:F.d, fontSize:17, fontStyle:"italic", lineHeight:1.55, color:B.tx, marginBottom:6}}>"{text}"</p>
    <cite style={{fontFamily:F.m, fontSize:10, color, fontStyle:"normal"}}>— {attr}</cite>
  </div></Rev>;
}

function Expand({children, label="Continue reading"}){
  const [open, setOpen] = useState(false);
  return <>{!open && <div style={{textAlign:"center", padding:"12px 0 0"}}><button onClick={() => setOpen(true)} style={{fontFamily:F.b, fontSize:13, fontWeight:600, color:B.g, background:B.gS, border:`1px solid ${B.gB}`, borderRadius:6, padding:"9px 24px", cursor:"pointer"}}>{label} ↓</button></div>}{open && children}</>;
}

/* ═══ ISSUE NAV ═══ */
function IssueNav(){
  return <div style={{background:B.card, borderBottom:`1px solid ${B.bdr}`, position:"sticky", top:0, zIndex:300}}>
    <W>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", height:40}}>
        <a href="https://connector.eightbyzero.com" style={{fontFamily:F.m, fontSize:9, color:B.dm, letterSpacing:1.5, textTransform:"uppercase"}}>The Connector</a>
        <div style={{display:"flex", alignItems:"center", gap:0}}>
          {ISSUES.map((iss, i) => <a
            key={iss.n}
            href={iss.href}
            className="issue-nav-link"
            style={{
              fontFamily:F.m, fontSize:10, letterSpacing:.8,
              color: iss.current ? B.g : B.dm,
              padding:"0 14px",
              borderLeft: i > 0 ? `1px solid ${B.bdr}` : "none",
              fontWeight: iss.current ? 500 : 400,
              transition:"color .15s",
            }}
          >Issue {iss.n}{iss.current ? " ←" : ""}</a>)}
        </div>
      </div>
    </W>
  </div>;
}

/* ═══ DIAGNOSTIC STRIP ═══ */
function DiagnosticStrip(){
  const DIMS = [
    {n:"Cost Burden",c:B.g},{n:"Coverage Gaps",c:B.r},
    {n:"Maintenance",c:B.a},{n:"Onboarding",c:B.s},
  ];
  return <div style={{borderTop:`1px solid ${B.bdr}`, borderBottom:`2px solid ${B.bdr}`, background:`linear-gradient(90deg,${B.grey} 0%,${B.card} 50%,${B.grey} 100%)`, position:"relative", overflow:"hidden"}}>
    <div style={{position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"60%", height:"100%", background:`radial-gradient(ellipse at 50% 50%,${B.g}06,transparent 70%)`, pointerEvents:"none"}}/>
    <W style={{position:"relative"}}>
      <div style={{display:"grid", gridTemplateColumns:"auto 1fr auto", alignItems:"center", gap:28, padding:"16px 0"}}>
        <div>
          <div style={{fontFamily:F.m, fontSize:9, color:B.g, letterSpacing:2.5, textTransform:"uppercase", marginBottom:3}}>Integration Debt Diagnostic</div>
          <div style={{fontFamily:F.b, fontSize:11, color:B.dm}}>8 questions · 3 minutes · private results</div>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:0, borderLeft:`1px solid ${B.bdr}`, borderRight:`1px solid ${B.bdr}`, padding:"0 28px"}}>
          {DIMS.map((d,i) => <div key={d.n} style={{display:"flex", alignItems:"center", gap:0}}>
            {i > 0 && <span style={{fontFamily:F.m, fontSize:10, color:B.bdr2, margin:"0 12px"}}>·</span>}
            <div style={{fontFamily:F.m, fontSize:9, color:d.c, letterSpacing:1, textTransform:"uppercase"}}>{d.n}</div>
          </div>)}
        </div>
        <a href="https://diagnostic.eightbyzero.com/" target="_blank" rel="noopener noreferrer" className="diag-strip-btn"
          style={{fontFamily:F.b, fontSize:12, fontWeight:700, color:B.black, background:B.g, borderRadius:6, padding:"10px 22px", display:"inline-block", transition:"transform .15s,box-shadow .15s", whiteSpace:"nowrap", letterSpacing:.3}}>
          Score Your Operation →
        </a>
      </div>
    </W>
  </div>;
}

/* ═══ MASTHEAD ═══ */
function Masthead(){
  return <section style={{background:B.black, paddingTop:40}}>
    <W>
      <div style={{textAlign:"center", paddingBottom:24, borderBottom:`2px solid ${B.g}`}}>
        <div style={{fontFamily:F.m, fontSize:11, color:B.g, letterSpacing:3, marginBottom:8}}>EIGHT BY ZERO PRESENTS</div>
        <div style={{fontFamily:F.d, fontSize:"clamp(40px,6vw,64px)", fontWeight:400, color:B.tx, lineHeight:1, letterSpacing:-2}}>The Connector</div>
        <div style={{fontFamily:F.b, fontSize:13, color:B.dm, marginTop:8}}>Agentic interoperability for absence & disability insurance</div>
      </div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${B.bdr}`}}>
        <div style={{fontFamily:F.m, fontSize:11, color:B.mu, letterSpacing:1}}>ISSUE 002 · MAY 2026</div>
        <div style={{fontFamily:F.b, fontSize:12, color:B.dm}}>Eight by Zero</div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 300px", gap:40, padding:"36px 0 32px"}}>
        <div>
          <h1 style={{fontFamily:F.d, fontSize:"clamp(28px,4vw,44px)", fontWeight:400, lineHeight:1.1, letterSpacing:-.5, color:B.tx, marginBottom:10}}>Your HRIS vendor just changed their product. Your integration just broke. Nobody warned you.</h1>
          <h2 style={{fontFamily:F.d, fontSize:"clamp(16px,2vw,22px)", fontWeight:400, fontStyle:"italic", lineHeight:1.35, color:B.mu, marginBottom:16}}>This issue maps the vendor dependency trap — and what a different architecture looks like when the pivot comes.</h2>
          <p style={{fontFamily:F.b, fontSize:15, color:B.mu, lineHeight:1.65, marginBottom:20}}>Inside: the real cost of point-to-point integrations, what "real-time sync" actually requires underneath, a field note from two conversations that weren't supposed to converge, and why the carriers who survive vendor pivots aren't working harder — just differently.</p>
          <div style={{fontFamily:F.b, fontSize:13, color:B.dm}}>10 min read · <a href="#diagnostic" style={{color:B.g}}>Jump to the Diagnostic →</a></div>
        </div>
        <div style={{background:B.grey, border:`1px solid ${B.bdr}`, borderRadius:10, padding:"18px 16px"}}>
          <div style={{fontFamily:F.m, fontSize:10, color:B.g, letterSpacing:2, marginBottom:12}}>IN THIS ISSUE</div>
          {TOC.map((s,i) => <a key={s.id} href={`#${s.id}`} style={{display:"flex", gap:8, padding:"8px 0", borderBottom:i < TOC.length-1 ? `1px solid ${B.bdr}` : "none"}}>
            <span style={{fontFamily:F.m, fontSize:11, color:s.c, minWidth:18}}>{s.n}</span>
            <div>
              <div style={{fontFamily:F.b, fontSize:12, fontWeight:600, color:B.tx, lineHeight:1.3}}>{s.t}</div>
              <div style={{fontFamily:F.b, fontSize:10, color:B.dm, marginTop:1}}>{s.s}</div>
            </div>
          </a>)}
        </div>
      </div>
    </W>
    <DiagnosticStrip/>
  </section>;
}

/* ═══ 01 · VENDOR PIVOT ═══ */
function S01(){
  return <section style={{background:B.grey, padding:"20px 0 56px"}}>
    <SectionBreak n="01" title="The Vendor Pivot" color={B.r} id="problem"/>
    <W style={{paddingTop:28}}>
      <Rev><h2 style={{fontFamily:F.d, fontSize:"clamp(24px,3.5vw,36px)", color:B.tx, lineHeight:1.15, marginBottom:12, maxWidth:620}}>One product announcement. One integration gone. Your engineers rebuilding infrastructure they already built.</h2></Rev>
      <Rev><p style={{fontFamily:F.b, fontSize:15, color:B.mu, lineHeight:1.65, maxWidth:560, marginBottom:24}}>Point-to-point integrations are, by design, fragile. They don't degrade gracefully. When the endpoint on the other side changes, your side breaks. Four numbers explain what's at stake.</p></Rev>
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:8}}>
        {PAIN.map((s,i) => <Rev key={i} delay={i+1}><div style={{padding:"22px 18px", background:B.black, border:`1px solid ${B.bdr}`, borderRadius:10, height:"100%"}}>
          <div style={{fontFamily:F.d, fontSize:34, color:B.r, lineHeight:1, marginBottom:6}}>{s.n}</div>
          <div style={{fontFamily:F.b, fontSize:12, fontWeight:600, color:B.tx, marginBottom:4, lineHeight:1.35}}>{s.d}</div>
          <div style={{fontFamily:F.b, fontSize:11, color:B.dm, lineHeight:1.4}}>{s.s}</div>
        </div></Rev>)}
      </div>
    </W>
    <Expand label="Read the full analysis">
      <N style={{paddingTop:24}}>
        <P>Every carrier has a version of this story. A primary HRIS vendor announces a platform migration. Or a pricing change. Or a sunset of the legacy API your team has been running against since 2018. The carrier's integration team — the same team that was supposed to be building smarter automation — spends the next quarter rebuilding what they already had.</P>
        <P>The economics compound fast. A single HRIS integration costs roughly $750K to build and $300K per year to maintain. A mid-market carrier with 20+ HRIS vendors in its employer book is carrying rebuild liability measured in the tens of millions — distributed across point-to-point connections that weren't designed to survive a vendor product decision.</P>
        <Quote text="We built a direct Workday integration over 9 months. Then Workday changed their API model and we had to rebuild the data layer from scratch. The team that was supposed to be working on AI-assisted adjudication spent the entire quarter on infrastructure we'd already paid for." attr="Director of Engineering, Top-10 Group Disability Carrier" color={B.r}/>
        <P>The structural problem isn't the vendor. Vendors pivot. That's what software companies do. The problem is the architecture that puts the carrier on the wrong end of that pivot — owning the rebuild cost, absorbing the downtime, and explaining to employers why eligibility verification is broken while the carrier's engineering team works through the backlog.</P>
        <Rev><div style={{padding:"16px 20px", borderRadius:8, background:B.gS, border:`1px solid ${B.gB}`}}>
          <p style={{fontFamily:F.b, fontSize:12, color:B.g, fontWeight:600, marginBottom:3}}>The structural insight</p>
          <p style={{fontFamily:F.b, fontSize:12, color:B.mu, lineHeight:1.55}}>Carriers who don't have this problem have made one architectural choice: they don't own HRIS connectivity directly. A normalized data layer absorbs vendor changes upstream. When a vendor pivots, it's someone else's rebuild — and the carrier's engineering team stays focused on claims.</p>
        </div></Rev>
      </N>
    </Expand>
  </section>;
}

/* ═══ 02 · CARRIER BLIND SPOT ═══ */
function S02(){
  return <section style={{background:B.black, padding:"20px 0 56px"}}>
    <SectionBreak n="02" title="The Carrier's Blind Spot" color={B.a} id="carrier"/>
    <N style={{paddingTop:28}}>
      <Rev>
        <h2 style={{fontFamily:F.d, fontSize:"clamp(24px,3.5vw,34px)", color:B.tx, lineHeight:1.15, marginBottom:8}}>The carrier built a great experience. The data showed up unworthy of it.</h2>
        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:24, paddingBottom:18, borderBottom:`1px solid ${B.bdr}`}}>
          <div style={{width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${B.a}22,${B.a}0a)`, border:`1px solid ${B.a}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
            <span style={{fontFamily:F.m, fontSize:10, color:B.a, fontWeight:700}}>DM</span>
          </div>
          <div>
            <div style={{fontFamily:F.b, fontSize:13, fontWeight:600, color:B.tx}}>Dawn McMaster</div>
            <div style={{fontFamily:F.m, fontSize:10, color:B.dm}}>2nd VP, Munich Re · 4 min read</div>
          </div>
        </div>
      </Rev>
      <Rev>
        <p style={{fontFamily:F.b, fontSize:16, lineHeight:1.7, color:B.tx, marginBottom:20, fontWeight:300, borderLeft:`3px solid ${B.a}`, paddingLeft:16}}>Carriers invest seriously in the claimant experience. The problem upstream from them — in the employer-to-carrier data layer — is harder to solve, because it sits outside the carrier's control. That's not a failure. That's a structural gap.</p>
      </Rev>
    </N>
    <Expand label="Read the full essay">
      <N style={{paddingTop:24}}>
        <P>The inbox intake looks good. The claims adjudicator knows what they're doing. The physician outreach process is thorough. When a carrier has done the work on the claimant experience, that work is real. The problem isn't what happens during the claim — it's what happens before it arrives.</P>
        <P>When the carrier pulls the employer's census file to verify eligibility, it may be 30 to 90 days old. The job code in the HR system doesn't match the classification in the policy. The salary figure conflicts with what payroll reported last quarter. None of this is anyone's fault. It's what happens when two systems that were never designed to talk to each other are expected to share data in real time.</P>
        <blockquote style={{margin:"22px 0", padding:"18px 22px", background:B.card, borderRadius:10, borderLeft:`3px solid ${B.a}`}}>
          <p style={{fontFamily:F.d, fontSize:15, fontStyle:"italic", lineHeight:1.5, color:B.tx, marginBottom:6}}>"We can't solve the challenges associated with acquiring medical data. But we can eliminate the reconciliation chaos that slows everything down before a claim even starts — the stale census files, the job codes that don't match, the salary figures that conflict."</p>
          <cite style={{fontFamily:F.m, fontSize:10, color:B.a, fontStyle:"normal"}}>— Dawn McMaster, 2nd VP, Munich Re</cite>
        </blockquote>
        <P>The carrier absorbs blame for delays that were never theirs to own. The employer sees a slow claim and calls the carrier. The broker sees a slow claim and logs a complaint. The carrier's operations team — which processed a clean file perfectly — gets measured against a standard it can't control from its side of the connection.</P>
        <P>The middleware doesn't take the spotlight. It just makes sure the carrier gets to keep it. When eligibility confirms against real-time census data, the carrier looks like a superhero to the employer. When job codes match automatically, the adjudicator approves on the first review. When salary figures are current, the payment triggers correctly. The infrastructure becomes invisible — which is exactly where it should be.</P>
      </N>
    </Expand>
  </section>;
}

/* ═══ 03 · REAL-TIME SYNC ═══ */
function S03(){
  return <section style={{background:B.grey, padding:"20px 0 56px"}}>
    <SectionBreak n="03" title="What Real-Time Costs" color={B.g} id="solution"/>
    <N style={{paddingTop:28}}>
      <Rev><h2 style={{fontFamily:F.d, fontSize:"clamp(24px,3.5vw,36px)", color:B.tx, lineHeight:1.15, marginBottom:12, maxWidth:620}}>"Real-time sync" isn't a feature. It's a decision tree that starts before a single record moves.</h2></Rev>
      <Rev><p style={{fontFamily:F.b, fontSize:15, color:B.mu, lineHeight:1.65, maxWidth:560, marginBottom:24}}>Every employer that comes onto a carrier's book asks the same question in a different format. Here are the eight questions your integration team answers — over and over, for every new employer, on every HRIS platform in your book.</p></Rev>
    </N>
    <W>
      <Rev>
        <div style={{marginBottom:24, padding:"28px 24px", background:B.black, borderRadius:12, border:`1px solid ${B.bdr}`}}>
          <div style={{fontFamily:F.m, fontSize:9, color:B.g, letterSpacing:2, marginBottom:16, textTransform:"uppercase"}}>The Eight Questions — Per Employer, Per Platform</div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
            {SYNC_Q.map((q,i) => <div key={i} style={{display:"flex", gap:10, padding:"10px 12px", background:B.grey, borderRadius:6, border:`1px solid ${B.bdr}`}}>
              <span style={{fontFamily:F.m, fontSize:10, color:B.g, minWidth:18, paddingTop:1}}>{String(i+1).padStart(2,"0")}</span>
              <p style={{fontFamily:F.b, fontSize:12, color:B.mu, lineHeight:1.5}}>{q}</p>
            </div>)}
          </div>
        </div>
      </Rev>
    </W>
    <Expand label="Read the full breakdown">
      <N style={{paddingTop:24}}>
        <P>Multiply those eight questions by every employer on your book. Multiply again for every HRIS they use. That's what your integration team actually manages — not a connection, but a constantly-shifting matrix of format decisions, credential handoffs, and exception-handling logic that lives in the head of whoever built it.</P>
        <P>The answer your team gives most often is: CSV, full snapshot, daily at midnight, employer controls the schedule. That answer is right about 40% of the time. The other 60% requires a discovery call, a custom mapping document, and three weeks of testing before the first file lands correctly.</P>
        <Quote text="Are the field names standardized across all your Paycom clients? We've asked that question 30 times and gotten a different answer every time." attr="Integration Engineer, Top-5 TPA" color={B.g}/>
        <P>Most carriers are still running on census files that are 30 to 90 days stale — not because no one wants current data, but because the infrastructure to deliver it reliably hasn't been worth the build cost at scale. The per-employer overhead absorbs the ROI before it can accrue.</P>
        <P>When a data layer normalizes format decisions, manages credential handoffs, and handles sync cycle monitoring upstream — the carrier's team stops answering questions about what format a file comes in. They start making decisions about what to do with clean, current data. That's the switch.</P>
      </N>
    </Expand>
  </section>;
}

/* ═══ 04 · FIELD NOTES ═══ */
function S04(){
  return <section style={{background:B.black, padding:"20px 0 56px"}}>
    <SectionBreak n="04" title="Field Notes" color={B.s} id="field"/>
    <N style={{paddingTop:28}}>
      <Rev><h2 style={{fontFamily:F.d, fontSize:"clamp(24px,3.5vw,34px)", color:B.tx, lineHeight:1.15, marginBottom:16}}>Two conversations. Same answer. Neither knew the other had spoken with us.</h2></Rev>
      <Rev>
        <p style={{fontFamily:F.b, fontSize:15, lineHeight:1.7, color:B.tx, marginBottom:16, fontWeight:300, borderLeft:`3px solid ${B.s}`, paddingLeft:16}}>
          In the past two weeks, we had separate conversations with two contacts at the same major carrier — different functions, different contexts, different framings. Neither knew the other had spoken with us.
        </p>
      </Rev>
    </N>
    <W>
      <Rev>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24}}>
          {[
            {role:"VP of Claims Operations", said:"Named connectivity as the core issue. Described stale census files causing manual reconciliation queues. Estimated 20–30% of adjudication delay traces back to data that's wrong before the claim starts.", color:B.s},
            {role:"Product Manager, Digital Claims", said:"Named connectivity as the core issue. Described manual exception handling on employer data mismatches. Estimated one FTE equivalent of reconciliation work per 500 active claims.", color:B.s},
          ].map((c,i) => <div key={i} style={{padding:"24px 20px", background:B.grey, border:`1px solid ${B.bdr}`, borderRadius:10, borderTop:`3px solid ${c.color}`, height:"100%"}}>
            <div style={{fontFamily:F.m, fontSize:9, color:c.color, letterSpacing:1.5, marginBottom:10, textTransform:"uppercase"}}>{c.role}</div>
            <p style={{fontFamily:F.b, fontSize:13, color:B.mu, lineHeight:1.6}}>{c.said}</p>
          </div>)}
        </div>
      </Rev>
    </W>
    <N>
      <P>We've had versions of this conversation with contacts at regional TPAs, national carriers, and reinsurers. The problem surfaces differently depending on who you ask — a VP of Claims describes stale census data, a product manager describes manual exception queues, a COO describes employer satisfaction scores. The framing changes. The root cause doesn't.</P>
      <P>The market isn't waiting for someone to explain the problem. The market already knows. It's waiting for infrastructure that solves it without requiring the carrier to build it themselves.</P>
    </N>
  </section>;
}

/* ═══ 05 · DIAGNOSTIC ═══ */
function S05(){
  const [h, setH] = useState(false);
  return <section style={{background:B.black, padding:"20px 0 56px"}}>
    <SectionBreak n="05" title="Your Debt Score" color={B.s} id="diagnostic"/>
    <W style={{paddingTop:28}}><Rev>
      <div style={{padding:"44px 32px", background:B.grey, borderRadius:14, border:`1px solid ${B.bdr}`, textAlign:"center", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 0%,${B.g}06,transparent 60%)`, pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <h2 style={{fontFamily:F.d, fontSize:"clamp(24px,3.5vw,34px)", color:B.tx, marginBottom:12, lineHeight:1.15}}>How deep is your integration debt?</h2>
          <p style={{fontFamily:F.b, fontSize:14, color:B.mu, lineHeight:1.6, maxWidth:460, margin:"0 auto 14px"}}>8 questions. 4 dimensions. A precise picture of where your infrastructure is breaking down.</p>
          <div style={{display:"flex", justifyContent:"center", gap:32, margin:"24px 0 32px", flexWrap:"wrap"}}>
            {[{n:"01",l:"Cost Burden",c:B.g},{n:"02",l:"Coverage Gaps",c:B.r},{n:"03",l:"Maintenance",c:B.a},{n:"04",l:"Onboarding",c:B.s}].map(d => <div key={d.n}>
              <div style={{fontFamily:F.m, fontSize:18, fontWeight:500, color:d.c}}>{d.n}</div>
              <div style={{fontFamily:F.b, fontSize:10, color:B.dm, marginTop:2}}>{d.l}</div>
            </div>)}
          </div>
          <a href="https://diagnostic.eightbyzero.com/" target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
            style={{fontFamily:F.b, fontSize:15, fontWeight:600, color:B.black, background:B.g, borderRadius:8, padding:"13px 36px", display:"inline-block", transition:"transform .15s,box-shadow .15s", transform:h?"translateY(-2px)":"none", boxShadow:h?`0 6px 18px ${B.g}33`:"none"}}>
            Run the Diagnostic →
          </a>
          <p style={{fontFamily:F.m, fontSize:10, color:B.dm, marginTop:14}}>3 minutes. Private results. We follow up only if your score suggests we can help.</p>
        </div>
      </div>
    </Rev></W>
  </section>;
}

/* ═══ 06 · FEATURE ═══ */
function S06({email, setEmail, subDone, setSubDone}){
  const [open, setOpen] = useState(false);
  const pre = ARTICLE.slice(0,3), rest = ARTICLE.slice(3);
  const renderB = (b,i) => {
    if(b.t==="lede") return <p key={i} style={{fontFamily:F.b,fontSize:16,lineHeight:1.7,color:B.tx,marginBottom:20,fontWeight:300,borderLeft:`3px solid ${B.g}`,paddingLeft:16}}>{b.v}</p>;
    if(b.t==="p")    return <p key={i} style={{fontFamily:F.b,fontSize:15,lineHeight:1.78,color:B.mu,marginBottom:16}}>{b.v}</p>;
    if(b.t==="h")    return <h3 key={i} style={{fontFamily:F.d,fontSize:22,color:B.tx,marginTop:26,marginBottom:10}}>{b.v}</h3>;
    if(b.t==="q")    return <blockquote key={i} style={{margin:"22px 0",padding:"18px 22px",background:B.black,borderRadius:10,borderLeft:`3px solid ${B.g}`}}><p style={{fontFamily:F.d,fontSize:15,fontStyle:"italic",lineHeight:1.5,color:B.tx,marginBottom:6}}>"{b.v}"</p><cite style={{fontFamily:F.m,fontSize:10,color:B.g,fontStyle:"normal"}}>— {b.a}</cite></blockquote>;
    return null;
  };
  return <section style={{background:B.grey, padding:"20px 0 56px"}}>
    <SectionBreak n="06" title="Feature Article" color={B.g} id="feature"/>
    <N style={{paddingTop:28}}>
      <Rev>
        <h2 style={{fontFamily:F.d, fontSize:"clamp(24px,3.5vw,34px)", color:B.tx, lineHeight:1.15, marginBottom:8}}>When Your Vendor Pivots, Who Pays?</h2>
        <p style={{fontFamily:F.b, fontSize:13, color:B.dm, marginBottom:24, fontStyle:"italic"}}>6 min read</p>
      </Rev>
      <Rev><div>
        {pre.map(renderB)}
        {!open && <div style={{textAlign:"center",paddingTop:4}}><button onClick={()=>setOpen(true)} style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:B.g,background:B.gS,border:`1px solid ${B.gB}`,borderRadius:6,padding:"9px 24px",cursor:"pointer"}}>Continue reading ↓</button></div>}
        {open && <>{rest.map(renderB)}
          <div style={{marginTop:32, padding:"20px", background:B.black, borderRadius:10, border:`1px solid ${B.bdr}`}}>
            <p style={{fontFamily:F.d, fontSize:17, color:B.tx, marginBottom:8}}>Get the next issue of The Connector</p>
            <p style={{fontFamily:F.b, fontSize:12, color:B.dm, marginBottom:12, lineHeight:1.5}}>Published biweekly. Each issue maps a different dimension of the interoperability problem.</p>
            <Sub email={email} setEmail={setEmail} done={subDone} setDone={setSubDone}/>
          </div>
        </>}
      </div></Rev>
    </N>
  </section>;
}

/* ═══ FOOTER ═══ */
function Footer({email, setEmail, subDone, setSubDone}){
  return <footer style={{background:B.black, padding:"20px 0 24px"}}><W>
    <div style={{height:2, background:B.g, marginBottom:32, borderRadius:1}}/>
    {/* Back issues strip */}
    <div style={{marginBottom:28, padding:"18px 22px", background:B.grey, borderRadius:10, border:`1px dashed ${B.bdr2}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16}}>
      <div>
        <div style={{fontFamily:F.m, fontSize:9, color:B.s, letterSpacing:2, marginBottom:8}}>BACK ISSUES</div>
        <div style={{display:"flex", gap:16, flexWrap:"wrap"}}>
          {ISSUES.filter(i => !i.current).map(iss => <a key={iss.n} href={iss.href} style={{fontFamily:F.b, fontSize:12, color:B.dm, textDecoration:"none"}}>
            <span style={{fontFamily:F.m, fontSize:10, color:B.g, marginRight:6}}>Issue {iss.n}</span>
            {iss.title}
          </a>)}
        </div>
      </div>
      <div style={{fontFamily:F.m, fontSize:10, color:B.dm, whiteSpace:"nowrap"}}>connector.eightbyzero.com</div>
    </div>
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginBottom:32}}>
      <div>
        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10}}>
          <span style={{fontFamily:F.m, fontSize:11, fontWeight:700, color:B.black, background:B.g, padding:"2px 7px", borderRadius:3}}>8/0</span>
          <span style={{fontFamily:F.d, fontSize:14, color:B.tx}}>Eight by Zero</span>
        </div>
        <p style={{fontFamily:F.b, fontSize:12, color:B.dm, lineHeight:1.5, maxWidth:300, marginBottom:12}}>The intelligent data layer for carriers and TPAs.</p>
        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
          <a href="mailto:connect@eightbyzero.com" style={{fontFamily:F.m, fontSize:10, color:B.g, padding:"4px 10px", border:`1px solid ${B.gB}`, borderRadius:4}}>connect@eightbyzero.com</a>
          <a href="https://eightbyzero.com" target="_blank" rel="noopener noreferrer" style={{fontFamily:F.m, fontSize:10, color:B.dm, padding:"4px 10px", border:`1px solid ${B.bdr}`, borderRadius:4}}>eightbyzero.com</a>
        </div>
      </div>
      <div style={{background:B.grey, borderRadius:10, border:`1px solid ${B.bdr}`, padding:"18px"}}>
        <p style={{fontFamily:F.d, fontSize:16, color:B.tx, marginBottom:6}}>Get the next issue</p>
        <p style={{fontFamily:F.b, fontSize:11, color:B.dm, marginBottom:10, lineHeight:1.5}}>Published biweekly. No spam.</p>
        <Sub email={email} setEmail={setEmail} done={subDone} setDone={setSubDone}/>
      </div>
    </div>
    <div style={{paddingTop:14, borderTop:`1px solid ${B.bdr}`, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8}}>
      <span style={{fontFamily:F.m, fontSize:9, color:B.dm}}>© 2026 EightByZero</span>
      <span style={{fontFamily:F.m, fontSize:9, color:B.dm}}>The Connector · Issue 002 · May 2026</span>
    </div>
  </W></footer>;
}

/* ═══ APP ═══ */
export default function App(){
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);
  useProgress();
  return <div style={{background:B.black, minHeight:"100vh", fontFamily:F.b, color:B.tx}}>
    <style>{css}</style>
    <div id="progress-bar"/>
    <IssueNav/>
    <Masthead/>
    <S01/><S02/><S03/><S04/><S05/>
    <S06 email={email} setEmail={setEmail} subDone={subDone} setSubDone={setSubDone}/>
    <Footer email={email} setEmail={setEmail} subDone={subDone} setSubDone={setSubDone}/>
  </div>;
}
