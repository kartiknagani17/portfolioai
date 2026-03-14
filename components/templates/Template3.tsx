"use client"

import { useEffect, useRef, useState } from "react"
import type { PortfolioData } from "@/types/portfolio"

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useCountUp(target: number, active: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf: number
    const start = performance.now()
    const DURATION = 1800
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1)
      const ease = t < 0.75
        ? Math.pow(t / 0.75, 2) * 1.08
        : 1.08 - ((t - 0.75) / 0.25) * 0.08
      setVal(Math.round(Math.min(ease, 1.0) * target))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setVal(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target])
  return val
}

function useTypewriter(text: string, active: boolean, speed = 48) {
  const [out, setOut] = useState("")
  useEffect(() => {
    if (!active) return
    let i = 0
    const t = setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) clearInterval(t) }, speed)
    return () => clearInterval(t)
  }, [active, text, speed])
  return out
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────

function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0)
    }
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, zIndex: 9999,
      height: 2, background: "var(--t3-accent)",
      width: `${pct}%`, transition: "width 0.08s linear",
      pointerEvents: "none",
    }} />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────────────────────────────────────

function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse   = useRef({ x: -200, y: -200 })
  const lag     = useRef({ x: -200, y: -200 })
  const raf     = useRef<number>()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    setShow(true)
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    document.addEventListener("mousemove", onMove)
    const loop = () => {
      lag.current.x += (mouse.current.x - lag.current.x) * 0.1
      lag.current.y += (mouse.current.y - lag.current.y) * 0.1
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px,${mouse.current.y - 4}px)`
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${lag.current.x - 20}px,${lag.current.y - 20}px)`
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current!) }
  }, [])

  if (!show) return null
  return (
    <>
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, width: 8, height: 8,
        borderRadius: "50%", background: "var(--t3-accent)",
        pointerEvents: "none", zIndex: 9998, mixBlendMode: "multiply",
      }} />
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, width: 40, height: 40,
        borderRadius: "50%", border: "1.5px solid rgba(124,58,237,0.45)",
        pointerEvents: "none", zIndex: 9997,
      }} />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER — monospace number + rule draws + big Syne title lifts
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ num, label, title }: { num: string; label: string; title: string }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ marginBottom: 72 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 14,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10, color: "var(--t3-accent)",
          letterSpacing: "0.18em", textTransform: "uppercase",
        }}>{label}</span>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12, color: "var(--t3-accent)",
          letterSpacing: "0.06em",
        }}>{num} /</span>
      </div>
      {/* Rule that draws from left */}
      <div style={{ position: "relative", height: 1, background: "#F3F4F6", marginBottom: 24, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "var(--t3-accent)",
          transform: visible ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 1.3s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }} />
      </div>
      {/* Title slides up from clip mask */}
      <div style={{ overflow: "hidden" }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 800, color: "#0F0F0F",
          textTransform: "uppercase", letterSpacing: "-0.02em",
          lineHeight: 1, margin: 0,
          transform: visible ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s",
        }}>{title}</h2>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO — letter-by-letter spring entrance + typewriter role + ambient blobs
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection({ personal, experience, projects }: {
  personal: PortfolioData["personal"]
  experience: PortfolioData["experience"]
  projects: PortfolioData["projects"]
}) {
  const [heroIn, setHeroIn]       = useState(false)
  const [typeStart, setTypeStart] = useState(false)
  const firstName    = personal?.fullName?.split(" ")[0] || ""
  const lastName     = personal?.fullName?.split(" ").slice(1).join(" ") || ""
  const totalLetters = firstName.length + lastName.length
  const yearsExp     = experience?.length
    ? (new Date().getFullYear() - parseInt((experience[experience.length - 1]?.startDate || "").split(" ").pop() || "0")) || experience.length + 2
    : 3
  const projectCount = projects?.length || 0
  const currentRole  = experience?.find(e => e.isCurrent)

  useEffect(() => {
    const t1 = setTimeout(() => setHeroIn(true), 100)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (!heroIn) return
    const t2 = setTimeout(() => setTypeStart(true), totalLetters * 38 + 500)
    return () => clearTimeout(t2)
  }, [heroIn, totalLetters])

  const role = useTypewriter(personal?.professionalTitle || "", typeStart, 44)

  return (
    <div className="t3-hero" style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "0 52px", overflow: "hidden",
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)",
        top: "-5%", right: "-80px", pointerEvents: "none",
        animation: "t3-blob1 10s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        bottom: "8%", left: "-60px", pointerEvents: "none",
        animation: "t3-blob2 14s ease-in-out infinite",
      }} />

      {/* Two-column grid */}
      <div className="t3-hero-grid" style={{
        position: "relative", zIndex: 1,
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "0 60px", alignItems: "center", width: "100%",
      }}>
        {/* LEFT: Name + role + badge + links */}
        <div>
          {[firstName, lastName].filter(Boolean).map((word, wi) => (
            <div key={wi} style={{ overflow: "hidden", lineHeight: 0.9, marginBottom: wi === 0 ? 4 : 0 }}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.4rem, 5vw, 5.2rem)",
                fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "-0.03em", color: "#0F0F0F",
              }}>
                {word.split("").map((l, li) => {
                  const d = wi === 0 ? li * 38 : firstName.length * 38 + 80 + li * 38
                  return (
                    <span key={li} style={{
                      display: "inline-block",
                      transform: heroIn ? "translateY(0)" : "translateY(115%)",
                      transition: `transform 0.85s cubic-bezier(0.34,1.56,0.64,1) ${d}ms`,
                    }}>{l}</span>
                  )
                })}
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 28, fontFamily: "'Space Mono', monospace",
            fontSize: "clamp(0.75rem, 1.1vw, 0.95rem)",
            color: "var(--t3-accent)", letterSpacing: "0.04em", minHeight: "1.5em",
          }}>
            {role}
            {typeStart && (
              <span style={{
                display: "inline-block", width: 2, height: "0.85em",
                background: "var(--t3-accent)", marginLeft: 3,
                verticalAlign: "middle", animation: "t3-blink 0.85s step-end infinite",
              }} />
            )}
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, marginTop: 22,
            background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.18)",
            borderRadius: 100, padding: "8px 20px",
            opacity: heroIn ? 1 : 0, transition: "opacity 0.6s ease 1.8s",
            animation: heroIn ? "t3-bob 3.2s ease-in-out infinite" : "none",
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: "#22C55E",
              animation: "t3-pulse 2s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10, color: "var(--t3-accent)", letterSpacing: "0.08em",
            }}>Open to opportunities</span>
          </div>

          <div style={{
            marginTop: 32, display: "flex", flexWrap: "wrap", gap: "4px 0",
            opacity: heroIn ? 1 : 0, transition: "opacity 0.6s ease 2.1s",
          }}>
            {[personal?.location, personal?.email].filter(Boolean).map((v, i) => (
              <span key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#9CA3AF" }}>
                {i > 0 && <span style={{ margin: "0 14px", color: "#E5E7EB" }}>·</span>}
                {v}
              </span>
            ))}
          </div>

          <div style={{
            marginTop: 24, display: "flex", gap: 24,
            opacity: heroIn ? 1 : 0, transition: "opacity 0.6s ease 2.4s",
          }}>
            {[
              personal?.linkedinUrl && { label: "LinkedIn", href: personal.linkedinUrl },
              personal?.githubUrl   && { label: "GitHub",   href: personal.githubUrl },
              personal?.websiteUrl  && { label: "Website",  href: personal.websiteUrl },
            ].filter(Boolean).map((s: any, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10, color: "#9CA3AF", textDecoration: "none",
                  letterSpacing: "0.08em", transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--t3-accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}
              >{s.label} ↗</a>
            ))}
          </div>
        </div>

        {/* RIGHT: Stats grid + current role card + scroll hint */}
        <div style={{
          opacity: heroIn ? 1 : 0, transition: "opacity 0.9s ease 1.4s",
          display: "flex", flexDirection: "column", gap: 24,
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 1, background: "#E5E7EB",
            border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden",
          }}>
            {[
              { val: yearsExp,     suffix: "+", label: "Years experience" },
              { val: projectCount, suffix: "",  label: "Projects shipped"  },
              { val: 50,           suffix: "K", label: "Req/s peak load"   },
              { val: 2,            suffix: "M", label: "Users reached"     },
            ].map(({ val, suffix, label }, i) => (
              <div key={i} style={{
                background: "#fff", padding: "28px 24px",
                display: "flex", flexDirection: "column", gap: 6,
              }}>
                <HeroStat value={val} suffix={suffix} active={heroIn} />
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9, color: "#9CA3AF",
                  textTransform: "uppercase", letterSpacing: "0.12em",
                }}>{label}</span>
              </div>
            ))}
          </div>

          {currentRole && (
            <div style={{
              padding: "20px 24px",
              border: "1px solid #F3F4F6", borderRadius: 12,
              background: "linear-gradient(135deg, rgba(124,58,237,0.04) 0%, #fff 100%)",
            }}>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9, color: "var(--t3-accent)",
                letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8,
              }}>Currently</div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
                fontWeight: 700, color: "#0F0F0F", lineHeight: 1.3, marginBottom: 4,
              }}>{currentRole.roleTitle}</div>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, color: "#6B7280",
              }}>{currentRole.companyName} · {currentRole.startDate} → Present</div>
            </div>
          )}

          <div style={{
            display: "flex", alignItems: "center", gap: 14, marginTop: 4,
            animation: "t3-bounce 2.2s ease-in-out infinite",
          }}>
            <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, var(--t3-accent), transparent)" }} />
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 9,
              color: "#C4C9D4", letterSpacing: "0.14em", textTransform: "uppercase",
            }}>Scroll to explore</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroStat({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const count = useCountUp(value, active)
  return (
    <div style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
      fontWeight: 800, color: "#0F0F0F",
      letterSpacing: "-0.03em", lineHeight: 1,
    }}>
      {count}{suffix}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT — bio fade + counting stats with spring overshoot
// ─────────────────────────────────────────────────────────────────────────────

function StatBubble({ value, label }: { value: number; label: string }) {
  const { ref, visible } = useReveal()
  const count = useCountUp(value, visible)
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(3rem, 5vw, 5rem)",
        fontWeight: 800, color: "#0F0F0F",
        letterSpacing: "-0.03em", lineHeight: 1,
      }}>{count}</div>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 9, color: "var(--t3-accent)",
        letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 8,
      }}>{label}</div>
    </div>
  )
}

