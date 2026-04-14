import { useState, useRef, useEffect } from "react";

/* ═══ BRAND ═══ */
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
`;

/* ═══ DATA ═══ */
const TOC = [
  {n:"01",id:"problem",t:"The Problem",s:"Why ~90% of carriers fail at integration.",c:B.r},
  {n:"02",id:"solution",t:"How 8/0 Works",s:"Agentic data orchestration: connect, interpret, self-heal.",c:B.g},
  {n:"03",id:"proof",t:"Proof Points",s:"What carrier CTOs and VPs of Claims are saying.",c:B.a},
  {n:"04",id:"diagnostic",t:"Your Debt Score",s:"An interactive diagnostic across 4 dimensions.",c:B.s},
  {n:"05",id:"feature",t:"Feature Article",s:"Your best engineers are becoming middleware plumbers.",c:B.g},
  {n:"06",id:"podcast",t:"Podcast",s:"A 10-minute audio companion to this issue.",c:B.s},
  {n:"07",id:"impact",t:"Impact",s:"Why this is a financial crisis for workers.",c:B.r},
];
const PAIN=[{n:"10+",d:"disparate data sources per claim",s:"Each one a potential failure point"},{n:"70%",d:"of claims processing is data gathering",s:"Not adjudication. Just finding information."},{n:"6–9 mo",d:"to onboard a new employer",s:"At $100K+ per onboarding"},{n:"$750K",d:"to build one HRIS integration",s:"Plus $300K/yr to maintain it"}];
const CAPS=[{n:"01",t:"Connect & Learn",d:"AI agents parse vendor API docs, detect schema changes, and map configurations automatically. New systems connected in hours, not months.",c:B.g},{n:"02",t:"Workflow Interpretation",d:"Translate employer-specific policies, eligibility rules, and operational requirements into structured workflows your systems understand.",c:B.a},{n:"03",t:"Monitor & Self-Heal",d:"Agents monitor data flows, detect anomalies, auto-correct mapping errors, and escalate only when confidence is low.",c:B.s}];
const COMP=[{l:"Connectivity per employer",old:"200 hours",nw:"2–5 hours"},{l:"Maintenance ratio",old:"1 FTE : 10–20 employers",nw:"1 FTE : 1,000 employers"},{l:"Data accuracy",old:"50–75%",nw:"99%"}];
const PROOF_Q=[{stat:"+5%",lbl:"Revenue",q:"The differentiation this would provide will command at least 5% top line increase.",a:"CMO, Top-3 Carrier",c:B.g},{stat:"−20%",lbl:"Claims Expense",q:"Claims cost us north of $60M/yr. Having direct access to client systems could easily reduce that by 20%.",a:"VP of Claims, Top-3 TPA",c:B.r},{stat:"−40%",lbl:"Onboarding Cost",q:"Having a simplified access point to our clients' systems could mean a 40% implementation cost reduction.",a:"CIO, Top-3 Carrier",c:B.a}];
const ARTICLE=[{t:"lede",v:"Somewhere inside every mid-to-large carrier, there's a dev team hired to build smart claims automation. Instead, they spend 60% of their time maintaining point-to-point integrations with TPAs, brokers, and employer platforms that were duct-taped together years ago."},{t:"p",v:"Nobody planned it this way. Each integration made sense at the time — a new TPA partner needed an eligibility feed, a broker portal required a status API, an employer group wanted real-time FMLA tracking. But compounded over a decade, the result is a Rube Goldberg machine held together by batch files, SFTP drops, and institutional memory."},{t:"q",v:"We have engineers who could be building predictive models for return-to-work timing. Instead they're debugging why a CSV from 2016 started dropping middle initials on Tuesdays.",a:"VP of Technology, Top-15 Group Disability Carrier"},{t:"h",v:"The math nobody does"},{t:"p",v:"Take your integration team's fully loaded cost. Multiply by the percentage of time on maintenance versus net-new capability. That delta — usually 40–70% of the team's capacity — is your connectivity debt, compounding silently every quarter."},{t:"p",v:"It's not a technology problem. It's an architecture problem. Every new partner, every new product line adds another spoke to a hub that was never designed to be a hub."},{t:"h",v:"This isn't a build vs. buy conversation"},{t:"p",v:"Your systems work. Your team is good. The problem is that your good team is doing work that shouldn't require a good team — or any team. An interoperability layer normalizes data, manages connection state, handles translation. Your engineers stop plumbing and start building again. They become the heroes."},{t:"q",v:"The carriers that modernize fastest aren't the ones with the biggest IT budgets. They're the ones that stop asking dev teams to solve infrastructure problems with application code.",a:"Dawn McMaster, 2nd VP, Munich Re"}];

/* ═══ HOOKS ═══ */
function useReveal(){const ref=useRef(null);useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){e.target.classList.add("vis");obs.unobserve(e.target)}},{threshold:.08});obs.observe(el);return()=>obs.disconnect()},[]);return ref}
function Rev({children,delay=0,style={}}){const r=useReveal();return<div ref={r} className={`reveal${delay?` reveal-d${delay}`:""}`} style={style}>{children}</div>}
function useProgress(){useEffect(()=>{const bar=document.getElementById("progress-bar");if(!bar)return;const u=()=>{const h=document.documentElement.scrollHeight-window.innerHeight;bar.style.width=h>0?`${(window.scrollY/h)*100}%`:"0%"};window.addEventListener("scroll",u,{passive:true});return()=>window.removeEventListener("scroll",u)},[]);}

/* ═══ ATOMS ═══ */
const W=({children,style})=><div style={{maxWidth:940,margin:"0 auto",padding:"0 28px",...style}}>{children}</div>;
const N=({children,style})=><div style={{maxWidth:720,margin:"0 auto",padding:"0 28px",...style}}>{children}</div>;
const P=({children})=><Rev><p style={{fontFamily:F.b,fontSize:15,color:B.mu,lineHeight:1.75,marginBottom:18}}>{children}</p></Rev>;
function Tag({children,color=B.g}){return<span style={{fontFamily:F.m,fontSize:10,fontWeight:500,letterSpacing:1.5,color,background:color+"15",padding:"3px 10px",borderRadius:3,textTransform:"uppercase"}}>{children}</span>}
const SHEET_URL="https://script.google.com/macros/s/AKfycbz4gEEB_-9mbYsIcuwgYuu6C4c2xAyrdrRnbPxswmdMoelQ7UNcxUXlT0P4fbeWiAUo/exec";
function Sub({email,setEmail,done,setDone}){
  const[sending,setSending]=useState(false);
  if(done)return<div style={{padding:14,background:B.gS,borderRadius:6,border:`1px solid ${B.gB}`,textAlign:"center"}}><span style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:B.g}}>You're in. ✓</span></div>;
  const submit=()=>{
    if(!email.includes("@")||sending)return;
    setSending(true);
    new Image().src=SHEET_URL+"?email="+encodeURIComponent(email)+"&source=connector-001&t="+Date.now();
    setTimeout(()=>setDone(true),800);
  };
  return<div style={{display:"flex",gap:8}}><input type="email" placeholder="you@carrier.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{flex:1,fontFamily:F.b,fontSize:13,padding:"9px 12px",borderRadius:6,border:`1px solid ${B.bdr}`,background:B.card,color:B.tx}}/><button onClick={submit} style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:B.black,background:B.g,border:"none",borderRadius:6,padding:"9px 20px",cursor:"pointer",opacity:email.includes("@")?1:.4}}>{sending?"...":"Subscribe"}</button></div>;
}
function SectionBreak({n,title,color,id}){
  return<div id={id} style={{scrollMarginTop:16,maxWidth:940,margin:"0 auto",padding:"0 28px"}}><div style={{height:3,background:`linear-gradient(90deg,${color},${color}44)`,borderRadius:2}}/><div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 0 6px"}}><span style={{fontFamily:F.m,fontSize:11,color,letterSpacing:1.5}}>SECTION {n} OF 07</span><span style={{fontFamily:F.m,fontSize:11,color:B.dm}}>—</span><span style={{fontFamily:F.m,fontSize:11,color:B.dm,letterSpacing:.5,textTransform:"uppercase"}}>{title}</span></div></div>;
}
function Quote({text,attr,color}){
  return<Rev><div style={{padding:"22px 24px",background:B.black,borderRadius:10,borderLeft:`3px solid ${color}`,marginBottom:20}}><p style={{fontFamily:F.d,fontSize:17,fontStyle:"italic",lineHeight:1.55,color:B.tx,marginBottom:6}}>"{text}"</p><cite style={{fontFamily:F.m,fontSize:10,color,fontStyle:"normal"}}>— {attr}</cite></div></Rev>;
}
function Expand({children,label="Continue reading"}){
  const[open,setOpen]=useState(false);
  return<>{!open&&<div style={{textAlign:"center",padding:"12px 0 0"}}><button onClick={()=>setOpen(true)} style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:B.g,background:B.gS,border:`1px solid ${B.gB}`,borderRadius:6,padding:"9px 24px",cursor:"pointer"}}>{label} ↓</button></div>}{open&&children}</>;
}

/* ═══ MASTHEAD ═══ */
function Masthead(){
  return<section style={{background:B.black,paddingTop:40}}><W>
    <div style={{textAlign:"center",paddingBottom:24,borderBottom:`2px solid ${B.g}`}}>
      <div style={{fontFamily:F.m,fontSize:11,color:B.g,letterSpacing:3,marginBottom:8}}>EIGHT BY ZERO PRESENTS</div>
      <div style={{fontFamily:F.d,fontSize:"clamp(40px,6vw,64px)",fontWeight:400,color:B.tx,lineHeight:1,letterSpacing:-2}}>The Connector</div>
      <div style={{fontFamily:F.b,fontSize:13,color:B.dm,marginTop:8}}>Agentic interoperability for absence & disability insurance</div>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${B.bdr}`}}>
      <div style={{fontFamily:F.m,fontSize:11,color:B.mu,letterSpacing:1}}>ISSUE 001 · APRIL 2026 · INAUGURAL EDITION</div>
      <div style={{fontFamily:F.b,fontSize:12,color:B.dm}}>Eight by Zero</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:40,padding:"36px 0 48px"}}>
      <div>
        <h1 style={{fontFamily:F.d,fontSize:"clamp(26px,3.5vw,38px)",fontWeight:400,lineHeight:1.15,letterSpacing:-.5,color:B.tx,marginBottom:16}}>The data infrastructure holding absence & disability together is breaking. This issue maps the problem — and the emerging fix.</h1>
        <p style={{fontFamily:F.b,fontSize:15,color:B.mu,lineHeight:1.65,marginBottom:20}}>Inside: the real numbers on integration debt, how agentic orchestration changes the economics, what carrier CTOs are already seeing, an interactive diagnostic to score your own operation, and why every improvement hits hardest for the workers at the bottom.</p>
        <div style={{fontFamily:F.b,fontSize:13,color:B.dm}}>12 min read · <a href="#diagnostic" style={{color:B.g}}>Jump to the Diagnostic →</a></div>
      </div>
      <div style={{background:B.grey,border:`1px solid ${B.bdr}`,borderRadius:10,padding:"18px 16px"}}>
        <div style={{fontFamily:F.m,fontSize:10,color:B.g,letterSpacing:2,marginBottom:12}}>IN THIS ISSUE</div>
        {TOC.map((s,i)=><a key={s.id} href={`#${s.id}`} style={{display:"flex",gap:8,padding:"8px 0",borderBottom:i<TOC.length-1?`1px solid ${B.bdr}`:"none"}}><span style={{fontFamily:F.m,fontSize:11,color:s.c,minWidth:18}}>{s.n}</span><div><div style={{fontFamily:F.b,fontSize:12,fontWeight:600,color:B.tx,lineHeight:1.3}}>{s.t}</div><div style={{fontFamily:F.b,fontSize:10,color:B.dm,marginTop:1}}>{s.s}</div></div></a>)}
      </div>
    </div>
  </W></section>;
}

