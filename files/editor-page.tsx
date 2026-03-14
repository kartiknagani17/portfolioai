"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  changesMade?: string[]
}

interface EditSession {
  subdomain: string
  portfolioData: any
  templateId: string
  accentColor: string
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const EDITOR_BG      = "#0C0C0E"
const EDITOR_SURFACE = "#141416"
const EDITOR_PANEL   = "#111113"
const EDITOR_BORDER  = "rgba(255,255,255,0.06)"
const EDITOR_BORDER2 = "rgba(255,255,255,0.1)"
const EDITOR_INK     = "#F2EEE8"
const EDITOR_MUTED   = "rgba(242,238,232,0.35)"
const EDITOR_ACCENT  = "#7B61FF"   // studio violet
const EDITOR_GREEN   = "#00D084"
const EDITOR_MONO    = "'JetBrains Mono', 'Fira Code', monospace"
const EDITOR_SANS    = "'Geist', 'Inter', system-ui, sans-serif"

// ── Preset accent colors ──────────────────────────────────────────────────────
const ACCENT_PRESETS = [
  { name: "Flame",     value: "#FF3B00" },
  { name: "Electric",  value: "#00E5FF" },
  { name: "Violet",    value: "#7B61FF" },
  { name: "Emerald",   value: "#00D084" },
  { name: "Gold",      value: "#FFB800" },
  { name: "Rose",      value: "#FF2D6B" },
  { name: "Cobalt",    value: "#2E5BFF" },
  { name: "Slate",     value: "#94A3B8" },
  { name: "Coral",     value: "#FF6B6B" },
  { name: "Mint",      value: "#00F5A0" },
  { name: "Ink",       value: "#111108" },
  { name: "Pearl",     value: "#F5F0E8" },
]

// ── Template options ──────────────────────────────────────────────────────────
const TEMPLATE_OPTIONS = [
  { id: "template-2", name: "Editorial Dark",  for: "Graphic Designer" },
  { id: "template-3", name: "Maker",            for: "Indie Hacker" },
  { id: "template-4", name: "The Brief",        for: "Copywriter" },
  { id: "template-5", name: "Frame",            for: "Video Editor" },
]

// ── Suggested prompts ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "Make my bio shorter and more confident",
  "Rewrite my hero title to sound more senior",
  "Add a testimonial from a recent client",
  "Move my best project to the top",
  "Make my services section sound more premium",
  "Change my availability to Available Now",
  "Add more personality to my about section",
  "Rewrite project descriptions to focus on results",
]

// ── Utility ───────────────────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000)
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  return `${Math.floor(s / 3600)}h ago`
}

