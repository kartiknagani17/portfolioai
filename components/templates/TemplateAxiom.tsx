"use client"
import React, { useEffect, useRef, useState } from "react"
import type { PortfolioData } from "@/types/portfolio"

/* ================================================================
   TEMPLATE AXIOM  —  Prefix: ax-
   Colors: #FFFFFF · #0A0A0A · #7C3AED
   Fonts:  Syne (display) · Inter (body) · JetBrains Mono (code)
================================================================ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ax-white:   #FFFFFF;
  --ax-black:   #0A0A0A;
  --ax-vio:     #7C3AED;
  --ax-vio-s:   #A78BFA;
  --ax-vio-dim: rgba(124,58,237,0.10);
  --ax-vio-glo: rgba(124,58,237,0.35);
  --ax-gray:    #6B7280;
  --ax-g100:    #F3F4F6;
  --ax-g200:    #E5E7EB;
  --ax-border:  rgba(0,0,0,0.09);
  --ax-dbord:   rgba(255,255,255,0.09);
  --ease:       cubic-bezier(0.16,1,0.3,1);
}

/* ── Root ─────────────────────────────────────────────────────── */
.ax-root {
  font-family: 'Inter', sans-serif;
  background: var(--ax-white);
  color: var(--ax-black);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Nav ──────────────────────────────────────────────────────── */
.ax-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 22px 56px;
  display: flex; align-items: center; justify-content: space-between;
  transition: padding 0.4s var(--ease), background 0.4s var(--ease),
              box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
  border-bottom: 1px solid transparent;
}
.ax-nav.scrolled {
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  padding: 14px 56px;
  border-color: var(--ax-border);
  box-shadow: 0 4px 32px rgba(0,0,0,0.05);
}
.ax-logo {
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px;
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--ax-black); color: var(--ax-white);
  display: flex; align-items: center; justify-content: center;
  text-decoration: none; letter-spacing: -0.5px;
  transition: background 0.3s var(--ease), transform 0.3s var(--ease);
}
.ax-logo:hover { background: var(--ax-vio); transform: rotate(-6deg) scale(1.07); }

.ax-nav-links { display: flex; gap: 36px; list-style: none; }
.ax-nav-links a {
  font-size: 11px; font-weight: 600; letter-spacing: 0.11em;
  text-transform: uppercase; color: var(--ax-gray); text-decoration: none;
  position: relative; transition: color 0.25s;
}
.ax-nav-links a::after {
  content: ''; position: absolute; bottom: -3px; left: 0; right: 100%;
  height: 1.5px; background: var(--ax-vio);
  transition: right 0.35s var(--ease);
}
.ax-nav-links a:hover { color: var(--ax-black); }
.ax-nav-links a:hover::after { right: 0; }

/* hamburger */
.ax-burger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 4px; z-index: 101;
}
.ax-burger span {
  display: block; width: 22px; height: 2px; background: var(--ax-black);
  transition: all 0.35s var(--ease); transform-origin: center;
}
.ax-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: var(--ax-white); }
.ax-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.ax-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: var(--ax-white); }

.ax-mob-menu {
  position: fixed; inset: 0; z-index: 99; background: var(--ax-black);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 36px;
  opacity: 0; pointer-events: none;
  transition: opacity 0.4s var(--ease);
}
.ax-mob-menu.open { opacity: 1; pointer-events: all; }
.ax-mob-menu a {
  font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 700;
  color: var(--ax-white); text-decoration: none;
  transition: color 0.25s; letter-spacing: -0.5px;
}
.ax-mob-menu a:hover { color: var(--ax-vio-s); }

/* ── Hero ─────────────────────────────────────────────────────── */
.ax-hero {
  min-height: 100vh;
  display: grid; grid-template-columns: 1fr 1fr;
  align-items: center; gap: 60px;
  padding: 130px 56px 80px;
  position: relative; overflow: hidden;
}
.ax-hero-bg {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 55% 65% at 72% 48%, rgba(124,58,237,0.07) 0%, transparent 65%);
}
.ax-hero-bg-2 {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 30% 30% at 15% 85%, rgba(124,58,237,0.04) 0%, transparent 60%);
}

.ax-hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--ax-vio); letter-spacing: 0.16em;
  text-transform: uppercase; margin-bottom: 28px;
  display: flex; align-items: center; gap: 10px;
  opacity: 0; animation: ax-fade-up 0.7s var(--ease) 0.1s forwards;
}
.ax-hero-eyebrow::before {
  content: ''; display: block; width: 28px; height: 1px; background: var(--ax-vio);
}
.ax-hero-name {
  font-family: 'Syne', sans-serif;
  font-size: clamp(50px, 5.5vw, 76px);
  font-weight: 800; line-height: 1; letter-spacing: -2.5px;
  margin-bottom: 20px;
  opacity: 0; animation: ax-fade-up 0.75s var(--ease) 0.2s forwards;
}
.ax-name-first { display: block; color: var(--ax-black); }
.ax-name-last {
  display: block; color: transparent;
  -webkit-text-stroke: 2.5px var(--ax-black);
  transition: color 0.4s, -webkit-text-stroke-color 0.4s;
}
.ax-hero-name:hover .ax-name-last {
  color: var(--ax-vio);
  -webkit-text-stroke-color: var(--ax-vio);
}

.ax-hero-role {
  font-family: 'Syne', sans-serif;
  font-size: clamp(17px, 2vw, 22px); font-weight: 600;
  color: var(--ax-gray); margin-bottom: 22px;
  display: flex; align-items: center; gap: 6px; min-height: 32px;
  opacity: 0; animation: ax-fade-up 0.75s var(--ease) 0.3s forwards;
}
.ax-tw { color: var(--ax-black); }
.ax-cursor {
  display: inline-block; width: 2.5px; height: 1.1em;
  background: var(--ax-vio); border-radius: 1px; vertical-align: text-bottom;
  animation: ax-blink 0.85s step-end infinite;
}
@keyframes ax-blink { 0%,100%{opacity:1} 50%{opacity:0} }

