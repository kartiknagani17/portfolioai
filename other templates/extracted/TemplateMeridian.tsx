"use client"
import { useEffect, useRef, useState } from "react"
import type { PortfolioData } from "@/types/portfolio"

export default function TemplateMeridian({ portfolioData }: { portfolioData: PortfolioData }) {
  const { personal, experience, projects, skills, education, certifications, tagline, careerStory, workStyle, lookingFor } = portfolioData

  // Derive initials for avatar fallback
  const initials = personal.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s.name)
    return acc
  }, {})

  // Parse workStyle into up-to-4 principle items
  const workStylePrinciples: { title: string; body: string }[] = (() => {
    if (!workStyle) return []
    // Split on sentence boundaries and chunk into pairs
    const sentences = workStyle.split(/(?<=[.!?])\s+/).filter(Boolean)
    const chunks: { title: string; body: string }[] = []
    for (let i = 0; i < sentences.length && chunks.length < 4; i++) {
      const title = sentences[i].replace(/[.!?]$/, "")
      const body = sentences[i + 1] ?? ""
      chunks.push({ title, body })
      if (body) i++
    }
    return chunks.slice(0, 4)
  })()

  // Featured project is first, rest split into pairs
  const featuredProject = projects[0] ?? null
  const otherProjects = projects.slice(1)

  // Nav sections — only show sections that have data
  const navSections: { id: string; label: string }[] = [
    { id: "hero", label: "Home" },
    ...(experience.length > 0 ? [{ id: "experience", label: "Experience" }] : []),
    ...(projects.length > 0 ? [{ id: "projects", label: "Projects" }] : []),
    ...(skills.length > 0 ? [{ id: "skills", label: "Skills" }] : []),
    ...(education.length > 0 ? [{ id: "education", label: "Education" }] : []),
    { id: "contact", label: "Contact" },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .tm-*, .tm-*::before, .tm-*::after { box-sizing: border-box; margin: 0; padding: 0; }

        .tm-root {
          --tm-bg: #F9F8F6;
          --tm-primary: #1A1A2E;
          --tm-accent: #E07A5F;
          --tm-accent-light: #FDF0EC;
          --tm-accent-mid: rgba(224,122,95,0.12);
          --tm-white: #FFFFFF;
          --tm-gray: #8892A4;
          --tm-gray-light: #F0EDE8;
          --tm-border: rgba(26,26,46,0.08);
          --tm-sidebar-w: 280px;
          --tm-font-display: 'Playfair Display', serif;
          --tm-font-mono: 'DM Mono', monospace;
          --tm-font-body: 'Plus Jakarta Sans', sans-serif;
          --tm-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
          --tm-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
          background: var(--tm-bg);
          color: var(--tm-primary);
          font-family: var(--tm-font-body);
          line-height: 1.6;
          overflow-x: hidden;
          cursor: none;
        }

        /* CURSOR */
        .tm-cursor {
          position: fixed;
          width: 10px; height: 10px;
          background: var(--tm-accent);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: width 0.3s var(--tm-spring), height 0.3s var(--tm-spring), background 0.3s;
        }
        .tm-cursor.tm-hovering {
          width: 32px; height: 32px;
          background: rgba(224,122,95,0.25);
        }

        /* PROGRESS BAR */
        .tm-progress-bar {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          background: var(--tm-accent);
          width: 0%;
          z-index: 9998;
          transition: width 0.1s linear;
        }

        /* ORBS */
        .tm-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(80px);
          opacity: 0.07;
          animation: tmOrbDrift 18s ease-in-out infinite alternate;
        }
        .tm-orb-1 {
          width: 500px; height: 500px;
          background: var(--tm-accent);
          top: -100px; right: -100px;
          animation-duration: 20s;
        }
        .tm-orb-2 {
          width: 400px; height: 400px;
          background: #C9A84C;
          bottom: 10%; left: -80px;
          animation-duration: 25s;
          animation-delay: -8s;
        }
        @keyframes tmOrbDrift {
          0%   { transform: translate(0,0) scale(1); border-radius: 50%; }
          33%  { transform: translate(40px,-30px) scale(1.05); border-radius: 45% 55% 52% 48%; }
          66%  { transform: translate(-20px,50px) scale(0.97); border-radius: 55% 45% 48% 52%; }
          100% { transform: translate(30px,20px) scale(1.03); border-radius: 50%; }
        }

        /* LAYOUT */
        .tm-layout {
          display: flex;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        /* SIDEBAR */
        .tm-sidebar {
          width: var(--tm-sidebar-w);
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          background: var(--tm-white);
          border-right: 1px solid var(--tm-border);
          display: flex;
          flex-direction: column;
          padding: 48px 32px;
          z-index: 100;
          overflow: hidden;
        }
        .tm-sidebar-scroll-bar {
          position: absolute;
          left: 0; top: 0;
          width: 3px;
          background: var(--tm-accent);
          height: 0%;
          transition: height 0.15s linear;
          border-radius: 0 2px 2px 0;
        }
        .tm-sidebar-avatar {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: var(--tm-accent-light);
          border: 2px solid var(--tm-accent);
          overflow: hidden;
          margin-bottom: 20px;
          flex-shrink: 0;
        }
        .tm-sidebar-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .tm-sidebar-avatar-initials {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--tm-font-display);
          font-size: 22px;
          color: var(--tm-accent);
          font-weight: 700;
        }
        .tm-sidebar-name {
          font-family: var(--tm-font-display);
          font-size: 18px; font-weight: 800;
          line-height: 1.2; margin-bottom: 4px;
        }
        .tm-sidebar-title {
          font-family: var(--tm-font-mono);
          font-size: 11px; color: var(--tm-accent);
          letter-spacing: 0.08em; margin-bottom: 32px;
        }
        .tm-sidebar-nav {
          flex: 1; display: flex; flex-direction: column; gap: 4px; position: relative;
        }
        .tm-nav-pill {
          position: absolute; left: -8px;
          height: 36px; width: calc(100% + 16px);
          background: var(--tm-accent-mid);
          border-radius: 8px;
          transition: transform 0.4s var(--tm-spring);
          pointer-events: none;
          border-left: 3px solid var(--tm-accent);
        }
        .tm-sidebar-link {
          font-family: var(--tm-font-mono);
          font-size: 12px; letter-spacing: 0.06em;
          color: var(--tm-gray);
          text-decoration: none;
          padding: 8px 0;
          display: flex; align-items: center; gap: 10px;
          position: relative; z-index: 1;
          transition: color 0.25s;
          height: 36px; cursor: none;
        }
        .tm-sidebar-link.tm-active { color: var(--tm-accent); font-weight: 500; }
        .tm-sidebar-link:hover { color: var(--tm-primary); }
        .tm-nav-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: currentColor; flex-shrink: 0;
          transition: transform 0.3s var(--tm-spring);
        }
        .tm-sidebar-link.tm-active .tm-nav-dot { transform: scale(1.6); }
        .tm-sidebar-socials {
          display: flex; gap: 12px; flex-wrap: wrap; margin-top: 32px;
        }
        .tm-social-link {
          font-family: var(--tm-font-mono); font-size: 10px;
          letter-spacing: 0.08em; color: var(--tm-gray);
          text-decoration: none; border: 1px solid var(--tm-border);
          padding: 5px 10px; border-radius: 20px;
          transition: all 0.25s var(--tm-ease-out); cursor: none;
        }
        .tm-social-link:hover {
          background: var(--tm-accent); color: white;
          border-color: var(--tm-accent); transform: translateY(-2px);
        }

        /* MAIN */
        .tm-main {
          margin-left: var(--tm-sidebar-w);
          flex: 1;
          padding: 0 64px 120px 72px;
          max-width: 900px;
        }

        /* SECTIONS */
        .tm-section { padding: 100px 0 0 0; }
        .tm-section-label {
          font-family: var(--tm-font-mono); font-size: 11px;
          letter-spacing: 0.15em; color: var(--tm-accent);
          text-transform: uppercase; margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .tm-section-label::after {
          content: ''; height: 1px; flex: 1;
          background: var(--tm-accent); opacity: 0.3;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.8s var(--tm-ease-out) 0.3s;
        }
        .tm-section-label.tm-revealed::after { transform: scaleX(1); }
        .tm-section-heading {
          font-family: var(--tm-font-display);
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 800; line-height: 1.1; margin-bottom: 48px;
        }

        /* REVEAL ANIMATIONS */
        .tm-reveal {
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.7s var(--tm-ease-out), transform 0.7s var(--tm-ease-out);
        }
        .tm-reveal.tm-revealed { opacity: 1; transform: translateY(0); }
        .tm-reveal-d1 { transition-delay: 0.1s; }
        .tm-reveal-d2 { transition-delay: 0.2s; }
        .tm-reveal-d3 { transition-delay: 0.3s; }
        .tm-reveal-d4 { transition-delay: 0.4s; }

        /* HERO */
        .tm-hero { padding: 100px 0 80px 0; position: relative; overflow: hidden; }
        .tm-hero-bg-num {
          position: absolute; right: -20px; top: 30px;
          font-family: var(--tm-font-display); font-size: 280px;
          font-weight: 900; color: var(--tm-accent); opacity: 0.04;
          line-height: 1; user-select: none; pointer-events: none;
          animation: tmNumDrift 12s ease-in-out infinite alternate;
        }
        @keyframes tmNumDrift {
          from { transform: translateY(0px) rotate(-2deg); }
          to   { transform: translateY(-20px) rotate(0deg); }
        }
        .tm-hero-words { overflow: hidden; margin-bottom: 4px; }
        .tm-hero-word {
          display: inline-block;
          font-family: var(--tm-font-display);
          font-size: clamp(48px, 6vw, 80px);
          font-weight: 900; line-height: 1.05;
          transform: translateY(110%);
          transition: transform 0.9s var(--tm-spring);
          margin-right: 16px;
        }
        .tm-hero-word.tm-visible { transform: translateY(0); }
        .tm-hero-title-wrap {
          display: flex; align-items: center; gap: 16px;
          margin: 24px 0 32px; overflow: hidden; height: 28px;
        }
        .tm-hero-title-line {
          width: 40px; height: 2px; background: var(--tm-accent); flex-shrink: 0;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.6s var(--tm-ease-out) 1.2s;
        }
        .tm-hero-title-line.tm-visible { transform: scaleX(1); }
        .tm-typewriter-wrap {
          font-family: var(--tm-font-mono); font-size: 14px;
          letter-spacing: 0.08em; color: var(--tm-accent);
        }
        .tm-tw-cursor {
          display: inline-block; width: 2px; height: 14px;
          background: var(--tm-accent); margin-left: 2px;
          vertical-align: middle;
          animation: tmBlink 0.8s step-end infinite;
        }
        @keyframes tmBlink { 50% { opacity: 0; } }
        .tm-hero-bio {
          font-size: 17px; color: var(--tm-gray);
          max-width: 540px; line-height: 1.75;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s var(--tm-ease-out) 1.6s, transform 0.7s var(--tm-ease-out) 1.6s;
        }
        .tm-hero-bio.tm-visible { opacity: 1; transform: translateY(0); }
        .tm-hero-meta {
          display: flex; gap: 24px; margin-top: 40px; flex-wrap: wrap;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s var(--tm-ease-out) 1.9s, transform 0.6s var(--tm-ease-out) 1.9s;
        }
        .tm-hero-meta.tm-visible { opacity: 1; transform: translateY(0); }
        .tm-hero-meta-item {
          font-family: var(--tm-font-mono); font-size: 12px; color: var(--tm-gray);
          display: flex; align-items: center; gap: 7px;
        }
        .tm-meta-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--tm-accent);
        }

        /* TAGLINE FLOOD */
        .tm-tagline-section {
          background: var(--tm-primary);
          margin: 80px -72px 0 -72px;
          padding: 80px 72px;
          clip-path: inset(0 100% 0 0);
          transition: clip-path 1s var(--tm-ease-out);
          overflow: hidden;
        }
        .tm-tagline-section.tm-revealed { clip-path: inset(0 0% 0 0); }
        .tm-tagline-quote {
          font-family: var(--tm-font-display); font-size: 120px;
          color: var(--tm-accent); opacity: 0.15;
          line-height: 0.6; display: block; margin-bottom: 16px;
        }
        .tm-tagline-text {
          font-family: var(--tm-font-display);
          font-size: clamp(26px, 3.5vw, 42px);
          font-weight: 800; color: var(--tm-white); line-height: 1.25;
        }

        /* EXPERIENCE */
        .tm-exp-timeline { position: relative; padding-left: 32px; }
        .tm-exp-spine {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: var(--tm-border); overflow: hidden;
        }
        .tm-exp-spine-fill {
          width: 100%; background: var(--tm-accent);
          height: 0%; transition: height 1.2s var(--tm-ease-out);
        }
        .tm-exp-spine-fill.tm-filled { height: 100%; }
        .tm-exp-card {
          position: relative; margin-bottom: 52px;
          opacity: 0; transform: translateX(40px);
          transition: opacity 0.7s var(--tm-ease-out), transform 0.7s var(--tm-spring);
        }
        .tm-exp-card.tm-revealed { opacity: 1; transform: translateX(0); }
        .tm-exp-card::before {
          content: ''; position: absolute;
          left: -37px; top: 6px;
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--tm-white); border: 2px solid var(--tm-accent);
          transition: transform 0.3s var(--tm-spring), background 0.3s;
        }
        .tm-exp-card:hover::before { transform: scale(1.5); background: var(--tm-accent); }
        .tm-exp-card-inner {
          background: var(--tm-white); border: 1px solid var(--tm-border);
          border-radius: 16px; padding: 28px 32px;
          position: relative; overflow: hidden;
          transition: box-shadow 0.4s var(--tm-ease-out), transform 0.4s var(--tm-spring);
        }
        .tm-exp-card-inner::after {
          content: ''; position: absolute; left: 0; top: 0;
          width: 3px; height: 0%; background: var(--tm-accent);
          transition: height 0.4s var(--tm-ease-out);
          border-radius: 0 0 2px 2px;
        }
        .tm-exp-card-inner:hover::after { height: 100%; }
        .tm-exp-card-inner:hover {
          box-shadow: 0 20px 60px rgba(224,122,95,0.12), 0 4px 16px rgba(26,26,46,0.06);
          transform: translateY(-3px);
        }
        .tm-exp-year {
          font-family: var(--tm-font-mono); font-size: 11px;
          color: var(--tm-accent); letter-spacing: 0.1em; margin-bottom: 8px; opacity: 0.8;
        }
        .tm-exp-role {
          font-family: var(--tm-font-display); font-size: 22px;
          font-weight: 700; margin-bottom: 4px;
        }
        .tm-exp-company {
          font-family: var(--tm-font-mono); font-size: 13px;
          color: var(--tm-gray); margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .tm-exp-badge {
          background: var(--tm-accent-mid); color: var(--tm-accent);
          padding: 2px 8px; border-radius: 10px; font-size: 11px;
        }
        .tm-exp-desc {
          font-size: 15px; color: var(--tm-gray);
          line-height: 1.75; max-width: 560px;
        }
        .tm-exp-ghost-year {
          position: absolute; right: 20px; bottom: -10px;
          font-family: var(--tm-font-display); font-size: 80px;
          font-weight: 900; color: var(--tm-primary);
          opacity: 0.03; pointer-events: none; user-select: none;
        }

        /* PROJECTS */
        .tm-projects-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
        }
        .tm-project-featured { grid-column: 1 / -1; }
        .tm-project-card {
          background: var(--tm-white); border: 1px solid var(--tm-border);
          border-radius: 20px; padding: 32px;
          position: relative; overflow: hidden;
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.7s var(--tm-ease-out), transform 0.7s var(--tm-spring), box-shadow 0.4s;
          cursor: none;
        }
        .tm-project-card.tm-revealed { opacity: 1; transform: translateY(0); }
        .tm-project-sweep {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--tm-accent) 0%, #C9A84C 100%);
          transform: translateX(-110%) skewX(-15deg);
          transition: transform 0.6s var(--tm-ease-out);
          opacity: 0.06; pointer-events: none;
        }
        .tm-project-card:hover .tm-project-sweep { transform: translateX(0) skewX(-15deg); }
        .tm-project-card:hover {
          box-shadow: 0 24px 64px rgba(224,122,95,0.15), 0 4px 16px rgba(26,26,46,0.06);
          transform: translateY(-4px) !important;
        }
        .tm-project-num {
          font-family: var(--tm-font-mono); font-size: 11px;
          color: var(--tm-accent); letter-spacing: 0.15em; margin-bottom: 14px;
        }
        .tm-project-name {
          font-family: var(--tm-font-display); font-size: 22px;
          font-weight: 700; margin-bottom: 10px; line-height: 1.25;
        }
        .tm-project-featured .tm-project-name { font-size: 30px; }
        .tm-project-desc {
          font-size: 14px; color: var(--tm-gray);
          line-height: 1.7; margin-bottom: 20px;
        }
        .tm-tech-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .tm-chip {
          font-family: var(--tm-font-mono); font-size: 11px;
          letter-spacing: 0.06em; background: var(--tm-gray-light);
          color: var(--tm-primary); padding: 4px 12px; border-radius: 20px;
          opacity: 0; transform: scale(0.7);
          transition: opacity 0.4s var(--tm-spring), transform 0.4s var(--tm-spring), background 0.25s, color 0.25s;
        }
        .tm-chip.tm-popped { opacity: 1; transform: scale(1); }
        .tm-chip:hover { background: var(--tm-accent); color: white; transform: scale(1.05) !important; }
        .tm-project-links { display: flex; gap: 16px; }
        .tm-project-link {
          font-family: var(--tm-font-mono); font-size: 12px;
          letter-spacing: 0.06em; color: var(--tm-accent);
          text-decoration: none; position: relative; cursor: none;
        }
        .tm-project-link::after {
          content: ''; position: absolute; left: 0; bottom: -2px;
          width: 0%; height: 1px; background: var(--tm-accent);
          transition: width 0.3s var(--tm-ease-out);
        }
        .tm-project-link:hover::after { width: 100%; }

        /* CAREER STORY */
        .tm-career-story {
          background: var(--tm-accent-light);
          margin: 80px -72px 0 -72px;
          padding: 80px 72px;
        }
        .tm-career-quote-mark {
          font-family: var(--tm-font-display); font-size: 100px;
          line-height: 0.5; color: var(--tm-accent); opacity: 0.3;
          margin-bottom: 24px; display: block;
        }
        .tm-career-story-text {
          font-family: var(--tm-font-display);
          font-size: clamp(18px, 2.5vw, 24px);
          line-height: 1.7; color: var(--tm-primary);
          max-width: 680px; font-style: italic;
        }

        /* SKILLS */
        .tm-skills-categories { display: flex; flex-direction: column; gap: 48px; }
        .tm-skill-cat-label {
          font-family: var(--tm-font-mono); font-size: 11px;
          letter-spacing: 0.15em; color: var(--tm-accent);
          text-transform: uppercase; margin-bottom: 16px;
          opacity: 0; transform: translateX(-20px);
          transition: opacity 0.5s, transform 0.5s var(--tm-ease-out);
        }
        .tm-skill-cat-label.tm-revealed { opacity: 1; transform: translateX(0); }
        .tm-skills-burst { display: flex; flex-wrap: wrap; gap: 10px; }
        .tm-skill-item {
          font-size: 14px; font-weight: 500;
          padding: 8px 18px; border-radius: 50px;
          border: 1.5px solid var(--tm-border); background: var(--tm-white);
          position: relative; overflow: hidden;
          opacity: 0; transform: scale(0.6) translateY(10px);
          transition: opacity 0.5s var(--tm-spring), transform 0.5s var(--tm-spring), border-color 0.3s, box-shadow 0.3s;
          cursor: none;
        }
        .tm-skill-item.tm-popped { opacity: 1; transform: scale(1) translateY(0); }
        .tm-skill-ripple {
          position: absolute; inset: -1px; border-radius: inherit;
          background: var(--tm-accent); transform: scale(0); opacity: 0;
          transition: transform 0.4s var(--tm-spring), opacity 0.4s;
        }
        .tm-skill-item:hover .tm-skill-ripple { transform: scale(1.15); opacity: 0.1; }
        .tm-skill-item:hover { border-color: var(--tm-accent); box-shadow: 0 4px 16px rgba(224,122,95,0.18); }
        .tm-skill-item span { position: relative; z-index: 1; }

        /* WORK STYLE */
        .tm-workstyle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .tm-workstyle-item {
          display: flex; gap: 20px; align-items: flex-start;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.6s var(--tm-ease-out), transform 0.6s var(--tm-spring);
        }
        .tm-workstyle-item.tm-revealed { opacity: 1; transform: translateY(0); }
        .tm-workstyle-num {
          font-family: var(--tm-font-mono); font-size: 36px; font-weight: 500;
          color: var(--tm-accent); line-height: 1; flex-shrink: 0; min-width: 48px;
        }
        .tm-workstyle-content h4 {
          font-family: var(--tm-font-display); font-size: 17px;
          font-weight: 700; margin-bottom: 6px;
        }
        .tm-workstyle-content p { font-size: 14px; color: var(--tm-gray); line-height: 1.65; }

        /* EDUCATION */
        .tm-edu-list { display: flex; flex-direction: column; }
        .tm-edu-item {
          display: grid; grid-template-columns: 140px 1fr; gap: 24px;
          padding: 24px 0; border-bottom: 1px solid var(--tm-border);
          position: relative; overflow: hidden;
        }
        .tm-edu-item::before {
          content: ''; position: absolute; left: 0; bottom: 0;
          width: 0%; height: 1px; background: var(--tm-accent);
          transition: width 0.8s var(--tm-ease-out);
        }
        .tm-edu-item.tm-revealed::before { width: 100%; }
        .tm-edu-year { font-family: var(--tm-font-mono); font-size: 12px; color: var(--tm-gray); padding-top: 4px; }
        .tm-edu-degree { font-family: var(--tm-font-display); font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .tm-edu-institution { font-family: var(--tm-font-mono); font-size: 12px; color: var(--tm-accent); }

        /* CERTIFICATIONS */
        .tm-cert-list { display: flex; flex-direction: column; gap: 16px; }
        .tm-cert-item {
          background: var(--tm-white); border: 1px solid var(--tm-border);
          border-radius: 12px; padding: 20px 24px;
          display: flex; justify-content: space-between; align-items: center;
          opacity: 0; transform: translateX(-24px);
          transition: opacity 0.6s var(--tm-ease-out), transform 0.6s var(--tm-spring), box-shadow 0.3s;
        }
        .tm-cert-item.tm-revealed { opacity: 1; transform: translateX(0); }
        .tm-cert-item:hover { box-shadow: 0 8px 24px rgba(224,122,95,0.12); }
        .tm-cert-name { font-weight: 600; font-size: 15px; }
        .tm-cert-issuer { font-family: var(--tm-font-mono); font-size: 11px; color: var(--tm-gray); margin-top: 4px; }
        .tm-cert-date {
          font-family: var(--tm-font-mono); font-size: 11px;
          color: var(--tm-accent); background: var(--tm-accent-light);
          padding: 4px 10px; border-radius: 10px; white-space: nowrap;
        }

        /* LOOKING FOR */
        .tm-looking-for {
          background: var(--tm-primary);
          margin: 80px -72px 0 -72px; padding: 80px 72px;
          clip-path: inset(0 100% 0 0);
          transition: clip-path 1.1s var(--tm-ease-out);
          position: relative; overflow: hidden;
        }
        .tm-looking-for.tm-revealed { clip-path: inset(0 0% 0 0); }
        .tm-looking-label {
          font-family: var(--tm-font-mono); font-size: 11px;
          letter-spacing: 0.15em; color: rgba(255,255,255,0.4);
          text-transform: uppercase; margin-bottom: 20px;
        }
        .tm-looking-text {
          font-family: var(--tm-font-display);
          font-size: clamp(24px, 3vw, 38px);
          font-weight: 800; color: var(--tm-white); line-height: 1.3; max-width: 600px;
        }
        .tm-looking-pattern {
          position: absolute; right: 72px; top: 50%; transform: translateY(-50%);
          opacity: 0.04; font-family: var(--tm-font-display);
          font-size: 180px; font-weight: 900; color: white; user-select: none;
        }

        /* CONTACT */
        .tm-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 48px; }
        .tm-contact-item {
          background: var(--tm-white); border: 1px solid var(--tm-border);
          border-radius: 16px; padding: 24px 28px;
          text-decoration: none; color: inherit; display: block;
          transition: all 0.35s var(--tm-spring);
          position: relative; overflow: hidden; cursor: none;
          opacity: 0; transform: translateY(24px);
        }
        .tm-contact-item.tm-revealed { opacity: 1; transform: translateY(0); }
        .tm-contact-item::before {
          content: ''; position: absolute; inset: 0;
          background: var(--tm-accent); transform: translateY(100%);
          transition: transform 0.4s var(--tm-ease-out);
        }
        .tm-contact-item:hover::before { transform: translateY(0); }
        .tm-contact-item:hover { color: white; transform: translateY(-4px) !important; }
        .tm-contact-item:hover .tm-contact-type { color: rgba(255,255,255,0.7); }
        .tm-contact-type {
          font-family: var(--tm-font-mono); font-size: 10px;
          letter-spacing: 0.15em; color: var(--tm-gray);
          text-transform: uppercase; margin-bottom: 8px; position: relative; z-index: 1;
        }
        .tm-contact-value { font-size: 16px; font-weight: 600; position: relative; z-index: 1; }

        /* FOOTER */
        .tm-footer {
          margin-top: 80px; padding: 40px 0;
          border-top: 1px solid var(--tm-border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .tm-footer-name { font-family: var(--tm-font-display); font-size: 20px; font-weight: 700; }
        .tm-footer-copy { font-family: var(--tm-font-mono); font-size: 11px; color: var(--tm-gray); }

        /* MOBILE NAV */
        .tm-mobile-nav {
          display: none; position: fixed;
          top: 0; left: 0; right: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          padding: 16px 32px; z-index: 100;
          border-bottom: 1px solid var(--tm-border);
          justify-content: space-between; align-items: center;
        }
        .tm-mobile-nav-name { font-family: var(--tm-font-display); font-size: 18px; font-weight: 800; }
        .tm-mobile-nav-title { font-family: var(--tm-font-mono); font-size: 11px; color: var(--tm-accent); }

        /* RESPONSIVE */
        @media (max-width: 960px) {
          .tm-sidebar { display: none; }
          .tm-main { margin-left: 0; padding: 0 32px 80px; max-width: 100%; }
          .tm-mobile-nav { display: flex !important; }
          .tm-hero { padding-top: 120px; }
          .tm-workstyle-grid { grid-template-columns: 1fr; }
          .tm-contact-grid { grid-template-columns: 1fr; }
          .tm-tagline-section,
          .tm-career-story,
          .tm-looking-for { margin-left: -32px; margin-right: -32px; padding-left: 32px; padding-right: 32px; }
        }
        @media (max-width: 600px) {
          .tm-main { padding: 0 20px 60px; }
          .tm-hero-word { font-size: 40px !important; }
          .tm-projects-grid { grid-template-columns: 1fr; }
          .tm-project-featured { grid-column: 1; }
          .tm-edu-item { grid-template-columns: 1fr; gap: 8px; }
          .tm-footer { flex-direction: column; gap: 12px; text-align: center; }
          .tm-tagline-section,
          .tm-career-story,
          .tm-looking-for { margin-left: -20px; margin-right: -20px; padding-left: 20px; padding-right: 20px; }
        }
      `}</style>

      <div className="tm-root">
        {/* CURSOR */}
        <div id="tm-cursor" className="tm-cursor" />
        {/* PROGRESS BAR */}
        <div id="tm-progress-bar" className="tm-progress-bar" />
        {/* ORBS */}
        <div className="tm-orb tm-orb-1" />
        <div className="tm-orb tm-orb-2" />

        {/* MOBILE NAV */}
        <nav className="tm-mobile-nav">
          <div>
            <div className="tm-mobile-nav-name">{personal.fullName}</div>
            <div className="tm-mobile-nav-title">{personal.professionalTitle}</div>
          </div>
        </nav>

        <div className="tm-layout">

          {/* SIDEBAR */}
          <aside className="tm-sidebar">
            <div className="tm-sidebar-scroll-bar" id="tm-sidebar-scroll-bar" />

            <div className="tm-sidebar-avatar">
              {personal.profilePhotoUrl ? (
                <img src={personal.profilePhotoUrl} alt={personal.fullName} />
              ) : (
                <div className="tm-sidebar-avatar-initials">{initials}</div>
              )}
            </div>

            <div className="tm-sidebar-name">{personal.fullName}</div>
            <div className="tm-sidebar-title">{personal.professionalTitle}</div>

            <nav className="tm-sidebar-nav" id="tm-sidebar-nav">
              <div className="tm-nav-pill" id="tm-nav-pill" />
              {navSections.map((s) => (
                <a
                  key={s.id}
                  href={`#tm-${s.id}`}
                  className="tm-sidebar-link"
                  data-section={s.id}
                >
                  <span className="tm-nav-dot" />
                  {s.label}
                </a>
              ))}
            </nav>

            <div className="tm-sidebar-socials">
              {personal.linkedinUrl && (
                <a href={personal.linkedinUrl} target="_blank" rel="noreferrer" className="tm-social-link tm-magnetic">
                  LinkedIn
                </a>
              )}
              {personal.githubUrl && (
                <a href={personal.githubUrl} target="_blank" rel="noreferrer" className="tm-social-link tm-magnetic">
                  GitHub
                </a>
              )}
              {personal.websiteUrl && (
                <a href={personal.websiteUrl} target="_blank" rel="noreferrer" className="tm-social-link tm-magnetic">
                  Website
                </a>
              )}
            </div>
          </aside>

          {/* MAIN */}
          <main className="tm-main">

            {/* HERO */}
            <section id="tm-hero" className="tm-hero">
              <div className="tm-hero-bg-num">01</div>

              <div className="tm-hero-words">
                {personal.fullName.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className="tm-hero-word"
                    style={{ transitionDelay: `${0.1 + i * 0.15}s` }}
                  >
                    {word}
                  </span>
                ))}
              </div>

              <div className="tm-hero-title-wrap">
                <div className="tm-hero-title-line" />
                <div className="tm-typewriter-wrap">
                  <span id="tm-typewriter-text" />
                  <span className="tm-tw-cursor" id="tm-tw-cursor" />
                </div>
              </div>

              {personal.bio && (
                <p className="tm-hero-bio">{personal.bio}</p>
              )}

              <div className="tm-hero-meta">
                {personal.location && (
                  <div className="tm-hero-meta-item">
                    <span className="tm-meta-dot" />{personal.location}
                  </div>
                )}
                {personal.email && (
                  <div className="tm-hero-meta-item">
                    <span className="tm-meta-dot" />{personal.email}
                  </div>
                )}
                {personal.phone && (
                  <div className="tm-hero-meta-item">
                    <span className="tm-meta-dot" />{personal.phone}
                  </div>
                )}
              </div>
            </section>

            {/* TAGLINE */}
            {tagline && (
              <div id="tm-tagline-section" className="tm-tagline-section">
                <span className="tm-tagline-quote">"</span>
                <p className="tm-tagline-text">{tagline}</p>
              </div>
            )}

            {/* EXPERIENCE */}
            {experience.length > 0 && (
              <section id="tm-experience" className="tm-section">
                <div className="tm-section-label tm-reveal">Experience</div>
                <h2 className="tm-section-heading tm-reveal tm-reveal-d1">Where I've built things</h2>

                <div className="tm-exp-timeline">
                  <div className="tm-exp-spine">
                    <div className="tm-exp-spine-fill" id="tm-exp-spine-fill" />
                  </div>

                  {experience.map((exp, i) => {
                    const start = exp.startDate
                    const end = exp.isCurrent ? "Present" : (exp.endDate ?? "")
                    const yearRange = end ? `${start} — ${end}` : start
                    return (
                      <div key={i} className="tm-exp-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                        <div className="tm-exp-card-inner">
                          <div className="tm-exp-year">{yearRange}</div>
                          <div className="tm-exp-role">{exp.roleTitle}</div>
                          <div className="tm-exp-company">
                            {exp.companyName}
                            {exp.isCurrent && <span className="tm-exp-badge">Current</span>}
                            {exp.location && <span style={{ opacity: 0.6 }}>· {exp.location}</span>}
                          </div>
                          {exp.description && <div className="tm-exp-desc">{exp.description}</div>}
                          <div className="tm-exp-ghost-year">{start.slice(0, 4)}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* PROJECTS */}
            {projects.length > 0 && (
              <section id="tm-projects" className="tm-section">
                <div className="tm-section-label tm-reveal">Projects</div>
                <h2 className="tm-section-heading tm-reveal tm-reveal-d1">Selected work</h2>

                <div className="tm-projects-grid">
                  {featuredProject && (
                    <div className={`tm-project-card tm-project-featured tm-reveal`}>
                      <div className="tm-project-sweep" />
                      <div className="tm-project-num">01 / Featured</div>
                      <div className="tm-project-name">{featuredProject.projectName}</div>
                      {featuredProject.description && (
                        <div className="tm-project-desc">{featuredProject.description}</div>
                      )}
                      <div className="tm-tech-chips">
                        {featuredProject.techStack.map((t, ti) => (
                          <span key={ti} className="tm-chip">{t}</span>
                        ))}
                      </div>
                      <div className="tm-project-links">
                        {featuredProject.liveUrl && (
                          <a href={featuredProject.liveUrl} target="_blank" rel="noreferrer" className="tm-project-link">
                            Live Demo →
                          </a>
                        )}
                        {featuredProject.githubUrl && (
                          <a href={featuredProject.githubUrl} target="_blank" rel="noreferrer" className="tm-project-link">
                            GitHub →
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {otherProjects.map((proj, i) => (
                    <div
                      key={i}
                      className={`tm-project-card tm-reveal tm-reveal-d${Math.min(i + 1, 4) as 1 | 2 | 3 | 4}`}
                    >
                      <div className="tm-project-sweep" />
                      <div className="tm-project-num">0{i + 2}</div>
                      <div className="tm-project-name">{proj.projectName}</div>
                      {proj.description && <div className="tm-project-desc">{proj.description}</div>}
                      <div className="tm-tech-chips">
                        {proj.techStack.map((t, ti) => (
                          <span key={ti} className="tm-chip">{t}</span>
                        ))}
                      </div>
                      <div className="tm-project-links">
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="tm-project-link">
                            Live Demo →
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="tm-project-link">
                            GitHub →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CAREER STORY */}
            {careerStory && (
              <div id="tm-career-story" className="tm-career-story">
                <span className="tm-career-quote-mark tm-reveal">"</span>
                <p className="tm-career-story-text tm-reveal tm-reveal-d1">{careerStory}</p>
              </div>
            )}

            {/* SKILLS */}
            {skills.length > 0 && (
              <section id="tm-skills" className="tm-section">
                <div className="tm-section-label tm-reveal">Skills</div>
                <h2 className="tm-section-heading tm-reveal tm-reveal-d1">What I bring</h2>

                <div className="tm-skills-categories">
                  {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
                    <div key={cat}>
                      <div className="tm-skill-cat-label">{cat}</div>
                      <div className="tm-skills-burst">
                        {catSkills.map((skill, si) => (
                          <div key={si} className="tm-skill-item">
                            <div className="tm-skill-ripple" />
                            <span>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* WORK STYLE */}
            {workStyle && workStylePrinciples.length > 0 && (
              <section id="tm-workstyle" className="tm-section">
                <div className="tm-section-label tm-reveal">How I Work</div>
                <h2 className="tm-section-heading tm-reveal tm-reveal-d1">My principles</h2>

                <div className="tm-workstyle-grid">
                  {workStylePrinciples.map((p, i) => (
                    <div key={i} className="tm-workstyle-item">
                      <div className="tm-workstyle-num">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="tm-workstyle-content">
                        <h4>{p.title}</h4>
                        {p.body && <p>{p.body}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EDUCATION */}
            {education.length > 0 && (
              <section id="tm-education" className="tm-section">
                <div className="tm-section-label tm-reveal">Education</div>
                <h2 className="tm-section-heading tm-reveal tm-reveal-d1">Academic background</h2>

                <div className="tm-edu-list">
                  {education.map((edu, i) => {
                    const yearRange =
                      edu.startYear && edu.endYear
                        ? `${edu.startYear} — ${edu.endYear}`
                        : edu.endYear ?? edu.startYear ?? ""
                    return (
                      <div key={i} className={`tm-edu-item tm-reveal tm-reveal-d${Math.min(i, 3) as 0 | 1 | 2 | 3}`}>
                        <div className="tm-edu-year">{yearRange}</div>
                        <div>
                          <div className="tm-edu-degree">
                            {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                          </div>
                          <div className="tm-edu-institution">{edu.institution}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* CERTIFICATIONS */}
            {certifications && certifications.length > 0 && (
              <section id="tm-certifications" className="tm-section">
                <div className="tm-section-label tm-reveal">Certifications</div>
                <div className="tm-cert-list">
                  {certifications.map((cert, i) => (
                    <div key={i} className="tm-cert-item" style={{ transitionDelay: `${i * 0.1}s` }}>
                      <div>
                        <div className="tm-cert-name">{cert.name}</div>
                        {cert.issuer && <div className="tm-cert-issuer">{cert.issuer}</div>}
                      </div>
                      {cert.date && <div className="tm-cert-date">{cert.date}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* LOOKING FOR */}
            {lookingFor && (
              <div id="tm-looking-for" className="tm-looking-for">
                <div className="tm-looking-label">What's next</div>
                <div className="tm-looking-text">{lookingFor}</div>
                <div className="tm-looking-pattern">→</div>
              </div>
            )}

            {/* CONTACT */}
            <section id="tm-contact" className="tm-section">
              <div className="tm-section-label tm-reveal">Contact</div>
              <h2 className="tm-section-heading tm-reveal tm-reveal-d1">Let's talk</h2>

              <div className="tm-contact-grid">
                {personal.email && (
                  <a href={`mailto:${personal.email}`} className="tm-contact-item">
                    <div className="tm-contact-type">Email</div>
                    <div className="tm-contact-value">{personal.email}</div>
                  </a>
                )}
                {personal.phone && (
                  <a href={`tel:${personal.phone}`} className="tm-contact-item">
                    <div className="tm-contact-type">Phone</div>
                    <div className="tm-contact-value">{personal.phone}</div>
                  </a>
                )}
                {personal.linkedinUrl && (
                  <a href={personal.linkedinUrl} target="_blank" rel="noreferrer" className="tm-contact-item">
                    <div className="tm-contact-type">LinkedIn</div>
                    <div className="tm-contact-value">{personal.linkedinUrl.replace(/^https?:\/\//, "")}</div>
                  </a>
                )}
                {personal.location && (
                  <div className="tm-contact-item" style={{ cursor: "default" }}>
                    <div className="tm-contact-type">Location</div>
                    <div className="tm-contact-value">{personal.location}</div>
                  </div>
                )}
              </div>
            </section>

            <footer className="tm-footer">
              <div className="tm-footer-name">{personal.fullName}</div>
              <div className="tm-footer-copy">© {new Date().getFullYear()} — Built with PortfolioAI</div>
            </footer>

          </main>
        </div>

        {/* CLIENT-SIDE EFFECTS */}
        <TMEffects professionalTitle={personal.professionalTitle} navSections={navSections} />
      </div>
    </>
  )
}

// ── Effects component (all useEffect / DOM logic isolated here) ──
function TMEffects({
  professionalTitle,
  navSections,
}: {
  professionalTitle: string
  navSections: { id: string; label: string }[]
}) {
  useEffect(() => {
    // ── CURSOR ──
    const cursor = document.getElementById("tm-cursor")
    if (cursor) {
      document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px"
        cursor.style.top = e.clientY + "px"
      })
      document
        .querySelectorAll("a, button, .tm-project-card, .tm-skill-item, .tm-exp-card-inner, .tm-contact-item")
        .forEach((el) => {
          el.addEventListener("mouseenter", () => cursor.classList.add("tm-hovering"))
          el.addEventListener("mouseleave", () => cursor.classList.remove("tm-hovering"))
        })
    }

    // ── SCROLL PROGRESS ──
    const progressBar = document.getElementById("tm-progress-bar")
    const sidebarScrollBar = document.getElementById("tm-sidebar-scroll-bar")
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      const pct = (window.scrollY / h) * 100
      if (progressBar) progressBar.style.width = pct + "%"
      if (sidebarScrollBar) sidebarScrollBar.style.height = pct + "%"
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    // ── HERO ANIMATIONS ──
    const words = document.querySelectorAll(".tm-hero-word")
    words.forEach((w) => setTimeout(() => w.classList.add("tm-visible"), 100))

    setTimeout(() => {
      document.querySelectorAll(".tm-hero-title-line").forEach((l) => l.classList.add("tm-visible"))
    }, 800)

    // Typewriter
    const tw = document.getElementById("tm-typewriter-text")
    const twCursor = document.getElementById("tm-tw-cursor")
    if (tw && twCursor) {
      let i = 0
      setTimeout(() => {
        const interval = setInterval(() => {
          tw.textContent += professionalTitle[i++]
          if (i >= professionalTitle.length) {
            clearInterval(interval)
            setTimeout(() => { twCursor.style.display = "none" }, 1800)
          }
        }, 55)
      }, 1100)
    }

    setTimeout(() => document.querySelector(".tm-hero-bio")?.classList.add("tm-visible"), 1700)
    setTimeout(() => document.querySelector(".tm-hero-meta")?.classList.add("tm-visible"), 2000)

    // ── INTERSECTION OBSERVERS ──
    const makeObs = (cb: (el: Element, i?: number) => void, threshold = 0.12) =>
      new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) { cb(e.target); obs.unobserve(e.target) }
          }),
        { threshold }
      )

    // Generic reveals
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("tm-revealed"); obs.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll(".tm-reveal").forEach((el) => obs.observe(el))

    // Section labels
    const labelObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("tm-revealed"); labelObs.unobserve(e.target) }
      }),
      { threshold: 0.5 }
    )
    document.querySelectorAll(".tm-section-label").forEach((el) => labelObs.observe(el))

    // Flood panels
    const floodObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("tm-revealed"); floodObs.unobserve(e.target) }
      }),
      { threshold: 0.2 }
    )
    document.querySelectorAll("#tm-tagline-section, #tm-looking-for").forEach((el) => floodObs.observe(el))

    // Exp cards + spine
    const expObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("tm-revealed"); expObs.unobserve(e.target) }
      }),
      { threshold: 0.15 }
    )
    document.querySelectorAll(".tm-exp-card").forEach((el) => expObs.observe(el))

    const spineObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          document.getElementById("tm-exp-spine-fill")?.classList.add("tm-filled")
          spineObs.disconnect()
        }
      }),
      { threshold: 0.1 }
    )
    const expSec = document.getElementById("tm-experience")
    if (expSec) spineObs.observe(expSec)

    // Project cards + chip pop
    const projObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("tm-revealed")
          e.target.querySelectorAll(".tm-chip").forEach((chip, ci) => {
            setTimeout(() => chip.classList.add("tm-popped"), 200 + ci * 80)
          })
          projObs.unobserve(e.target)
        }
      }),
      { threshold: 0.15 }
    )
    document.querySelectorAll(".tm-project-card").forEach((el) => projObs.observe(el))

    // Skills
    const skillsObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".tm-skill-cat-label").forEach((l) => l.classList.add("tm-revealed"))
          e.target.querySelectorAll(".tm-skill-item").forEach((item, si) => {
            setTimeout(() => item.classList.add("tm-popped"), 100 + si * 60)
          })
          skillsObs.unobserve(e.target)
        }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll(".tm-skills-categories > div").forEach((el) => skillsObs.observe(el))

    // Workstyle
    const wsObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("tm-revealed"); wsObs.unobserve(e.target) }
      }),
      { threshold: 0.2 }
    )
    document.querySelectorAll(".tm-workstyle-item").forEach((el, i) => {
      ;(el as HTMLElement).style.transitionDelay = i * 0.12 + "s"
      wsObs.observe(el)
    })

    // Edu
    const eduObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("tm-revealed"); eduObs.unobserve(e.target) }
      }),
      { threshold: 0.2 }
    )
    document.querySelectorAll(".tm-edu-item").forEach((el) => eduObs.observe(el))

    // Certs
    const certObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("tm-revealed"); certObs.unobserve(e.target) }
      }),
      { threshold: 0.2 }
    )
    document.querySelectorAll(".tm-cert-item").forEach((el, i) => {
      ;(el as HTMLElement).style.transitionDelay = i * 0.1 + "s"
      certObs.observe(el)
    })

    // Contact
    const contactObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("tm-revealed"); contactObs.unobserve(e.target) }
      }),
      { threshold: 0.15 }
    )
    document.querySelectorAll(".tm-contact-item").forEach((el, i) => {
      ;(el as HTMLElement).style.transitionDelay = i * 0.1 + "s"
      contactObs.observe(el)
    })

    // Career story
    const csObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".tm-reveal").forEach((r) => r.classList.add("tm-revealed"))
          csObs.unobserve(e.target)
        }
      }),
      { threshold: 0.2 }
    )
    const csEl = document.getElementById("tm-career-story")
    if (csEl) csObs.observe(csEl)

    // ── ACTIVE NAV PILL ──
    const sectionIds = navSections.map((s) => s.id)
    const navLinks = document.querySelectorAll(".tm-sidebar-link")
    const navPill = document.getElementById("tm-nav-pill")

    const updateNav = () => {
      let current = sectionIds[0]
      sectionIds.forEach((id) => {
        const el = document.getElementById(`tm-${id}`)
        if (el && window.scrollY >= el.offsetTop - 200) current = id
      })
      navLinks.forEach((link, i) => {
        const isActive = (link as HTMLElement).dataset.section === current
        link.classList.toggle("tm-active", isActive)
        if (isActive && navPill) {
          navPill.style.transform = `translateY(${i * 44}px)`
        }
      })
    }
    window.addEventListener("scroll", updateNav, { passive: true })
    updateNav()

    // ── MAGNETIC EFFECT ──
    document.querySelectorAll(".tm-magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e: Event) => {
        const me = e as MouseEvent
        const rect = (el as HTMLElement).getBoundingClientRect()
        const dx = (me.clientX - rect.left - rect.width / 2) * 0.25
        const dy = (me.clientY - rect.top - rect.height / 2) * 0.25
        ;(el as HTMLElement).style.transform = `translate(${dx}px, ${dy}px)`
      })
      el.addEventListener("mouseleave", () => {
        ;(el as HTMLElement).style.transform = ""
      })
    })

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("scroll", updateNav)
    }
  }, [professionalTitle, navSections])

  return null
}
