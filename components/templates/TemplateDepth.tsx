"use client"

import { useEffect, useState } from "react"
import type { PortfolioData } from "@/types/portfolio"

export default function TemplateDepth({ portfolioData }: { portfolioData: PortfolioData }) {
  const {
    personal, experience, projects, skills, education,
    certifications, languages, interests,
    tagline, careerStory, workStyle, lookingFor,
  } = portfolioData

  const [scrollY, setScrollY]   = useState(0)
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [activeExp, setActiveExp] = useState(0)
  const [visible, setVisible]   = useState<Set<string>>(new Set())

  // ── Derived ──────────────────────────────────────────────────────────────────
  const nameParts   = personal.fullName.trim().split(" ")
  const firstName   = nameParts.slice(0, -1).join(" ") || nameParts[0]
  const lastName    = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
  const initials    = nameParts.map(w => w[0]).slice(0, 2).join("")
  const currentRole = experience.find(e => e.isCurrent) || experience[0] || null

  const yearsExp = experience.length > 0 ? (() => {
    const earliest = experience.reduce((min, e) => {
      const y = parseInt(e.startDate.split("-")[0])
      return y < min ? y : min
    }, 9999)
    return Math.max(1, new Date().getFullYear() - earliest)
  })() : 0

  const skillGroups = skills.reduce<Record<string, string[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s.name)
    return acc
  }, {})

  const principles = (() => {
    if (!workStyle) return []
    const sentences = workStyle.split(/(?<=[.!?])\s+/).filter(Boolean)
    return sentences.slice(0, 4).map((s, i) => ({ num: String(i + 1).padStart(2, "0"), text: s }))
  })()

  const profToPercent = (prof: string) => {
    const p = prof.toLowerCase()
    if (p.includes("native") || p.includes("fluent"))         return 100
    if (p.includes("professional") || p.includes("advanced")) return 82
    if (p.includes("upper"))                                   return 66
    if (p.includes("intermediate"))                            return 52
    if (p.includes("conversational") || p.includes("basic"))  return 36
    return 20
  }

  const vis = (id: string) => visible.has(id)

  // ── Scroll ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const sy  = window.scrollY
      const max = document.body.scrollHeight - window.innerHeight
      setScrollY(sy)
      setProgress(max > 0 ? (sy / max) * 100 : 0)
      setScrolled(sy > 80)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ── IntersectionObserver ──────────────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = e.target.getAttribute("data-reveal")
            if (id) setVisible(prev => new Set([...prev, id]))
          }
        })
      },
      { threshold: 0.14 }
    )
    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,300;1,9..144,400;1,9..144,600;1,9..144,700;1,9..144,900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Fragment+Mono:ital@0;1&display=swap');

        .td-root *, .td-root *::before, .td-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .td-root {
          --td-linen:  #F8F4EE;
          --td-linen2: #F0EAE0;
          --td-linen3: #E6DDD0;
          --td-ink:    #1A1410;
          --td-ink2:   #3D3530;
          --td-dim:    #8A8078;
          --td-burg:   #7B1C2E;
          --td-blight: rgba(123,28,46,0.08);
          --td-bmid:   rgba(123,28,46,0.18);
          --td-gold:   #C9A84C;
          --td-glight: rgba(201,168,76,0.12);
          --td-border:  rgba(26,20,16,0.09);
          --td-border2: rgba(26,20,16,0.16);
          --td-ease:   cubic-bezier(0.16,1,0.3,1);
          --td-spring: cubic-bezier(0.34,1.56,0.64,1);
          background: var(--td-linen);
          color: var(--td-ink);
          font-family: 'DM Sans', sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* ── NAV ──────────────────────────────────────────────────────────── */
        .td-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 68px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 52px;
          transition: background 0.4s var(--td-ease), box-shadow 0.4s var(--td-ease);
        }
        .td-nav.td-scrolled {
          background: rgba(248,244,238,0.93);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 var(--td-border);
        }
        .td-nav-brand {
          font-family: 'Fraunces', serif; font-size: 22px; font-weight: 800;
          font-style: italic; color: var(--td-ink); text-decoration: none;
          letter-spacing: -0.02em;
        }
        .td-nav-links { display: flex; gap: 28px; list-style: none; }
        .td-nav-link {
          font-size: 12px; font-weight: 500; color: var(--td-dim);
          text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase;
          transition: color 0.2s; position: relative;
        }
        .td-nav-link::after {
          content: ''; position: absolute; bottom: -3px; left: 0;
          width: 0; height: 1px; background: var(--td-burg);
          transition: width 0.3s var(--td-ease);
        }
        .td-nav-link:hover { color: var(--td-burg); }
        .td-nav-link:hover::after { width: 100%; }

        /* ── HERO ─────────────────────────────────────────────────────────── */
        .td-hero {
          min-height: 100vh; display: flex; flex-direction: column;
          padding: 0 52px; position: relative; z-index: 1; overflow: hidden;
        }

        /* top portion — name + floating card */
        .td-hero-top {
          flex: 1; display: flex; flex-direction: column;
          justify-content: flex-end;
          padding-top: 96px; padding-bottom: 44px; position: relative;
        }
        .td-hero-tag {
          font-family: 'Fragment Mono', monospace; font-size: 11px;
          color: var(--td-gold); letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 24px; opacity: 0; transform: translateY(10px);
          animation: tdUp 0.7s var(--td-ease) 0.15s forwards;
        }

        /* staircase name */
        .td-hero-firstname {
          display: block; font-family: 'Fraunces', serif;
          font-size: clamp(4rem, 8.5vw, 9.5rem); font-weight: 700;
          line-height: 1.0; letter-spacing: -0.04em; color: var(--td-ink);
          opacity: 0; transform: translateX(-28px);
          animation: tdSlideR 0.9s var(--td-ease) 0.2s forwards;
        }
        .td-hero-lastname {
          display: block; font-family: 'Fraunces', serif;
          font-size: clamp(4.5rem, 10vw, 11.5rem); font-weight: 900;
          font-style: italic; line-height: 0.95; letter-spacing: -0.04em;
          color: var(--td-burg);
          padding-left: clamp(72px, 11vw, 180px);
          opacity: 0; transform: translateX(28px);
          animation: tdSlideL 0.9s var(--td-ease) 0.32s forwards;
        }

        /* floating current-role card */
        .td-hero-card {
          position: absolute; top: 80px; right: 0;
          width: 240px; background: white;
          border: 1px solid var(--td-border); border-radius: 16px;
          padding: 20px 22px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.07);
          opacity: 0; animation: tdFadeIn 0.9s var(--td-ease) 0.65s forwards;
        }
        .td-card-eyebrow {
          font-family: 'Fragment Mono', monospace; font-size: 10px;
          color: var(--td-dim); letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .td-card-company {
          font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 700;
          color: var(--td-ink); line-height: 1.2; margin-bottom: 3px;
        }
        .td-card-role { font-size: 12px; color: var(--td-ink2); margin-bottom: 16px; }
        .td-card-active {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Fragment Mono', monospace; font-size: 10px;
          color: var(--td-burg); letter-spacing: 0.06em;
        }
        .td-card-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--td-burg);
          animation: tdPulse 2s ease-in-out infinite;
        }

        /* decorative rings */
        .td-hero-ring {
          position: absolute; border-radius: 50%; pointer-events: none;
          border: 1.5px solid rgba(123,28,46,0.1);
          top: 20px; right: 260px;
          width: 300px; height: 300px;
          animation: tdSpin 32s linear infinite;
        }
        .td-hero-ring-sm {
          position: absolute; border-radius: 50%; pointer-events: none;
          border: 1px solid rgba(201,168,76,0.22);
          bottom: 80px; right: 80px;
          width: 80px; height: 80px;
          animation: tdSpin 18s linear infinite reverse;
        }
        .td-hero-blob {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 160px; height: 160px;
          background: var(--td-glight);
          filter: blur(40px);
          top: 40px; right: 100px;
          animation: tdOrbDrift 18s ease-in-out infinite alternate;
        }

        /* bottom strip: bio + links */
        .td-hero-bottom {
          border-top: 1px solid var(--td-border);
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 52px; padding-top: 32px;
        }
        .td-hero-meta {
          opacity: 0; animation: tdUp 0.8s var(--td-ease) 0.5s forwards;
        }
        .td-hero-title {
          font-size: 15px; font-weight: 500; color: var(--td-ink2); margin-bottom: 5px;
        }
        .td-hero-loc {
          font-family: 'Fragment Mono', monospace; font-size: 11px;
          color: var(--td-dim); letter-spacing: 0.04em; margin-bottom: 18px;
        }
        .td-hero-loc em { font-style: normal; color: var(--td-burg); }
        .td-hero-bio {
          font-size: 14px; line-height: 1.78; color: var(--td-ink2);
          border-left: 2px solid var(--td-gold); padding-left: 14px;
          margin-bottom: 22px;
        }
        .td-hero-links { display: flex; gap: 14px; flex-wrap: wrap; }
        .td-hero-link {
          font-family: 'Fragment Mono', monospace; font-size: 12px;
          color: var(--td-burg); text-decoration: none; letter-spacing: 0.04em;
          padding-bottom: 2px; border-bottom: 1px solid transparent;
          display: flex; align-items: center; gap: 5px;
          transition: border-color 0.25s, gap 0.22s var(--td-spring);
        }
        .td-hero-link:hover { border-color: var(--td-burg); gap: 9px; }

        /* full-width stats bar at very bottom */
        .td-hero-stats-bar {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--td-border);
          opacity: 0; animation: tdFadeIn 0.9s var(--td-ease) 0.78s forwards;
        }
        .td-stat-item {
          padding: 24px 0 32px; text-align: center;
          border-right: 1px solid var(--td-border);
          transition: background 0.2s;
        }
        .td-stat-item:last-child { border-right: none; }
        .td-stat-item:hover { background: var(--td-linen2); }
        .td-stat-num {
          font-family: 'Fraunces', serif; font-size: 2.2rem; font-weight: 700;
          color: var(--td-burg); line-height: 1; margin-bottom: 6px;
        }
        .td-stat-label {
          font-family: 'Fragment Mono', monospace; font-size: 10px;
          color: var(--td-dim); letter-spacing: 0.1em; text-transform: uppercase;
        }

        /* ── SECTION COMMONS ──────────────────────────────────────────────── */
        .td-section { padding: 96px 52px; position: relative; z-index: 1; }
        .td-inner   { max-width: 1100px; margin: 0 auto; }
        .td-label {
          font-family: 'Fragment Mono', monospace; font-size: 11px;
          color: var(--td-gold); letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 10px; display: flex; align-items: center; gap: 12px;
        }
        .td-label::before { content: ''; width: 24px; height: 1px; background: var(--td-gold); }
        .td-heading {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 3.8vw, 3.4rem); font-weight: 700;
          line-height: 1.1; letter-spacing: -0.02em; color: var(--td-ink);
          margin-bottom: 48px;
        }
        .td-heading em { font-style: italic; color: var(--td-burg); }
        .td-rule { width: 100%; height: 1px; background: linear-gradient(90deg, var(--td-border2), transparent); position: relative; z-index: 1; }
        .td-r { opacity: 0; transform: translateY(22px); transition: opacity 0.72s var(--td-ease), transform 0.72s var(--td-ease); }
        .td-r.td-v { opacity: 1; transform: none; }

        /* ── TAGLINE BAND ─────────────────────────────────────────────────── */
        .td-tagline-band {
          background: var(--td-ink); padding: 72px 52px;
          position: relative; z-index: 1; overflow: hidden;
        }
        .td-tagline-wm {
          position: absolute; right: -8px; bottom: -36px;
          font-family: 'Fraunces', serif; font-size: 260px;
          font-weight: 900; font-style: italic;
          color: rgba(255,255,255,0.025); user-select: none; line-height: 1;
          pointer-events: none;
        }

        /* ── CAREER STORY ─────────────────────────────────────────────────── */
        .td-story-grid { display: grid; grid-template-columns: 256px 1fr; gap: 72px; align-items: start; }
        .td-story-aside { position: sticky; top: 100px; }
        .td-story-aside-name {
          font-family: 'Fraunces', serif; font-size: 2.2rem;
          font-weight: 800; font-style: italic; color: var(--td-burg);
          line-height: 1.1; margin-bottom: 12px;
        }
        .td-story-aside-line { width: 36px; height: 2px; background: var(--td-gold); margin: 14px 0; }
        .td-story-aside-role {
          font-family: 'Fragment Mono', monospace; font-size: 11px;
          color: var(--td-dim); letter-spacing: 0.06em; line-height: 1.7;
        }

        /* ── EXPERIENCE ───────────────────────────────────────────────────── */
        .td-exp-wrap { display: grid; grid-template-columns: 236px 1fr; border: 1px solid var(--td-border); border-radius: 16px; overflow: hidden; }
        .td-exp-sidebar { background: var(--td-linen2); border-right: 1px solid var(--td-border); padding: 8px; }
        .td-exp-item { padding: 14px 18px; border-radius: 10px; cursor: pointer; border: 1px solid transparent; transition: all 0.25s var(--td-ease); }
        .td-exp-item:hover { background: var(--td-linen3); }
        .td-exp-item.td-ea { background: white; border-color: var(--td-border); box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .td-exp-co { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: var(--td-ink); margin-bottom: 2px; }
        .td-exp-item.td-ea .td-exp-co { color: var(--td-burg); }
        .td-exp-dt { font-family: 'Fragment Mono', monospace; font-size: 10px; color: var(--td-dim); letter-spacing: 0.04em; }
        .td-exp-panel { position: relative; min-height: 288px; overflow: hidden; }
        .td-exp-pane { position: absolute; top: 0; left: 0; right: 0; bottom: 0; padding: 36px 44px; opacity: 0; transform: translateX(22px); transition: opacity 0.35s var(--td-ease), transform 0.35s var(--td-ease); pointer-events: none; }
        .td-exp-pane.td-ep { opacity: 1; transform: none; pointer-events: auto; position: relative; }
        .td-exp-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--td-blight); color: var(--td-burg); font-family: 'Fragment Mono', monospace; font-size: 10px; letter-spacing: 0.07em; padding: 4px 10px; border-radius: 100px; margin-bottom: 16px; }
        .td-exp-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--td-burg); animation: tdPulse 2s ease-in-out infinite; }
        .td-exp-role { font-family: 'Fraunces', serif; font-size: 1.55rem; font-weight: 700; letter-spacing: -0.01em; color: var(--td-ink); margin-bottom: 4px; }
        .td-exp-co2 { font-family: 'Fragment Mono', monospace; font-size: 12px; color: var(--td-burg); letter-spacing: 0.05em; margin-bottom: 4px; }
        .td-exp-meta { font-family: 'Fragment Mono', monospace; font-size: 11px; color: var(--td-dim); display: flex; gap: 16px; margin-bottom: 22px; }
        .td-exp-desc { font-size: 14px; line-height: 1.78; color: var(--td-ink2); }

        /* ── PROJECTS ─────────────────────────────────────────────────────── */
        .td-proj-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
        .td-proj-card { background: white; border: 1px solid var(--td-border); border-radius: 16px; padding: 28px; opacity: 0; transform: translateY(20px); transition: opacity 0.6s var(--td-ease), transform 0.6s var(--td-ease), translate 0.32s var(--td-ease), box-shadow 0.32s, border-color 0.25s; position: relative; overflow: hidden; }
        .td-proj-card.td-cv { opacity: 1; transform: none; }
        .td-proj-card:hover { translate: 0 -6px; box-shadow: 0 18px 50px rgba(123,28,46,0.10); border-color: var(--td-bmid); }
        .td-proj-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--td-burg), var(--td-gold)); transform: scaleX(0); transform-origin: left; transition: transform 0.4s var(--td-ease); }
        .td-proj-card:hover::before { transform: scaleX(1); }
        .td-proj-num  { font-family: 'Fragment Mono', monospace; font-size: 11px; color: var(--td-gold); letter-spacing: 0.1em; margin-bottom: 10px; }
        .td-proj-name { font-family: 'Fraunces', serif; font-size: 1.25rem; font-weight: 700; color: var(--td-ink); margin-bottom: 8px; letter-spacing: -0.01em; line-height: 1.2; }
        .td-proj-desc { font-size: 13px; line-height: 1.72; color: var(--td-dim); margin-bottom: 16px; }
        .td-proj-tech { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
        .td-tech      { font-family: 'Fragment Mono', monospace; font-size: 10px; padding: 3px 9px; background: var(--td-linen2); color: var(--td-ink2); border-radius: 100px; border: 1px solid var(--td-border); letter-spacing: 0.04em; }
        .td-proj-links { display: flex; gap: 14px; }
        .td-proj-link  { font-family: 'Fragment Mono', monospace; font-size: 11px; color: var(--td-burg); text-decoration: none; letter-spacing: 0.04em; transition: opacity 0.2s; display: flex; align-items: center; gap: 3px; }
        .td-proj-link:hover { opacity: 0.65; }

        /* ── WORK STYLE ───────────────────────────────────────────────────── */
        .td-prin-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
        .td-prin-card { padding: 32px; border: 1px solid var(--td-border); border-radius: 16px; background: white; opacity: 0; transition: opacity 0.65s var(--td-ease), transform 0.65s var(--td-ease), box-shadow 0.3s; }
        .td-prin-card:nth-child(odd)  { transform: translateX(-20px); }
        .td-prin-card:nth-child(even) { transform: translateX(20px); }
        .td-prin-card.td-pv { opacity: 1; transform: none; }
        .td-prin-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.07); }
        .td-prin-num  { font-family: 'Fraunces', serif; font-size: 2.8rem; font-weight: 900; font-style: italic; color: var(--td-gold); opacity: 0.35; line-height: 1; margin-bottom: 10px; }
        .td-prin-text { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 500; color: var(--td-ink); line-height: 1.5; letter-spacing: -0.01em; }

        /* ── SKILLS ───────────────────────────────────────────────────────── */
        .td-skills-bg { background: var(--td-linen2); }
        .td-skill-group { margin-bottom: 36px; }
        .td-skill-group:last-child { margin-bottom: 0; }
        .td-skill-cat { font-family: 'Fragment Mono', monospace; font-size: 11px; color: var(--td-dim); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
        .td-skill-cat::after { content: ''; flex: 1; height: 1px; background: var(--td-border2); }
        .td-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .td-pill { font-size: 13px; font-weight: 500; padding: 8px 18px; background: white; color: var(--td-ink2); border: 1px solid var(--td-border); border-radius: 100px; cursor: default; opacity: 0; transform: scale(0.88) translateY(8px); transition: opacity 0.4s var(--td-ease), transform 0.4s var(--td-ease), background 0.2s, color 0.2s, border-color 0.2s; }
        .td-pill.td-pvis { opacity: 1; transform: none; }
        .td-pill:hover { background: var(--td-burg); color: white; border-color: var(--td-burg); }

        /* ── LANGUAGES ────────────────────────────────────────────────────── */
        .td-lang-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 28px 56px; }
        .td-lang-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
        .td-lang-name { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; color: var(--td-ink); letter-spacing: -0.01em; }
        .td-lang-prof { font-family: 'Fragment Mono', monospace; font-size: 10px; color: var(--td-dim); letter-spacing: 0.06em; text-transform: uppercase; }
        .td-lang-track { height: 4px; background: var(--td-linen3); border-radius: 100px; overflow: hidden; }
        .td-lang-fill  { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--td-burg), var(--td-gold)); width: 0%; transition: width 1.3s cubic-bezier(0.16,1,0.3,1); }

        /* ── INTERESTS ────────────────────────────────────────────────────── */
        .td-interests-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
        .td-interest-pill {
          font-size: 14px; font-weight: 500; padding: 10px 22px;
          background: white; border: 1.5px solid var(--td-border2);
          border-radius: 100px; color: var(--td-ink2); cursor: default;
          opacity: 0; transform: translateY(10px) scale(0.92);
          transition: opacity 0.4s var(--td-ease), transform 0.4s var(--td-ease),
                      background 0.2s, color 0.2s, border-color 0.2s;
        }
        .td-interest-pill.td-ipvis { opacity: 1; transform: none; }
        .td-interest-pill:hover { background: var(--td-blight); border-color: var(--td-bmid); color: var(--td-burg); }

        /* ── EDUCATION ────────────────────────────────────────────────────── */
        .td-edu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px,1fr)); gap: 18px; }
        .td-edu-card { background: white; border: 1px solid var(--td-border); border-radius: 16px; padding: 28px; opacity: 0; transform: translateY(18px); transition: opacity 0.6s var(--td-ease), transform 0.6s var(--td-ease), box-shadow 0.3s; }
        .td-edu-card.td-ev { opacity: 1; transform: none; }
        .td-edu-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .td-edu-seal { width: 44px; height: 44px; border-radius: 50%; background: var(--td-blight); border: 2px solid var(--td-bmid); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 16px; font-weight: 900; font-style: italic; color: var(--td-burg); margin-bottom: 18px; }
        .td-edu-degree { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 700; color: var(--td-ink); margin-bottom: 3px; line-height: 1.3; }
        .td-edu-field  { font-size: 13px; color: var(--td-ink2); margin-bottom: 8px; }
        .td-edu-inst   { font-family: 'Fragment Mono', monospace; font-size: 11px; color: var(--td-burg); letter-spacing: 0.04em; margin-bottom: 3px; }
        .td-edu-years  { font-family: 'Fragment Mono', monospace; font-size: 10px; color: var(--td-dim); letter-spacing: 0.04em; }

        /* ── LOOKING FOR ──────────────────────────────────────────────────── */
        .td-lf { background: white; border-top: 1px solid var(--td-border); padding: 96px 52px; position: relative; z-index: 1; }
        .td-lf-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        .td-lf-heading { font-family: 'Fraunces', serif; font-size: clamp(2rem,3.5vw,3rem); font-weight: 700; font-style: italic; line-height: 1.2; letter-spacing: -0.02em; color: var(--td-ink); margin-bottom: 16px; }
        .td-lf-text { font-size: 16px; line-height: 1.8; color: var(--td-ink2); margin-bottom: 28px; }
        .td-shimmer-wrap { position: relative; overflow: hidden; }
        .td-shimmer-bar  { position: absolute; top: 0; bottom: 0; width: 80px; background: linear-gradient(90deg,transparent,rgba(201,168,76,0.14),transparent); animation: tdShimmer 3.2s ease-in-out infinite; pointer-events: none; z-index: 1; }
        .td-lf-cta { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; background: var(--td-burg); color: white; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; border-radius: 100px; text-decoration: none; transition: transform 0.3s var(--td-spring), box-shadow 0.3s var(--td-ease); }
        .td-lf-cta:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(123,28,46,0.28); }
        .td-lf-rings { display: flex; align-items: center; justify-content: center; }
        .td-ring { border-radius: 50%; border: 1.5px solid var(--td-border2); display: flex; align-items: center; justify-content: center; position: relative; }
        .td-ring-1 { width: 260px; height: 260px; animation: tdSpin 28s linear infinite; }
        .td-ring-2 { width: 180px; height: 180px; border-color: var(--td-bmid); animation: tdSpin 18s linear infinite reverse; }
        .td-ring-3 { width: 80px; height: 80px; background: var(--td-burg); border: none; }
        .td-ring-dot  { width: 7px; height: 7px; border-radius: 50%; background: var(--td-gold); position: absolute; top: -3.5px; left: 50%; transform: translateX(-50%); }
        .td-ring-dot2 { width: 5px; height: 5px; border-radius: 50%; background: var(--td-burg); position: absolute; top: -2.5px; left: 50%; transform: translateX(-50%); }
        .td-ring-label { font-family: 'Fraunces', serif; font-size: 13px; font-weight: 700; font-style: italic; color: white; text-align: center; line-height: 1.2; }

        /* ── CONTACT ──────────────────────────────────────────────────────── */
        .td-contact { background: var(--td-ink); padding: 96px 52px; position: relative; z-index: 1; }
        .td-contact-inner { max-width: 1100px; margin: 0 auto; }
        .td-contact-h { font-family: 'Fraunces', serif; font-size: clamp(2.5rem,5vw,5rem); font-weight: 800; font-style: italic; color: var(--td-linen); line-height: 1.0; letter-spacing: -0.03em; margin-bottom: 44px; }
        .td-contact-h span { color: var(--td-gold); }
        .td-contact-links { display: flex; flex-wrap: wrap; gap: 28px; }
        .td-contact-link { font-family: 'Fragment Mono', monospace; font-size: 12px; letter-spacing: 0.05em; color: rgba(248,244,238,0.45); text-decoration: none; display: flex; align-items: center; gap: 7px; padding-bottom: 3px; border-bottom: 1px solid rgba(248,244,238,0.12); transition: color 0.25s, border-color 0.25s; }
        .td-contact-link:hover { color: var(--td-gold); border-color: var(--td-gold); }
        .td-contact-foot { margin-top: 72px; padding-top: 28px; border-top: 1px solid rgba(248,244,238,0.07); display: flex; justify-content: space-between; align-items: center; }
        .td-contact-copy { font-family: 'Fragment Mono', monospace; font-size: 11px; color: rgba(248,244,238,0.18); letter-spacing: 0.06em; }

        /* ── KEYFRAMES ────────────────────────────────────────────────────── */
        @keyframes tdUp        { to { opacity: 1; transform: none; } }
        @keyframes tdFadeIn    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tdSlideR    { to { opacity: 1; transform: translateX(0); } }
        @keyframes tdSlideL    { to { opacity: 1; transform: translateX(0); } }
        @keyframes tdSpin      { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes tdPulse     { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.35; transform:scale(0.6); } }
        @keyframes tdShimmer   { 0% { left: -80px; } 100% { left: calc(100% + 80px); } }
        @keyframes tdOrbDrift  { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(20px, 30px) scale(1.1); } }

        /* ── RESPONSIVE ───────────────────────────────────────────────────── */
        @media (max-width: 960px) {
          .td-nav { padding: 0 28px; }
          .td-hero { padding: 0 32px; }
          .td-hero-card { display: none; }
          .td-hero-ring { display: none; }
          .td-hero-ring-sm { display: none; }
          .td-hero-bottom { grid-template-columns: 1fr; gap: 0; }
          .td-hero-stats-bar { grid-template-columns: repeat(2,1fr); }
          .td-story-grid { grid-template-columns: 1fr; gap: 32px; }
          .td-story-aside { position: static; }
          .td-exp-wrap { grid-template-columns: 1fr; }
          .td-exp-sidebar { border-right: none; border-bottom: 1px solid var(--td-border); display: flex; flex-wrap: wrap; gap: 4px; padding: 8px; }
          .td-proj-grid { grid-template-columns: 1fr; }
          .td-prin-grid { grid-template-columns: 1fr; }
          .td-lang-grid { grid-template-columns: 1fr; }
          .td-lf-inner { grid-template-columns: 1fr; }
          .td-lf-rings { display: none; }
          .td-section { padding: 72px 32px; }
          .td-tagline-band { padding: 60px 32px; }
          .td-lf { padding: 72px 32px; }
          .td-contact { padding: 72px 32px; }
        }
        @media (max-width: 600px) {
          .td-nav { padding: 0 20px; }
          .td-hero { padding: 0 20px; }
          .td-hero-lastname { padding-left: 48px; }
          .td-hero-stats-bar { grid-template-columns: repeat(2,1fr); }
          .td-section { padding: 56px 20px; }
          .td-tagline-band { padding: 48px 20px; }
          .td-lf { padding: 56px 20px; }
          .td-contact { padding: 56px 20px; }
          .td-edu-grid { grid-template-columns: 1fr; }
          .td-contact-foot { flex-direction: column; gap: 10px; align-items: flex-start; }
        }
      `}</style>

      {/* ── FIXED GLOBAL ─────────────────────────────────────────────────── */}
      <div style={{ position:"fixed", top:0, left:0, height:3, zIndex:9999, background:"linear-gradient(90deg,#7B1C2E,#C9A84C)", width:`${progress}%`, transition:"width 0.1s linear", pointerEvents:"none" }} />
      <div style={{ position:"fixed", borderRadius:"50%", pointerEvents:"none", width:700, height:700, background:"#7B1C2E", opacity:0.038, filter:"blur(130px)", top:-200, right:-150, zIndex:0, transform:`translateY(${scrollY*0.07}px)` }} />
      <div style={{ position:"fixed", borderRadius:"50%", pointerEvents:"none", width:500, height:500, background:"#C9A84C", opacity:0.052, filter:"blur(110px)", bottom:-100, left:-80, zIndex:0, transform:`translateY(${-scrollY*0.05}px)` }} />

      <div className="td-root">

        {/* ── NAV ──────────────────────────────────────────────────────────── */}
        <nav className={`td-nav${scrolled ? " td-scrolled" : ""}`}>
          <a href="#" className="td-nav-brand">{initials}</a>
          <ul className="td-nav-links">
            {experience.length > 0 && <li><a href="#td-exp"    className="td-nav-link">Experience</a></li>}
            {projects.length  > 0 && <li><a href="#td-proj"   className="td-nav-link">Projects</a></li>}
            {skills.length    > 0 && <li><a href="#td-skills" className="td-nav-link">Skills</a></li>}
            {education.length > 0 && <li><a href="#td-edu"    className="td-nav-link">Education</a></li>}
            <li><a href="#td-contact" className="td-nav-link">Contact</a></li>
          </ul>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="td-hero">
          {/* Top — staircase name + floating card + rings */}
          <div className="td-hero-top">
            <div className="td-hero-tag">Portfolio · {new Date().getFullYear()}</div>
            <div>
              <span className="td-hero-firstname">{firstName}</span>
              <span className="td-hero-lastname">{lastName}</span>
            </div>

            {/* Floating current-role card */}
            {currentRole && (
              <div className="td-hero-card" style={{ transform:`translateY(${scrollY*0.04}px)` }}>
                <div className="td-card-eyebrow">Currently at</div>
                <div className="td-card-company">{currentRole.companyName}</div>
                <div className="td-card-role">{currentRole.roleTitle}</div>
                <div className="td-card-active"><div className="td-card-dot" /> Active</div>
              </div>
            )}

            {/* Decorative rings */}
            <div className="td-hero-ring"    style={{ transform:`translateY(${scrollY*0.05}px)` }} />
            <div className="td-hero-ring-sm" style={{ transform:`translateY(${scrollY*0.08}px)` }} />
            <div className="td-hero-blob"    style={{ transform:`translateY(${scrollY*0.06}px)` }} />
          </div>

          {/* Bottom strip — title + bio + links */}
          <div className="td-hero-bottom">
            <div className="td-hero-meta">
              <div className="td-hero-title">{personal.professionalTitle}</div>
              <div className="td-hero-loc">
                {personal.location && <>{personal.location} · </>}
                <em>Available for opportunities</em>
              </div>
              {personal.bio && <p className="td-hero-bio">{personal.bio}</p>}
              <div className="td-hero-links">
                {personal.email       && <a href={`mailto:${personal.email}`} className="td-hero-link">✉ {personal.email}</a>}
                {personal.linkedinUrl && <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer" className="td-hero-link">↗ LinkedIn</a>}
                {personal.githubUrl   && <a href={personal.githubUrl}   target="_blank" rel="noopener noreferrer" className="td-hero-link">↗ GitHub</a>}
                {personal.websiteUrl  && <a href={personal.websiteUrl}  target="_blank" rel="noopener noreferrer" className="td-hero-link">↗ Website</a>}
              </div>
            </div>
            <div /> {/* breathing room */}
          </div>

          {/* Full-width stats bar */}
          <div className="td-hero-stats-bar">
            <div className="td-stat-item"><div className="td-stat-num">{yearsExp}+</div><div className="td-stat-label">Years Exp</div></div>
            <div className="td-stat-item"><div className="td-stat-num">{projects.length}</div><div className="td-stat-label">Projects</div></div>
            <div className="td-stat-item"><div className="td-stat-num">{skills.length}</div><div className="td-stat-label">Skills</div></div>
            <div className="td-stat-item"><div className="td-stat-num">{education.length}</div><div className="td-stat-label">Degrees</div></div>
          </div>
        </section>

        {/* ── TAGLINE ──────────────────────────────────────────────────────── */}
        {tagline && (
          <div className="td-tagline-band" data-reveal="tagline">
            <div className="td-tagline-wm">{initials}</div>
            <TDTagline tagline={tagline} visible={vis("tagline")} />
          </div>
        )}

        <div className="td-rule" />

        {/* ── CAREER STORY ─────────────────────────────────────────────────── */}
        {careerStory && (
          <section className="td-section" data-reveal="story">
            <div className="td-inner">
              <div className="td-story-grid">
                <div className="td-story-aside">
                  <div className="td-label">Career Story</div>
                  <div className="td-story-aside-name">{firstName}</div>
                  <div className="td-story-aside-line" />
                  <div className="td-story-aside-role">
                    {personal.professionalTitle}
                    {personal.location && <><br />{personal.location}</>}
                  </div>
                </div>
                <TDStory story={careerStory} visible={vis("story")} />
              </div>
            </div>
          </section>
        )}

        <div className="td-rule" />

        {/* ── EXPERIENCE ───────────────────────────────────────────────────── */}
        {experience.length > 0 && (
          <section className="td-section" id="td-exp" data-reveal="exp">
            <div className="td-inner">
              <div className="td-label">Experience</div>
              <h2 className="td-heading">Where I've <em>worked</em></h2>
              <div className={`td-exp-wrap td-r${vis("exp") ? " td-v" : ""}`}>
                <div className="td-exp-sidebar">
                  {experience.map((e, i) => (
                    <div key={i} className={`td-exp-item${activeExp === i ? " td-ea" : ""}`} onClick={() => setActiveExp(i)}>
                      <div className="td-exp-co">{e.companyName}</div>
                      <div className="td-exp-dt">{e.startDate.split("-")[0]} — {e.isCurrent ? "Present" : e.endDate?.split("-")[0] || ""}</div>
                    </div>
                  ))}
                </div>
                <div className="td-exp-panel">
                  {experience.map((e, i) => (
                    <div key={i} className={`td-exp-pane${activeExp === i ? " td-ep" : ""}`}>
                      {e.isCurrent && <div className="td-exp-badge"><div className="td-exp-dot" /> Currently here</div>}
                      <div className="td-exp-role">{e.roleTitle}</div>
                      <div className="td-exp-co2">{e.companyName}</div>
                      <div className="td-exp-meta">
                        <span>{e.startDate.split("-")[0]} — {e.isCurrent ? "Present" : e.endDate?.split("-")[0] || ""}</span>
                        {e.location && <span>{e.location}</span>}
                      </div>
                      {e.description && <div className="td-exp-desc">{e.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="td-rule" />

        {/* ── PROJECTS ─────────────────────────────────────────────────────── */}
        {projects.length > 0 && (
          <section className="td-section" id="td-proj" data-reveal="proj">
            <div className="td-inner">
              <div className="td-label">Projects</div>
              <h2 className="td-heading">Things I've <em>built</em></h2>
              <div className="td-proj-grid">
                {projects.map((p, i) => (
                  <div key={i} className={`td-proj-card${vis("proj") ? " td-cv" : ""}`} style={{ transitionDelay:`${i*0.09}s` }}>
                    <div className="td-proj-num">0{i + 1}</div>
                    <div className="td-proj-name">{p.projectName}</div>
                    {p.description && <div className="td-proj-desc">{p.description}</div>}
                    {p.techStack.length > 0 && <div className="td-proj-tech">{p.techStack.map((t,ti) => <span key={ti} className="td-tech">{t}</span>)}</div>}
                    <div className="td-proj-links">
                      {p.liveUrl   && <a href={p.liveUrl}   target="_blank" rel="noopener noreferrer" className="td-proj-link">↗ Live</a>}
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="td-proj-link">↗ GitHub</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="td-rule" />

        {/* ── WORK STYLE ───────────────────────────────────────────────────── */}
        {principles.length > 0 && (
          <section className="td-section" data-reveal="ws">
            <div className="td-inner">
              <div className="td-label">Work Style</div>
              <h2 className="td-heading">How I <em>think</em></h2>
              <div className="td-prin-grid">
                {principles.map((p, i) => (
                  <div key={i} className={`td-prin-card${vis("ws") ? " td-pv" : ""}`} style={{ transitionDelay:`${i*0.12}s` }}>
                    <div className="td-prin-num">{p.num}</div>
                    <div className="td-prin-text">{p.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="td-rule" />

        {/* ── SKILLS ───────────────────────────────────────────────────────── */}
        {skills.length > 0 && (
          <section className="td-section td-skills-bg" id="td-skills" data-reveal="skills">
            <div className="td-inner">
              <div className="td-label">Skills</div>
              <h2 className="td-heading">What I <em>know</em></h2>
              {Object.entries(skillGroups).map(([cat, list], gi) => (
                <div key={gi} className="td-skill-group">
                  <div className="td-skill-cat">{cat}</div>
                  <div className="td-pills">
                    {list.map((sk, si) => (
                      <span key={si} className={`td-pill${vis("skills") ? " td-pvis" : ""}`} style={{ transitionDelay:`${(gi*6+si)*0.038}s` }}>{sk}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── LANGUAGES ────────────────────────────────────────────────────── */}
        {languages && languages.length > 0 && (
          <>
            <div className="td-rule" />
            <section className="td-section" data-reveal="lang">
              <div className="td-inner">
                <div className="td-label">Languages</div>
                <h2 className="td-heading">I <em>speak</em></h2>
                <div className={`td-lang-grid td-r${vis("lang") ? " td-v" : ""}`}>
                  {languages.map((l, i) => (
                    <div key={i}>
                      <div className="td-lang-head">
                        <div className="td-lang-name">{l.language}</div>
                        <div className="td-lang-prof">{l.proficiency}</div>
                      </div>
                      <div className="td-lang-track">
                        <div className="td-lang-fill" style={{ width: vis("lang") ? `${profToPercent(l.proficiency)}%` : "0%", transitionDelay:`${i*0.15}s` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── INTERESTS ────────────────────────────────────────────────────── */}
        {interests && interests.length > 0 && (
          <>
            <div className="td-rule" />
            <section className="td-section" data-reveal="interests">
              <div className="td-inner">
                <div className="td-label">Interests</div>
                <h2 className="td-heading">Outside <em>work</em></h2>
                <div className="td-interests-wrap">
                  {interests.map((interest, i) => (
                    <span key={i} className={`td-interest-pill${vis("interests") ? " td-ipvis" : ""}`} style={{ transitionDelay:`${i*0.06}s` }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <div className="td-rule" />

        {/* ── EDUCATION ────────────────────────────────────────────────────── */}
        {education.length > 0 && (
          <section className="td-section" id="td-edu" data-reveal="edu">
            <div className="td-inner">
              <div className="td-label">Education</div>
              <h2 className="td-heading">Where I <em>studied</em></h2>
              <div className="td-edu-grid">
                {education.map((e, i) => (
                  <div key={i} className={`td-edu-card${vis("edu") ? " td-ev" : ""}`} style={{ transitionDelay:`${i*0.1}s` }}>
                    <div className="td-edu-seal">{e.institution.split(" ").map(w => w[0]).slice(0,2).join("")}</div>
                    <div className="td-edu-degree">{e.degree}</div>
                    {e.fieldOfStudy && <div className="td-edu-field">{e.fieldOfStudy}</div>}
                    <div className="td-edu-inst">{e.institution}</div>
                    {(e.startYear || e.endYear) && <div className="td-edu-years">{e.startYear} — {e.endYear || "Present"}</div>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── LOOKING FOR ──────────────────────────────────────────────────── */}
        {lookingFor && (
          <section className="td-lf" data-reveal="lf">
            <div className="td-lf-inner">
              <div className={`td-r${vis("lf") ? " td-v" : ""}`}>
                <div className="td-label" style={{ marginBottom:18 }}>What I'm Looking For</div>
                <h2 className="td-lf-heading">What comes<br /><em>next</em></h2>
                <div className="td-shimmer-wrap">
                  <div className="td-shimmer-bar" />
                  <p className="td-lf-text">{lookingFor}</p>
                </div>
                {personal.email && <a href={`mailto:${personal.email}`} className="td-lf-cta">Let's talk →</a>}
              </div>
              <div className="td-lf-rings">
                <div className="td-ring td-ring-1">
                  <div className="td-ring-dot" />
                  <div className="td-ring td-ring-2">
                    <div className="td-ring-dot2" />
                    <div className="td-ring td-ring-3">
                      <div className="td-ring-label">Open<br />to Work</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT ──────────────────────────────────────────────────────── */}
        <section className="td-contact" id="td-contact">
          <div className="td-contact-inner">
            <h2 className="td-contact-h">Let's build<br />something <span>great.</span></h2>
            <div className="td-contact-links">
              {personal.email       && <a href={`mailto:${personal.email}`} className="td-contact-link">✉ {personal.email}</a>}
              {personal.phone       && <a href={`tel:${personal.phone}`}    className="td-contact-link">✆ {personal.phone}</a>}
              {personal.linkedinUrl && <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer" className="td-contact-link">↗ LinkedIn</a>}
              {personal.githubUrl   && <a href={personal.githubUrl}   target="_blank" rel="noopener noreferrer" className="td-contact-link">↗ GitHub</a>}
              {personal.websiteUrl  && <a href={personal.websiteUrl}  target="_blank" rel="noopener noreferrer" className="td-contact-link">↗ Website</a>}
            </div>
            <div className="td-contact-foot">
              <div className="td-contact-copy">© {new Date().getFullYear()} {personal.fullName}</div>
              <div className="td-contact-copy">Built with PortfolioAI</div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TDTagline({ tagline, visible }: { tagline: string; visible: boolean }) {
  const words = tagline.split(" ")
  return (
    <p style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(1.8rem,3.2vw,3rem)", fontWeight:500, fontStyle:"italic", lineHeight:1.35, color:"#F8F4EE", letterSpacing:"-0.01em", maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
      {words.map((word, i) => (
        <span key={i} style={{ display:"inline-block", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px) scale(0.96)", transition:"opacity 0.5s cubic-bezier(0.16,1,0.3,1),transform 0.5s cubic-bezier(0.16,1,0.3,1)", transitionDelay:`${i*0.055}s`, color: i === words.length - 1 ? "#C9A84C" : "#F8F4EE", marginRight:"0.28em" }}>
          {word}
        </span>
      ))}
    </p>
  )
}

function TDStory({ story, visible }: { story: string; visible: boolean }) {
  const sentences = story.split(/(?<=[.!?])\s+/).filter(Boolean)
  return (
    <div style={{ fontSize:18, lineHeight:1.85, color:"#3D3530", fontWeight:300 }}>
      {sentences.map((sentence, i) => (
        <p key={i} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(14px)", transition:"opacity 0.65s cubic-bezier(0.16,1,0.3,1),transform 0.65s cubic-bezier(0.16,1,0.3,1)", transitionDelay:`${i*0.15}s`, marginBottom: i < sentences.length - 1 ? 20 : 0 }}>
          {i === 0 && (
            <span style={{ float:"left", fontFamily:"'Fraunces',serif", fontSize:"4.5rem", fontWeight:900, fontStyle:"italic", lineHeight:0.82, color:"#7B1C2E", marginRight:12, marginTop:6 }}>
              {sentence[0]}
            </span>
          )}
          {i === 0 ? sentence.slice(1) : sentence}
        </p>
      ))}
    </div>
  )
}