.ax-hero-meta {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  font-size: 13px; color: var(--ax-gray); margin-bottom: 26px;
  opacity: 0; animation: ax-fade-up 0.75s var(--ease) 0.4s forwards;
}
.ax-meta-sep { width: 4px; height: 4px; border-radius: 50%; background: var(--ax-g200); }
.ax-avail {
  color: #10B981; font-weight: 600;
  display: flex; align-items: center; gap: 6px;
}
.ax-avail::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%; background: #10B981;
  animation: ax-pulse-g 2.4s ease infinite;
}
@keyframes ax-pulse-g {
  0%,100%{ box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
  60%{ box-shadow: 0 0 0 7px rgba(16,185,129,0); }
}

.ax-hero-bio {
  font-size: 15px; line-height: 1.75; color: var(--ax-gray);
  max-width: 500px; margin-bottom: 36px;
  opacity: 0; animation: ax-fade-up 0.75s var(--ease) 0.5s forwards;
}

.ax-hero-cta {
  display: flex; gap: 14px; flex-wrap: wrap;
  opacity: 0; animation: ax-fade-up 0.75s var(--ease) 0.6s forwards;
}
.ax-btn-p {
  padding: 13px 26px; background: var(--ax-black); color: var(--ax-white);
  font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
  border-radius: 10px; text-decoration: none;
  display: inline-flex; align-items: center; gap: 8px;
  position: relative; overflow: hidden;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.ax-btn-p::before {
  content: ''; position: absolute; inset: 0;
  background: var(--ax-vio); transform: translateX(-100%);
  transition: transform 0.42s var(--ease);
}
.ax-btn-p span { position: relative; z-index: 1; }
.ax-btn-p:hover::before { transform: translateX(0); }
.ax-btn-p:hover { transform: translateY(-2px); box-shadow: 0 10px 28px var(--ax-vio-glo); }

.ax-btn-s {
  padding: 13px 26px; background: transparent; color: var(--ax-black);
  font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
  border-radius: 10px; text-decoration: none; border: 1.5px solid var(--ax-border);
  display: inline-flex; align-items: center; gap: 8px;
  transition: all 0.3s var(--ease);
}
.ax-btn-s:hover {
  border-color: var(--ax-vio); color: var(--ax-vio);
  background: var(--ax-vio-dim); transform: translateY(-2px);
}

/* ── Bento (hero right) ───────────────────────────────────────── */
.ax-bento {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  will-change: transform;
  opacity: 0; animation: ax-fade-in 1s var(--ease) 0.35s forwards;
}
.ax-bc {
  background: var(--ax-g100); border-radius: 18px; padding: 24px;
  transition: all 0.38s var(--ease); cursor: default; position: relative; overflow: hidden;
}
.ax-bc::after {
  content: ''; position: absolute; inset: 0; border-radius: 18px;
  box-shadow: inset 0 0 0 1.5px transparent;
  transition: box-shadow 0.38s var(--ease);
}
.ax-bc:hover { background: var(--ax-black); transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 48px rgba(0,0,0,0.14); }
.ax-bc:hover::after { box-shadow: inset 0 0 0 1.5px rgba(124,58,237,0.4); }
.ax-bc-wide { grid-column: span 2; }
.ax-bc-vio { background: var(--ax-vio) !important; }
.ax-bc-vio:hover { background: #6D28D9 !important; }

.ax-bc-lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.13em; text-transform: uppercase;
  color: var(--ax-gray); margin-bottom: 8px;
  transition: color 0.35s;
}
.ax-bc:hover .ax-bc-lbl { color: rgba(255,255,255,0.45); }
.ax-bc-vio .ax-bc-lbl { color: rgba(255,255,255,0.65); }

.ax-bc-val {
  font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800;
  color: var(--ax-black); line-height: 1;
  transition: color 0.35s;
}
.ax-bc:hover .ax-bc-val { color: var(--ax-white); }
.ax-bc-vio .ax-bc-val { color: var(--ax-white); }

.ax-bc-val-sm {
  font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
  color: var(--ax-black); line-height: 1.45;
  transition: color 0.35s;
}
.ax-bc:hover .ax-bc-val-sm { color: var(--ax-white); }
.ax-bc-vio .ax-bc-val-sm { color: var(--ax-white); }

.ax-bc-sub {
  font-size: 11px; color: var(--ax-gray); margin-top: 4px;
  transition: color 0.35s;
}
.ax-bc:hover .ax-bc-sub { color: rgba(255,255,255,0.4); }

.ax-bc-pills { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
.ax-bc-pill {
  padding: 4px 11px; background: var(--ax-vio-dim); color: var(--ax-vio);
  border-radius: 100px; font-size: 11px; font-weight: 600;
  transition: all 0.3s;
}
.ax-bc:hover .ax-bc-pill { background: rgba(167,139,250,0.18); color: var(--ax-vio-s); }
.ax-bc-vio .ax-bc-pill { background: rgba(255,255,255,0.18); color: var(--ax-white); }

/* ── Section base ─────────────────────────────────────────────── */
.ax-sec { padding: 104px 56px; }
.ax-sec-dark { background: var(--ax-black); color: var(--ax-white); }
.ax-sec-gray { background: var(--ax-g100); }

.ax-sec-lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ax-vio); margin-bottom: 14px;
  display: flex; align-items: center; gap: 10px;
}
.ax-sec-lbl::before { content:''; width:22px; height:1px; background:var(--ax-vio); flex-shrink:0; }
.ax-sec-dark .ax-sec-lbl { color: var(--ax-vio-s); }
.ax-sec-dark .ax-sec-lbl::before { background: var(--ax-vio-s); }

.ax-sec-h {
  font-family: 'Syne', sans-serif;
  font-size: clamp(34px, 4vw, 54px); font-weight: 800;
  line-height: 1.05; letter-spacing: -1.5px; margin-bottom: 60px;
}
.ax-sec-dark .ax-sec-h { color: var(--ax-white); }
.ax-em { color: var(--ax-vio); font-style: italic; }
.ax-sec-dark .ax-em { color: var(--ax-vio-s); }

/* ── Scroll reveals ───────────────────────────────────────────── */
.ax-rv {
  opacity: 0; transform: translateY(28px);
  transition: opacity 0.72s var(--ease), transform 0.72s var(--ease);
}
.ax-rv-l { opacity:0; transform:translateX(-36px); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
.ax-rv-r { opacity:0; transform:translateX(36px);  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
.ax-rv-sc { opacity:0; transform:scale(0.91);        transition: opacity 0.65s var(--ease), transform 0.65s var(--ease); }
.ax-rv.on,.ax-rv-l.on,.ax-rv-r.on,.ax-rv-sc.on { opacity:1; transform:none; }
.ax-d1 { transition-delay:  80ms; }
.ax-d2 { transition-delay: 160ms; }
.ax-d3 { transition-delay: 240ms; }
.ax-d4 { transition-delay: 320ms; }
.ax-d5 { transition-delay: 400ms; }
.ax-d6 { transition-delay: 480ms; }

@keyframes ax-fade-up {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:none; }
}
@keyframes ax-fade-in { from{opacity:0} to{opacity:1} }

/* ── Tagline ──────────────────────────────────────────────────── */
.ax-tagline {
  background: var(--ax-black); padding: 80px 56px; overflow: hidden;
  text-align: center;
}
.ax-tg-text {
  font-family: 'Syne', sans-serif;
  font-size: clamp(24px, 3.5vw, 48px); font-weight: 700;
  color: var(--ax-white); line-height: 1.25; max-width: 880px; margin: 0 auto;
}
.ax-tg-w {
  display: inline-block; margin: 0 5px;
  opacity: 0; transform: translateY(18px);
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
}
.ax-tg-w.on { opacity:1; transform:none; }
.ax-tg-acc { color: var(--ax-vio-s); }

/* ── Story ────────────────────────────────────────────────────── */
.ax-story-grid {
  display: grid; grid-template-columns: 1fr 300px; gap: 80px; align-items: start;
}
.ax-story-body p {
  font-size: 16.5px; line-height: 1.85; color: var(--ax-gray);
  margin-bottom: 18px;
  opacity: 0; transform: translateY(14px);
  transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
}
.ax-story-body p:first-child { font-size: 18px; color: var(--ax-black); font-weight: 500; }
.ax-story-body p.on { opacity:1; transform:none; }
.ax-story-aside {
  position: sticky; top: 120px;
  background: var(--ax-g100); border-radius: 18px;
  padding: 30px; border-left: 3px solid var(--ax-vio);
}
.ax-aside-q {
  font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700;
  line-height: 1.5; color: var(--ax-black); margin-bottom: 14px;
}
.ax-aside-n { font-size: 12px; color: var(--ax-gray); font-family: 'JetBrains Mono', monospace; }

/* ── Experience accordion ─────────────────────────────────────── */
.ax-exp-list { display: flex; flex-direction: column; }
.ax-exp-item { border-radius: 12px; overflow: hidden; }
.ax-exp-item:hover { background: rgba(255,255,255,0.04); }
.ax-exp-divider { height: 1px; background: var(--ax-dbord); margin: 0 28px; }

.ax-exp-hd {
  display: grid; grid-template-columns: 1fr auto; gap: 20px;
  align-items: center; padding: 24px 28px; cursor: pointer; user-select: none;
}
.ax-exp-co {
  font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 700;
  color: var(--ax-white); margin-bottom: 5px; transition: color 0.3s;
}
.ax-exp-item.open .ax-exp-co { color: var(--ax-vio-s); }
.ax-exp-ti {
  font-size: 13px; color: rgba(255,255,255,0.45); transition: color 0.3s;
}
.ax-exp-item.open .ax-exp-ti { color: rgba(167,139,250,0.65); }
.ax-exp-dt {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: rgba(255,255,255,0.28); white-space: nowrap; text-align: right;
}
.ax-exp-ch {
  font-size: 16px; color: rgba(255,255,255,0.28);
  transition: transform 0.4s var(--ease), color 0.3s;
}
.ax-exp-item.open .ax-exp-ch { transform: rotate(180deg); color: var(--ax-vio-s); }

.ax-exp-bd { max-height: 0; overflow: hidden; transition: max-height 0.5s var(--ease); }
.ax-exp-bd-in {
  padding: 0 28px 28px 28px;
  border-left: 2px solid var(--ax-vio);
  margin: 0 28px;
}
.ax-exp-loc {
  font-size: 12px; color: rgba(255,255,255,0.35);
  font-family: 'JetBrains Mono', monospace; margin-bottom: 14px;
}
.ax-exp-desc {
  font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.6);
}
.ax-exp-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
.ax-exp-tag {
  padding: 4px 11px; background: rgba(124,58,237,0.2); color: var(--ax-vio-s);
  border-radius: 100px; font-size: 11px; font-weight: 600;
}

/* ── Projects bento ───────────────────────────────────────────── */
.ax-proj-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 270px; gap: 16px;
}
.ax-proj-grid > *:nth-child(1) { grid-row: span 2; }
.ax-proj-grid > *:nth-child(2) { grid-row: span 2; }