/* ═══ 01 · PROBLEM ═══ */
function S01(){return(
  <section style={{background:B.grey,padding:"20px 0 56px"}}>
    <SectionBreak n="01" title="The Problem" color={B.r} id="problem"/>
    <W style={{paddingTop:28}}>
      <Rev><h2 style={{fontFamily:F.d,fontSize:"clamp(24px,3.5vw,36px)",color:B.tx,lineHeight:1.15,marginBottom:12,maxWidth:620}}>The absence & disability ecosystem runs on broken plumbing.</h2></Rev>
      <Rev><p style={{fontFamily:F.b,fontSize:15,color:B.mu,lineHeight:1.65,maxWidth:560,marginBottom:24}}>Every carrier knows it. Most have tried to fix it in-house. ~90% fail. Four numbers tell you why.</p></Rev>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:8}}>
        {PAIN.map((s,i)=><Rev key={i} delay={i+1}><div style={{padding:"22px 18px",background:B.black,border:`1px solid ${B.bdr}`,borderRadius:10,height:"100%"}}><div style={{fontFamily:F.d,fontSize:34,color:B.r,lineHeight:1,marginBottom:6}}>{s.n}</div><div style={{fontFamily:F.b,fontSize:12,fontWeight:600,color:B.tx,marginBottom:4,lineHeight:1.35}}>{s.d}</div><div style={{fontFamily:F.b,fontSize:11,color:B.dm,lineHeight:1.4}}>{s.s}</div></div></Rev>)}
      </div>
    </W>
    <Expand label="Read the full analysis">
      <N style={{paddingTop:24}}>
        <P>Filing a straightforward short-term disability claim today requires 10–15+ individual touchpoints across HR, the carrier, and the doctor's office. The worker calls HR. HR says call the carrier. The carrier puts them on hold for 20–45 minutes, issues a claim number, and tells them to request three separate forms. Each party operates on its own timeline. Each handoff is a potential failure point.</P>
        <P>Meanwhile, the carrier tries to verify eligibility against a census file that may be 30–90 days stale. Job codes don't match. Salary figures conflict. The claim sits in a manual reconciliation queue, adding 5–10 business days. The physician's office takes another 5–15 days to return the form — often by postal mail. If anything is missing, a letter goes out requesting more documentation. The worker may not receive it for a week.</P>
        <P>This isn't edge-case complexity. This is the standard experience for a routine claim. And roughly 90% of carriers have tried to solve it by building integrations in-house. A single HRIS integration — one vendor, one connection — can cost $750K to build and $300K annually to maintain. A carrier serving employers across 20+ HR systems would need to replicate that dozens of times.</P>
        <Quote text="Our internal integration with Workday took 9 months and cost us more than $750,000 in engineering — and now we have 2–3 FTEs just to maintain it." attr="Dir. of Engineering, Top-10 Carrier" color={B.r}/>
        <P>The alternative — generic API aggregators — covers some of the gap, but they weren't built for insurance. They lack the flexibility to handle carrier-specific eligibility logic, leave policies, and compliance requirements. Carriers end up doing significant custom work on top.</P>
        <P>The result is a structural impasse. No one in the ecosystem is incentivized to solve this holistically. Carriers can't justify building integrations to every HR system. HR vendors have no incentive to standardize. Employers don't even know the problem exists. And the workers at the end of the chain absorb the cost in delayed benefits, wrongful denials, and financial distress.</P>
        <Rev><div style={{padding:"16px 20px",borderRadius:8,background:B.gS,border:`1px solid ${B.gB}`}}><p style={{fontFamily:F.b,fontSize:12,color:B.g,fontWeight:600,marginBottom:3}}>The structural insight</p><p style={{fontFamily:F.b,fontSize:12,color:B.mu,lineHeight:1.55}}>This is a connectivity vacuum — not a technology problem, not a talent problem. It's an architecture problem that compounds with every new partner, product line, and acquisition. And it's the root cause of nearly every operational failure downstream.</p></div></Rev>
      </N>
    </Expand>
  </section>
);}

