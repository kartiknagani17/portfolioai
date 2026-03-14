"use client"

import { useEffect, useRef, useState, useCallback } from "react"

// ── Mock Data ──────────────────────────────────────────────────────────────────
const DATA = {
  personal: {
    fullName: "Alex Rivera",
    professionalTitle: "Senior Product Designer",
    email: "alex@rivera.design",
    phone: "+1 (415) 555-0192",
    location: "San Francisco, CA",
    bio: "I craft digital products used by millions. I bridge the gap between user needs and business goals — turning complex problems into clean, intuitive experiences. Previously at Stripe and Notion.",
    linkedinUrl: "#", githubUrl: "#", websiteUrl: "#",
  },
  experience: [
    { companyName: "Stripe", roleTitle: "Senior Product Designer", startDate: "Jan 2022", endDate: "", isCurrent: true, location: "San Francisco, CA", description: "Lead designer for the Stripe Dashboard used by 500K+ businesses. Redesigned the payments overview reducing time-to-insight by 40%. Built a component library across 12 product teams." },
    { companyName: "Notion", roleTitle: "Product Designer", startDate: "Mar 2020", endDate: "Dec 2021", isCurrent: false, location: "Remote", description: "Owned mobile experience across iOS and Android. Shipped the public API beta. Conducted 40+ user interviews that shaped the Q3 2021 roadmap." },
    { companyName: "Clearbit", roleTitle: "UI/UX Designer", startDate: "Jun 2018", endDate: "Feb 2020", isCurrent: false, location: "San Francisco, CA", description: "First design hire at a 30-person B2B startup. Designed the core product from scratch. Helped grow ARR from $4M to $18M." },
  ],
  projects: [
    { projectName: "Palette", description: "Design token manager — sync tokens across Figma, CSS, and JSON with real-time collaboration.", techStack: ["React", "TypeScript", "Figma API", "Supabase"], liveUrl: "#", githubUrl: "#" },
    { projectName: "Forma", description: "AI-powered portfolio builder for creatives. Upload your work, get a portfolio in under a minute. 3,000+ designers.", techStack: ["Next.js", "OpenAI", "Framer Motion"], liveUrl: "#", githubUrl: "" },
    { projectName: "Grids", description: "CSS grid & flexbox playground with live preview, shareable snippets, and 200+ layouts. 12K MAU.", techStack: ["Vue 3", "Vite", "CodeMirror"], liveUrl: "#", githubUrl: "#" },
    { projectName: "Beacon", description: "Chrome extension for real-time WCAG 2.1 accessibility auditing with shareable reports.", techStack: ["Vanilla JS", "Chrome API"], liveUrl: "", githubUrl: "#" },
  ],
  skills: [
    { name: "Figma", category: "Design" }, { name: "Framer", category: "Design" }, { name: "Principle", category: "Design" }, { name: "Design Systems", category: "Design" },
    { name: "React", category: "Frontend" }, { name: "TypeScript", category: "Frontend" }, { name: "Tailwind", category: "Frontend" }, { name: "Next.js", category: "Frontend" },
    { name: "User Research", category: "Soft Skills" }, { name: "Stakeholder Mgmt", category: "Soft Skills" }, { name: "Design Critique", category: "Soft Skills" },
    { name: "Notion", category: "Tools" }, { name: "Linear", category: "Tools" }, { name: "Loom", category: "Tools" },
  ],
  education: [{ institution: "California College of the Arts", degree: "Bachelor of Fine Arts", fieldOfStudy: "Graphic Design", startYear: "2014", endYear: "2018" }],
  certifications: [
    { name: "Google UX Design Certificate", issuer: "Google", date: "Mar 2021", relevance: "End-to-end UX design process" },
    { name: "Certified Scrum Master", issuer: "Scrum Alliance", date: "Nov 2020", relevance: "Agile project management" },
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Spanish", proficiency: "Fluent" },
    { language: "French", proficiency: "Conversational" },
  ],
  interests: ["Photography", "Long-distance running", "Open-source design", "Coffee brewing", "Generative art", "Hiking", "Typography"],

  tagline: "The designer who turns complex products into things people actually understand.",
  careerStory: "Alex began as the first design hire at Clearbit, learning to design with no safety net — just a blank canvas and a business that needed to grow. That scrappiness led to Notion, then Stripe, where working at global scale forced a level of systems thinking that small teams never demand. Now, Alex bridges product intuition and engineering fluency in ways most designers can't, and most engineers won't.",
  workStyle: "Alex designs in the open — early, messy, and collaborative. Comfortable moving between high-level strategy and pixel-level polish in the same afternoon. Has a bias toward shipping and learning over perfecting in the dark, and brings a researcher's instinct to every product question: the answer is almost always in the data, if you know how to ask.",
  lookingFor: "Ready to take on a head of design or founding designer role. Wants to own the full product experience — from brand to component library to the empty state on screen three. Particularly drawn to B2B tools where good design is still a genuine differentiator.",
}

