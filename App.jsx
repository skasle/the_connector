import { useState, useRef, useEffect, useCallback } from "react";

/* ═══ BRAND ═══ */
const B = {
  bg:"#080c0a",bg2:"#0d120f",srf:"#111916",card:"#151d19",
  bdr:"#1c2b23",bdr2:"#2a3d33",
  tx:"#e4e8e6",mu:"#8fa398",dm:"#556b60",
  g:"#2ecc71",gS:"rgba(46,204,113,0.08)",gB:"rgba(46,204,113,0.22)",
  r:"#ff6b6b",rS:"rgba(255,107,107,0.08)",
  a:"#f5a623",aS:"rgba(245,166,35,0.08)",
  s:"#5dadec",
};
const F = {
  d:"'Instrument Serif','Playfair Display',Georgia,serif",
  b:"'DM Sans','Helvetica Neue',sans-serif",
  m:"'JetBrains Mono','Fira Code',monospace",
};

/* ═══ CSS ═══ */
const css=`
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=JetBrains+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
::selection{background:${B.g};color:${B.bg}}
html{scroll-behavior:smooth}
a{color:inherit;text-decoration:none}
input:focus{outline:2px solid ${B.g};outline-offset:-2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(46,204,113,0)}50%{box-shadow:0 0 20px 4px rgba(46,204,113,0.15)}}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .6s ease-out,transform .6s ease-out}
.reveal.vis{opacity:1;transform:translateY(0)}
.reveal-d1{transition-delay:.08s}.reveal-d2{transition-delay:.16s}.reveal-d3{transition-delay:.24s}.reveal-d4{transition-delay:.32s}
`;

/* ═══ DATA ═══ */
const NAV_ITEMS=[
  {id:"top",l:"Home"},{id:"problem",l:"The Problem"},{id:"product",l:"How It Works"},
  {id:"proof",l:"Proof Points"},{id:"diagnostic",l:"Diagnostic"},
  {id:"brief",l:"The Brief"},{id:"impact",l:"Impact"},
];

const PAIN=[
  {n:"10+",d:"disparate data sources per claim",s:"Each one a potential failure point"},
  {n:"70%",d:"of claims processing spent on data gathering",s:"Not adjudication. Just finding information."},
  {n:"6–9 mo",d:"to onboard a single new employer",s:"At $100K+ per onboarding"},
  {n:"$750K",d:"to build one HRIS integration",s:"Plus $300K/yr to maintain it"},
];

const CAPS=[
  {n:"01",t:"Connect & Learn",d:"AI agents parse vendor API docs, detect schema changes, and map custom configurations automatically. New employer systems connected in hours, not months.",c:B.g},
  {n:"02",t:"Workflow Interpretation",d:"Translate employer-specific policies, eligibility rules, and operational requirements into structured workflows your systems already understand.",c:B.a},
  {n:"03",t:"Monitor & Self-Heal",d:"Agents monitor data flows, detect anomalies, auto-correct mapping errors, and escalate only when confidence is low. Clean data, not fire drills.",c:B.s},
];

const COMP=[
  {l:"Connectivity per employer",old:"200 hours",nw:"2–5 hours"},
  {l:"Maintenance ratio",old:"1 FTE : 10–20 employers",nw:"1 FTE : 1,000 employers"},
  {l:"Data accuracy",old:"50–75%",nw:"99%"},
];

const PROOF=[
  {stat:"+5%",lbl:"Revenue",q:"The differentiation this would provide will command at least 5% top line increase.",a:"CMO, Top-3 Carrier",c:B.g},
  {stat:"−20%",lbl:"Claims Expense",q:"Claims cost us north of $60M/yr. Having direct access to client systems could easily reduce that by 20%.",a:"VP of Claims, Top-3 TPA",c:B.r},
  {stat:"−40%",lbl:"Onboarding Cost",q:"Having a simplified access point to our clients' systems could mean a 40% implementation cost reduction.",a:"CIO, Top-3 Carrier",c:B.a},
];