/* ═══ 02 · SOLUTION ═══ */
function S02(){return(
  <section style={{background:B.black,padding:"20px 0 56px"}}>
    <SectionBreak n="02" title="How 8/0 Works" color={B.g} id="solution"/>
    <N style={{paddingTop:28}}>
      <Rev><h2 style={{fontFamily:F.d,fontSize:"clamp(24px,3.5vw,36px)",color:B.tx,lineHeight:1.15,marginBottom:12,maxWidth:620}}>Hard-coded integrations break. 8/0 agents adapt.</h2></Rev>
      <Rev><p style={{fontFamily:F.b,fontSize:15,color:B.mu,lineHeight:1.65,maxWidth:560,marginBottom:24}}>Instead of building static connections one at a time, AI agents learn to connect to employer systems dynamically — parsing documentation, detecting schema changes, and adapting without human intervention.</p></Rev>
    </N>
    {/* Architecture — always visible */}
    <W><Rev><div style={{marginBottom:8,padding:"28px 24px",background:B.grey,borderRadius:12,border:`1px solid ${B.bdr}`}}><div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center"}}>
      <div><div style={{fontFamily:F.m,fontSize:9,color:B.r,letterSpacing:1.5,marginBottom:12,textTransform:"uppercase"}}>Employer Ecosystem</div>{["HRIS · 20+ vendors","Payroll · 10+ vendors","Time & Attendance · 25+ vendors","Benefits Admin · 5+ vendors"].map((s,i)=><div key={i} style={{padding:"8px 12px",background:B.black,border:`1px solid ${B.bdr}`,borderRadius:6,marginBottom:4,fontFamily:F.b,fontSize:11,color:B.mu}}>{s}</div>)}</div>
      <div style={{textAlign:"center",padding:"0 20px"}}><div style={{fontSize:9,color:B.dm,fontFamily:F.m,marginBottom:4}}>← data →</div><div style={{width:60,height:60,borderRadius:12,background:`linear-gradient(135deg,${B.g}22,${B.g}08)`,border:`2px solid ${B.gB}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",animation:"pulseGlow 3s ease-in-out infinite"}}><span style={{fontFamily:F.m,fontSize:14,fontWeight:700,color:B.g}}>8/0</span></div><div style={{fontFamily:F.m,fontSize:8,color:B.g,letterSpacing:1,marginTop:4}}>AI AGENTS</div><div style={{display:"flex",gap:3,justifyContent:"center",marginTop:4}}>{["MCP","A2A","API"].map(p=><span key={p} style={{fontFamily:F.m,fontSize:7,color:B.g,padding:"1px 5px",border:`1px solid ${B.gB}`,borderRadius:3}}>{p}</span>)}</div></div>
      <div><div style={{fontFamily:F.m,fontSize:9,color:B.g,letterSpacing:1.5,marginBottom:12,textTransform:"uppercase"}}>Carrier / TPA Systems</div>{["Policy Administration","Underwriting","Claims","Customer Service"].map((s,i)=><div key={i} style={{padding:"8px 12px",background:B.black,border:`1px solid ${B.bdr}`,borderRadius:6,marginBottom:4,fontFamily:F.b,fontSize:11,color:B.mu}}>{s}</div>)}</div>
    </div></div></Rev></W>
    <Expand label="Read the full breakdown">
      <N style={{paddingTop:24}}>
        <P>The conventional approach is to hard-code each integration individually. A team builds a connection to Workday. Then UKG. Then ADP. Each one takes months, costs six figures, and requires ongoing maintenance by engineers who were hired to do something far more valuable.</P>
        <P>8/0 takes a fundamentally different approach. Think of it as the difference between hiring a translator for every language versus deploying one that learns any language on contact. The system operates in three phases:</P>
      </N>
      <W><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>{CAPS.map((c,i)=><Rev key={i} delay={i+1}><div style={{padding:"24px 20px",background:B.grey,border:`1px solid ${B.bdr}`,borderRadius:10,borderTop:`3px solid ${c.c}`,height:"100%"}}><div style={{fontFamily:F.m,fontSize:10,color:c.c,letterSpacing:1.5,marginBottom:10}}>{c.n}</div><h3 style={{fontFamily:F.d,fontSize:18,color:B.tx,marginBottom:6,lineHeight:1.2}}>{c.t}</h3><p style={{fontFamily:F.b,fontSize:12,color:B.mu,lineHeight:1.55}}>{c.d}</p></div></Rev>)}</div></W>
      <N><P>The economic impact is stark. What currently takes 200 hours of engineering time per employer connection drops to 2–5 hours. Maintenance ratios shift from one engineer per 10–20 employers to one per 1,000. Data accuracy goes from the 50–75% range to 99%.</P></N>
      <W><Rev><div style={{background:B.grey,borderRadius:10,border:`1px solid ${B.bdr}`,overflow:"hidden",marginBottom:24}}>
        <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr",borderBottom:`1px solid ${B.bdr}`}}><div style={{padding:"10px 16px"}}/><div style={{padding:"10px 16px",fontFamily:F.m,fontSize:9,color:B.r,letterSpacing:1.5,textAlign:"center",borderLeft:`1px solid ${B.bdr}`}}>LEGACY</div><div style={{padding:"10px 16px",fontFamily:F.m,fontSize:9,color:B.g,letterSpacing:1.5,textAlign:"center",borderLeft:`1px solid ${B.bdr}`}}>WITH 8/0</div></div>
        {COMP.map((r,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr",borderBottom:i<COMP.length-1?`1px solid ${B.bdr}`:"none"}}><div style={{padding:"12px 16px",fontFamily:F.b,fontSize:12,color:B.tx}}>{r.l}</div><div style={{padding:"12px 16px",fontFamily:F.m,fontSize:12,color:B.r,textAlign:"center",borderLeft:`1px solid ${B.bdr}`,opacity:.55,textDecoration:"line-through"}}>{r.old}</div><div style={{padding:"12px 16px",fontFamily:F.m,fontSize:12,color:B.g,textAlign:"center",fontWeight:600,borderLeft:`1px solid ${B.bdr}`}}>{r.nw}</div></div>)}
      </div></Rev></W>
      <N><P>Critically, none of this requires ripping out existing systems. 8/0 sits alongside what's already in place and handles the connectivity layer those systems were never designed to manage. The dev team that was spending 60% of its time on integration maintenance gets that capacity back.</P></N>
    </Expand>
  </section>
);}

/* ═══ 03 · PROOF ═══ */
function S03(){return(
  <section style={{background:B.grey,padding:"20px 0 56px"}}>
    <SectionBreak n="03" title="Proof Points" color={B.a} id="proof"/>
    <N style={{paddingTop:28}}>
      <Rev><h2 style={{fontFamily:F.d,fontSize:"clamp(24px,3.5vw,36px)",color:B.tx,lineHeight:1.15,marginBottom:12}}>The people who run this world are already seeing it.</h2></Rev>
      <Rev><p style={{fontFamily:F.b,fontSize:15,color:B.mu,lineHeight:1.65,maxWidth:560,marginBottom:24}}>Three data points from operators who run these numbers on their own books daily.</p></Rev>
    </N>
    {/* Stat cards — always visible */}
    <W><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:8}}>
      {PROOF_Q.map((q,i)=><Rev key={i} delay={i+1}><div style={{padding:"24px 20px",background:B.black,border:`1px solid ${B.bdr}`,borderRadius:10,height:"100%"}}><div style={{fontFamily:F.d,fontSize:44,color:q.c,lineHeight:1,marginBottom:4}}>{q.stat}</div><div style={{fontFamily:F.m,fontSize:9,color:q.c,letterSpacing:1.5,marginBottom:14,textTransform:"uppercase"}}>{q.lbl}</div><p style={{fontFamily:F.d,fontSize:14,fontStyle:"italic",color:B.tx,lineHeight:1.5,marginBottom:8}}>"{q.q}"</p><cite style={{fontFamily:F.m,fontSize:10,color:B.dm,fontStyle:"normal"}}>— {q.a}</cite></div></Rev>)}
    </div></W>
    <Expand label="Read the context behind these numbers">
      <N style={{paddingTop:24}}>
        <P>We spend most of our time inside carrier and TPA operations. Not selling — listening. And the same patterns keep surfacing. A CMO at a top-3 carrier told us the competitive advantage from clean, real-time employer data would command meaningful top-line premium growth. A VP of Claims at a top-3 TPA did the math on their $60M+ annual claims processing cost and identified where the leverage actually sits. A CIO at another top-3 carrier mapped the implementation savings.</P>
        <P>What makes these numbers land is context. A 5% revenue lift isn't about charging more — it's about offering differentiated service that brokers will pay a premium for. A 20% reduction in claims expense isn't about cutting corners — it's about eliminating the manual data-gathering that consumes 70% of adjudication time today. A 40% onboarding cost reduction isn't about shortcuts — it's about not rebuilding the same integration from scratch every time.</P>
        <P>The complexity is real. Every accommodation, every eligibility edge case, every intermittent leave requires precision data flowing between systems that were never designed to talk to each other.</P>
        <Quote text="A carrier has to approve an employee with chronic migraines for 15-minute breaks, 4 to 5 times per week — getting that right is very complex." attr="Sr. Director of Claims" color={B.s}/>
        <P>Getting it right requires infrastructure that doesn't exist yet in most carrier environments. That's the gap 8/0 fills — not replacing the people who make these decisions, but ensuring they have clean, complete, real-time data when they make them.</P>
      </N>
    </Expand>
  </section>
);}

/* ═══ 04 · DIAGNOSTIC ═══ */
function S04(){const[h,setH]=useState(false);return(
  <section style={{background:B.black,padding:"20px 0 56px"}}>
    <SectionBreak n="04" title="Your Debt Score" color={B.s} id="diagnostic"/>
    <W style={{paddingTop:28}}><Rev>
      <div style={{padding:"44px 32px",background:B.grey,borderRadius:14,border:`1px solid ${B.bdr}`,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 0%,${B.g}06,transparent 60%)`,pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <h2 style={{fontFamily:F.d,fontSize:"clamp(24px,3.5vw,34px)",color:B.tx,marginBottom:12,lineHeight:1.15}}>How deep is your integration debt?</h2>
          <p style={{fontFamily:F.b,fontSize:14,color:B.mu,lineHeight:1.6,maxWidth:460,margin:"0 auto 14px"}}>8 questions. 4 dimensions. A precise picture of where your infrastructure is breaking down.</p>
          <div style={{display:"flex",justifyContent:"center",gap:32,margin:"24px 0 32px",flexWrap:"wrap"}}>
            {[{n:"01",l:"Cost Burden",c:B.g},{n:"02",l:"Coverage Gaps",c:B.r},{n:"03",l:"Maintenance",c:B.a},{n:"04",l:"Onboarding",c:B.s}].map(d=><div key={d.n}><div style={{fontFamily:F.m,fontSize:18,fontWeight:500,color:d.c}}>{d.n}</div><div style={{fontFamily:F.b,fontSize:10,color:B.dm,marginTop:2}}>{d.l}</div></div>)}
          </div>
          <a href="https://diagnostic.eightbyzero.com/" target="_blank" rel="noopener noreferrer" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{fontFamily:F.b,fontSize:15,fontWeight:600,color:B.black,background:B.g,borderRadius:8,padding:"13px 36px",display:"inline-block",transition:"transform .15s,box-shadow .15s",transform:h?"translateY(-2px)":"none",boxShadow:h?`0 6px 18px ${B.g}33`:"none"}}>Run the Diagnostic →</a>
          <p style={{fontFamily:F.m,fontSize:10,color:B.dm,marginTop:14}}>3 minutes. Private results. We follow up only if your score suggests we can help.</p>
        </div>
      </div>
    </Rev></W>
  </section>
);}

/* ═══ 05 · FEATURE ═══ */
function S05({email,setEmail,subDone,setSubDone}){
  const[open,setOpen]=useState(false);
  const pre=ARTICLE.slice(0,3),rest=ARTICLE.slice(3);
  const renderB=(b,i)=>{
    if(b.t==="lede")return<p key={i} style={{fontFamily:F.b,fontSize:16,lineHeight:1.7,color:B.tx,marginBottom:20,fontWeight:300,borderLeft:`3px solid ${B.g}`,paddingLeft:16}}>{b.v}</p>;
    if(b.t==="p")return<p key={i} style={{fontFamily:F.b,fontSize:15,lineHeight:1.78,color:B.mu,marginBottom:16}}>{b.v}</p>;
    if(b.t==="h")return<h3 key={i} style={{fontFamily:F.d,fontSize:22,color:B.tx,marginTop:26,marginBottom:10}}>{b.v}</h3>;
    if(b.t==="q")return<blockquote key={i} style={{margin:"22px 0",padding:"18px 22px",background:B.black,borderRadius:10,borderLeft:`3px solid ${B.g}`}}><p style={{fontFamily:F.d,fontSize:15,fontStyle:"italic",lineHeight:1.5,color:B.tx,marginBottom:6}}>"{b.v}"</p><cite style={{fontFamily:F.m,fontSize:10,color:B.g,fontStyle:"normal"}}>— {b.a}</cite></blockquote>;
    return null;
  };
  return(
    <section style={{background:B.grey,padding:"20px 0 56px"}}>
      <SectionBreak n="05" title="Feature Article" color={B.g} id="feature"/>
      <N style={{paddingTop:28}}>
        <Rev><h2 style={{fontFamily:F.d,fontSize:"clamp(24px,3.5vw,34px)",color:B.tx,lineHeight:1.15,marginBottom:8}}>Your Best Engineers Are Becoming Middleware Plumbers</h2><p style={{fontFamily:F.b,fontSize:13,color:B.dm,marginBottom:24,fontStyle:"italic"}}>5 min read</p></Rev>
        <Rev><div>{pre.map(renderB)}
          {!open&&<div style={{textAlign:"center",paddingTop:4}}><button onClick={()=>setOpen(true)} style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:B.g,background:B.gS,border:`1px solid ${B.gB}`,borderRadius:6,padding:"9px 24px",cursor:"pointer"}}>Continue reading ↓</button></div>}
          {open&&<>{rest.map(renderB)}<div style={{marginTop:32,padding:"20px",background:B.black,borderRadius:10,border:`1px solid ${B.bdr}`}}><p style={{fontFamily:F.d,fontSize:17,color:B.tx,marginBottom:8}}>Get the next issue of The Connector</p><p style={{fontFamily:F.b,fontSize:12,color:B.dm,marginBottom:12,lineHeight:1.5}}>Published biweekly. Each issue maps a different dimension of the interoperability problem.</p><Sub email={email} setEmail={setEmail} done={subDone} setDone={setSubDone}/></div></>}
        </div></Rev>
      </N>
    </section>
  );
}