function AboutSection({ bio, counts }: { bio: string; counts: { value: number; label: string }[] }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className="t3-about-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "0 80px", alignItems: "center" }}>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
        lineHeight: 1.88, color: "#374151", margin: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
      }}>{bio}</p>
      <div className="t3-stats" style={{
        display: "flex", flexDirection: "column", gap: 40,
        borderLeft: "1px solid #F3F4F6", paddingLeft: 56,
      }}>
        {counts.map((s, i) => <StatBubble key={i} value={s.value} label={s.label} />)}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE — expandable accordion with letter-spacing hover + spring open
// ─────────────────────────────────────────────────────────────────────────────

function AccordionBody({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateRows: open ? "1fr" : "0fr",
      transition: "grid-template-rows 0.65s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ overflow: "hidden" }}>{children}</div>
    </div>
  )
}

function ExpRow({ exp, index, isOpen, onToggle }: {
  exp: PortfolioData["experience"][0]; index: number; isOpen: boolean; onToggle: () => void
}) {
  const { ref, visible } = useReveal()
  const [hov, setHov] = useState(false)
  const num = String(index + 1).padStart(2, "0")

  return (
    <div ref={ref} style={{
      borderBottom: "1px solid #F3F4F6",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(-36px)",
      transition: `opacity 0.7s ease ${index * 90}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 90}ms`,
    }}>
      {/* Clickable header row */}
      <div
        onClick={onToggle}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "grid", gridTemplateColumns: "32px 1fr auto auto",
          gap: "0 20px", alignItems: "center",
          padding: "26px 0", cursor: "pointer",
          background: isOpen ? "rgba(124,58,237,0.025)" : hov ? "rgba(0,0,0,0.015)" : "transparent",
          transition: "background 0.3s ease",
          userSelect: "none",
        }}
      >
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11,
          color: isOpen ? "var(--t3-accent)" : "#C4C9D4",
          letterSpacing: "0.06em", transition: "color 0.3s",
        }}>{num}</span>

        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1rem, 2.2vw, 1.55rem)",
          fontWeight: 700, color: "#0F0F0F", textTransform: "uppercase",
          letterSpacing: hov || isOpen ? "0.07em" : "0.01em",
          transition: "letter-spacing 0.45s cubic-bezier(0.16,1,0.3,1)",
        }}>{exp.companyName}</span>

        {/* Role — hidden on small screens via class */}
        <span className="t3-exp-role" style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13,
          color: "#9CA3AF", letterSpacing: "0.01em",
        }}>{exp.roleTitle}</span>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10,
            color: "#9CA3AF", letterSpacing: "0.04em", whiteSpace: "nowrap",
          }}>{exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}</span>
          <div style={{
            width: 26, height: 26, border: `1.5px solid ${isOpen ? "var(--t3-accent)" : "#E5E7EB"}`,
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            color: isOpen ? "var(--t3-accent)" : "#C4C9D4", fontSize: 16,
            transform: isOpen ? "rotate(45deg)" : "rotate(0)",
            transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}>+</div>
        </div>
      </div>

      {/* Expandable body */}
      <AccordionBody open={isOpen}>
        <div className="t3-exp-body" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "0 48px", padding: "0 0 32px 52px",
        }}>
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10,
              color: "var(--t3-accent)", letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 10,
            }}>{exp.roleTitle}</div>
            {exp.location && (
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#9CA3AF" }}>{exp.location}</div>
            )}
          </div>
          <div>
            {exp.description && (
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14,
                color: "#374151", lineHeight: 1.82, margin: 0,
              }}>{exp.description}</p>
            )}
          </div>
        </div>
      </AccordionBody>
    </div>
  )
}