const ACCENT = "#4338CA"
const DARK   = "#0F172A"
const MUTED  = "#94A3B8"

// ── Cursor glow ────────────────────────────────────────────────────────────────
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX - 250}px`
        ref.current.style.top  = `${e.clientY - 250}px`
      }
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])
  return (
    <div ref={ref} style={{
      position: "fixed", width: 500, height: 500, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(67,56,202,0.07) 0%, transparent 65%)",
      pointerEvents: "none", zIndex: 0, transition: "left 0.12s ease, top 0.12s ease",
      left: -250, top: -250,
    }} />
  )
}

// ── Scroll reveal ──────────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

// ── Count-up ───────────────────────────────────────────────────────────────────
function CountUp({ target, trigger, suffix = "" }: { target: number; trigger: boolean; suffix?: string }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const duration = 1200
    const step = 16
    const inc = target / (duration / step)
    const id = setInterval(() => {
      start += inc
      if (start >= target) { setVal(target); clearInterval(id) }
      else setVal(Math.floor(start))
    }, step)
    return () => clearInterval(id)
  }, [trigger, target])
  return <>{val}{suffix}</>
}

// ── SVG border draw on project hover ──────────────────────────────────────────
function ProjectCard({ proj, index, visible }: { proj: typeof DATA.projects[0]; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false)
  const perimeter = 2 * (320 + 200)  // approx card perimeter

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(60px)",
        transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
        borderRadius: 16,
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.07)",
        padding: "28px 26px",
        boxShadow: hovered ? "0 20px 60px rgba(67,56,202,0.12)" : "0 2px 12px rgba(0,0,0,0.05)",
        transition2: "box-shadow 0.3s ease",
        cursor: "default",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      } as any}
    >
      {/* SVG border draw */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 16, pointerEvents: "none" }}>
        <rect
          x="1" y="1" rx="15"
          width="calc(100% - 2px)" height="calc(100% - 2px)"
          fill="none" stroke={ACCENT} strokeWidth="1.5"
          strokeDasharray={perimeter}
          strokeDashoffset={hovered ? 0 : perimeter}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>

      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        Project {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: DARK, letterSpacing: "-0.03em", marginBottom: 10 }}>{proj.projectName}</div>
      <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.72, flex: 1, marginBottom: 16 }}>{proj.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
        {proj.techStack.map((t, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 5, background: "rgba(67,56,202,0.07)", color: ACCENT }}>
            {t}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {proj.liveUrl && <a href={proj.liveUrl} style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textDecoration: "none", padding: "6px 12px", border: `1.5px solid ${ACCENT}`, borderRadius: 7 }}>Live ↗</a>}
        {proj.githubUrl && <a href={proj.githubUrl} style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textDecoration: "none", padding: "6px 12px", border: "1px solid #E2E8F0", borderRadius: 7 }}>Code</a>}
      </div>
    </div>
  )
}

// ── Circular progress arc ──────────────────────────────────────────────────────
const PROF_PCT: Record<string, number> = { Native: 100, Fluent: 88, Professional: 72, Conversational: 52, Basic: 32 }
function CircleArc({ language, proficiency, delay, trigger }: { language: string; proficiency: string; delay: number; trigger: boolean }) {
  const r = 36, cx = 44, cy = 44
  const circ = 2 * Math.PI * r
  const pct = PROF_PCT[proficiency] || 50
  const offset = circ - (circ * pct) / 100
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: 88, height: 88 }}>
        <svg width="88" height="88" style={{ transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E2E8F0" strokeWidth="5" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={ACCENT} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={trigger ? offset : circ}
            style={{ transition: `stroke-dashoffset 1.3s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: DARK }}>{pct}%</div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{language}</div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{proficiency}</div>
      </div>
    </div>
  )
}

