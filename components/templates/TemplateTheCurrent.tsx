"use client"
import { useEffect, useRef } from "react"
import type { PortfolioData } from "@/types/portfolio"

export default function TemplateTheCurrent({ portfolioData }: { portfolioData: PortfolioData }) {
  const {
    personal,
    experience,
    projects,
    skills,
    education,
    certifications,
    tagline,
    careerStory,
    workStyle,
    lookingFor,
  } = portfolioData

  // ── Derived data ──
  const nameParts = personal.fullName.trim().split(" ")
  const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0]
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""

  // Group skills by category, preserving insertion order
  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s.name)
    return acc
  }, {})

  // Parse workStyle string into up to 4 principle objects {title, body}
  const principles: { title: string; body: string }[] = (() => {
    if (!workStyle) return []
    const sentences = workStyle.split(/(?<=[.!?])\s+/).filter(Boolean)
    const result: { title: string; body: string }[] = []
    for (let i = 0; i < sentences.length && result.length < 4; i++) {
      const title = sentences[i].replace(/[.!?]$/, "")
      const body = sentences[i + 1] ?? ""
      result.push({ title, body })
      if (body) i++
    }
    return result
  })()

  // Nav sections — only include sections that have data
  const navSections = [
    { id: "tc-hero", label: "Home" },
    ...(experience.length > 0 ? [{ id: "tc-experience", label: "Experience" }] : []),
    ...(projects.length > 0 ? [{ id: "tc-projects", label: "Projects" }] : []),
    ...(skills.length > 0 ? [{ id: "tc-skills", label: "Skills" }] : []),
    ...(education.length > 0 ? [{ id: "tc-education", label: "Education" }] : []),
    { id: "tc-contact", label: "Contact" },
  ]

  const totalSections = navSections.length

  // Ticker items assembled from personal data
  const tickerItems = [
    personal.professionalTitle,
    personal.location,
    personal.email,
    ...(experience.length > 0 ? [`${experience.length * 2}+ Years Experience`] : []),
    "Open to Opportunities",
    "Available Now",
  ].filter(Boolean) as string[]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        .tc-root *, .tc-root *::before, .tc-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .tc-root {
          --tc-bg: #FFFFFF;
          --tc-surface: #F4F5F7;
          --tc-surface2: #ECEEF2;
          --tc-ink: #0A0A0A;
          --tc-indigo: #4F46E5;
          --tc-indigo-light: rgba(79,70,229,0.08);
          --tc-indigo-glow: rgba(79,70,229,0.2);
          --tc-amber: #F59E0B;
          --tc-dim: #6B7280;
          --tc-border: rgba(10,10,10,0.08);
          --tc-border-indigo: rgba(79,70,229,0.3);
          --tc-snap: cubic-bezier(0.25,0,0,1);
          --tc-ease-out: cubic-bezier(0.16,1,0.3,1);
          --tc-spring: cubic-bezier(0.34,1.56,0.64,1);
          --tc-nav-h: 68px;
          background: var(--tc-bg);
          color: var(--tc-ink);
          font-family: 'Outfit', sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* SCROLL PROGRESS */
        .tc-progress {
          position: fixed; bottom: 0; left: 0; height: 3px; width: 0%;
          background: var(--tc-indigo); z-index: 9999;
          transition: width 0.08s linear;
          box-shadow: 0 0 12px var(--tc-indigo-glow);
        }

        /* SECTION COUNTER */
        .tc-counter {
          position: fixed; right: 20px; top: 50%;
          transform: translateY(-50%) rotate(90deg);
          font-family: 'Space Mono', monospace; font-size: 10px;
          letter-spacing: 0.2em; color: var(--tc-dim);
          z-index: 200; pointer-events: none; white-space: nowrap;
        }
        .tc-counter .tc-cur { color: var(--tc-indigo); font-weight: 700; }

        /* NAVBAR */
        .tc-nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 1000; transition: padding 0.4s var(--tc-ease-out);
        }
        .tc-nav.tc-scrolled { padding: 10px 48px; }

        .tc-nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: var(--tc-nav-h); padding: 0 48px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--tc-border);
          transition: all 0.4s var(--tc-ease-out);
        }
        .tc-nav.tc-scrolled .tc-nav-inner {
          height: 52px; padding: 0 24px;
          border-radius: 100px; border: 1px solid var(--tc-border);
          box-shadow: 0 4px 32px rgba(10,10,10,0.09);
        }

        .tc-logo {
          font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800;
          color: var(--tc-ink); text-decoration: none; letter-spacing: -0.02em;
          display: flex; align-items: center; gap: 7px;
        }
        .tc-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--tc-indigo);
          animation: tcPulse 2.5s ease-in-out infinite;
        }
        @keyframes tcPulse { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(0.5);opacity:0.4;} }

        .tc-nav-links { display: flex; gap: 0; list-style: none; align-items: center; }
        .tc-nav-links a {
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.08em;
          color: var(--tc-dim); text-decoration: none; padding: 8px 14px;
          position: relative; transition: color 0.15s;
        }
        .tc-nav-links a::after {
          content: ''; position: absolute; bottom: 0; left: 14px; right: 14px;
          height: 1.5px; background: var(--tc-indigo);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.2s var(--tc-ease-out);
        }
        .tc-nav-links a:hover { color: var(--tc-ink); }
        .tc-nav-links a.tc-active { color: var(--tc-indigo); }
        .tc-nav-links a.tc-active::after { transform: scaleX(1); }
        .tc-ndot {
          display: none; width: 5px; height: 5px; border-radius: 50%;
          background: var(--tc-indigo); margin-right: 6px;
          animation: tcPulse 2s ease-in-out infinite; vertical-align: middle;
        }
        .tc-nav-links a.tc-active .tc-ndot { display: inline-block; }

        /* HAMBURGER */
        .tc-burger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 6px; z-index: 1100;
        }
        .tc-burger span {
          display: block; width: 22px; height: 2px; background: var(--tc-ink);
          border-radius: 2px; transition: all 0.25s var(--tc-snap);
        }
        .tc-burger.tc-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .tc-burger.tc-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .tc-burger.tc-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* MOBILE OVERLAY */
        .tc-mob-overlay {
          position: fixed; inset: 0; background: var(--tc-bg); z-index: 990;
          display: flex; flex-direction: column; justify-content: center; padding: 48px;
          transform: translateX(100%); transition: transform 0.45s var(--tc-ease-out);
        }
        .tc-mob-overlay.tc-open { transform: translateX(0); }
        .tc-mob-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
        .tc-mob-list li { overflow: hidden; }
        .tc-mob-list li a {
          display: block; font-family: 'Syne', sans-serif;
          font-size: clamp(34px, 9vw, 60px); font-weight: 800;
          letter-spacing: -0.03em; color: var(--tc-ink); text-decoration: none;
          transform: translateY(110%); transition: transform 0.4s var(--tc-ease-out), color 0.15s;
        }
        .tc-mob-overlay.tc-open .tc-mob-list li a { transform: translateY(0); }
        .tc-mob-list li:nth-child(1) a { transition-delay: 0.04s; }
        .tc-mob-list li:nth-child(2) a { transition-delay: 0.09s; }
        .tc-mob-list li:nth-child(3) a { transition-delay: 0.14s; }
        .tc-mob-list li:nth-child(4) a { transition-delay: 0.19s; }
        .tc-mob-list li:nth-child(5) a { transition-delay: 0.24s; }
        .tc-mob-list li:nth-child(6) a { transition-delay: 0.29s; }
        .tc-mob-list li a:hover { color: var(--tc-indigo); }
        .tc-mob-foot {
          margin-top: 40px; font-family: 'Space Mono', monospace;
          font-size: 11px; color: var(--tc-dim); letter-spacing: 0.06em;
        }

        /* HERO */
        .tc-hero {
          min-height: 100vh; display: flex; flex-direction: column;
          justify-content: flex-end; padding: 0 48px 56px;
          padding-top: var(--tc-nav-h); position: relative; overflow: hidden;
        }
        .tc-hero::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(10,10,10,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10,10,10,0.05) 1px, transparent 1px);
          background-size: 72px 72px; pointer-events: none;
        }
        .tc-hero-name { position: relative; line-height: 0.88; margin-bottom: 0; }
        .tc-hero-line { display: block; overflow: hidden; }
        .tc-hero-word {
          display: block; font-family: 'Syne', sans-serif; font-weight: 800;
          letter-spacing: -0.04em;
          transform: translateY(108%) rotate(2deg);
          transition: transform 1s var(--tc-ease-out);
        }
        .tc-hero-word.tc-vis { transform: translateY(0) rotate(0deg); }
        .tc-hw-first { font-size: clamp(60px, 10vw, 148px); color: var(--tc-ink); }
        .tc-hw-last { font-size: clamp(66px, 13vw, 200px); color: transparent; -webkit-text-stroke: 1.5px var(--tc-ink); }
        .tc-hw-accent { -webkit-text-stroke-color: var(--tc-indigo); }

        /* TICKER */
        .tc-ticker-outer {
          overflow: hidden;
          border-top: 1px solid var(--tc-border); border-bottom: 1px solid var(--tc-border);
          margin: 26px 0 36px; padding: 10px 0;
        }
        .tc-ticker-track { display: flex; width: max-content; animation: tcTickerRun 30s linear infinite; }
        @keyframes tcTickerRun { from{transform:translateX(0);} to{transform:translateX(-50%);} }
        .tc-ticker-set { display: flex; flex-shrink: 0; }
        .tc-ticker-item {
          font-family: 'Space Mono', monospace; font-size: 12px; letter-spacing: 0.07em;
          color: var(--tc-dim); padding: 0 28px;
          display: flex; align-items: center; gap: 12px; white-space: nowrap;
        }
        .tc-ticker-bullet { width: 4px; height: 4px; border-radius: 50%; background: var(--tc-indigo); flex-shrink: 0; }
        .tc-ticker-em { color: var(--tc-indigo); }

        .tc-hero-bottom { display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: flex-end; }
        .tc-hero-bio {
          font-size: clamp(15px, 1.8vw, 18px); color: var(--tc-dim); line-height: 1.75; max-width: 500px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.7s var(--tc-ease-out) 1.4s, transform 0.7s var(--tc-ease-out) 1.4s;
        }
        .tc-hero-bio.tc-vis { opacity: 1; transform: translateY(0); }
        .tc-hero-right {
          display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
          opacity: 0; transition: opacity 0.6s var(--tc-ease-out) 1.8s;
        }
        .tc-hero-right.tc-vis { opacity: 1; }
        .tc-hero-cta {
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.1em; font-weight: 700;
          background: var(--tc-indigo); color: white;
          padding: 13px 28px; border-radius: 100px; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;
          transition: transform 0.15s var(--tc-snap), box-shadow 0.2s;
        }
        .tc-hero-cta:hover { transform: scale(1.04); box-shadow: 0 8px 32px var(--tc-indigo-glow); }
        .tc-hero-status {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--tc-dim);
        }
        .tc-status-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #22C55E;
          box-shadow: 0 0 8px rgba(34,197,94,0.5); animation: tcPulse 2s ease-in-out infinite;
        }

        /* SECTION BASE */
        .tc-section { padding: 110px 48px; }
        .tc-bg-surface { background: var(--tc-surface); }
        .tc-bg-indigo { background: var(--tc-indigo); }

        .tc-sec-label {
          font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.22em;
          color: var(--tc-dim); text-transform: uppercase; margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
          opacity: 0; transform: translateX(-12px);
          transition: opacity 0.5s var(--tc-ease-out), transform 0.5s var(--tc-ease-out);
        }
        .tc-sec-label.tc-in { opacity: 1; transform: translateX(0); }
        .tc-sec-label-line { width: 20px; height: 2px; background: var(--tc-indigo); flex-shrink: 0; border-radius: 2px; }
        .tc-bg-indigo .tc-sec-label { color: rgba(255,255,255,0.5); }
        .tc-bg-indigo .tc-sec-label-line { background: rgba(255,255,255,0.4); }

        .tc-sec-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 5.5vw, 70px);
          font-weight: 800; letter-spacing: -0.03em; line-height: 1.0; margin-bottom: 52px;
          opacity: 0; transform: scale(0.96);
          transition: opacity 0.6s var(--tc-ease-out) 0.1s, transform 0.6s var(--tc-ease-out) 0.1s;
        }
        .tc-sec-h2.tc-in { opacity: 1; transform: scale(1); }
        .tc-bg-indigo .tc-sec-h2 { color: white; }

        /* EXPERIENCE */
        .tc-exp-hint {
          font-family: 'Space Mono', monospace; font-size: 11px; color: var(--tc-dim);
          display: flex; align-items: center; gap: 8px; margin-bottom: 20px; letter-spacing: 0.06em;
        }
        .tc-exp-hint-arrow { animation: tcSlideArrow 1.6s ease-in-out infinite; }
        @keyframes tcSlideArrow { 0%,100%{transform:translateX(0);} 50%{transform:translateX(7px);} }

        .tc-exp-track {
          display: flex; gap: 20px; overflow-x: auto;
          scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
          scrollbar-width: none; padding-bottom: 4px; cursor: grab;
        }
        .tc-exp-track:active { cursor: grabbing; }
        .tc-exp-track::-webkit-scrollbar { display: none; }

        .tc-exp-card {
          flex: 0 0 min(460px, 80vw); scroll-snap-align: start;
          background: var(--tc-bg); border: 1px solid var(--tc-border);
          border-radius: 24px; padding: 40px; position: relative; overflow: hidden;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s var(--tc-ease-out), transform 0.6s var(--tc-ease-out),
            background 0.14s var(--tc-snap), border-color 0.14s var(--tc-snap), box-shadow 0.2s;
        }
        .tc-exp-card.tc-in { opacity: 1; transform: translateY(0); }
        .tc-exp-card:hover { background: var(--tc-indigo); border-color: var(--tc-indigo); box-shadow: 0 24px 64px var(--tc-indigo-glow); }
        .tc-exp-card:hover .tc-ec-year,
        .tc-exp-card:hover .tc-ec-company,
        .tc-exp-card:hover .tc-ec-loc,
        .tc-exp-card:hover .tc-ec-desc { color: rgba(255,255,255,0.6); }
        .tc-exp-card:hover .tc-ec-role { color: white; }
        .tc-exp-card:hover .tc-ec-badge { background: rgba(255,255,255,0.15); color: white; }
        .tc-exp-card:hover .tc-ec-bg-num { color: rgba(255,255,255,0.06); }

        .tc-ec-bg-num {
          position: absolute; right: 28px; bottom: 16px;
          font-family: 'Syne', sans-serif; font-size: 90px; font-weight: 800;
          color: var(--tc-surface2); letter-spacing: -0.06em; line-height: 1;
          pointer-events: none; transition: color 0.14s var(--tc-snap);
        }
        .tc-ec-year { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.12em; color: var(--tc-indigo); margin-bottom: 22px; transition: color 0.14s var(--tc-snap); }
        .tc-ec-role { font-family: 'Syne', sans-serif; font-size: clamp(20px, 2.5vw, 26px); font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 7px; transition: color 0.14s var(--tc-snap); }
        .tc-ec-company { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--tc-dim); margin-bottom: 3px; display: flex; align-items: center; gap: 8px; transition: color 0.14s var(--tc-snap); }
        .tc-ec-badge { font-size: 10px; background: var(--tc-indigo-light); color: var(--tc-indigo); padding: 2px 8px; border-radius: 20px; transition: background 0.14s var(--tc-snap), color 0.14s var(--tc-snap); }
        .tc-ec-loc { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--tc-dim); margin-bottom: 18px; transition: color 0.14s var(--tc-snap); }
        .tc-ec-desc { font-size: 14px; line-height: 1.75; color: var(--tc-dim); transition: color 0.14s var(--tc-snap); }

        .tc-exp-dots { display: flex; justify-content: center; gap: 8px; margin-top: 24px; }
        .tc-exp-dot { width: 6px; height: 6px; border-radius: 50%; border: 1.5px solid var(--tc-dim); background: transparent; transition: all 0.2s var(--tc-snap); cursor: pointer; }
        .tc-exp-dot.tc-active { background: var(--tc-indigo); border-color: var(--tc-indigo); transform: scale(1.4); }

        /* PROJECTS */
        .tc-proj-list { border-top: 1px solid var(--tc-border); }
        .tc-proj-row {
          display: grid; grid-template-columns: 2fr 3fr; gap: 44px; padding: 48px 0;
          border-bottom: 1px solid var(--tc-border); position: relative; overflow: hidden;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.55s var(--tc-ease-out), transform 0.55s var(--tc-ease-out), color 0.12s var(--tc-snap);
        }
        .tc-proj-row.tc-in { opacity: 1; transform: translateY(0); }
        .tc-proj-row::before {
          content: ''; position: absolute; inset: 0; background: var(--tc-indigo);
          transform: translateX(-100%); transition: transform 0.18s var(--tc-snap); z-index: 0;
        }
        .tc-proj-row:hover::before { transform: translateX(0); }
        .tc-proj-row:hover { color: white; }
        .tc-proj-row:hover .tc-pr-num,
        .tc-proj-row:hover .tc-pr-desc { color: rgba(255,255,255,0.6); }
        .tc-proj-row:hover .tc-pr-chip { background: rgba(255,255,255,0.12); color: white; border-color: rgba(255,255,255,0.3); }
        .tc-proj-row:hover .tc-pr-link { color: rgba(255,255,255,0.75); }

        .tc-pr-left, .tc-pr-right { position: relative; z-index: 1; }
        .tc-pr-num { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.15em; color: var(--tc-dim); margin-bottom: 10px; transition: color 0.12s var(--tc-snap); }
        .tc-pr-name { font-family: 'Syne', sans-serif; font-size: clamp(22px, 3vw, 38px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; transition: color 0.12s var(--tc-snap); }
        .tc-pr-desc { font-size: 15px; line-height: 1.75; color: var(--tc-dim); margin-bottom: 18px; transition: color 0.12s var(--tc-snap); }
        .tc-pr-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
        .tc-pr-chip { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.06em; border: 1px solid var(--tc-border-indigo); color: var(--tc-indigo); padding: 4px 12px; border-radius: 20px; transition: all 0.12s var(--tc-snap); }
        .tc-pr-links { display: flex; gap: 14px; }
        .tc-pr-link { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.08em; color: var(--tc-dim); text-decoration: none; display: inline-flex; align-items: center; gap: 5px; transition: color 0.12s var(--tc-snap); }
        .tc-pr-link-arr { display: inline-block; transition: transform 0.15s var(--tc-snap); }
        .tc-pr-link:hover .tc-pr-link-arr { transform: translate(3px, -3px); }

        /* CAREER STORY */
        .tc-story-wrap { max-width: 840px; margin: 0 auto; text-align: center; }
        .tc-story-text { font-family: 'Syne', sans-serif; font-size: clamp(22px, 3.5vw, 44px); font-weight: 800; letter-spacing: -0.02em; line-height: 1.3; color: white; }
        .tc-sw { display: inline-block; opacity: 0; transform: scale(0.8) translateY(8px); transition: opacity 0.4s var(--tc-ease-out), transform 0.4s var(--tc-ease-out); margin-right: 0.22em; }
        .tc-sw.tc-in { opacity: 1; transform: scale(1) translateY(0); }

        /* SKILLS */
        .tc-skills-wrap { overflow: hidden; }
        .tc-belt-row { padding: 5px 0; }
        .tc-belt { display: flex; white-space: nowrap; }
        .tc-belt-set { display: flex; gap: 10px; flex-shrink: 0; padding-right: 10px; animation: tcBeltFwd 36s linear infinite; }
        .tc-belt-set.tc-b2 { animation-delay: -18s; }
        .tc-belt-row.tc-rev .tc-belt-set { animation-name: tcBeltRev; }
        @keyframes tcBeltFwd { from{transform:translateX(0);} to{transform:translateX(-100%);} }
        @keyframes tcBeltRev { from{transform:translateX(-100%);} to{transform:translateX(0);} }
        .tc-belt-row:hover .tc-belt-set { animation-play-state: paused; }
        .tc-skill-pill {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.05em;
          color: var(--tc-dim); background: var(--tc-bg); border: 1px solid var(--tc-border);
          padding: 10px 20px; border-radius: 100px; white-space: nowrap; flex-shrink: 0;
          transition: border-color 0.15s var(--tc-snap), color 0.15s var(--tc-snap), transform 0.2s var(--tc-spring), box-shadow 0.15s;
          cursor: default;
        }
        .tc-skill-pill:hover { border-color: var(--tc-indigo); color: var(--tc-indigo); transform: scale(1.06) rotate(2deg); box-shadow: 0 4px 20px var(--tc-indigo-glow); }
        .tc-sdot { width: 5px; height: 5px; border-radius: 50%; background: var(--tc-indigo); opacity: 0.4; flex-shrink: 0; }
        .tc-belt-gap { height: 10px; }

        /* WORK STYLE TABS */
        .tc-ws-tabs { display: flex; border-bottom: 1px solid var(--tc-border); margin-bottom: 48px; overflow-x: auto; scrollbar-width: none; }
        .tc-ws-tabs::-webkit-scrollbar { display: none; }
        .tc-ws-tab { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.08em; color: var(--tc-dim); background: none; border: none; padding: 13px 22px 13px 0; cursor: pointer; white-space: nowrap; position: relative; transition: color 0.15s; }
        .tc-ws-tab::after { content: ''; position: absolute; left: 0; bottom: -1px; width: 0%; height: 2px; background: var(--tc-indigo); transition: width 0.28s var(--tc-ease-out); }
        .tc-ws-tab:hover { color: var(--tc-ink); }
        .tc-ws-tab.tc-active { color: var(--tc-indigo); }
        .tc-ws-tab.tc-active::after { width: calc(100% - 22px); }
        .tc-ws-panels { min-height: 220px; }
        .tc-ws-panel { display: none; }
        .tc-ws-panel.tc-active { display: block; animation: tcPanelIn 0.35s var(--tc-ease-out) both; }
        @keyframes tcPanelIn { from{opacity:0;transform:translateX(20px);} to{opacity:1;transform:translateX(0);} }
        .tc-ws-inner { display: grid; grid-template-columns: 140px 1fr; gap: 52px; align-items: start; }
        .tc-ws-big { font-family: 'Syne', sans-serif; font-size: clamp(88px, 12vw, 140px); font-weight: 800; letter-spacing: -0.05em; color: var(--tc-indigo); opacity: 0.1; line-height: 0.9; }
        .tc-ws-content h3 { font-family: 'Syne', sans-serif; font-size: clamp(22px, 3vw, 32px); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 14px; }
        .tc-ws-content p { font-size: 16px; color: var(--tc-dim); line-height: 1.8; }

        /* LOOKING FOR */
        .tc-looking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        .tc-looking-eyebrow { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.2em; color: var(--tc-dim); text-transform: uppercase; margin-bottom: 20px; }
        .tc-looking-h { font-family: 'Syne', sans-serif; font-size: clamp(26px, 4vw, 50px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 28px; }
        .tc-looking-h em { color: var(--tc-amber); font-style: normal; }
        .tc-looking-body { font-size: 16px; color: var(--tc-dim); line-height: 1.8; }
        .tc-morph { width: 100%; max-width: 380px; aspect-ratio: 1; margin: 0 auto; background: linear-gradient(135deg, var(--tc-indigo) 0%, #7C3AED 100%); animation: tcMorph 9s ease-in-out infinite; position: relative; overflow: hidden; }
        .tc-morph::after { content: ''; position: absolute; inset: 0; background: linear-gradient(45deg, rgba(245,158,11,0.25) 0%, transparent 60%); }
        @keyframes tcMorph {
          0%  {border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}
          25% {border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}
          50% {border-radius:50% 60% 30% 60%/30% 60% 70% 40%;}
          75% {border-radius:60% 40% 60% 30%/70% 30% 50% 60%;}
          100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}
        }

        /* EDUCATION */
        .tc-edu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .tc-edu-card { background: var(--tc-bg); border: 1px solid var(--tc-border); border-radius: 20px; padding: 36px; position: relative; overflow: hidden; opacity: 0; transform: translateY(18px); transition: opacity 0.5s var(--tc-ease-out), transform 0.5s var(--tc-ease-out), box-shadow 0.2s; }
        .tc-edu-card.tc-in { opacity: 1; transform: translateY(0); }
        .tc-edu-card:hover { box-shadow: 0 12px 40px rgba(79,70,229,0.1); }
        .tc-edu-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--tc-indigo); transform: scaleY(0); transform-origin: top; transition: transform 0.3s var(--tc-ease-out); }
        .tc-edu-card:hover::before { transform: scaleY(1); }
        .tc-edu-years { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--tc-indigo); letter-spacing: 0.1em; margin-bottom: 14px; }
        .tc-edu-degree { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 5px; line-height: 1.2; }
        .tc-edu-inst { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--tc-dim); }

        /* CERTS */
        .tc-cert-list { border-top: 1px solid var(--tc-border); }
        .tc-cert-row { display: flex; justify-content: space-between; align-items: center; padding: 22px 0; border-bottom: 1px solid var(--tc-border); gap: 20px; flex-wrap: wrap; opacity: 0; transform: translateX(-14px); transition: opacity 0.5s var(--tc-ease-out), transform 0.5s var(--tc-ease-out); }
        .tc-cert-row.tc-in { opacity: 1; transform: translateX(0); }
        .tc-cert-name { font-weight: 600; font-size: 15px; }
        .tc-cert-issuer { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--tc-dim); margin-top: 3px; }
        .tc-cert-date { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--tc-indigo); background: var(--tc-indigo-light); padding: 5px 12px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }

        /* CONTACT */
        .tc-contact-list { border-top: 1px solid var(--tc-border); margin-bottom: 40px; }
        .tc-contact-row { display: flex; align-items: center; padding: 18px 0; border-bottom: 1px solid var(--tc-border); gap: 24px; position: relative; overflow: hidden; text-decoration: none; color: inherit; opacity: 0; transform: translateY(12px); transition: opacity 0.5s var(--tc-ease-out), transform 0.5s var(--tc-ease-out), color 0.12s var(--tc-snap); }
        .tc-contact-row.tc-in { opacity: 1; transform: translateY(0); }
        .tc-contact-row::before { content: ''; position: absolute; inset: 0; background: var(--tc-indigo); transform: translateX(-100%); transition: transform 0.17s var(--tc-snap); z-index: 0; }
        .tc-contact-row:hover::before { transform: translateX(0); }
        .tc-contact-row:hover { color: white; }
        .tc-contact-row:hover .tc-cr-type,
        .tc-contact-row:hover .tc-cr-val { color: white; }
        .tc-contact-row:hover .tc-cr-num { color: rgba(255,255,255,0.3); }
        .tc-contact-row:hover .tc-cr-arr { transform: translate(4px,-4px); color: white; }
        .tc-cr-num { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--tc-dim); letter-spacing: 0.1em; min-width: 28px; position: relative; z-index: 1; transition: color 0.12s var(--tc-snap); }
        .tc-cr-type { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.15em; color: var(--tc-dim); text-transform: uppercase; min-width: 72px; position: relative; z-index: 1; transition: color 0.12s var(--tc-snap); }
        .tc-cr-val { font-size: 16px; font-weight: 500; flex: 1; position: relative; z-index: 1; transition: color 0.12s var(--tc-snap); }
        .tc-cr-arr { font-size: 18px; position: relative; z-index: 1; color: var(--tc-dim); transition: transform 0.15s var(--tc-snap), color 0.12s var(--tc-snap); }

        /* AVAILABILITY BAR */
        .tc-avail { display: flex; align-items: center; gap: 14px; padding: 22px 26px; background: var(--tc-surface); border-radius: 14px; border: 1px solid var(--tc-border); }
        .tc-avail-dot { width: 9px; height: 9px; border-radius: 50%; background: #22C55E; flex-shrink: 0; box-shadow: 0 0 10px rgba(34,197,94,0.5); animation: tcPulse 2s ease-in-out infinite; }
        .tc-avail-text { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--tc-dim); letter-spacing: 0.05em; }
        .tc-avail-text strong { color: var(--tc-ink); }

        /* FOOTER */
        .tc-footer { padding: 36px 48px; border-top: 1px solid var(--tc-border); background: var(--tc-surface); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .tc-footer-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
        .tc-footer-copy { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--tc-dim); letter-spacing: 0.06em; }

        /* REVEAL UTIL */
        .tc-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s var(--tc-ease-out), transform 0.6s var(--tc-ease-out); }
        .tc-reveal.tc-in { opacity: 1; transform: translateY(0); }

        /* RESPONSIVE */
        @media(max-width:960px) {
          .tc-nav-links { display: none; }
          .tc-burger { display: flex; }
          .tc-hero { padding: 0 32px 44px; }
          .tc-section { padding: 80px 32px; }
          .tc-looking-grid { grid-template-columns: 1fr; }
          .tc-morph { max-width: 260px; }
          .tc-edu-grid { grid-template-columns: 1fr; }
          .tc-ws-inner { grid-template-columns: 1fr; }
          .tc-ws-big { display: none; }
          .tc-counter { display: none; }
          .tc-footer { padding: 28px 32px; }
          .tc-nav.tc-scrolled { padding: 10px 32px; }
        }
        @media(max-width:600px) {
          .tc-hero { padding: 0 20px 36px; }
          .tc-section { padding: 60px 20px; }
          .tc-hero-bottom { grid-template-columns: 1fr; }
          .tc-hero-right { align-items: flex-start; }
          .tc-proj-row { grid-template-columns: 1fr; gap: 16px; }
          .tc-exp-card { flex-basis: min(320px, 86vw); }
          .tc-footer { padding: 20px; }
          .tc-nav.tc-scrolled { padding: 8px 20px; }
          .tc-contact-row { flex-wrap: wrap; }
        }
      `}</style>

      <div className="tc-root">
        <div className="tc-progress" id="tc-prog" />
        <div className="tc-counter" id="tc-count">
          <span className="tc-cur">01</span> / {String(totalSections).padStart(2, "0")}
        </div>

        {/* ── NAVBAR ── */}
        <nav className="tc-nav" id="tc-nav">
          <div className="tc-nav-inner">
            <a href="#tc-hero" className="tc-logo">
              <span className="tc-logo-dot" />
              {personal.fullName}
            </a>
            <ul className="tc-nav-links">
              {navSections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} data-section={s.id} className={i === 0 ? "tc-active" : ""}>
                    <span className="tc-ndot" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <button className="tc-burger" id="tc-burger" aria-label="Open menu">
              <span /><span /><span />
            </button>
          </div>
        </nav>

        {/* ── MOBILE OVERLAY ── */}
        <div className="tc-mob-overlay" id="tc-mob">
          <ul className="tc-mob-list">
            {navSections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} onClick={() => {
                  document.getElementById("tc-burger")?.classList.remove("tc-open")
                  document.getElementById("tc-mob")?.classList.remove("tc-open")
                  document.body.style.overflow = ""
                }}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="tc-mob-foot">
            {personal.email}{personal.location ? ` · ${personal.location}` : ""}
          </div>
        </div>

        {/* ── HERO ── */}
        <section id="tc-hero" className="tc-hero">
          <div className="tc-hero-name">
            {firstName && (
              <span className="tc-hero-line">
                <span className="tc-hero-word tc-hw-first" style={{ transitionDelay: "0.05s" }}>
                  {firstName}
                </span>
              </span>
            )}
            {lastName && (
              <span className="tc-hero-line">
                <span className="tc-hero-word tc-hw-last" style={{ transitionDelay: "0.2s" }}>
                  {lastName.slice(0, -2)}
                  <span className="tc-hw-accent">{lastName.slice(-2)}</span>.
                </span>
              </span>
            )}
          </div>

          <div className="tc-ticker-outer">
            <div className="tc-ticker-track">
              {[0, 1].map((copy) => (
                <div className="tc-ticker-set" key={copy} aria-hidden={copy > 0}>
                  {tickerItems.map((item, i) => (
                    <div className="tc-ticker-item" key={i}>
                      <span className="tc-ticker-bullet" />
                      <span className={i % 3 === 2 ? "tc-ticker-em" : ""}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="tc-hero-bottom">
            {personal.bio && <p className="tc-hero-bio">{personal.bio}</p>}
            <div className="tc-hero-right">
              <div className="tc-hero-status">
                <span className="tc-status-dot" />
                Available for new roles
              </div>
              <a href="#tc-contact" className="tc-hero-cta">Get in touch →</a>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        {experience.length > 0 && (
          <section id="tc-experience" className="tc-section tc-bg-surface">
            <div className="tc-sec-label"><span className="tc-sec-label-line" />Experience</div>
            <h2 className="tc-sec-h2">Where I've worked</h2>
            <div className="tc-exp-hint"><span className="tc-exp-hint-arrow">→</span> Drag to explore</div>
            <div className="tc-exp-track" id="tc-exp-track">
              {experience.map((exp, i) => {
                const start = exp.startDate
                const end = exp.isCurrent ? "PRESENT" : (exp.endDate?.toUpperCase() ?? "")
                return (
                  <div className="tc-exp-card" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                    <div className="tc-ec-bg-num">{String(i + 1).padStart(2, "0")}</div>
                    <div className="tc-ec-year">{start.toUpperCase()}{end ? ` — ${end}` : ""}</div>
                    <div className="tc-ec-role">{exp.roleTitle}</div>
                    <div className="tc-ec-company">
                      {exp.companyName}
                      {exp.isCurrent && <span className="tc-ec-badge">Current</span>}
                    </div>
                    {exp.location && <div className="tc-ec-loc">{exp.location}</div>}
                    {exp.description && <div className="tc-ec-desc">{exp.description}</div>}
                  </div>
                )
              })}
            </div>
            <div className="tc-exp-dots" id="tc-exp-dots">
              {experience.map((_, i) => (
                <div
                  key={i}
                  className={`tc-exp-dot${i === 0 ? " tc-active" : ""}`}
                  data-i={i}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── PROJECTS ── */}
        {projects.length > 0 && (
          <section id="tc-projects" className="tc-section">
            <div className="tc-sec-label"><span className="tc-sec-label-line" />Projects</div>
            <h2 className="tc-sec-h2">Selected work</h2>
            <div className="tc-proj-list">
              {projects.map((proj, i) => (
                <div className="tc-proj-row" key={i} style={{ transitionDelay: `${i * 0.07}s` }}>
                  <div className="tc-pr-left">
                    <div className="tc-pr-num">{String(i + 1).padStart(2, "0")}{i === 0 ? " / FEATURED" : ""}</div>
                    <div className="tc-pr-name">{proj.projectName}</div>
                  </div>
                  <div className="tc-pr-right">
                    {proj.description && <div className="tc-pr-desc">{proj.description}</div>}
                    {proj.techStack.length > 0 && (
                      <div className="tc-pr-chips">
                        {proj.techStack.map((t, ti) => (
                          <span className="tc-pr-chip" key={ti}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="tc-pr-links">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="tc-pr-link">
                          Live Demo <span className="tc-pr-link-arr">↗</span>
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="tc-pr-link">
                          GitHub <span className="tc-pr-link-arr">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CAREER STORY ── */}
        {careerStory && (
          <section className="tc-section tc-bg-indigo">
            <div className="tc-sec-label"><span className="tc-sec-label-line" />Career Story</div>
            <div className="tc-story-wrap">
              <p className="tc-story-text" id="tc-story-text">{careerStory}</p>
            </div>
          </section>
        )}

        {/* ── SKILLS ── */}
        {skills.length > 0 && (
          <section id="tc-skills" className="tc-section">
            <div className="tc-sec-label"><span className="tc-sec-label-line" />Skills</div>
            <h2 className="tc-sec-h2">What I bring</h2>
            <div className="tc-skills-wrap">
              {Object.entries(skillsByCategory).map(([cat, catSkills], beltIdx) => (
                <div key={cat}>
                  <div className={`tc-belt-row${beltIdx % 2 === 1 ? " tc-rev" : ""}`}>
                    <div className="tc-belt">
                      {[0, 1].map((copy) => (
                        <div className={`tc-belt-set${copy === 1 ? " tc-b2" : ""}`} key={copy} aria-hidden={copy > 0}>
                          {catSkills.map((skill, si) => (
                            <span className="tc-skill-pill" key={si}>
                              <span className="tc-sdot" />{skill}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  {beltIdx < Object.keys(skillsByCategory).length - 1 && <div className="tc-belt-gap" />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── WORK STYLE ── */}
        {principles.length > 0 && (
          <section className="tc-section tc-bg-surface">
            <div className="tc-sec-label"><span className="tc-sec-label-line" />How I Work</div>
            <h2 className="tc-sec-h2">My principles</h2>
            <div className="tc-ws-tabs" id="tc-ws-tabs">
              {principles.map((p, i) => (
                <button
                  key={i}
                  className={`tc-ws-tab${i === 0 ? " tc-active" : ""}`}
                  data-tab={i}
                >
                  {String(i + 1).padStart(2, "0")} / {p.title}
                </button>
              ))}
            </div>
            <div className="tc-ws-panels">
              {principles.map((p, i) => (
                <div
                  key={i}
                  className={`tc-ws-panel${i === 0 ? " tc-active" : ""}`}
                  data-panel={i}
                >
                  <div className="tc-ws-inner">
                    <div className="tc-ws-big">{String(i + 1).padStart(2, "0")}</div>
                    <div className="tc-ws-content">
                      <h3>{p.title}</h3>
                      {p.body && <p>{p.body}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── LOOKING FOR ── */}
        {lookingFor && (
          <section className="tc-section">
            <div className="tc-sec-label"><span className="tc-sec-label-line" />What's Next</div>
            <div className="tc-looking-grid">
              <div className="tc-reveal">
                <div className="tc-looking-eyebrow">Open to opportunities</div>
                <h2 className="tc-looking-h">
                  {lookingFor.split(" ").map((word, i, arr) =>
                    i >= arr.length - 3
                      ? <em key={i}>{word}{i < arr.length - 1 ? " " : ""}</em>
                      : word + " "
                  )}
                </h2>
              </div>
              <div className="tc-reveal" style={{ transitionDelay: "0.15s" }}>
                <div className="tc-morph" />
              </div>
            </div>
          </section>
        )}

        {/* ── EDUCATION ── */}
        {education.length > 0 && (
          <section id="tc-education" className="tc-section tc-bg-surface">
            <div className="tc-sec-label"><span className="tc-sec-label-line" />Education</div>
            <h2 className="tc-sec-h2">Academic background</h2>
            <div className="tc-edu-grid">
              {education.map((edu, i) => {
                const years = edu.startYear && edu.endYear
                  ? `${edu.startYear} — ${edu.endYear}`
                  : edu.endYear ?? edu.startYear ?? ""
                return (
                  <div className="tc-edu-card" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                    {years && <div className="tc-edu-years">{years}</div>}
                    <div className="tc-edu-degree">
                      {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                    </div>
                    <div className="tc-edu-inst">{edu.institution}</div>
                  </div>
                )
              })}
            </div>

            {certifications && certifications.length > 0 && (
              <div style={{ marginTop: "52px" }}>
                <div className="tc-sec-label" style={{ marginBottom: "16px" }}>
                  <span className="tc-sec-label-line" />Certifications
                </div>
                <div className="tc-cert-list">
                  {certifications.map((cert, i) => (
                    <div className="tc-cert-row" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                      <div>
                        <div className="tc-cert-name">{cert.name}</div>
                        {cert.issuer && <div className="tc-cert-issuer">{cert.issuer}</div>}
                      </div>
                      {cert.date && <div className="tc-cert-date">{cert.date}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── CONTACT ── */}
        <section id="tc-contact" className="tc-section">
          <div className="tc-sec-label"><span className="tc-sec-label-line" />Contact</div>
          <h2 className="tc-sec-h2">Let's talk</h2>
          <div className="tc-contact-list">
            {[
              personal.email && { num: "01", type: "Email", val: personal.email, href: `mailto:${personal.email}` },
              personal.phone && { num: "02", type: "Phone", val: personal.phone, href: `tel:${personal.phone}` },
              personal.linkedinUrl && { num: "03", type: "LinkedIn", val: personal.linkedinUrl.replace(/^https?:\/\//, ""), href: personal.linkedinUrl },
              personal.githubUrl && { num: "04", type: "GitHub", val: personal.githubUrl.replace(/^https?:\/\//, ""), href: personal.githubUrl },
              personal.websiteUrl && { num: "05", type: "Website", val: personal.websiteUrl.replace(/^https?:\/\//, ""), href: personal.websiteUrl },
              personal.location && { num: "06", type: "Location", val: personal.location, href: null },
            ]
              .filter(Boolean)
              .map((row: any, i) =>
                row.href ? (
                  <a
                    key={i}
                    href={row.href}
                    target={row.href.startsWith("http") ? "_blank" : undefined}
                    rel={row.href.startsWith("http") ? "noreferrer" : undefined}
                    className="tc-contact-row"
                    style={{ transitionDelay: `${i * 0.07}s` }}
                  >
                    <span className="tc-cr-num">{row.num}</span>
                    <span className="tc-cr-type">{row.type}</span>
                    <span className="tc-cr-val">{row.val}</span>
                    <span className="tc-cr-arr">↗</span>
                  </a>
                ) : (
                  <div key={i} className="tc-contact-row" style={{ transitionDelay: `${i * 0.07}s`, cursor: "default" }}>
                    <span className="tc-cr-num">{row.num}</span>
                    <span className="tc-cr-type">{row.type}</span>
                    <span className="tc-cr-val">{row.val}</span>
                    <span className="tc-cr-arr" style={{ opacity: 0 }}>↗</span>
                  </div>
                )
              )}
          </div>
          <div className="tc-avail">
            <div className="tc-avail-dot" />
            <div className="tc-avail-text">
              <strong>Available for work</strong> — Open to new roles and collaborations.
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="tc-footer">
          <div className="tc-footer-name">{personal.fullName}</div>
          <div className="tc-footer-copy">© {new Date().getFullYear()} — Built with PortfolioAI</div>
        </footer>

        <TCEffects navSections={navSections} totalSections={totalSections} />
      </div>
    </>
  )
}

// ── All DOM/scroll effects isolated here ──
function TCEffects({
  navSections,
  totalSections,
}: {
  navSections: { id: string; label: string }[]
  totalSections: number
}) {
  useEffect(() => {
    // SCROLL PROGRESS + NAV SHRINK
    const prog = document.getElementById("tc-prog")
    const nav = document.getElementById("tc-nav")
    const counter = document.getElementById("tc-count")

    const sectionIds = navSections.map((s) => s.id)

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (prog) prog.style.width = (window.scrollY / h) * 100 + "%"
      if (nav) nav.classList.toggle("tc-scrolled", window.scrollY > 60)

      // Active nav
      let cur = sectionIds[0]
      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 180) cur = id
      })
      document.querySelectorAll(".tc-nav-links a").forEach((a) => {
        a.classList.toggle("tc-active", a.getAttribute("href") === `#${cur}`)
      })
      if (counter) {
        const idx = sectionIds.indexOf(cur)
        const num = String(Math.max(idx, 0) + 1).padStart(2, "0")
        const tot = String(totalSections).padStart(2, "0")
        counter.innerHTML = `<span class="tc-cur">${num}</span> / ${tot}`
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    // HAMBURGER
    const burger = document.getElementById("tc-burger")
    const mob = document.getElementById("tc-mob")
    const toggleMob = () => {
      burger?.classList.toggle("tc-open")
      mob?.classList.toggle("tc-open")
      document.body.style.overflow = mob?.classList.contains("tc-open") ? "hidden" : ""
    }
    burger?.addEventListener("click", toggleMob)

    // HERO ENTRANCE
    document.querySelectorAll(".tc-hero-word").forEach((w) =>
      setTimeout(() => w.classList.add("tc-vis"), 80)
    )
    setTimeout(() => document.querySelector(".tc-hero-bio")?.classList.add("tc-vis"), 1200)
    setTimeout(() => document.querySelector(".tc-hero-right")?.classList.add("tc-vis"), 1600)

    // INTERSECTION OBSERVER
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("tc-in"); io.unobserve(e.target) }
        }),
      { threshold: 0.1 }
    )
    document
      .querySelectorAll(".tc-sec-label,.tc-sec-h2,.tc-exp-card,.tc-proj-row,.tc-edu-card,.tc-cert-row,.tc-contact-row,.tc-reveal")
      .forEach((el) => io.observe(el))

    // STORY WORD REVEAL
    const storyEl = document.getElementById("tc-story-text")
    if (storyEl) {
      const words = storyEl.textContent?.trim().split(/\s+/) ?? []
      storyEl.innerHTML = words.map((w) => `<span class="tc-sw">${w}</span>`).join(" ")
      const swIo = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.querySelectorAll(".tc-sw").forEach((w, i) =>
                setTimeout(() => w.classList.add("tc-in"), i * 55)
              )
              swIo.unobserve(e.target)
            }
          }),
        { threshold: 0.3 }
      )
      swIo.observe(storyEl)
    }

    // EXP DRAG SCROLL
    const track = document.getElementById("tc-exp-track")
    const dots = document.querySelectorAll(".tc-exp-dot")
    if (track) {
      let down = false, sx = 0, sl = 0
      track.addEventListener("mousedown", (e) => {
        down = true; sx = e.pageX - track.offsetLeft; sl = track.scrollLeft
      })
      window.addEventListener("mouseup", () => { down = false })
      track.addEventListener("mousemove", (e) => {
        if (!down) return
        e.preventDefault()
        track.scrollLeft = sl - (e.pageX - track.offsetLeft - sx) * 1.4
      })
      track.addEventListener("scroll", () => {
        const cw = ((track.querySelector(".tc-exp-card") as HTMLElement)?.offsetWidth ?? 460) + 20
        const idx = Math.round(track.scrollLeft / cw)
        dots.forEach((d, i) => d.classList.toggle("tc-active", i === idx))
      }, { passive: true })
      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          const cw = ((track.querySelector(".tc-exp-card") as HTMLElement)?.offsetWidth ?? 460) + 20
          track.scrollTo({ left: +(dot as HTMLElement).dataset.i! * cw, behavior: "smooth" })
        })
      })
    }

    // WORK STYLE TABS
    document.querySelectorAll(".tc-ws-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const idx = (tab as HTMLElement).dataset.tab
        document.querySelectorAll(".tc-ws-tab").forEach((t) => t.classList.remove("tc-active"))
        document.querySelectorAll(".tc-ws-panel").forEach((p) => p.classList.remove("tc-active"))
        tab.classList.add("tc-active")
        document.querySelector(`.tc-ws-panel[data-panel="${idx}"]`)?.classList.add("tc-active")
      })
    })

    // SMOOTH ANCHORS
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const t = document.querySelector((a as HTMLAnchorElement).getAttribute("href")!)
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }) }
      })
    })

    return () => {
      window.removeEventListener("scroll", onScroll)
      burger?.removeEventListener("click", toggleMob)
    }
  }, [navSections, totalSections])

  return null
}