.ax-pc {
  border-radius: 20px; overflow: hidden; position: relative;
  background: var(--ax-g100); cursor: pointer;
  transition: transform 0.42s var(--ease), box-shadow 0.42s var(--ease);
}
.ax-pc:hover { transform: translateY(-8px); box-shadow: 0 28px 60px rgba(0,0,0,0.13); }
.ax-pc-overlay {
  position: absolute; inset: 0; background: var(--ax-black);
  opacity: 0; transition: opacity 0.42s var(--ease);
}
.ax-pc:hover .ax-pc-overlay { opacity: 0.93; }
.ax-pc-num {
  position: absolute; top: 20px; right: 22px;
  font-family: 'Syne', sans-serif; font-size: 80px; font-weight: 800;
  color: rgba(0,0,0,0.055); line-height: 1;
  transition: color 0.42s, transform 0.42s var(--ease);
}
.ax-pc:hover .ax-pc-num { color: rgba(124,58,237,0.12); transform: scale(1.05); }

.ax-pc-body {
  position: absolute; inset: 0; padding: 28px;
  display: flex; flex-direction: column; justify-content: flex-end; z-index: 1;
}
.ax-pc-name {
  font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
  color: var(--ax-black); margin-bottom: 8px; transition: color 0.4s;
}
.ax-pc:hover .ax-pc-name { color: var(--ax-white); }
.ax-pc-desc {
  font-size: 13px; line-height: 1.65; color: var(--ax-gray);
  margin-bottom: 14px;
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.38s 0.05s var(--ease), transform 0.38s 0.05s var(--ease);
}
.ax-pc:hover .ax-pc-desc { opacity: 1; transform: none; color: rgba(255,255,255,0.65); }
.ax-pc-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.ax-pc-tag {
  padding: 4px 10px; background: rgba(124,58,237,0.12); color: var(--ax-vio);
  border-radius: 100px; font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
  transition: all 0.35s;
}
.ax-pc:hover .ax-pc-tag { background: rgba(124,58,237,0.3); color: var(--ax-vio-s); }
.ax-pc-link {
  position: absolute; top: 20px; left: 22px; z-index: 2;
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(255,255,255,0); display: flex; align-items: center; justify-content: center;
  font-size: 16px; text-decoration: none;
  opacity: 0; transform: scale(0.7);
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease), background 0.3s;
}
.ax-pc:hover .ax-pc-link { opacity: 1; transform: scale(1); background: rgba(255,255,255,0.12); }