/* ═══ 06 · PODCAST ═══ */
function S06(){
  const[playing,setPlaying]=useState(false);const[progress,setProgress]=useState(0);
  useEffect(()=>{if(!playing)return;const iv=setInterval(()=>setProgress(p=>{if(p>=100){setPlaying(false);return 0}return p+.15}),50);return()=>clearInterval(iv)},[playing]);
  const bars=Array.from({length:50},(_,i)=>Math.max(10,Math.min(55,Math.sin(i*.4)*20+Math.sin(i*.7)*15+Math.cos(i*.2)*10+30)));
  return(
    <section style={{background:B.black,padding:"20px 0 56px"}}>
      <SectionBreak n="06" title="Podcast" color={B.s} id="podcast"/>
      <W style={{paddingTop:28}}>
        <Rev><h2 style={{fontFamily:F.d,fontSize:"clamp(24px,3.5vw,34px)",color:B.tx,lineHeight:1.15,marginBottom:24}}>Same story. Easier to consume.</h2></Rev>
        <Rev><div style={{padding:"22px",background:B.grey,borderRadius:12,border:`1px solid ${B.bdr}`,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:38,height:38,borderRadius:7,background:`linear-gradient(135deg,${B.g}22,${B.s}22)`,border:`1px solid ${B.gB}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:B.g}}>8/0</span></div><div><div style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:B.tx}}>Your Best Engineers Are Becoming Middleware Plumbers</div><div style={{fontFamily:F.m,fontSize:10,color:B.dm}}>Episode 001 · 10:24</div></div></div>
            <Tag color={B.s}>PILOT</Tag>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setPlaying(!playing)} style={{width:36,height:36,borderRadius:"50%",border:"none",background:B.g,color:B.black,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{playing?"❚❚":"▶"}</button>
            <div style={{flex:1,display:"flex",alignItems:"center",gap:1.5,height:44}}>{bars.map((h,i)=><div key={i} style={{width:3,height:h+"%",borderRadius:2,background:i/bars.length<progress/100?B.g:B.bdr2,flexShrink:0}}/>)}</div>
            <span style={{fontFamily:F.m,fontSize:10,color:B.dm,flexShrink:0}}>{playing?`${Math.floor(progress/100*10)}:${String(Math.floor((progress/100*24)%60)).padStart(2,"0")}`:"10:24"}</span>
          </div>
          <div style={{marginTop:8,height:2,background:B.bdr,borderRadius:2,overflow:"hidden",cursor:"pointer"}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress((e.clientX-r.left)/r.width*100)}}><div style={{height:"100%",width:`${progress}%`,background:B.g,borderRadius:2}}/></div>
        </div></Rev>
        <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontFamily:F.m,fontSize:9,color:B.dm,letterSpacing:1}}>COMING SOON ON</span>{["Apple Podcasts","Spotify","YouTube"].map(p=><span key={p} style={{fontFamily:F.b,fontSize:10,color:B.dm,padding:"4px 10px",background:B.card,border:`1px solid ${B.bdr}`,borderRadius:4}}>{p}</span>)}</div>
      </W>
    </section>
  );
}

/* ═══ 07 · IMPACT ═══ */
function S07(){return(
  <section style={{background:B.grey,padding:"20px 0 56px"}}>
    <SectionBreak n="07" title="Impact" color={B.r} id="impact"/>
    <N style={{paddingTop:28}}>
      <Rev><h2 style={{fontFamily:F.d,fontSize:"clamp(24px,3.5vw,36px)",color:B.tx,lineHeight:1.15,marginBottom:12,maxWidth:620}}>Every improvement hits hardest for the people at the bottom.</h2></Rev>
      <Rev><p style={{fontFamily:F.b,fontSize:15,color:B.mu,lineHeight:1.65,maxWidth:560,marginBottom:24}}>The group insurance system disproportionately serves hourly, frontline, and lower-income workers. For them, a disability event isn't an inconvenience — it's a financial emergency.</p></Rev>
    </N>
    {/* Crisis stats — always visible */}
    <W><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:8}}>
      {[{n:"59%",d:"can't cover a $1K emergency",c:B.r},{n:"72.8%",d:"under $50K live paycheck to paycheck",c:B.r},{n:"4–8 wks",d:"last paycheck to first benefit",c:B.a},{n:"231 days",d:"SSDI processing — up from 110",c:B.a}].map((s,i)=><Rev key={i} delay={i+1}><div style={{padding:"20px 16px",background:B.black,borderRadius:8,border:`1px solid ${B.bdr}`,height:"100%"}}><div style={{fontFamily:F.d,fontSize:28,color:s.c,lineHeight:1}}>{s.n}</div><div style={{fontFamily:F.b,fontSize:11,color:B.mu,marginTop:6,lineHeight:1.4}}>{s.d}</div></div></Rev>)}
    </div></W>
    <Expand label="Read the full impact analysis">
      <N style={{paddingTop:24}}>
        <P>Consider a warehouse worker earning $38,000 a year who needs surgery. Straightforward STD claim. Under the current system, that claim requires 10–15+ touchpoints across HR, the carrier, and the doctor's office. Stale eligibility files trigger reconciliation queues. Salary mismatches flag for review. Missing physician forms add another week. By the time the first benefit check arrives, this worker has lost $2,900–$4,600 in income to infrastructure-driven delays alone. Many take payday loans at 300–400% APR. Some tap retirement savings. Some skip the medical care that caused the leave.</P>
      </N>
      <W><Rev><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
        <div style={{padding:"24px 22px",background:B.black,borderRadius:10,borderTop:`3px solid ${B.r}`}}><div style={{fontFamily:F.m,fontSize:9,color:B.r,letterSpacing:1.5,marginBottom:10}}>TODAY</div><div style={{fontFamily:F.d,fontSize:26,color:B.tx,marginBottom:4}}>10–15+</div><p style={{fontFamily:F.b,fontSize:12,color:B.mu,marginBottom:14}}>touchpoints per claim</p><div style={{fontFamily:F.d,fontSize:26,color:B.tx,marginBottom:4}}>$2,900–$4,600</div><p style={{fontFamily:F.b,fontSize:12,color:B.mu}}>lost income for a $38K worker</p></div>
        <div style={{padding:"24px 22px",background:B.black,borderRadius:10,borderTop:`3px solid ${B.g}`}}><div style={{fontFamily:F.m,fontSize:9,color:B.g,letterSpacing:1.5,marginBottom:10}}>WITH 8/0</div><div style={{fontFamily:F.d,fontSize:26,color:B.tx,marginBottom:4}}>1 entry</div><p style={{fontFamily:F.b,fontSize:12,color:B.mu,marginBottom:14}}>Eligibility auto-confirmed instantly.</p><div style={{fontFamily:F.d,fontSize:26,color:B.tx,marginBottom:4}}>Days, not weeks</div><p style={{fontFamily:F.b,fontSize:12,color:B.mu}}>Gap = elimination period only.</p></div>
      </div></Rev></W>
      <N>
        <P>With clean data infrastructure, the same claim flows differently. The worker enters the event once. Eligibility confirms against real-time census data. The physician gets a pre-populated digital form. The adjudicator gets a clean file on first review. Payment triggers on approval. The gap collapses to the contractual elimination period and nothing more.</P>
        <P>The impact operates through three channels. Speed preserves income. Accuracy prevents wrongful denials. And access becomes possible — clean data makes it viable for carriers to deliver supplemental products like hospital indemnity ($6–$70/month) to the workers these products were designed for but currently never reach.</P>
      </N>
      <W><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
        {[{t:"Speed",c:B.g,d:"Preserves $1,450–$2,900 in take-home pay that would go to late fees, overdrafts, or predatory lending."},{t:"Accuracy",c:B.s,d:"Eliminates data-driven denials — stale files, salary mismatches, ambiguous job codes."},{t:"Access",c:B.a,d:"Enables supplemental products ($6–$70/mo) for the lower-income workers they were designed for."}].map((c,i)=><Rev key={i} delay={i+1}><div style={{padding:"22px 18px",background:B.black,border:`1px solid ${B.bdr}`,borderRadius:10,borderTop:`3px solid ${c.c}`,height:"100%"}}><h4 style={{fontFamily:F.d,fontSize:18,color:B.tx,marginBottom:6}}>{c.t}</h4><p style={{fontFamily:F.b,fontSize:12,color:B.mu,lineHeight:1.55}}>{c.d}</p></div></Rev>)}
      </div></W>
      <N>
        <P>The financial value of speed, accuracy, and access is inversely proportional to income. Every improvement produces its highest marginal return for the most underserved members of the covered population.</P>
        <Quote text="Financial services should provide stability, not stress. But too often, gaps in the system leave families struggling with everyday financial shocks and unable to build for the future." attr="Vikas Raj, Co-Founder, ResilienceVC" color={B.a}/>
      </N>
    </Expand>
  </section>
);}

/* ═══ FOOTER ═══ */
function Footer({email,setEmail,subDone,setSubDone}){return(
  <footer style={{background:B.black,padding:"20px 0 24px"}}><W>
    <div style={{height:2,background:B.g,marginBottom:32,borderRadius:1}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,marginBottom:32}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:B.black,background:B.g,padding:"2px 7px",borderRadius:3}}>8/0</span><span style={{fontFamily:F.d,fontSize:14,color:B.tx}}>Eight by Zero</span></div>
        <p style={{fontFamily:F.b,fontSize:12,color:B.dm,lineHeight:1.5,maxWidth:300,marginBottom:12}}>The intelligent data layer for carriers and TPAs.</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><a href="mailto:connect@eightbyzero.com" style={{fontFamily:F.m,fontSize:10,color:B.g,padding:"4px 10px",border:`1px solid ${B.gB}`,borderRadius:4}}>connect@eightbyzero.com</a><a href="https://eightbyzero.com" target="_blank" rel="noopener noreferrer" style={{fontFamily:F.m,fontSize:10,color:B.dm,padding:"4px 10px",border:`1px solid ${B.bdr}`,borderRadius:4}}>eightbyzero.com</a></div>
      </div>
      <div style={{background:B.grey,borderRadius:10,border:`1px solid ${B.bdr}`,padding:"18px"}}><p style={{fontFamily:F.d,fontSize:16,color:B.tx,marginBottom:6}}>Get the next issue</p><p style={{fontFamily:F.b,fontSize:11,color:B.dm,marginBottom:10,lineHeight:1.5}}>Published biweekly. No spam.</p><Sub email={email} setEmail={setEmail} done={subDone} setDone={setSubDone}/></div>
    </div>
    <div style={{paddingTop:14,borderTop:`1px solid ${B.bdr}`,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}><span style={{fontFamily:F.m,fontSize:9,color:B.dm}}>© 2026 EightByZero</span><span style={{fontFamily:F.m,fontSize:9,color:B.dm}}>The Connector · Issue 001 · April 2026</span></div>
  </W></footer>
);}

/* ═══ APP ═══ */
export default function App(){
  const[email,setEmail]=useState("");const[subDone,setSubDone]=useState(false);
  useProgress();
  return<div style={{background:B.black,minHeight:"100vh",fontFamily:F.b,color:B.tx}}>
    <style>{css}</style><div id="progress-bar"/><Masthead/>
    <S01/><S02/><S03/><S04/>
    <S05 email={email} setEmail={setEmail} subDone={subDone} setSubDone={setSubDone}/>
    <S06/><S07/>
    <Footer email={email} setEmail={setEmail} subDone={subDone} setSubDone={setSubDone}/>
  </div>;
}