function ExperienceSection({ experience }: { experience: PortfolioData["experience"] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <div style={{ borderTop: "1px solid #F3F4F6" }}>
      {experience.map((exp, i) => (
        <ExpRow key={i} exp={exp} index={i}
          isOpen={openIdx === i}
          onToggle={() => setOpenIdx(openIdx === i ? null : i)}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — bento grid: featured (3D tilt) + small cards (bottom-up flood)
// ─────────────────────────────────────────────────────────────────────────────

function FeaturedProject({ proj, visible }: { proj: PortfolioData["projects"][0]; visible: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hov, setHov] = useState(false)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(1200px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) scale(1.02)`
    el.style.transition = "transform 0.12s ease"
  }
  const onMouseLeave = () => {
    const el = cardRef.current; if (!el) return
    el.style.transform = "perspective(1200px) rotateX(0) rotateY(0) scale(1)"
    el.style.transition = "transform 0.75s cubic-bezier(0.16,1,0.3,1)"
    setHov(false)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onMouseLeave}
      style={{
        position: "relative", gridColumn: "span 2",
        background: hov ? "rgba(124,58,237,0.05)" : "#F9F8FF",
        border: `1.5px solid ${hov ? "var(--t3-accent)" : "#EEF0F7"}`,
        borderRadius: 20, padding: "44px 44px 40px",
        overflow: "hidden", cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(36px) scale(0.95)",
        transition: `opacity 0.75s ease, transform 0.75s cubic-bezier(0.34,1.56,0.64,1), background 0.4s, border-color 0.4s`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Ghost index */}
      <div style={{
        position: "absolute", top: 12, right: 28,
        fontFamily: "'Space Mono', monospace", fontSize: "6rem",
        color: "transparent",
        WebkitTextStroke: `1px ${hov ? "rgba(124,58,237,0.15)" : "rgba(0,0,0,0.05)"}`,
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        transform: hov ? "translate(-8px,-4px)" : "translate(0,0)",
        transition: "all 0.55s cubic-bezier(0.16,1,0.3,1)",
      }}>01</div>

      {/* Left accent bar draws down */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: 3, height: visible ? "100%" : "0%",
        background: "linear-gradient(180deg, var(--t3-accent), #A78BFA)",
        borderRadius: "0 3px 3px 0",
        transition: "height 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s",
      }} />

      <div style={{ position: "relative" }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
          fontWeight: 800, color: "#0F0F0F",
          textTransform: "uppercase", letterSpacing: "-0.02em",
          lineHeight: 1.05, marginBottom: 18,
        }}>{proj.projectName}</div>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 15,
          color: "#4B5563", lineHeight: 1.78, margin: "0 0 28px", maxWidth: 500,
        }}>{proj.description}</p>

        {proj.techStack.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            {proj.techStack.map((t, i) => (
              <span key={i} style={{
                fontFamily: "'Space Mono', monospace", fontSize: 10,
                color: hov ? "var(--t3-accent)" : "#6B7280",
                border: `1px solid ${hov ? "rgba(124,58,237,0.28)" : "#E5E7EB"}`,
                borderRadius: 5, padding: "5px 11px",
                transition: "all 0.3s",
              }}>{t}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 20 }}>
          {proj.liveUrl && (
            <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
              color: "var(--t3-accent)", textDecoration: "none",
              borderBottom: "1.5px solid var(--t3-accent)", paddingBottom: 1,
            }}>Live ↗</a>
          )}
          {proj.githubUrl && (
            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
              color: "#9CA3AF", textDecoration: "none",
              borderBottom: "1.5px solid #E5E7EB", paddingBottom: 1,
            }}>Code ↗</a>
          )}
        </div>
      </div>
    </div>
  )
}

function SmallProject({ proj, index, visible }: {
  proj: PortfolioData["projects"][0]; index: number; visible: boolean
}) {
  const [hov, setHov] = useState(false)
  const num = String(index + 1).padStart(2, "0")
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", borderRadius: 20,
        background: "#FAFAFA",
        border: "1.5px solid #F3F4F6",
        padding: "32px 32px 28px", overflow: "hidden", cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(36px) scale(0.92)",
        transition: `opacity 0.7s ease ${index * 90}ms, transform 0.7s cubic-bezier(0.34,1.56,0.64,1) ${index * 90}ms`,
      }}
    >
      {/* Bottom-up flood */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 20,
        background: "var(--t3-accent)",
        transform: hov ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.52s cubic-bezier(0.16,1,0.3,1)",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 10,
          color: hov ? "rgba(255,255,255,0.55)" : "#C4C9D4",
          letterSpacing: "0.06em", marginBottom: 18,
          transition: "color 0.3s",
        }}>{num}</div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1rem, 1.8vw, 1.35rem)",
          fontWeight: 700, color: hov ? "#fff" : "#0F0F0F",
          textTransform: "uppercase", letterSpacing: "-0.01em",
          lineHeight: 1.2, marginBottom: 14,
          transition: "color 0.3s",
        }}>{proj.projectName}</div>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13,
          color: hov ? "rgba(255,255,255,0.78)" : "#6B7280",
          lineHeight: 1.72, margin: "0 0 20px",
          transition: "color 0.3s",
        }}>{proj.description}</p>
        {proj.techStack.length > 0 && (
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 9,
            color: hov ? "rgba(255,255,255,0.45)" : "#C4C9D4",
            letterSpacing: "0.04em", marginBottom: 20,
            transition: "color 0.3s",
          }}>{proj.techStack.slice(0, 3).join("  ·  ")}</div>
        )}
        <div style={{ display: "flex", gap: 16 }}>
          {proj.liveUrl && (
            <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
              color: hov ? "#fff" : "var(--t3-accent)",
              textDecoration: "none",
              borderBottom: `1.5px solid ${hov ? "rgba(255,255,255,0.5)" : "var(--t3-accent)"}`,
              transition: "all 0.3s",
            }}>Live ↗</a>
          )}
          {proj.githubUrl && (
            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
              color: hov ? "rgba(255,255,255,0.65)" : "#9CA3AF",
              textDecoration: "none",
              borderBottom: `1.5px solid ${hov ? "rgba(255,255,255,0.3)" : "#E5E7EB"}`,
              transition: "all 0.3s",
            }}>Code ↗</a>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectsSection({ projects }: { projects: PortfolioData["projects"] }) {
  const { ref, visible } = useReveal()
  const [featured, ...rest] = projects
  return (
    <div ref={ref} className="t3-bento" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
      {featured && <FeaturedProject proj={featured} visible={visible} />}
      {rest.slice(0, 3).map((proj, i) => (
        <SmallProject key={i} proj={proj} index={i + 1} visible={visible} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS — dual drifting conveyor belts, pause on hover, pop on item hover
// ─────────────────────────────────────────────────────────────────────────────

function SkillChip({ name, accent }: { name: string; accent?: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600,
        color: hov ? "#fff" : accent ? "var(--t3-accent)" : "#374151",
        background: hov ? "var(--t3-accent)" : accent ? "rgba(124,58,237,0.07)" : "#F3F4F6",
        border: `1.5px solid ${hov ? "var(--t3-accent)" : accent ? "rgba(124,58,237,0.2)" : "#E5E7EB"}`,
        padding: "10px 20px", borderRadius: 100, whiteSpace: "nowrap", cursor: "default",
        transform: hov ? "scale(1.08) translateY(-2px)" : "scale(1) translateY(0)",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >{name}</span>
  )
}

function SkillsSection({ skills }: { skills: PortfolioData["skills"] }) {
  const { ref, visible } = useReveal()
  const [paused, setPaused] = useState(false)

  const grouped: Record<string, string[]> = {}
  skills.forEach(s => { if (!grouped[s.category]) grouped[s.category] = []; grouped[s.category].push(s.name) })
  const cats = Object.values(grouped)
  const row1Raw = cats.filter((_, i) => i % 2 === 0).flat()
  const row2Raw = cats.filter((_, i) => i % 2 !== 0).flat()

  const pad = (arr: string[], min = 10) => { const r = [...arr]; while (r.length < min) r.push(...arr); return [...r, ...r] }
  const r1 = pad(row1Raw.length > 0 ? row1Raw : skills.map(s => s.name))
  const r2 = pad(row2Raw.length > 0 ? row2Raw : [...skills].reverse().map(s => s.name))

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease", overflow: "hidden" }}
    >
      {[{ items: r1, dir: "t3-scroll-left", dur: "28s" }, { items: r2, dir: "t3-scroll-right", dur: "34s" }].map((row, ri) => (
        <div key={ri} style={{ overflow: "hidden", marginBottom: ri === 0 ? 14 : 0 }}>
          <div style={{
            display: "flex", gap: 12, alignItems: "center", width: "max-content",
            animation: `${row.dir} ${row.dur} linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}>
            {row.items.map((name, i) => (
              <SkillChip key={i} name={name} accent={i % (ri === 0 ? 4 : 3) === 0} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION — blur-to-sharp year + clip-reveal degree + expanding rule
// ─────────────────────────────────────────────────────────────────────────────

function EduRow({ edu, index }: { edu: PortfolioData["education"][0]; index: number }) {
  const { ref, visible } = useReveal()
  const [hov, setHov] = useState(false)
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="t3-edu-row"
      style={{
        display: "grid", gridTemplateColumns: "100px 1fr",
        gap: "0 48px", padding: "48px 0",
        borderBottom: "1px solid #F3F4F6", cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${index * 90}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 90}ms`,
      }}
    >
      {/* Blur-to-sharp year */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)",
        fontWeight: 700, color: "var(--t3-accent)", letterSpacing: "0.04em",
        alignSelf: "center",
        filter: visible ? "blur(0)" : "blur(10px)",
        opacity: visible ? 1 : 0,
        transition: `filter 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 90 + 180}ms, opacity 0.9s ease ${index * 90 + 180}ms`,
        whiteSpace: "nowrap",
      }}>
        {edu.endYear || edu.startYear || "—"}
      </div>
      <div>
        <div style={{ overflow: "hidden", marginBottom: 10 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
            fontWeight: 700, color: "#0F0F0F",
            textTransform: "uppercase", letterSpacing: "-0.01em",
            transform: visible ? "translateY(0)" : "translateY(110%)",
            transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 90 + 80}ms`,
          }}>
            {edu.degree}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}
          </div>
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
          color: "var(--t3-accent)", marginBottom: 6,
          opacity: visible ? 1 : 0,
          transition: `opacity 0.7s ease ${index * 90 + 220}ms`,
        }}>{edu.institution}</div>
        {edu.startYear && edu.endYear && (
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#C4C9D4",
            opacity: visible ? 1 : 0,
            transition: `opacity 0.7s ease ${index * 90 + 300}ms`,
          }}>{edu.startYear} – {edu.endYear}</div>
        )}
        {/* Expanding rule on hover */}
        <div style={{
          marginTop: 18, height: 1.5, borderRadius: 1,
          background: "var(--t3-accent)",
          width: visible ? (hov ? "55%" : "22%") : "0%",
          transition: hov
            ? "width 0.4s cubic-bezier(0.16,1,0.3,1)"
            : `width 1.2s cubic-bezier(0.16,1,0.3,1) ${index * 90 + 420}ms`,
          opacity: 0.45,
        }} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATIONS — hover SVG underline draw + arrow indicator
// ─────────────────────────────────────────────────────────────────────────────

function CertItem({ cert, index }: { cert: NonNullable<PortfolioData["certifications"]>[0]; index: number }) {
  const { ref, visible } = useReveal()
  const [hov, setHov] = useState(false)
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 0", borderBottom: "1px solid #F3F4F6", cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-28px)",
        transition: `opacity 0.65s ease ${index * 85}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 85}ms`,
      }}
    >
      <div>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700,
          color: "#0F0F0F", marginBottom: 6,
        }}>{cert.name}</div>
        <svg height="3" style={{ display: "block", width: "100%", overflow: "visible", marginBottom: 6 }}>
          <line x1="0" y1="1.5" x2="100%" y2="1.5"
            stroke="var(--t3-accent)" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="1000" strokeDashoffset={hov ? 0 : 1000}
            style={{ transition: "stroke-dashoffset 0.65s cubic-bezier(0.16,1,0.3,1)" }} />
        </svg>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 10,
          color: "var(--t3-accent)", letterSpacing: "0.08em",
        }}>{cert.issuer}{cert.date ? `  ·  ${cert.date}` : ""}</div>
      </div>
      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: 16,
        color: hov ? "var(--t3-accent)" : "#E5E7EB",
        transform: hov ? "translate(5px,-5px)" : "translate(0,0)",
        transition: "all 0.3s ease",
      }}>↗</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGES — dot grid pop-in
