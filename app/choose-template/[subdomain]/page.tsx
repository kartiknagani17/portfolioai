"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG      = "#FAF9F6"
const SURFACE = "#FFFFFF"
const PANEL   = "#F5F5F4"
const BORDER  = "rgba(0,0,0,0.07)"
const BORDER2 = "rgba(0,0,0,0.13)"
const INK     = "#1C1917"
const INK2    = "#57534E"
const MUTED   = "rgba(28,25,23,0.42)"
const ACCENT  = "#EA580C"
const SUCCESS = "#059669"
const SANS    = "'Plus Jakarta Sans', system-ui, sans-serif"
const MONO    = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace"

// ── Template registry for the gallery ─────────────────────────────────────────
const TEMPLATES = [
  {
    id: "template-axiom",
    name: "Axiom",
    tagline: "Bold. Technical. Precise.",
    palette: ["#0A0A0A", "#FFFFFF", "#7C3AED"],
    industries: ["Software", "Engineering"],
  },
  {
    id: "template-depth",
    name: "Depth",
    tagline: "Layered. Editorial. Striking.",
    palette: ["#0A0A0A", "#F7F3EE", "#DC2626"],
    industries: ["Design", "Art Direction"],
  },
  {
    id: "template-the-atlas",
    name: "The Atlas",
    tagline: "Editorial. Structured. Bold.",
    palette: ["#111111", "#FAFAFA", "#FF6B35"],
    industries: ["Business", "Product"],
  },
  {
    id: "template-pulse",
    name: "Pulse",
    tagline: "Clean. Data-forward. Modern.",
    palette: ["#0F172A", "#F8FAFC", "#0EA5E9"],
    industries: ["Data Science", "Analytics"],
  },
  {
    id: "template-the-current",
    name: "The Current",
    tagline: "Flowing. Creative. Expressive.",
    palette: ["#1C1C1C", "#FAF9F6", "#F59E0B"],
    industries: ["Creative", "Writing"],
  },
  {
    id: "template-canvas",
    name: "Canvas",
    tagline: "Clean. Academic. Timeless.",
    palette: ["#2D2D2D", "#FFFFF0", "#059669"],
    industries: ["Academia", "Research"],
  },
  {
    id: "template-meridian",
    name: "Meridian",
    tagline: "Modern. Minimal. Professional.",
    palette: ["#111827", "#FAFAFA", "#10B981"],
    industries: ["Business", "Consulting"],
  },
  {
    id: "template-2",
    name: "Editorial",
    tagline: "Magazine-style. Refined.",
    palette: ["#1A1A1A", "#F5F0E8", "#E8380D"],
    industries: ["Design", "Creative"],
  },
  {
    id: "template-3",
    name: "Maker",
    tagline: "Developer-first. No-frills. Sharp.",
    palette: ["#0F172A", "#F1F5F9", "#3B82F6"],
    industries: ["Software", "Open Source"],
  },
  {
    id: "template-1",
    name: "Classic",
    tagline: "Clean. Structured. Timeless.",
    palette: ["#1C1917", "#FAFAF8", "#EA580C"],
    industries: ["General", "All Industries"],
  },
]