// ── Experience card ────────────────────────────────────────────────────────────
function ExpCard({ exp, index, visible }: { exp: typeof DATA.experience[0]; index: number; visible: boolean }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateX(80px)",
      transition: `opacity 0.65s ease ${index * 150}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 150}ms`,
      padding: "24px 28px",
      background: "#fff",
      border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      marginBottom: index < DATA.experience.length - 1 ? 14 : 0,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: `linear-gradient(to bottom, ${ACCENT}, rgba(67,56,202,0.2))`,
        opacity: 0.6,
        transition: `opacity 0.3s`,
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: DARK, letterSpacing: "-0.025em" }}>{exp.roleTitle}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT, marginTop: 3 }}>
            {exp.companyName}{exp.location ? ` · ${exp.location}` : ""}
          </div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, background: "#F8FAFC", padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap", alignSelf: "flex-start", border: "1px solid #E2E8F0" }}>
          {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
        </div>
      </div>
      <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.72, margin: 0 }}>{exp.description}</p>
    </div>
  )
}

// ── Elastic skill tag ──────────────────────────────────────────────────────────
const CAT_STYLE: Record<string, { bg: string; color: string }> = {
  Design:      { bg: "rgba(67,56,202,0.08)",  color: ACCENT },
  Frontend:    { bg: "rgba(16,185,129,0.08)", color: "#065F46" },
  "Soft Skills":{ bg: "rgba(245,158,11,0.08)", color: "#92400E" },
  Tools:       { bg: "rgba(239,68,68,0.08)",  color: "#991B1B" },
}

