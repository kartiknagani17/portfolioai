"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { PortfolioData } from "@/types/portfolio"

export default function TemplateCanvas({ portfolioData }: { portfolioData: PortfolioData }) {
  const {
    personal,
    experience,
    projects,
    skills,
    education,
    certifications,
    languages,
    interests,
    tagline,
    careerStory,
    workStyle,
    lookingFor,
    workStylePrinciples,
  } = portfolioData as PortfolioData & { workStylePrinciples?: { heading: string; body: string }[] }

  // ── State ──────────────────────────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeExp, setActiveExp] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 })
  const [typeText, setTypeText] = useState("")
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [visibleEls, setVisibleEls] = useState<Set<string>>(new Set())
  const [langBarsVis, setLangBarsVis] = useState(false)
  const [statsCounted, setStatsCounted] = useState(false)
  const [statYears, setStatYears] = useState(0)
  const [statProjects, setStatProjects] = useState(0)

  const ringRef = useRef({ x: -100, y: -100 })
  const mouseRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number | null>(null)
  const typeRef = useRef({ ri: 0, ci: 0, deleting: false })

  // ── Roles for typewriter ───────────────────────────────────────────────
  const roles = [
    personal.professionalTitle,
    ...(personal.bio ? [] : []),
  ].filter(Boolean)
  const typeRoles = roles.length > 0 ? roles : ["Professional", "Creator", "Builder"]

  // ── Cursor ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", onMove)

    const animRing = () => {
      ringRef.current.x += (mouseRef.current.x - ringRef.current.x) * 0.12
      ringRef.current.y += (mouseRef.current.y - ringRef.current.y) * 0.12
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y })
      rafRef.current = requestAnimationFrame(animRing)
    }
    rafRef.current = requestAnimationFrame(animRing)

    return () => {
      window.removeEventListener("mousemove", onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ── Scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      setProgress(Math.min(pct, 100))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ── Typewriter ────────────────────────────────────────────────────────
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const { ri, ci, deleting } = typeRef.current

    const tick = () => {
      const { ri, ci, deleting } = typeRef.current
      const cur = typeRoles[ri % typeRoles.length]
      if (!deleting) {
        const next = cur.slice(0, ci + 1)
        setTypeText(next)
        typeRef.current.ci++
        if (typeRef.current.ci >= cur.length) {
          typeRef.current.deleting = true
          timeout = setTimeout(tick, 2000)
          return
        }
      } else {
        const next = cur.slice(0, ci - 1)
        setTypeText(next)
        typeRef.current.ci--
        if (typeRef.current.ci <= 0) {
          typeRef.current.deleting = false
          typeRef.current.ri++
        }
      }
      timeout = setTimeout(tick, typeRef.current.deleting ? 35 : 75)
    }
    timeout = setTimeout(tick, 1500)
    return () => clearTimeout(timeout)
  }, [])

  // ── IntersectionObserver for reveal animations ────────────────────────
  useEffect(() => {
    const ids = [
      "tc-tagline", "tc-story", "tc-experience", "tc-projects",
      "tc-skills", "tc-education", "tc-certifications", "tc-extras",
      "tc-workstyle", "tc-lookingfor", "tc-contact",
    ]
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, e.target.id]))
          }
        })
      },
      { threshold: 0.12 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  // ── Generic element observer ──────────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id) {
            setVisibleEls((prev) => new Set([...prev, e.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )
    // Observe after mount
    setTimeout(() => {
      document.querySelectorAll("[data-tc-observe]").forEach((el) => {
        if (el.id) obs.observe(el)
      })
    }, 100)
    return () => obs.disconnect()
  }, [])

  // ── Language bars ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!languages?.length) return
    const el = document.getElementById("tc-lang-section")
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLangBarsVis(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [languages])

  // ── Count-up stat animation ───────────────────────────────────────────
  useEffect(() => {
    const el = document.getElementById("tc-hero-stats")
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsCounted) {
          setStatsCounted(true)
          const yearsTarget = experience?.length ? Math.max(...experience.map(e => {
            const end = e.isCurrent ? new Date().getFullYear() : parseInt(e.endDate || String(new Date().getFullYear()))
            return end - parseInt(e.startDate)
          })).toString().length > 0 ? experience.reduce((acc, e) => {
            const start = parseInt(e.startDate)
            const end = e.isCurrent ? new Date().getFullYear() : parseInt(e.endDate || String(new Date().getFullYear()))
            return Math.max(acc, new Date().getFullYear() - start)
          }, 0) : 8 : 8
          const projTarget = projects?.length || 0

          let y = 0, p = 0
          const interval = setInterval(() => {
            y = Math.min(y + 1, yearsTarget)
            p = Math.min(p + Math.ceil(projTarget / 40), projTarget)
            setStatYears(y)
            setStatProjects(p)
            if (y >= yearsTarget && p >= projTarget) clearInterval(interval)
          }, 40)
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [experience, projects, statsCounted])

  // ── Helpers ───────────────────────────────────────────────────────────
  const isVis = (id: string) => visibleSections.has(id) || visibleEls.has(id)

  const profMap: Record<string, number> = {
    Native: 100, Fluent: 90, Professional: 75, Conversational: 50, Basic: 25,
  }

  const skillsByCategory = skills?.reduce<Record<string, string[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s.name)
    return acc
  }, {}) ?? {}

  const projSizes = ["large", "medium", "wide", "small", "small", "small"]
  const projAccents = ["", "accent-terra", "", "accent-cobalt", "accent-sage", ""]

  const totalYearsExp = experience?.length
    ? new Date().getFullYear() - Math.min(...experience.map((e) => parseInt(e.startDate)))
    : 0

  // ── Styles ────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Outfit:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

    :root {
      --tc-chalk: #FEFEFC;
      --tc-chalk2: #F7F5F0;
      --tc-chalk3: #EFECE5;
      --tc-ink: #1A1A18;
      --tc-ink2: #3D3D3A;
      --tc-dim: #9A9590;
      --tc-terra: #C8553D;
      --tc-terra-light: #F2E8E5;
      --tc-cobalt: #2B4EAA;
      --tc-cobalt-light: #E8EDF7;
      --tc-sage: #4A7C59;
      --tc-sage-light: #E8F0EA;
      --tc-border: rgba(26,26,24,0.08);
      --tc-border-med: rgba(26,26,24,0.14);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .tc-root {
      font-family: 'Outfit', sans-serif;
      background: var(--tc-chalk);
      color: var(--tc-ink);
      overflow-x: hidden;
      cursor: none;
    }

    @media (max-width: 768px) {
      .tc-root { cursor: auto; }
      .tc-cursor-dot, .tc-cursor-ring { display: none !important; }
      a, button { cursor: pointer !important; }
    }

    /* Progress */
    .tc-progress {
      position: fixed;
      top: 0; left: 0;
      height: 2px;
      background: var(--tc-terra);
      z-index: 9998;
      transition: width 0.1s linear;
    }

    /* Cursor */
    .tc-cursor-dot {
      position: fixed;
      width: 8px; height: 8px;
      background: var(--tc-terra);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
      mix-blend-mode: multiply;
    }
    .tc-cursor-ring {
      position: fixed;
      width: 36px; height: 36px;
      border: 1.5px solid var(--tc-terra);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 0.5;
      transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
    }

    /* Nav */
    .tc-nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 48px;
      background: rgba(254,254,252,0.88);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid transparent;
      transition: border-color 0.4s;
    }
    .tc-nav.scrolled { border-color: var(--tc-border); }
    .tc-nav-logo {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 20px;
      color: var(--tc-ink);
      letter-spacing: -0.02em;
    }
    .tc-nav-links {
      display: flex;
      gap: 36px;
      list-style: none;
    }
    .tc-nav-links a {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--tc-dim);
      text-decoration: none;
      transition: color 0.2s;
      cursor: none;
    }
    .tc-nav-links a:hover { color: var(--tc-terra); }
    .tc-nav-cta {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--tc-chalk);
      background: var(--tc-ink);
      border: none;
      padding: 10px 22px;
      border-radius: 100px;
      cursor: none;
      transition: background 0.3s, transform 0.2s;
      text-decoration: none;
      display: inline-block;
    }
    .tc-nav-cta:hover { background: var(--tc-terra); transform: scale(1.04); }
    .tc-burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 4px;
    }
    .tc-burger span {
      display: block;
      width: 24px; height: 1.5px;
      background: var(--tc-ink);
      transition: all 0.3s;
    }

    /* Mobile menu */
    .tc-mobile-menu {
      position: fixed;
      inset: 0;
      background: var(--tc-chalk);
      z-index: 490;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 28px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s cubic-bezier(0.76,0,0.24,1);
    }
    .tc-mobile-menu.open { opacity: 1; pointer-events: all; }
    .tc-mobile-menu a {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: clamp(36px, 8vw, 60px);
      color: var(--tc-ink);
      text-decoration: none;
      opacity: 0.3;
      transition: opacity 0.3s, color 0.3s;
      cursor: pointer;
    }
    .tc-mobile-menu a:hover { opacity: 1; color: var(--tc-terra); }

    /* Section divider */
    .tc-divider {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 0 80px;
      margin-bottom: 60px;
    }
    .tc-divider-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.2em;
      color: var(--tc-terra);
      white-space: nowrap;
    }
    .tc-divider-line { flex: 1; height: 1px; background: var(--tc-border); }
    .tc-divider-num {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: var(--tc-dim);
      letter-spacing: 0.1em;
    }

    /* ── HERO ── */
    .tc-hero {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding-top: 80px;
      overflow: hidden;
    }
    .tc-hero-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 80px 60px 80px 80px;
      position: relative;
    }
    .tc-hero-left::before {
      content: attr(data-initial);
      position: absolute;
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: 55vw;
      color: var(--tc-ink);
      opacity: 0.025;
      line-height: 1;
      top: -5%;
      left: -10%;
      pointer-events: none;
      z-index: 0;
    }
    .tc-hero-tag {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.18em;
      color: var(--tc-terra);
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: tc-fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s forwards;
    }
    .tc-hero-tag::before {
      content: '';
      display: block;
      width: 32px; height: 1px;
      background: var(--tc-terra);
    }
    .tc-hero-name {
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: clamp(52px, 6vw, 96px);
      line-height: 0.92;
      letter-spacing: -0.03em;
      color: var(--tc-ink);
      position: relative;
      z-index: 1;
      overflow: hidden;
    }
    .tc-name-line {
      display: block;
      transform: translateY(110%);
      animation: tc-revealUp 1s cubic-bezier(0.22,1,0.36,1) forwards;
    }
    .tc-name-line:nth-child(1) { animation-delay: 0.5s; }
    .tc-name-line:nth-child(2) { animation-delay: 0.65s; }
    .tc-name-italic { font-style: italic; color: var(--tc-terra); }
    .tc-hero-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 300;
      font-size: clamp(15px, 1.8vw, 21px);
      color: var(--tc-ink2);
      margin-top: 28px;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: tc-fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.9s forwards;
      height: 1.5em;
      overflow: hidden;
    }
    .tc-cursor-blink {
      display: inline-block;
      width: 2px; height: 1.1em;
      background: var(--tc-terra);
      margin-left: 2px;
      vertical-align: middle;
      animation: tc-blink 0.8s infinite;
    }
    .tc-hero-bio {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      line-height: 1.75;
      color: var(--tc-dim);
      margin-top: 20px;
      max-width: 420px;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: tc-fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 1.05s forwards;
    }
    .tc-hero-actions {
      display: flex;
      gap: 16px;
      margin-top: 40px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: tc-fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 1.2s forwards;
    }
    .tc-btn-primary {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.1em;
      color: var(--tc-chalk);
      background: var(--tc-ink);
      border: none;
      padding: 14px 28px;
      border-radius: 100px;
      cursor: none;
      transition: background 0.3s, transform 0.25s cubic-bezier(0.22,1,0.36,1);
      text-decoration: none;
      display: inline-block;
    }
    .tc-btn-primary:hover { background: var(--tc-terra); transform: scale(1.05) translateY(-2px); }
    .tc-btn-secondary {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.1em;
      color: var(--tc-ink);
      background: transparent;
      border: 1.5px solid var(--tc-border-med);
      padding: 14px 28px;
      border-radius: 100px;
      cursor: none;
      transition: border-color 0.3s, color 0.3s, transform 0.25s cubic-bezier(0.22,1,0.36,1);
      text-decoration: none;
      display: inline-block;
    }
    .tc-btn-secondary:hover { border-color: var(--tc-cobalt); color: var(--tc-cobalt); transform: scale(1.05) translateY(-2px); }
    .tc-hero-meta {
      display: flex;
      gap: 24px;
      margin-top: 48px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: tc-fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 1.35s forwards;
    }
    .tc-meta-item {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: var(--tc-dim);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tc-meta-item a { color: var(--tc-dim); text-decoration: none; transition: color 0.2s; cursor: none; }
    .tc-meta-item a:hover { color: var(--tc-cobalt); }
    .tc-avail-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--tc-sage);
      animation: tc-pulse 2.2s ease-in-out infinite;
    }
    .tc-hero-right {
      position: relative;
      overflow: hidden;
      background: var(--tc-chalk2);
    }
    .tc-shape-1 {
      position: absolute;
      width: 65%; aspect-ratio: 1;
      border-radius: 50%;
      background: var(--tc-terra-light);
      top: 10%; right: -10%;
      animation: tc-floatA 7s ease-in-out infinite;
    }
    .tc-shape-2 {
      position: absolute;
      width: 45%; aspect-ratio: 1;
      border-radius: 50%;
      background: var(--tc-cobalt-light);
      bottom: 15%; left: 5%;
      animation: tc-floatB 9s ease-in-out infinite;
    }
    .tc-shape-3 {
      position: absolute;
      width: 30%; aspect-ratio: 1;
      background: var(--tc-sage-light);
      top: 50%; left: 40%;
      transform: rotate(45deg);
      animation: tc-floatC 11s ease-in-out infinite;
    }
    .tc-photo-wrap {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }
    .tc-stat-card {
      position: absolute;
      background: var(--tc-chalk);
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 8px 32px rgba(26,26,24,0.1);
      z-index: 3;
      opacity: 0;
      animation: tc-popIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
    }
    .tc-stat-card:nth-child(1) { top: 18%; left: 4%; animation-delay: 1.2s; }
    .tc-stat-card:nth-child(2) { bottom: 22%; right: 4%; animation-delay: 1.5s; }
    .tc-stat-num {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 900;
      color: var(--tc-terra);
      line-height: 1;
    }
    .tc-stat-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.1em;
      color: var(--tc-dim);
      margin-top: 4px;
    }
    .tc-photo-frame {
      width: 65%;
      aspect-ratio: 3/4;
      background: var(--tc-chalk3);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(26,26,24,0.12), 0 8px 32px rgba(26,26,24,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateY(40px);
      animation: tc-revealPhoto 1.2s cubic-bezier(0.22,1,0.36,1) 0.6s forwards;
    }
    .tc-photo-img { width: 100%; height: 100%; object-fit: cover; }
    .tc-photo-initials {
      font-family: 'Playfair Display', serif;
      font-size: 80px;
      font-weight: 900;
      font-style: italic;
      color: rgba(26,26,24,0.08);
      user-select: none;
    }

    /* ── TAGLINE ── */
    .tc-tagline-section {
      padding: 120px 80px;
      background: var(--tc-chalk);
      overflow: hidden;
    }
    .tc-tagline-inner { max-width: 1100px; margin: 0 auto; position: relative; }
    .tc-tagline-bg {
      position: absolute;
      font-family: 'Playfair Display', serif;
      font-size: 30vw;
      font-weight: 900;
      color: var(--tc-ink);
      opacity: 0.02;
      right: -5%; top: -30%;
      line-height: 1;
      pointer-events: none;
      user-select: none;
    }
    .tc-tagline-text {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-weight: 700;
      font-size: clamp(36px, 5vw, 72px);
      line-height: 1.15;
      color: var(--tc-ink);
      letter-spacing: -0.02em;
      position: relative;
      z-index: 1;
    }
    .tc-tq-word {
      display: inline-block;
      opacity: 0;
      transform: translateY(30px) rotate(-2deg);
      transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1);
      margin-right: 0.25em;
    }
    .tc-tq-word.vis { opacity: 1; transform: translateY(0) rotate(0deg); }
    .tc-highlight { color: var(--tc-terra); }

    /* ── STORY ── */
    .tc-story-section {
      padding: 0 80px 120px;
      background: var(--tc-chalk);
    }
    .tc-story-grid {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 80px;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    .tc-story-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(42px, 5vw, 72px);
      font-weight: 900;
      font-style: italic;
      color: var(--tc-ink);
      line-height: 0.95;
      letter-spacing: -0.03em;
    }
    .tc-story-heading em { color: var(--tc-cobalt); font-style: italic; }
    .tc-story-visual {
      margin-top: 40px;
      width: 100%;
      height: 280px;
      background: var(--tc-cobalt-light);
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tc-arc {
      position: absolute;
      width: 80%; height: 80%;
      border: 2px solid var(--tc-cobalt);
      border-radius: 50%;
      opacity: 0.3;
      animation: tc-rotateSlow 20s linear infinite;
    }
    .tc-arc2 {
      position: absolute;
      width: 55%; height: 55%;
      border: 1px solid var(--tc-terra);
      border-radius: 50%;
      opacity: 0.4;
      animation: tc-rotateSlow 14s linear infinite reverse;
    }
    .tc-arc-dot {
      position: absolute;
      width: 12px; height: 12px;
      background: var(--tc-terra);
      border-radius: 50%;
      box-shadow: 0 0 0 8px rgba(200,85,61,0.15);
    }
    .tc-story-para {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(15px, 1.6vw, 18px);
      line-height: 1.85;
      color: var(--tc-ink2);
      margin-bottom: 1.4em;
    }
    .tc-story-para:last-child { margin-bottom: 0; }
    .tc-mask { overflow: hidden; }
    .tc-mask-inner {
      transform: translateY(100%);
      transition: transform 0.9s cubic-bezier(0.22,1,0.36,1);
    }
    .tc-mask-inner.vis { transform: translateY(0); }

    /* ── EXPERIENCE ── */
    .tc-exp-section {
      padding: 120px 80px;
      background: var(--tc-chalk2);
    }
    .tc-exp-layout {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 60px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .tc-exp-list { display: flex; flex-direction: column; gap: 4px; }
    .tc-exp-item {
      padding: 20px 24px;
      border-radius: 12px;
      cursor: none;
      transition: background 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s;
      border: 1.5px solid transparent;
      position: relative;
      overflow: hidden;
    }
    .tc-exp-item::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: var(--tc-terra);
      transform: scaleY(0);
      transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
      transform-origin: bottom;
    }
    .tc-exp-item.active {
      background: var(--tc-chalk);
      border-color: var(--tc-border-med);
      transform: translateX(4px);
    }
    .tc-exp-item.active::before { transform: scaleY(1); }
    .tc-exp-item-year {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.1em;
      color: var(--tc-dim);
      margin-bottom: 6px;
    }
    .tc-exp-item-company {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--tc-ink);
      line-height: 1.2;
    }
    .tc-exp-item-role {
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      color: var(--tc-dim);
      margin-top: 2px;
    }
    .tc-exp-detail { position: relative; }
    .tc-exp-panel { display: none; animation: tc-fadeSlideIn 0.5s cubic-bezier(0.22,1,0.36,1); }
    .tc-exp-panel.active { display: block; }
    .tc-exp-role {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 3.5vw, 52px);
      font-weight: 900;
      font-style: italic;
      color: var(--tc-ink);
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 8px;
    }
    .tc-exp-company {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.12em;
      color: var(--tc-terra);
      margin-bottom: 4px;
    }
    .tc-exp-meta {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--tc-dim);
      margin-bottom: 32px;
      display: flex;
      gap: 24px;
    }
    .tc-exp-desc {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      line-height: 1.8;
      color: var(--tc-ink2);
      max-width: 560px;
    }
    .tc-exp-watermark {
      font-family: 'Playfair Display', serif;
      font-size: clamp(80px, 14vw, 180px);
      font-weight: 900;
      font-style: italic;
      color: var(--tc-ink);
      opacity: 0.03;
      position: absolute;
      bottom: 0; right: 0;
      line-height: 1;
      pointer-events: none;
      user-select: none;
      letter-spacing: -0.05em;
      transition: all 0.5s cubic-bezier(0.22,1,0.36,1);
    }

    /* ── PROJECTS ── */
    .tc-proj-section {
      padding: 120px 80px;
      background: var(--tc-chalk);
    }
    .tc-proj-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(48px, 6vw, 88px);
      font-weight: 900;
      color: var(--tc-ink);
      letter-spacing: -0.03em;
      line-height: 0.92;
      max-width: 1200px;
      margin: 0 auto 64px;
    }
    .tc-proj-heading em { font-style: italic; color: var(--tc-terra); }
    .tc-proj-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 16px;
    }
    .tc-proj-card {
      background: var(--tc-chalk2);
      border-radius: 16px;
      padding: 36px;
      cursor: none;
      position: relative;
      overflow: hidden;
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.4s;
      border: 1.5px solid transparent;
      opacity: 0;
      transform: translateY(40px);
      display: flex;
      flex-direction: column;
    }
    .tc-proj-card.vis { opacity: 1; transform: translateY(0); }
    .tc-proj-card:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 32px 80px rgba(26,26,24,0.1); border-color: var(--tc-border-med); }
    .tc-proj-large { grid-column: span 7; min-height: 360px; }
    .tc-proj-medium { grid-column: span 5; min-height: 360px; }
    .tc-proj-wide { grid-column: span 12; min-height: 200px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; flex-direction: row; }
    .tc-proj-small { grid-column: span 4; min-height: 260px; }
    .tc-proj-accent-terra { background: var(--tc-terra-light); }
    .tc-proj-accent-cobalt { background: var(--tc-cobalt-light); }
    .tc-proj-accent-sage { background: var(--tc-sage-light); }
    .tc-proj-num {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.15em;
      color: var(--tc-dim);
      margin-bottom: 20px;
    }
    .tc-proj-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(20px, 2.5vw, 32px);
      font-weight: 700;
      font-style: italic;
      color: var(--tc-ink);
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
    }
    .tc-proj-desc {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      line-height: 1.7;
      color: var(--tc-ink2);
      margin-bottom: 20px;
      flex: 1;
    }
    .tc-proj-stack { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
    .tc-proj-chip {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.08em;
      color: var(--tc-ink2);
      background: rgba(26,26,24,0.07);
      padding: 4px 10px;
      border-radius: 100px;
    }
    .tc-proj-links { display: flex; gap: 12px; margin-top: 8px; }
    .tc-proj-link {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.1em;
      color: var(--tc-cobalt);
      text-decoration: none;
      border-bottom: 1px solid var(--tc-cobalt);
      padding-bottom: 1px;
      transition: opacity 0.2s;
      cursor: none;
    }
    .tc-proj-link:hover { opacity: 0.6; }
    .tc-proj-arrow {
      position: absolute;
      top: 28px; right: 28px;
      width: 40px; height: 40px;
      border-radius: 50%;
      background: var(--tc-ink);
      display: flex; align-items: center; justify-content: center;
      transform: scale(0) rotate(-45deg);
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
    }
    .tc-proj-card:hover .tc-proj-arrow { transform: scale(1) rotate(0deg); }

    /* ── SKILLS ── */
    .tc-skills-section {
      padding: 120px 80px;
      background: var(--tc-chalk2);
    }
    .tc-skills-layout {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 80px;
      align-items: start;
    }
    .tc-skills-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(48px, 5.5vw, 80px);
      font-weight: 900;
      color: var(--tc-ink);
      line-height: 0.92;
      letter-spacing: -0.03em;
      position: sticky;
      top: 120px;
    }
    .tc-skills-heading em { font-style: italic; color: var(--tc-cobalt); display: block; }
    .tc-skills-cats { display: flex; flex-direction: column; gap: 40px; }
    .tc-skill-cat-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      color: var(--tc-terra);
      margin-bottom: 16px;
    }
    .tc-skill-chips { display: flex; flex-wrap: wrap; gap: 10px; }
    .tc-skill-pill {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: var(--tc-ink);
      background: var(--tc-chalk);
      border: 1.5px solid var(--tc-border-med);
      padding: 10px 20px;
      border-radius: 100px;
      transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
      opacity: 0;
      transform: scale(0.85);
      cursor: none;
    }
    .tc-skill-pill.vis { opacity: 1; transform: scale(1); }
    .tc-skill-pill:hover { background: var(--tc-ink); color: var(--tc-chalk); border-color: var(--tc-ink); transform: scale(1.05); }

    /* ── EDUCATION ── */
    .tc-edu-section {
      padding: 120px 80px;
      background: var(--tc-chalk);
    }
    .tc-edu-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .tc-edu-card {
      padding: 36px;
      border-radius: 16px;
      background: var(--tc-chalk2);
      border: 1.5px solid var(--tc-border);
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
      opacity: 0;
      transform: translateY(30px);
      position: relative;
      overflow: hidden;
    }
    .tc-edu-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--tc-cobalt);
    }
    .tc-edu-card.vis { opacity: 1; transform: translateY(0); }
    .tc-edu-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(26,26,24,0.08); }
    .tc-edu-year {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: var(--tc-cobalt);
      margin-bottom: 12px;
    }
    .tc-edu-degree {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      font-style: italic;
      color: var(--tc-ink);
      line-height: 1.2;
      margin-bottom: 8px;
    }
    .tc-edu-field { font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--tc-dim); margin-bottom: 4px; }
    .tc-edu-institution { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600; color: var(--tc-ink2); }

    /* ── CERTIFICATIONS ── */
    .tc-cert-section { padding: 0 80px 120px; background: var(--tc-chalk); }
    .tc-cert-list { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 2px; }
    .tc-cert-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 24px;
      align-items: center;
      padding: 22px 28px;
      background: var(--tc-chalk2);
      border-radius: 10px;
      transition: background 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1);
      cursor: none;
      opacity: 0;
      transform: translateX(-20px);
    }
    .tc-cert-row.vis { opacity: 1; transform: translateX(0); }
    .tc-cert-row:hover { background: var(--tc-terra-light); transform: translateX(8px); }
    .tc-cert-name { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 500; color: var(--tc-ink); }
    .tc-cert-issuer { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--tc-dim); letter-spacing: 0.08em; margin-top: 3px; }
    .tc-cert-date { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--tc-terra); letter-spacing: 0.08em; white-space: nowrap; }

    /* ── EXTRAS ── */
    .tc-extras-section { padding: 120px 80px; background: var(--tc-chalk2); }
    .tc-extras-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
    .tc-extras-heading {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      font-style: italic;
      color: var(--tc-ink);
      margin-bottom: 28px;
    }
    .tc-lang-list { display: flex; flex-direction: column; gap: 16px; }
    .tc-lang-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .tc-lang-name { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 500; color: var(--tc-ink); min-width: 90px; }
    .tc-lang-bar-wrap { flex: 1; height: 4px; background: var(--tc-border); border-radius: 100px; overflow: hidden; }
    .tc-lang-bar { height: 100%; background: var(--tc-cobalt); border-radius: 100px; width: 0%; transition: width 1.2s cubic-bezier(0.22,1,0.36,1); }
    .tc-lang-prof { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--tc-dim); letter-spacing: 0.1em; white-space: nowrap; min-width: 90px; text-align: right; }
    .tc-int-cloud { display: flex; flex-wrap: wrap; gap: 12px; }
    .tc-int-tag {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      color: var(--tc-ink2);
      background: var(--tc-chalk);
      border: 1.5px solid var(--tc-border-med);
      padding: 10px 18px;
      border-radius: 100px;
      transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
      cursor: none;
      opacity: 0;
      transform: scale(0.85);
    }
    .tc-int-tag.vis { opacity: 1; transform: scale(1); }
    .tc-int-tag:hover { background: var(--tc-sage); color: var(--tc-chalk); border-color: var(--tc-sage); }

    /* ── WORK STYLE ── */
    .tc-ws-section { padding: 120px 80px; background: var(--tc-chalk); }
    .tc-ws-layout { max-width: 1200px; margin: 0 auto; }
    .tc-ws-top { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 80px; align-items: end; }
    .tc-ws-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(52px, 6vw, 88px);
      font-weight: 900;
      color: var(--tc-ink);
      line-height: 0.92;
      letter-spacing: -0.03em;
    }
    .tc-ws-heading em { font-style: italic; color: var(--tc-sage); }
    .tc-ws-intro { font-family: 'Outfit', sans-serif; font-size: 16px; line-height: 1.8; color: var(--tc-ink2); }
    .tc-ws-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 3px;
    }
    .tc-ws-card {
      background: var(--tc-chalk2);
      padding: 40px 36px;
      position: relative;
      overflow: hidden;
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
      cursor: none;
      opacity: 0;
      transform: translateY(30px);
    }
    .tc-ws-card:first-child { border-radius: 16px 0 0 16px; }
    .tc-ws-card:last-child { border-radius: 0 16px 16px 0; }
    .tc-ws-card.vis { opacity: 1; transform: translateY(0); }
    .tc-ws-card:hover { transform: translateY(-6px); z-index: 1; }
    .tc-ws-card::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 3px;
      background: var(--tc-sage);
      transform: scaleX(0);
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
      transform-origin: left;
    }
    .tc-ws-card:hover::after { transform: scaleX(1); }
    .tc-ws-num { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.15em; color: var(--tc-dim); margin-bottom: 16px; }
    .tc-ws-card-heading { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; font-style: italic; color: var(--tc-ink); margin-bottom: 14px; }
    .tc-ws-card-body { font-family: 'Outfit', sans-serif; font-size: 14px; line-height: 1.75; color: var(--tc-ink2); }

    /* ── LOOKING FOR ── */
    .tc-lf-section {
      padding: 120px 80px;
      background: var(--tc-ink);
      overflow: hidden;
      position: relative;
    }
    .tc-lf-bg {
      position: absolute;
      font-family: 'Playfair Display', serif;
      font-size: 30vw;
      font-weight: 900;
      color: var(--tc-chalk);
      opacity: 0.02;
      bottom: -10%; left: -5%;
      line-height: 1;
      pointer-events: none;
      user-select: none;
      letter-spacing: -0.05em;
    }
    .tc-lf-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
    .tc-lf-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.2em;
      color: var(--tc-terra);
      margin-bottom: 36px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .tc-lf-label::before { content: ''; display: block; width: 24px; height: 1px; background: var(--tc-terra); }
    .tc-lf-statement {
      font-family: 'Playfair Display', serif;
      font-size: clamp(36px, 5vw, 72px);
      font-weight: 900;
      font-style: italic;
      color: var(--tc-chalk);
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 56px;
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 1s ease, transform 1s cubic-bezier(0.22,1,0.36,1);
    }
    .tc-lf-statement.vis { opacity: 1; transform: translateY(0); }
    .tc-lf-cta {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s;
    }
    .tc-lf-cta.vis { opacity: 1; transform: translateY(0); }
    .tc-btn-light {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.1em;
      color: var(--tc-ink);
      background: var(--tc-chalk);
      border: none;
      padding: 16px 32px;
      border-radius: 100px;
      cursor: none;
      transition: background 0.3s, color 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1);
      text-decoration: none;
      display: inline-block;
    }
    .tc-btn-light:hover { background: var(--tc-terra); color: var(--tc-chalk); transform: scale(1.05) translateY(-2px); }
    .tc-btn-ghost {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.1em;
      color: rgba(254,254,252,0.5);
      background: transparent;
      border: 1.5px solid rgba(254,254,252,0.2);
      padding: 16px 32px;
      border-radius: 100px;
      cursor: none;
      transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
      text-decoration: none;
      display: inline-block;
    }
    .tc-btn-ghost:hover { border-color: var(--tc-chalk); color: var(--tc-chalk); transform: scale(1.05) translateY(-2px); }

    /* ── CONTACT ── */
    .tc-contact-section { padding: 120px 80px 80px; background: var(--tc-chalk); }
    .tc-contact-layout { max-width: 1200px; margin: 0 auto; }
    .tc-contact-top { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 80px; align-items: start; }
    .tc-contact-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(52px, 6vw, 88px);
      font-weight: 900;
      color: var(--tc-ink);
      line-height: 0.92;
      letter-spacing: -0.03em;
    }
    .tc-contact-heading em { font-style: italic; color: var(--tc-terra); }
    .tc-contact-intro { font-family: 'Outfit', sans-serif; font-size: 16px; line-height: 1.8; color: var(--tc-ink2); margin-bottom: 36px; }
    .tc-contact-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .tc-contact-card {
      background: var(--tc-chalk2);
      border-radius: 12px;
      padding: 24px;
      border: 1.5px solid transparent;
      transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
      cursor: none;
      text-decoration: none;
      display: block;
    }
    .tc-contact-card:hover { background: var(--tc-chalk); border-color: var(--tc-border-med); transform: translateY(-4px); box-shadow: 0 16px 48px rgba(26,26,24,0.08); }
    .tc-cc-icon { font-size: 18px; margin-bottom: 12px; }
    .tc-cc-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.12em; color: var(--tc-dim); margin-bottom: 6px; }
    .tc-cc-val { font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500; color: var(--tc-ink); word-break: break-all; }
    .tc-footer-bar {
      border-top: 1px solid var(--tc-border);
      padding-top: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .tc-footer-name { font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px; color: var(--tc-ink); }
    .tc-footer-copy { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--tc-dim); }
    .tc-footer-links { display: flex; gap: 24px; }
    .tc-footer-links a { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--tc-dim); text-decoration: none; transition: color 0.2s; cursor: none; }
    .tc-footer-links a:hover { color: var(--tc-terra); }

    /* ── KEYFRAMES ── */
    @keyframes tc-fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes tc-revealUp { to{transform:translateY(0)} }
    @keyframes tc-revealPhoto { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes tc-popIn { from{opacity:0;transform:scale(0.8) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes tc-floatA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,20px) scale(1.03)} }
    @keyframes tc-floatB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(15px,-25px)} }
    @keyframes tc-floatC { 0%,100%{transform:rotate(45deg) translate(0,0)} 50%{transform:rotate(55deg) translate(10px,-15px)} }
    @keyframes tc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
    @keyframes tc-rotateSlow { to{transform:rotate(360deg)} }
    @keyframes tc-blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes tc-fadeSlideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .tc-nav { padding: 18px 32px; }
      .tc-nav-links { display: none; }
      .tc-burger { display: flex !important; }
      .tc-hero { grid-template-columns: 1fr; }
      .tc-hero-left { padding: 100px 32px 60px; }
      .tc-hero-right { height: 360px; }
      .tc-photo-frame { width: 50%; }
      .tc-story-grid { grid-template-columns: 1fr; gap: 48px; }
      .tc-story-visual { height: 200px; }
      .tc-exp-layout { grid-template-columns: 1fr; }
      .tc-exp-list { flex-direction: row; overflow-x: auto; gap: 8px; padding-bottom: 8px; }
      .tc-exp-item { min-width: 180px; flex-shrink: 0; }
      .tc-exp-watermark { display: none; }
      .tc-skills-layout { grid-template-columns: 1fr; gap: 48px; }
      .tc-skills-heading { position: static; }
      .tc-ws-top { grid-template-columns: 1fr; gap: 32px; }
      .tc-contact-top { grid-template-columns: 1fr; gap: 48px; }
      .tc-extras-grid { grid-template-columns: 1fr; gap: 48px; }
      .tc-divider { padding: 0 32px; }
      .tc-tagline-section, .tc-story-section, .tc-exp-section, .tc-proj-section,
      .tc-skills-section, .tc-edu-section, .tc-cert-section, .tc-extras-section,
      .tc-ws-section, .tc-lf-section, .tc-contact-section { padding-left: 32px; padding-right: 32px; }
    }
    @media (max-width: 768px) {
      .tc-proj-large, .tc-proj-medium, .tc-proj-small { grid-column: span 12; }
      .tc-proj-wide { grid-column: span 12; display: flex; flex-direction: column; }
      .tc-ws-grid { grid-template-columns: 1fr; }
      .tc-ws-card:first-child { border-radius: 16px 16px 0 0; }
      .tc-ws-card:last-child { border-radius: 0 0 16px 16px; }
      .tc-contact-cards { grid-template-columns: 1fr; }
      .tc-footer-bar { flex-direction: column; align-items: flex-start; }
    }
    @media (max-width: 480px) {
      .tc-nav { padding: 16px 20px; }
      .tc-hero-left { padding: 90px 20px 48px; }
      .tc-hero-actions { flex-direction: column; }
      .tc-btn-primary, .tc-btn-secondary { text-align: center; }
      .tc-hero-right { height: 300px; }
      .tc-cert-row { grid-template-columns: 1fr; }
      .tc-lf-cta { flex-direction: column; align-items: flex-start; }
      .tc-tagline-section, .tc-story-section, .tc-exp-section, .tc-proj-section,
      .tc-skills-section, .tc-edu-section, .tc-cert-section, .tc-extras-section,
      .tc-ws-section, .tc-lf-section, .tc-contact-section { padding-left: 20px; padding-right: 20px; }
      .tc-divider { padding: 0 20px; }
    }
  `

  // ── Section visibility handler (for sections) ─────────────────────────
  const secVis = (id: string) => visibleSections.has(id)

  const firstNameInitial = personal.fullName?.charAt(0) ?? "P"
  const nameParts = personal.fullName?.split(" ") ?? ["Your", "Name"]

  const workPrinciples = workStylePrinciples ?? [
    { heading: "Ship, then refine", body: "Real feedback beats internal review every time. Get something real in front of real people." },
    { heading: "Constraints liberate", body: "The best work often comes from the tightest briefs. Limitations force clarity." },
    { heading: "Clarity before cleverness", body: "A simple solution that works beats a clever one that confuses. Always." },
    { heading: "People first", body: "Every decision traces back to a human being on the other end. Keep them in focus." },
  ]

  return (
    <div className="tc-root">
      <style>{css}</style>

      {/* Cursor */}
      <div
        className="tc-cursor-dot"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      <div
        className="tc-cursor-ring"
        style={{ left: ringPos.x, top: ringPos.y }}
      />

      {/* Progress */}
      <div className="tc-progress" style={{ width: `${progress}%` }} />

      {/* ── NAV ── */}
      <nav className={`tc-nav${scrolled ? " scrolled" : ""}`}>
        <div className="tc-nav-logo">{personal.fullName}</div>
        <ul className="tc-nav-links">
          {careerStory && <li><a href="#tc-story">About</a></li>}
          {experience?.length > 0 && <li><a href="#tc-experience">Experience</a></li>}
          {projects?.length > 0 && <li><a href="#tc-projects">Projects</a></li>}
          {skills?.length > 0 && <li><a href="#tc-skills">Skills</a></li>}
          <li><a href="#tc-contact">Contact</a></li>
        </ul>
        {personal.email && (
          <a href={`mailto:${personal.email}`} className="tc-nav-cta">Let&apos;s Talk</a>
        )}
        <button
          className="tc-burger"
          style={{ display: "none" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`tc-mobile-menu${mobileOpen ? " open" : ""}`}>
        {careerStory && <a href="#tc-story" onClick={() => setMobileOpen(false)}>About</a>}
        {experience?.length > 0 && <a href="#tc-experience" onClick={() => setMobileOpen(false)}>Experience</a>}
        {projects?.length > 0 && <a href="#tc-projects" onClick={() => setMobileOpen(false)}>Projects</a>}
        {skills?.length > 0 && <a href="#tc-skills" onClick={() => setMobileOpen(false)}>Skills</a>}
        {education?.length > 0 && <a href="#tc-education" onClick={() => setMobileOpen(false)}>Education</a>}
        <a href="#tc-contact" onClick={() => setMobileOpen(false)}>Contact</a>
      </div>

      {/* ── 01: HERO ── */}
      <section id="tc-hero">
        <div className="tc-hero">
          <div className="tc-hero-left" data-initial={firstNameInitial}>
            <div className="tc-hero-tag">PORTFOLIO · {new Date().getFullYear()}</div>
            <h1 className="tc-hero-name">
              <span className="tc-name-line">{nameParts[0]}</span>
              <span className="tc-name-line">
                <em className="tc-name-italic">{nameParts.slice(1).join(" ")}.</em>
              </span>
            </h1>
            <div className="tc-hero-title">
              {typeText}<span className="tc-cursor-blink" />
            </div>
            {personal.bio && <p className="tc-hero-bio">{personal.bio}</p>}
            <div className="tc-hero-actions">
              {projects?.length > 0 && (
                <a href="#tc-projects" className="tc-btn-primary">View My Work</a>
              )}
              <a href="#tc-contact" className="tc-btn-secondary">Get In Touch</a>
            </div>
            <div className="tc-hero-meta">
              <div className="tc-meta-item">
                <div className="tc-avail-dot" />
                Open to work
              </div>
              {personal.location && (
                <div className="tc-meta-item">{personal.location}</div>
              )}
              {personal.linkedinUrl && (
                <div className="tc-meta-item">
                  <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
              )}
              {personal.githubUrl && (
                <div className="tc-meta-item">
                  <a href={personal.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
              )}
              {personal.websiteUrl && (
                <div className="tc-meta-item">
                  <a href={personal.websiteUrl} target="_blank" rel="noopener noreferrer">Website</a>
                </div>
              )}
            </div>
          </div>

          <div className="tc-hero-right">
            <div className="tc-shape-1" />
            <div className="tc-shape-2" />
            <div className="tc-shape-3" />
            <div className="tc-photo-wrap" id="tc-hero-stats">
              {experience?.length > 0 && (
                <div className="tc-stat-card">
                  <div className="tc-stat-num">{statYears}</div>
                  <div className="tc-stat-label">YEARS EXP.</div>
                </div>
              )}
              {projects?.length > 0 && (
                <div className="tc-stat-card">
                  <div className="tc-stat-num">{statProjects}</div>
                  <div className="tc-stat-label">PROJECTS SHIPPED</div>
                </div>
              )}
              <div className="tc-photo-frame">
                {personal.profilePhotoUrl ? (
                  <img
                    src={personal.profilePhotoUrl}
                    alt={personal.fullName}
                    className="tc-photo-img"
                  />
                ) : (
                  <div className="tc-photo-initials">
                    {nameParts.map((n) => n[0]).join("")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02: TAGLINE ── */}
      {tagline && (
        <section id="tc-tagline">
          <div className="tc-tagline-section">
            <div className="tc-divider">
              <span className="tc-divider-label">ABOUT</span>
              <div className="tc-divider-line" />
              <span className="tc-divider-num">02</span>
            </div>
            <div className="tc-tagline-inner">
              <div className="tc-tagline-bg">∞</div>
              <div className="tc-tagline-text">
                {tagline.split(" ").map((word, i, arr) => (
                  <span
                    key={i}
                    className={`tc-tq-word${secVis("tc-tagline") ? " vis" : ""}${i >= arr.length - 2 ? " tc-highlight" : ""}`}
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 03: CAREER STORY ── */}
      {careerStory && (
        <section id="tc-story">
          <div className="tc-story-section">
            <div className="tc-story-grid">
              <div>
                <h2 className="tc-story-heading">
                  The<br /><em>story</em><br />so far.
                </h2>
                <div className="tc-story-visual">
                  <div className="tc-arc" />
                  <div className="tc-arc2" />
                  <div className="tc-arc-dot" />
                </div>
              </div>
              <div>
                {careerStory.split(". ").filter(Boolean).map((sentence, i) => (
                  <div key={i} className="tc-mask">
                    <p
                      className={`tc-story-para tc-mask-inner${secVis("tc-story") ? " vis" : ""}`}
                      style={{ transitionDelay: `${i * 150}ms` }}
                    >
                      {sentence.trim()}{sentence.trim().endsWith(".") ? "" : "."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 04: EXPERIENCE ── */}
      {experience?.length > 0 && (
        <section id="tc-experience">
          <div className="tc-exp-section">
            <div className="tc-divider">
              <span className="tc-divider-label">EXPERIENCE</span>
              <div className="tc-divider-line" />
              <span className="tc-divider-num">04</span>
            </div>
            <div className="tc-exp-layout">
              <div className="tc-exp-list">
                {experience.map((e, i) => (
                  <div
                    key={i}
                    className={`tc-exp-item${activeExp === i ? " active" : ""}`}
                    onClick={() => setActiveExp(i)}
                  >
                    <div className="tc-exp-item-year">
                      {e.startDate} – {e.isCurrent ? "Present" : e.endDate}
                    </div>
                    <div className="tc-exp-item-company">{e.companyName}</div>
                    <div className="tc-exp-item-role">{e.roleTitle}</div>
                  </div>
                ))}
              </div>
              <div className="tc-exp-detail">
                {experience.map((e, i) => (
                  <div
                    key={i}
                    className={`tc-exp-panel${activeExp === i ? " active" : ""}`}
                  >
                    <div className="tc-exp-role">{e.roleTitle}</div>
                    <div className="tc-exp-company">{e.companyName}</div>
                    <div className="tc-exp-meta">
                      <span>{e.startDate} — {e.isCurrent ? "Present" : e.endDate}</span>
                      {e.location && <span>{e.location}</span>}
                    </div>
                    {e.description && (
                      <div className="tc-exp-desc">{e.description}</div>
                    )}
                  </div>
                ))}
                <div className="tc-exp-watermark">
                  {experience[activeExp]?.companyName}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 05: PROJECTS ── */}
      {projects?.length > 0 && (
        <section id="tc-projects">
          <div className="tc-proj-section">
            <div className="tc-divider">
              <span className="tc-divider-label">SELECTED WORK</span>
              <div className="tc-divider-line" />
              <span className="tc-divider-num">05</span>
            </div>
            <div className="tc-proj-heading">
              Work that <em>moves</em><br />the needle.
            </div>
            <div className="tc-proj-grid">
              {projects.map((p, i) => {
                const sizeClass = `tc-proj-${projSizes[i] ?? "small"}`
                const accentClass = projAccents[i] ? `tc-proj-${projAccents[i]}` : ""
                return (
                  <div
                    key={i}
                    className={`tc-proj-card ${sizeClass} ${accentClass}${secVis("tc-projects") ? " vis" : ""}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="tc-proj-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7,7 17,7 17,17" />
                      </svg>
                    </div>
                    <div className="tc-proj-num">PROJECT {String(i + 1).padStart(2, "0")}</div>
                    <div className="tc-proj-name">{p.projectName}</div>
                    {p.description && (
                      <div className="tc-proj-desc">{p.description}</div>
                    )}
                    <div>
                      <div className="tc-proj-stack">
                        {p.techStack.map((t, j) => (
                          <span key={j} className="tc-proj-chip">{t}</span>
                        ))}
                      </div>
                      <div className="tc-proj-links">
                        {p.liveUrl && (
                          <a href={p.liveUrl} className="tc-proj-link" target="_blank" rel="noopener noreferrer">
                            Live ↗
                          </a>
                        )}
                        {p.githubUrl && (
                          <a href={p.githubUrl} className="tc-proj-link" target="_blank" rel="noopener noreferrer">
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 06: SKILLS ── */}
      {skills?.length > 0 && (
        <section id="tc-skills">
          <div className="tc-skills-section">
            <div className="tc-divider">
              <span className="tc-divider-label">SKILLS</span>
              <div className="tc-divider-line" />
              <span className="tc-divider-num">06</span>
            </div>
            <div className="tc-skills-layout">
              <div>
                <div className="tc-skills-heading">
                  What<br /><em>I bring</em><br />to the<br />table.
                </div>
              </div>
              <div className="tc-skills-cats">
                {Object.entries(skillsByCategory).map(([cat, items], ci) => (
                  <div key={ci}>
                    <div className="tc-skill-cat-label">{cat.toUpperCase()}</div>
                    <div className="tc-skill-chips">
                      {items.map((name, j) => (
                        <span
                          key={j}
                          className={`tc-skill-pill${secVis("tc-skills") ? " vis" : ""}`}
                          style={{ transitionDelay: `${(ci * 3 + j) * 50}ms` }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 07: EDUCATION ── */}
      {education?.length > 0 && (
        <section id="tc-education">
          <div className="tc-edu-section">
            <div className="tc-divider">
              <span className="tc-divider-label">EDUCATION</span>
              <div className="tc-divider-line" />
              <span className="tc-divider-num">07</span>
            </div>
            <div className="tc-edu-grid">
              {education.map((e, i) => (
                <div
                  key={i}
                  className={`tc-edu-card${secVis("tc-education") ? " vis" : ""}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {(e.startYear || e.endYear) && (
                    <div className="tc-edu-year">
                      {e.startYear}{e.endYear ? ` – ${e.endYear}` : ""}
                    </div>
                  )}
                  <div className="tc-edu-degree">
                    {e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}
                  </div>
                  <div className="tc-edu-institution">{e.institution}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 08: CERTIFICATIONS ── */}
      {certifications?.length > 0 && (
        <section id="tc-certifications">
          <div className="tc-cert-section">
            <div className="tc-divider">
              <span className="tc-divider-label">CERTIFICATIONS</span>
              <div className="tc-divider-line" />
              <span className="tc-divider-num">08</span>
            </div>
            <div className="tc-cert-list">
              {certifications.map((c, i) => (
                <div
                  key={i}
                  className={`tc-cert-row${secVis("tc-certifications") ? " vis" : ""}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div>
                    <div className="tc-cert-name">{c.name}</div>
                    {c.issuer && <div className="tc-cert-issuer">{c.issuer}</div>}
                  </div>
                  {c.date && <div className="tc-cert-date">{c.date}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 09: LANGUAGES & INTERESTS ── */}
      {(languages?.length > 0 || interests?.length > 0) && (
        <section id="tc-extras">
          <div className="tc-extras-section">
            <div className="tc-divider">
              <span className="tc-divider-label">MORE ABOUT ME</span>
              <div className="tc-divider-line" />
              <span className="tc-divider-num">09</span>
            </div>
            <div className="tc-extras-grid">
              {languages?.length > 0 && (
                <div id="tc-lang-section">
                  <div className="tc-extras-heading">Languages</div>
                  <div className="tc-lang-list">
                    {languages.map((l, i) => (
                      <div key={i} className="tc-lang-row">
                        <div className="tc-lang-name">{l.language}</div>
                        <div className="tc-lang-bar-wrap">
                          <div
                            className="tc-lang-bar"
                            style={{
                              width: langBarsVis
                                ? `${profMap[l.proficiency] ?? 50}%`
                                : "0%",
                              transitionDelay: `${i * 150}ms`,
                            }}
                          />
                        </div>
                        <div className="tc-lang-prof">{l.proficiency}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {interests?.length > 0 && (
                <div>
                  <div className="tc-extras-heading">Interests</div>
                  <div className="tc-int-cloud">
                    {interests.map((t, i) => (
                      <div
                        key={i}
                        className={`tc-int-tag${secVis("tc-extras") ? " vis" : ""}`}
                        style={{ transitionDelay: `${i * 60}ms` }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 10: WORK STYLE ── */}
      {(workStyle || workPrinciples?.length > 0) && (
        <section id="tc-workstyle">
          <div className="tc-ws-section">
            <div className="tc-divider">
              <span className="tc-divider-label">HOW I WORK</span>
              <div className="tc-divider-line" />
              <span className="tc-divider-num">10</span>
            </div>
            <div className="tc-ws-layout">
              <div className="tc-ws-top">
                <div className="tc-ws-heading">
                  How I<br /><em>think</em> &<br />operate.
                </div>
                {workStyle && (
                  <div className="tc-ws-intro">{workStyle}</div>
                )}
              </div>
              {workPrinciples?.length > 0 && (
                <div className="tc-ws-grid">
                  {workPrinciples.map((p, i) => (
                    <div
                      key={i}
                      className={`tc-ws-card${secVis("tc-workstyle") ? " vis" : ""}`}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className="tc-ws-num">0{i + 1}</div>
                      <div className="tc-ws-card-heading">{p.heading}</div>
                      <div className="tc-ws-card-body">{p.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 11: LOOKING FOR ── */}
      {lookingFor && (
        <section id="tc-lookingfor">
          <div className="tc-lf-section">
            <div className="tc-lf-bg">NEXT</div>
            <div className="tc-lf-inner">
              <div className="tc-lf-label">WHAT&apos;S NEXT</div>
              <div className={`tc-lf-statement${secVis("tc-lookingfor") ? " vis" : ""}`}>
                {lookingFor}
              </div>
              <div className={`tc-lf-cta${secVis("tc-lookingfor") ? " vis" : ""}`}>
                {personal.email && (
                  <a href={`mailto:${personal.email}`} className="tc-btn-light">
                    Send a message
                  </a>
                )}
                <a href="#tc-contact" className="tc-btn-ghost">
                  See contact details
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 12: CONTACT ── */}
      <section id="tc-contact">
        <div className="tc-contact-section">
          <div className="tc-divider">
            <span className="tc-divider-label">LET&apos;S CONNECT</span>
            <div className="tc-divider-line" />
            <span className="tc-divider-num">12</span>
          </div>
          <div className="tc-contact-layout">
            <div className="tc-contact-top">
              <div className="tc-contact-heading">
                Say <em>hello.</em>
              </div>
              <div>
                <p className="tc-contact-intro">
                  Whether you have a project in mind, want to explore a collaboration,
                  or just want to connect — my inbox is always open.
                </p>
                <div className="tc-contact-cards">
                  {personal.email && (
                    <a href={`mailto:${personal.email}`} className="tc-contact-card">
                      <div className="tc-cc-icon">✉</div>
                      <div className="tc-cc-label">EMAIL</div>
                      <div className="tc-cc-val">{personal.email}</div>
                    </a>
                  )}
                  {personal.phone && (
                    <a href={`tel:${personal.phone}`} className="tc-contact-card">
                      <div className="tc-cc-icon">☎</div>
                      <div className="tc-cc-label">PHONE</div>
                      <div className="tc-cc-val">{personal.phone}</div>
                    </a>
                  )}
                  {personal.location && (
                    <div className="tc-contact-card">
                      <div className="tc-cc-icon">⌖</div>
                      <div className="tc-cc-label">LOCATION</div>
                      <div className="tc-cc-val">{personal.location}</div>
                    </div>
                  )}
                  {personal.websiteUrl && (
                    <a href={personal.websiteUrl} className="tc-contact-card" target="_blank" rel="noopener noreferrer">
                      <div className="tc-cc-icon">↗</div>
                      <div className="tc-cc-label">WEBSITE</div>
                      <div className="tc-cc-val">{personal.websiteUrl}</div>
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="tc-footer-bar">
              <div className="tc-footer-name">{personal.fullName}</div>
              <div className="tc-footer-links">
                {personal.linkedinUrl && (
                  <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                )}
                {personal.githubUrl && (
                  <a href={personal.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
                )}
                {personal.websiteUrl && (
                  <a href={personal.websiteUrl} target="_blank" rel="noopener noreferrer">Website</a>
                )}
              </div>
              <div className="tc-footer-copy">© {new Date().getFullYear()} · Crafted with intention</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