// ── Main Editor Component ─────────────────────────────────────────────────────
export default function PortfolioEditor({ params }: { params: { subdomain: string } }) {
  const [session,       setSession]       = useState<EditSession | null>(null)
  const [messages,      setMessages]      = useState<Message[]>([])
  const [input,         setInput]         = useState("")
  const [loading,       setLoading]       = useState(false)
  const [saving,        setSaving]        = useState(false)
  const [saved,         setSaved]         = useState(false)
  const [previewKey,    setPreviewKey]    = useState(0)
  const [activeTab,     setActiveTab]     = useState<"chat"|"style">("chat")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [panelWidth,    setPanelWidth]    = useState(380)
  const [isDragging,    setIsDragging]    = useState(false)
  const [customColor,   setCustomColor]   = useState("")
  const [isMobile,      setIsMobile]      = useState(false)
  const [mobileTab,     setMobileTab]     = useState<"preview"|"edit">("edit")
  const [undoStack,     setUndoStack]     = useState<any[]>([])

  const messagesEndRef  = useRef<HTMLDivElement>(null)
  const inputRef        = useRef<HTMLTextAreaElement>(null)
  const dragRef         = useRef<HTMLDivElement>(null)
  const supabase        = createClient()
  const router          = useRouter()

  // ── Load portfolio data ───────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("subdomain", params.subdomain)
        .single()

      if (error || !data) {
        router.push("/dashboard")
        return
      }

      setSession({
        subdomain: data.subdomain,
        portfolioData: data.portfolio_data,
        templateId: data.template_id || "template-2",
        accentColor: data.accent_color || "#FF3B00",
      })

      // Welcome message
      setMessages([{
        id: generateId(),
        role: "assistant",
        content: `Your portfolio is loaded and ready to edit. Just tell me what you want to change — I can rewrite copy, add or remove sections, reorder projects, update your availability, or anything else. What would you like to improve first?`,
        timestamp: new Date(),
      }])
    }
    load()
  }, [params.subdomain])

  // ── Auto scroll messages ──────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ── Mobile detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // ── Panel resize drag ─────────────────────────────────────────────────────
  const onDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    const startX = e.clientX
    const startW = panelWidth
    const onMove = (e: MouseEvent) => {
      const delta = startX - e.clientX
      setPanelWidth(Math.max(300, Math.min(600, startW + delta)))
    }
    const onUp = () => {
      setIsDragging(false)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [panelWidth])

  // ── Send message to Claude ────────────────────────────────────────────────
  const send = useCallback(async (text?: string) => {
    const message = text || input.trim()
    if (!message || !session || loading) return

    setInput("")
    setShowSuggestions(false)

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    // Save to undo stack
    setUndoStack(prev => [...prev.slice(-9), session.portfolioData])

    try {
      const res = await fetch("/api/edit-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          portfolioData: session.portfolioData,
          subdomain: session.subdomain,
        }),
      })

      if (!res.ok) throw new Error("API error")

      const { updatedData, summary, changesMade } = await res.json()

      // Update session
      setSession(prev => prev ? { ...prev, portfolioData: updatedData } : null)

      // Refresh preview
      setPreviewKey(k => k + 1)

      // Add assistant response
      const assistantMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: summary,
        timestamp: new Date(),
        changesMade,
      }
      setMessages(prev => [...prev, assistantMsg])

    } catch (err) {
      setMessages(prev => [...prev, {
        id: generateId(),
        role: "assistant",
        content: "Something went wrong. Please try again.",
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, session, loading])

  // ── Undo last change ──────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setUndoStack(s => s.slice(0, -1))
    setSession(s => s ? { ...s, portfolioData: prev } : null)
    setPreviewKey(k => k + 1)
    setMessages(m => [...m, {
      id: generateId(),
      role: "system",
      content: "Last change undone.",
      timestamp: new Date(),
    }])
  }, [undoStack])

  // ── Save to Supabase ──────────────────────────────────────────────────────
  const save = useCallback(async () => {
    if (!session || saving) return
    setSaving(true)
    try {
      await supabase
        .from("portfolios")
        .update({
          portfolio_data: session.portfolioData,
          template_id: session.templateId,
          accent_color: session.accentColor,
          updated_at: new Date().toISOString(),
        })
        .eq("subdomain", session.subdomain)

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }, [session, saving])

  // ── Update accent color ───────────────────────────────────────────────────
  const setAccentColor = useCallback((color: string) => {
    setSession(s => s ? { ...s, accentColor: color } : null)
    setPreviewKey(k => k + 1)
  }, [])

  // ── Switch template ───────────────────────────────────────────────────────
  const setTemplate = useCallback((templateId: string) => {
    setSession(s => s ? { ...s, templateId } : null)
    setPreviewKey(k => k + 1)
    setMessages(m => [...m, {
      id: generateId(),
      role: "system",
      content: `Switched to ${TEMPLATE_OPTIONS.find(t => t.id === templateId)?.name} template.`,
      timestamp: new Date(),
    }])
  }, [])

  // ── Key handler ───────────────────────────────────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  if (!session) {
    return (
      <div style={{
        minHeight: "100vh", background: EDITOR_BG,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 32, height: 32, border: `2px solid ${EDITOR_ACCENT}`,
            borderTopColor: "transparent", borderRadius: "50%",
            animation: "editor-spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }} />
          <div style={{ fontFamily: EDITOR_MONO, fontSize: 12, color: EDITOR_MUTED, letterSpacing: "0.08em" }}>
            Loading portfolio...
          </div>
        </div>
        <style>{`@keyframes editor-spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    )
  }

  const previewUrl = `/p/${session.subdomain}?preview=true&accent=${encodeURIComponent(session.accentColor)}&template=${session.templateId}&ts=${previewKey}`

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: EDITOR_BG, color: EDITOR_INK,
      fontFamily: EDITOR_SANS, overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }

        @keyframes editor-spin   { to { transform:rotate(360deg); } }
        @keyframes editor-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        @keyframes editor-pulse  { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes editor-saved  { 0%{transform:scale(0.9);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

        .editor-scrollbar::-webkit-scrollbar        { width:4px; }
        .editor-scrollbar::-webkit-scrollbar-track  { background:transparent; }
        .editor-scrollbar::-webkit-scrollbar-thumb  { background:rgba(255,255,255,0.1); border-radius:2px; }
        .editor-scrollbar::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.2); }

        .editor-input {
          width:100%; background:transparent; border:none; outline:none;
          font-family:${EDITOR_SANS}; font-size:14px; color:${EDITOR_INK};
          resize:none; line-height:1.6;
        }
        .editor-input::placeholder { color:${EDITOR_MUTED}; }

        .editor-suggestion {
          font-family:${EDITOR_SANS}; font-size:12px; color:${EDITOR_MUTED};
          background:${EDITOR_SURFACE}; border:1px solid ${EDITOR_BORDER};
          padding:8px 14px; border-radius:6px; cursor:pointer; text-align:left;
          transition:all 0.15s ease; line-height:1.4; white-space:nowrap;
        }
        .editor-suggestion:hover {
          color:${EDITOR_INK}; border-color:${EDITOR_BORDER2};
          background:#1A1A1E;
        }

        .editor-tab {
          font-family:${EDITOR_SANS}; font-size:12px; font-weight:500;
          color:${EDITOR_MUTED}; background:none; border:none;
          padding:8px 16px; cursor:pointer; position:relative;
          transition:color 0.2s; letter-spacing:0.02em;
        }
        .editor-tab.active { color:${EDITOR_INK}; }
        .editor-tab.active::after {
          content:''; position:absolute; bottom:0; left:16px; right:16px;
          height:1.5px; background:${EDITOR_ACCENT};
        }

        .editor-color-swatch {
          width:32px; height:32px; border-radius:6px; cursor:pointer;
          border:2px solid transparent; transition:all 0.15s ease;
          position:relative;
        }
        .editor-color-swatch:hover { transform:scale(1.1); }
        .editor-color-swatch.active {
          border-color:rgba(255,255,255,0.8);
          box-shadow:0 0 0 1px rgba(255,255,255,0.2);
        }
        .editor-color-swatch::after {
          content:''; position:absolute;
          inset:0; border-radius:4px;
          background:rgba(255,255,255,0.1);
          opacity:0; transition:opacity 0.15s;
        }
        .editor-color-swatch:hover::after { opacity:1; }

        .editor-template-option {
          padding:10px 14px; border:1px solid ${EDITOR_BORDER};
          border-radius:8px; cursor:pointer;
          transition:all 0.15s ease; position:relative;
          background:${EDITOR_SURFACE};
        }
        .editor-template-option:hover { border-color:${EDITOR_BORDER2}; background:#1A1A1E; }
        .editor-template-option.active {
          border-color:${EDITOR_ACCENT};
          background:rgba(123,97,255,0.08);
        }

        .editor-send-btn {
          width:36px; height:36px; border-radius:8px;
          background:${EDITOR_ACCENT}; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:opacity 0.2s, transform 0.15s;
          flex-shrink:0;
        }
        .editor-send-btn:hover:not(:disabled) { opacity:0.88; transform:scale(1.04); }
        .editor-send-btn:disabled { opacity:0.35; cursor:not-allowed; }

        .editor-nav-btn {
          font-family:${EDITOR_SANS}; font-size:12px; font-weight:500;
          color:${EDITOR_MUTED}; background:${EDITOR_SURFACE};
          border:1px solid ${EDITOR_BORDER}; padding:6px 14px;
          border-radius:6px; cursor:pointer; transition:all 0.15s ease;
          white-space:nowrap;
        }
        .editor-nav-btn:hover { color:${EDITOR_INK}; border-color:${EDITOR_BORDER2}; }
        .editor-nav-btn.primary {
          color:#fff; background:${EDITOR_ACCENT}; border-color:${EDITOR_ACCENT};
        }
        .editor-nav-btn.primary:hover { opacity:0.88; }
        .editor-nav-btn.saved {
          color:${EDITOR_GREEN}; border-color:${EDITOR_GREEN}33;
          background:${EDITOR_GREEN}0D;
          animation:editor-saved 0.3s ease;
        }

        .editor-msg { animation:editor-fadein 0.3s ease; }

        .editor-mobile-tab {
          flex:1; padding:10px; font-size:13px; font-weight:500;
          background:none; border:none; cursor:pointer; transition:all 0.2s;
          font-family:${EDITOR_SANS};
        }

        @media (max-width:768px) {
          .editor-resize-handle { display:none !important; }
        }
      `}</style>

      {/* ── TOP NAV ── */}
      <div style={{
        height: 48, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 16px",
        borderBottom: `1px solid ${EDITOR_BORDER}`,
        background: EDITOR_PANEL, flexShrink: 0,
      }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="editor-nav-btn" onClick={() => router.push("/dashboard")} style={{ padding: "6px 10px" }}>
            ←
          </button>
          <div style={{ width: 1, height: 20, background: EDITOR_BORDER }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: EDITOR_GREEN,
              boxShadow: `0 0 6px ${EDITOR_GREEN}`,
              animation: "editor-pulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontFamily: EDITOR_MONO, fontSize: 11, color: EDITOR_MUTED, letterSpacing: "0.06em" }}>
              {session.subdomain}
            </span>
          </div>
        </div>

        {/* Center — title */}
        <div style={{ fontFamily: EDITOR_SANS, fontSize: 13, fontWeight: 600, color: EDITOR_INK, letterSpacing: "0.01em" }}>
          Portfolio Editor
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {undoStack.length > 0 && (
            <button className="editor-nav-btn" onClick={undo} title="Undo last change">
              ↩ Undo
            </button>
          )}
          <a
            href={`/p/${session.subdomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="editor-nav-btn"
          >
            Preview ↗
          </a>
          <button
            className={`editor-nav-btn primary ${saved ? "saved" : ""}`}
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving..." : saved ? "✓ Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* ── MOBILE TAB BAR ── */}
      {isMobile && (
        <div style={{
          display: "flex", borderBottom: `1px solid ${EDITOR_BORDER}`,
          background: EDITOR_PANEL, flexShrink: 0,
        }}>
          {(["preview", "edit"] as const).map(tab => (
            <button
              key={tab}
              className="editor-mobile-tab"
              onClick={() => setMobileTab(tab)}
              style={{
                color: mobileTab === tab ? EDITOR_INK : EDITOR_MUTED,
                borderBottom: mobileTab === tab ? `1.5px solid ${EDITOR_ACCENT}` : "none",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* ── LEFT — PREVIEW ── */}
        {(!isMobile || mobileTab === "preview") && (
          <div style={{
            flex: 1, position: "relative", overflow: "hidden",
            background: "#000",
          }}>
            {/* Browser chrome bar */}
            <div style={{
              height: 36, background: EDITOR_SURFACE,
              borderBottom: `1px solid ${EDITOR_BORDER}`,
              display: "flex", alignItems: "center", padding: "0 16px",
              gap: 8, flexShrink: 0,
            }}>
              {/* Traffic lights */}
              {["#FF5F57","#FEBC2E","#28C840"].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
              <div style={{
                flex: 1, background: EDITOR_PANEL,
                border: `1px solid ${EDITOR_BORDER}`,
                borderRadius: 5, height: 20,
                display: "flex", alignItems: "center",
                padding: "0 10px", margin: "0 12px",
              }}>
                <span style={{ fontFamily: EDITOR_MONO, fontSize: 10, color: EDITOR_MUTED }}>
                  {session.subdomain}.portfolioai.co
                </span>
              </div>
              {/* Live indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: EDITOR_GREEN }} />
                <span style={{ fontFamily: EDITOR_MONO, fontSize: 9, color: EDITOR_MUTED, letterSpacing: "0.08em" }}>LIVE</span>
              </div>
            </div>

            {/* Portfolio iframe */}
            <iframe
              key={previewKey}
              src={previewUrl}
              style={{
                width: "100%",
                height: "calc(100% - 36px)",
                border: "none",
                display: "block",
              }}
              title="Portfolio Preview"
            />

            {/* Loading overlay */}
            {loading && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(12,12,14,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(2px)",
                pointerEvents: "none",
              }}>
                <div style={{
                  background: EDITOR_SURFACE, border: `1px solid ${EDITOR_BORDER}`,
                  borderRadius: 10, padding: "16px 24px",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 16, height: 16, border: `2px solid ${EDITOR_ACCENT}`,
                    borderTopColor: "transparent", borderRadius: "50%",
                    animation: "editor-spin 0.7s linear infinite",
                  }} />
                  <span style={{ fontFamily: EDITOR_SANS, fontSize: 13, color: EDITOR_MUTED }}>
                    Applying changes...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RESIZE HANDLE ── */}
        {!isMobile && (
          <div
            className="editor-resize-handle"
            onMouseDown={onDragStart}
            style={{
              width: 4, cursor: "col-resize", flexShrink: 0,
              background: isDragging ? EDITOR_ACCENT : EDITOR_BORDER,
              transition: "background 0.2s ease",
              position: "relative", zIndex: 10,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = EDITOR_BORDER2)}
            onMouseLeave={e => !isDragging && (e.currentTarget.style.background = EDITOR_BORDER)}
          />
        )}

        {/* ── RIGHT — EDITOR PANEL ── */}
        {(!isMobile || mobileTab === "edit") && (
          <div style={{
            width: isMobile ? "100%" : panelWidth,
            flexShrink: 0, display: "flex", flexDirection: "column",
            background: EDITOR_PANEL, borderLeft: `1px solid ${EDITOR_BORDER}`,
            overflow: "hidden",
          }}>

            {/* Tab bar */}
            <div style={{
              display: "flex", borderBottom: `1px solid ${EDITOR_BORDER}`,
              padding: "0 4px", flexShrink: 0,
            }}>
              <button className={`editor-tab ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
                Chat
              </button>
              <button className={`editor-tab ${activeTab === "style" ? "active" : ""}`} onClick={() => setActiveTab("style")}>
                Style
              </button>
            </div>

            {/* ── CHAT TAB ── */}
            {activeTab === "chat" && (
              <>
                {/* Messages */}
                <div
                  className="editor-scrollbar"
                  style={{ flex: 1, overflowY: "auto", padding: "16px" }}
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="editor-msg"
                      style={{
                        marginBottom: 16,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      {msg.role === "system" ? (
                        <div style={{
                          alignSelf: "center",
                          fontFamily: EDITOR_MONO, fontSize: 10,
                          color: EDITOR_MUTED, letterSpacing: "0.06em",
                          padding: "4px 12px",
                          background: EDITOR_SURFACE,
                          borderRadius: 4,
                        }}>
                          {msg.content}
                        </div>
                      ) : (
                        <>
                          <div style={{
                            maxWidth: "85%",
                            padding: "10px 14px",
                            borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                            background: msg.role === "user"
                              ? EDITOR_ACCENT
                              : EDITOR_SURFACE,
                            border: msg.role === "assistant" ? `1px solid ${EDITOR_BORDER}` : "none",
                            fontSize: 13, lineHeight: 1.65,
                            color: msg.role === "user" ? "#fff" : EDITOR_INK,
                          }}>
                            {msg.content}
                          </div>

                          {/* Changes made tags */}
                          {msg.changesMade && msg.changesMade.length > 0 && (
                            <div style={{
                              display: "flex", flexWrap: "wrap", gap: 4,
                              marginTop: 6, maxWidth: "85%",
                            }}>
                              {msg.changesMade.map((change, i) => (
                                <div key={i} style={{
                                  fontFamily: EDITOR_MONO, fontSize: 9,
                                  color: EDITOR_GREEN,
                                  background: `${EDITOR_GREEN}12`,
                                  border: `1px solid ${EDITOR_GREEN}25`,
                                  padding: "2px 8px", borderRadius: 3,
                                  letterSpacing: "0.04em",
                                }}>
                                  ✓ {change}
                                </div>
                              ))}
                            </div>
                          )}

                          <div style={{
                            marginTop: 4,
                            fontFamily: EDITOR_MONO, fontSize: 9,
                            color: EDITOR_MUTED, letterSpacing: "0.04em",
                          }}>
                            {timeAgo(msg.timestamp)}
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {loading && (
                    <div className="editor-msg" style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                      <div style={{
                        display: "flex", gap: 4, padding: "10px 14px",
                        background: EDITOR_SURFACE, border: `1px solid ${EDITOR_BORDER}`,
                        borderRadius: "12px 12px 12px 3px",
                      }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: EDITOR_MUTED,
                            animation: `editor-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                          }} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {showSuggestions && (
                  <div style={{
                    padding: "0 12px 8px",
                    borderTop: `1px solid ${EDITOR_BORDER}`,
                    paddingTop: 10,
                  }}>
                    <div style={{
                      fontFamily: EDITOR_MONO, fontSize: 9, color: EDITOR_MUTED,
                      letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8,
                    }}>
                      Suggestions
                    </div>
                    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                      <style>{`.suggestions-scroll::-webkit-scrollbar{display:none}`}</style>
                      <div className="suggestions-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", width: "100%", scrollbarWidth: "none" }}>
                        {SUGGESTIONS.slice(0, 4).map((s, i) => (
                          <button key={i} className="editor-suggestion" onClick={() => send(s)}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Input area */}
                <div style={{
                  padding: "12px 16px",
                  borderTop: `1px solid ${EDITOR_BORDER}`,
                  background: EDITOR_PANEL, flexShrink: 0,
                }}>
                  <div style={{
                    display: "flex", gap: 10, alignItems: "flex-end",
                    background: EDITOR_SURFACE,
                    border: `1px solid ${EDITOR_BORDER}`,
                    borderRadius: 10, padding: "10px 12px",
                    transition: "border-color 0.2s ease",
                  }}
                    onFocus={() => {}}
                  >
                    <textarea
                      ref={inputRef}
                      className="editor-input"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Tell me what to change..."
                      rows={1}
                      style={{
                        maxHeight: 120,
                        overflowY: input.split("\n").length > 4 ? "auto" : "hidden",
                      }}
                      onInput={e => {
                        const t = e.target as HTMLTextAreaElement
                        t.style.height = "auto"
                        t.style.height = Math.min(t.scrollHeight, 120) + "px"
                      }}
                    />
                    <button
                      className="editor-send-btn"
                      onClick={() => send()}
                      disabled={loading || !input.trim()}
                    >
                      {loading ? (
                        <div style={{
                          width: 14, height: 14,
                          border: "2px solid rgba(255,255,255,0.4)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "editor-spin 0.7s linear infinite",
                        }} />
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div style={{
                    marginTop: 6, fontFamily: EDITOR_MONO, fontSize: 9,
                    color: EDITOR_MUTED, letterSpacing: "0.06em",
                    display: "flex", justifyContent: "space-between",
                  }}>
                    <span>Enter to send · Shift+Enter for new line</span>
                    {undoStack.length > 0 && (
                      <button onClick={undo} style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: EDITOR_MONO, fontSize: 9, color: EDITOR_MUTED,
                        letterSpacing: "0.06em",
                      }}>
                        ↩ undo ({undoStack.length})
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── STYLE TAB ── */}
            {activeTab === "style" && (
              <div className="editor-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>

                {/* Accent color */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{
                    fontFamily: EDITOR_MONO, fontSize: 9, color: EDITOR_MUTED,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
                  }}>
                    Accent Color
                  </div>

                  {/* Current color display */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px",
                    background: EDITOR_SURFACE, border: `1px solid ${EDITOR_BORDER}`,
                    borderRadius: 8, marginBottom: 14,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 6,
                      background: session.accentColor,
                      flexShrink: 0,
                    }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: EDITOR_INK, marginBottom: 2 }}>
                        {ACCENT_PRESETS.find(p => p.value === session.accentColor)?.name || "Custom"}
                      </div>
                      <div style={{ fontFamily: EDITOR_MONO, fontSize: 11, color: EDITOR_MUTED }}>
                        {session.accentColor.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Preset swatches */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(6,1fr)",
                    gap: 8, marginBottom: 14,
                  }}>
                    {ACCENT_PRESETS.map((preset) => (
                      <div key={preset.value} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div
                          className={`editor-color-swatch ${session.accentColor === preset.value ? "active" : ""}`}
                          style={{ background: preset.value }}
                          onClick={() => setAccentColor(preset.value)}
                          title={preset.name}
                        />
                        <div style={{ fontFamily: EDITOR_MONO, fontSize: 8, color: EDITOR_MUTED, letterSpacing: "0.04em" }}>
                          {preset.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom color input */}
                  <div style={{
                    display: "flex", gap: 8, alignItems: "center",
                    padding: "10px 14px",
                    background: EDITOR_SURFACE, border: `1px solid ${EDITOR_BORDER}`,
                    borderRadius: 8,
                  }}>
                    <input
                      type="color"
                      value={session.accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      style={{
                        width: 28, height: 28, borderRadius: 4,
                        border: "none", background: "none",
                        cursor: "pointer", padding: 0,
                      }}
                    />
                    <input
                      type="text"
                      value={customColor || session.accentColor}
                      onChange={e => {
                        setCustomColor(e.target.value)
                        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                          setAccentColor(e.target.value)
                        }
                      }}
                      placeholder="#FF3B00"
                      style={{
                        flex: 1, background: "none", border: "none", outline: "none",
                        fontFamily: EDITOR_MONO, fontSize: 12, color: EDITOR_INK,
                        letterSpacing: "0.06em",
                      }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: EDITOR_BORDER, marginBottom: 32 }} />

                {/* Template switcher */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{
                    fontFamily: EDITOR_MONO, fontSize: 9, color: EDITOR_MUTED,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
                  }}>
                    Template
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {TEMPLATE_OPTIONS.map(t => (
                      <div
                        key={t.id}
                        className={`editor-template-option ${session.templateId === t.id ? "active" : ""}`}
                        onClick={() => setTemplate(t.id)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{
                              fontSize: 13, fontWeight: 500,
                              color: session.templateId === t.id ? EDITOR_INK : EDITOR_MUTED,
                              marginBottom: 2, transition: "color 0.15s",
                            }}>
                              {t.name}
                            </div>
                            <div style={{ fontFamily: EDITOR_MONO, fontSize: 10, color: EDITOR_MUTED }}>
                              {t.for}
                            </div>
                          </div>
                          {session.templateId === t.id && (
                            <div style={{
                              width: 8, height: 8, borderRadius: "50%",
                              background: EDITOR_ACCENT,
                              boxShadow: `0 0 6px ${EDITOR_ACCENT}`,
                            }} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: EDITOR_BORDER, marginBottom: 32 }} />

                {/* Quick data stats */}
                <div>
                  <div style={{
                    fontFamily: EDITOR_MONO, fontSize: 9, color: EDITOR_MUTED,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
                  }}>
                    Portfolio Data
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {[
                      { label: "Projects",     value: session.portfolioData?.projects?.length || 0 },
                      { label: "Experience",   value: session.portfolioData?.experience?.length || 0 },
                      { label: "Skills",       value: session.portfolioData?.skills?.length || 0 },
                      { label: "Testimonials", value: session.portfolioData?.testimonials?.length || 0 },
                      { label: "Awards",       value: session.portfolioData?.awards?.length || 0 },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: "flex", justifyContent: "space-between",
                        padding: "10px 14px",
                        background: EDITOR_SURFACE,
                        borderRadius: i === 0 ? "6px 6px 0 0" : i === 4 ? "0 0 6px 6px" : 0,
                        borderBottom: i < 4 ? `1px solid ${EDITOR_BORDER}` : "none",
                      }}>
                        <span style={{ fontSize: 12, color: EDITOR_MUTED }}>{item.label}</span>
                        <span style={{
                          fontFamily: EDITOR_MONO, fontSize: 12, color: EDITOR_INK,
                          fontWeight: 500,
                        }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 10, padding: "10px 14px",
                    background: `${EDITOR_ACCENT}0D`,
                    border: `1px solid ${EDITOR_ACCENT}22`,
                    borderRadius: 6,
                    fontFamily: EDITOR_MONO, fontSize: 10,
                    color: EDITOR_MUTED, lineHeight: 1.6,
                  }}>
                    💬 You can add, remove, or edit any of these via chat — just tell me what you want to change.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