// ─────────────────────────────────────────────────────────────────────────────

const PROF_PCT: Record<string, number> = {
  Native: 100, Fluent: 85, Professional: 70, Conversational: 50, Basic: 28,
}

function LangDots({ language, proficiency, index }: { language: string; proficiency: string; index: number }) {
  const { ref, visible } = useReveal()
  const filled = Math.round((PROF_PCT[proficiency] ?? 50) / 10)
  return (
    <div ref={ref} style={{
      padding: "24px 0", borderBottom: "1px solid #F3F4F6",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.65s ease ${index * 100}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14,
      }}>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700,
          color: "#0F0F0F", textTransform: "uppercase", letterSpacing: "0.01em",
        }}>{language}</span>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 10,
          color: "var(--t3-accent)", letterSpacing: "0.1em", textTransform: "uppercase",
        }}>{proficiency}</span>
      </div>
      <div style={{ display: "flex", gap: 7 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            width: 11, height: 11, borderRadius: 3,
            background: i < filled ? "var(--t3-accent)" : "#F3F4F6",
            border: `1.5px solid ${i < filled ? "var(--t3-accent)" : "#E5E7EB"}`,
            transform: visible && i < filled ? "scale(1)" : "scale(0)",
            transition: `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${index * 100 + i * 70}ms`,
          }} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERESTS — dual marquee rows (opposite directions), hover slows to stop
