"use client"

import { useEffect, useRef, useState } from "react"
import type { PortfolioData } from "@/types/portfolio"

// Extended type for workStylePrinciples which may be AI-generated
type PulsePortfolioData = PortfolioData & {
  workStylePrinciples?: { heading: string; body: string }[]
}

export default function TemplatePulse({ portfolioData }: { portfolioData: PulsePortfolioData }) {
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
  } = portfolioData

  // ── State ────────────────────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [roleIdx, setRoleIdx] = useState(0)
  const [openExp, setOpenExp] = useState<number | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 })
  const [visibleEls, setVisibleEls] = useState<Set<string>>(new Set())
  const [langBarsOn, setLangBarsOn] = useState(false)
  const [eduOn, setEduOn] = useState(false)

  const ringRef = useRef({ x: -100, y: -100 })
  const mouseRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number | null>(null)

  // ── Cursor ───────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", onMove)
    const animRing = () => {
      ringRef.current.x += (mouseRef.current.x - ringRef.current.x) * 0.1
      ringRef.current.y += (mouseRef.current.y - ringRef.current.y) * 0.1
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y })
      rafRef.current = requestAnimationFrame(animRing)
    }
    rafRef.current = requestAnimationFrame(animRing)
    return () => {
      window.removeEventListener("mousemove", onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ── Scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    const secs = ["hero","tagline","story","exp","proj","skills","edu","certs","extras","ws","lf","contact"]
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      let cur = "hero"
      secs.forEach(id => {
        const el = document.getElementById(`tp-${id}`)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) cur = id
      })
      setActiveSection(cur)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ── Slot machine role ────────────────────────────────────────────
  const roles = [
    personal.professionalTitle || "Professional",
    personal.professionalTitle || "Professional",
  ]
  const roleItems = roles.length > 1 ? roles : [roles[0], roles[0]]

  useEffect(() => {
    const iv = setInterval(() => {
      setRoleIdx(i => (i + 1) % (roleItems.length - 1))
    }, 2700)
    return () => clearInterval(iv)
  }, [roleItems.length])

  // ── IntersectionObserver ─────────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.target.id) {
            const id = e.target.id
            setVisibleEls(prev => new Set([...prev, id]))
            if (id === "tp-lang-list") setLangBarsOn(true)
            if (id === "tp-edu-0" || id === "tp-edu-1") setEduOn(true)
          }
        })
      },
      { threshold: 0.08 }
    )
    setTimeout(() => {
      document.querySelectorAll("[data-tp-obs]").forEach(el => {
        if (el.id) obs.observe(el)
      })
    }, 100)
    return () => obs.disconnect()
  }, [])

  // ── Helpers ──────────────────────────────────────────────────────
  const vis = (id: string) => visibleEls.has(id)

  const skillsByCategory = skills?.reduce<Record<string, { name: string; level: number }[]>>((acc, s) => {
    const cat = s.category || "General"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push({ name: s.name, level: (s as any).level ?? 80 })
    return acc
  }, {}) ?? {}

  const profMap: Record<string, number> = {
    Native: 100, Fluent: 88, Professional: 72, Conversational: 50, Basic: 28,
  }

  // Ring circumference = 2π × 19 ≈ 119.4 — we use 126 with stroke padding
  const ringOffset = (level: number) => Math.round(126 * (1 - level / 100))

  const nameParts = personal.fullName?.split(" ") ?? ["Your", "Name"]
  const initials = nameParts.map(n => n[0]).join("").slice(0, 2).toUpperCase()

  const principles = workStylePrinciples ?? []

  const railSecs = [
    { id: "hero", n: "01" },
    { id: "tagline", n: "02" },
    { id: "story", n: "03" },
    { id: "exp", n: "04" },
    { id: "proj", n: "05" },
    { id: "lf", n: "11" },
  ]

  // ── CSS ──────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&family=Epilogue:wght@300;400;500;600&display=swap');

    :root {
      --tp-bg: #F8F9FB;
      --tp-surf: #EEEEF2;
      --tp-ink: #0E0E1A;
      --tp-ink2: #2D2D3F;
      --tp-dim: #8E8FA8;
      --tp-acc: #5C6FFF;
      --tp-acc2: #00C9A7;
      --tp-al: rgba(92,111,255,.08);
      --tp-bdr: rgba(14,14,26,.07);
      --tp-bmed: rgba(14,14,26,.12);
      --tp-rail: 64px;
      --sy: 'Syne', sans-serif;
      --ep: 'Epilogue', sans-serif;
      --dm: 'DM Mono', monospace;
    }

    .tp-root { font-family: var(--ep); color: var(--ink); background: var(--tp-bg); overflow-x: hidden; cursor: none; }
    .tp-root * { box-sizing: border-box; margin: 0; padding: 0; }
    @media (max-width: 768px) { .tp-root { cursor: auto; } .tp-root a, .tp-root button { cursor: pointer; } .tp-cursor, .tp-ring { display: none !important; } }

    /* CURSOR */
    .tp-cursor { position: fixed; width: 10px; height: 10px; background: var(--tp-acc); border-radius: 50%; pointer-events: none; z-index: 10000; transform: translate(-50%,-50%); mix-blend-mode: multiply; }
    .tp-ring { position: fixed; width: 40px; height: 40px; border: 1.5px solid var(--tp-acc); border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%,-50%); opacity: .35; transition: width .3s, height .3s, opacity .3s; }

    /* RAIL */
    .tp-rail { position: fixed; left: 0; top: 0; bottom: 0; width: var(--tp-rail); display: flex; flex-direction: column; align-items: center; padding: 32px 0; z-index: 100; border-right: 1px solid var(--tp-bdr); background: var(--tp-bg); }
    .tp-rail-logo { font-family: var(--sy); font-size: 10px; font-weight: 800; letter-spacing: .18em; color: var(--tp-acc); writing-mode: vertical-rl; transform: rotate(180deg); margin-bottom: auto; }
    .tp-rail-nums { display: flex; flex-direction: column; gap: 14px; align-items: center; margin: auto 0; }
    .tp-rail-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--tp-dim); opacity: .3; transition: background .3s, opacity .3s; }
    .tp-rail-dot.on { background: var(--tp-acc); opacity: 1; }
    .tp-rail-line { width: 1px; height: 24px; background: var(--tp-bdr); }
    .tp-rail-num { font-family: var(--dm); font-size: 9px; letter-spacing: .08em; color: var(--tp-dim); writing-mode: vertical-rl; transform: rotate(180deg); transition: color .3s; opacity: .35; }
    .tp-rail-num.on { color: var(--tp-acc); opacity: 1; font-weight: 500; }
    @media (max-width: 960px) { .tp-rail { display: none; } }

    /* MOBILE NAV */
    .tp-mnav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: none; align-items: center; justify-content: space-between; padding: 16px 24px; background: rgba(248,249,251,.93); backdrop-filter: blur(14px); border-bottom: 1px solid transparent; transition: border-color .3s; }
    .tp-mnav.sc { border-color: var(--tp-bdr); }
    .tp-mnav-logo { font-family: var(--sy); font-size: 16px; font-weight: 800; color: var(--tp-ink); letter-spacing: -.02em; }
    .tp-burger { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
    .tp-burger span { display: block; width: 22px; height: 1.5px; background: var(--tp-ink); transition: all .3s; }
    .tp-burger.op span:nth-child(1) { transform: rotate(45deg) translate(4px,4px); }
    .tp-burger.op span:nth-child(2) { opacity: 0; }
    .tp-burger.op span:nth-child(3) { transform: rotate(-45deg) translate(4px,-4px); }
    @media (max-width: 960px) { .tp-mnav { display: flex; } }

    /* OVERLAY */
    .tp-ov { position: fixed; inset: 0; background: var(--tp-ink); z-index: 190; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; opacity: 0; pointer-events: none; transition: opacity .4s; }
    .tp-ov.op { opacity: 1; pointer-events: all; }
    .tp-ov-lnk { font-family: var(--sy); font-size: clamp(28px,7vw,52px); font-weight: 800; color: rgba(248,249,251,.25); text-decoration: none; letter-spacing: -.02em; transition: color .3s; }
    .tp-ov-lnk:hover { color: var(--tp-acc); }

    /* WRAP */
    .tp-wrap { margin-left: var(--tp-rail); }
    @media (max-width: 960px) { .tp-wrap { margin-left: 0; padding-top: 60px; } }

    /* TICKER */
    .tp-ticker { width: 100%; overflow: hidden; background: var(--tp-acc); padding: 10px 0; display: flex; white-space: nowrap; }
    .tp-ticker.dark { background: #0E0E1A; }
    .tp-ticker-track { display: inline-flex; animation: tp-tick 22s linear infinite; white-space: nowrap; }
    .tp-ticker-track.rev { animation-direction: reverse; }
    .tp-ti { font-family: var(--sy); font-size: 11px; font-weight: 800; letter-spacing: .2em; color: rgba(255,255,255,.9); margin: 0 36px; }
    .tp-td { color: rgba(255,255,255,.35); }
    .tp-td.dim { color: rgba(92,111,255,.5); }
    @keyframes tp-tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    /* ══ HERO ══ */
    .tp-hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; position: relative; overflow: hidden; }

    .tp-hero-l { display: flex; flex-direction: column; justify-content: center; padding: 110px 56px 80px 80px; position: relative; z-index: 2; background: var(--tp-bg); }
    .tp-hero-l::before { content: attr(data-init); position: absolute; font-family: var(--sy); font-weight: 800; font-size: 55vw; color: var(--tp-ink); opacity: .025; line-height: 1; top: -10%; left: -15%; pointer-events: none; z-index: 0; }

    .tp-hero-eye { display: flex; align-items: center; gap: 10px; font-family: var(--dm); font-size: 10px; letter-spacing: .18em; color: var(--tp-acc); margin-bottom: 28px; position: relative; z-index: 1; opacity: 0; animation: tp-up .8s cubic-bezier(.22,1,.36,1) .3s forwards; }
    .tp-avail-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--tp-acc2); animation: tp-pulse 2s infinite; }

    .tp-hero-name { font-family: var(--sy); font-weight: 800; font-size: clamp(52px,6.5vw,96px); line-height: .9; letter-spacing: -.04em; color: var(--tp-ink); position: relative; z-index: 1; overflow: hidden; margin-bottom: 20px; }
    .tp-hw { display: block; transform: rotateX(90deg) translateY(60%); opacity: 0; animation: tp-flip 1s cubic-bezier(.22,1,.36,1) forwards; transform-origin: bottom center; }
    .tp-hw:nth-child(1) { animation-delay: .45s; }
    .tp-hw:nth-child(2) { animation-delay: .6s; color: var(--tp-acc); }

    .tp-hero-role-wrap { height: 1.55em; overflow: hidden; margin-bottom: 22px; position: relative; z-index: 1; opacity: 0; animation: tp-up .8s cubic-bezier(.22,1,.36,1) .85s forwards; }
    .tp-hero-role-track { display: flex; flex-direction: column; transition: transform .75s cubic-bezier(.76,0,.24,1); }
    .tp-hero-role-item { font-family: var(--ep); font-size: clamp(15px,1.7vw,21px); font-weight: 300; color: var(--tp-ink2); height: 1.55em; display: flex; align-items: center; white-space: nowrap; }

    .tp-hero-bio { font-family: var(--ep); font-size: 15px; line-height: 1.75; color: var(--tp-dim); max-width: 420px; margin-bottom: 36px; position: relative; z-index: 1; opacity: 0; animation: tp-up .8s cubic-bezier(.22,1,.36,1) 1s forwards; }

    .tp-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 44px; position: relative; z-index: 1; opacity: 0; animation: tp-up .8s cubic-bezier(.22,1,.36,1) 1.15s forwards; }
    .tp-btn-p { font-family: var(--dm); font-size: 11px; letter-spacing: .1em; color: #fff; background: var(--tp-acc); border: none; padding: 14px 26px; border-radius: 100px; cursor: none; text-decoration: none; display: inline-block; transition: transform .3s cubic-bezier(.22,1,.36,1), background .3s; }
    .tp-btn-p:hover { background: #4a5cee; transform: scale(1.05) translateY(-2px); }
    .tp-btn-o { font-family: var(--dm); font-size: 11px; letter-spacing: .1em; color: var(--tp-ink); background: transparent; border: 1.5px solid var(--tp-bmed); padding: 14px 26px; border-radius: 100px; cursor: none; text-decoration: none; display: inline-block; transition: all .3s cubic-bezier(.22,1,.36,1); }
    .tp-btn-o:hover { border-color: var(--tp-acc); color: var(--tp-acc); transform: scale(1.05) translateY(-2px); }

    .tp-hero-links { display: flex; gap: 20px; flex-wrap: wrap; position: relative; z-index: 1; opacity: 0; animation: tp-up .8s cubic-bezier(.22,1,.36,1) 1.3s forwards; }
    .tp-hero-lnk { font-family: var(--dm); font-size: 10px; letter-spacing: .1em; color: var(--tp-dim); text-decoration: none; display: flex; align-items: center; gap: 6px; transition: color .2s; cursor: none; }
    .tp-hero-lnk::before { content: '·'; opacity: .5; }
    .tp-hero-lnk:hover { color: var(--tp-acc); }

    .tp-hero-r { position: relative; display: flex; align-items: center; justify-content: center; background: var(--tp-surf); overflow: hidden; }
    .tp-hero-r::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(var(--tp-bdr) 1px, transparent 1px), linear-gradient(90deg, var(--tp-bdr) 1px, transparent 1px); background-size: 40px 40px; opacity: .6; }
    .tp-hero-svg { position: relative; z-index: 1; width: min(300px,70%); opacity: 0; animation: tp-up .9s cubic-bezier(.22,1,.36,1) .8s forwards; }

    @keyframes tp-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes tp-flip { to { transform: rotateX(0) translateY(0); opacity: 1; } }
    @keyframes tp-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.6); opacity: .4; } }
    @keyframes tp-spinFwd { to { transform: rotate(360deg); } }
    @keyframes tp-spinRev { to { transform: rotate(-360deg); } }
    @keyframes tp-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes tp-breatheR { 0%,100% { transform: scale(1); } 50% { transform: scale(.96); } }

    @media (max-width: 960px) {
      .tp-hero { grid-template-columns: 1fr; min-height: auto; }
      .tp-hero-l { padding: 80px 40px 48px; order: 1; }
      .tp-hero-r { order: 2; min-height: 320px; }
    }
    @media (max-width: 600px) {
      .tp-hero-l { padding: 64px 20px 36px; }
      .tp-hero-r { min-height: 260px; }
    }

    /* ══ SHARED ══ */
    .tp-sp { padding: 120px 80px; }
    @media (max-width: 960px) { .tp-sp { padding: 80px 40px; } }
    @media (max-width: 600px) { .tp-sp { padding: 60px 20px; } }

    .tp-rv { opacity: 0; transform: translateY(24px); transition: opacity .8s ease, transform .8s cubic-bezier(.22,1,.36,1); }
    .tp-rv.on { opacity: 1; transform: translateY(0); }
    .tp-rv-l { opacity: 0; transform: translateX(-32px); transition: opacity .8s ease, transform .8s cubic-bezier(.22,1,.36,1); }
    .tp-rv-l.on { opacity: 1; transform: translateX(0); }
    .tp-rv-r { opacity: 0; transform: translateX(32px); transition: opacity .8s ease, transform .8s cubic-bezier(.22,1,.36,1); }
    .tp-rv-r.on { opacity: 1; transform: translateX(0); }

    .tp-sec-label { font-family: var(--dm); font-size: 9px; letter-spacing: .2em; color: var(--tp-acc); margin-bottom: 16px; }
    .tp-big-title { font-family: var(--sy); font-size: clamp(34px,5vw,68px); font-weight: 800; letter-spacing: -.04em; color: var(--tp-ink); line-height: 1; margin-bottom: 56px; }
    .tp-big-title em { color: var(--tp-acc); font-style: normal; }

    /* ══ TAGLINE ══ */
    .tp-tagline-sec { padding: 100px 80px; background: var(--tp-acc); }
    @media (max-width: 960px) { .tp-tagline-sec { padding: 80px 40px; } }
    @media (max-width: 600px) { .tp-tagline-sec { padding: 60px 20px; } }
    .tp-tq-label { font-family: var(--dm); font-size: 9px; letter-spacing: .2em; color: rgba(255,255,255,.5); margin-bottom: 36px; }
    .tp-tq-words { display: flex; flex-wrap: wrap; gap: 10px 14px; max-width: 1000px; }
    .tp-tq-pill { font-family: var(--sy); font-size: clamp(20px,3.2vw,48px); font-weight: 800; color: #fff; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); border-radius: 100px; padding: .12em .45em; opacity: 0; transform: scale(.75) translateY(24px); transition: opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1); }
    .tp-tq-pill.on { opacity: 1; transform: scale(1) translateY(0); }

    /* ══ STORY ══ */
    .tp-story-sec { background: var(--tp-bg); padding: 120px 80px; }
    @media (max-width: 960px) { .tp-story-sec { padding: 80px 40px; } }
    @media (max-width: 600px) { .tp-story-sec { padding: 60px 20px; } }
    .tp-story-grid { display: grid; grid-template-columns: 240px 1fr; gap: 80px; max-width: 1100px; align-items: start; }
    .tp-story-l { position: sticky; top: 140px; }
    .tp-story-big { font-family: var(--sy); font-weight: 800; font-size: clamp(80px,14vw,200px); color: var(--tp-ink); opacity: .04; line-height: .85; letter-spacing: -.05em; user-select: none; }
    .tp-story-q { font-family: var(--sy); font-weight: 800; font-size: 160px; color: var(--tp-acc); opacity: .12; line-height: .7; user-select: none; margin-top: -10px; }
    .tp-story-heading { font-family: var(--sy); font-size: clamp(26px,3.2vw,44px); font-weight: 800; letter-spacing: -.03em; color: var(--tp-ink); margin-bottom: 32px; line-height: 1.1; }
    .tp-story-heading span { color: var(--tp-acc); }
    .tp-story-mask { overflow: hidden; margin-bottom: .8em; }
    .tp-story-line { font-family: var(--ep); font-size: clamp(15px,1.6vw,17px); line-height: 1.85; color: var(--tp-ink2); transform: translateY(105%); transition: transform .9s cubic-bezier(.22,1,.36,1); }
    .tp-story-line.on { transform: translateY(0); }
    @media (max-width: 768px) { .tp-story-grid { grid-template-columns: 1fr; gap: 36px; } .tp-story-l { position: static; } .tp-story-q { display: none; } }

    /* ══ EXPERIENCE ══ */
    .tp-exp-sec { background: var(--tp-surf); padding: 120px 80px; }
    @media (max-width: 960px) { .tp-exp-sec { padding: 80px 40px; } }
    @media (max-width: 600px) { .tp-exp-sec { padding: 60px 20px; } }
    .tp-exp-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 56px; gap: 20px; flex-wrap: wrap; }
    .tp-exp-count { font-family: var(--dm); font-size: 11px; letter-spacing: .1em; color: var(--tp-dim); }
    .tp-exp-row { display: grid; grid-template-columns: 120px 1fr auto; gap: 40px; align-items: start; padding: 36px 0; border-top: 1px solid var(--tp-bdr); cursor: pointer; position: relative; overflow: hidden; }
    .tp-exp-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: var(--tp-al); transition: width .5s cubic-bezier(.22,1,.36,1); }
    .tp-exp-row:hover::before, .tp-exp-row.op::before { width: 100%; }
    .tp-exp-row:last-child { border-bottom: 1px solid var(--tp-bdr); }
    .tp-exp-stripe { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--tp-acc); transform: scaleY(0); transition: transform .4s cubic-bezier(.22,1,.36,1); transform-origin: top; }
    .tp-exp-row.op .tp-exp-stripe { transform: scaleY(1); }
    .tp-exp-year { font-family: var(--dm); font-size: 11px; letter-spacing: .08em; color: var(--tp-dim); padding-top: 6px; }
    .tp-exp-co { font-family: var(--sy); font-size: clamp(18px,2.2vw,30px); font-weight: 800; letter-spacing: -.02em; color: var(--tp-ink); margin-bottom: 4px; transition: color .3s; }
    .tp-exp-row:hover .tp-exp-co, .tp-exp-row.op .tp-exp-co { color: var(--tp-acc); }
    .tp-exp-role { font-family: var(--ep); font-size: 14px; color: var(--tp-dim); }
    .tp-exp-arr { font-size: 22px; color: var(--tp-dim); transition: transform .4s cubic-bezier(.22,1,.36,1), color .3s; padding-top: 4px; user-select: none; }
    .tp-exp-row.op .tp-exp-arr { transform: rotate(45deg); color: var(--tp-acc); }
    .tp-exp-detail { grid-column: 1/-1; max-height: 0; overflow: hidden; transition: max-height .6s cubic-bezier(.22,1,.36,1); }
    .tp-exp-detail.op { max-height: 300px; padding-top: 8px; }
    .tp-exp-detail-in { font-family: var(--ep); font-size: 15px; line-height: 1.8; color: var(--tp-ink2); max-width: 640px; padding: 0 0 20px 24px; border-left: 3px solid var(--tp-acc); }
    @media (max-width: 600px) { .tp-exp-row { grid-template-columns: 1fr auto; gap: 16px; } .tp-exp-year { display: none; } }

    /* ══ PROJECTS ══ */
    .tp-proj-sec { background: var(--tp-bg); padding: 120px 80px; }
    @media (max-width: 960px) { .tp-proj-sec { padding: 80px 40px; } }
    @media (max-width: 600px) { .tp-proj-sec { padding: 60px 20px; } }
    .tp-proj-list { display: flex; flex-direction: column; gap: 3px; }
    .tp-proj-row { display: grid; grid-template-columns: 80px 1fr 1fr; gap: 40px; align-items: center; padding: 36px 44px; background: var(--tp-surf); border-radius: 10px; position: relative; overflow: hidden; cursor: pointer; transition: transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s; }
    .tp-proj-row:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(92,111,255,.1); }
    .tp-proj-flood { position: absolute; inset: 0; background: var(--tp-acc); transform: translateX(-101%); transition: transform .7s cubic-bezier(.76,0,.24,1); z-index: 0; }
    .tp-proj-row:hover .tp-proj-flood { transform: translateX(0); }
    .tp-proj-num { font-family: var(--sy); font-size: clamp(44px,6vw,72px); font-weight: 800; letter-spacing: -.05em; color: var(--tp-ink); opacity: .07; line-height: 1; user-select: none; position: relative; z-index: 1; transition: color .4s, opacity .4s; }
    .tp-proj-row:hover .tp-proj-num { color: #fff; opacity: .15; }
    .tp-proj-l { position: relative; z-index: 1; }
    .tp-proj-name { font-family: var(--sy); font-size: clamp(17px,2vw,26px); font-weight: 800; letter-spacing: -.02em; color: var(--tp-ink); margin-bottom: 10px; transition: color .4s; }
    .tp-proj-row:hover .tp-proj-name { color: #fff; }
    .tp-proj-stack { display: flex; gap: 6px; flex-wrap: wrap; }
    .tp-proj-chip { font-family: var(--dm); font-size: 9px; letter-spacing: .08em; color: var(--tp-dim); background: var(--tp-bg); padding: 3px 10px; border-radius: 100px; transition: background .4s, color .4s; }
    .tp-proj-row:hover .tp-proj-chip { background: rgba(255,255,255,.15); color: rgba(255,255,255,.8); }
    .tp-proj-r { position: relative; z-index: 1; }
    .tp-proj-desc { font-family: var(--ep); font-size: 14px; line-height: 1.7; color: var(--tp-dim); margin-bottom: 14px; transition: color .4s; }
    .tp-proj-row:hover .tp-proj-desc { color: rgba(255,255,255,.7); }
    .tp-proj-links { display: flex; gap: 12px; }
    .tp-proj-lnk { font-family: var(--dm); font-size: 10px; letter-spacing: .1em; color: var(--tp-acc); text-decoration: none; border-bottom: 1px solid var(--tp-acc); padding-bottom: 1px; transition: color .4s, border-color .4s; cursor: none; }
    .tp-proj-row:hover .tp-proj-lnk { color: rgba(255,255,255,.9); border-color: rgba(255,255,255,.5); }
    @media (max-width: 768px) { .tp-proj-row { grid-template-columns: 56px 1fr; padding: 24px 20px; } .tp-proj-r { display: none; } }
    @media (max-width: 500px) { .tp-proj-row { grid-template-columns: 1fr; gap: 10px; } .tp-proj-num { font-size: 36px; } .tp-proj-r { display: block; } }

    /* ══ SKILLS ══ */
    .tp-skills-sec { background: var(--tp-surf); padding: 120px 80px; }
    @media (max-width: 960px) { .tp-skills-sec { padding: 80px 40px; } }
    @media (max-width: 600px) { .tp-skills-sec { padding: 60px 20px; } }
    .tp-skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 3px; }
    .tp-skill-cat { background: var(--tp-bg); border-radius: 14px; padding: 32px; }
    .tp-skill-cat-name { font-family: var(--dm); font-size: 9px; letter-spacing: .2em; color: var(--tp-acc); margin-bottom: 24px; }
    .tp-skill-row { display: flex; align-items: center; gap: 18px; margin-bottom: 18px; }
    .tp-skill-row:last-child { margin-bottom: 0; }
    .tp-ring-svg { width: 48px; height: 48px; flex-shrink: 0; }
    .tp-ring-bg { fill: none; stroke: var(--tp-bdr); stroke-width: 4; }
    .tp-ring-tr { fill: none; stroke: var(--tp-acc); stroke-width: 4; stroke-linecap: round; transform: rotate(-90deg); transform-origin: 50% 50%; stroke-dasharray: 126; transition: stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1); }
    .tp-ring-tr.t2 { stroke: var(--tp-acc2); }
    .tp-skill-name { font-family: var(--ep); font-size: 13px; font-weight: 500; color: var(--tp-ink); margin-bottom: 2px; }
    .tp-skill-lvl { font-family: var(--dm); font-size: 9px; letter-spacing: .1em; color: var(--tp-dim); }

    /* ══ EDUCATION ══ */
    .tp-edu-sec { background: var(--tp-bg); padding: 120px 80px; }
    @media (max-width: 960px) { .tp-edu-sec { padding: 80px 40px; } }
    @media (max-width: 600px) { .tp-edu-sec { padding: 60px 20px; } }
    .tp-edu-timeline { position: relative; }
    .tp-edu-line { position: absolute; top: 22px; left: 22px; right: 0; height: 1px; background: var(--tp-bdr); }
    .tp-edu-fill { height: 100%; background: var(--tp-acc); transition: width 1.2s cubic-bezier(.22,1,.36,1); }
    .tp-edu-nodes { display: flex; overflow-x: auto; padding-bottom: 32px; scrollbar-width: none; position: relative; z-index: 1; }
    .tp-edu-nodes::-webkit-scrollbar { display: none; }
    .tp-edu-node { flex-shrink: 0; width: 260px; padding-top: 52px; padding-right: 40px; position: relative; }
    .tp-edu-dot { position: absolute; top: 14px; left: 0; width: 17px; height: 17px; border-radius: 50%; background: var(--tp-bg); border: 2px solid var(--tp-bdr); transition: border-color .6s, background .6s; }
    .tp-edu-node.on .tp-edu-dot { border-color: var(--tp-acc); background: var(--tp-acc); }
    .tp-edu-yr { font-family: var(--dm); font-size: 9px; letter-spacing: .12em; color: var(--tp-acc); margin-bottom: 10px; }
    .tp-edu-deg { font-family: var(--sy); font-size: 17px; font-weight: 800; letter-spacing: -.02em; color: var(--tp-ink); margin-bottom: 4px; line-height: 1.2; }
    .tp-edu-field { font-family: var(--ep); font-size: 13px; color: var(--tp-dim); margin-bottom: 6px; }
    .tp-edu-inst { font-family: var(--ep); font-size: 14px; font-weight: 500; color: var(--tp-ink2); }

    /* ══ CERTS ══ */
    .tp-certs-sec { background: var(--tp-surf); padding: 120px 80px; }
    @media (max-width: 960px) { .tp-certs-sec { padding: 80px 40px; } }
    @media (max-width: 600px) { .tp-certs-sec { padding: 60px 20px; } }
    .tp-certs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
    .tp-cert-card { background: var(--tp-bg); border-radius: 14px; padding: 28px; position: relative; overflow: hidden; border: 1.5px solid var(--tp-bdr); transition: transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s, border-color .4s; cursor: none; }
    .tp-cert-card:hover { transform: scale(1.02) translateY(-4px); box-shadow: 0 20px 60px rgba(92,111,255,.1); border-color: var(--tp-acc); }
    .tp-cert-ribbon { position: absolute; top: 0; right: 0; width: 0; height: 0; border-style: solid; border-width: 0 40px 40px 0; border-color: transparent var(--tp-acc) transparent transparent; opacity: 0; transition: opacity .3s; }
    .tp-cert-card:hover .tp-cert-ribbon { opacity: .6; }
    .tp-cert-icon { width: 40px; height: 40px; background: var(--tp-al); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; font-size: 18px; }
    .tp-cert-name { font-family: var(--sy); font-size: 15px; font-weight: 800; color: var(--tp-ink); margin-bottom: 6px; line-height: 1.3; }
    .tp-cert-issuer { font-family: var(--ep); font-size: 12px; color: var(--tp-dim); margin-bottom: 10px; }
    .tp-cert-date { font-family: var(--dm); font-size: 9px; letter-spacing: .1em; color: var(--tp-acc); }

    /* ══ EXTRAS ══ */
    .tp-extras-sec { background: var(--tp-bg); padding: 120px 80px; }
    @media (max-width: 960px) { .tp-extras-sec { padding: 80px 40px; } }
    @media (max-width: 600px) { .tp-extras-sec { padding: 60px 20px; } }
    .tp-extras-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; max-width: 1100px; }
    @media (max-width: 768px) { .tp-extras-grid { grid-template-columns: 1fr; gap: 56px; } }
    .tp-extras-h { font-family: var(--sy); font-size: clamp(26px,3vw,40px); font-weight: 800; letter-spacing: -.03em; color: var(--tp-ink); margin-bottom: 36px; line-height: 1; }
    .tp-extras-h span { color: var(--tp-acc); }
    .tp-lang-list { display: flex; flex-direction: column; gap: 24px; }
    .tp-lang-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
    .tp-lang-name { font-family: var(--sy); font-size: 15px; font-weight: 800; color: var(--tp-ink); }
    .tp-lang-prof { font-family: var(--dm); font-size: 9px; letter-spacing: .12em; color: var(--tp-dim); }
    .tp-lang-track { height: 3px; background: var(--tp-bdr); border-radius: 100px; overflow: hidden; }
    .tp-lang-fill { height: 100%; background: var(--tp-acc2); border-radius: 100px; width: 0%; transition: width 1.4s cubic-bezier(.22,1,.36,1); }
    .tp-int-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
    .tp-int-tag { font-family: var(--ep); font-size: 13px; font-weight: 500; color: var(--tp-ink2); background: var(--tp-surf); border: 1.5px solid var(--tp-bmed); padding: 8px 15px; border-radius: 8px; transition: all .3s cubic-bezier(.22,1,.36,1); cursor: none; opacity: 0; transform: scale(.85); }
    .tp-int-tag.on { opacity: 1; transform: scale(1); }
    .tp-int-tag:hover { background: var(--tp-acc); color: #fff; border-color: var(--tp-acc); transform: scale(1.06) !important; }

    /* ══ WORK STYLE ══ */
    .tp-ws-sec { background: var(--tp-surf); padding: 120px 80px; }
    @media (max-width: 960px) { .tp-ws-sec { padding: 80px 40px; } }
    @media (max-width: 600px) { .tp-ws-sec { padding: 60px 20px; } }
    .tp-ws-top { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: end; margin-bottom: 72px; }
    @media (max-width: 768px) { .tp-ws-top { grid-template-columns: 1fr; gap: 28px; } }
    .tp-ws-title { font-family: var(--sy); font-size: clamp(34px,5vw,68px); font-weight: 800; letter-spacing: -.04em; color: var(--tp-ink); line-height: 1; }
    .tp-ws-title em { color: var(--tp-acc); font-style: normal; }
    .tp-ws-body { font-family: var(--ep); font-size: 16px; line-height: 1.8; color: var(--tp-ink2); }
    .tp-ws-row { display: grid; grid-template-columns: 72px 1fr; gap: 36px; padding: 40px 0; border-top: 1px solid var(--tp-bdr); align-items: start; }
    .tp-ws-row:last-child { border-bottom: 1px solid var(--tp-bdr); }
    .tp-ws-num { font-family: var(--sy); font-weight: 800; font-size: clamp(56px,8vw,100px); color: var(--tp-acc); opacity: .1; line-height: .85; letter-spacing: -.05em; user-select: none; }
    .tp-ws-row h3 { font-family: var(--sy); font-size: clamp(17px,2vw,24px); font-weight: 800; letter-spacing: -.02em; color: var(--tp-ink); margin-bottom: 10px; }
    .tp-ws-row p { font-family: var(--ep); font-size: 15px; line-height: 1.8; color: var(--tp-ink2); max-width: 560px; }

    /* ══ LOOKING FOR ══ */
    .tp-lf-sec { background: var(--tp-ink); padding: 140px 80px; position: relative; overflow: hidden; min-height: 80vh; display: flex; align-items: center; }
    @media (max-width: 960px) { .tp-lf-sec { padding: 100px 40px; } }
    @media (max-width: 600px) { .tp-lf-sec { padding: 80px 20px; } }
    .tp-lf-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
    .tp-lf-orb1 { width: 500px; height: 500px; background: rgba(92,111,255,.25); top: -100px; right: -100px; animation: tp-floatA 8s ease-in-out infinite; }
    .tp-lf-orb2 { width: 400px; height: 400px; background: rgba(0,201,167,.15); bottom: -80px; left: -80px; animation: tp-floatB 11s ease-in-out infinite; }
    .tp-lf-orb3 { width: 300px; height: 300px; background: rgba(92,111,255,.12); top: 50%; left: 40%; animation: tp-floatC 13s ease-in-out infinite; }
    @keyframes tp-floatA { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px,30px); } }
    @keyframes tp-floatB { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-25px); } }
    @keyframes tp-floatC { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-15px,20px); } }
    .tp-lf-in { position: relative; z-index: 1; max-width: 900px; }
    .tp-lf-label { font-family: var(--dm); font-size: 9px; letter-spacing: .22em; color: var(--tp-acc); margin-bottom: 32px; display: flex; align-items: center; gap: 14px; }
    .tp-lf-label::after { content: ''; display: block; width: 36px; height: 1px; background: var(--tp-acc); }
    .tp-lf-text { font-family: var(--sy); font-size: clamp(30px,4.5vw,64px); font-weight: 800; letter-spacing: -.03em; color: rgba(248,249,251,.85); line-height: 1.1; margin-bottom: 48px; }
    .tp-lf-btns { display: flex; gap: 14px; flex-wrap: wrap; }
    .tp-btn-acc { font-family: var(--dm); font-size: 11px; letter-spacing: .1em; color: #fff; background: var(--tp-acc); border: none; padding: 15px 30px; border-radius: 100px; cursor: none; text-decoration: none; display: inline-block; transition: transform .3s cubic-bezier(.22,1,.36,1), background .3s; }
    .tp-btn-acc:hover { transform: scale(1.05) translateY(-2px); background: #4a5cee; }
    .tp-btn-gh { font-family: var(--dm); font-size: 11px; letter-spacing: .1em; color: rgba(248,249,251,.4); background: transparent; border: 1.5px solid rgba(248,249,251,.14); padding: 15px 30px; border-radius: 100px; cursor: none; text-decoration: none; display: inline-block; transition: all .3s cubic-bezier(.22,1,.36,1); }
    .tp-btn-gh:hover { border-color: rgba(248,249,251,.6); color: rgba(248,249,251,.9); transform: scale(1.05) translateY(-2px); }

    /* ══ CONTACT ══ */
    .tp-contact-sec { background: #0A0A14; padding: 120px 80px 80px; }
    @media (max-width: 960px) { .tp-contact-sec { padding: 80px 40px 60px; } }
    @media (max-width: 600px) { .tp-contact-sec { padding: 60px 20px 40px; } }
    .tp-contact-top { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 72px; align-items: start; }
    @media (max-width: 768px) { .tp-contact-top { grid-template-columns: 1fr; gap: 40px; } }
    .tp-contact-h { font-family: var(--sy); font-size: clamp(48px,8vw,100px); font-weight: 800; letter-spacing: -.04em; color: rgba(248,249,251,.85); line-height: .88; }
    .tp-contact-h .hl { color: var(--tp-acc); }
    .tp-contact-intro { font-family: var(--ep); font-size: 15px; line-height: 1.8; color: rgba(248,249,251,.4); margin-bottom: 40px; }
    .tp-contact-items { display: flex; flex-direction: column; gap: 3px; }
    .tp-contact-item { display: flex; align-items: center; gap: 18px; padding: 18px 22px; background: rgba(248,249,251,.04); border-radius: 10px; border: 1px solid rgba(248,249,251,.06); text-decoration: none; transition: background .3s, border-color .3s, transform .3s cubic-bezier(.22,1,.36,1); cursor: none; }
    .tp-contact-item:hover { background: rgba(92,111,255,.12); border-color: rgba(92,111,255,.3); transform: translateX(6px); }
    .tp-ci-icon { width: 36px; height: 36px; background: rgba(92,111,255,.15); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; transition: background .3s; }
    .tp-contact-item:hover .tp-ci-icon { background: rgba(92,111,255,.3); }
    .tp-ci-label { font-family: var(--dm); font-size: 9px; letter-spacing: .14em; color: rgba(248,249,251,.3); margin-bottom: 2px; }
    .tp-ci-val { font-family: var(--ep); font-size: 13px; font-weight: 500; color: rgba(248,249,251,.7); word-break: break-all; }
    .tp-ci-arr { margin-left: auto; color: rgba(92,111,255,.4); font-size: 16px; transition: color .3s, transform .3s; }
    .tp-contact-item:hover .tp-ci-arr { color: var(--tp-acc); transform: translate(3px,-3px); }
    .tp-footer-bar { border-top: 1px solid rgba(248,249,251,.06); padding-top: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; }
    .tp-footer-name { font-family: var(--sy); font-size: 15px; font-weight: 800; letter-spacing: -.02em; color: rgba(248,249,251,.28); }
    .tp-footer-links { display: flex; gap: 20px; }
    .tp-footer-links a { font-family: var(--dm); font-size: 10px; letter-spacing: .1em; color: rgba(248,249,251,.22); text-decoration: none; transition: color .2s; cursor: none; }
    .tp-footer-links a:hover { color: var(--tp-acc); }
    .tp-footer-copy { font-family: var(--dm); font-size: 10px; letter-spacing: .08em; color: rgba(248,249,251,.18); }
  `

  // ── Story sentences ──────────────────────────────────────────────
  const storySentences = careerStory
    ? careerStory.split(". ").filter(Boolean).map((s, i) => ({
        text: s.trim() + (s.trim().endsWith(".") ? "" : "."),
        id: `tp-story-line-${i}`,
        delay: i * 140,
      }))
    : []

  // ── Cert icons ───────────────────────────────────────────────────
  const certIcons = ["🏅", "📜", "✦", "🎯"]

  return (
    <div className="tp-root">
      <style>{css}</style>

      {/* Cursor */}
      <div className="tp-cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="tp-ring" style={{ left: ringPos.x, top: ringPos.y }} />

      {/* ── Rail ── */}
      <div className="tp-rail">
        <div className="tp-rail-logo">PULSE</div>
        <div className="tp-rail-nums">
          {railSecs.map((s, i) => (
            <div key={s.id} style={{ display: "contents" }}>
              {i > 0 && <div className="tp-rail-line" />}
              <div className={`tp-rail-dot${activeSection === s.id ? " on" : ""}`} />
              <div className="tp-rail-line" />
              <div className={`tp-rail-num${activeSection === s.id ? " on" : ""}`}>{s.n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile nav ── */}
      <nav className={`tp-mnav${scrolled ? " sc" : ""}`}>
        <div className="tp-mnav-logo">{personal.fullName}</div>
        <button
          className={`tp-burger${mobileOpen ? " op" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>
      <div className={`tp-ov${mobileOpen ? " op" : ""}`}>
        {careerStory && <a href="#tp-story" className="tp-ov-lnk" onClick={() => setMobileOpen(false)}>About</a>}
        {experience?.length > 0 && <a href="#tp-exp" className="tp-ov-lnk" onClick={() => setMobileOpen(false)}>Experience</a>}
        {projects?.length > 0 && <a href="#tp-proj" className="tp-ov-lnk" onClick={() => setMobileOpen(false)}>Projects</a>}
        {skills?.length > 0 && <a href="#tp-skills" className="tp-ov-lnk" onClick={() => setMobileOpen(false)}>Skills</a>}
        <a href="#tp-contact" className="tp-ov-lnk" onClick={() => setMobileOpen(false)}>Contact</a>
      </div>

      <div className="tp-wrap">

        {/* ══ 01: HERO ══ */}
        <section id="tp-hero">
          <div className="tp-hero">
            {/* Left */}
            <div className="tp-hero-l" data-init={nameParts[0]?.charAt(0)}>
              <div className="tp-hero-eye">
                <span className="tp-avail-dot" />
                AVAILABLE FOR WORK · {new Date().getFullYear()}
              </div>
              <div className="tp-hero-name">
                <span className="tp-hw">{nameParts[0]}</span>
                <span className="tp-hw">{nameParts.slice(1).join(" ")}.</span>
              </div>
              <div className="tp-hero-role-wrap">
                <div
                  className="tp-hero-role-track"
                  style={{ transform: `translateY(-${roleIdx * 1.55}em)` }}
                >
                  <div className="tp-hero-role-item">{personal.professionalTitle}</div>
                  <div className="tp-hero-role-item">{personal.professionalTitle}</div>
                </div>
              </div>
              {personal.bio && <p className="tp-hero-bio">{personal.bio}</p>}
              <div className="tp-hero-actions">
                {projects?.length > 0 && <a href="#tp-proj" className="tp-btn-p">View My Work</a>}
                <a href="#tp-contact" className="tp-btn-o">Get In Touch</a>
              </div>
              <div className="tp-hero-links">
                {personal.location && <span className="tp-hero-lnk">{personal.location}</span>}
                {personal.linkedinUrl && <a href={personal.linkedinUrl} className="tp-hero-lnk" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                {personal.githubUrl && <a href={personal.githubUrl} className="tp-hero-lnk" target="_blank" rel="noopener noreferrer">GitHub</a>}
                {personal.websiteUrl && <a href={personal.websiteUrl} className="tp-hero-lnk" target="_blank" rel="noopener noreferrer">Website</a>}
              </div>
            </div>

            {/* Right — SVG graphic */}
            <div className="tp-hero-r">
              <svg className="tp-hero-svg" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g style={{ transformOrigin: "150px 150px", animation: "tp-spinFwd 30s linear infinite" }}>
                  <circle cx="150" cy="150" r="130" stroke="#5C6FFF" strokeWidth="1" strokeDasharray="6 10" opacity="0.2" />
                </g>
                <g style={{ transformOrigin: "150px 150px", animation: "tp-spinRev 20s linear infinite" }}>
                  <circle cx="150" cy="150" r="100" stroke="#5C6FFF" strokeWidth="1" strokeDasharray="3 14" opacity="0.15" />
                  <circle cx="150" cy="50" r="4" fill="#5C6FFF" opacity="0.6" />
                  <circle cx="250" cy="150" r="3" fill="#00C9A7" opacity="0.5" />
                </g>
                <g style={{ transformOrigin: "150px 150px", animation: "tp-spinFwd 14s linear infinite" }}>
                  <circle cx="150" cy="150" r="70" stroke="#5C6FFF" strokeWidth="1" opacity="0.1" />
                  <circle cx="150" cy="80" r="3.5" fill="#5C6FFF" opacity="0.4" />
                  <circle cx="220" cy="150" r="2.5" fill="#00C9A7" opacity="0.4" />
                </g>
                <g style={{ transformOrigin: "150px 150px", animation: "tp-breathe 4s ease-in-out infinite" }}>
                  <circle cx="150" cy="150" r="52" fill="#5C6FFF" opacity="0.08" />
                  <circle cx="150" cy="150" r="44" fill="#5C6FFF" opacity="0.12" />
                  <circle cx="150" cy="150" r="44" stroke="#5C6FFF" strokeWidth="1.5" opacity="0.4" />
                  <text x="150" y="158" textAnchor="middle" fontFamily="Syne,sans-serif" fontWeight="800" fontSize="22" fill="#5C6FFF" opacity="0.9">{initials}</text>
                </g>
                <g style={{ transformOrigin: "150px 150px", animation: "tp-breatheR 4s ease-in-out infinite" }}>
                  <circle cx="150" cy="94" r="3" fill="#5C6FFF" opacity="0.5" />
                  <circle cx="150" cy="206" r="3" fill="#5C6FFF" opacity="0.5" />
                  <circle cx="94" cy="150" r="3" fill="#00C9A7" opacity="0.45" />
                  <circle cx="206" cy="150" r="3" fill="#00C9A7" opacity="0.45" />
                </g>
                <line x1="150" y1="20" x2="150" y2="280" stroke="#0E0E1A" strokeWidth="1" strokeDasharray="2 8" opacity="0.08" />
                <line x1="20" y1="150" x2="280" y2="150" stroke="#0E0E1A" strokeWidth="1" strokeDasharray="2 8" opacity="0.08" />
              </svg>
            </div>
          </div>
        </section>

        {/* ── Ticker 1 ── */}
        <div className="tp-ticker">
          <div className="tp-ticker-track">
            {[personal.fullName, personal.professionalTitle, personal.location, "AVAILABLE FOR WORK"].filter(Boolean).flatMap((t, i) => [
              <span key={`ti-${i}`} className="tp-ti">{t!.toUpperCase()}</span>,
              <span key={`td-${i}`} className="tp-td">·</span>,
            ])}
            {[personal.fullName, personal.professionalTitle, personal.location, "AVAILABLE FOR WORK"].filter(Boolean).flatMap((t, i) => [
              <span key={`ti2-${i}`} className="tp-ti">{t!.toUpperCase()}</span>,
              <span key={`td2-${i}`} className="tp-td">·</span>,
            ])}
          </div>
        </div>

        {/* ══ 02: TAGLINE ══ */}
        {tagline && (
          <section id="tp-tagline" className="tp-tagline-sec">
            <div className="tp-tq-label">— DEFINING STATEMENT</div>
            <div className="tp-tq-words">
              {tagline.split(" ").map((word, i) => (
                <div
                  key={i}
                  id={`tp-tq-pill-${i}`}
                  data-tp-obs
                  className={`tp-tq-pill${vis(`tp-tq-pill-${i}`) ? " on" : ""}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {word}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ 03: STORY ══ */}
        {careerStory && (
          <section id="tp-story" className="tp-story-sec">
            <div className="tp-story-grid">
              <div className="tp-story-l">
                <div className="tp-sec-label">— PREFACE</div>
                <div className="tp-story-big">03</div>
                <div className="tp-story-q">&ldquo;</div>
              </div>
              <div>
                <h2 className="tp-story-heading">
                  The <span>human</span> behind the work.
                </h2>
                {storySentences.map(s => (
                  <div key={s.id} className="tp-story-mask">
                    <p
                      id={s.id}
                      data-tp-obs
                      className={`tp-story-line${vis(s.id) ? " on" : ""}`}
                      style={{ transitionDelay: `${s.delay}ms` }}
                    >
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ 04: EXPERIENCE ══ */}
        {experience?.length > 0 && (
          <section id="tp-exp" className="tp-exp-sec">
            <div className="tp-exp-header">
              <div className="tp-big-title" style={{ marginBottom: 0 }}>Experience</div>
              <div className="tp-exp-count">{experience.length} ROLES</div>
            </div>
            {experience.map((e, i) => (
              <div
                key={i}
                className={`tp-exp-row${openExp === i ? " op" : ""}`}
                onClick={() => setOpenExp(openExp === i ? null : i)}
              >
                <div className="tp-exp-stripe" />
                <div className="tp-exp-year">
                  {e.startDate} – {e.isCurrent ? "NOW" : e.endDate}
                </div>
                <div>
                  <div className="tp-exp-co">{e.companyName}</div>
                  <div className="tp-exp-role">
                    {e.roleTitle}{e.location ? ` · ${e.location}` : ""}
                  </div>
                  <div className={`tp-exp-detail${openExp === i ? " op" : ""}`}>
                    <div className="tp-exp-detail-in">{e.description}</div>
                  </div>
                </div>
                <div className="tp-exp-arr">+</div>
              </div>
            ))}
          </section>
        )}

        {/* ── Ticker 2 ── */}
        {skills?.length > 0 && (
          <div className="tp-ticker dark">
            <div className="tp-ticker-track rev">
              {(skills.slice(0, 6).map(s => s.name).concat(skills.slice(0, 6).map(s => s.name))).flatMap((name, i) => [
                <span key={`ts-${i}`} className="tp-ti">{name.toUpperCase()}</span>,
                <span key={`tsd-${i}`} className="tp-td dim">·</span>,
              ])}
            </div>
          </div>
        )}

        {/* ══ 05: PROJECTS ══ */}
        {projects?.length > 0 && (
          <section id="tp-proj" className="tp-proj-sec">
            <div className="tp-big-title">Selected <em>work</em></div>
            <div className="tp-proj-list">
              {projects.map((p, i) => (
                <div
                  key={i}
                  id={`tp-proj-${i}`}
                  data-tp-obs
                  className={`tp-proj-row tp-rv${vis(`tp-proj-${i}`) ? " on" : ""}`}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="tp-proj-flood" />
                  <div className="tp-proj-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="tp-proj-l">
                    <div className="tp-proj-name">{p.projectName}</div>
                    <div className="tp-proj-stack">
                      {p.techStack.map((t, j) => (
                        <span key={j} className="tp-proj-chip">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="tp-proj-r">
                    {p.description && <div className="tp-proj-desc">{p.description}</div>}
                    <div className="tp-proj-links">
                      {p.liveUrl && <a href={p.liveUrl} className="tp-proj-lnk" target="_blank" rel="noopener noreferrer">View →</a>}
                      {p.githubUrl && <a href={p.githubUrl} className="tp-proj-lnk" target="_blank" rel="noopener noreferrer">Code →</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ 06: SKILLS ══ */}
        {skills?.length > 0 && (
          <section id="tp-skills" className="tp-skills-sec">
            <div className="tp-big-title">Skills</div>
            <div className="tp-skills-grid">
              {Object.entries(skillsByCategory).map(([cat, items], ci) => (
                <div
                  key={ci}
                  id={`tp-skill-cat-${ci}`}
                  data-tp-obs
                  className={`tp-skill-cat tp-rv${vis(`tp-skill-cat-${ci}`) ? " on" : ""}`}
                  style={{ transitionDelay: `${ci * 100}ms` }}
                >
                  <div className="tp-skill-cat-name">{cat.toUpperCase()}</div>
                  {items.map((s, si) => (
                    <div key={si} className="tp-skill-row">
                      <svg className="tp-ring-svg" viewBox="0 0 42 42">
                        <circle className="tp-ring-bg" cx="21" cy="21" r="19" />
                        <circle
                          className={`tp-ring-tr${ci === 1 ? " t2" : ""}`}
                          cx="21" cy="21" r="19"
                          style={{
                            strokeDashoffset: vis(`tp-skill-cat-${ci}`) ? ringOffset(s.level) : 126,
                          }}
                        />
                      </svg>
                      <div>
                        <div className="tp-skill-name">{s.name}</div>
                        <div className="tp-skill-lvl">{s.level}% proficiency</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ 07: EDUCATION ══ */}
        {education?.length > 0 && (
          <section id="tp-edu" className="tp-edu-sec">
            <div className="tp-big-title">Education</div>
            <div className="tp-edu-timeline">
              <div className="tp-edu-line">
                <div className="tp-edu-fill" style={{ width: eduOn ? "100%" : "0%" }} />
              </div>
              <div className="tp-edu-nodes">
                {education.map((e, i) => (
                  <div
                    key={i}
                    id={`tp-edu-${i}`}
                    data-tp-obs
                    className={`tp-edu-node${eduOn ? " on" : ""}`}
                    style={{ transitionDelay: `${i * 150}ms` }}
                  >
                    <div className="tp-edu-dot" />
                    {(e.startYear || e.endYear) && (
                      <div className="tp-edu-yr">
                        {e.startYear}{e.endYear ? ` – ${e.endYear}` : ""}
                      </div>
                    )}
                    <div className="tp-edu-deg">
                      {e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}
                    </div>
                    <div className="tp-edu-inst">{e.institution}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ 08: CERTS ══ */}
        {certifications?.length > 0 && (
          <section id="tp-certs" className="tp-certs-sec">
            <div className="tp-big-title">Certifications</div>
            <div className="tp-certs-grid">
              {certifications.map((c, i) => (
                <div
                  key={i}
                  id={`tp-cert-${i}`}
                  data-tp-obs
                  className={`tp-cert-card tp-rv${vis(`tp-cert-${i}`) ? " on" : ""}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="tp-cert-ribbon" />
                  <div className="tp-cert-icon">{certIcons[i % certIcons.length]}</div>
                  <div className="tp-cert-name">{c.name}</div>
                  {c.issuer && <div className="tp-cert-issuer">{c.issuer}</div>}
                  {c.date && <div className="tp-cert-date">{c.date}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ 09: EXTRAS ══ */}
        {(languages?.length > 0 || interests?.length > 0) && (
          <section id="tp-extras" className="tp-extras-sec">
            <div className="tp-extras-grid">
              {languages?.length > 0 && (
                <div>
                  <div className="tp-extras-h">Lang<span>uages</span></div>
                  <div className="tp-lang-list" id="tp-lang-list" data-tp-obs>
                    {languages.map((l, i) => (
                      <div key={i}>
                        <div className="tp-lang-top">
                          <div className="tp-lang-name">{l.language}</div>
                          <div className="tp-lang-prof">{l.proficiency}</div>
                        </div>
                        <div className="tp-lang-track">
                          <div
                            className="tp-lang-fill"
                            style={{
                              width: langBarsOn ? `${profMap[l.proficiency] ?? 50}%` : "0%",
                              transitionDelay: `${i * 150}ms`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {interests?.length > 0 && (
                <div>
                  <div className="tp-extras-h">Inter<span>ests</span></div>
                  <div className="tp-int-cloud">
                    {interests.map((t, i) => (
                      <div
                        key={i}
                        id={`tp-int-${i}`}
                        data-tp-obs
                        className={`tp-int-tag${vis(`tp-int-${i}`) ? " on" : ""}`}
                        style={{ transitionDelay: `${i * 55}ms` }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══ 10: WORK STYLE ══ */}
        {(workStyle || principles.length > 0) && (
          <section id="tp-ws" className="tp-ws-sec">
            <div className="tp-ws-top">
              <div className="tp-ws-title">How I <em>operate</em></div>
              {workStyle && <div className="tp-ws-body">{workStyle}</div>}
            </div>
            {principles.map((p, i) => (
              <div
                key={i}
                id={`tp-ws-${i}`}
                data-tp-obs
                className={`tp-ws-row ${i % 2 === 0 ? "tp-rv-l" : "tp-rv-r"}${vis(`tp-ws-${i}`) ? " on" : ""}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="tp-ws-num">0{i + 1}</div>
                <div>
                  <h3>{p.heading}</h3>
                  <p>{p.body}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ══ 11: LOOKING FOR ══ */}
        {lookingFor && (
          <section id="tp-lf" className="tp-lf-sec">
            <div className="tp-lf-orb tp-lf-orb1" />
            <div className="tp-lf-orb tp-lf-orb2" />
            <div className="tp-lf-orb tp-lf-orb3" />
            <div className="tp-lf-in">
              <div className="tp-lf-label">WHAT&apos;S NEXT</div>
              <div
                id="tp-lf-text"
                data-tp-obs
                className={`tp-lf-text tp-rv${vis("tp-lf-text") ? " on" : ""}`}
              >
                {lookingFor}
              </div>
              <div
                id="tp-lf-btns"
                data-tp-obs
                className={`tp-lf-btns tp-rv${vis("tp-lf-btns") ? " on" : ""}`}
                style={{ transitionDelay: "200ms" }}
              >
                {personal.email && (
                  <a href={`mailto:${personal.email}`} className="tp-btn-acc">
                    Start a conversation
                  </a>
                )}
                <a href="#tp-contact" className="tp-btn-gh">View contacts</a>
              </div>
            </div>
          </section>
        )}

        {/* ══ 12: CONTACT ══ */}
        <section id="tp-contact" className="tp-contact-sec">
          <div className="tp-contact-top">
            <div className="tp-contact-h">
              Get in<br /><span className="hl">touch.</span>
            </div>
            <div>
              <p className="tp-contact-intro">
                Open to new opportunities, collaborations, and conversations.
                {personal.email && " The best way to reach me is by email."}
              </p>
              <div className="tp-contact-items">
                {personal.email && (
                  <a href={`mailto:${personal.email}`} className="tp-contact-item">
                    <div className="tp-ci-icon">✉</div>
                    <div><div className="tp-ci-label">EMAIL</div><div className="tp-ci-val">{personal.email}</div></div>
                    <div className="tp-ci-arr">↗</div>
                  </a>
                )}
                {personal.phone && (
                  <a href={`tel:${personal.phone}`} className="tp-contact-item">
                    <div className="tp-ci-icon">☎</div>
                    <div><div className="tp-ci-label">PHONE</div><div className="tp-ci-val">{personal.phone}</div></div>
                    <div className="tp-ci-arr">↗</div>
                  </a>
                )}
                {personal.location && (
                  <div className="tp-contact-item">
                    <div className="tp-ci-icon">⌖</div>
                    <div><div className="tp-ci-label">LOCATION</div><div className="tp-ci-val">{personal.location}</div></div>
                    <div className="tp-ci-arr">↗</div>
                  </div>
                )}
                {personal.websiteUrl && (
                  <a href={personal.websiteUrl} className="tp-contact-item" target="_blank" rel="noopener noreferrer">
                    <div className="tp-ci-icon">↗</div>
                    <div><div className="tp-ci-label">WEBSITE</div><div className="tp-ci-val">{personal.websiteUrl}</div></div>
                    <div className="tp-ci-arr">↗</div>
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="tp-footer-bar">
            <div className="tp-footer-name">{personal.fullName}</div>
            <div className="tp-footer-links">
              {personal.linkedinUrl && <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {personal.githubUrl && <a href={personal.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
              {personal.websiteUrl && <a href={personal.websiteUrl} target="_blank" rel="noopener noreferrer">Website</a>}
            </div>
            <div className="tp-footer-copy">© {new Date().getFullYear()} · Built with care</div>
          </div>
        </section>

      </div>
    </div>
  )
}