const ARTICLE_BLOCKS=[
  {t:"lede",v:"Somewhere inside every mid-to-large carrier, there's a dev team hired to build smart claims automation. Instead, they spend 60% of their time maintaining point-to-point integrations with TPAs, brokers, and employer platforms that were duct-taped together years ago."},
  {t:"p",v:"Nobody planned it this way. Each integration made sense at the time — a new TPA partner needed an eligibility feed, a broker portal required a status API, an employer group wanted real-time FMLA tracking. Reasonable requests, individually. But compounded over a decade, the result is a Rube Goldberg machine held together by batch files, SFTP drops, and institutional memory."},
  {t:"q",v:"We have engineers who could be building predictive models for return-to-work timing. Instead they're debugging why a CSV from 2016 started dropping middle initials on Tuesdays.",a:"VP of Technology, Top-15 Group Disability Carrier"},
  {t:"h",v:"The math nobody does"},
  {t:"p",v:"Take your integration team's fully loaded cost. Multiply by the percentage of time on maintenance versus net-new capability. That delta — usually 40–70% of the team's capacity — is your connectivity debt, compounding silently every quarter."},
  {t:"p",v:"It's not a technology problem. It's an architecture problem. Every new partner, every new product line adds another spoke to a hub that was never designed to be a hub. Your core claims platform becomes an accidental integration platform."},
  {t:"h",v:"This isn't a build vs. buy conversation"},
  {t:"p",v:"Your systems work. Your team is good. The problem is that your good team is doing work that shouldn't require a good team — or any team. An interoperability layer normalizes data, manages connection state, handles translation. Your engineers stop plumbing and start building again. They become the heroes."},
  {t:"q",v:"The carriers that modernize fastest aren't the ones with the biggest IT budgets. They're the ones that stop asking dev teams to solve infrastructure problems with application code.",a:"Dawn McMaster, 2nd VP, Munich Re"},
];

/* ═══ HOOKS ═══ */
function useReveal(){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){e.target.classList.add("vis");obs.unobserve(e.target)}
    },{threshold:0.12});
    obs.observe(el);
    return()=>obs.disconnect();
  },[]);
  return ref;
}
function Rev({children,delay=0,className="",style={}}){
  const r=useReveal();
  return <div ref={r} className={`reveal ${delay?`reveal-d${delay}`:""} ${className}`} style={style}>{children}</div>;
}

function useScrollSpy(){
  const[active,setActive]=useState("top");
  useEffect(()=>{
    const obs=new IntersectionObserver(es=>{
      for(const e of es)if(e.isIntersecting)setActive(e.target.id);
    },{rootMargin:"-40% 0px -55% 0px"});
    NAV_ITEMS.forEach(s=>{const el=document.getElementById(s.id);if(el)obs.observe(el)});
    return()=>obs.disconnect();
  },[]);
  return active;
}