// ─────────────────────────────────────────────────────────────────────────────

function InterestsSection({ interests }: { interests: string[] }) {
  const { ref, visible } = useReveal()
  const [paused, setPaused] = useState(false)
  const dur = interests.length * 4
  const mkRow = (arr: string[]) => [...arr, ...arr, ...arr, ...arr]
  const row1 = mkRow(interests)
  const row2 = mkRow([...interests].reverse())

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ overflow: "hidden", opacity: visible ? 1 : 0, transition: "opacity 0.7s ease" }}
    >
      {[
        { items: row1, anim: "t3-scroll-left",  d: `${dur}s`  },
        { items: row2, anim: "t3-scroll-right", d: `${dur + 5}s` },
      ].map((row, ri) => (
        <div key={ri} style={{ overflow: "hidden", marginBottom: ri === 0 ? 18 : 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 28, width: "max-content",
            animation: `${row.anim} ${row.d} linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            transition: "animation-play-state 0.4s",
          }}>
            {row.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 28,
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.1rem, 2.2vw, 1.75rem)",
                fontWeight: ri === 0 ? 800 : 400,
                color: ri === 0 ? "#0F0F0F" : "transparent",
                WebkitTextStroke: ri === 1 ? "1.5px #D1D5DB" : "none",
                textTransform: "uppercase", letterSpacing: "-0.01em", whiteSpace: "nowrap",
              }}>
                {item}
                <span style={{
                  color: ri === 0 ? "var(--t3-accent)" : "rgba(124,58,237,0.25)",
                  WebkitTextStroke: "0",
                  fontSize: "0.45em",
                }}>✦</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER — "Available." floods violet from left, text inverts to white
// ─────────────────────────────────────────────────────────────────────────────

function FooterSection({ personal }: { personal: PortfolioData["personal"] }) {
  const { ref, visible } = useReveal(0.25)
  return (
    <footer style={{
      background: "#fff", borderTop: "1px solid #F3F4F6",
      padding: "120px 52px", textAlign: "center",
    }}>
      <div ref={ref}>
        {/* Flood text */}
        <div style={{
          position: "relative", display: "inline-block", marginBottom: 28,
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            fontWeight: 800, color: "#0F0F0F",
            textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 1,
            userSelect: "none",
          }}>Available.</div>
          {/* Violet flood */}
          <div style={{
            position: "absolute", inset: 0,
            background: "var(--t3-accent)",
            clipPath: visible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            transition: "clip-path 1.6s cubic-bezier(0.16,1,0.3,1) 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              fontWeight: 800, color: "#fff",
              textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 1,
              whiteSpace: "nowrap",
            }}>Available.</div>
          </div>
        </div>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6B7280",
          lineHeight: 1.72, marginBottom: 44, maxWidth: 480, margin: "0 auto 44px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.55s",
        }}>
          Open to new roles, interesting problems, and meaningful collaborations.
        </p>

        <div style={{
          display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap",
          marginBottom: 64,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.75s",
        }}>
          {personal?.email && (
            <a href={`mailto:${personal.email}`} style={{
              fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
              color: "#fff", background: "var(--t3-accent)",
              padding: "16px 36px", borderRadius: 8, textDecoration: "none",
              textTransform: "uppercase", letterSpacing: "0.05em",
              boxShadow: "0 4px 24px rgba(124,58,237,0.3)",
              transition: "transform 0.25s, box-shadow 0.25s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)"
                e.currentTarget.style.boxShadow = "0 10px 36px rgba(124,58,237,0.42)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.3)"
              }}
            >Send a message</a>
          )}
          {personal?.linkedinUrl && (
            <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
              color: "#374151", padding: "16px 36px", borderRadius: 8,
              textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em",
              border: "1.5px solid #E5E7EB",
              transition: "border-color 0.25s, color 0.25s, transform 0.25s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--t3-accent)"
                e.currentTarget.style.color = "var(--t3-accent)"
                e.currentTarget.style.transform = "translateY(-3px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#E5E7EB"
                e.currentTarget.style.color = "#374151"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >LinkedIn ↗</a>
          )}
        </div>

        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 10,
          color: "#D1D5DB", letterSpacing: "0.1em",
        }}>
          BUILT WITH PORTFOLIOAI · {personal?.fullName?.toUpperCase()}
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE MENU
// ─────────────────────────────────────────────────────────────────────────────

function MobileMenu({ sections, onNav, email }: {
  sections: string[]; onNav: (id: string) => void; email?: string
}) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])
  return (
    <>
      <button onClick={() => setOpen(!open)} className="t3-hamburger"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none", flexDirection: "column", gap: 5 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            display: "block", width: 22, height: 2, background: "#0F0F0F", borderRadius: 1,
            transformOrigin: "center", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
            ...(open && i === 0 ? { transform: "rotate(45deg) translate(5px,5px)" } : {}),
            ...(open && i === 1 ? { opacity: 0 } : {}),
            ...(open && i === 2 ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}),
          }} />
        ))}
      </button>
      <div style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "#fff", display: "flex", flexDirection: "column",
        padding: "80px 32px 48px",
        opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none",
        transition: "opacity 0.35s ease",
      }}>
        <button onClick={() => setOpen(false)} style={{
          position: "absolute", top: 20, right: 24,
          background: "none", border: "none", fontSize: 30, cursor: "pointer", color: "#0F0F0F",
        }}>×</button>
        {sections.map((id, i) => (
          <button key={id} onClick={() => { onNav(id); setOpen(false) }} style={{
            fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800,
            color: "#0F0F0F", background: "none", border: "none",
            textAlign: "left", padding: "14px 0", textTransform: "uppercase",
            letterSpacing: "-0.01em", borderBottom: "1px solid #F3F4F6", cursor: "pointer",
            transform: open ? "translateX(0)" : "translateX(-24px)",
            opacity: open ? 1 : 0,
            transition: `transform 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms, opacity 0.4s ease ${i * 55}ms`,
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--t3-accent)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#0F0F0F" }}
          >{id.charAt(0).toUpperCase() + id.slice(1)}</button>
        ))}
        {email && (
          <a href={`mailto:${email}`} style={{
            marginTop: 32, fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
            color: "#fff", background: "var(--t3-accent)", padding: "16px 28px",
            borderRadius: 8, textDecoration: "none", textAlign: "center",
            textTransform: "uppercase", letterSpacing: "0.05em", display: "inline-block",
          }}>Get in touch</a>
        )}
      </div>
    </>
  )
}

function T3WorkStyleCard({ card, index }: { card: { title: string; body: string }; index: number }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className="t3-ws-card" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(18px)", transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s` }}>
      <div className="t3-ws-num">/ {String(index + 1).padStart(2, "0")}</div>
      <div className="t3-ws-title">{card.title}</div>
      {card.body && <div className="t3-ws-body">{card.body}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

export default function Template3({ portfolioData }: { portfolioData: PortfolioData }) {
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

  const hasBio        = !!personal?.bio?.trim()
  const hasExperience = experience.length > 0
  const hasProjects   = projects.length > 0
  const hasSkills     = skills.length > 0
  const hasEducation  = education.length > 0
  const hasCerts      = certifications.length > 0
  const hasLanguages  = languages.length > 0
  const hasInterests  = interests.length > 0
  const hasTagline    = !!tagline.trim()
  const hasCareerStory = !!careerStory.trim()
  const hasWorkStyle  = !!workStyle.trim()
  const hasLookingFor = !!lookingFor.trim()

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

  const ALL_NAV = [
    hasBio        && "about",
    hasExperience && "experience",
    hasProjects   && "projects",
    hasSkills     && "skills",
    hasEducation  && "education",
    hasCerts      && "certifications",
    hasLanguages  && "languages",
    hasInterests  && "interests",
  ].filter(Boolean) as string[]

  const aboutCounts = [
    hasExperience && { value: experience.length, label: experience.length === 1 ? "Role" : "Roles" },
    hasProjects   && { value: projects.length,   label: "Projects" },
    hasSkills     && { value: skills.length,     label: "Skills" },
  ].filter(Boolean) as { value: number; label: string }[]

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(`t3-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --t3-accent: #7C3AED; }
        html { scroll-behavior: smooth; }
        body { cursor: none; }
        @media (pointer: coarse) { body { cursor: auto; } }

        .t3-wrap {
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #fff; min-height: 100vh; color: #0F0F0F;
        }

        /* NAV */
        .t3-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 0.4s ease, border-color 0.4s ease;
        }
        .t3-nav.scrolled {
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }
        .t3-nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 52px; transition: padding 0.4s ease;
        }
        .t3-nav.scrolled .t3-nav-inner { padding: 18px 52px; }
        .t3-nav-logo {
          font-family: 'Space Mono', monospace; font-size: 12px;
          color: #0F0F0F; letter-spacing: 0.08em; text-transform: uppercase;
          opacity: 0; transition: opacity 0.7s ease;
        }
        .t3-nav-logo.in { opacity: 1; }
        .t3-nav-links { display: flex; gap: 32px; align-items: center; }
        .t3-nav-link {
          font-family: 'Space Mono', monospace; font-size: 9px; color: #9CA3AF;
          letter-spacing: 0.12em; text-transform: uppercase;
          background: none; border: none; cursor: none;
          position: relative; padding-bottom: 2px; transition: color 0.22s;
        }
        .t3-nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 1.5px; background: var(--t3-accent);
          transition: width 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .t3-nav-link:hover { color: var(--t3-accent); }
        .t3-nav-link:hover::after { width: 100%; }
        a { cursor: none; }
        @media (pointer: coarse) { a, .t3-nav-link { cursor: auto; } }

        /* SECTIONS */
        .t3-section { max-width: 1200px; margin: 0 auto; padding: 100px 52px; }
        .t3-rule { border: none; border-top: 1px solid #F3F4F6; }
        .t3-rule-wrap { max-width: 1200px; margin: 0 auto; }

        /* HERO */
        .t3-hero { padding: 0 52px !important; }
        .t3-hero-bottom { bottom: 48px; left: 52px; right: 52px; }

        /* ABOUT */
        .t3-about-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 0 80px; align-items: center; }
        .t3-stats { display: flex; flex-direction: column; gap: 40px; border-left: 1px solid #F3F4F6; padding-left: 56px; }

        /* BENTO */
        .t3-bento { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .t3-bento > *:first-child { grid-column: span 2; }

        /* EXP */
        .t3-exp-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0 48px; padding: 0 0 32px 52px; }
        .t3-exp-role { display: block; }

        /* EDU */
        .t3-edu-row { display: grid !important; grid-template-columns: 100px 1fr; gap: 0 48px; }

        /* KEYFRAMES */
        @keyframes t3-blob1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-40px,30px) scale(1.04); }
          66% { transform: translate(30px,-40px) scale(0.97); }
        }
        @keyframes t3-blob2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(50px,-30px) scale(1.06); }
        }
        @keyframes t3-blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes t3-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-7px); } }
        @keyframes t3-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.55; transform:scale(0.8); } }
        @keyframes t3-bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(8px); } }
        @keyframes t3-scroll-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes t3-scroll-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }

        /* HAMBURGER */
        .t3-hamburger { display: none !important; }

        /* RESPONSIVE */
        @media (max-width: 960px) {
          .t3-nav-links { display: none; }
          .t3-hamburger { display: flex !important; flex-direction: column; }
          .t3-section { padding: 72px 32px; }
          .t3-hero { padding: 0 32px !important; }
          .t3-hero-bottom { left: 32px; right: 32px; }
          .t3-hero-grid { grid-template-columns: 1fr !important; gap: 48px 0 !important; }
          .t3-about-grid { grid-template-columns: 1fr; gap: 48px 0; }
          .t3-stats { border-left: none; padding-left: 0; border-top: 1px solid #F3F4F6; padding-top: 40px; flex-direction: row !important; flex-wrap: wrap; gap: 32px !important; }
          .t3-bento { grid-template-columns: 1fr; }
          .t3-bento > *:first-child { grid-column: span 1; }
          .t3-exp-body { grid-template-columns: 1fr; gap: 12px 0; padding-left: 32px; }
          .t3-exp-role { display: none !important; }
          .t3-nav-inner { padding: 18px 28px; }
          .t3-nav.scrolled .t3-nav-inner { padding: 14px 28px; }
        }
        @media (max-width: 600px) {
          .t3-section { padding: 56px 20px; }
          .t3-hero { padding: 0 20px !important; }
          .t3-hero-bottom { left: 20px; right: 20px; }
          .t3-nav-inner { padding: 16px 20px; }
          .t3-nav.scrolled .t3-nav-inner { padding: 12px 20px; }
          .t3-edu-row { grid-template-columns: 1fr !important; }
          .t3-looking-text { columns: 1; }
        }

        /* TAGLINE BAND */
        .t3-tagline-band {
          background: var(--t3-accent); padding: 72px 52px; overflow: hidden;
        }
        .t3-tagline-text {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(1.8rem, 4vw, 4rem); color: #fff; line-height: 1.15;
          max-width: 1100px; margin: 0 auto; letter-spacing: -0.03em;
        }
        .t3-tagline-text em { color: rgba(255,255,255,0.5); font-style: normal; }

        /* CAREER STORY */
        .t3-career-block {
          padding: 80px 52px; background: #F9FAFB;
          border-top: 1px solid #F3F4F6; border-bottom: 1px solid #F3F4F6;
        }
        .t3-career-inner { max-width: 860px; margin: 0 auto; }
        .t3-career-label {
          font-family: 'Space Mono', monospace; font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--t3-accent); margin-bottom: 24px;
          display: flex; align-items: center; gap: 12px;
        }
        .t3-career-label::before { content: '//'; opacity: 0.5; }
        .t3-career-text {
          font-family: 'Inter', sans-serif; font-size: clamp(15px, 1.5vw, 18px);
          color: #374151; line-height: 1.85; font-weight: 400;
        }

        /* WORK STYLE */
        .t3-ws-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .t3-ws-card {
          border: 1px solid #F3F4F6; border-radius: 12px; padding: 24px;
          background: #fff; position: relative;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .t3-ws-card:hover { border-color: var(--t3-accent); box-shadow: 0 4px 24px rgba(124,58,237,0.1); }
        .t3-ws-num {
          font-family: 'Space Mono', monospace; font-size: 11px;
          color: var(--t3-accent); letter-spacing: 0.1em; margin-bottom: 14px;
        }
        .t3-ws-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #0F0F0F; margin-bottom: 8px; }
        .t3-ws-body { font-size: 13px; color: #6B7280; line-height: 1.65; }

        /* LOOKING FOR */
        .t3-looking-section {
          background: #0F0F0F; padding: 100px 52px;
          position: relative; overflow: hidden;
        }
        .t3-looking-section::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .t3-looking-label {
          font-family: 'Space Mono', monospace; font-size: 10px;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--t3-accent); margin-bottom: 28px;
          display: flex; align-items: center; gap: 10px;
        }
        .t3-looking-label::before { content: '//'; opacity: 0.5; }
        .t3-looking-text {
          font-family: 'Inter', sans-serif; font-size: clamp(14px, 1.4vw, 17px);
          color: rgba(255,255,255,0.7); line-height: 1.85;
          max-width: 1100px; columns: 2; column-gap: 56px;
        }
      `}</style>

      <div className="t3-wrap">
        <ScrollProgress />
        <CustomCursor />

        {/* NAV */}
        <nav className={`t3-nav${scrolled ? " scrolled" : ""}`}>
          <div className="t3-nav-inner">
            <div className={`t3-nav-logo${scrolled ? " in" : ""}`}>
              {personal?.fullName?.toUpperCase()}
            </div>
            <div className="t3-nav-links">
              {ALL_NAV.map(id => (
                <button key={id} className="t3-nav-link" onClick={() => scrollTo(id)}>{id}</button>
              ))}
            </div>
            <MobileMenu sections={ALL_NAV} onNav={scrollTo} email={personal?.email} />
          </div>
        </nav>

        {/* HERO */}
        <HeroSection personal={personal} experience={experience} projects={projects} />

        {/* TAGLINE */}
        {hasTagline && (
          <div className="t3-tagline-band" id="t3-tagline">
            <p className="t3-tagline-text">
              {tagline.split(/(revenue|growth|impact|results|success|innovation|scale)/i).map((part, i) =>
                /revenue|growth|impact|results|success|innovation|scale/i.test(part)
                  ? <em key={i}>{part}</em>
                  : part
              )}
            </p>
          </div>
        )}

        {/* ABOUT */}
        {hasBio && (<>
          <div className="t3-rule-wrap"><hr className="t3-rule" /></div>
          <div className="t3-section" id="t3-about">
            <SectionHeader num="01" label="Introduction" title="About" />
            <AboutSection bio={personal.bio} counts={aboutCounts} />
          </div>
        </>)}

        {/* CAREER STORY */}
        {hasCareerStory && (
          <div className="t3-career-block" id="t3-career-story">
            <div className="t3-career-inner">
              <div className="t3-career-label">Career Story</div>
              <p className="t3-career-text">{careerStory}</p>
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {hasExperience && (<>
          <div className="t3-rule-wrap"><hr className="t3-rule" /></div>
          <div className="t3-section" id="t3-experience">
            <SectionHeader num="02" label="Career" title="Work Experience" />
            <ExperienceSection experience={experience} />
          </div>
        </>)}

        {/* PROJECTS */}
        {hasProjects && (<>
          <div className="t3-rule-wrap"><hr className="t3-rule" /></div>
          <div className="t3-section" id="t3-projects">
            <SectionHeader num="03" label="Work" title="Selected Projects" />
            <ProjectsSection projects={projects} />
          </div>
        </>)}

        {/* SKILLS */}
        {hasSkills && (<>
          <div className="t3-rule-wrap"><hr className="t3-rule" /></div>
          <div className="t3-section" id="t3-skills">
            <SectionHeader num="04" label="Expertise" title="Skills & Stack" />
            <SkillsSection skills={skills} />
          </div>
        </>)}

        {/* WORK STYLE */}
        {hasWorkStyle && workStyleCards.length > 0 && (<>
          <div className="t3-rule-wrap"><hr className="t3-rule" /></div>
          <div className="t3-section" id="t3-workstyle">
            <SectionHeader num="05" label="Approach" title="How I Work" />
            <div className="t3-ws-cards">
              {workStyleCards.map((card, i) => <T3WorkStyleCard key={i} card={card} index={i} />)}
            </div>
          </div>
        </>)}

        {/* EDUCATION */}
        {hasEducation && (<>
          <div className="t3-rule-wrap"><hr className="t3-rule" /></div>
          <div className="t3-section" id="t3-education">
            <SectionHeader num="06" label="Academic" title="Education" />
            <div style={{ borderTop: "1px solid #F3F4F6" }}>
              {education.map((edu, i) => <EduRow key={i} edu={edu} index={i} />)}
            </div>
          </div>
        </>)}

        {/* CERTIFICATIONS */}
        {hasCerts && (<>
          <div className="t3-rule-wrap"><hr className="t3-rule" /></div>
          <div className="t3-section" id="t3-certifications">
            <SectionHeader num="07" label="Credentials" title="Certifications" />
            <div style={{ borderTop: "1px solid #F3F4F6" }}>
              {certifications.map((cert, i) => <CertItem key={i} cert={cert} index={i} />)}
            </div>
          </div>
        </>)}

        {/* LANGUAGES */}
        {hasLanguages && (<>
          <div className="t3-rule-wrap"><hr className="t3-rule" /></div>
          <div className="t3-section" id="t3-languages">
            <SectionHeader num="08" label="Communication" title="Languages" />
            <div style={{ maxWidth: 560 }}>
              {languages.map((l, i) => (
                <LangDots key={i} language={l.language} proficiency={l.proficiency} index={i} />
              ))}
            </div>
          </div>
        </>)}

        {/* INTERESTS */}
        {hasInterests && (<>
          <div className="t3-rule-wrap"><hr className="t3-rule" /></div>
          <div className="t3-section" id="t3-interests">
            <SectionHeader num="09" label="Personal" title="Interests" />
            <InterestsSection interests={interests} />
          </div>
        </>)}

        {/* LOOKING FOR */}
        {hasLookingFor && (
          <div className="t3-looking-section" id="t3-looking-for">
            <div className="t3-looking-label">What's Next</div>
            <p className="t3-looking-text">{lookingFor}</p>
          </div>
        )}

        <FooterSection personal={personal} />
      </div>
    </>
  )
}