/* ── Work Style ───────────────────────────────────────────────── */
.ax-ws-list { display: flex; flex-direction: column; gap: 20px; }
.ax-ws-card {
  display: grid; grid-template-columns: 64px 1fr; gap: 28px;
  align-items: start; padding: 32px 36px; border-radius: 18px;
  border: 1.5px solid var(--ax-border);
  transition: all 0.4s var(--ease);
}
.ax-ws-card:hover {
  border-color: var(--ax-vio); background: var(--ax-vio-dim);
  transform: translateX(10px);
  box-shadow: 0 12px 40px rgba(124,58,237,0.09);
}
.ax-ws-ico {
  width: 52px; height: 52px; border-radius: 14px;
  background: var(--ax-black); display: flex; align-items: center;
  justify-content: center; font-size: 24px; flex-shrink: 0;
  transition: all 0.4s var(--ease);
}
.ax-ws-card:hover .ax-ws-ico { background: var(--ax-vio); transform: rotate(-7deg) scale(1.1); }
.ax-ws-title {
  font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700;
  color: var(--ax-black); margin-bottom: 8px;
}
.ax-ws-body { font-size: 14px; line-height: 1.75; color: var(--ax-gray); }

/* ── Skills ───────────────────────────────────────────────────── */
.ax-sk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 56px; }
.ax-sk-row {
  padding: 16px 0; border-bottom: 1px solid var(--ax-dbord);
}
.ax-sk-top { display: flex; justify-content: space-between; margin-bottom: 10px; }
.ax-sk-nm { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.82); }
.ax-sk-pc {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ax-vio-s);
}
.ax-sk-track {
  height: 3px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;
}
.ax-sk-fill {
  height: 100%; border-radius: 4px; width: 0%;
  background: linear-gradient(90deg, var(--ax-vio), var(--ax-vio-s));
  transition: width 1.3s var(--ease);
}

/* ── Languages ────────────────────────────────────────────────── */
.ax-lang-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 18px;
}
.ax-lang-card {
  padding: 24px 26px; border-radius: 16px;
  border: 1.5px solid var(--ax-border);
  transition: all 0.4s var(--ease);
}
.ax-lang-card:hover {
  border-color: var(--ax-vio); background: var(--ax-vio-dim);
  transform: translateY(-5px); box-shadow: 0 14px 36px rgba(124,58,237,0.1);
}
.ax-lang-nm {
  font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700;
  color: var(--ax-black); margin-bottom: 5px;
}
.ax-lang-lv { font-size: 12px; color: var(--ax-gray); margin-bottom: 14px; }
.ax-lang-dots { display: flex; gap: 5px; }
.ax-lang-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--ax-g200); border: 1.5px solid var(--ax-border);
  transition: all 0.35s;
}
.ax-lang-dot.lit { background: var(--ax-vio); border-color: var(--ax-vio); }
.ax-lang-card:hover .ax-lang-dot.lit { box-shadow: 0 0 8px rgba(124,58,237,0.5); }

/* ── Interests ────────────────────────────────────────────────── */
.ax-int-cloud { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.ax-int-tag {
  padding: 11px 22px; border-radius: 100px;
  border: 1.5px solid var(--ax-border);
  font-size: 14px; font-weight: 500; color: var(--ax-gray);
  cursor: default;
  opacity: 0; transform: scale(0.78);
  transition: opacity 0.5s var(--ease), transform 0.5s cubic-bezier(0.34,1.56,0.64,1),
              background 0.3s, border-color 0.3s, color 0.3s;
}
.ax-int-tag.on { opacity: 1; transform: scale(1); }
.ax-int-tag:hover {
  background: var(--ax-black); border-color: var(--ax-black);
  color: var(--ax-white); transform: scale(1.08) translateY(-3px);
}

/* ── Education ────────────────────────────────────────────────── */
.ax-edu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px,1fr)); gap: 22px; }
.ax-edu-card {
  padding: 30px 32px; border-radius: 20px;
  background: var(--ax-white); border: 1.5px solid var(--ax-border);
  position: relative; overflow: hidden;
  transition: all 0.42s var(--ease);
}
.ax-edu-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--ax-vio), var(--ax-vio-s));
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.5s var(--ease);
}
.ax-edu-card:hover::before { transform: scaleX(1); }
.ax-edu-card:hover {
  border-color: rgba(124,58,237,0.22);
  transform: translateY(-6px);
  box-shadow: 0 22px 52px rgba(0,0,0,0.08);
}
.ax-edu-deg {
  font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 700;
  color: var(--ax-black); margin-bottom: 8px;
}
.ax-edu-sch { font-size: 14px; color: var(--ax-vio); font-weight: 600; margin-bottom: 6px; }
.ax-edu-yr {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ax-gray);
}
.ax-edu-fi { font-size: 13px; color: var(--ax-gray); margin-top: 10px; }

/* ── Looking For ──────────────────────────────────────────────── */
.ax-lf-inner { max-width: 680px; margin: 0 auto; text-align: center; }
.ax-lf-q {
  font-family: 'Syne', sans-serif;
  font-size: clamp(20px, 2.8vw, 32px); font-weight: 700;
  color: var(--ax-white); line-height: 1.4; margin-bottom: 36px;
}
.ax-lf-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.ax-lf-chip {
  padding: 10px 20px;
  background: rgba(124,58,237,0.18); border: 1px solid rgba(124,58,237,0.28);
  border-radius: 100px; color: var(--ax-vio-s);
  font-size: 13px; font-weight: 600;
  animation: ax-chip-glow 3.5s ease infinite;
}
.ax-lf-chip:nth-child(2) { animation-delay: 0.7s; }
.ax-lf-chip:nth-child(3) { animation-delay: 1.4s; }
.ax-lf-chip:nth-child(4) { animation-delay: 2.1s; }
@keyframes ax-chip-glow {
  0%,100%{ box-shadow: 0 0 0 0 rgba(124,58,237,0); }
  50%{ box-shadow: 0 0 0 5px rgba(124,58,237,0.15); }
}

