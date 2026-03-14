"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { PortfolioData } from "@/types/portfolio"

// ── Text scramble hook ─────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%"
function useScramble(target: string) {
  const [display, setDisplay] = useState("")
  useEffect(() => {
    let frame = 0
    const totalFrames = 28
    const id = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      setDisplay(
        target.split("").map((char, i) => {
          if (char === " ") return " "
          if (i / target.length < progress) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join("")
      )
      if (frame >= totalFrames) clearInterval(id)
    }, 45)
    return () => clearInterval(id)
  }, [target])
  return display
}

// ── Scroll reveal hook ─────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
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

// ── 3D tilt hook ───────────────────────────────────────────────────────────────
function useTilt() {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    el.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`
  }, [])
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return
    el.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)"
  }, [])
  return { ref, onMove, onLeave }
}

// ── Magnetic button ────────────────────────────────────────────────────────────
function MagBtn({ children, href, style }: { children: React.ReactNode; href?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.35
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.35
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)" }
  return (
    <a ref={ref} href={href || "#"} target="_blank" rel="noopener noreferrer"
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ display: "inline-flex", alignItems: "center", transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)", ...style }}>
      {children}
    </a>
  )
}

// ── Reveal wrapper ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 32 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : `translateY(${y}px)`,
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

// ── Ghost section number ───────────────────────────────────────────────────────
function GhostNum({ n }: { n: string }) {
  return (
    <div style={{
      position: "absolute", top: -20, left: -16,
      fontSize: "clamp(80px, 14vw, 140px)", fontWeight: 900,
      color: "rgba(0,0,0,0.04)", lineHeight: 1,
      letterSpacing: "-0.06em", userSelect: "none",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      pointerEvents: "none", zIndex: 0,
    }}>{n}</div>
  )
}

// ── SVG Draw Timeline ──────────────────────────────────────────────────────────
function DrawTimeline({ items }: { items: PortfolioData["experience"] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const el = wrapRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setDrawn(true); obs.disconnect() }
    }, { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={wrapRef} style={{ position: "relative", paddingLeft: 40 }}>
      <svg style={{ position: "absolute", left: 12, top: 8, width: 2, height: "calc(100% - 16px)" }} preserveAspectRatio="none">
        <line x1="1" y1="0" x2="1" y2="100%" stroke="#E7E5E4" strokeWidth="2" />
        <line x1="1" y1="0" x2="1" y2="100%"
          stroke="var(--accent)" strokeWidth="2"
          strokeDasharray="1000" strokeDashoffset={drawn ? 0 : 1000}
          style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1) 0.2s" }} />
      </svg>
      {items.map((exp, i) => (
        <Reveal key={i} delay={i * 120}>
          <div style={{ position: "relative", paddingBottom: i < items.length - 1 ? 44 : 0 }}>
            <div style={{
              position: "absolute", left: -34, top: 6,
              width: 14, height: 14, borderRadius: "50%",
              background: "#fff", border: `2px solid ${drawn ? "var(--accent)" : "#E7E5E4"}`,
              boxShadow: drawn ? "0 0 0 4px rgba(234,88,12,0.12)" : "none",
              transition: `border-color 0.4s ease ${i * 200 + 400}ms, box-shadow 0.4s ease ${i * 200 + 400}ms`,
              zIndex: 1,
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.025em" }}>{exp.roleTitle}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", marginTop: 2 }}>
                  {exp.companyName}{exp.location ? ` · ${exp.location}` : ""}
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#A8A29E", background: "#F5F5F4", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", alignSelf: "flex-start" }}>
                {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
              </div>
            </div>
            {exp.description && <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.72, margin: 0 }}>{exp.description}</p>}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

// ── Tilt Project Card ──────────────────────────────────────────────────────────
function TiltCard({ proj, index }: { proj: PortfolioData["projects"][0]; index: number }) {
  const { ref, onMove, onLeave } = useTilt()
  const { ref: revRef, visible } = useReveal()
  return (
    <div ref={revRef} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(28px)",
      transition: `opacity 0.65s ease ${index * 100}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
    }}>
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{
          background: "#fff", border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 20, padding: "26px 24px", cursor: "default",
          transition: "transform 0.15s ease, box-shadow 0.3s ease",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          transformStyle: "preserve-3d", willChange: "transform",
          display: "flex", flexDirection: "column", height: "100%",
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 24px 60px rgba(0,0,0,0.14)")}
      >
        <div style={{ height: 3, background: "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 50%, #a855f7))", borderRadius: 2, marginBottom: 18 }} />
        <div style={{ fontSize: 18, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.03em", marginBottom: 10 }}>{proj.projectName}</div>
        <p style={{ fontSize: 13, color: "#78716C", lineHeight: 1.7, flex: 1, marginBottom: 16 }}>{proj.description}</p>
        {proj.techStack.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
            {proj.techStack.map((t, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 5, background: "#F5F5F4", color: "#57534E", border: "1px solid #E7E5E4" }}>{t}</span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textDecoration: "none", padding: "6px 12px", border: "1.5px solid var(--accent)", borderRadius: 7 }}>Live ↗</a>}
          {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "#57534E", textDecoration: "none", padding: "6px 12px", border: "1px solid #E7E5E4", borderRadius: 7 }}>Code</a>}
        </div>
      </div>
    </div>
  )
}