/* ═══ ATOMS ═══ */
function Tag({children,color=B.g}){
  return<span style={{fontFamily:F.m,fontSize:10,fontWeight:500,letterSpacing:1.5,color,background:color+"18",padding:"3px 10px",borderRadius:4,textTransform:"uppercase",display:"inline-block"}}>{children}</span>;
}
function Wrap({children,id,style}){
  return<section id={id} style={{maxWidth:1060,margin:"0 auto",padding:"88px 28px",...style}}>{children}</section>;
}
function SH({tag,title,sub,center}){
  return(
    <div style={{textAlign:center?"center":"left",marginBottom:52}}>
      {tag&&<div style={{marginBottom:14}}><Tag>{tag}</Tag></div>}
      <h2 style={{fontFamily:F.d,fontSize:"clamp(28px,4.2vw,44px)",fontWeight:400,color:B.tx,lineHeight:1.12,letterSpacing:-.5,maxWidth:center?700:"none",margin:center?"0 auto":0}}>{title}</h2>
      {sub&&<p style={{fontFamily:F.b,fontSize:17,color:B.mu,lineHeight:1.6,marginTop:14,maxWidth:center?580:540,margin:center?"14px auto 0":"14px 0 0"}}>{sub}</p>}
    </div>
  );
}
function Btn({children,href,primary,style={}}){
  const s=primary
    ?{color:B.bg,background:B.g,border:"none"}
    :{color:B.g,background:"transparent",border:`1px solid ${B.gB}`};
  return<a href={href} target={href?.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
    style={{fontFamily:F.b,fontSize:14,fontWeight:600,borderRadius:9,padding:"12px 26px",display:"inline-block",textDecoration:"none",transition:"opacity .15s",...s,...style}}>{children}</a>;
}
function Divider(){
  return<div style={{maxWidth:1060,margin:"0 auto",padding:"0 28px"}}><div style={{height:1,background:B.bdr}}/></div>;
}

/* ═══ NAV ═══ */
function Nav({active}){
  return(
    <nav style={{position:"sticky",top:0,zIndex:100,background:B.bg+"ee",backdropFilter:"blur(16px)",borderBottom:`1px solid ${B.bdr}`}}>
      <div style={{maxWidth:1060,margin:"0 auto",padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54}}>
        <a href="#top" style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:F.m,fontSize:12,fontWeight:700,color:B.bg,background:B.g,padding:"3px 8px",borderRadius:3,letterSpacing:1}}>8/0</span>
          <span style={{fontFamily:F.d,fontSize:16,color:B.tx}}>The Connector</span>
        </a>
        <div style={{display:"flex",gap:2,overflow:"auto"}}>
          {NAV_ITEMS.filter(s=>s.id!=="top").map(s=>(
            <a key={s.id} href={`#${s.id}`} style={{fontFamily:F.b,fontSize:12,fontWeight:500,color:active===s.id?B.g:B.mu,background:active===s.id?B.gS:"transparent",borderRadius:6,padding:"5px 12px",whiteSpace:"nowrap",transition:"color .15s"}}>{s.l}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══ HERO ═══ */
function Hero(){
  return(
    <Wrap id="top" style={{paddingTop:56,paddingBottom:48}}>
      <Rev>
        <Tag>Agentic Interoperability for Absence & Disability</Tag>
        <h1 style={{fontFamily:F.d,fontSize:"clamp(36px,5.5vw,60px)",fontWeight:400,lineHeight:1.06,letterSpacing:-1.5,color:B.tx,marginTop:20,marginBottom:16}}>
          Infinite connectivity.<br/><span style={{color:B.g}}>Zero friction.</span>
        </h1>
        <p style={{fontFamily:F.b,fontSize:18,color:B.mu,lineHeight:1.65,maxWidth:560,marginBottom:32}}>
          8/0 is the intelligent data layer between carriers, TPAs, and employer systems. We turn months of integration work into hours — so your team can stop plumbing and start building.
        </p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Btn href="#diagnostic" primary>Run the Diagnostic →</Btn>
          <Btn href="#brief">Read the Latest Brief</Btn>
        </div>
      </Rev>
      <Rev delay={1}>
        <div style={{marginTop:56,padding:"22px 0",borderTop:`1px solid ${B.bdr}`,borderBottom:`1px solid ${B.bdr}`,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {[{n:"200h → 2h",l:"Employer connectivity"},{n:"99%",l:"Data accuracy"},{n:"50×",l:"Maintenance efficiency"},{n:"$750K",l:"Saved per integration"}].map((t,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontFamily:F.m,fontSize:22,fontWeight:500,color:B.g}}>{t.n}</div>
              <div style={{fontFamily:F.b,fontSize:12,color:B.dm,marginTop:4}}>{t.l}</div>
            </div>
          ))}
        </div>
      </Rev>
    </Wrap>
  );
}

/* ═══ PROBLEM ═══ */
function Problem(){
  return(
    <Wrap id="problem">
      <Rev><SH tag="The Problem" title="The absence & disability ecosystem runs on broken plumbing." sub="Every carrier knows it. Most have tried to fix it in-house. ~90% fail. Here's why the numbers don't work."/></Rev>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:48}}>
        {PAIN.map((s,i)=>(
          <Rev key={i} delay={i+1}>
            <div style={{padding:"28px 22px",background:B.srf,border:`1px solid ${B.bdr}`,borderRadius:14,height:"100%"}}>
              <div style={{fontFamily:F.d,fontSize:38,color:B.r,lineHeight:1,marginBottom:8}}>{s.n}</div>
              <div style={{fontFamily:F.b,fontSize:14,fontWeight:600,color:B.tx,marginBottom:6,lineHeight:1.35}}>{s.d}</div>
              <div style={{fontFamily:F.b,fontSize:13,color:B.dm,lineHeight:1.4}}>{s.s}</div>
            </div>
          </Rev>
        ))}
      </div>
      <Rev>
        <div style={{padding:"28px 32px",background:B.srf,borderRadius:14,borderLeft:`3px solid ${B.r}`,marginBottom:20}}>
          <p style={{fontFamily:F.d,fontSize:19,fontStyle:"italic",lineHeight:1.6,color:B.tx,marginBottom:10}}>
            "Our internal integration with Workday took 9 months and cost us more than $750,000 in engineering — and now we have 2–3 FTEs just to maintain it. There's no way we can do this for all systems out there."
          </p>
          <cite style={{fontFamily:F.m,fontSize:11,color:B.r,fontStyle:"normal",letterSpacing:.5}}>— Dir. of Engineering, Top-10 Carrier</cite>
        </div>
      </Rev>
      <Rev>
        <div style={{padding:"20px 24px",borderRadius:10,background:B.gS,border:`1px solid ${B.gB}`}}>
          <p style={{fontFamily:F.b,fontSize:14,color:B.g,fontWeight:600,marginBottom:4}}>The structural insight</p>
          <p style={{fontFamily:F.b,fontSize:14,color:B.mu,lineHeight:1.6}}>
            No one in the ecosystem is incentivized to solve this holistically. Carriers can't justify building integrations to every HR system. HR vendors have no incentive to standardize for carriers. The result: a connectivity vacuum that costs the industry billions and delays benefits to the workers who need them most.
          </p>
        </div>
      </Rev>
    </Wrap>
  );
}

/* ═══ PRODUCT ═══ */
function Product(){
  return(
    <Wrap id="product">
      <Rev><SH tag="How It Works" title="Hard-coded integrations break. 8/0 agents adapt."
        sub="An agentic data orchestration layer that connects to any employer system, learns its schema, and delivers clean data to your platform — continuously."/></Rev>

      {/* Architecture diagram */}
      <Rev>
        <div style={{marginBottom:48,padding:"36px 32px",background:B.srf,borderRadius:16,border:`1px solid ${B.bdr}`,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:0,alignItems:"center"}}>
            {/* Left: Employer Systems */}
            <div>
              <div style={{fontFamily:F.m,fontSize:10,color:B.r,letterSpacing:1.5,marginBottom:16,textTransform:"uppercase"}}>Employer Ecosystem</div>
              {["HRIS · 20+ vendors","Payroll · 10+ vendors","Time & Attendance · 25+ vendors","Benefits Admin · 5+ vendors"].map((s,i)=>(
                <div key={i} style={{padding:"10px 16px",background:B.card,border:`1px solid ${B.bdr}`,borderRadius:8,marginBottom:6,fontFamily:F.b,fontSize:13,color:B.mu}}>
                  {s}
                </div>
              ))}
            </div>
            {/* Center: 8/0 */}
            <div style={{textAlign:"center",padding:"0 28px"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <div style={{fontSize:10,color:B.dm,fontFamily:F.m}}>← data flows →</div>
                <div style={{
                  width:80,height:80,borderRadius:16,
                  background:`linear-gradient(135deg,${B.g}22,${B.g}08)`,
                  border:`2px solid ${B.gB}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  animation:"pulseGlow 3s ease-in-out infinite",
                }}>
                  <span style={{fontFamily:F.m,fontSize:18,fontWeight:700,color:B.g}}>8/0</span>
                </div>
                <div style={{fontFamily:F.m,fontSize:10,color:B.g,letterSpacing:1}}>AI AGENTS</div>
                <div style={{display:"flex",gap:6,marginTop:4}}>
                  {["MCP","A2A","API"].map(p=>(
                    <span key={p} style={{fontFamily:F.m,fontSize:9,color:B.g,padding:"2px 8px",border:`1px solid ${B.gB}`,borderRadius:4}}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Right: Carrier Systems */}
            <div>
              <div style={{fontFamily:F.m,fontSize:10,color:B.g,letterSpacing:1.5,marginBottom:16,textTransform:"uppercase"}}>Carrier / TPA Systems</div>
              {["Policy Administration","Underwriting","Claims","Customer Service Portals"].map((s,i)=>(
                <div key={i} style={{padding:"10px 16px",background:B.card,border:`1px solid ${B.bdr}`,borderRadius:8,marginBottom:6,fontFamily:F.b,fontSize:13,color:B.mu}}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Rev>

      {/* Capability cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:48}}>
        {CAPS.map((c,i)=>(
          <Rev key={i} delay={i+1}>
            <div style={{padding:"32px 26px",background:B.srf,border:`1px solid ${B.bdr}`,borderRadius:14,borderTop:`3px solid ${c.c}`,height:"100%"}}>
              <div style={{fontFamily:F.m,fontSize:11,color:c.c,letterSpacing:1.5,marginBottom:14}}>{c.n}</div>
              <h3 style={{fontFamily:F.d,fontSize:22,color:B.tx,marginBottom:10,lineHeight:1.2}}>{c.t}</h3>
              <p style={{fontFamily:F.b,fontSize:14,color:B.mu,lineHeight:1.6}}>{c.d}</p>
            </div>
          </Rev>
        ))}
      </div>

      {/* Comparison table */}
      <Rev>
        <div style={{background:B.srf,borderRadius:14,border:`1px solid ${B.bdr}`,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr",borderBottom:`1px solid ${B.bdr}`}}>
            <div style={{padding:"14px 22px"}}/>
            <div style={{padding:"14px 22px",fontFamily:F.m,fontSize:10,color:B.r,letterSpacing:1.5,textAlign:"center",borderLeft:`1px solid ${B.bdr}`}}>LEGACY</div>
            <div style={{padding:"14px 22px",fontFamily:F.m,fontSize:10,color:B.g,letterSpacing:1.5,textAlign:"center",borderLeft:`1px solid ${B.bdr}`}}>WITH 8/0</div>
          </div>
          {COMP.map((r,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr",borderBottom:i<COMP.length-1?`1px solid ${B.bdr}`:"none"}}>
              <div style={{padding:"18px 22px",fontFamily:F.b,fontSize:14,color:B.tx}}>{r.l}</div>
              <div style={{padding:"18px 22px",fontFamily:F.m,fontSize:14,color:B.r,textAlign:"center",borderLeft:`1px solid ${B.bdr}`,opacity:.65,textDecoration:"line-through"}}>{r.old}</div>
              <div style={{padding:"18px 22px",fontFamily:F.m,fontSize:14,color:B.g,textAlign:"center",fontWeight:600,borderLeft:`1px solid ${B.bdr}`}}>{r.nw}</div>
            </div>
          ))}
        </div>
      </Rev>
    </Wrap>
  );
}

/* ═══ PROOF ═══ */
function Proof(){
  return(
    <Wrap id="proof">
      <Rev><SH tag="Proof Points" title="The people who run this world are already seeing it."
        sub="Early validation from carriers and TPAs managing billions in group disability and absence benefits."/></Rev>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:36}}>
        {PROOF.map((q,i)=>(
          <Rev key={i} delay={i+1}>
            <div style={{padding:"32px 26px",background:B.srf,border:`1px solid ${B.bdr}`,borderRadius:14,height:"100%"}}>
              <div style={{fontFamily:F.d,fontSize:52,color:q.c,lineHeight:1,marginBottom:4}}>{q.stat}</div>
              <div style={{fontFamily:F.m,fontSize:10,color:q.c,letterSpacing:1.5,marginBottom:18,textTransform:"uppercase"}}>{q.lbl}</div>
              <p style={{fontFamily:F.d,fontSize:16,fontStyle:"italic",color:B.tx,lineHeight:1.55,marginBottom:12}}>"{q.q}"</p>
              <cite style={{fontFamily:F.m,fontSize:11,color:B.dm,fontStyle:"normal"}}>— {q.a}</cite>
            </div>
          </Rev>
        ))}
      </div>
      <Rev>
        <div style={{padding:"24px 28px",background:B.srf,borderRadius:12,borderLeft:`3px solid ${B.s}`}}>
          <p style={{fontFamily:F.d,fontSize:17,fontStyle:"italic",lineHeight:1.55,color:B.tx,marginBottom:8}}>
            "A carrier has to approve an employee with chronic migraines for 15-minute breaks, 4 to 5 times per week — getting that right is very complex."
          </p>
          <cite style={{fontFamily:F.m,fontSize:11,color:B.s,fontStyle:"normal"}}>— Sr. Director of Claims</cite>
        </div>
      </Rev>
    </Wrap>
  );
}

/* ═══ DIAGNOSTIC ═══ */
function Diagnostic(){
  const[hover,setHover]=useState(false);
  return(
    <Wrap id="diagnostic">
      <Rev>
        <div style={{
          background:`linear-gradient(135deg,${B.srf},${B.card})`,borderRadius:20,
          border:`1px solid ${B.bdr}`,padding:"60px 44px",textAlign:"center",position:"relative",overflow:"hidden",
        }}>
          <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:`radial-gradient(ellipse at 50% 0%,${B.g}08,transparent 70%)`,pointerEvents:"none"}}/>
          <div style={{position:"relative"}}>
            <Tag>Interactive Assessment</Tag>
            <h2 style={{fontFamily:F.d,fontSize:"clamp(26px,4vw,40px)",color:B.tx,marginTop:18,marginBottom:14,lineHeight:1.12}}>
              How deep is your integration debt?
            </h2>
            <p style={{fontFamily:F.b,fontSize:16,color:B.mu,lineHeight:1.6,maxWidth:520,margin:"0 auto 16px"}}>
              8 questions across 4 dimensions — cost burden, coverage gaps, maintenance load, and onboarding speed. Get a precise score and see how you compare.
            </p>
            <div style={{display:"flex",justifyContent:"center",gap:40,margin:"32px 0 40px",flexWrap:"wrap"}}>
              {[{n:"01",l:"Cost Burden",c:B.g},{n:"02",l:"Coverage Gaps",c:B.r},{n:"03",l:"Maintenance Load",c:B.a},{n:"04",l:"Onboarding Speed",c:B.s}].map(d=>(
                <div key={d.n} style={{textAlign:"center"}}>
                  <div style={{fontFamily:F.m,fontSize:22,fontWeight:500,color:d.c}}>{d.n}</div>
                  <div style={{fontFamily:F.b,fontSize:12,color:B.dm,marginTop:3}}>{d.l}</div>
                </div>
              ))}
            </div>
            <a href="https://diagnostic.eightbyzero.com/" target="_blank" rel="noopener noreferrer"
              onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
              style={{
                fontFamily:F.b,fontSize:16,fontWeight:600,textDecoration:"none",
                color:B.bg,background:B.g,borderRadius:10,padding:"16px 44px",
                display:"inline-block",transition:"transform .15s,box-shadow .15s",
                transform:hover?"translateY(-2px)":"none",
                boxShadow:hover?`0 8px 24px ${B.g}33`:"none",
              }}>Run the Diagnostic →</a>
            <p style={{fontFamily:F.m,fontSize:11,color:B.dm,marginTop:18}}>
              Takes 3 minutes. Results are private. We follow up only if your score suggests we can help.
            </p>
          </div>
        </div>
      </Rev>
    </Wrap>
  );
}

/* ═══ SUBSCRIBE BOX ═══ */
function Sub({email,setEmail,done,setDone,compact}){
  if(done)return<div style={{padding:18,background:B.gS,borderRadius:10,border:`1px solid ${B.gB}`,textAlign:"center"}}><p style={{fontFamily:F.b,fontSize:14,fontWeight:600,color:B.g}}>You're in. ✓</p></div>;
  return(
    <div style={{padding:compact?20:28,background:B.srf,borderRadius:14,border:`1px solid ${B.bdr}`}}>
      {!compact&&<p style={{fontFamily:F.d,fontSize:20,color:B.tx,marginBottom:6}}>Get the next issue</p>}
      <p style={{fontFamily:F.b,fontSize:13,color:B.mu,marginBottom:14,lineHeight:1.5}}>
        {compact?"No spam. Just the brief.":"Biweekly observations on interoperability, integration debt, and what the smartest carriers are doing about it."}
      </p>
      <div style={{display:"flex",gap:8}}>
        <input type="email" placeholder="you@carrier.com" value={email} onChange={e=>setEmail(e.target.value)}
          style={{flex:1,fontFamily:F.b,fontSize:14,padding:"10px 14px",borderRadius:8,border:`1px solid ${B.bdr}`,background:B.card,color:B.tx}}/>
        <button onClick={()=>email.includes("@")&&setDone(true)} style={{
          fontFamily:F.b,fontSize:14,fontWeight:600,color:B.bg,background:B.g,
          border:"none",borderRadius:8,padding:"10px 22px",cursor:"pointer",
          opacity:email.includes("@")?1:.4,
        }}>Subscribe</button>
      </div>
    </div>
  );
}

/* ═══ BRIEF ═══ */
function Brief({email,setEmail,subDone,setSubDone}){
  const[open,setOpen]=useState(false);
  const pre=ARTICLE_BLOCKS.slice(0,3),rest=ARTICLE_BLOCKS.slice(3);
  const renderB=(b,i)=>{
    if(b.t==="lede")return<p key={i} style={{fontFamily:F.b,fontSize:18,lineHeight:1.7,color:B.tx,marginBottom:24,fontWeight:300,borderLeft:`3px solid ${B.g}`,paddingLeft:18}}>{b.v}</p>;
    if(b.t==="p")return<p key={i} style={{fontFamily:F.b,fontSize:16,lineHeight:1.78,color:B.mu,marginBottom:20}}>{b.v}</p>;
    if(b.t==="h")return<h3 key={i} style={{fontFamily:F.d,fontSize:24,color:B.tx,marginTop:32,marginBottom:12}}>{b.v}</h3>;
    if(b.t==="q")return<blockquote key={i} style={{margin:"28px 0",padding:"22px 26px",background:B.srf,borderRadius:12,borderLeft:`3px solid ${B.g}`}}>
      <p style={{fontFamily:F.d,fontSize:17,fontStyle:"italic",lineHeight:1.55,color:B.tx,marginBottom:8}}>"{b.v}"</p>
      <cite style={{fontFamily:F.m,fontSize:11,color:B.g,fontStyle:"normal"}}>— {b.a}</cite>
    </blockquote>;
    return null;
  };
  return(
    <Wrap id="brief">
      <Rev><SH tag="The Connector · Issue 001" title="Your Best Engineers Are Becoming Middleware Plumbers"
        sub="How the integration queue quietly became the most expensive line item in absence & disability ops."/></Rev>
      <Rev>
        <div style={{display:"grid",gridTemplateColumns:open?"1fr":"1fr 300px",gap:32}}>
          <div style={{maxWidth:660}}>
            {pre.map(renderB)}
            {!open&&<button onClick={()=>setOpen(true)} style={{
              fontFamily:F.b,fontSize:14,fontWeight:600,color:B.g,background:B.gS,
              border:`1px solid ${B.gB}`,borderRadius:8,padding:"12px 28px",cursor:"pointer",marginTop:8,
            }}>Continue reading →</button>}
            {open&&<>{rest.map(renderB)}<div style={{marginTop:40}}><Sub email={email} setEmail={setEmail} done={subDone} setDone={setSubDone}/></div></>}
          </div>
          {!open&&<div>
            <div style={{padding:22,background:B.srf,border:`1px solid ${B.bdr}`,borderRadius:14,marginBottom:16}}>
              <div style={{fontFamily:F.m,fontSize:10,color:B.a,letterSpacing:1.5,marginBottom:8}}>COMING MAY 2026</div>
              <h4 style={{fontFamily:F.d,fontSize:18,color:B.tx,lineHeight:1.25,marginBottom:6}}>The Broker Channel Is Quietly Forcing Carriers to Interoperate</h4>
              <p style={{fontFamily:F.b,fontSize:13,color:B.dm}}>Whether you planned for it or not.</p>
            </div>
            <Sub email={email} setEmail={setEmail} done={subDone} setDone={setSubDone} compact/>
          </div>}
        </div>
      </Rev>
    </Wrap>
  );
}

/* ═══ IMPACT ═══ */
function Impact(){
  return(
    <Wrap id="impact">
      <Rev><SH tag="Why It Matters" title="Every improvement hits hardest for the people at the bottom."
        sub="Broken data infrastructure isn't just an operations problem. It's a financial crisis for the workers this system was built to protect."/></Rev>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:44}}>
        {[{n:"59%",d:"of Americans can't cover a $1,000 emergency",c:B.r},{n:"72.8%",d:"of workers under $50K live paycheck to paycheck",c:B.r},{n:"4–8 wks",d:"from last paycheck to first benefit payment",c:B.a},{n:"231 days",d:"average SSDI processing — up from 110",c:B.a}].map((s,i)=>(
          <Rev key={i} delay={i+1}>
            <div style={{padding:"24px 20px",background:B.srf,borderRadius:12,border:`1px solid ${B.bdr}`,height:"100%"}}>
              <div style={{fontFamily:F.d,fontSize:32,color:s.c,lineHeight:1}}>{s.n}</div>
              <div style={{fontFamily:F.b,fontSize:13,color:B.mu,marginTop:8,lineHeight:1.4}}>{s.d}</div>
            </div>
          </Rev>
        ))}
      </div>

      {/* Before / After */}
      <Rev>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:44}}>
          <div style={{padding:"30px 26px",background:B.srf,borderRadius:14,borderTop:`3px solid ${B.r}`}}>
            <div style={{fontFamily:F.m,fontSize:10,color:B.r,letterSpacing:1.5,marginBottom:14}}>TODAY'S CLAIMANT EXPERIENCE</div>
            <div style={{fontFamily:F.d,fontSize:30,color:B.tx,marginBottom:4}}>10–15+</div>
            <p style={{fontFamily:F.b,fontSize:14,color:B.mu,marginBottom:18}}>individual touchpoints per claim</p>
            <div style={{fontFamily:F.d,fontSize:30,color:B.tx,marginBottom:4}}>$2,900–$4,600</div>
            <p style={{fontFamily:F.b,fontSize:14,color:B.mu,marginBottom:18}}>lost income during infrastructure delays for a $38K worker</p>
            <p style={{fontFamily:F.b,fontSize:13,color:B.dm,lineHeight:1.5,fontStyle:"italic"}}>
              During the gap, this worker is choosing between rent and prescriptions. They may take a payday loan at 300–400% APR.
            </p>
          </div>
          <div style={{padding:"30px 26px",background:B.srf,borderRadius:14,borderTop:`3px solid ${B.g}`}}>
            <div style={{fontFamily:F.m,fontSize:10,color:B.g,letterSpacing:1.5,marginBottom:14}}>WITH 8/0</div>
            <div style={{fontFamily:F.d,fontSize:30,color:B.tx,marginBottom:4}}>1 entry</div>
            <p style={{fontFamily:F.b,fontSize:14,color:B.mu,marginBottom:18}}>Eligibility auto-confirmed. Claim opens instantly.</p>
            <div style={{fontFamily:F.d,fontSize:30,color:B.tx,marginBottom:4}}>Days, not weeks</div>
            <p style={{fontFamily:F.b,fontSize:14,color:B.mu,marginBottom:18}}>Payment gap compressed to contractual elimination period only.</p>
            <p style={{fontFamily:F.b,fontSize:13,color:B.g,lineHeight:1.5,fontStyle:"italic"}}>
              The infrastructure-driven delay is entirely a data problem. 8/0 solves it.
            </p>
          </div>
        </div>
      </Rev>

      {/* 3 channels */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:36}}>
        {[
          {t:"Speed",c:B.g,d:"Compresses delays from weeks to days. Preserves $1,450–$2,900 in take-home pay for a $38K worker that would otherwise be lost to late fees, overdrafts, or predatory lending."},
          {t:"Accuracy",c:B.s,d:"Eliminates data-driven denials at the source — stale eligibility files, salary mismatches, ambiguous job codes. Prevents financial injuries to workers who can't afford to appeal."},
          {t:"Access",c:B.a,d:"Enables carriers to deliver supplemental products ($6–$70/mo) to the lower-income workers they were designed for. Clean data makes low-premium delivery viable at scale."},
        ].map((c,i)=>(
          <Rev key={i} delay={i+1}>
            <div style={{padding:"28px 24px",background:B.srf,border:`1px solid ${B.bdr}`,borderRadius:14,borderTop:`3px solid ${c.c}`,height:"100%"}}>
              <h4 style={{fontFamily:F.d,fontSize:22,color:B.tx,marginBottom:10}}>{c.t}</h4>
              <p style={{fontFamily:F.b,fontSize:14,color:B.mu,lineHeight:1.6}}>{c.d}</p>
            </div>
          </Rev>
        ))}
      </div>

      <Rev>
        <div style={{padding:"24px 28px",background:B.srf,borderRadius:12,borderLeft:`3px solid ${B.a}`}}>
          <p style={{fontFamily:F.d,fontSize:17,fontStyle:"italic",lineHeight:1.55,color:B.tx,marginBottom:8}}>
            "Financial services should provide stability, not stress. But too often, gaps in the system leave families struggling with everyday financial shocks and unable to build for the future."
          </p>
          <cite style={{fontFamily:F.m,fontSize:11,color:B.a,fontStyle:"normal"}}>— Vikas Raj, Co-Founder, ResilienceVC</cite>
        </div>
      </Rev>
    </Wrap>
  );
}

/* ═══ FOOTER ═══ */
function Footer({email,setEmail,subDone,setSubDone}){
  return(
    <footer style={{borderTop:`1px solid ${B.bdr}`,padding:"52px 28px 32px"}}>
      <div style={{maxWidth:1060,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,marginBottom:40}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <span style={{fontFamily:F.m,fontSize:12,fontWeight:700,color:B.bg,background:B.g,padding:"3px 8px",borderRadius:3}}>8/0</span>
              <span style={{fontFamily:F.d,fontSize:16,color:B.tx}}>Eight by Zero</span>
            </div>
            <p style={{fontFamily:F.b,fontSize:14,color:B.dm,lineHeight:1.6,maxWidth:340,marginBottom:16}}>
              The intelligent data layer for carriers and TPAs. Agentic interoperability for absence & disability.
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <a href="mailto:sam@eightbyzero.com" style={{fontFamily:F.m,fontSize:12,color:B.g,padding:"6px 12px",border:`1px solid ${B.gB}`,borderRadius:5}}>sam@eightbyzero.com</a>
              <a href="https://eightbyzero.com" target="_blank" rel="noopener noreferrer" style={{fontFamily:F.m,fontSize:12,color:B.mu,padding:"6px 12px",border:`1px solid ${B.bdr}`,borderRadius:5}}>eightbyzero.com</a>
            </div>
          </div>
          <Sub email={email} setEmail={setEmail} done={subDone} setDone={setSubDone} compact/>
        </div>
        <div style={{paddingTop:20,borderTop:`1px solid ${B.bdr}`,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <span style={{fontFamily:F.m,fontSize:10,color:B.dm}}>© 2026 EightByZero</span>
          <div style={{display:"flex",gap:16}}>
            {NAV_ITEMS.filter(s=>s.id!=="top").map(s=>(
              <a key={s.id} href={`#${s.id}`} style={{fontFamily:F.m,fontSize:10,color:B.dm}}>{s.l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══ APP ═══ */
export default function App(){
  const active=useScrollSpy();
  const[email,setEmail]=useState("");
  const[subDone,setSubDone]=useState(false);
  return(
    <div style={{background:B.bg,minHeight:"100vh",fontFamily:F.b,color:B.tx}}>
      <style>{css}</style>
      <Nav active={active}/>
      <Hero/>
      <Divider/>
      <Problem/>
      <Divider/>
      <Product/>
      <Divider/>
      <Proof/>
      <Divider/>
      <Diagnostic/>
      <Divider/>
      <Brief email={email} setEmail={setEmail} subDone={subDone} setSubDone={setSubDone}/>
      <Divider/>
      <Impact/>
      <Footer email={email} setEmail={setEmail} subDone={subDone} setSubDone={setSubDone}/>
    </div>
  );
}