/* ── Contact ──────────────────────────────────────────────────── */
.ax-contact {
  background: var(--ax-black); padding: 140px 56px;
  text-align: center; position: relative; overflow: hidden;
}
.ax-ct-glow {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 68%);
  pointer-events: none;
  animation: ax-glow-pulse 4.5s ease infinite;
}
@keyframes ax-glow-pulse {
  0%,100%{ transform:translate(-50%,-50%) scale(1); opacity:0.6; }
  50%{ transform:translate(-50%,-50%) scale(1.25); opacity:1; }
}
.ax-ct-eye {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.16em; color: var(--ax-vio-s); text-transform: uppercase;
  margin-bottom: 24px; position: relative; z-index: 1;
}
.ax-ct-head {
  font-family: 'Syne', sans-serif;
  font-size: clamp(42px, 6vw, 80px); font-weight: 800;
  color: var(--ax-white); letter-spacing: -2.5px; line-height: 1;
  margin-bottom: 52px; position: relative; z-index: 1;
}
.ax-ct-head em { color: var(--ax-vio-s); font-style: italic; }
.ax-ct-email {
  display: inline-block;
  font-family: 'Syne', sans-serif;
  font-size: clamp(16px, 2.2vw, 26px); font-weight: 700;
  color: var(--ax-white); text-decoration: none;
  padding: 20px 48px; border-radius: 100px;
  border: 2px solid rgba(124,58,237,0.45);
  position: relative; overflow: hidden; z-index: 1;
  transition: border-color 0.4s var(--ease), transform 0.4s var(--ease),
              box-shadow 0.4s var(--ease);
}
.ax-ct-email::before {
  content: ''; position: absolute; inset: 0;
  background: var(--ax-vio); transform: scaleX(0); transform-origin: left;
  transition: transform 0.5s var(--ease); z-index: -1;
}
.ax-ct-email:hover::before { transform: scaleX(1); }
.ax-ct-email:hover {
  border-color: var(--ax-vio);
  box-shadow: 0 0 50px var(--ax-vio-glo); transform: scale(1.03);
}
.ax-ct-links { display: flex; gap: 24px; justify-content: center; margin-top: 32px; z-index: 1; position: relative; }
.ax-ct-lnk {
  font-size: 12px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase;
  color: rgba(255,255,255,0.35); text-decoration: none;
  transition: color 0.3s; display: flex; align-items: center; gap: 5px;
}
.ax-ct-lnk:hover { color: var(--ax-vio-s); }

/* ── Footer ───────────────────────────────────────────────────── */
.ax-footer {
  padding: 22px 56px; background: var(--ax-black);
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex; justify-content: space-between; align-items: center;
}
.ax-ft { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.18); }

/* ═══ RESPONSIVE ══════════════════════════════════════════════════ */
@media (max-width: 1100px) {
  .ax-hero { grid-template-columns: 1fr; padding: 110px 40px 64px; gap: 48px; }
  .ax-bento { grid-template-columns: repeat(4, 1fr); }
  .ax-bc-wide { grid-column: span 4; }
  .ax-story-grid { grid-template-columns: 1fr; }
  .ax-story-aside { position: static; }
  .ax-proj-grid { grid-template-columns: 1fr 1fr; }
  .ax-proj-grid > *:nth-child(1),
  .ax-proj-grid > *:nth-child(2) { grid-row: span 1; }
  .ax-sk-grid { grid-template-columns: 1fr; }
  .ax-sec { padding: 80px 40px; }
  .ax-nav { padding: 18px 40px; }
  .ax-nav.scrolled { padding: 12px 40px; }
  .ax-tagline { padding: 64px 40px; }
  .ax-contact { padding: 100px 40px; }
  .ax-footer { padding: 20px 40px; }
}

@media (max-width: 768px) {
  .ax-nav { padding: 16px 24px; }
  .ax-nav.scrolled { padding: 12px 24px; }
  .ax-nav-links { display: none; }
  .ax-burger { display: flex; }
  .ax-hero { padding: 88px 24px 52px; gap: 36px; }
  .ax-bento { grid-template-columns: 1fr 1fr; }
  .ax-bc-wide { grid-column: span 2; }
  .ax-sec { padding: 64px 24px; }
  .ax-sec-h { margin-bottom: 40px; }
  .ax-tagline { padding: 52px 24px; }
  .ax-proj-grid { grid-template-columns: 1fr; grid-auto-rows: 240px; }
  .ax-ws-card { grid-template-columns: 1fr; gap: 14px; padding: 24px; }
  .ax-ws-card:hover { transform: none; }
  .ax-exp-hd { grid-template-columns: 1fr; gap: 6px; }
  .ax-exp-dt { font-size: 10px; }
  .ax-edu-grid { grid-template-columns: 1fr; }
  .ax-lang-grid { grid-template-columns: 1fr 1fr; }
  .ax-contact { padding: 80px 24px; }
  .ax-ct-glow { width: 320px; height: 320px; }
  .ax-footer { flex-direction: column; gap: 8px; text-align: center; padding: 18px 24px; }
}