// ── Skill cloud ────────────────────────────────────────────────────────────────
const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  "Languages":    { bg: "#EFF6FF", text: "#1D4ED8" },
  "Frontend":     { bg: "#EFF6FF", text: "#1D4ED8" },
  "Backend":      { bg: "#FFF7ED", text: "#9A3412" },
  "Design":       { bg: "#FDF4FF", text: "#7E22CE" },
  "Tools":        { bg: "#FFF7ED", text: "#9A3412" },
  "Cloud":        { bg: "#ECFDF5", text: "#065F46" },
  "Databases":    { bg: "#FFF1F2", text: "#9F1239" },
  "Soft Skills":  { bg: "#F0FDF4", text: "#166534" },
  "Other":        { bg: "#F5F5F4", text: "#57534E" },
}

function SkillCloud({ skills }: { skills: PortfolioData["skills"] }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {skills.map((s, i) => {
        const c = CAT_COLORS[s.category] || CAT_COLORS["Other"]
        return (
          <div key={i} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(16px) scale(0.92)",
            transition: `opacity 0.5s ease ${i * 40}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 40}ms`,
            fontSize: 13, fontWeight: 600,
            padding: "7px 14px", borderRadius: 100,
            background: c.bg, color: c.text,
            border: `1px solid ${c.bg}`,
          }}>
            {s.name}
          </div>
        )
      })}
    </div>
  )
}

// ── Language bar ───────────────────────────────────────────────────────────────
const PROF_W: Record<string, string> = {
  Native: "100%", Fluent: "88%", Professional: "72%", Conversational: "52%", Basic: "32%",
}

function LangBar({ lang, proficiency, delay }: { lang: string; proficiency: string; delay: number }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 14, fontWeight: 700, color: "#1C1917" }}>
        <span>{lang}</span>
        <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{proficiency}</span>
      </div>
      <div style={{ height: 5, background: "#F0EFED", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          background: "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #f97316))",
          width: visible ? (PROF_W[proficiency] || "50%") : "0%",
          transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }} />
      </div>
    </div>
  )
}

// ── Section heading ────────────────────────────────────────────────────────────
function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <Reveal>
      <div style={{ position: "relative", zIndex: 1, marginBottom: 36 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>{label}</div>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#1C1917", lineHeight: 1.1 }}>{title}</h2>
      </div>
    </Reveal>
  )
}

// ── Nav sections list ──────────────────────────────────────────────────────────
const ALL_NAV = ["about", "career-story", "experience", "projects", "skills", "workstyle", "education", "certifications", "languages", "interests", "looking-for"]

