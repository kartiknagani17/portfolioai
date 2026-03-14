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
      "cv-tagline", "cv-story", "cv-experience", "cv-projects",
      "cv-skills", "cv-education", "cv-certifications", "cv-extras",
      "cv-workstyle", "cv-lookingfor", "cv-contact",
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
      document.querySelectorAll("[data-cv-observe]").forEach((el) => {
        if (el.id) obs.observe(el)
      })
    }, 100)
    return () => obs.disconnect()
  }, [])

  // ── Language bars ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!languages?.length) return
    const el = document.getElementById("cv-lang-section")
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
    const el = document.getElementById("cv-hero-stats")
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
      --cv-chalk: #FEFEFC;
      --cv-chalk2: #F7F5F0;
      --cv-chalk3: #EFECE5;
      --cv-ink: #1A1A18;
      --cv-ink2: #3D3D3A;
      --cv-dim: #9A9590;
      --cv-terra: #C8553D;
      --cv-terra-light: #F2E8E5;
      --cv-cobalt: #2B4EAA;
      --cv-cobalt-light: #E8EDF7;
      --cv-sage: #4A7C59;
      --cv-sage-light: #E8F0EA;
      --cv-border: rgba(26,26,24,0.08);
      --cv-border-med: rgba(26,26,24,0.14);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .cv-root {
      font-family: 'Outfit', sans-serif;
      background: var(--cv-chalk);
      color: var(--cv-ink);
      overflow-x: hidden;
      cursor: none;
    }

    @media (max-width: 768px) {
      .cv-root { cursor: auto; }
      .cv-cursor-dot, .cv-cursor-ring { display: none !important; }
      a, button { cursor: pointer !important; }
    }

    /* Progress */
    .cv-progress {
      position: fixed;
      top: 0; left: 0;
      height: 2px;
      background: var(--cv-terra);
      z-index: 9998;
      transition: width 0.1s linear;
    }

    /* Cursor */
    .cv-cursor-dot {
      position: fixed;
      width: 8px; height: 8px;
      background: var(--cv-terra);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
      mix-blend-mode: multiply;
    }
    .cv-cursor-ring {
      position: fixed;
      width: 36px; height: 36px;
      border: 1.5px solid var(--cv-terra);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 0.5;
      transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
    }

    /* Nav */
    .cv-nav {
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
    .cv-nav.scrolled { border-color: var(--cv-border); }
    .cv-nav-logo {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 20px;
      color: var(--cv-ink);
      letter-spacing: -0.02em;
    }
    .cv-nav-links {
      display: flex;
      gap: 36px;
      list-style: none;
    }
    .cv-nav-links a {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--cv-dim);
      text-decoration: none;
      transition: color 0.2s;
      cursor: none;
    }
    .cv-nav-links a:hover { color: var(--cv-terra); }
    .cv-nav-cta {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--cv-chalk);
      background: var(--cv-ink);
      border: none;
      padding: 10px 22px;
      border-radius: 100px;
      cursor: none;
      transition: background 0.3s, transform 0.2s;
      text-decoration: none;
      display: inline-block;
    }
    .cv-nav-cta:hover { background: var(--cv-terra); transform: scale(1.04); }
    .cv-burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 4px;
    }
    .cv-burger span {
      display: block;
      width: 24px; height: 1.5px;
      background: var(--cv-ink);
      transition: all 0.3s;
    }

    /* Mobile menu */
    .cv-mobile-menu {
      position: fixed;
      inset: 0;
      background: var(--cv-chalk);
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
    .cv-mobile-menu.open { opacity: 1; pointer-events: all; }
    .cv-mobile-menu a {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: clamp(36px, 8vw, 60px);
      color: var(--cv-ink);
      text-decoration: none;
      opacity: 0.3;
      transition: opacity 0.3s, color 0.3s;
      cursor: pointer;
    }
    .cv-mobile-menu a:hover { opacity: 1; color: var(--cv-terra); }

    /* Section divider */
    .cv-divider {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 0 80px;
      margin-bottom: 60px;
    }
    .cv-divider-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.2em;
      color: var(--cv-terra);
      white-space: nowrap;
    }
    .cv-divider-line { flex: 1; height: 1px; background: var(--cv-border); }
    .cv-divider-num {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: var(--cv-dim);
      letter-spacing: 0.1em;
    }

    /* ── HERO ── */
    .cv-hero {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding-top: 80px;
      overflow: hidden;
    }
    .cv-hero-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 80px 60px 80px 80px;
      position: relative;
    }
    .cv-hero-left::before {
      content: attr(data-initial);
      position: absolute;
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: 55vw;
      color: var(--cv-ink);
      opacity: 0.025;
      line-height: 1;
      top: -5%;
      left: -10%;
      pointer-events: none;
      z-index: 0;
    }
    .cv-hero-tag {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.18em;
      color: var(--cv-terra);
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: cv-fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s forwards;
    }
    .cv-hero-tag::before {
      content: '';
      display: block;
      width: 32px; height: 1px;
      background: var(--cv-terra);
    }
    .cv-hero-name {
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: clamp(52px, 6vw, 96px);
      line-height: 0.92;
      letter-spacing: -0.03em;
      color: var(--cv-ink);
      position: relative;
      z-index: 1;
      overflow: hidden;
    }
    .cv-name-line {
      display: block;
      transform: translateY(110%);
      animation: cv-revealUp 1s cubic-bezier(0.22,1,0.36,1) forwards;
    }
    .cv-name-line:nth-child(1) { animation-delay: 0.5s; }
    .cv-name-line:nth-child(2) { animation-delay: 0.65s; }
    .cv-name-italic { font-style: italic; color: var(--cv-terra); }
    .cv-hero-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 300;
      font-size: clamp(15px, 1.8vw, 21px);
      color: var(--cv-ink2);
      margin-top: 28px;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: cv-fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.9s forwards;
      height: 1.5em;
      overflow: hidden;
    }
    .cv-cursor-blink {
      display: inline-block;
      width: 2px; height: 1.1em;
      background: var(--cv-terra);
      margin-left: 2px;
      vertical-align: middle;
      animation: cv-blink 0.8s infinite;
    }
    .cv-hero-bio {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      line-height: 1.75;
      color: var(--cv-dim);
      margin-top: 20px;
      max-width: 420px;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: cv-fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 1.05s forwards;
    }
    .cv-hero-actions {
      display: flex;
      gap: 16px;
      margin-top: 40px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: cv-fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 1.2s forwards;
    }
    .cv-btn-primary {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.1em;
      color: var(--cv-chalk);
      background: var(--cv-ink);
      border: none;
      padding: 14px 28px;
      border-radius: 100px;
      cursor: none;
      transition: background 0.3s, transform 0.25s cubic-bezier(0.22,1,0.36,1);
      text-decoration: none;
      display: inline-block;
    }
    .cv-btn-primary:hover { background: var(--cv-terra); transform: scale(1.05) translateY(-2px); }
    .cv-btn-secondary {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.1em;
      color: var(--cv-ink);
      background: transparent;
      border: 1.5px solid var(--cv-border-med);
      padding: 14px 28px;
      border-radius: 100px;
      cursor: none;
      transition: border-color 0.3s, color 0.3s, transform 0.25s cubic-bezier(0.22,1,0.36,1);
      text-decoration: none;
      display: inline-block;
    }
    .cv-btn-secondary:hover { border-color: var(--cv-cobalt); color: var(--cv-cobalt); transform: scale(1.05) translateY(-2px); }
    .cv-hero-meta {
      display: flex;
      gap: 24px;
      margin-top: 48px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: cv-fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 1.35s forwards;
    }
    .cv-meta-item {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: var(--cv-dim);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cv-meta-item a { color: var(--cv-dim); text-decoration: none; transition: color 0.2s; cursor: none; }
    .cv-meta-item a:hover { color: var(--cv-cobalt); }
    .cv-avail-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--cv-sage);
      animation: cv-pulse 2.2s ease-in-out infinite;
    }
    .cv-hero-right {
      position: relative;
      overflow: hidden;
      background: var(--cv-chalk2);
    }
    .cv-shape-1 {
      position: absolute;
      width: 65%; aspect-ratio: 1;
      border-radius: 50%;
      background: var(--cv-terra-light);
      top: 10%; right: -10%;
      animation: cv-floatA 7s ease-in-out infinite;
    }
    .cv-shape-2 {
      position: absolute;
      width: 45%; aspect-ratio: 1;
      border-radius: 50%;
      background: var(--cv-cobalt-light);
      bottom: 15%; left: 5%;
      animation: cv-floatB 9s ease-in-out infinite;
    }
    .cv-shape-3 {
      position: absolute;
      width: 30%; aspect-ratio: 1;
      background: var(--cv-sage-light);
      top: 50%; left: 40%;
      transform: rotate(45deg);
      animation: cv-floatC 11s ease-in-out infinite;
    }
    .cv-photo-wrap {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }
    .cv-stat-card {
      position: absolute;
      background: var(--cv-chalk);
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 8px 32px rgba(26,26,24,0.1);
      z-index: 3;
      opacity: 0;
      animation: cv-popIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
    }
    .cv-stat-card:nth-child(1) { top: 18%; left: 4%; animation-delay: 1.2s; }
    .cv-stat-card:nth-child(2) { bottom: 22%; right: 4%; animation-delay: 1.5s; }
    .cv-stat-num {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 900;
      color: var(--cv-terra);
      line-height: 1;
    }
    .cv-stat-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.1em;
      color: var(--cv-dim);
      margin-top: 4px;
    }
    .cv-photo-frame {
      width: 65%;
      aspect-ratio: 3/4;
      background: var(--cv-chalk3);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(26,26,24,0.12), 0 8px 32px rgba(26,26,24,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateY(40px);
      animation: cv-revealPhoto 1.2s cubic-bezier(0.22,1,0.36,1) 0.6s forwards;
    }
    .cv-photo-img { width: 100%; height: 100%; object-fit: cover; }
    .cv-photo-initials {
      font-family: 'Playfair Display', serif;
      font-size: 80px;
      font-weight: 900;
      font-style: italic;
      color: rgba(26,26,24,0.08);
      user-select: none;
    }

    /* ── TAGLINE ── */
    .cv-tagline-section {
      padding: 120px 80px;
      background: var(--cv-chalk);
      overflow: hidden;
    }
    .cv-tagline-inner { max-width: 1100px; margin: 0 auto; position: relative; }
    .cv-tagline-bg {
      position: absolute;
      font-family: 'Playfair Display', serif;
      font-size: 30vw;
      font-weight: 900;
      color: var(--cv-ink);
      opacity: 0.02;
      right: -5%; top: -30%;
      line-height: 1;
      pointer-events: none;
      user-select: none;
    }
    .cv-tagline-text {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-weight: 700;
      font-size: clamp(36px, 5vw, 72px);
      line-height: 1.15;
      color: var(--cv-ink);
      letter-spacing: -0.02em;
      position: relative;
      z-index: 1;
    }
    .cv-tq-word {
      display: inline-block;
      opacity: 0;
      transform: translateY(30px) rotate(-2deg);
      transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1);
      margin-right: 0.25em;
    }
    .cv-tq-word.vis { opacity: 1; transform: translateY(0) rotate(0deg); }
    .cv-highlight { color: var(--cv-terra); }

    /* ── STORY ── */
    .cv-story-section {
      padding: 0 80px 120px;
      background: var(--cv-chalk);
    }
    .cv-story-grid {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 80px;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    .cv-story-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(42px, 5vw, 72px);
      font-weight: 900;
      font-style: italic;
      color: var(--cv-ink);
      line-height: 0.95;
      letter-spacing: -0.03em;
    }
    .cv-story-heading em { color: var(--cv-cobalt); font-style: italic; }
    .cv-story-visual {
      margin-top: 40px;
      width: 100%;
      height: 280px;
      background: var(--cv-cobalt-light);
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cv-arc {
      position: absolute;
      width: 80%; height: 80%;
      border: 2px solid var(--cv-cobalt);
      border-radius: 50%;
      opacity: 0.3;
      animation: cv-rotateSlow 20s linear infinite;
    }
    .cv-arc2 {
      position: absolute;
      width: 55%; height: 55%;
      border: 1px solid var(--cv-terra);
      border-radius: 50%;
      opacity: 0.4;
      animation: cv-rotateSlow 14s linear infinite reverse;
    }
    .cv-arc-dot {
      position: absolute;
      width: 12px; height: 12px;
      background: var(--cv-terra);
      border-radius: 50%;
      box-shadow: 0 0 0 8px rgba(200,85,61,0.15);
    }
    .cv-story-para {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(15px, 1.6vw, 18px);
      line-height: 1.85;
      color: var(--cv-ink2);
      margin-bottom: 1.4em;
    }
    .cv-story-para:last-child { margin-bottom: 0; }
    .cv-mask { overflow: hidden; }
    .cv-mask-inner {
      transform: translateY(100%);
      transition: transform 0.9s cubic-bezier(0.22,1,0.36,1);
    }
    .cv-mask-inner.vis { transform: translateY(0); }

    /* ── EXPERIENCE ── */
    .cv-exp-section {
      padding: 120px 80px;
      background: var(--cv-chalk2);
    }
    .cv-exp-layout {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 60px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .cv-exp-list { display: flex; flex-direction: column; gap: 4px; }
    .cv-exp-item {
      padding: 20px 24px;
      border-radius: 12px;
      cursor: none;
      transition: background 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s;
      border: 1.5px solid transparent;
      position: relative;
      overflow: hidden;
    }
    .cv-exp-item::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: var(--cv-terra);
      transform: scaleY(0);
      transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
      transform-origin: bottom;
    }
    .cv-exp-item.active {
      background: var(--cv-chalk);
      border-color: var(--cv-border-med);
      transform: translateX(4px);
    }
    .cv-exp-item.active::before { transform: scaleY(1); }
    .cv-exp-item-year {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.1em;
      color: var(--cv-dim);
      margin-bottom: 6px;
    }
    .cv-exp-item-company {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--cv-ink);
      line-height: 1.2;
    }
    .cv-exp-item-role {
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      color: var(--cv-dim);
      margin-top: 2px;
    }
    .cv-exp-detail { position: relative; }
    .cv-exp-panel { display: none; animation: cv-fadeSlideIn 0.5s cubic-bezier(0.22,1,0.36,1); }
    .cv-exp-panel.active { display: block; }
    .cv-exp-role {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 3.5vw, 52px);
      font-weight: 900;
      font-style: italic;
      color: var(--cv-ink);
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 8px;
    }
    .cv-exp-company {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.12em;
      color: var(--cv-terra);
      margin-bottom: 4px;
    }
    .cv-exp-meta {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--cv-dim);
      margin-bottom: 32px;
      display: flex;
      gap: 24px;
    }
    .cv-exp-desc {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      line-height: 1.8;
      color: var(--cv-ink2);
      max-width: 560px;
    }
    .cv-exp-watermark {
      font-family: 'Playfair Display', serif;
      font-size: clamp(80px, 14vw, 180px);
      font-weight: 900;
      font-style: italic;
      color: var(--cv-ink);
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
    .cv-proj-section {
      padding: 120px 80px;
      background: var(--cv-chalk);
    }
    .cv-proj-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(48px, 6vw, 88px);
      font-weight: 900;
      color: var(--cv-ink);
      letter-spacing: -0.03em;
      line-height: 0.92;
      max-width: 1200px;
      margin: 0 auto 64px;
    }
    .cv-proj-heading em { font-style: italic; color: var(--cv-terra); }
    .cv-proj-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 16px;
    }
    .cv-proj-card {
      background: var(--cv-chalk2);
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
    .cv-proj-card.vis { opacity: 1; transform: translateY(0); }
    .cv-proj-card:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 32px 80px rgba(26,26,24,0.1); border-color: var(--cv-border-med); }
    .cv-proj-large { grid-column: span 7; min-height: 360px; }
    .cv-proj-medium { grid-column: span 5; min-height: 360px; }
    .cv-proj-wide { grid-column: span 12; min-height: 200px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; flex-direction: row; }
    .cv-proj-small { grid-column: span 4; min-height: 260px; }
    .cv-proj-accent-terra { background: var(--cv-terra-light); }
    .cv-proj-accent-cobalt { background: var(--cv-cobalt-light); }
    .cv-proj-accent-sage { background: var(--cv-sage-light); }
    .cv-proj-num {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.15em;
      color: var(--cv-dim);
      margin-bottom: 20px;
    }
    .cv-proj-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(20px, 2.5vw, 32px);
      font-weight: 700;
      font-style: italic;
      color: var(--cv-ink);
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
    }
    .cv-proj-desc {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      line-height: 1.7;
      color: var(--cv-ink2);
      margin-bottom: 20px;
      flex: 1;
    }
    .cv-proj-stack { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
    .cv-proj-chip {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.08em;
      color: var(--cv-ink2);
      background: rgba(26,26,24,0.07);
      padding: 4px 10px;
      border-radius: 100px;
    }
    .cv-proj-links { display: flex; gap: 12px; margin-top: 8px; }
    .cv-proj-link {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.1em;
      color: var(--cv-cobalt);
      text-decoration: none;
      border-bottom: 1px solid var(--cv-cobalt);
      padding-bottom: 1px;
      transition: opacity 0.2s;
      cursor: none;
    }
    .cv-proj-link:hover { opacity: 0.6; }
    .cv-proj-arrow {
      position: absolute;
      top: 28px; right: 28px;
      width: 40px; height: 40px;
      border-radius: 50%;
      background: var(--cv-ink);
      display: flex; align-items: center; justify-content: center;
      transform: scale(0) rotate(-45deg);
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
    }
    .cv-proj-card:hover .cv-proj-arrow { transform: scale(1) rotate(0deg); }

    /* ── SKILLS ── */
    .cv-skills-section {
      padding: 120px 80px;
      background: var(--cv-chalk2);
    }
    .cv-skills-layout {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 80px;
      align-items: start;
    }
    .cv-skills-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(48px, 5.5vw, 80px);
      font-weight: 900;
      color: var(--cv-ink);
      line-height: 0.92;
      letter-spacing: -0.03em;
      position: sticky;
      top: 120px;
    }
    .cv-skills-heading em { font-style: italic; color: var(--cv-cobalt); display: block; }
    .cv-skills-cats { display: flex; flex-direction: column; gap: 40px; }
    .cv-skill-cat-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      color: var(--cv-terra);
      margin-bottom: 16px;
    }
    .cv-skill-chips { display: flex; flex-wrap: wrap; gap: 10px; }
    .cv-skill-pill {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: var(--cv-ink);
      background: var(--cv-chalk);
      border: 1.5px solid var(--cv-border-med);
      padding: 10px 20px;
      border-radius: 100px;
      transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
      opacity: 0;
      transform: scale(0.85);
      cursor: none;
    }
    .cv-skill-pill.vis { opacity: 1; transform: scale(1); }
    .cv-skill-pill:hover { background: var(--cv-ink); color: var(--cv-chalk); border-color: var(--cv-ink); transform: scale(1.05); }

    /* ── EDUCATION ── */
    .cv-edu-section {
      padding: 120px 80px;
      background: var(--cv-chalk);
    }
    .cv-edu-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .cv-edu-card {
      padding: 36px;
      border-radius: 16px;
      background: var(--cv-chalk2);
      border: 1.5px solid var(--cv-border);
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
      opacity: 0;
      transform: translateY(30px);
      position: relative;
      overflow: hidden;
    }
    .cv-edu-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--cv-cobalt);
    }
    .cv-edu-card.vis { opacity: 1; transform: translateY(0); }
    .cv-edu-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(26,26,24,0.08); }
    .cv-edu-year {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: var(--cv-cobalt);
      margin-bottom: 12px;
    }
    .cv-edu-degree {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      font-style: italic;
      color: var(--cv-ink);
      line-height: 1.2;
      margin-bottom: 8px;
    }
    .cv-edu-field { font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--cv-dim); margin-bottom: 4px; }
    .cv-edu-institution { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600; color: var(--cv-ink2); }

    /* ── CERTIFICATIONS ── */
    .cv-cert-section { padding: 0 80px 120px; background: var(--cv-chalk); }
    .cv-cert-list { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 2px; }
    .cv-cert-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 24px;
      align-items: center;
      padding: 22px 28px;
      background: var(--cv-chalk2);
      border-radius: 10px;
      transition: background 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1);
      cursor: none;
      opacity: 0;
      transform: translateX(-20px);
    }
    .cv-cert-row.vis { opacity: 1; transform: translateX(0); }
    .cv-cert-row:hover { background: var(--cv-terra-light); transform: translateX(8px); }
    .cv-cert-name { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 500; color: var(--cv-ink); }
    .cv-cert-issuer { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--cv-dim); letter-spacing: 0.08em; margin-top: 3px; }
    .cv-cert-date { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--cv-terra); letter-spacing: 0.08em; white-space: nowrap; }

    /* ── EXTRAS ── */
    .cv-extras-section { padding: 120px 80px; background: var(--cv-chalk2); }
    .cv-extras-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
    .cv-extras-heading {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      font-style: italic;
      color: var(--cv-ink);
      margin-bottom: 28px;
    }
    .cv-lang-list { display: flex; flex-direction: column; gap: 16px; }
    .cv-lang-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .cv-lang-name { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 500; color: var(--cv-ink); min-width: 90px; }
    .cv-lang-bar-wrap { flex: 1; height: 4px; background: var(--cv-border); border-radius: 100px; overflow: hidden; }
    .cv-lang-bar { height: 100%; background: var(--cv-cobalt); border-radius: 100px; width: 0%; transition: width 1.2s cubic-bezier(0.22,1,0.36,1); }
    .cv-lang-prof { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--cv-dim); letter-spacing: 0.1em; white-space: nowrap; min-width: 90px; text-align: right; }
    .cv-int-cloud { display: flex; flex-wrap: wrap; gap: 12px; }
    .cv-int-tag {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      color: var(--cv-ink2);
      background: var(--cv-chalk);
      border: 1.5px solid var(--cv-border-med);
      padding: 10px 18px;
      border-radius: 100px;
      transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
      cursor: none;
      opacity: 0;
      transform: scale(0.85);
    }
    .cv-int-tag.vis { opacity: 1; transform: scale(1); }
    .cv-int-tag:hover { background: var(--cv-sage); color: var(--cv-chalk); border-color: var(--cv-sage); }

    /* ── WORK STYLE ── */
    .cv-ws-section { padding: 120px 80px; background: var(--cv-chalk); }
    .cv-ws-layout { max-width: 1200px; margin: 0 auto; }
    .cv-ws-top { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 80px; align-items: end; }
    .cv-ws-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(52px, 6vw, 88px);
      font-weight: 900;
      color: var(--cv-ink);
      line-height: 0.92;
      letter-spacing: -0.03em;
    }
    .cv-ws-heading em { font-style: italic; color: var(--cv-sage); }
    .cv-ws-intro { font-family: 'Outfit', sans-serif; font-size: 16px; line-height: 1.8; color: var(--cv-ink2); }
    .cv-ws-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 3px;
    }
    .cv-ws-card {
      background: var(--cv-chalk2);
      padding: 40px 36px;
      position: relative;
      overflow: hidden;
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
      cursor: none;
      opacity: 0;
      transform: translateY(30px);
    }
    .cv-ws-card:first-child { border-radius: 16px 0 0 16px; }
    .cv-ws-card:last-child { border-radius: 0 16px 16px 0; }
    .cv-ws-card.vis { opacity: 1; transform: translateY(0); }
    .cv-ws-card:hover { transform: translateY(-6px); z-index: 1; }
    .cv-ws-card::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 3px;
      background: var(--cv-sage);
      transform: scaleX(0);
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
      transform-origin: left;
    }
    .cv-ws-card:hover::after { transform: scaleX(1); }
    .cv-ws-num { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.15em; color: var(--cv-dim); margin-bottom: 16px; }
    .cv-ws-card-heading { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; font-style: italic; color: var(--cv-ink); margin-bottom: 14px; }
    .cv-ws-card-body { font-family: 'Outfit', sans-serif; font-size: 14px; line-height: 1.75; color: var(--cv-ink2); }

    /* ── LOOKING FOR ── */
    .cv-lf-section {
      padding: 120px 80px;
      background: var(--cv-ink);
      overflow: hidden;
      position: relative;
    }
    .cv-lf-bg {
      position: absolute;
      font-family: 'Playfair Display', serif;
      font-size: 30vw;
      font-weight: 900;
      color: var(--cv-chalk);
      opacity: 0.02;
      bottom: -10%; left: -5%;
      line-height: 1;
      pointer-events: none;
      user-select: none;
      letter-spacing: -0.05em;
    }
    .cv-lf-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
    .cv-lf-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.2em;
      color: var(--cv-terra);
      margin-bottom: 36px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .cv-lf-label::before { content: ''; display: block; width: 24px; height: 1px; background: var(--cv-terra); }
    .cv-lf-statement {
      font-family: 'Playfair Display', serif;
      font-size: clamp(36px, 5vw, 72px);
      font-weight: 900;
      font-style: italic;
      color: var(--cv-chalk);
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 56px;
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 1s ease, transform 1s cubic-bezier(0.22,1,0.36,1);
    }
    .cv-lf-statement.vis { opacity: 1; transform: translateY(0); }
    .cv-lf-cta {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s;
    }
    .cv-lf-cta.vis { opacity: 1; transform: translateY(0); }
    .cv-btn-light {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.1em;
      color: var(--cv-ink);
      background: var(--cv-chalk);
      border: none;
      padding: 16px 32px;
      border-radius: 100px;
      cursor: none;
      transition: background 0.3s, color 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1);
      text-decoration: none;
      display: inline-block;
    }
    .cv-btn-light:hover { background: var(--cv-terra); color: var(--cv-chalk); transform: scale(1.05) translateY(-2px); }
    .cv-btn-ghost {
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
    .cv-btn-ghost:hover { border-color: var(--cv-chalk); color: var(--cv-chalk); transform: scale(1.05) translateY(-2px); }

    /* ── CONTACT ── */
    .cv-contact-section { padding: 120px 80px 80px; background: var(--cv-chalk); }
    .cv-contact-layout { max-width: 1200px; margin: 0 auto; }
    .cv-contact-top { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 80px; align-items: start; }
    .cv-contact-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(52px, 6vw, 88px);
      font-weight: 900;
      color: var(--cv-ink);
      line-height: 0.92;
      letter-spacing: -0.03em;
    }
    .cv-contact-heading em { font-style: italic; color: var(--cv-terra); }
    .cv-contact-intro { font-family: 'Outfit', sans-serif; font-size: 16px; line-height: 1.8; color: var(--cv-ink2); margin-bottom: 36px; }
    .cv-contact-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .cv-contact-card {
      background: var(--cv-chalk2);
      border-radius: 12px;
      padding: 24px;
      border: 1.5px solid transparent;
      transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
      cursor: none;
      text-decoration: none;
      display: block;
    }
    .cv-contact-card:hover { background: var(--cv-chalk); border-color: var(--cv-border-med); transform: translateY(-4px); box-shadow: 0 16px 48px rgba(26,26,24,0.08); }
    .cv-cc-icon { font-size: 18px; margin-bottom: 12px; }
    .cv-cc-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.12em; color: var(--cv-dim); margin-bottom: 6px; }
    .cv-cc-val { font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500; color: var(--cv-ink); word-break: break-all; }
    .cv-footer-bar {
      border-top: 1px solid var(--cv-border);
      padding-top: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .cv-footer-name { font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px; color: var(--cv-ink); }
    .cv-footer-copy { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--cv-dim); }
    .cv-footer-links { display: flex; gap: 24px; }
    .cv-footer-links a { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--cv-dim); text-decoration: none; transition: color 0.2s; cursor: none; }
    .cv-footer-links a:hover { color: var(--cv-terra); }

    /* ── KEYFRAMES ── */
    @keyframes cv-fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes cv-revealUp { to{transform:translateY(0)} }
    @keyframes cv-revealPhoto { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes cv-popIn { from{opacity:0;transform:scale(0.8) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes cv-floatA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,20px) scale(1.03)} }
    @keyframes cv-floatB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(15px,-25px)} }
    @keyframes cv-floatC { 0%,100%{transform:rotate(45deg) translate(0,0)} 50%{transform:rotate(55deg) translate(10px,-15px)} }
    @keyframes cv-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
    @keyframes cv-rotateSlow { to{transform:rotate(360deg)} }
    @keyframes cv-blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes cv-fadeSlideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .cv-nav { padding: 18px 32px; }
      .cv-nav-links { display: none; }
      .cv-burger { display: flex !important; }
      .cv-hero { grid-template-columns: 1fr; }
      .cv-hero-left { padding: 100px 32px 60px; }
      .cv-hero-right { height: 360px; }
      .cv-photo-frame { width: 50%; }
      .cv-story-grid { grid-template-columns: 1fr; gap: 48px; }
      .cv-story-visual { height: 200px; }
      .cv-exp-layout { grid-template-columns: 1fr; }
      .cv-exp-list { flex-direction: row; overflow-x: auto; gap: 8px; padding-bottom: 8px; }
      .cv-exp-item { min-width: 180px; flex-shrink: 0; }
      .cv-exp-watermark { display: none; }
      .cv-skills-layout { grid-template-columns: 1fr; gap: 48px; }
      .cv-skills-heading { position: static; }
      .cv-ws-top { grid-template-columns: 1fr; gap: 32px; }
      .cv-contact-top { grid-template-columns: 1fr; gap: 48px; }
      .cv-extras-grid { grid-template-columns: 1fr; gap: 48px; }
      .cv-divider { padding: 0 32px; }
      .cv-tagline-section, .cv-story-section, .cv-exp-section, .cv-proj-section,
      .cv-skills-section, .cv-edu-section, .cv-cert-section, .cv-extras-section,
      .cv-ws-section, .cv-lf-section, .cv-contact-section { padding-left: 32px; padding-right: 32px; }
    }
    @media (max-width: 768px) {
      .cv-proj-large, .cv-proj-medium, .cv-proj-small { grid-column: span 12; }
      .cv-proj-wide { grid-column: span 12; display: flex; flex-direction: column; }
      .cv-ws-grid { grid-template-columns: 1fr; }
      .cv-ws-card:first-child { border-radius: 16px 16px 0 0; }
      .cv-ws-card:last-child { border-radius: 0 0 16px 16px; }
      .cv-contact-cards { grid-template-columns: 1fr; }
      .cv-footer-bar { flex-direction: column; align-items: flex-start; }
    }
    @media (max-width: 480px) {
      .cv-nav { padding: 16px 20px; }
      .cv-hero-left { padding: 90px 20px 48px; }
      .cv-hero-actions { flex-direction: column; }
      .cv-btn-primary, .cv-btn-secondary { text-align: center; }
      .cv-hero-right { height: 300px; }
      .cv-cert-row { grid-template-columns: 1fr; }
      .cv-lf-cta { flex-direction: column; align-items: flex-start; }
      .cv-tagline-section, .cv-story-section, .cv-exp-section, .cv-proj-section,
      .cv-skills-section, .cv-edu-section, .cv-cert-section, .cv-extras-section,
      .cv-ws-section, .cv-lf-section, .cv-contact-section { padding-left: 20px; padding-right: 20px; }
      .cv-divider { padding: 0 20px; }
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
    <div className="cv-root">
      <style>{css}</style>

      {/* Cursor */}
      <div
        className="cv-cursor-dot"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      <div
        className="cv-cursor-ring"
        style={{ left: ringPos.x, top: ringPos.y }}
      />

      {/* Progress */}
      <div className="cv-progress" style={{ width: `${progress}%` }} />

      {/* ── NAV ── */}
      <nav className={`cv-nav${scrolled ? " scrolled" : ""}`}>
        <div className="cv-nav-logo">{personal.fullName}</div>
        <ul className="cv-nav-links">
          {careerStory && <li><a href="#cv-story">About</a></li>}
          {experience?.length > 0 && <li><a href="#cv-experience">Experience</a></li>}
          {projects?.length > 0 && <li><a href="#cv-projects">Projects</a></li>}
          {skills?.length > 0 && <li><a href="#cv-skills">Skills</a></li>}
          <li><a href="#cv-contact">Contact</a></li>
        </ul>
        {personal.email && (
          <a href={`mailto:${personal.email}`} className="cv-nav-cta">Let&apos;s Talk</a>
        )}
        <button
          className="cv-burger"
          style={{ display: "none" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`cv-mobile-menu${mobileOpen ? " open" : ""}`}>
        {careerStory && <a href="#cv-story" onClick={() => setMobileOpen(false)}>About</a>}
        {experience?.length > 0 && <a href="#cv-experience" onClick={() => setMobileOpen(false)}>Experience</a>}
        {projects?.length > 0 && <a href="#cv-projects" onClick={() => setMobileOpen(false)}>Projects</a>}
        {skills?.length > 0 && <a href="#cv-skills" onClick={() => setMobileOpen(false)}>Skills</a>}
        {education?.length > 0 && <a href="#cv-education" onClick={() => setMobileOpen(false)}>Education</a>}
        <a href="#cv-contact" onClick={() => setMobileOpen(false)}>Contact</a>
      </div>

      {/* ── 01: HERO ── */}
      <section id="cv-hero">
        <div className="cv-hero">
          <div className="cv-hero-left" data-initial={firstNameInitial}>
            <div className="cv-hero-tag">PORTFOLIO · {new Date().getFullYear()}</div>
            <h1 className="cv-hero-name">
              <span className="cv-name-line">{nameParts[0]}</span>
              <span className="cv-name-line">
                <em className="cv-name-italic">{nameParts.slice(1).join(" ")}.</em>
              </span>
            </h1>
            <div className="cv-hero-title">
              {typeText}<span className="cv-cursor-blink" />
            </div>
            {personal.bio && <p className="cv-hero-bio">{personal.bio}</p>}
            <div className="cv-hero-actions">
              {projects?.length > 0 && (
                <a href="#cv-projects" className="cv-btn-primary">View My Work</a>
              )}
              <a href="#cv-contact" className="cv-btn-secondary">Get In Touch</a>
            </div>
            <div className="cv-hero-meta">
              <div className="cv-meta-item">
                <div className="cv-avail-dot" />
                Open to work
              </div>
              {personal.location && (
                <div className="cv-meta-item">{personal.location}</div>
              )}
              {personal.linkedinUrl && (
                <div className="cv-meta-item">
                  <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
              )}
              {personal.githubUrl && (
                <div className="cv-meta-item">
                  <a href={personal.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
              )}
              {personal.websiteUrl && (
                <div className="cv-meta-item">
                  <a href={personal.websiteUrl} target="_blank" rel="noopener noreferrer">Website</a>
                </div>
              )}
            </div>
          </div>

          <div className="cv-hero-right">
            <div className="cv-shape-1" />
            <div className="cv-shape-2" />
            <div className="cv-shape-3" />
            <div className="cv-photo-wrap" id="cv-hero-stats">
              {experience?.length > 0 && (
                <div className="cv-stat-card">
                  <div className="cv-stat-num">{statYears}</div>
                  <div className="cv-stat-label">YEARS EXP.</div>
                </div>
              )}
              {projects?.length > 0 && (
                <div className="cv-stat-card">
                  <div className="cv-stat-num">{statProjects}</div>
                  <div className="cv-stat-label">PROJECTS SHIPPED</div>
                </div>
              )}
              <div className="cv-photo-frame">
                {personal.profilePhotoUrl ? (
                  <img
                    src={personal.profilePhotoUrl}
                    alt={personal.fullName}
                    className="cv-photo-img"
                  />
                ) : (
                  <div className="cv-photo-initials">
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
        <section id="cv-tagline">
          <div className="cv-tagline-section">
            <div className="cv-divider">
              <span className="cv-divider-label">ABOUT</span>
              <div className="cv-divider-line" />
              <span className="cv-divider-num">02</span>
            </div>
            <div className="cv-tagline-inner">
              <div className="cv-tagline-bg">∞</div>
              <div className="cv-tagline-text">
                {tagline.split(" ").map((word, i, arr) => (
                  <span
                    key={i}
                    className={`cv-tq-word${secVis("cv-tagline") ? " vis" : ""}${i >= arr.length - 2 ? " cv-highlight" : ""}`}
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
        <section id="cv-story">
          <div className="cv-story-section">
            <div className="cv-story-grid">
              <div>
                <h2 className="cv-story-heading">
                  The<br /><em>story</em><br />so far.
                </h2>
                <div className="cv-story-visual">
                  <div className="cv-arc" />
                  <div className="cv-arc2" />
                  <div className="cv-arc-dot" />
                </div>
              </div>
              <div>
                {careerStory.split(". ").filter(Boolean).map((sentence, i) => (
                  <div key={i} className="cv-mask">
                    <p
                      className={`cv-story-para cv-mask-inner${secVis("cv-story") ? " vis" : ""}`}
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
        <section id="cv-experience">
          <div className="cv-exp-section">
            <div className="cv-divider">
              <span className="cv-divider-label">EXPERIENCE</span>
              <div className="cv-divider-line" />
              <span className="cv-divider-num">04</span>
            </div>
            <div className="cv-exp-layout">
              <div className="cv-exp-list">
                {experience.map((e, i) => (
                  <div
                    key={i}
                    className={`cv-exp-item${activeExp === i ? " active" : ""}`}
                    onClick={() => setActiveExp(i)}
                  >
                    <div className="cv-exp-item-year">
                      {e.startDate} – {e.isCurrent ? "Present" : e.endDate}
                    </div>
                    <div className="cv-exp-item-company">{e.companyName}</div>
                    <div className="cv-exp-item-role">{e.roleTitle}</div>
                  </div>
                ))}
              </div>
              <div className="cv-exp-detail">
                {experience.map((e, i) => (
                  <div
                    key={i}
                    className={`cv-exp-panel${activeExp === i ? " active" : ""}`}
                  >
                    <div className="cv-exp-role">{e.roleTitle}</div>
                    <div className="cv-exp-company">{e.companyName}</div>
                    <div className="cv-exp-meta">
                      <span>{e.startDate} — {e.isCurrent ? "Present" : e.endDate}</span>
                      {e.location && <span>{e.location}</span>}
                    </div>
                    {e.description && (
                      <div className="cv-exp-desc">{e.description}</div>
                    )}
                  </div>
                ))}
                <div className="cv-exp-watermark">
                  {experience[activeExp]?.companyName}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 05: PROJECTS ── */}
      {projects?.length > 0 && (
        <section id="cv-projects">
          <div className="cv-proj-section">
            <div className="cv-divider">
              <span className="cv-divider-label">SELECTED WORK</span>
              <div className="cv-divider-line" />
              <span className="cv-divider-num">05</span>
            </div>
            <div className="cv-proj-heading">
              Work that <em>moves</em><br />the needle.
            </div>
            <div className="cv-proj-grid">
              {projects.map((p, i) => {
                const sizeClass = `cv-proj-${projSizes[i] ?? "small"}`
                const accentClass = projAccents[i] ? `cv-proj-${projAccents[i]}` : ""
                return (
                  <div
                    key={i}
                    className={`cv-proj-card ${sizeClass} ${accentClass}${secVis("cv-projects") ? " vis" : ""}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="cv-proj-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7,7 17,7 17,17" />
                      </svg>
                    </div>
                    <div className="cv-proj-num">PROJECT {String(i + 1).padStart(2, "0")}</div>
                    <div className="cv-proj-name">{p.projectName}</div>
                    {p.description && (
                      <div className="cv-proj-desc">{p.description}</div>
                    )}
                    <div>
                      <div className="cv-proj-stack">
                        {p.techStack.map((t, j) => (
                          <span key={j} className="cv-proj-chip">{t}</span>
                        ))}
                      </div>
                      <div className="cv-proj-links">
                        {p.liveUrl && (
                          <a href={p.liveUrl} className="cv-proj-link" target="_blank" rel="noopener noreferrer">
                            Live ↗
                          </a>
                        )}
                        {p.githubUrl && (
                          <a href={p.githubUrl} className="cv-proj-link" target="_blank" rel="noopener noreferrer">
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
        <section id="cv-skills">
          <div className="cv-skills-section">
            <div className="cv-divider">
              <span className="cv-divider-label">SKILLS</span>
              <div className="cv-divider-line" />
              <span className="cv-divider-num">06</span>
            </div>
            <div className="cv-skills-layout">
              <div>
                <div className="cv-skills-heading">
                  What<br /><em>I bring</em><br />to the<br />table.
                </div>
              </div>
              <div className="cv-skills-cats">
                {Object.entries(skillsByCategory).map(([cat, items], ci) => (
                  <div key={ci}>
                    <div className="cv-skill-cat-label">{cat.toUpperCase()}</div>
                    <div className="cv-skill-chips">
                      {items.map((name, j) => (
                        <span
                          key={j}
                          className={`cv-skill-pill${secVis("cv-skills") ? " vis" : ""}`}
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
        <section id="cv-education">
          <div className="cv-edu-section">
            <div className="cv-divider">
              <span className="cv-divider-label">EDUCATION</span>
              <div className="cv-divider-line" />
              <span className="cv-divider-num">07</span>
            </div>
            <div className="cv-edu-grid">
              {education.map((e, i) => (
                <div
                  key={i}
                  className={`cv-edu-card${secVis("cv-education") ? " vis" : ""}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {(e.startYear || e.endYear) && (
                    <div className="cv-edu-year">
                      {e.startYear}{e.endYear ? ` – ${e.endYear}` : ""}
                    </div>
                  )}
                  <div className="cv-edu-degree">
                    {e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}
                  </div>
                  <div className="cv-edu-institution">{e.institution}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 08: CERTIFICATIONS ── */}
      {certifications?.length > 0 && (
        <section id="cv-certifications">
          <div className="cv-cert-section">
            <div className="cv-divider">
              <span className="cv-divider-label">CERTIFICATIONS</span>
              <div className="cv-divider-line" />
              <span className="cv-divider-num">08</span>
            </div>
            <div className="cv-cert-list">
              {certifications.map((c, i) => (
                <div
                  key={i}
                  className={`cv-cert-row${secVis("cv-certifications") ? " vis" : ""}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div>
                    <div className="cv-cert-name">{c.name}</div>
                    {c.issuer && <div className="cv-cert-issuer">{c.issuer}</div>}
                  </div>
                  {c.date && <div className="cv-cert-date">{c.date}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 09: LANGUAGES & INTERESTS ── */}
      {(languages?.length > 0 || interests?.length > 0) && (
        <section id="cv-extras">
          <div className="cv-extras-section">
            <div className="cv-divider">
              <span className="cv-divider-label">MORE ABOUT ME</span>
              <div className="cv-divider-line" />
              <span className="cv-divider-num">09</span>
            </div>
            <div className="cv-extras-grid">
              {languages?.length > 0 && (
                <div id="cv-lang-section">
                  <div className="cv-extras-heading">Languages</div>
                  <div className="cv-lang-list">
                    {languages.map((l, i) => (
                      <div key={i} className="cv-lang-row">
                        <div className="cv-lang-name">{l.language}</div>
                        <div className="cv-lang-bar-wrap">
                          <div
                            className="cv-lang-bar"
                            style={{
                              width: langBarsVis
                                ? `${profMap[l.proficiency] ?? 50}%`
                                : "0%",
                              transitionDelay: `${i * 150}ms`,
                            }}
                          />
                        </div>
                        <div className="cv-lang-prof">{l.proficiency}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {interests?.length > 0 && (
                <div>
                  <div className="cv-extras-heading">Interests</div>
                  <div className="cv-int-cloud">
                    {interests.map((t, i) => (
                      <div
                        key={i}
                        className={`cv-int-tag${secVis("cv-extras") ? " vis" : ""}`}
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
        <section id="cv-workstyle">
          <div className="cv-ws-section">
            <div className="cv-divider">
              <span className="cv-divider-label">HOW I WORK</span>
              <div className="cv-divider-line" />
              <span className="cv-divider-num">10</span>
            </div>
            <div className="cv-ws-layout">
              <div className="cv-ws-top">
                <div className="cv-ws-heading">
                  How I<br /><em>think</em> &<br />operate.
                </div>
                {workStyle && (
                  <div className="cv-ws-intro">{workStyle}</div>
                )}
              </div>
              {workPrinciples?.length > 0 && (
                <div className="cv-ws-grid">
                  {workPrinciples.map((p, i) => (
                    <div
                      key={i}
                      className={`cv-ws-card${secVis("cv-workstyle") ? " vis" : ""}`}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className="cv-ws-num">0{i + 1}</div>
                      <div className="cv-ws-card-heading">{p.heading}</div>
                      <div className="cv-ws-card-body">{p.body}</div>
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
        <section id="cv-lookingfor">
          <div className="cv-lf-section">
            <div className="cv-lf-bg">NEXT</div>
            <div className="cv-lf-inner">
              <div className="cv-lf-label">WHAT&apos;S NEXT</div>
              <div className={`cv-lf-statement${secVis("cv-lookingfor") ? " vis" : ""}`}>
                {lookingFor}
              </div>
              <div className={`cv-lf-cta${secVis("cv-lookingfor") ? " vis" : ""}`}>
                {personal.email && (
                  <a href={`mailto:${personal.email}`} className="cv-btn-light">
                    Send a message
                  </a>
                )}
                <a href="#cv-contact" className="cv-btn-ghost">
                  See contact details
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 12: CONTACT ── */}
      <section id="cv-contact">
        <div className="cv-contact-section">
          <div className="cv-divider">
            <span className="cv-divider-label">LET&apos;S CONNECT</span>
            <div className="cv-divider-line" />
            <span className="cv-divider-num">12</span>
          </div>
          <div className="cv-contact-layout">
            <div className="cv-contact-top">
              <div className="cv-contact-heading">
                Say <em>hello.</em>
              </div>
              <div>
                <p className="cv-contact-intro">
                  Whether you have a project in mind, want to explore a collaboration,
                  or just want to connect — my inbox is always open.
                </p>
                <div className="cv-contact-cards">
                  {personal.email && (
                    <a href={`mailto:${personal.email}`} className="cv-contact-card">
                      <div className="cv-cc-icon">✉</div>
                      <div className="cv-cc-label">EMAIL</div>
                      <div className="cv-cc-val">{personal.email}</div>
                    </a>
                  )}
                  {personal.phone && (
                    <a href={`tel:${personal.phone}`} className="cv-contact-card">
                      <div className="cv-cc-icon">☎</div>
                      <div className="cv-cc-label">PHONE</div>
                      <div className="cv-cc-val">{personal.phone}</div>
                    </a>
                  )}
                  {personal.location && (
                    <div className="cv-contact-card">
                      <div className="cv-cc-icon">⌖</div>
                      <div className="cv-cc-label">LOCATION</div>
                      <div className="cv-cc-val">{personal.location}</div>
                    </div>
                  )}
                  {personal.websiteUrl && (
                    <a href={personal.websiteUrl} className="cv-contact-card" target="_blank" rel="noopener noreferrer">
                      <div className="cv-cc-icon">↗</div>
                      <div className="cv-cc-label">WEBSITE</div>
                      <div className="cv-cc-val">{personal.websiteUrl}</div>
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="cv-footer-bar">
              <div className="cv-footer-name">{personal.fullName}</div>
              <div className="cv-footer-links">
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
              <div className="cv-footer-copy">© {new Date().getFullYear()} · Crafted with intention</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