function SkillTag({ name, category, index, visible }: { name: string; category: string; index: number; visible: boolean }) {
  const s = CAT_STYLE[category] || { bg: "#F1F5F9", color: "#475569" }
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "scale(0.6) translateY(12px)",
      transition: `opacity 0.4s ease ${index * 35}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${index * 35}ms`,
      padding: "8px 16px", borderRadius: 100,
      background: s.bg, color: s.color,
      fontSize: 13, fontWeight: 600,
      border: `1px solid ${s.bg}`,
    }}>
      {name}
    </div>
  )
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function SnapSection({ id, children, bg = "#fff", minHeight = "100vh" }: { id: string; children: React.ReactNode; bg?: string; minHeight?: string }) {
  return (
    <section id={id} style={{
      minHeight, scrollSnapAlign: "start",
      background: bg, position: "relative",
      display: "flex", alignItems: "center",
      padding: "80px clamp(24px, 7vw, 100px)",
      overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </section>
  )
}

// ── Ghost number ───────────────────────────────────────────────────────────────
function Ghost({ n }: { n: string }) {
  return (
    <div style={{
      position: "absolute",
      fontSize: "clamp(120px, 20vw, 220px)",
      fontWeight: 900, color: "rgba(0,0,0,0.03)",
      lineHeight: 1, letterSpacing: "-0.06em",
      userSelect: "none", pointerEvents: "none",
      top: -40, right: -20, zIndex: 0,
    }}>{n}</div>
  )
}

// ── Section label + heading ────────────────────────────────────────────────────
function Heading({ label, title, light = false }: { label: string; title: string; light?: boolean }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ marginBottom: 48 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
        textTransform: "uppercase", color: light ? "rgba(255,255,255,0.5)" : ACCENT,
        marginBottom: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(10px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>{label}</div>
      <h2 style={{
        fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900,
        letterSpacing: "-0.04em", lineHeight: 1.05,
        color: light ? "#fff" : DARK,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(16px)",
        transition: "opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s",
      }}>{title}</h2>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function TemplatePreviewPage() {
  // Hero clip-path
  const [heroVisible, setHeroVisible] = useState(false)
  useEffect(() => { setTimeout(() => setHeroVisible(true), 100) }, [])

  // Section visibility triggers
  const aboutRef  = useRef<HTMLDivElement>(null)
  const expRef    = useRef<HTMLDivElement>(null)
  const projRef   = useRef<HTMLDivElement>(null)
  const skillRef  = useRef<HTMLDivElement>(null)
  const langRef   = useRef<HTMLDivElement>(null)

  const [aboutVis,  setAboutVis]  = useState(false)
  const [expVis,    setExpVis]    = useState(false)
  const [projVis,   setProjVis]   = useState(false)
  const [skillVis,  setSkillVis]  = useState(false)
  const [langVis,   setLangVis]   = useState(false)

  useEffect(() => {
    const pairs: [React.RefObject<HTMLDivElement>, (v: boolean) => void][] = [
      [aboutRef, setAboutVis], [expRef, setExpVis],
      [projRef, setProjVis], [skillRef, setSkillVis], [langRef, setLangVis],
    ]
    const observers = pairs.map(([ref, setter]) => {
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setter(true); obs.disconnect() }
      }, { threshold: 0.1 })
      if (ref.current) obs.observe(ref.current)
      return obs
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = containerRef.current; if (!el) return
    const onScroll = () => {
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setScrollProgress(pct * 100)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }

        @keyframes t2-clip-wipe {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0);   }
        }
        @keyframes t2-compress {
          from { letter-spacing: 0.8em; opacity: 0; }
          to   { letter-spacing: -0.02em; opacity: 1; }
        }
        @keyframes t2-fadein {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes t2-circle-draw {
          from { stroke-dashoffset: 226; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes t2-line-draw {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes t2-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes t2-float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50%       { transform: translateY(-18px) rotate(12deg); }
        }
        @keyframes t2-pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.6); opacity: 0.5; }
        }

        .t2-container {
          height: 100vh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .t2-container::-webkit-scrollbar { width: 0; }

        .t2-project-card:hover { transform: translateY(-4px); }

        .t2-edu-row {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 16px; padding: 22px 0;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          opacity: 0; transform: translateX(-20px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .t2-edu-row.visible { opacity: 1; transform: none; }

        .t2-interest {
          padding: 9px 18px; border-radius: 100px;
          border: 1.5px solid rgba(67,56,202,0.15);
          font-size: 13px; font-weight: 600; color: #475569;
          background: #F8FAFF;
          cursor: default; transition: all 0.2s;
        }
        .t2-interest:hover {
          background: rgba(67,56,202,0.08);
          border-color: ${ACCENT}; color: ${ACCENT};
          transform: translateY(-2px);
        }

        .t2-social-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 700; color: #64748B;
          text-decoration: none; padding: 9px 16px; border-radius: 9px;
          border: 1px solid rgba(0,0,0,0.1); background: rgba(255,255,255,0.8);
          backdrop-filter: blur(8px); transition: all 0.2s;
        }
        .t2-social-btn:hover {
          color: ${ACCENT}; border-color: ${ACCENT};
          box-shadow: 0 4px 16px rgba(67,56,202,0.12);
          transform: translateY(-2px);
        }

        .t2-footer-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 700; padding: 14px 28px;
          border-radius: 12px; text-decoration: none; transition: all 0.2s;
        }

        @media (max-width: 768px) {
          html, body { overflow: auto; }
          .t2-container { height: auto; overflow: visible; scroll-snap-type: none; }
          .t2-hero-inner { flex-direction: column !important; }
          .t2-hero-graphic { display: none !important; }
          .t2-progress-bar { display: none !important; }
        }
      `}</style>

      <CursorGlow />

      {/* Scroll progress bar */}
      <div className="t2-progress-bar" style={{
        position: "fixed", top: 0, left: 0, height: 2,
        width: `${scrollProgress}%`, zIndex: 9999,
        background: `linear-gradient(90deg, ${ACCENT}, #818CF8)`,
        transition: "width 0.1s ease",
      }} />

      <div className="t2-container" ref={containerRef}>

        {/* ── HERO ── */}
        <section style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          background: "#FAFBFF", position: "relative",
          display: "flex", alignItems: "center",
          padding: "0 clamp(24px, 7vw, 100px)",
          overflow: "hidden",
        }}>
          {/* Large decorative circle */}
          <div style={{
            position: "absolute", right: "5%", top: "50%",
            transform: "translateY(-50%)",
            width: "clamp(300px, 38vw, 520px)", height: "clamp(300px, 38vw, 520px)",
            borderRadius: "50%",
            border: `1.5px solid rgba(67,56,202,0.12)`,
            animation: "t2-spin-slow 30s linear infinite",
          }}>
            {/* Dots on circle perimeter */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div key={i} style={{
                position: "absolute",
                width: 6, height: 6, borderRadius: "50%",
                background: i === 0 ? ACCENT : "rgba(67,56,202,0.25)",
                top: `calc(50% - 3px + ${Math.sin(deg * Math.PI / 180) * 50}%)`,
                left: `calc(50% - 3px + ${Math.cos(deg * Math.PI / 180) * 50}%)`,
              }} />
            ))}
          </div>

          {/* Inner filled circle */}
          <div style={{
            position: "absolute", right: "10%", top: "50%",
            transform: "translateY(-50%)",
            width: "clamp(180px, 22vw, 300px)", height: "clamp(180px, 22vw, 300px)",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(67,56,202,0.1) 0%, rgba(67,56,202,0.03) 100%)`,
          }} />

          {/* Floating accent square */}
          <div style={{
            position: "absolute", right: "28%", top: "20%",
            width: 48, height: 48, borderRadius: 12,
            background: ACCENT, opacity: 0.15,
            animation: "t2-float 5s ease-in-out infinite",
            transform: "rotate(12deg)",
          }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>

            {/* Available badge */}
            <div style={{ animation: "t2-fadein 0.5s ease 0.1s both" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(67,56,202,0.07)", border: `1px solid rgba(67,56,202,0.15)`, borderRadius: 100, padding: "5px 14px", marginBottom: 36 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "t2-pulse-dot 2s infinite" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase" }}>Open to opportunities</span>
              </div>
            </div>

            {/* Name — clip-path wipe */}
            <div style={{ overflow: "hidden", marginBottom: 6 }}>
              <h1 style={{
                fontSize: "clamp(3.5rem, 9vw, 8rem)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                color: DARK,
                clipPath: heroVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s",
              }}>
                {DATA.personal.fullName.split(" ")[0]}
              </h1>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 24 }}>
              <h1 style={{
                fontSize: "clamp(3.5rem, 9vw, 8rem)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                color: "transparent",
                WebkitTextStroke: `2px ${DARK}`,
                clipPath: heroVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s",
              }}>
                {DATA.personal.fullName.split(" ")[1] || ""}
              </h1>
            </div>

            {/* Title — letter-spacing compression */}
            <div style={{
              fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)",
              fontWeight: 700,
              color: "#64748B",
              animation: heroVisible ? "t2-compress 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s both" : "none",
              marginBottom: 28,
            }}>
              {DATA.personal.professionalTitle}
            </div>

            {/* Contact row */}
            <div style={{ animation: "t2-fadein 0.6s ease 1s both", marginBottom: 28, display: "flex", flexWrap: "wrap", gap: 16 }}>
              {[
                DATA.personal.email    && { text: DATA.personal.email },
                DATA.personal.phone    && { text: DATA.personal.phone },
                DATA.personal.location && { text: DATA.personal.location },
              ].filter(Boolean).map((item: any, i) => (
                <span key={i} style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>{item.text}</span>
              ))}
            </div>

            {/* Social buttons */}
            <div style={{ animation: "t2-fadein 0.6s ease 1.1s both", display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "LinkedIn", icon: "in" }, { label: "GitHub", icon: "{}" }, { label: "Website", icon: "↗" },
              ].map((s, i) => (
                <a key={i} href="#" className="t2-social-btn">
                  <span style={{ fontSize: 11, fontWeight: 800, color: ACCENT }}>{s.icon}</span> {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            animation: "t2-fadein 0.6s ease 1.4s both",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</div>
            <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom, ${MUTED}, transparent)` }} />
          </div>
        </section>

        {/* ── ABOUT ── */}
        <SnapSection id="about" bg="#fff">
          <Ghost n="01" />
          <div ref={aboutRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <Heading label="About" title={`Designing\nwith intent.`} />
              <p style={{
                fontSize: 16, lineHeight: 1.85, color: "#475569", marginBottom: 36,
                opacity: aboutVis ? 1 : 0,
                transition: "opacity 0.7s ease 0.3s",
              }}>
                {DATA.personal.bio}
              </p>
              <div style={{ display: "flex", gap: 40 }}>
                {[
                  { val: DATA.experience.length, label: "Companies" },
                  { val: DATA.projects.length,   label: "Projects" },
                  { val: DATA.skills.length,      label: "Skills" },
                ].map((s, i) => (
                  <div key={i} style={{
                    opacity: aboutVis ? 1 : 0,
                    transform: aboutVis ? "none" : "translateY(16px)",
                    transition: `opacity 0.6s ease ${0.4 + i * 0.1}s, transform 0.6s ease ${0.4 + i * 0.1}s`,
                  }}>
                    <div style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.05em", color: DARK, lineHeight: 1 }}>
                      <CountUp target={s.val} trigger={aboutVis} />
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, fontWeight: 500, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: decorative grid of dots */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 14,
              opacity: aboutVis ? 1 : 0,
              transition: "opacity 0.8s ease 0.5s",
            }}>
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: i % 7 === 0 ? ACCENT : i % 3 === 0 ? "rgba(67,56,202,0.2)" : "#E2E8F0",
                  transform: aboutVis ? "scale(1)" : "scale(0)",
                  transition: `transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 8}ms`,
                }} />
              ))}
            </div>
          </div>
        </SnapSection>

        {/* ── EXPERIENCE ── */}
        <SnapSection id="experience" bg="#F8FAFF" minHeight="100vh">
          <Ghost n="02" />
          <div ref={expRef} style={{ width: "100%" }}>
            <Heading label="Career" title="Work Experience" />
            <div style={{ maxWidth: 720 }}>
              {DATA.experience.map((exp, i) => <ExpCard key={i} exp={exp} index={i} visible={expVis} />)}
            </div>
          </div>
        </SnapSection>

        {/* ── PROJECTS ── */}
        <SnapSection id="projects" bg="#fff" minHeight="100vh">
          <Ghost n="03" />
          <div ref={projRef} style={{ width: "100%" }}>
            <Heading label="Work" title="Projects" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
              {DATA.projects.map((proj, i) => <ProjectCard key={i} proj={proj} index={i} visible={projVis} />)}
            </div>
          </div>
        </SnapSection>

        {/* ── SKILLS ── */}
        <SnapSection id="skills" bg="#F8FAFF">
          <Ghost n="04" />
          <div ref={skillRef} style={{ width: "100%" }}>
            <Heading label="Expertise" title="Skills & Tools" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {DATA.skills.map((s, i) => <SkillTag key={i} name={s.name} category={s.category} index={i} visible={skillVis} />)}
            </div>
          </div>
        </SnapSection>

        {/* ── EDUCATION ── */}
        <SnapSection id="education" bg="#fff">
          <Ghost n="05" />
          <div style={{ width: "100%" }}>
            <Heading label="Academic" title="Education" />
            {DATA.education.map((edu, i) => <EduRow key={i} edu={edu} index={i} />)}
          </div>
        </SnapSection>

        {/* ── CERTIFICATIONS ── */}
        <SnapSection id="certifications" bg="#F8FAFF">
          <Ghost n="06" />
          <div style={{ width: "100%" }}>
            <Heading label="Credentials" title="Certifications" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {DATA.certifications.map((cert, i) => <CertCard key={i} cert={cert} index={i} />)}
            </div>
          </div>
        </SnapSection>

        {/* ── LANGUAGES ── */}
        <SnapSection id="languages" bg="#fff">
          <Ghost n="07" />
          <div ref={langRef} style={{ width: "100%" }}>
            <Heading label="Communication" title="Languages" />
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {DATA.languages.map((l, i) => (
                <div key={i} style={{
                  opacity: langVis ? 1 : 0,
                  transform: langVis ? "none" : "scale(0.8)",
                  transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 150}ms`,
                }}>
                  <CircleArc language={l.language} proficiency={l.proficiency} delay={i * 200 + 300} trigger={langVis} />
                </div>
              ))}
            </div>
          </div>
        </SnapSection>

        {/* ── INTERESTS ── */}
        <SnapSection id="interests" bg="#F8FAFF">
          <Ghost n="08" />
          <div style={{ width: "100%" }}>
            <Heading label="Personal" title="Interests & Hobbies" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {DATA.interests.map((item, i) => <InterestChip key={i} item={item} index={i} />)}
            </div>
          </div>
        </SnapSection>

        {/* ── FOOTER ── */}
        <section style={{
          minHeight: "100vh", scrollSnapAlign: "start",
          background: DARK, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "80px clamp(24px, 7vw, 100px)",
          overflow: "hidden",
        }}>
          {/* Background grid lines */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
          {/* Large decorative text */}
          <div style={{ position: "absolute", fontSize: "clamp(100px, 20vw, 240px)", fontWeight: 900, color: "rgba(255,255,255,0.03)", letterSpacing: "-0.06em", userSelect: "none", bottom: -20, left: -10, lineHeight: 1 }}>
            CONTACT
          </div>

          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <FooterContent />
          </div>
        </section>

      </div>
    </>
  )
}

// ── Footer content (separate to use hook) ─────────────────────────────────────
function FooterContent() {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 16, opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}>
        Get in touch
      </div>
      <h2 style={{
        fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900,
        letterSpacing: "-0.045em", color: "#fff", lineHeight: 1.05,
        marginBottom: 16,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: "opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s",
      }}>
        Let's build something<br />
        <span style={{ color: ACCENT, fontStyle: "italic" }}>extraordinary.</span>
      </h2>
      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", marginBottom: 44, lineHeight: 1.7, opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.25s" }}>
        Open to full-time roles, freelance, and interesting conversations.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(14px)", transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s" }}>
        <a href={`mailto:${DATA.personal.email}`} className="t2-footer-link" style={{ background: ACCENT, color: "#fff", boxShadow: "0 4px 24px rgba(67,56,202,0.4)" }}>
          ✉ {DATA.personal.email}
        </a>
        <a href="#" className="t2-footer-link" style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}>
          LinkedIn ↗
        </a>
      </div>
      <div style={{ marginTop: 56, fontSize: 11, color: "rgba(255,255,255,0.15)" }}>
        Built with PortfolioAI · {DATA.personal.fullName}
      </div>
    </div>
  )
}

// ── Sub-components to avoid hooks-in-map violations ───────────────────────────
function EduRow({ edu, index }: { edu: typeof DATA.education[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`t2-edu-row ${visible ? "visible" : ""}`}
      style={{ transition: `opacity 0.6s ease ${index * 100}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms` }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: DARK, letterSpacing: "-0.025em" }}>{edu.degree}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT, marginTop: 4 }}>{edu.institution}</div>
        {edu.fieldOfStudy && <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{edu.fieldOfStudy}</div>}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, background: "#F8FAFC", padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap", border: "1px solid #E2E8F0" }}>
        {edu.startYear} – {edu.endYear}
      </div>
    </div>
  )
}

function CertCard({ cert, index }: { cert: typeof DATA.certifications[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(20px)",
      transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
      padding: "22px", background: "#fff",
      border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ fontSize: 24, marginBottom: 12 }}>🏅</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: DARK, marginBottom: 5 }}>{cert.name}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, marginBottom: 3 }}>{cert.issuer}</div>
      <div style={{ fontSize: 11, color: MUTED }}>{cert.date}</div>
      {cert.relevance && <div style={{ fontSize: 12, color: "#64748B", marginTop: 10, paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>{cert.relevance}</div>}
    </div>
  )
}

function InterestChip({ item, index }: { item: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className="t2-interest" style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "scale(0.85)",
      transition: `opacity 0.4s ease ${index * 50}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${index * 50}ms`,
    }}>
      {item}
    </div>
  )
}