// ── Main Template Component ────────────────────────────────────────────────────
export default function Template1({ portfolioData }: { portfolioData: PortfolioData }) {
  const { personal } = portfolioData
  const experience     = portfolioData.experience     || []
  const projects       = portfolioData.projects       || []
  const skills         = portfolioData.skills         || []
  const education      = portfolioData.education      || []
  const certifications = portfolioData.certifications || []
  const languages      = portfolioData.languages      || []
  const interests      = portfolioData.interests      || []
  const tagline        = portfolioData.tagline        || ""
  const careerStory    = portfolioData.careerStory    || ""
  const workStyle      = portfolioData.workStyle      || ""
  const lookingFor     = portfolioData.lookingFor     || ""

  // Section visibility
  const hasSummary     = !!personal?.bio?.trim()
  const hasExperience  = experience.length > 0
  const hasProjects    = projects.length > 0
  const hasSkills      = skills.length > 0
  const hasEducation   = education.length > 0
  const hasCerts       = certifications.length > 0
  const hasLanguages   = languages.length > 0
  const hasInterests   = interests.length > 0
  const hasCareerStory = !!careerStory.trim()
  const hasWorkStyle   = !!workStyle.trim()
  const hasLookingFor  = !!lookingFor.trim()
  const hasTagline     = !!tagline.trim()

  const workStyleCards: { title: string; body: string }[] = (() => {
    if (!workStyle) return []
    const sentences = workStyle.split(/(?<=[.!?])\s+/).filter(Boolean)
    const cards: { title: string; body: string }[] = []
    for (let i = 0; i < sentences.length && cards.length < 4; i++) {
      const title = sentences[i].replace(/[.!?]$/, "")
      const body = sentences[i + 1] ?? ""
      cards.push({ title, body })
      if (body) i++
    }
    return cards
  })()

  const visibleSections = ALL_NAV.filter(id => {
    if (id === "about")          return hasSummary
    if (id === "career-story")   return hasCareerStory
    if (id === "experience")     return hasExperience
    if (id === "projects")       return hasProjects
    if (id === "skills")         return hasSkills
    if (id === "workstyle")      return hasWorkStyle
    if (id === "education")      return hasEducation
    if (id === "certifications") return hasCerts
    if (id === "languages")      return hasLanguages
    if (id === "interests")      return hasInterests
    if (id === "looking-for")    return hasLookingFor
    return false
  })

  const scrambled = useScramble(personal?.fullName || "")
  const [activeSection, setActiveSection] = useState(visibleSections[0] || "about")
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const right = rightRef.current; if (!right) return
    const onScroll = () => {
      const sectionEls = visibleSections.map(id => document.getElementById(`t1-${id}`)).filter(Boolean)
      let current = visibleSections[0] || "about"
      for (const el of sectionEls) {
        if (el && el.getBoundingClientRect().top <= 200) current = el.id.replace("t1-", "")
      }
      setActiveSection(current)
    }
    right.addEventListener("scroll", onScroll, { passive: true })
    return () => right.removeEventListener("scroll", onScroll)
  }, [visibleSections])

  const scrollTo = (id: string) => {
    const el = document.getElementById(`t1-${id}`)
    if (el && rightRef.current) rightRef.current.scrollTo({ top: el.offsetTop - 48, behavior: "smooth" })
  }

  // Build skill marquee from skills or fallback to name + title
  const marqueeItems = skills.length > 0
    ? skills.map(s => s.name)
    : [personal?.professionalTitle, ...(personal?.location ? [personal.location] : [])].filter(Boolean)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        :root { --accent: #EA580C; }

        @keyframes t1-blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-15px,25px) scale(0.96)} }
        @keyframes t1-blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-25px,20px) scale(1.04)} 66%{transform:translate(20px,-15px) scale(0.97)} }
        @keyframes t1-blob3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(15px,30px) scale(0.98)} 66%{transform:translate(-30px,-20px) scale(1.03)} }
        @keyframes t1-fadeup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes t1-ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes t1-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.6} }

        .t1-left {
          position: fixed; top: 0; left: 0;
          width: 38%; height: 100vh;
          overflow: hidden; background: #FAFAF8;
        }
        .t1-right {
          margin-left: 38%; height: 100vh;
          overflow-y: auto; background: #fff;
        }
        .t1-right::-webkit-scrollbar { width: 0; }

        .t1-section {
          padding: 72px 52px;
          position: relative;
        }
        .t1-section + .t1-section { border-top: 1px solid rgba(0,0,0,0.06); }

        .t1-nav-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: rgba(0,0,0,0.15); border: none;
          cursor: pointer; transition: all 0.25s; padding: 0; display: block;
        }
        .t1-nav-dot.active {
          background: var(--accent); transform: scale(1.5);
          box-shadow: 0 0 0 3px rgba(234,88,12,0.2);
        }
        .t1-nav-label {
          position: absolute; left: 20px;
          font-size: 11px; font-weight: 600; color: #1C1917;
          opacity: 0; pointer-events: none; transition: opacity 0.2s;
          white-space: nowrap; transform: translateY(-50%); top: 50%;
        }
        .t1-nav-wrap:hover .t1-nav-label { opacity: 1; }
        .t1-nav-wrap:hover .t1-nav-dot { background: var(--accent); }

        .t1-social {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600; color: #57534E;
          text-decoration: none; padding: 8px 14px; border-radius: 9px;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.7); backdrop-filter: blur(8px);
          transition: all 0.25s; white-space: nowrap;
        }
        .t1-social:hover {
          color: var(--accent); border-color: var(--accent);
          background: rgba(255,255,255,0.95);
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        .t1-ticker-track {
          display: flex; gap: 24px;
          animation: t1-ticker 18s linear infinite;
          width: max-content;
        }
        .t1-ticker-item {
          font-size: 11px; font-weight: 700; color: rgba(0,0,0,0.35);
          letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
        }

        .t1-cert-card {
          padding: 18px 20px; background: #fff;
          border: 1px solid rgba(0,0,0,0.08); border-radius: 14px;
          transition: all 0.25s; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .t1-cert-card:hover {
          border-color: var(--accent); transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }

        .t1-chip {
          padding: 8px 16px; border-radius: 100px;
          border: 1.5px solid rgba(0,0,0,0.08);
          font-size: 13px; font-weight: 500; color: #57534E;
          transition: all 0.2s; cursor: default; background: #FAFAF8;
        }
        .t1-chip:hover {
          border-color: var(--accent); color: var(--accent);
          background: #fff; transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.07);
        }

        /* TAGLINE STRIP */
        .t1-tagline-strip {
          background: var(--accent); padding: 48px 52px;
        }
        .t1-tagline-strip-text {
          font-size: clamp(1.4rem, 3vw, 2.8rem); font-weight: 900;
          color: #fff; letter-spacing: -0.04em; line-height: 1.2;
          max-width: 900px;
        }
        .t1-tagline-strip-text em { color: rgba(255,255,255,0.55); font-style: normal; }

        /* CAREER STORY SECTION */
        .t1-career-inner { display: grid; grid-template-columns: 120px 1fr; gap: 40px; align-items: start; }
        .t1-career-num { font-size: 64px; font-weight: 900; color: rgba(0,0,0,0.05); line-height: 1; }
        .t1-career-text {
          font-size: clamp(15px, 1.5vw, 18px); color: #57534E; line-height: 1.85;
          font-style: italic; border-left: 3px solid var(--accent); padding-left: 20px;
        }

        /* WORK STYLE */
        .t1-ws-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
        .t1-ws-card {
          padding: 22px; border-radius: 14px; background: #fff;
          border: 1.5px solid rgba(0,0,0,0.08);
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .t1-ws-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(234,88,12,0.1); }
        .t1-ws-card-num { font-size: 40px; font-weight: 900; color: rgba(234,88,12,0.12); line-height: 1; margin-bottom: 12px; }
        .t1-ws-card-title { font-size: 14px; font-weight: 800; color: #1C1917; margin-bottom: 6px; }
        .t1-ws-card-body { font-size: 13px; color: #78716C; line-height: 1.65; }

        /* LOOKING FOR */
        .t1-looking-section { background: #1C1917; padding: 64px 52px; }
        .t1-looking-label { font-size: 10px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; }
        .t1-looking-text { font-size: clamp(14px, 1.4vw, 16px); color: rgba(255,255,255,0.65); line-height: 1.85; max-width: 1100px; columns: 2; column-gap: 52px; }
        @media (max-width: 700px) { .t1-looking-text { columns: 1; } .t1-career-inner { grid-template-columns: 1fr; gap: 16px; } .t1-career-num { display: none; } }

        .t1-footer {
          background: #1C1917; padding: 64px 52px; text-align: center;
        }

        @media (max-width: 900px) {
          html, body { overflow: auto; }
          .t1-left { position: relative; width: 100%; height: auto; padding-bottom: 40px; }
          .t1-right { margin-left: 0; height: auto; overflow: visible; }
          .t1-section { padding: 52px 24px; }
          .t1-nav-sidebar { display: none !important; }
          .t1-footer { padding: 48px 24px; }
        }
        @media (max-width: 480px) {
          .t1-section { padding: 40px 20px; }
        }
      `}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", WebkitFontSmoothing: "antialiased" }}>

        {/* ── LEFT PANEL ── */}
        <div className="t1-left">

          {/* Animated gradient mesh */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
            <div style={{ position: "absolute", width: "65%", height: "65%", borderRadius: "50%", background: "radial-gradient(circle, rgba(234,88,12,0.13) 0%, transparent 65%)", top: "-15%", right: "-10%", animation: "t1-blob1 18s ease-in-out infinite" }} />
            <div style={{ position: "absolute", width: "55%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 65%)", bottom: "5%", left: "-10%", animation: "t1-blob2 22s ease-in-out infinite" }} />
            <div style={{ position: "absolute", width: "45%", height: "45%", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)", bottom: "30%", right: "10%", animation: "t1-blob3 26s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
          </div>

          {/* Nav dots */}
          <div className="t1-nav-sidebar" style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 12, zIndex: 10 }}>
            {visibleSections.map(id => (
              <div key={id} className="t1-nav-wrap" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <span className="t1-nav-label">{id.charAt(0).toUpperCase() + id.slice(1)}</span>
                <button className={`t1-nav-dot ${activeSection === id ? "active" : ""}`} onClick={() => scrollTo(id)} />
              </div>
            ))}
          </div>

          {/* Left content */}
          <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", padding: "48px 40px 32px" }}>

            {/* Badge */}
            <div style={{ animation: "t1-fadeup 0.6s ease 0.1s both" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.7)", border: "1px solid rgba(234,88,12,0.2)", borderRadius: 100, padding: "5px 14px", backdropFilter: "blur(8px)", marginBottom: 32 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "t1-dot 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#15803D", letterSpacing: "0.1em", textTransform: "uppercase" }}>Available for work</span>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              {/* Scramble name */}
              <div style={{ animation: "t1-fadeup 0.6s ease 0.2s both" }}>
                <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 900, letterSpacing: "-0.045em", lineHeight: 1, color: "#1C1917", marginBottom: 10 }}>
                  {scrambled || personal?.fullName}
                </h1>
                <div style={{ fontSize: "clamp(0.85rem, 1.4vw, 1rem)", fontWeight: 600, color: "var(--accent)", letterSpacing: "-0.01em", marginBottom: 24 }}>
                  {personal?.professionalTitle}
                </div>
              </div>

              {hasSummary && (
                <div style={{ animation: "t1-fadeup 0.6s ease 0.35s both" }}>
                  <p style={{ fontSize: 13, lineHeight: 1.78, color: "#78716C", marginBottom: 24, maxWidth: 320 }}>{personal.bio}</p>
                </div>
              )}

              {/* Contact */}
              <div style={{ animation: "t1-fadeup 0.6s ease 0.45s both", marginBottom: 24 }}>
                {[
                  personal?.email    && { icon: "✉", text: personal.email, href: `mailto:${personal.email}` },
                  personal?.phone    && { icon: "📞", text: personal.phone },
                  personal?.location && { icon: "📍", text: personal.location },
                ].filter(Boolean).map((item: any, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#78716C", marginBottom: 5 }}>
                    <span>{item.icon}</span>
                    {item.href ? <a href={item.href} style={{ color: "inherit", textDecoration: "none" }}>{item.text}</a> : <span>{item.text}</span>}
                  </div>
                ))}
              </div>

              {/* Social links — magnetic */}
              <div style={{ animation: "t1-fadeup 0.6s ease 0.55s both", display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  personal?.linkedinUrl && { label: "LinkedIn", href: personal.linkedinUrl, icon: "in" },
                  personal?.githubUrl   && { label: "GitHub",   href: personal.githubUrl,   icon: "{}" },
                  personal?.websiteUrl  && { label: "Website",  href: personal.websiteUrl,  icon: "↗" },
                ].filter(Boolean).map((s: any, i) => (
                  <MagBtn key={i} href={s.href}>
                    <span className="t1-social">
                      <span style={{ fontSize: 11, fontWeight: 800, width: 18, textAlign: "center", color: "var(--accent)" }}>{s.icon}</span>
                      {s.label}
                    </span>
                  </MagBtn>
                ))}
              </div>
            </div>

            {/* Skill ticker */}
            {marqueeItems.length > 0 && (
              <div style={{ animation: "t1-fadeup 0.6s ease 0.65s both", overflow: "hidden", borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 20 }}>
                <div style={{ display: "flex", overflow: "hidden" }}>
                  <div className="t1-ticker-track">
                    {[...marqueeItems, ...marqueeItems].map((item, i) => (
                      <span key={i} className="t1-ticker-item">{item} <span style={{ color: "var(--accent)" }}>·</span></span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="t1-right" ref={rightRef}>

          {/* About */}
          <div className="t1-section" id="t1-about">
            <div style={{ position: "relative" }}>
              <GhostNum n="01" />
              <Reveal>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>About</div>
                  <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#1C1917", lineHeight: 1.1, marginBottom: 20 }}>
                    {personal?.professionalTitle?.split(" ").slice(0, 2).join(" ")}<br />
                    <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
                      {personal?.professionalTitle?.split(" ").slice(2).join(" ") || "with intent."}
                    </span>
                  </h2>
                  {hasSummary && <p style={{ fontSize: 15, lineHeight: 1.8, color: "#57534E", maxWidth: 480, marginBottom: 32 }}>{personal.bio}</p>}
                  <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                    {[
                      hasExperience && { val: `${experience.length}`, label: experience.length === 1 ? "Role" : "Roles" },
                      hasProjects   && { val: `${projects.length}`,   label: projects.length === 1 ? "Project" : "Projects" },
                      hasSkills     && { val: `${skills.length}`,     label: "Skills" },
                    ].filter(Boolean).map((s: any, i) => (
                      <Reveal key={i} delay={i * 80}>
                        <div>
                          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1C1917", letterSpacing: "-0.05em", lineHeight: 1 }}>{s.val}</div>
                          <div style={{ fontSize: 12, color: "#A8A29E", fontWeight: 500, marginTop: 3 }}>{s.label}</div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Tagline strip */}
          {hasTagline && (
            <div className="t1-tagline-strip" id="t1-tagline">
              <Reveal>
                <div className="t1-tagline-strip-text">{tagline}</div>
              </Reveal>
            </div>
          )}

          {/* Career Story */}
          {hasCareerStory && (
            <div className="t1-section" id="t1-career-story">
              <div style={{ position: "relative" }}>
                <GhostNum n="02" />
                <SectionHeading label="Background" title="Career Story" />
                <Reveal delay={100}>
                  <div className="t1-career-inner" style={{ position: "relative", zIndex: 1 }}>
                    <div className="t1-career-num">02</div>
                    <p className="t1-career-text">{careerStory}</p>
                  </div>
                </Reveal>
              </div>
            </div>
          )}

          {/* Experience */}
          {hasExperience && (
            <div className="t1-section" id="t1-experience" style={{ background: "#FAFAF8" }}>
              <div style={{ position: "relative" }}>
                <GhostNum n="03" />
                <SectionHeading label="Career" title="Work Experience" />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <DrawTimeline items={experience} />
                </div>
              </div>
            </div>
          )}

          {/* Projects */}
          {hasProjects && (
            <div className="t1-section" id="t1-projects">
              <div style={{ position: "relative" }}>
                <GhostNum n="04" />
                <SectionHeading label="Work" title="Projects" />
                <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {projects.map((proj, i) => <TiltCard key={i} proj={proj} index={i} />)}
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          {hasSkills && (
            <div className="t1-section" id="t1-skills" style={{ background: "#FAFAF8" }}>
              <div style={{ position: "relative" }}>
                <GhostNum n="05" />
                <SectionHeading label="Expertise" title="Skills & Tools" />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <SkillCloud skills={skills} />
                </div>
              </div>
            </div>
          )}

          {/* Work Style */}
          {hasWorkStyle && (
            <div className="t1-section" id="t1-workstyle">
              <div style={{ position: "relative" }}>
                <GhostNum n="06" />
                <SectionHeading label="How I Work" title="Work Style" />
                <Reveal delay={100}>
                  <div className="t1-ws-grid" style={{ position: "relative", zIndex: 1 }}>
                    {workStyleCards.map((card, i) => (
                      <div key={i} className="t1-ws-card">
                        <div className="t1-ws-card-num">0{i + 1}</div>
                        <div className="t1-ws-card-title">{card.title}</div>
                        {card.body && <div className="t1-ws-card-body">{card.body}</div>}
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          )}

          {/* Education */}
          {hasEducation && (
            <div className="t1-section" id="t1-education">
              <div style={{ position: "relative" }}>
                <GhostNum n="07" />
                <SectionHeading label="Academic" title="Education" />
                <div style={{ position: "relative", zIndex: 1 }}>
                  {education.map((edu, i) => (
                    <Reveal key={i} delay={i * 80}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, padding: "20px 0", borderBottom: i < education.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.025em" }}>{edu.degree}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", marginTop: 3 }}>{edu.institution}</div>
                          {edu.fieldOfStudy && <div style={{ fontSize: 13, color: "#78716C", marginTop: 2 }}>{edu.fieldOfStudy}</div>}
                        </div>
                        {(edu.startYear || edu.endYear) && (
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#A8A29E", background: "#F5F5F4", padding: "4px 12px", borderRadius: 20 }}>
                            {edu.startYear && edu.endYear ? `${edu.startYear} – ${edu.endYear}` : edu.endYear || edu.startYear}
                          </div>
                        )}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certifications */}
          {hasCerts && (
            <div className="t1-section" id="t1-certifications" style={{ background: "#FAFAF8" }}>
              <div style={{ position: "relative" }}>
                <GhostNum n="08" />
                <SectionHeading label="Credentials" title="Certifications" />
                <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                  {certifications.map((cert, i) => (
                    <Reveal key={i} delay={i * 80}>
                      <div className="t1-cert-card">
                        <div style={{ fontSize: 22, marginBottom: 10 }}>🏅</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#1C1917", marginBottom: 4 }}>{cert.name}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", marginBottom: 3 }}>{cert.issuer}</div>
                        {cert.date && <div style={{ fontSize: 11, color: "#A8A29E" }}>{cert.date}</div>}
                        {cert.relevance && <div style={{ fontSize: 12, color: "#78716C", marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(0,0,0,0.06)" }}>{cert.relevance}</div>}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Languages */}
          {hasLanguages && (
            <div className="t1-section" id="t1-languages">
              <div style={{ position: "relative" }}>
                <GhostNum n="09" />
                <SectionHeading label="Communication" title="Languages" />
                <div style={{ position: "relative", zIndex: 1, maxWidth: 440 }}>
                  {languages.map((l, i) => (
                    <LangBar key={i} lang={l.language} proficiency={l.proficiency} delay={i * 150} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interests */}
          {hasInterests && (
            <div className="t1-section" id="t1-interests" style={{ background: "#FAFAF8" }}>
              <div style={{ position: "relative" }}>
                <GhostNum n="10" />
                <SectionHeading label="Personal" title="Interests" />
                <Reveal delay={100}>
                  <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {interests.map((item, i) => (
                      <div key={i} className="t1-chip">{item}</div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          )}

          {/* Looking For */}
          {hasLookingFor && (
            <div className="t1-looking-section" id="t1-looking-for">
              <Reveal>
                <div className="t1-looking-label">Looking For</div>
                <div className="t1-looking-text">{lookingFor}</div>
              </Reveal>
            </div>
          )}

          {/* Footer */}
          <div className="t1-footer">
            <Reveal>
              <div style={{ maxWidth: 480, margin: "0 auto" }}>
                <div style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 14 }}>
                  Let's make something<br /><span style={{ color: "var(--accent)", fontStyle: "italic" }}>great together.</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 32, lineHeight: 1.7 }}>
                  Open to new opportunities and interesting projects.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  {personal?.email && (
                    <MagBtn href={`mailto:${personal.email}`}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#fff", background: "var(--accent)", padding: "14px 28px", borderRadius: 12, boxShadow: "0 4px 20px rgba(234,88,12,0.4)" }}>
                        ✉ {personal.email}
                      </span>
                    </MagBtn>
                  )}
                  {personal?.linkedinUrl && (
                    <MagBtn href={personal.linkedinUrl}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)", padding: "14px 28px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)" }}>
                        LinkedIn ↗
                      </span>
                    </MagBtn>
                  )}
                </div>
                <div style={{ marginTop: 40, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                  Built with PortfolioAI · {personal?.fullName}
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </>
  )
}