// Thumbnail: iframe is always 1280×1280; scale is computed from actual card width
const IFRAME_W = 1280
const IFRAME_H = 1280

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ChooseTemplatePage() {
  const params   = useParams()
  const subdomain = Array.isArray(params.subdomain) ? params.subdomain[0] : (params.subdomain as string)
  const router   = useRouter()
  const supabase = createClient()

  const [aiTemplate,    setAiTemplate]    = useState<string | null>(null)
  const [selected,      setSelected]      = useState<string | null>(null)
  const [previewId,     setPreviewId]     = useState<string | null>(null)
  const [saving,        setSaving]        = useState(false)
  const [loadedThumbs,  setLoadedThumbs]  = useState<Set<string>>(new Set())
  const [cols,          setCols]          = useState(5)
  const [thumbScale,    setThumbScale]    = useState(222 / 1280)
  const gridRef = useRef<HTMLDivElement>(null)

  // Load portfolio to get AI-chosen template
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("portfolios")
        .select("template_id")
        .eq("subdomain", subdomain)
        .single()
      if (data?.template_id) {
        setAiTemplate(data.template_id)
        setSelected(data.template_id)
      }
    }
    load()
  }, [subdomain])

  // Responsive columns
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w >= 1400) setCols(5)
      else if (w >= 1100) setCols(4)
      else if (w >= 768)  setCols(3)
      else                setCols(2)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Recompute thumb scale whenever cols or grid width changes
  useEffect(() => {
    function update() {
      if (!gridRef.current) return
      const gridWidth = gridRef.current.getBoundingClientRect().width
      const gap = 20
      const cardWidth = (gridWidth - (cols - 1) * gap) / cols
      setThumbScale(cardWidth / IFRAME_W)
    }
    update()
    const ro = new ResizeObserver(update)
    if (gridRef.current) ro.observe(gridRef.current)
    return () => ro.disconnect()
  }, [cols])

  // Stagger thumbnail reveal
  useEffect(() => {
    TEMPLATES.forEach((t, i) => {
      setTimeout(() => {
        setLoadedThumbs(prev => new Set([...prev, t.id]))
      }, i * 120)
    })
  }, [])

  const handleSelect = useCallback(async (templateId: string) => {
    if (saving) return
    setSaving(true)
    try {
      await fetch("/api/update-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain, templateId }),
      })
      router.push(`/dashboard/edit/${subdomain}`)
    } catch {
      setSaving(false)
    }
  }, [subdomain, saving, router])

  const openPreview  = useCallback((id: string) => setPreviewId(id), [])
  const closePreview = useCallback(() => setPreviewId(null), [])

  // Esc key closes modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closePreview() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [closePreview])

  const previewTemplate = TEMPLATES.find(t => t.id === previewId)

  return (
    <div style={{
      minHeight: "100vh", background: BG, color: INK,
      fontFamily: SANS, overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes ct-fadein { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes ct-spin   { to { transform: rotate(360deg); } }
        @keyframes ct-pulse  { 0%,100%{opacity:0.4} 50%{opacity:1} }

        .ct-card {
          background: ${SURFACE};
          border: 2px solid ${BORDER};
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
          animation: ct-fadein 0.4s ease both;
        }
        .ct-card:hover {
          border-color: rgba(0,0,0,0.18);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          transform: translateY(-3px);
        }
        .ct-card.selected {
          border-color: ${ACCENT};
          box-shadow: 0 0 0 3px rgba(234,88,12,0.15), 0 8px 32px rgba(0,0,0,0.1);
          transform: translateY(-3px);
        }
        .ct-card.recommended {
          border-color: ${SUCCESS};
          box-shadow: 0 0 0 3px rgba(5,150,105,0.12), 0 8px 32px rgba(0,0,0,0.1);
        }

        .ct-btn-primary {
          padding: 11px 24px;
          background: ${ACCENT};
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: ${SANS};
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: -0.01em;
          box-shadow: 0 2px 10px rgba(234,88,12,0.3);
          white-space: nowrap;
        }
        .ct-btn-primary:hover:not(:disabled) {
          background: #DC4B08;
          box-shadow: 0 4px 16px rgba(234,88,12,0.42);
          transform: translateY(-1px);
        }
        .ct-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .ct-btn-ghost {
          padding: 10px 20px;
          background: ${SURFACE};
          color: ${INK2};
          border: 1.5px solid ${BORDER2};
          border-radius: 10px;
          font-family: ${SANS};
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .ct-btn-ghost:hover {
          color: ${INK};
          border-color: rgba(0,0,0,0.22);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .ct-preview-btn {
          padding: 8px 16px;
          background: rgba(255,255,255,0.9);
          color: ${INK};
          border: 1.5px solid ${BORDER2};
          border-radius: 8px;
          font-family: ${SANS};
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: -0.01em;
          backdrop-filter: blur(8px);
        }
        .ct-preview-btn:hover {
          background: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          transform: translateY(-1px);
        }

        .ct-thumb-wrapper {
          width: 100%;
          aspect-ratio: 148 / 96;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
          background: #E7E5E4;
        }
        .ct-thumb-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: ${IFRAME_W}px;
          height: ${IFRAME_H}px;
          border: none;
          pointer-events: none;
          transform-origin: top left;
          display: block;
        }

        .ct-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 40px 20px;
          animation: ct-fadein 0.2s ease;
        }

        .ct-modal {
          width: 100%; max-width: 1100px;
          height: calc(100vh - 80px);
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 24px 80px rgba(0,0,0,0.35);
          animation: ct-fadein 0.25s ease;
        }

        .ct-modal-header {
          background: #FAFAFA;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          padding: 0 20px;
          height: 60px;
          display: flex; align-items: center; gap: 14;
          flex-shrink: 0;
        }

        .ct-close-btn {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(0,0,0,0.06);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: ${INK2}; font-size: 18px; font-weight: 300;
          transition: background 0.15s; flex-shrink: 0;
          font-family: ${SANS};
          line-height: 1;
        }
        .ct-close-btn:hover { background: rgba(0,0,0,0.12); }

        @media (max-width: 768px) {
          .ct-grid { gap: 12px !important; }
        }
      `}</style>

      {/* ── TOP NAV ── */}
      <div style={{
        height: 58, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px",
        background: SURFACE, borderBottom: `1px solid ${BORDER}`,
        position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #EA580C, #F97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontFamily: SANS, fontSize: 15, fontWeight: 800, color: INK, letterSpacing: "-0.03em" }}>
            PortfolioAI
          </span>
          <div style={{ width: 1, height: 18, background: BORDER, marginLeft: 4 }} />
          <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED, letterSpacing: "0.04em" }}>
            {subdomain}
          </span>
        </div>

        {/* Skip */}
        <button
          className="ct-btn-ghost"
          onClick={() => router.push(`/dashboard/edit/${subdomain}`)}
          style={{ fontSize: 12 }}
        >
          Skip →
        </button>
      </div>

      {/* ── HERO TEXT ── */}
      <div style={{
        textAlign: "center", padding: "52px 24px 40px",
        animation: "ct-fadein 0.5s ease",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "#ECFDF5", border: "1px solid #A7F3D0",
          borderRadius: 20, padding: "5px 14px", marginBottom: 18,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%", background: SUCCESS,
            animation: "ct-pulse 2.5s ease-in-out infinite",
          }} />
          <span style={{ fontFamily: MONO, fontSize: 10, color: SUCCESS, letterSpacing: "0.07em", fontWeight: 500 }}>
            RESUME PROCESSED
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800,
          color: INK, letterSpacing: "-0.04em", lineHeight: 1.1,
          marginBottom: 14,
        }}>
          Choose your template
        </h1>
        <p style={{
          fontSize: 15, color: INK2, lineHeight: 1.65,
          maxWidth: 480, margin: "0 auto",
        }}>
          Click any template to preview it with your actual portfolio data.
          Pick one you love — you can always switch later.
        </p>
      </div>

      {/* ── TEMPLATE GRID ── */}
      <div style={{ padding: "0 24px 80px", maxWidth: 1440, margin: "0 auto" }}>
        <div
          ref={gridRef}
          className="ct-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 20,
          }}
        >
          {TEMPLATES.map((tpl, idx) => {
            const isAi       = tpl.id === aiTemplate
            const isSelected = tpl.id === selected
            const isLoaded   = loadedThumbs.has(tpl.id)

            return (
              <div
                key={tpl.id}
                className={`ct-card${isSelected ? " selected" : ""}${isAi && !isSelected ? " recommended" : ""}`}
                style={{ animationDelay: `${idx * 60}ms` }}
                onClick={() => openPreview(tpl.id)}
              >
                {/* Thumbnail */}
                <div
                  className="ct-thumb-wrapper"
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  {/* Color swatch fallback while iframe hasn't loaded yet */}
                  {!isLoaded && (
                    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                      {tpl.palette.map((c, i) => (
                        <div key={i} style={{ flex: 1, background: c }} />
                      ))}
                    </div>
                  )}

                  {isLoaded && (
                    <iframe
                      className="ct-thumb-iframe"
                      src={`/p/${subdomain}?template=${tpl.id}&preview=true&ts=${idx}`}
                      title={tpl.name}
                      sandbox="allow-scripts allow-same-origin"
                      style={{ transform: `scale(${thumbScale})` }}
                    />
                  )}

                  {/* Hover gradient hint */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.35) 100%)",
                    display: "flex", alignItems: "flex-end", justifyContent: "center",
                    padding: "0 0 10px",
                    opacity: 0, transition: "opacity 0.2s",
                    pointerEvents: "none",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                  >
                    <span style={{
                      fontFamily: SANS, fontSize: 11, fontWeight: 600,
                      color: "#fff", letterSpacing: "-0.01em",
                      textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                    }}>
                      Click to preview ↗
                    </span>
                  </div>

                  {/* Palette dots */}
                  <div style={{
                    position: "absolute", top: 10, left: 10,
                    display: "flex", gap: 4,
                  }}>
                    {tpl.palette.map((c, i) => (
                      <div key={i} style={{
                        width: 9, height: 9, borderRadius: "50%",
                        background: c,
                        border: "1.5px solid rgba(255,255,255,0.6)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                      }} />
                    ))}
                  </div>

                  {/* AI recommended badge */}
                  {isAi && (
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      background: SUCCESS, color: "#fff",
                      fontFamily: SANS, fontSize: 9, fontWeight: 700,
                      padding: "3px 8px", borderRadius: 20,
                      letterSpacing: "0.04em",
                      boxShadow: "0 2px 6px rgba(5,150,105,0.4)",
                    }}>
                      ✦ AI PICK
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>
                      {tpl.name}
                    </span>
                    {isSelected && (
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: ACCENT,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                          <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
                    {tpl.tagline}
                  </div>

                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 2 }}>
                    {tpl.industries.map((ind, i) => (
                      <span key={i} style={{
                        fontFamily: MONO, fontSize: 9, color: INK2,
                        background: PANEL, border: `1px solid ${BORDER}`,
                        padding: "2px 7px", borderRadius: 4,
                        letterSpacing: "0.02em",
                      }}>
                        {ind}
                      </span>
                    ))}
                  </div>

                  {/* Action row */}
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      className="ct-btn-primary"
                      style={{
                        flex: 1, padding: "8px 0", fontSize: 12,
                        background: isSelected ? SUCCESS : ACCENT,
                        boxShadow: isSelected
                          ? "0 2px 10px rgba(5,150,105,0.3)"
                          : "0 2px 10px rgba(234,88,12,0.3)",
                      }}
                      onClick={e => { e.stopPropagation(); setSelected(tpl.id); handleSelect(tpl.id) }}
                      disabled={saving}
                    >
                      {saving && selected === tpl.id ? (
                        <div style={{
                          width: 12, height: 12, border: "2px solid rgba(255,255,255,0.4)",
                          borderTopColor: "#fff", borderRadius: "50%",
                          animation: "ct-spin 0.7s linear infinite",
                          margin: "0 auto",
                        }} />
                      ) : isSelected ? "✓ Selected" : "Use This Template"}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── PREVIEW MODAL ── */}
      {previewId && previewTemplate && (
        <div className="ct-backdrop" onClick={closePreview}>
          <div className="ct-modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="ct-modal-header">
              {/* 3 palette dots */}
              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                {previewTemplate.palette.map((c, i) => (
                  <div key={i} style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: c, border: "1.5px solid rgba(0,0,0,0.1)",
                    flexShrink: 0,
                  }} />
                ))}
              </div>

              <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.1)", flexShrink: 0 }} />

              {/* Name + tagline */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>
                    {previewTemplate.name}
                  </span>
                  {previewId === aiTemplate && (
                    <span style={{
                      background: "#ECFDF5", border: "1px solid #A7F3D0",
                      borderRadius: 20, padding: "2px 9px",
                      fontFamily: MONO, fontSize: 9, color: SUCCESS,
                      letterSpacing: "0.05em", fontWeight: 600, flexShrink: 0,
                    }}>
                      ✦ AI Pick
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>
                  {previewTemplate.tagline}
                </div>
              </div>

              {/* Use This Theme */}
              <button
                className="ct-btn-primary"
                style={{ padding: "8px 20px", fontSize: 13, flexShrink: 0 }}
                onClick={() => { setSelected(previewId); closePreview(); handleSelect(previewId) }}
                disabled={saving}
              >
                {saving ? "Saving…" : "✓ Use This Theme"}
              </button>

              {/* X close */}
              <button className="ct-close-btn" onClick={closePreview}>×</button>
            </div>

            {/* Body — scrollable gray bg with iframe */}
            <div style={{ flex: 1, overflow: "auto", background: "#E5E7EB", position: "relative" }}>
              <iframe
                src={`/p/${subdomain}?template=${previewId}&preview=true`}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                title={`Preview of ${previewTemplate.name}`}
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
