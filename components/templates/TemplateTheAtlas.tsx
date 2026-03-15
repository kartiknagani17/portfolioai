"use client"
import { useEffect } from "react"
import type { PortfolioData } from "@/types/portfolio"

export default function TemplateTheAtlas({ portfolioData: data }: { portfolioData: PortfolioData }) {
  // ── Normalise data to the shape the template expects ──────────
  const name     = data.personal?.fullName ?? (data as any).name ?? ""
  const nameParts = name.trim().split(" ")
  const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0] || ""
  const lastName  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""

  const experience = (data.experience ?? []).map((e: any) => ({
    companyName: e.companyName ?? e.company ?? e.organization ?? e.employer ?? "",
    roleTitle:   e.roleTitle ?? e.title ?? e.role ?? e.position ?? e.jobTitle ?? "",
    startDate:   e.startDate ?? e.start ?? e.from ?? "",
    endDate:     e.endDate   ?? e.end   ?? e.to   ?? "",
    isCurrent:   e.current   ?? e.isCurrent ?? false,
    location:    e.location  ?? "",
    description: typeof e.description === "string"
      ? e.description
      : Array.isArray(e.description)
        ? (e.description as string[]).join(" ")
        : Array.isArray(e.responsibilities)
          ? (e.responsibilities as string[]).join(" ")
          : e.summary ?? e.details ?? "",
  }))

  const projects = (data.projects ?? []).map((p: any) => ({
    projectName: p.projectName ?? p.name ?? p.title ?? "",
    description: p.description ?? p.summary ?? "",
    techStack:   p.techStack ?? p.technologies ?? p.tech ?? p.stack ?? [],
    liveUrl:     p.url ?? p.link ?? p.liveUrl ?? "",
    githubUrl:   p.github ?? p.githubUrl ?? "",
  }))

  const skills = (data.skills ?? [])
    .map((s: any) => ({ name: typeof s === "string" ? s : s.name ?? s.skill ?? s.technology ?? "" }))
    .filter(s => s.name)

  const education = (data.education ?? []).map((e: any) => ({
    degree:       e.degree ?? e.title ?? "",
    institution:  e.institution ?? e.school ?? e.university ?? "",
    fieldOfStudy: e.fieldOfStudy ?? e.field ?? e.major ?? "",
    startYear:    e.startYear ?? e.start ?? "",
    endYear:      e.endYear ?? e.end ?? e.graduationYear ?? "",
  }))

  const languages = (data.languages ?? []).map((l: any) => ({
    language:    typeof l === "string" ? l : l.language ?? l.name ?? "",
    proficiency: typeof l === "string" ? "Fluent" : l.proficiency ?? l.level ?? l.fluency ?? "Fluent",
  }))

  const interests = (data.interests ?? []).map((i: any) =>
    typeof i === "string" ? i : i.name ?? i.interest ?? String(i)
  )

  const tagline     = data.tagline ?? ""
  const careerStory = data.careerStory ?? ""
  const workStyle   = data.workStyle ?? ""
  const lookingFor  = data.lookingFor ?? ""

  const personal = {
    fullName:         name,
    professionalTitle: data.personal?.professionalTitle ?? (data as any).currentRole ?? "",
    bio:              data.personal?.bio ?? (data as any).bio ?? (data as any).summary ?? "",
    email:            data.personal?.email ?? (data as any).email ?? "",
    phone:            data.personal?.phone ?? (data as any).phone ?? "",
    location:         data.personal?.location ?? (data as any).location ?? "",
    linkedinUrl:      data.personal?.linkedinUrl ?? (data as any).linkedin ?? "",
    githubUrl:        data.personal?.githubUrl ?? (data as any).github ?? "",
    websiteUrl:       data.personal?.websiteUrl ?? (data as any).website ?? "",
  }

  // ── Derived ───────────────────────────────────────────────────
  // Group skills A–Z by first letter
  const skillsByLetter = skills.reduce<Record<string, string[]>>((acc, s) => {
    const letter = s.name[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(s.name)
    return acc
  }, {})
  const sortedLetters = Object.keys(skillsByLetter).sort()

  // Parse workStyle into principle cards
  const principles: { title: string; body: string }[] = (() => {
    if (!workStyle) return []
    const sentences = workStyle.split(/(?<=[.!?])\s+/).filter(Boolean)
    const result: { title: string; body: string }[] = []
    for (let i = 0; i < sentences.length && result.length < 4; i++) {
      const title = sentences[i].replace(/[.!?]$/, "")
      const body  = sentences[i + 1] ?? ""
      result.push({ title, body })
      if (body) i++
    }
    return result
  })()

  // Nav sections — conditional
  const navSections = [
    { id: "ta-hero",       label: "Home" },
    ...(experience.length  ? [{ id: "ta-experience", label: "Experience" }] : []),
    ...(projects.length    ? [{ id: "ta-projects",   label: "Projects"   }] : []),
    ...(skills.length      ? [{ id: "ta-skills",     label: "Skills"     }] : []),
    ...(education.length   ? [{ id: "ta-education",  label: "Education"  }] : []),
    { id: "ta-contact",    label: "Contact" },
  ]

  // Split lookingFor words — last 3 accented
  const lookingWords = lookingFor?.trim().split(" ") ?? []

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .ta-root *,.ta-root *::before,.ta-root *::after{box-sizing:border-box;margin:0;padding:0}

        .ta-root{
          --ta-bg:#FAFAFA;
          --ta-surface:#F0EFE9;
          --ta-ink:#111111;
          --ta-orange:#FF6B35;
          --ta-orange-light:rgba(255,107,53,0.08);
          --ta-orange-glow:rgba(255,107,53,0.25);
          --ta-dim:#6B6B6B;
          --ta-border:rgba(17,17,17,0.1);
          --ta-border-strong:rgba(17,17,17,0.18);
          --ta-ease-out:cubic-bezier(0.16,1,0.3,1);
          --ta-snap:cubic-bezier(0.25,0,0,1);
          background:var(--ta-bg);
          color:var(--ta-ink);
          font-family:'IBM Plex Sans',sans-serif;
          line-height:1.6;
          overflow-x:hidden;
        }

        /* GRAIN */
        .ta-root::after{
          content:'';position:fixed;inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity:0.025;pointer-events:none;z-index:9990;
        }

        /* PROGRESS */
        .ta-progress{
          position:fixed;top:0;left:0;height:3px;width:0%;
          background:var(--ta-orange);z-index:9999;
          transition:width 0.08s linear;
        }

        /* NAV */
        .ta-nav{position:fixed;top:0;left:0;right:0;z-index:1000;transition:all 0.4s var(--ta-ease-out);}
        .ta-nav-inner{
          display:flex;align-items:center;justify-content:space-between;
          padding:0 56px;height:64px;
          background:rgba(250,250,250,0.96);
          backdrop-filter:blur(12px);
          border-bottom:1px solid var(--ta-border);
          transition:all 0.4s var(--ta-ease-out);
        }
        .ta-nav.ta-scrolled .ta-nav-inner{
          padding:0 32px;height:52px;
          border-radius:0 0 16px 16px;
          box-shadow:0 4px 24px rgba(17,17,17,0.07);
        }
        .ta-logo{
          font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:0.05em;
          color:var(--ta-ink);text-decoration:none;
          display:flex;align-items:center;gap:8px;
        }
        .ta-logo-bracket{color:var(--ta-orange);}
        .ta-nav-links{display:flex;gap:0;list-style:none;align-items:center;}
        .ta-nav-links a{
          font-family:'IBM Plex Mono',monospace;font-size:10px;
          letter-spacing:0.12em;text-transform:uppercase;
          color:var(--ta-dim);text-decoration:none;padding:6px 16px;
          position:relative;transition:color 0.15s;
        }
        .ta-nav-links a::after{
          content:'';position:absolute;bottom:-1px;left:16px;right:16px;
          height:2px;background:var(--ta-orange);
          transform:scaleX(0);transform-origin:left;
          transition:transform 0.25s var(--ta-ease-out);
        }
        .ta-nav-links a:hover{color:var(--ta-ink);}
        .ta-nav-links a.ta-active{color:var(--ta-orange);}
        .ta-nav-links a.ta-active::after{transform:scaleX(1);}

        /* BURGER */
        .ta-burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px;}
        .ta-burger span{display:block;width:22px;height:2px;background:var(--ta-ink);border-radius:2px;transition:all 0.25s var(--ta-snap);}
        .ta-burger.ta-open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
        .ta-burger.ta-open span:nth-child(2){opacity:0;transform:scaleX(0);}
        .ta-burger.ta-open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}

        /* MOBILE OVERLAY */
        .ta-mob{
          position:fixed;inset:0;background:var(--ta-bg);z-index:990;
          display:flex;flex-direction:column;justify-content:center;padding:56px;
          transform:translateX(100%);transition:transform 0.45s var(--ta-ease-out);
        }
        .ta-mob.ta-open{transform:translateX(0);}
        .ta-mob-links{list-style:none;display:flex;flex-direction:column;gap:4px;}
        .ta-mob-links li{overflow:hidden;}
        .ta-mob-links li a{
          display:block;font-family:'Bebas Neue',sans-serif;
          font-size:clamp(40px,10vw,72px);letter-spacing:0.04em;
          color:var(--ta-ink);text-decoration:none;
          transform:translateY(110%);transition:transform 0.4s var(--ta-ease-out),color 0.15s;
        }
        .ta-mob.ta-open .ta-mob-links li a{transform:translateY(0);}
        .ta-mob-links li:nth-child(1) a{transition-delay:0.03s;}
        .ta-mob-links li:nth-child(2) a{transition-delay:0.07s;}
        .ta-mob-links li:nth-child(3) a{transition-delay:0.11s;}
        .ta-mob-links li:nth-child(4) a{transition-delay:0.15s;}
        .ta-mob-links li:nth-child(5) a{transition-delay:0.19s;}
        .ta-mob-links li:nth-child(6) a{transition-delay:0.23s;}
        .ta-mob-links li a:hover{color:var(--ta-orange);}
        .ta-mob-foot{margin-top:48px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ta-dim);letter-spacing:0.06em;}

        /* ══ HERO ══ */
        .ta-hero{
          min-height:100vh;padding:0 56px;
          display:flex;flex-direction:column;justify-content:center;align-items:center;
          text-align:center;position:relative;overflow:hidden;
        }
        .ta-hero::before{
          content:'';position:absolute;inset:0;
          background-image:radial-gradient(circle,rgba(17,17,17,0.12) 1px,transparent 1px);
          background-size:40px 40px;pointer-events:none;
        }
        .ta-hero::after{
          content:'';position:absolute;inset:32px;
          border:1px solid rgba(17,17,17,0.07);pointer-events:none;
        }
        .ta-hero-corner{
          position:absolute;width:28px;height:28px;
          border-color:var(--ta-orange);border-style:solid;
          opacity:0;transition:opacity 0.6s var(--ta-ease-out);
        }
        .ta-hero-corner.ta-vis{opacity:1;}
        .ta-hero-corner.tl{top:28px;left:28px;border-width:2px 0 0 2px;}
        .ta-hero-corner.tr{top:28px;right:28px;border-width:2px 2px 0 0;}
        .ta-hero-corner.bl{bottom:28px;left:28px;border-width:0 0 2px 2px;}
        .ta-hero-corner.br{bottom:28px;right:28px;border-width:0 2px 2px 0;}
        .ta-hero-side-label{
          position:absolute;font-family:'IBM Plex Mono',monospace;font-size:10px;
          letter-spacing:0.18em;text-transform:uppercase;
          color:var(--ta-dim);opacity:0;transition:opacity 0.7s var(--ta-ease-out);white-space:nowrap;
        }
        .ta-hero-side-label.ta-vis{opacity:1;}
        .ta-hero-side-label.left{left:56px;top:50%;transform:translateY(-50%) rotate(-90deg) translateX(-50%);}
        .ta-hero-side-label.right{right:56px;top:50%;transform:translateY(-50%) rotate(90deg) translateX(50%);}

        .ta-hero-center{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;max-width:1000px;width:100%;}

        .ta-hero-eyebrow{
          display:flex;align-items:center;gap:14px;margin-bottom:32px;
          opacity:0;transform:translateY(10px);
          transition:opacity 0.6s var(--ta-ease-out) 0.1s,transform 0.6s var(--ta-ease-out) 0.1s;
        }
        .ta-hero-eyebrow.ta-vis{opacity:1;transform:translateY(0);}
        .ta-hero-eyebrow-line{
          height:1px;width:40px;background:var(--ta-orange);
          transform:scaleX(0);transform-origin:left;
          transition:transform 0.7s var(--ta-ease-out) 0.3s;
        }
        .ta-hero-eyebrow-line.right-line{transform-origin:right;}
        .ta-hero-eyebrow.ta-vis .ta-hero-eyebrow-line{transform:scaleX(1);}
        .ta-hero-eyebrow-text{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ta-orange);}

        .ta-hero-name{display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:28px;}
        .ta-hero-name-row{display:flex;justify-content:center;overflow:hidden;line-height:0.88;}
        .ta-letter-cell{
          display:inline-block;font-family:'Bebas Neue',sans-serif;
          font-size:clamp(72px,12vw,168px);letter-spacing:0.04em;line-height:0.88;
          transform:translateY(-110%);opacity:0;
          transition:transform 0.75s var(--ta-ease-out),opacity 0.5s var(--ta-ease-out);
        }
        .ta-letter-cell.ta-space{width:0.3em;}
        .ta-letter-cell.ta-dropped{transform:translateY(0);opacity:1;}

        .ta-hero-role-wrap{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:48px;}
        .ta-hero-role-line{height:1px;background:var(--ta-border-strong);width:0;flex-shrink:0;transition:width 0.8s var(--ta-ease-out) 1.5s;}
        .ta-hero-role-line.ta-exp{width:40px;}
        .ta-hero-role{
          font-family:'IBM Plex Mono',monospace;font-size:12px;
          letter-spacing:0.15em;text-transform:uppercase;color:var(--ta-dim);
          opacity:0;transform:translateY(8px);
          transition:opacity 0.6s var(--ta-ease-out) 1.7s,transform 0.6s var(--ta-ease-out) 1.7s;
        }
        .ta-hero-role.ta-vis{opacity:1;transform:translateY(0);}

        .ta-hero-divider{
          width:1px;height:40px;
          background:linear-gradient(to bottom,transparent,var(--ta-border-strong),transparent);
          margin-bottom:40px;opacity:0;transition:opacity 0.6s var(--ta-ease-out) 2s;
        }
        .ta-hero-divider.ta-vis{opacity:1;}

        .ta-hero-bottom{
          display:flex;flex-direction:column;align-items:center;gap:32px;width:100%;max-width:640px;
          opacity:0;transform:translateY(14px);
          transition:opacity 0.7s var(--ta-ease-out) 2.1s,transform 0.7s var(--ta-ease-out) 2.1s;
        }
        .ta-hero-bottom.ta-vis{opacity:1;transform:translateY(0);}
        .ta-hero-bio{font-size:clamp(14px,1.4vw,16px);color:var(--ta-dim);line-height:1.9;text-align:center;}
        .ta-hero-cta{display:flex;align-items:center;gap:20px;flex-wrap:wrap;justify-content:center;}
        .ta-hero-cta-btn{
          font-family:'IBM Plex Mono',monospace;font-size:10px;
          letter-spacing:0.15em;text-transform:uppercase;
          background:var(--ta-orange);color:white;
          padding:13px 32px;border-radius:100px;text-decoration:none;
          transition:transform 0.15s var(--ta-snap),box-shadow 0.2s;white-space:nowrap;
        }
        .ta-hero-cta-btn:hover{transform:scale(1.04);box-shadow:0 8px 28px var(--ta-orange-glow);}
        .ta-hero-meta{display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:center;}
        .ta-hero-meta-item{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.08em;color:var(--ta-dim);display:flex;align-items:center;gap:7px;}
        .ta-hero-meta-sep{width:3px;height:3px;border-radius:50%;background:var(--ta-border-strong);flex-shrink:0;}
        .ta-meta-dot{
          width:7px;height:7px;border-radius:50%;background:#22C55E;flex-shrink:0;
          box-shadow:0 0 8px rgba(34,197,94,0.5);animation:taPulse 2s ease-in-out infinite;
        }
        @keyframes taPulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(0.5);opacity:0.4;}}

        /* ══ SECTIONS ══ */
        .ta-section{padding:112px 56px;}
        .ta-section-surface{background:var(--ta-surface);}
        .ta-section-orange{background:var(--ta-orange);}
        .ta-section-ink{background:var(--ta-ink);}

        .ta-label{
          font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;
          color:var(--ta-dim);margin-bottom:12px;display:flex;align-items:center;gap:10px;
          opacity:0;transform:translateX(-14px);transition:opacity 0.5s var(--ta-ease-out),transform 0.5s var(--ta-ease-out);
        }
        .ta-label.ta-in{opacity:1;transform:translateX(0);}
        .ta-label-tick{width:24px;height:2px;background:var(--ta-orange);flex-shrink:0;}
        .ta-section-orange .ta-label{color:rgba(255,255,255,0.6);}
        .ta-section-orange .ta-label-tick{background:rgba(255,255,255,0.5);}
        .ta-section-ink .ta-label{color:rgba(255,255,255,0.4);}
        .ta-section-ink .ta-label-tick{background:rgba(255,255,255,0.3);}

        .ta-h2{
          font-family:'Bebas Neue',sans-serif;font-size:clamp(48px,7vw,96px);
          letter-spacing:0.03em;line-height:0.95;margin-bottom:56px;
          opacity:0;transform:translateY(24px);
          transition:opacity 0.7s var(--ta-ease-out) 0.1s,transform 0.7s var(--ta-ease-out) 0.1s;
        }
        .ta-h2.ta-in{opacity:1;transform:translateY(0);}
        .ta-section-orange .ta-h2,.ta-section-ink .ta-h2{color:white;}

        /* TAGLINE */
        .ta-tagline-inner{display:flex;flex-direction:column;gap:0;padding:80px 0;}
        .ta-tagline-line{
          font-family:'Bebas Neue',sans-serif;font-size:clamp(40px,7vw,100px);
          letter-spacing:0.04em;line-height:0.9;color:white;opacity:0;
        }
        .ta-tagline-line:nth-child(1){text-align:right;transform:translateX(80px);transition:opacity 0.8s var(--ta-ease-out),transform 0.8s var(--ta-ease-out);}
        .ta-tagline-line:nth-child(2){text-align:left;transform:translateX(-80px);transition:opacity 0.8s var(--ta-ease-out) 0.1s,transform 0.8s var(--ta-ease-out) 0.1s;}
        .ta-tagline-line.ta-in{opacity:1;transform:translateX(0);}

        /* EXPERIENCE */
        .ta-exp-grid{display:grid;grid-template-columns:200px 1fr;gap:0;}
        .ta-exp-timeline{position:relative;padding-right:40px;border-right:2px solid var(--ta-border-strong);}
        .ta-exp-year-item{padding:24px 0;cursor:pointer;display:flex;flex-direction:column;align-items:flex-end;gap:4px;position:relative;}
        .ta-exp-year-item::after{
          content:'';position:absolute;right:-7px;top:50%;transform:translateY(-50%);
          width:12px;height:12px;border-radius:50%;
          background:var(--ta-bg);border:2px solid var(--ta-border-strong);
          transition:background 0.25s,border-color 0.25s,transform 0.25s var(--ta-snap);
        }
        .ta-exp-year-item.ta-active::after{background:var(--ta-orange);border-color:var(--ta-orange);transform:translateY(-50%) scale(1.3);}
        .ta-exp-year-num{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.08em;color:var(--ta-dim);transition:color 0.2s;}
        .ta-exp-year-item.ta-active .ta-exp-year-num{color:var(--ta-orange);}
        .ta-exp-year-company{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.06em;color:var(--ta-dim);opacity:0.7;text-align:right;transition:color 0.2s;}
        .ta-exp-year-item.ta-active .ta-exp-year-company{color:var(--ta-ink);}
        .ta-exp-content{padding-left:56px;}
        .ta-exp-panel{display:none;position:relative;overflow:hidden;}
        .ta-exp-panel.ta-active{display:block;animation:taPanelIn 0.4s var(--ta-ease-out) both;}
        @keyframes taPanelIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
        .ta-exp-ghost{
          position:absolute;right:0;top:-20px;font-family:'Bebas Neue',sans-serif;
          font-size:clamp(80px,12vw,160px);color:var(--ta-ink);opacity:0.04;
          letter-spacing:0.02em;line-height:1;pointer-events:none;user-select:none;white-space:nowrap;
        }
        .ta-exp-role{font-family:'Bebas Neue',sans-serif;font-size:clamp(32px,4.5vw,56px);letter-spacing:0.03em;line-height:1;margin-bottom:12px;}
        .ta-exp-meta-row{display:flex;align-items:center;gap:12px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--ta-dim);letter-spacing:0.06em;margin-bottom:20px;flex-wrap:wrap;}
        .ta-exp-badge{background:var(--ta-orange-light);color:var(--ta-orange);padding:2px 10px;border-radius:20px;font-size:10px;}
        .ta-exp-desc{font-size:15px;line-height:1.8;color:var(--ta-dim);max-width:560px;border-left:3px solid var(--ta-orange);padding-left:20px;}
        .ta-exp-card-wrap{background:var(--ta-bg);border:1px solid var(--ta-border);border-radius:16px;padding:32px;position:relative;overflow:hidden;transition:box-shadow 0.3s;}
        .ta-exp-card-border{position:absolute;inset:0;border-radius:16px;border:2px solid var(--ta-orange);clip-path:inset(0 100% 100% 0);transition:clip-path 0.5s var(--ta-ease-out);pointer-events:none;}
        .ta-exp-card-wrap:hover .ta-exp-card-border{clip-path:inset(0 0% 0% 0);}
        .ta-exp-card-wrap:hover{box-shadow:0 12px 40px var(--ta-orange-glow);}

        /* PROJECTS */
        .ta-proj-list{display:flex;flex-direction:column;gap:0;}
        .ta-proj-item{
          display:grid;grid-template-columns:120px 1fr auto;gap:32px;align-items:start;
          padding:40px 0;border-bottom:1px solid var(--ta-border);
          position:relative;overflow:hidden;
          opacity:0;transform:translateY(20px);
          transition:opacity 0.6s var(--ta-ease-out),transform 0.6s var(--ta-ease-out);
        }
        .ta-proj-item.ta-in{opacity:1;transform:translateY(0);}
        .ta-proj-item::before{content:'';position:absolute;inset:0;border:2px solid var(--ta-orange);clip-path:inset(0 100% 100% 0);transition:clip-path 0.45s var(--ta-ease-out);pointer-events:none;z-index:1;}
        .ta-proj-item:hover::before{clip-path:inset(0 0% 0% 0);}
        .ta-proj-item:hover{background:rgba(255,107,53,0.03);}
        .ta-proj-num{font-family:'Bebas Neue',sans-serif;font-size:clamp(52px,7vw,96px);color:var(--ta-ink);opacity:0.07;line-height:1;letter-spacing:0.02em;transition:opacity 0.25s,color 0.25s;}
        .ta-proj-item:hover .ta-proj-num{opacity:0.15;color:var(--ta-orange);}
        .ta-proj-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(24px,3.5vw,42px);letter-spacing:0.03em;line-height:1;margin-bottom:12px;transition:color 0.2s;}
        .ta-proj-item:hover .ta-proj-name{color:var(--ta-orange);}
        .ta-proj-desc{font-size:14px;line-height:1.75;color:var(--ta-dim);margin-bottom:16px;max-width:520px;}
        .ta-proj-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
        .ta-proj-chip{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.06em;color:var(--ta-orange);border:1px solid rgba(255,107,53,0.35);padding:3px 10px;border-radius:20px;transition:background 0.15s,color 0.15s;}
        .ta-proj-item:hover .ta-proj-chip{background:var(--ta-orange);color:white;}
        .ta-proj-links{display:flex;gap:12px;}
        .ta-proj-link{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.08em;color:var(--ta-dim);text-decoration:none;display:inline-flex;align-items:center;gap:4px;transition:color 0.15s;}
        .ta-proj-link:hover{color:var(--ta-orange);}
        .ta-proj-link-arr{transition:transform 0.15s var(--ta-snap);}
        .ta-proj-link:hover .ta-proj-link-arr{transform:translate(3px,-3px);}
        .ta-proj-year{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.1em;color:var(--ta-dim);padding-top:8px;white-space:nowrap;writing-mode:vertical-lr;transform:rotate(180deg);opacity:0.6;}

        /* CAREER STORY */
        .ta-story-grid{display:grid;grid-template-columns:1fr 2fr;gap:64px;align-items:start;}
        .ta-story-dropcap{font-family:'Bebas Neue',sans-serif;font-size:clamp(140px,18vw,240px);color:white;line-height:0.85;opacity:0;transform:scale(0.9);transition:opacity 0.8s var(--ta-ease-out),transform 0.8s var(--ta-ease-out);}
        .ta-story-dropcap.ta-in{opacity:1;transform:scale(1);}
        .ta-story-text{font-size:clamp(17px,1.8vw,20px);line-height:1.85;color:rgba(255,255,255,0.85);font-style:italic;}
        .ta-story-line{display:block;overflow:hidden;}
        .ta-story-line-inner{display:block;transform:translateX(-100%);transition:transform 0.7s var(--ta-ease-out);}
        .ta-story-line.ta-in .ta-story-line-inner{transform:translateX(0);}

        /* SKILLS */
        .ta-skills-az{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:40px 48px;}
        .ta-skill-group{opacity:0;transform:translateY(20px);transition:opacity 0.5s var(--ta-ease-out),transform 0.5s var(--ta-ease-out);}
        .ta-skill-group.ta-in{opacity:1;transform:translateY(0);}
        .ta-skill-letter{font-family:'Bebas Neue',sans-serif;font-size:52px;letter-spacing:0.04em;color:var(--ta-ink);opacity:0.1;line-height:1;margin-bottom:8px;transition:opacity 0.25s,color 0.25s;}
        .ta-skill-group:hover .ta-skill-letter{opacity:0.25;color:var(--ta-orange);}
        .ta-skill-list{display:flex;flex-direction:column;gap:0;border-top:1px solid var(--ta-border);}
        .ta-skill-item{font-size:14px;color:var(--ta-ink);padding:8px 0;border-bottom:1px solid var(--ta-border);position:relative;overflow:hidden;cursor:default;transition:color 0.15s;}
        .ta-skill-item::before{content:'';position:absolute;left:0;top:0;bottom:0;width:0%;background:var(--ta-orange);opacity:0.12;transition:width 0.25s var(--ta-ease-out);}
        .ta-skill-item:hover::before{width:100%;}
        .ta-skill-item:hover{color:var(--ta-orange);}

        /* WORK STYLE */
        .ta-ws-list{display:flex;flex-direction:column;gap:0;}
        .ta-ws-row{display:grid;grid-template-columns:160px 1fr;gap:40px;align-items:start;padding:40px 0;border-bottom:1px solid rgba(255,255,255,0.1);opacity:0;}
        .ta-ws-row.ta-from-left{transform:translateX(-40px);transition:opacity 0.7s var(--ta-ease-out),transform 0.7s var(--ta-ease-out);}
        .ta-ws-row.ta-from-right{transform:translateX(40px);transition:opacity 0.7s var(--ta-ease-out),transform 0.7s var(--ta-ease-out);}
        .ta-ws-row.ta-in{opacity:1;transform:translateX(0);}
        .ta-ws-num{font-family:'Bebas Neue',sans-serif;font-size:clamp(80px,10vw,120px);color:white;opacity:0.08;letter-spacing:0.02em;line-height:1;}
        .ta-ws-content h3{font-family:'Bebas Neue',sans-serif;font-size:clamp(24px,3.5vw,40px);letter-spacing:0.04em;color:white;margin-bottom:12px;}
        .ta-ws-content p{font-size:15px;line-height:1.8;color:rgba(255,255,255,0.6);max-width:520px;}

        /* LOOKING FOR */
        .ta-looking-inner{display:flex;flex-direction:column;align-items:center;text-align:center;padding:40px 0;}
        .ta-looking-eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ta-dim);margin-bottom:32px;opacity:0;transform:translateY(10px);transition:opacity 0.5s var(--ta-ease-out),transform 0.5s var(--ta-ease-out);}
        .ta-looking-eyebrow.ta-in{opacity:1;transform:translateY(0);}
        .ta-looking-words{font-family:'Bebas Neue',sans-serif;font-size:clamp(36px,6vw,88px);letter-spacing:0.03em;line-height:1.05;max-width:900px;}
        .ta-lw{display:inline-block;opacity:0;transform:translateY(24px);transition:opacity 0.6s var(--ta-ease-out),transform 0.6s var(--ta-ease-out);margin-right:0.2em;}
        .ta-lw.ta-in{opacity:1;transform:translateY(0);}
        .ta-lw.ta-accent{color:var(--ta-orange);}

        /* EDUCATION */
        .ta-edu-list{display:flex;flex-direction:column;gap:0;border-top:2px solid var(--ta-border-strong);}
        .ta-edu-row{display:grid;grid-template-columns:160px 1fr;gap:40px;padding:36px 0;border-bottom:1px solid var(--ta-border);opacity:0;transform:translateY(16px);transition:opacity 0.55s var(--ta-ease-out),transform 0.55s var(--ta-ease-out);position:relative;overflow:hidden;}
        .ta-edu-row.ta-in{opacity:1;transform:translateY(0);}
        .ta-edu-row::after{content:'';position:absolute;left:0;bottom:0;width:0%;height:1px;background:var(--ta-orange);transition:width 0.6s var(--ta-ease-out);}
        .ta-edu-row.ta-in::after{width:100%;}
        .ta-edu-years{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--ta-orange);letter-spacing:0.08em;padding-top:4px;}
        .ta-edu-degree{font-family:'Bebas Neue',sans-serif;font-size:clamp(22px,3vw,32px);letter-spacing:0.03em;line-height:1.1;margin-bottom:6px;}
        .ta-edu-inst{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--ta-dim);letter-spacing:0.06em;}

        /* LANGUAGES */
        .ta-lang-grid{display:flex;flex-wrap:wrap;gap:16px;margin-top:48px;}
        .ta-lang-pill{display:flex;align-items:center;gap:10px;background:var(--ta-bg);border:1px solid var(--ta-border);border-radius:100px;padding:10px 20px;opacity:0;transform:scale(0.85);transition:opacity 0.5s var(--ta-ease-out),transform 0.5s var(--ta-ease-out),border-color 0.2s,box-shadow 0.2s;}
        .ta-lang-pill.ta-in{opacity:1;transform:scale(1);}
        .ta-lang-pill:hover{border-color:var(--ta-orange);box-shadow:0 4px 16px var(--ta-orange-glow);}
        .ta-lang-name{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:0.04em;}
        .ta-lang-level{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.1em;color:var(--ta-orange);text-transform:uppercase;}

        /* INTERESTS */
        .ta-interests-wrap{margin-top:56px;border-top:1px solid var(--ta-border);padding-top:40px;}
        .ta-interests-list{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px;}
        .ta-interest-tag{
          font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.06em;padding:8px 18px;
          border-radius:4px;background:var(--ta-surface);border:1px solid var(--ta-border);color:var(--ta-dim);
          opacity:0;transform:translateY(10px);
          transition:opacity 0.4s var(--ta-ease-out),transform 0.4s var(--ta-ease-out),background 0.15s,color 0.15s,border-color 0.15s;
        }
        .ta-interest-tag.ta-in{opacity:1;transform:translateY(0);}
        .ta-interest-tag:hover{background:var(--ta-orange);color:white;border-color:var(--ta-orange);}

        /* CONTACT */
        .ta-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:48px;}
        .ta-contact-card{
          background:var(--ta-surface);border:1px solid var(--ta-border);border-radius:16px;padding:28px 32px;
          text-decoration:none;color:inherit;position:relative;overflow:hidden;display:block;
          opacity:0;transform:translateY(16px);
          transition:opacity 0.5s var(--ta-ease-out),transform 0.5s var(--ta-ease-out),box-shadow 0.25s;
        }
        .ta-contact-card.ta-in{opacity:1;transform:translateY(0);}
        .ta-fold{position:absolute;top:0;right:0;width:0;height:0;border-style:solid;border-width:0;border-color:transparent;transition:border-width 0.25s var(--ta-ease-out),border-color 0.25s var(--ta-ease-out);}
        .ta-contact-card:hover .ta-fold{border-width:0 40px 40px 0;border-color:transparent var(--ta-orange) transparent transparent;}
        .ta-contact-card:hover{box-shadow:0 12px 40px var(--ta-orange-glow);border-color:rgba(255,107,53,0.2);}
        .ta-contact-type{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--ta-dim);margin-bottom:8px;position:relative;z-index:1;}
        .ta-contact-val{font-size:16px;font-weight:500;position:relative;z-index:1;transition:color 0.2s;}
        .ta-contact-card:hover .ta-contact-val{color:var(--ta-orange);}

        /* FOOTER */
        .ta-footer{padding:40px 56px;border-top:2px solid var(--ta-border-strong);background:var(--ta-ink);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;}
        .ta-footer-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,4vw,48px);letter-spacing:0.05em;color:white;}
        .ta-footer-name span{color:var(--ta-orange);}
        .ta-footer-copy{font-family:'IBM Plex Mono',monospace;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.08em;}

        /* REVEAL */
        .ta-reveal{opacity:0;transform:translateY(20px);transition:opacity 0.6s var(--ta-ease-out),transform 0.6s var(--ta-ease-out);}
        .ta-reveal.ta-in{opacity:1;transform:translateY(0);}

        /* RESPONSIVE */
        @media(max-width:960px){
          .ta-nav-links{display:none;}
          .ta-burger{display:flex;}
          .ta-section{padding:80px 32px;}
          .ta-hero{padding:0 32px;}
          .ta-hero::after{inset:20px;}
          .ta-hero-corner.tl{top:16px;left:16px;}
          .ta-hero-corner.tr{top:16px;right:16px;}
          .ta-hero-corner.bl{bottom:16px;left:16px;}
          .ta-hero-corner.br{bottom:16px;right:16px;}
          .ta-hero-side-label{display:none;}
          .ta-hero-bottom{grid-template-columns:1fr;gap:24px;text-align:left;}
          .ta-hero-meta{align-items:flex-start;}
          .ta-hero-cta{align-items:flex-start;}
          .ta-exp-grid{grid-template-columns:1fr;}
          .ta-exp-timeline{display:flex;flex-wrap:wrap;gap:8px;border-right:none;border-bottom:1px solid var(--ta-border-strong);padding:0 0 24px 0;margin-bottom:32px;}
          .ta-exp-year-item::after{display:none;}
          .ta-exp-content{padding-left:0;}
          .ta-story-grid{grid-template-columns:1fr;}
          .ta-story-dropcap{font-size:clamp(80px,15vw,140px);}
          .ta-looking-words{font-size:clamp(28px,7vw,60px);}
          .ta-ws-row{grid-template-columns:80px 1fr;gap:24px;}
          .ta-ws-num{font-size:60px;}
          .ta-contact-grid{grid-template-columns:1fr;}
          .ta-footer{padding:32px;}
          .ta-proj-item{grid-template-columns:72px 1fr;gap:16px;}
          .ta-proj-year{display:none;}
        }
        @media(max-width:600px){
          .ta-section{padding:60px 20px;}
          .ta-hero{padding:0 20px;}
          .ta-letter-cell{font-size:clamp(52px,13vw,96px);}
          .ta-edu-row{grid-template-columns:1fr;gap:8px;}
          .ta-footer{padding:24px 20px;flex-direction:column;align-items:flex-start;}
          .ta-ws-row{grid-template-columns:1fr;}
          .ta-ws-num{display:none;}
          .ta-contact-grid{grid-template-columns:1fr;}
        }
      `}</style>

      <div className="ta-root">
        <div className="ta-progress" id="ta-prog" />

        {/* ── NAV ── */}
        <nav className="ta-nav" id="ta-nav">
          <div className="ta-nav-inner">
            <a href="#ta-hero" className="ta-logo">
              <span className="ta-logo-bracket">[</span>
              {nameParts[0]?.[0]}{nameParts[nameParts.length - 1]?.[0]}
              <span className="ta-logo-bracket">]</span>
            </a>
            <ul className="ta-nav-links">
              {navSections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={i === 0 ? "ta-active" : ""}>{s.label}</a>
                </li>
              ))}
            </ul>
            <button className="ta-burger" id="ta-burger" aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </nav>

        {/* ── MOBILE OVERLAY ── */}
        <div className="ta-mob" id="ta-mob">
          <ul className="ta-mob-links">
            {navSections.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} onClick={() => {
                document.getElementById("ta-burger")?.classList.remove("ta-open")
                document.getElementById("ta-mob")?.classList.remove("ta-open")
                document.body.style.overflow = ""
              }}>{s.label}</a></li>
            ))}
          </ul>
          <div className="ta-mob-foot">
            {personal.email}{personal.location ? ` · ${personal.location}` : ""}
          </div>
        </div>

        {/* ── HERO ── */}
        <section id="ta-hero" className="ta-hero">
          <div className="ta-hero-corner tl" id="ta-c-tl" />
          <div className="ta-hero-corner tr" id="ta-c-tr" />
          <div className="ta-hero-corner bl" id="ta-c-bl" />
          <div className="ta-hero-corner br" id="ta-c-br" />
          {personal.location && <div className="ta-hero-side-label left" id="ta-side-l">Portfolio — {new Date().getFullYear()}</div>}
          {personal.location && <div className="ta-hero-side-label right" id="ta-side-r">{personal.location}</div>}

          <div className="ta-hero-center">
            <div className="ta-hero-eyebrow" id="ta-eyebrow">
              <div className="ta-hero-eyebrow-line" />
              <span className="ta-hero-eyebrow-text">{personal.professionalTitle}</span>
              <div className="ta-hero-eyebrow-line right-line" />
            </div>

            <div className="ta-hero-name">
              <div className="ta-hero-name-row" id="ta-name-r1" />
              {lastName && <div className="ta-hero-name-row" id="ta-name-r2" />}
            </div>

            <div className="ta-hero-role-wrap">
              <div className="ta-hero-role-line" id="ta-rl-l" />
              <div className="ta-hero-role" id="ta-role">
                {experience.length > 0
                  ? `${experience.length * 2}+ years · ${personal.location ?? ""}`
                  : personal.location ?? ""}
              </div>
              <div className="ta-hero-role-line" id="ta-rl-r" />
            </div>

            <div className="ta-hero-divider" id="ta-divider" />

            <div className="ta-hero-bottom" id="ta-hero-bottom">
              {personal.bio && <p className="ta-hero-bio">{personal.bio}</p>}
              <div className="ta-hero-cta">
                <a href="#ta-contact" className="ta-hero-cta-btn">Get in touch</a>
                <div className="ta-hero-meta">
                  <div className="ta-hero-meta-item">
                    <span className="ta-meta-dot" />Available
                  </div>
                  {personal.location && <>
                    <span className="ta-hero-meta-sep" />
                    <div className="ta-hero-meta-item">{personal.location}</div>
                  </>}
                  {personal.email && <>
                    <span className="ta-hero-meta-sep" />
                    <div className="ta-hero-meta-item">{personal.email}</div>
                  </>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TAGLINE ── */}
        {tagline && (
          <section className="ta-section ta-section-orange" id="ta-tagline">
            <div className="ta-tagline-inner">
              {tagline.split(/\s+—\s+|,\s*(?=[A-Z])/).map((line, i) => (
                <div className="ta-tagline-line" key={i}>{line}</div>
              ))}
            </div>
          </section>
        )}

        {/* ── EXPERIENCE ── */}
        {experience.length > 0 && (
          <section id="ta-experience" className="ta-section">
            <div className="ta-label"><span className="ta-label-tick" />Experience</div>
            <h2 className="ta-h2">Where I've worked</h2>
            <div className="ta-exp-grid">
              <div className="ta-exp-timeline" id="ta-exp-tl">
                {experience.map((exp, i) => (
                  <div
                    key={i}
                    className={`ta-exp-year-item${i === 0 ? " ta-active" : ""}`}
                    data-exp={i}
                  >
                    <div className="ta-exp-year-num">
                      {exp.startDate}{exp.isCurrent ? "–Now" : exp.endDate ? `–${exp.endDate}` : ""}
                    </div>
                    <div className="ta-exp-year-company">{exp.companyName}</div>
                  </div>
                ))}
              </div>
              <div className="ta-exp-content">
                <div className="ta-exp-card-wrap">
                  <div className="ta-exp-card-border" />
                  {experience.map((exp, i) => (
                    <div key={i} className={`ta-exp-panel${i === 0 ? " ta-active" : ""}`} data-panel={i}>
                      <div className="ta-exp-ghost">
                        {exp.companyName.split(" ").map((w: string) => w[0]).join("").slice(0, 4)}
                      </div>
                      <div className="ta-exp-role">{exp.roleTitle}</div>
                      <div className="ta-exp-meta-row">
                        {exp.companyName}
                        {exp.isCurrent && <span className="ta-exp-badge">Current</span>}
                        {exp.location && `· ${exp.location}`}
                      </div>
                      {exp.description && <div className="ta-exp-desc">{exp.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── PROJECTS ── */}
        {projects.length > 0 && (
          <section id="ta-projects" className="ta-section ta-section-surface">
            <div className="ta-label"><span className="ta-label-tick" />Projects</div>
            <h2 className="ta-h2">Selected work</h2>
            <div className="ta-proj-list">
              {projects.map((proj, i) => (
                <div key={i} className="ta-proj-item" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="ta-proj-num">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <div className="ta-proj-name">{proj.projectName}</div>
                    {proj.description && <div className="ta-proj-desc">{proj.description}</div>}
                    {proj.techStack.length > 0 && (
                      <div className="ta-proj-chips">
                        {proj.techStack.map((t: string, ti: number) => <span className="ta-proj-chip" key={ti}>{t}</span>)}
                      </div>
                    )}
                    <div className="ta-proj-links">
                      {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="ta-proj-link">Live <span className="ta-proj-link-arr">↗</span></a>}
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="ta-proj-link">GitHub <span className="ta-proj-link-arr">↗</span></a>}
                    </div>
                  </div>
                  <div className="ta-proj-year">{proj.liveUrl ? "Live" : ""}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CAREER STORY ── */}
        {careerStory && (
          <section className="ta-section ta-section-ink">
            <div className="ta-label"><span className="ta-label-tick" />Career Story</div>
            <div className="ta-story-grid">
              <div className="ta-story-dropcap" id="ta-dropcap">{careerStory.trim()[0]}</div>
              <div>
                <p className="ta-story-text" id="ta-story">{careerStory}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── SKILLS ── */}
        {skills.length > 0 && (
          <section id="ta-skills" className="ta-section">
            <div className="ta-label"><span className="ta-label-tick" />Skills</div>
            <h2 className="ta-h2">Expertise</h2>
            <div className="ta-skills-az">
              {sortedLetters.map((letter, i) => (
                <div key={letter} className="ta-skill-group" style={{ transitionDelay: `${i * 0.06}s` }}>
                  <div className="ta-skill-letter">{letter}</div>
                  <div className="ta-skill-list">
                    {skillsByLetter[letter].map((skill, si) => (
                      <div key={si} className="ta-skill-item">{skill}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── WORK STYLE ── */}
        {principles.length > 0 && (
          <section className="ta-section ta-section-ink">
            <div className="ta-label"><span className="ta-label-tick" />How I Work</div>
            <h2 className="ta-h2">My principles</h2>
            <div className="ta-ws-list">
              {principles.map((p, i) => (
                <div key={i} className={`ta-ws-row ${i % 2 === 0 ? "ta-from-left" : "ta-from-right"}`} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="ta-ws-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="ta-ws-content">
                    <h3>{p.title}</h3>
                    {p.body && <p>{p.body}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── LOOKING FOR ── */}
        {lookingFor && (
          <section className="ta-section ta-section-surface">
            <div className="ta-label"><span className="ta-label-tick" />What's Next</div>
            <div className="ta-looking-inner">
              <div className="ta-looking-eyebrow">Open to opportunities</div>
              <div className="ta-looking-words" id="ta-looking">
                {lookingWords.map((w, i) => (
                  <span
                    key={i}
                    className={`ta-lw${i >= lookingWords.length - 3 ? " ta-accent" : ""}`}
                    style={{ transitionDelay: `${i * 0.07}s` }}
                  >{w}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── EDUCATION ── */}
        {education.length > 0 && (
          <section id="ta-education" className="ta-section">
            <div className="ta-label"><span className="ta-label-tick" />Education</div>
            <h2 className="ta-h2">Academic background</h2>
            <div className="ta-edu-list">
              {education.map((edu, i) => {
                const years = edu.startYear && edu.endYear
                  ? `${edu.startYear} — ${edu.endYear}`
                  : edu.endYear ?? edu.startYear ?? ""
                return (
                  <div key={i} className="ta-edu-row" style={{ transitionDelay: `${i * 0.1}s` }}>
                    {years && <div className="ta-edu-years">{years}</div>}
                    <div>
                      <div className="ta-edu-degree">
                        {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                      </div>
                      <div className="ta-edu-inst">{edu.institution}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {languages.length > 0 && (
              <div>
                <div className="ta-label" style={{ marginTop: "56px" }}>
                  <span className="ta-label-tick" />Languages
                </div>
                <div className="ta-lang-grid">
                  {languages.map((lang, i) => (
                    <div key={i} className="ta-lang-pill" style={{ transitionDelay: `${i * 0.08}s` }}>
                      <span className="ta-lang-name">{lang.language}</span>
                      <span className="ta-lang-level">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {interests.length > 0 && (
              <div className="ta-interests-wrap">
                <div className="ta-label"><span className="ta-label-tick" />Interests</div>
                <div className="ta-interests-list">
                  {interests.map((interest, i) => (
                    <span key={i} className="ta-interest-tag" style={{ transitionDelay: `${i * 0.05}s` }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── CONTACT ── */}
        <section id="ta-contact" className="ta-section ta-section-surface">
          <div className="ta-label"><span className="ta-label-tick" />Contact</div>
          <h2 className="ta-h2">Let's talk</h2>
          <div className="ta-contact-grid">
            {[
              personal.email      && { type: "Email",    val: personal.email,                                         href: `mailto:${personal.email}` },
              personal.phone      && { type: "Phone",    val: personal.phone,                                         href: `tel:${personal.phone}` },
              personal.linkedinUrl && { type: "LinkedIn", val: personal.linkedinUrl.replace(/^https?:\/\//, ""),       href: personal.linkedinUrl },
              personal.githubUrl   && { type: "GitHub",   val: personal.githubUrl.replace(/^https?:\/\//, ""),         href: personal.githubUrl },
              personal.websiteUrl  && { type: "Website",  val: personal.websiteUrl.replace(/^https?:\/\//, ""),        href: personal.websiteUrl },
              personal.location    && { type: "Location", val: personal.location,                                      href: null },
            ].filter(Boolean).map((row: any, i) =>
              row.href ? (
                <a key={i} href={row.href} target={row.href.startsWith("http") ? "_blank" : undefined}
                   rel={row.href.startsWith("http") ? "noreferrer" : undefined}
                   className="ta-contact-card" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="ta-fold" />
                  <div className="ta-contact-type">{row.type}</div>
                  <div className="ta-contact-val">{row.val}</div>
                </a>
              ) : (
                <div key={i} className="ta-contact-card" style={{ transitionDelay: `${i * 0.08}s`, cursor: "default" }}>
                  <div className="ta-fold" />
                  <div className="ta-contact-type">{row.type}</div>
                  <div className="ta-contact-val">{row.val}</div>
                </div>
              )
            )}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="ta-footer">
          <div className="ta-footer-name">{firstName}<span>.</span></div>
          <div className="ta-footer-copy">© {new Date().getFullYear()} — Built with PortfolioAI</div>
        </footer>

        <TAEffects navSections={navSections} firstName={firstName} lastName={lastName} />
      </div>
    </>
  )
}

function TAEffects({
  navSections,
  firstName,
  lastName,
}: {
  navSections: { id: string }[]
  firstName: string
  lastName: string
}) {
  useEffect(() => {
    const prog = document.getElementById("ta-prog")
    const nav  = document.getElementById("ta-nav")
    const sectionIds = navSections.map(s => s.id)

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (prog) prog.style.width = (window.scrollY / h) * 100 + "%"
      if (nav)  nav.classList.toggle("ta-scrolled", window.scrollY > 60)
      let cur = sectionIds[0]
      sectionIds.forEach(id => {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 160) cur = id
      })
      document.querySelectorAll(".ta-nav-links a").forEach(a =>
        a.classList.toggle("ta-active", a.getAttribute("href") === `#${cur}`)
      )
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    const burger = document.getElementById("ta-burger")
    const mob    = document.getElementById("ta-mob")
    const toggleMob = () => {
      burger?.classList.toggle("ta-open")
      mob?.classList.toggle("ta-open")
      document.body.style.overflow = mob?.classList.contains("ta-open") ? "hidden" : ""
    }
    burger?.addEventListener("click", toggleMob)

    const buildRow = (text: string, containerId: string, baseDelay: number) => {
      const container = document.getElementById(containerId)
      if (!container) return
      text.split("").forEach((ch, i) => {
        const span = document.createElement("span")
        span.className = "ta-letter-cell" + (ch === " " ? " ta-space" : "")
        span.textContent = ch === " " ? "\u00A0" : ch
        span.style.transitionDelay = (baseDelay + i * 0.06 + Math.random() * 0.1) + "s"
        container.appendChild(span)
      })
    }
    buildRow(firstName, "ta-name-r1", 0.2)
    if (lastName) buildRow(lastName, "ta-name-r2", 0.5)

    setTimeout(() => {
      ;["ta-c-tl","ta-c-tr","ta-c-bl","ta-c-br"].forEach((id, i) =>
        setTimeout(() => document.getElementById(id)?.classList.add("ta-vis"), i * 80)
      )
      document.getElementById("ta-side-l")?.classList.add("ta-vis")
      document.getElementById("ta-side-r")?.classList.add("ta-vis")
      document.getElementById("ta-eyebrow")?.classList.add("ta-vis")
      document.querySelectorAll(".ta-letter-cell").forEach(c => c.classList.add("ta-dropped"))
      ;["ta-rl-l","ta-rl-r"].forEach(id => document.getElementById(id)?.classList.add("ta-exp"))
      document.getElementById("ta-role")?.classList.add("ta-vis")
      document.getElementById("ta-divider")?.classList.add("ta-vis")
      document.getElementById("ta-hero-bottom")?.classList.add("ta-vis")
    }, 80)

    const io = new IntersectionObserver(entries =>
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("ta-in"); io.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll(
      ".ta-label,.ta-h2,.ta-proj-item,.ta-edu-row,.ta-ws-row,.ta-skill-group,.ta-lang-pill,.ta-interest-tag,.ta-contact-card,.ta-reveal,.ta-looking-eyebrow"
    ).forEach(el => io.observe(el))

    const taglineObs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".ta-tagline-line").forEach((l, i) =>
          setTimeout(() => l.classList.add("ta-in"), i * 120))
        taglineObs.unobserve(e.target)
      }
    }), { threshold: 0.3 })
    const taglineEl = document.getElementById("ta-tagline")
    if (taglineEl) taglineObs.observe(taglineEl)

    const storyEl = document.getElementById("ta-story")
    if (storyEl) {
      const words = storyEl.textContent?.trim().split(" ") ?? []
      const chunkSize = Math.ceil(words.length / 4)
      const lines: string[] = []
      for (let i = 0; i < words.length; i += chunkSize) lines.push(words.slice(i, i + chunkSize).join(" "))
      storyEl.innerHTML = lines.map(l => `<span class="ta-story-line"><span class="ta-story-line-inner">${l}</span></span> `).join("")
      const sObs = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".ta-story-line").forEach((l, i) => setTimeout(() => l.classList.add("ta-in"), i * 120))
          sObs.unobserve(e.target)
        }
      }), { threshold: 0.2 })
      sObs.observe(storyEl)
    }

    const dcObs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("ta-in"); dcObs.unobserve(e.target) }
    }), { threshold: 0.3 })
    const dc = document.getElementById("ta-dropcap")
    if (dc) dcObs.observe(dc)

    const lookEl = document.getElementById("ta-looking")
    if (lookEl) {
      const lookObs = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".ta-lw").forEach(w => w.classList.add("ta-in"))
          lookObs.unobserve(e.target)
        }
      }), { threshold: 0.3 })
      lookObs.observe(lookEl)
    }

    document.querySelectorAll(".ta-exp-year-item").forEach(item => {
      item.addEventListener("click", () => {
        const idx = (item as HTMLElement).dataset.exp
        document.querySelectorAll(".ta-exp-year-item").forEach(i => i.classList.remove("ta-active"))
        document.querySelectorAll(".ta-exp-panel").forEach(p => p.classList.remove("ta-active"))
        item.classList.add("ta-active")
        document.querySelector(`.ta-exp-panel[data-panel="${idx}"]`)?.classList.add("ta-active")
      })
    })

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", e => {
        const t = document.querySelector((a as HTMLAnchorElement).getAttribute("href")!)
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }) }
      })
    })

    return () => {
      window.removeEventListener("scroll", onScroll)
      burger?.removeEventListener("click", toggleMob)
    }
  }, [navSections, firstName, lastName])

  return null
}