@media (max-width: 480px) {
  .ax-bento { grid-template-columns: 1fr; }
  .ax-bc-wide { grid-column: span 1; }
  .ax-hero-cta { flex-direction: column; }
  .ax-btn-p, .ax-btn-s { justify-content: center; text-align: center; }
  .ax-lang-grid { grid-template-columns: 1fr; }
  .ax-ct-email { padding: 16px 28px; font-size: 15px; }
  .ax-ct-links { flex-wrap: wrap; gap: 16px; }
}
`

/* ── helpers ───────────────────────────────────────────────────── */
function profDots(lvl = ''): number {
  const l = lvl.toLowerCase()
  if (l.includes('native') || l.includes('bilingual') || l.includes('fluent')) return 5
  if (l.includes('advanced') || l.includes('full professional') || l.includes('professional')) return 4
  if (l.includes('upper') || l.includes('intermediate') || l.includes('conversational') || l.includes('working')) return 3
  if (l.includes('elementary') || l.includes('basic') || l.includes('beginner') || l.includes('limited')) return 2
  return 3
}
function skillPct(skill: any): number {
  if (typeof skill === 'string') return 80
  const l = (skill.level || skill.proficiency || '').toLowerCase()
  if (l.includes('expert') || l.includes('advanced')) return 92
  if (l.includes('proficient') || l.includes('intermediate')) return 74
  if (l.includes('beginner') || l.includes('basic') || l.includes('learning')) return 44
  return 78
}
function parseWorkStyle(ws: string) {
  const emojis = ['⚡', '🔭', '🤝', '🎯', '🔑']
  return ws
    .split(/\.\s+|\n/)
    .map(s => s.trim().replace(/^[-•*]\s*/, ''))
    .filter(s => s.length > 18)
    .slice(0, 4)
    .map((text, i) => ({
      text: /[.!?]$/.test(text) ? text : text + '.',
      emoji: emojis[i] ?? '✦',
    }))
}
function parseLookingFor(lf: string): string[] {
  const commas = lf.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 3)
  if (commas.length >= 3) return commas.slice(0, 5)
  return lf.split(/\.\s+/).filter(s => s.length > 5).slice(0, 4).map(s => s.trim().replace(/\.$/, ''))
}
function expYear(e: any): number {
  const raw = e.startDate ?? e.start ?? e.from ?? ''
  const y = parseInt(String(raw))
  return isNaN(y) ? 0 : y
}
function expDate(e: any, key: 'start' | 'end'): string {
  if (key === 'start') return e.startDate ?? e.start ?? e.from ?? ''
  if (e.current || e.isCurrent) return 'Present'
  return e.endDate ?? e.end ?? e.to ?? 'Present'
}
function expDesc(e: any): string {
  if (typeof e.description === 'string') return e.description
  if (Array.isArray(e.description)) return e.description.join(' ')
  if (typeof e.responsibilities === 'string') return e.responsibilities
  if (Array.isArray(e.responsibilities)) return e.responsibilities.join(' ')
  return e.summary ?? e.details ?? ''
}
function projTech(p: any): string[] {
  return p.technologies ?? p.tech ?? p.stack ?? p.tools ?? []
}
function projLink(p: any): string {
  return p.url ?? p.link ?? p.github ?? p.liveUrl ?? ''
}
function skillName(s: any): string {
  return typeof s === 'string' ? s : s.name ?? s.skill ?? s.technology ?? ''
}
function langName(l: any): string {
  return typeof l === 'string' ? l : l.language ?? l.name ?? ''
}
function langLevel(l: any): string {
  return typeof l === 'string' ? 'Fluent' : l.proficiency ?? l.level ?? l.fluency ?? 'Intermediate'
}
function interestName(i: any): string {
  return typeof i === 'string' ? i : i.name ?? i.interest ?? String(i)
}

/* ── component ─────────────────────────────────────────────────── */
interface Props { data: PortfolioData; accentColor?: string }

export default function TemplateAxiom({ portfolioData: data }: Props) {
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobOpen, setMobOpen]         = useState(false)
  const [twText, setTwText]           = useState('')
  const [activeExp, setActiveExp]     = useState(0)
  const [skTriggered, setSkTriggered] = useState(false)

  const bentoRef    = useRef<HTMLDivElement>(null)
  const skillsRef   = useRef<HTMLDivElement>(null)
  const expBodies   = useRef<(HTMLDivElement | null)[]>([])

  const firstName = ((data.personal?.fullName ?? (data as any).name ?? '') as string).split(' ')[0] ?? ''
  const lastName  = ((data.personal?.fullName ?? (data as any).name ?? '') as string).split(' ').slice(1).join(' ') ?? ''

  /* roles for typewriter */
  const roles = [
    (data.personal?.professionalTitle ?? (data as any).currentRole),
    ...(data.experience ?? []).slice(0, 3).map(e => e.title ?? e.role ?? e.position ?? '')
  ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i) as string[]

  /* stats */
  const yearsExp = (() => {
    const years = (data.experience ?? []).map(expYear).filter(Boolean)
    if (!years.length) return '5+'
    const diff = new Date().getFullYear() - Math.min(...years)
    return diff > 0 ? `${diff}+` : '5+'
  })()
  const topSkills = (data.skills ?? []).slice(0, 5).map(skillName).filter(Boolean)
  const curCo     = (data.experience?.[0] as any)?.company ?? (data.experience?.[0] as any)?.organization ?? ''
  const skillList = (data.skills ?? []).map(s => ({ name: skillName(s), pct: skillPct(s) })).filter(s => s.name)
  const wsPrinciples = parseWorkStyle(data.workStyle ?? '')
  const lfChips      = parseLookingFor(data.lookingFor ?? '')

  /* nav scroll */
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* typewriter */
  useEffect(() => {
    if (!roles.length) return
    let ri = 0, ci = 0, dir: 'type'|'pause'|'erase' = 'type'
    let t: ReturnType<typeof setTimeout>
    const tick = () => {
      const role = roles[ri]
      if (dir === 'type') {
        ci++; setTwText(role.slice(0, ci))
        if (ci >= role.length) { dir = 'pause'; t = setTimeout(tick, 2000); return }
        t = setTimeout(tick, 62)
      } else if (dir === 'pause') {
        dir = 'erase'; t = setTimeout(tick, 60)
      } else {
        ci--; setTwText(role.slice(0, ci))
        if (ci <= 0) { ri = (ri + 1) % roles.length; dir = 'type'; t = setTimeout(tick, 380); return }
        t = setTimeout(tick, 32)
      }
    }
    t = setTimeout(tick, 900)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line

  /* cursor parallax (desktop only) */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const hero = document.querySelector('.ax-hero') as HTMLElement
    if (!hero || !bentoRef.current) return
    let tx = 0, ty = 0, cx = 0, cy = 0, raf: number
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect()
      tx = (e.clientX - r.left - r.width  / 2) / r.width  * 22
      ty = (e.clientY - r.top  - r.height / 2) / r.height * 14
    }
    const loop = () => {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07
      if (bentoRef.current) bentoRef.current.style.transform = `translate(${cx}px,${cy}px)`
      raf = requestAnimationFrame(loop)
    }
    hero.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => { hero.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  /* IntersectionObserver for reveals */
  useEffect(() => {
    const timer = setTimeout(() => {
      const sel = '.ax-rv,.ax-rv-l,.ax-rv-r,.ax-rv-sc,.ax-tg-w,.ax-int-tag,.ax-story-body p'
      const els = document.querySelectorAll(sel)
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target) } })
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })
      els.forEach(el => obs.observe(el))
      return () => obs.disconnect()
    }, 120)
    return () => clearTimeout(timer)
  }, [])

  /* skills bar trigger */
  useEffect(() => {
    if (!skillsRef.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSkTriggered(true); obs.disconnect() } }, { threshold: 0.2 })
    obs.observe(skillsRef.current)
    return () => obs.disconnect()
  }, [])

  /* accordion heights */
  useEffect(() => {
    expBodies.current.forEach((el, i) => {
      if (!el) return
      el.style.maxHeight = i === activeExp ? el.scrollHeight + 'px' : '0px'
    })
  }, [activeExp])

  /* ── render ──────────────────────────────────────────────────── */
  return (
    <div className="ax-root">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* NAV */}
      <nav className={`ax-nav${navScrolled ? ' scrolled' : ''}`}>
        <a className="ax-logo" href="#ax-top">{firstName[0]}{lastName[0]}</a>
        <ul className="ax-nav-links">
          {[['Experience','#ax-exp'],['Projects','#ax-proj'],['Skills','#ax-sk'],['Education','#ax-edu'],['Contact','#ax-contact']].map(([l,h]) => (
            <li key={l}><a href={h}>{l}</a></li>
          ))}
        </ul>
        <button className={`ax-burger${mobOpen ? ' open' : ''}`} onClick={() => setMobOpen(v => !v)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>
      <div className={`ax-mob-menu${mobOpen ? ' open' : ''}`}>
        {[['EXPERIENCE','#ax-exp'],['PROJECTS','#ax-proj'],['SKILLS','#ax-sk'],['EDUCATION','#ax-edu'],['CONTACT','#ax-contact']].map(([l,h]) => (
          <a key={l} href={h} onClick={() => setMobOpen(false)}>{l}</a>
        ))}
      </div>

      {/* HERO */}
      <section className="ax-hero" id="ax-top">
        <div className="ax-hero-bg"/>
        <div className="ax-hero-bg-2"/>

        {/* left */}
        <div>
          <div className="ax-hero-eyebrow">PORTFOLIO · {new Date().getFullYear()}</div>
          <h1 className="ax-hero-name">
            <span className="ax-name-first">{firstName}</span>
            <span className="ax-name-last">{lastName}</span>
          </h1>
          <div className="ax-hero-role">
            <span className="ax-tw">{twText}</span>
            <span className="ax-cursor"/>
          </div>
          <div className="ax-hero-meta">
            {data.location && <span>{data.location}</span>}
            {data.location && <span className="ax-meta-sep"/>}
            {data.openToWork !== false && <span className="ax-avail">Available</span>}
          </div>
          <p className="ax-hero-bio">{data.personal?.bio ?? (data as any).bio ?? (data as any).summary ?? ''}</p>
          <div className="ax-hero-cta">
            {data.email && (
              <a className="ax-btn-p" href={`mailto:${data.email}`}>
                <span>✉ Get in touch</span>
              </a>
            )}
            {data.linkedin && <a className="ax-btn-s" href={data.linkedin} target="_blank" rel="noopener noreferrer">↗ LinkedIn</a>}
            {data.github   && <a className="ax-btn-s" href={data.github}   target="_blank" rel="noopener noreferrer">↗ GitHub</a>}
          </div>
        </div>

        {/* bento right */}
        <div className="ax-bento" ref={bentoRef}>
          <div className="ax-bc ax-bc-wide ax-bc-vio">
            <div className="ax-bc-lbl">Currently</div>
            <div className="ax-bc-val-sm">{(data.personal?.professionalTitle ?? (data as any).currentRole || '')}{curCo ? ` @ ${curCo}` : ''}</div>
          </div>
          <div className="ax-bc">
            <div className="ax-bc-lbl">Experience</div>
            <div className="ax-bc-val">{yearsExp}</div>
            <div className="ax-bc-sub">years</div>
          </div>
          <div className="ax-bc">
            <div className="ax-bc-lbl">Projects</div>
            <div className="ax-bc-val">{data.projects?.length ?? 0}</div>
          </div>
          <div className="ax-bc ax-bc-wide">
            <div className="ax-bc-lbl">Top skills</div>
            <div className="ax-bc-pills">
              {topSkills.map(s => <span key={s} className="ax-bc-pill">{s}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* TAGLINE */}
      {data.tagline && (
        <section className="ax-tagline">
          <p className="ax-tg-text">
            {data.tagline.split(' ').map((w, i) => (
              <span key={i} className="ax-tg-w" style={{ transitionDelay: `${i * 55}ms` }}>
                {w}{' '}
              </span>
            ))}
          </p>
        </section>
      )}

      {/* CAREER STORY */}
      {data.careerStory && (
        <section className="ax-sec">
          <div className="ax-sec-lbl ax-rv">Career Story</div>
          <div className="ax-sec-h ax-rv ax-d1">How I got <em className="ax-em">here</em></div>
          <div className="ax-story-grid">
            <div className="ax-story-body">
              {data.careerStory.split(/\.\s+/).filter(s => s.length > 12).map((s, i) => (
                <p key={i} style={{ transitionDelay: `${i * 110}ms` }}>
                  {/[.!?]$/.test(s) ? s : s + '.'}
                </p>
              ))}
            </div>
            <div className="ax-story-aside ax-rv">
              <div className="ax-aside-q">"{(data as any).tagline || data.personal?.professionalTitle || (data as any).currentRole}"</div>
              <div className="ax-aside-n">— {data.name}</div>
            </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {(data.experience?.length ?? 0) > 0 && (
        <section className="ax-sec ax-sec-dark" id="ax-exp">
          <div className="ax-sec-lbl ax-rv">Experience</div>
          <div className="ax-sec-h ax-rv ax-d1">Where I've <em className="ax-em">worked</em></div>
          <div className="ax-exp-list">
            {(data.experience ?? []).map((exp: any, i) => (
              <div key={i}>
                <div className={`ax-exp-item${activeExp === i ? ' open' : ''} ax-rv`} style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="ax-exp-hd" onClick={() => setActiveExp(activeExp === i ? -1 : i)}>
                    <div>
                      <div className="ax-exp-co">{exp.company ?? exp.organization ?? exp.employer ?? ''}</div>
                      <div className="ax-exp-ti">{exp.title ?? exp.role ?? exp.position ?? ''}</div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
                      <div className="ax-exp-dt">{expDate(exp,'start')} — {expDate(exp,'end')}</div>
                      <div className="ax-exp-ch">▾</div>
                    </div>
                  </div>
                  <div className="ax-exp-bd" ref={el => { expBodies.current[i] = el }}>
                    <div className="ax-exp-bd-in">
                      {exp.location && <div className="ax-exp-loc">📍 {exp.location}</div>}
                      <div className="ax-exp-desc">{expDesc(exp)}</div>
                      {(exp.technologies ?? exp.tech ?? []).length > 0 && (
                        <div className="ax-exp-tags">
                          {(exp.technologies ?? exp.tech ?? []).map((t: string, ti: number) => (
                            <span key={ti} className="ax-exp-tag">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {i < (data.experience?.length ?? 0) - 1 && <div className="ax-exp-divider"/>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {(data.projects?.length ?? 0) > 0 && (
        <section className="ax-sec" id="ax-proj">
          <div className="ax-sec-lbl ax-rv">Projects</div>
          <div className="ax-sec-h ax-rv ax-d1">Things I've <em className="ax-em">built</em></div>
          <div className="ax-proj-grid">
            {(data.projects ?? []).map((proj: any, i) => (
              <div key={i} className={`ax-pc ax-rv-sc`} style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="ax-pc-overlay"/>
                <div className="ax-pc-num">0{i+1}</div>
                {projLink(proj) && (
                  <a className="ax-pc-link" href={projLink(proj)} target="_blank" rel="noopener noreferrer">↗</a>
                )}
                <div className="ax-pc-body">
                  <h3 className="ax-pc-name">{proj.name ?? proj.title ?? ''}</h3>
                  <p className="ax-pc-desc">{proj.description ?? proj.summary ?? ''}</p>
                  <div className="ax-pc-tags">
                    {projTech(proj).slice(0, 4).map((t: string, ti: number) => (
                      <span key={ti} className="ax-pc-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WORK STYLE */}
      {wsPrinciples.length > 0 && (
        <section className="ax-sec" style={{ background: 'var(--ax-g100)' }}>
          <div className="ax-sec-lbl ax-rv">Work Style</div>
          <div className="ax-sec-h ax-rv ax-d1">How I <em className="ax-em">operate</em></div>
          <div className="ax-ws-list">
            {wsPrinciples.map((p, i) => (
              <div key={i} className={`ax-ws-card ${i % 2 === 0 ? 'ax-rv-l' : 'ax-rv-r'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="ax-ws-ico">{p.emoji}</div>
                <div>
                  <div className="ax-ws-body">{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {skillList.length > 0 && (
        <section className="ax-sec ax-sec-dark" id="ax-sk" ref={skillsRef}>
          <div className="ax-sec-lbl ax-rv">Skills</div>
          <div className="ax-sec-h ax-rv ax-d1">What I <em className="ax-em">know</em></div>
          <div className="ax-sk-grid">
            {skillList.map((s, i) => (
              <div key={i} className="ax-sk-row ax-rv" style={{ transitionDelay: `${i * 55}ms` }}>
                <div className="ax-sk-top">
                  <span className="ax-sk-nm">{s.name}</span>
                  <span className="ax-sk-pc">{s.pct}%</span>
                </div>
                <div className="ax-sk-track">
                  <div className="ax-sk-fill" style={{ width: skTriggered ? `${s.pct}%` : '0%', transitionDelay: `${i * 60}ms` }}/>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LANGUAGES */}
      {(data.languages?.length ?? 0) > 0 && (
        <section className="ax-sec">
          <div className="ax-sec-lbl ax-rv">Languages</div>
          <div className="ax-sec-h ax-rv ax-d1"><em className="ax-em">Spoken</em> languages</div>
          <div className="ax-lang-grid">
            {(data.languages ?? []).map((l: any, i) => {
              const nm = langName(l), lv = langLevel(l), dots = profDots(lv)
              return (
                <div key={i} className="ax-lang-card ax-rv" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="ax-lang-nm">{nm}</div>
                  <div className="ax-lang-lv">{lv}</div>
                  <div className="ax-lang-dots">
                    {[1,2,3,4,5].map(d => <div key={d} className={`ax-lang-dot${d <= dots ? ' lit' : ''}`}/>)}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* INTERESTS */}
      {(data.interests?.length ?? 0) > 0 && (
        <section className="ax-sec" style={{ textAlign:'center', paddingTop:64, paddingBottom:64 }}>
          <div className="ax-sec-lbl ax-rv" style={{ justifyContent:'center' }}>Interests</div>
          <div className="ax-sec-h ax-rv ax-d1" style={{ textAlign:'center' }}>Beyond <em className="ax-em">work</em></div>
          <div className="ax-int-cloud">
            {(data.interests ?? []).map((int: any, i) => (
              <span key={i} className="ax-int-tag" style={{ transitionDelay: `${i * 60}ms` }}>
                {interestName(int)}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {(data.education?.length ?? 0) > 0 && (
        <section className="ax-sec ax-sec-gray" id="ax-edu">
          <div className="ax-sec-lbl ax-rv">Education</div>
          <div className="ax-sec-h ax-rv ax-d1">Where I <em className="ax-em">studied</em></div>
          <div className="ax-edu-grid">
            {(data.education ?? []).map((edu: any, i) => (
              <div key={i} className="ax-edu-card ax-rv-sc" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="ax-edu-deg">{edu.degree ?? edu.title ?? ''}</div>
                <div className="ax-edu-sch">{edu.institution ?? edu.school ?? edu.university ?? ''}</div>
                <div className="ax-edu-yr">
                  {edu.startYear ?? edu.start ?? ''}{(edu.endYear ?? edu.end ?? edu.graduationYear) ? ` — ${edu.endYear ?? edu.end ?? edu.graduationYear}` : ''}
                </div>
                {(edu.fieldOfStudy ?? edu.field ?? edu.major) && (
                  <div className="ax-edu-fi">{edu.fieldOfStudy ?? edu.field ?? edu.major}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LOOKING FOR */}
      {data.lookingFor && (
        <section className="ax-sec ax-sec-dark" style={{ textAlign:'center' }}>
          <div className="ax-sec-lbl ax-rv" style={{ justifyContent:'center' }}>Open to</div>
          <div className="ax-lf-inner ax-rv ax-d1">
            <p className="ax-lf-q">"{data.lookingFor}"</p>
            <div className="ax-lf-chips">
              {lfChips.map((c, i) => <span key={i} className="ax-lf-chip">{c}</span>)}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section className="ax-contact" id="ax-contact">
        <div className="ax-ct-glow"/>
        <div className="ax-ct-eye ax-rv">Let's work together</div>
        <h2 className="ax-ct-head ax-rv ax-d1">Say <em>hello</em>.</h2>
        {data.email && (
          <a href={`mailto:${data.email}`} className="ax-ct-email ax-rv ax-d2">{data.email}</a>
        )}
        <div className="ax-ct-links ax-rv ax-d3">
          {data.linkedin && <a href={data.linkedin} className="ax-ct-lnk" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
          {data.github   && <a href={data.github}   className="ax-ct-lnk" target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
          {data.website  && <a href={data.website}  className="ax-ct-lnk" target="_blank" rel="noopener noreferrer">Website ↗</a>}
        </div>
      </section>

      <footer className="ax-footer">
        <div className="ax-ft">{data.name} · Portfolio {new Date().getFullYear()}</div>
        <div className="ax-ft">Built with PortfolioAI</div>
      </footer>
    </div>
  )
}
