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
  portfolioStatus: "draft" | "live"
}

// ── Design tokens (light theme) ───────────────────────────────────────────────
const BG        = "#FAF9F6"
const SURFACE   = "#FFFFFF"
const PANEL     = "#F5F5F4"
const BORDER    = "rgba(0,0,0,0.07)"
const BORDER2   = "rgba(0,0,0,0.12)"
const INK       = "#1C1917"
const INK2      = "#57534E"
const MUTED     = "rgba(28,25,23,0.42)"
const ACCENT    = "#EA580C"
const SUCCESS   = "#059669"
const MONO      = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace"
const SANS      = "'Plus Jakarta Sans', system-ui, sans-serif"

// ── Template registry ─────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: "template-axiom",       name: "Axiom",       accent: "#7C3AED" },
  { id: "template-depth",       name: "Depth",       accent: "#DC2626" },
  { id: "template-the-atlas",   name: "The Atlas",   accent: "#FF6B35" },
  { id: "template-pulse",       name: "Pulse",       accent: "#0EA5E9" },
  { id: "template-the-current", name: "The Current", accent: "#F59E0B" },
  { id: "template-canvas",      name: "Canvas",      accent: "#059669" },
  { id: "template-meridian",    name: "Meridian",    accent: "#10B981" },
  { id: "template-2",           name: "Editorial",   accent: "#E8380D" },
  { id: "template-3",           name: "Maker",       accent: "#3B82F6" },
  { id: "template-1",           name: "Classic",     accent: "#EA580C" },
]

// ── Accent color presets ───────────────────────────────────────────────────────
const ACCENT_PRESETS = [
  { name: "Flame",    value: "#EA580C" },
  { name: "Cobalt",   value: "#2563EB" },
  { name: "Violet",   value: "#7C3AED" },
  { name: "Emerald",  value: "#059669" },
  { name: "Gold",     value: "#D97706" },
  { name: "Rose",     value: "#E11D48" },
  { name: "Teal",     value: "#0D9488" },
  { name: "Slate",    value: "#475569" },
  { name: "Coral",    value: "#F43F5E" },
  { name: "Indigo",   value: "#4338CA" },
  { name: "Ink",      value: "#1C1917" },
  { name: "Warm",     value: "#B45309" },
]

// ── All 9 portfolio sections ───────────────────────────────────────────────────
const ALL_SECTIONS = [
  {
    key: "personal",
    label: "Header & Contact",
    icon: "👤",
    desc: "Name, title, email, phone, location, socials",
    isActive: (d: any) => !!d?.personal?.fullName,
    count: (_d: any) => null,
    addPrompt: "Update my header info: ",
  },
  {
    key: "bio",
    label: "Professional Summary",
    icon: "✍️",
    desc: "2–4 sentence professional bio",
    isActive: (d: any) => !!d?.personal?.bio?.trim(),
    count: (_d: any) => null,
    addPrompt: "Add a professional summary for me: I am a [your role] with experience in [key areas]. I specialize in [specialties].",
  },
  {
    key: "skills",
    label: "Skills",
    icon: "⚡",
    desc: "Grouped skills by category",
    isActive: (d: any) => (d?.skills?.length || 0) > 0,
    count: (d: any) => d?.skills?.length || 0,
    addPrompt: "Add my skills section. My skills include: [list your skills here, e.g. JavaScript, React, Node.js, Figma, etc.]",
  },
  {
    key: "experience",
    label: "Work Experience",
    icon: "💼",
    desc: "Job roles, companies, achievements",
    isActive: (d: any) => (d?.experience?.length || 0) > 0,
    count: (d: any) => d?.experience?.length || 0,
    addPrompt: "Add a work experience entry: Company name, my role, dates, and what I did there.",
  },
  {
    key: "projects",
    label: "Projects",
    icon: "🚀",
    desc: "Projects with tech stack and links",
    isActive: (d: any) => (d?.projects?.length || 0) > 0,
    count: (d: any) => d?.projects?.length || 0,
    addPrompt: "Add a project: Project name, what it does, tech stack used, and links if any.",
  },
  {
    key: "education",
    label: "Education",
    icon: "🎓",
    desc: "Degrees, institutions, dates",
    isActive: (d: any) => (d?.education?.length || 0) > 0,
    count: (d: any) => d?.education?.length || 0,
    addPrompt: "Add my education: Degree, institution, field of study, and years attended.",
  },
  {
    key: "certifications",
    label: "Certifications",
    icon: "🏅",
    desc: "Professional certifications",
    isActive: (d: any) => (d?.certifications?.length || 0) > 0,
    count: (d: any) => d?.certifications?.length || 0,
    addPrompt: "Add certifications: Name of certification, issuing organization, and date obtained.",
  },
  {
    key: "languages",
    label: "Languages",
    icon: "🌍",
    desc: "Spoken languages and proficiency",
    isActive: (d: any) => (d?.languages?.length || 0) > 0,
    count: (d: any) => d?.languages?.length || 0,
    addPrompt: "Add languages I speak: e.g. English (Native), Spanish (Conversational), French (Basic).",
  },
  {
    key: "interests",
    label: "Interests & Hobbies",
    icon: "🎯",
    desc: "Personal interests that add personality",
    isActive: (d: any) => (d?.interests?.length || 0) > 0,
    count: (d: any) => d?.interests?.length || 0,
    addPrompt: "Add my interests and hobbies: e.g. Photography, hiking, open-source contributions, cooking.",
  },
]

// ── Suggested prompts ──────────────────────────────────────────────────────────
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

// ── Utilities ─────────────────────────────────────────────────────────────────
function generateId() { return Math.random().toString(36).slice(2, 9) }

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000)
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  return `${Math.floor(s / 3600)}h ago`
}

// ── Main Editor Component ──────────────────────────────────────────────────────
export default function PortfolioEditor({ subdomain }: { subdomain: string }) {
  const [session,         setSession]         = useState<EditSession | null>(null)
  const [messages,        setMessages]        = useState<Message[]>([])
  const [input,           setInput]           = useState("")
  const [loading,         setLoading]         = useState(false)
  const [saving,          setSaving]          = useState(false)
  const [saved,           setSaved]           = useState(false)
  const [previewKey,      setPreviewKey]      = useState(0)
  const [activeTab,       setActiveTab]       = useState<"chat" | "style" | "sections">("chat")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [panelWidth,      setPanelWidth]      = useState(380)
  const [isDragging,      setIsDragging]      = useState(false)
  const [customColor,     setCustomColor]     = useState("")
  const [isMobile,        setIsMobile]        = useState(false)
  const [mobileTab,       setMobileTab]       = useState<"preview" | "edit">("edit")
  const [undoStack,       setUndoStack]       = useState<any[]>([])
  const [previewDevice,   setPreviewDevice]   = useState<"desktop" | "mobile">("desktop")
  const [sheetState,      setSheetState]      = useState<"collapsed" | "expanded">("collapsed")
  const [previewMode,     setPreviewMode]     = useState(false)
  const [publishModal,    setPublishModal]    = useState<null | "signup" | "payment">(null)
  const [publishEmail,    setPublishEmail]    = useState("")
  const [publishPassword, setPublishPassword] = useState("")
  const [publishLoading,  setPublishLoading]  = useState(false)
  const [publishError,    setPublishError]    = useState<string | null>(null)
  const [currentUser,     setCurrentUser]     = useState<any>(null)
  const sheetTouchStartY  = useRef(0)
  const sheetDragY        = useRef<number | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLTextAreaElement>(null)
  const supabase       = createClient()
  const router         = useRouter()

  // ── Load portfolio ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("subdomain", subdomain)
        .single()

      if (error || !data) { router.push("/dashboard"); return }

      setSession({
        subdomain: data.subdomain,
        portfolioData: data.portfolio_data,
        templateId: data.template_id || "template-1",
        accentColor: data.accent_color || "#EA580C",
        portfolioStatus: (data.status as "draft" | "live") || "draft",
      })
      supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user))
      setMessages([{
        id: generateId(),
        role: "assistant",
        content: "Your portfolio is loaded and ready to edit. Just tell me what you'd like to change — I can rewrite copy, add or remove sections, reorder projects, update your availability, or anything else. What would you like to improve first?",
        timestamp: new Date(),
      }])
    }
    load()
  }, [subdomain])

  // ── Scroll to latest message ────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ── Mobile detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // ── Panel resize ────────────────────────────────────────────────────────────
  const onDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    const startX = e.clientX
    const startW = panelWidth
    const onMove = (e: MouseEvent) => {
      const delta = startX - e.clientX
      setPanelWidth(Math.max(300, Math.min(580, startW + delta)))
    }
    const onUp = () => {
      setIsDragging(false)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [panelWidth])

  // ── Send message ────────────────────────────────────────────────────────────
  const send = useCallback(async (text?: string) => {
    const message = text || input.trim()
    if (!message || !session || loading) return

    setInput("")
    setShowSuggestions(false)

    const userMsg: Message = { id: generateId(), role: "user", content: message, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setUndoStack(prev => [...prev.slice(-9), session.portfolioData])

    try {
      const res = await fetch("/api/edit-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, portfolioData: session.portfolioData, subdomain: session.subdomain }),
      })
      if (!res.ok) throw new Error("API error")

      const { updatedData, summary, changesMade } = await res.json()
      setSession(prev => prev ? { ...prev, portfolioData: updatedData } : null)
      setPreviewKey(k => k + 1)
      setMessages(prev => [...prev, {
        id: generateId(), role: "assistant",
        content: summary, timestamp: new Date(), changesMade,
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: generateId(), role: "assistant",
        content: "Something went wrong. Please try again.",
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, session, loading])

  // ── Undo ────────────────────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setUndoStack(s => s.slice(0, -1))
    setSession(s => s ? { ...s, portfolioData: prev } : null)
    setPreviewKey(k => k + 1)
    setMessages(m => [...m, { id: generateId(), role: "system", content: "Last change undone.", timestamp: new Date() }])
  }, [undoStack])

  // ── Save ────────────────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    if (!session || saving) return
    setSaving(true)
    try {
      await supabase.from("portfolios").update({
        portfolio_data: session.portfolioData,
        template_id: session.templateId,
        accent_color: session.accentColor,
        updated_at: new Date().toISOString(),
      }).eq("subdomain", session.subdomain)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }, [session, saving])

  // ── Publish ─────────────────────────────────────────────────────────────────
  const handlePublish = useCallback(async () => {
    if (!session) return
    if (!currentUser) {
      setPublishModal("signup")
      return
    }
    if (session.portfolioStatus === "live") {
      await save()
      return
    }
    setPublishModal("payment")
  }, [session, currentUser, save])

  // ── Publish: signup step ──────────────────────────────────────────────────
  const handlePublishSignup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setPublishLoading(true)
    setPublishError(null)
    try {
      const { data, error } = await supabase.auth.signUp({ email: publishEmail, password: publishPassword })
      if (error) throw error
      const user = data.user
      if (user) {
        // Link this portfolio to the new user
        await fetch("/api/portfolios", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subdomain: session.subdomain, userId: user.id }),
        })
        setCurrentUser(user)
      }
      setPublishModal("payment")
    } catch (err: unknown) {
      setPublishError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setPublishLoading(false)
    }
  }, [publishEmail, publishPassword, session])

  // ── Publish: go live ──────────────────────────────────────────────────────
  const handleGoLive = useCallback(async () => {
    if (!session) return
    setPublishLoading(true)
    try {
      await save()
      await fetch("/api/portfolios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain: session.subdomain, status: "live" }),
      })
      setSession(s => s ? { ...s, portfolioStatus: "live" } : null)
      setPublishModal(null)
      router.push("/dashboard")
    } catch {
      setPublishError("Failed to publish. Please try again.")
    } finally {
      setPublishLoading(false)
    }
  }, [session, save])

  const setAccentColor = useCallback((color: string) => {
    setSession(s => s ? { ...s, accentColor: color } : null)
    setPreviewKey(k => k + 1)
  }, [])

  const setTemplate = useCallback((templateId: string) => {
    setSession(s => s ? { ...s, templateId } : null)
    setPreviewKey(k => k + 1)
  }, [])

  const addSection = useCallback((prompt: string) => {
    setActiveTab("chat")
    setInput(prompt)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }

  // ── Loading state ───────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, margin: "0 auto 20px",
            position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 0, border: "3px solid #FED7AA", borderRadius: "50%" }} />
            <div style={{
              position: "absolute", inset: 0,
              border: "3px solid transparent", borderTopColor: ACCENT,
              borderRadius: "50%", animation: "editor-spin 0.75s linear infinite",
            }} />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED, letterSpacing: "0.07em" }}>
            Loading portfolio...
          </div>
        </div>
        <style>{`@keyframes editor-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const previewUrl = `/p/${session.subdomain}?preview=true&accent=${encodeURIComponent(session.accentColor)}&template=${session.templateId}&ts=${previewKey}`

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: BG, color: INK, fontFamily: SANS, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes editor-spin   { to { transform: rotate(360deg); } }
        @keyframes editor-fadein { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes editor-pulse  { 0%,100%{opacity:0.45} 50%{opacity:1} }
        @keyframes editor-saved  { 0%{transform:scale(0.88);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
        @keyframes editor-dot    { 0%,100%{transform:scale(0.7);opacity:0.3} 50%{transform:scale(1.1);opacity:1} }
        @keyframes editor-glow   { 0%,100%{box-shadow:0 0 0 0 rgba(5,150,105,0)} 50%{box-shadow:0 0 0 5px rgba(5,150,105,0)} }

        .editor-scrollbar::-webkit-scrollbar       { width: 4px; }
        .editor-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .editor-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }
        .editor-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }

        .editor-input {
          width: 100%; background: transparent; border: none; outline: none;
          font-family: ${SANS}; font-size: 14px; color: ${INK};
          resize: none; line-height: 1.6;
        }
        .editor-input::placeholder { color: ${MUTED}; }

        .editor-suggestion {
          font-family: ${SANS}; font-size: 12px; color: ${INK2};
          background: ${SURFACE}; border: 1px solid rgba(0,0,0,0.08);
          padding: 8px 14px; border-radius: 8px; cursor: pointer;
          text-align: left; transition: all 0.15s ease;
          line-height: 1.4; white-space: nowrap;
        }
        .editor-suggestion:hover {
          color: ${INK}; border-color: rgba(0,0,0,0.16);
          background: #F5F5F4; transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(0,0,0,0.07);
        }

        .editor-tab {
          font-family: ${SANS}; font-size: 13px; font-weight: 600;
          color: ${MUTED}; background: none; border: none;
          padding: 10px 18px; cursor: pointer; position: relative;
          transition: color 0.2s; letter-spacing: -0.01em;
        }
        .editor-tab.active { color: ${INK}; }
        .editor-tab.active::after {
          content: ''; position: absolute; bottom: 0; left: 18px; right: 18px;
          height: 2px; background: ${ACCENT}; border-radius: 1px;
        }

        .editor-color-swatch {
          width: 30px; height: 30px; border-radius: 8px; cursor: pointer;
          border: 2px solid transparent; transition: all 0.15s ease;
          position: relative;
        }
        .editor-color-swatch:hover { transform: scale(1.12); box-shadow: 0 3px 10px rgba(0,0,0,0.15); }
        .editor-color-swatch.active {
          border-color: ${INK};
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
        }

        .editor-template-option {
          padding: 12px 16px; border: 1.5px solid rgba(0,0,0,0.07);
          border-radius: 11px; cursor: pointer;
          transition: all 0.18s ease;
          background: ${SURFACE};
        }
        .editor-template-option:hover { border-color: rgba(0,0,0,0.15); background: #FAFAF7; }
        .editor-template-option.active {
          border-color: ${ACCENT};
          background: #FFF7ED;
        }

        .editor-send-btn {
          width: 36px; height: 36px; border-radius: 9px;
          background: ${ACCENT}; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(234,88,12,0.28);
        }
        .editor-send-btn:hover:not(:disabled) {
          background: #DC4B08;
          transform: scale(1.06);
          box-shadow: 0 4px 16px rgba(234,88,12,0.4);
        }
        .editor-send-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }

        .editor-nav-btn {
          font-family: ${SANS}; font-size: 12px; font-weight: 600;
          color: ${INK2}; background: ${SURFACE};
          border: 1px solid rgba(0,0,0,0.1); padding: 7px 14px;
          border-radius: 8px; cursor: pointer; transition: all 0.15s ease;
          white-space: nowrap; letter-spacing: -0.01em;
        }
        .editor-nav-btn:hover { color: ${INK}; border-color: rgba(0,0,0,0.18); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .editor-nav-btn.primary {
          color: #fff; background: ${ACCENT};
          border-color: ${ACCENT};
          box-shadow: 0 2px 10px rgba(234,88,12,0.25);
        }
        .editor-nav-btn.primary:hover { background: #DC4B08; box-shadow: 0 4px 14px rgba(234,88,12,0.38); }
        .editor-nav-btn.saved {
          color: ${SUCCESS}; border-color: rgba(5,150,105,0.3);
          background: #ECFDF5;
          animation: editor-saved 0.3s ease;
        }

        .editor-msg { animation: editor-fadein 0.3s ease; }

        .editor-mobile-tab {
          flex: 1; padding: 11px; font-size: 13px; font-weight: 600;
          background: none; border: none; cursor: pointer; transition: all 0.2s;
          font-family: ${SANS}; letter-spacing: -0.01em;
        }

        @media (max-width: 768px) {
          .editor-resize-handle { display: none !important; }
        }

        @keyframes editorPreviewBarIn {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes editorModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ── Template switcher cards ── */
        .editor-tpl-card {
          padding: 10px 12px 10px 14px;
          border: 1.5px solid rgba(0,0,0,0.07);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.18s ease;
          background: ${SURFACE};
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }
        .editor-tpl-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          border-radius: 10px 0 0 10px;
          background: var(--tpl-accent, #888);
        }
        .editor-tpl-card:hover { border-color: rgba(0,0,0,0.15); background: #FAFAF7; }
        .editor-tpl-card.active {
          border-color: ${ACCENT};
          background: #FFF7ED;
          box-shadow: 0 2px 10px rgba(234,88,12,0.1);
        }

        /* ── Device toggle buttons ── */
        .editor-device-btn {
          padding: 4px 10px;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 6px;
          background: none;
          cursor: pointer;
          font-family: ${SANS};
          font-size: 11px;
          font-weight: 600;
          color: ${MUTED};
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .editor-device-btn:hover { color: ${INK2}; border-color: rgba(0,0,0,0.2); }
        .editor-device-btn.active {
          background: ${INK};
          border-color: ${INK};
          color: #fff;
        }

        /* ── Mobile bottom sheet ── */
        .editor-sheet {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 50;
          background: ${SURFACE};
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -4px 32px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
          touch-action: none;
        }
        .editor-sheet-handle {
          height: 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
          border-bottom: 1px solid ${BORDER};
          padding: 0 20px;
          position: relative;
          user-select: none;
        }
        .editor-sheet-pill {
          width: 36px; height: 4px;
          background: rgba(0,0,0,0.18);
          border-radius: 2px;
          position: absolute;
          top: 10px;
        }
        .editor-sheet-body {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
      `}</style>

      {/* ── TOP NAV ── */}
      <div style={{
        height: previewMode ? 0 : 52,
        overflow: "hidden",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: previewMode ? "0 16px" : "0 16px",
        borderBottom: `1px solid ${BORDER}`,
        background: SURFACE, flexShrink: 0,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "height 0.42s cubic-bezier(0.32, 0.72, 0, 1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="editor-nav-btn" onClick={() => router.push("/dashboard")} style={{ padding: "6px 11px", fontSize: 14 }}>
            ←
          </button>
          <div style={{ width: 1, height: 22, background: BORDER }} />
          {/* Logo mark */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: "linear-gradient(135deg, #EA580C, #F97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ width: 1, height: 18, background: BORDER }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%", background: SUCCESS,
                animation: "editor-pulse 2.5s ease-in-out infinite",
                boxShadow: `0 0 0 0 ${SUCCESS}`,
              }} />
              <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED, letterSpacing: "0.05em" }}>
                {session.subdomain}
              </span>
            </div>
          </div>
        </div>

        <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>
          Portfolio Editor
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {undoStack.length > 0 && (
            <button className="editor-nav-btn" onClick={undo} title="Undo last change">
              ↩ Undo
            </button>
          )}
          <button
            className="editor-nav-btn"
            onClick={() => setPreviewMode(true)}
            title="Enter full-screen preview"
          >
            Preview
          </button>
          <button
            className={`editor-nav-btn primary ${saved ? "saved" : ""}`}
            onClick={handlePublish}
            disabled={saving || publishLoading}
            style={session.portfolioStatus === "live" ? { background: "#059669", borderColor: "#059669" } : {}}
          >
            {saving || publishLoading ? "…" :
             saved && session.portfolioStatus === "live" ? "✓ Saved" :
             session.portfolioStatus === "live" ? "Go Live ↗" :
             "Publish →"}
          </button>
        </div>
      </div>

      {/* Mobile tab bar removed — replaced by bottom sheet */}

      {/* ── MAIN LAYOUT ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* ── LEFT: PREVIEW ── */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#E7E5E4" }}>

          {/* ── Preview mode exit bar ── */}
          {previewMode && (
            <div style={{
              position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
              height: 52, background: "rgba(28,25,23,0.92)", backdropFilter: "blur(14px)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 20px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              animation: "editorPreviewBarIn 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
            }}>
              <button
                onClick={() => setPreviewMode(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.16)",
                  borderRadius: 8, padding: "7px 14px",
                  color: "#FAF9F6", fontFamily: SANS, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s", letterSpacing: "-0.01em",
                }}
              >
                ← Exit Preview
              </button>
              <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.36)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Preview Mode
              </span>
              <a
                href={`/p/${session.subdomain}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  border: "1px solid rgba(255,255,255,0.16)",
                  borderRadius: 8, padding: "7px 14px",
                  color: "rgba(255,255,255,0.6)", fontFamily: SANS, fontSize: 12, fontWeight: 600,
                  textDecoration: "none", transition: "all 0.2s", letterSpacing: "-0.01em",
                }}
              >
                Open tab ↗
              </a>
            </div>
          )}
          {/* Browser chrome bar */}
          <div style={{
            height: previewMode ? 0 : 38,
            overflow: "hidden",
            background: SURFACE,
            borderBottom: `1px solid ${BORDER}`,
            display: "flex", alignItems: "center", padding: "0 14px",
            gap: 8, flexShrink: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            transition: "height 0.42s cubic-bezier(0.32, 0.72, 0, 1)",
          }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
            {/* URL bar */}
            <div style={{
              flex: 1, background: PANEL, border: `1px solid ${BORDER}`,
              borderRadius: 7, height: 22,
              display: "flex", alignItems: "center", padding: "0 10px",
              margin: "0 10px",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6, flexShrink: 0 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: "0.02em" }}>
                {session.subdomain}.portfolioai.co
              </span>
            </div>
            {/* ── Device toggle + LIVE indicator ── */}
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  className={`editor-device-btn ${previewDevice === "desktop" ? "active" : ""}`}
                  onClick={() => setPreviewDevice("desktop")}
                  title="Desktop view"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  className={`editor-device-btn ${previewDevice === "mobile" ? "active" : ""}`}
                  onClick={() => setPreviewDevice("mobile")}
                  title="Mobile view"
                >
                  <svg width="9" height="11" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                  </svg>
                </button>
                <div style={{ width: 1, height: 14, background: BORDER, margin: "0 2px" }} />
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: SUCCESS }} />
                <span style={{ fontFamily: MONO, fontSize: 9, color: MUTED, letterSpacing: "0.08em" }}>LIVE</span>
              </div>
            )}
            {isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: SUCCESS }} />
                <span style={{ fontFamily: MONO, fontSize: 9, color: MUTED, letterSpacing: "0.08em" }}>LIVE</span>
              </div>
            )}
          </div>

          {/* iframe wrapper — desktop/mobile device frame */}
          <div style={{
            width: "100%",
            height: "calc(100% - 38px)",
            display: "flex",
            alignItems: previewDevice === "mobile" ? "flex-start" : "stretch",
            justifyContent: "center",
            overflow: "hidden",
            background: "#E7E5E4",
          }}>
            {previewDevice === "mobile" ? (
              <div style={{
                width: 390,
                height: "100%",
                borderRadius: "36px 36px 0 0",
                overflow: "hidden",
                boxShadow: "0 0 0 12px #1C1917, 0 0 0 14px #333, 0 20px 60px rgba(0,0,0,0.4)",
                margin: "16px auto 0",
                flexShrink: 0,
                position: "relative",
              }}>
                <iframe
                  key={previewKey}
                  src={previewUrl}
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  title="Portfolio Preview (Mobile)"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            ) : (
              <iframe
                key={previewKey}
                src={previewUrl}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                title="Portfolio Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            )}
          </div>

          {/* Loading overlay on preview */}
          {loading && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(250,249,246,0.65)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(3px)",
              pointerEvents: "none",
            }}>
              <div style={{
                background: SURFACE, border: `1px solid ${BORDER}`,
                borderRadius: 12, padding: "16px 24px",
                display: "flex", alignItems: "center", gap: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}>
                <div style={{
                  width: 16, height: 16, border: `2.5px solid #FED7AA`,
                  borderTopColor: ACCENT, borderRadius: "50%",
                  animation: "editor-spin 0.7s linear infinite",
                }} />
                <span style={{ fontFamily: SANS, fontSize: 13, color: INK2, fontWeight: 500 }}>
                  Applying changes…
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── RESIZE HANDLE ── */}
        {!isMobile && !previewMode && (
          <div
            className="editor-resize-handle"
            onMouseDown={onDragStart}
            style={{
              width: 5, cursor: "col-resize", flexShrink: 0,
              background: isDragging ? ACCENT : BORDER,
              transition: "background 0.2s ease",
              position: "relative", zIndex: 10,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = BORDER2)}
            onMouseLeave={e => { if (!isDragging) e.currentTarget.style.background = BORDER }}
          />
        )}

        {/* ── RIGHT: EDITOR PANEL (desktop only) ── */}
        {!isMobile && (
          <div style={{
            width: previewMode ? 0 : panelWidth,
            flexShrink: 0, display: "flex", flexDirection: "column",
            background: PANEL, borderLeft: previewMode ? "none" : `1px solid ${BORDER}`,
            overflow: "hidden",
            transition: "width 0.42s cubic-bezier(0.32, 0.72, 0, 1), border 0.42s ease",
          }}>

            {/* Tab bar */}
            <div style={{
              display: "flex", borderBottom: `1px solid ${BORDER}`,
              padding: "0 4px", flexShrink: 0, background: SURFACE,
            }}>
              <button className={`editor-tab ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
                Chat
              </button>
              <button className={`editor-tab ${activeTab === "sections" ? "active" : ""}`} onClick={() => setActiveTab("sections")}>
                Sections
              </button>
              <button className={`editor-tab ${activeTab === "style" ? "active" : ""}`} onClick={() => setActiveTab("style")}>
                Style
              </button>
            </div>

            {/* ── CHAT TAB ── */}
            {activeTab === "chat" && (
              <>
                <div className="editor-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="editor-msg"
                      style={{
                        marginBottom: 18,
                        display: "flex", flexDirection: "column",
                        alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      {msg.role === "system" ? (
                        <div style={{
                          alignSelf: "center",
                          fontFamily: MONO, fontSize: 10, color: MUTED,
                          letterSpacing: "0.05em", padding: "4px 12px",
                          background: "#E7E5E4", borderRadius: 5,
                        }}>
                          {msg.content}
                        </div>
                      ) : (
                        <>
                          {/* Avatar + bubble */}
                          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                            {msg.role === "assistant" && (
                              <div style={{
                                width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                                background: "linear-gradient(135deg, #EA580C, #F97316)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: 2,
                              }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                                </svg>
                              </div>
                            )}
                            <div style={{
                              maxWidth: "78%",
                              padding: "10px 14px",
                              borderRadius: msg.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                              background: msg.role === "user" ? ACCENT : SURFACE,
                              border: msg.role === "assistant" ? `1px solid ${BORDER}` : "none",
                              fontSize: 13, lineHeight: 1.68,
                              color: msg.role === "user" ? "#fff" : INK,
                              boxShadow: msg.role === "user"
                                ? "0 2px 10px rgba(234,88,12,0.22)"
                                : "0 1px 4px rgba(0,0,0,0.05)",
                            }}>
                              {msg.content}
                            </div>
                          </div>

                          {/* Change tags */}
                          {msg.changesMade && msg.changesMade.length > 0 && (
                            <div style={{
                              display: "flex", flexWrap: "wrap", gap: 5,
                              marginTop: 7, maxWidth: "82%",
                              marginLeft: msg.role === "assistant" ? 32 : 0,
                            }}>
                              {msg.changesMade.map((change, i) => (
                                <div key={i} style={{
                                  fontFamily: SANS, fontSize: 10, fontWeight: 600,
                                  color: SUCCESS,
                                  background: "#ECFDF5",
                                  border: "1px solid #A7F3D0",
                                  padding: "3px 9px", borderRadius: 5,
                                  letterSpacing: "-0.01em",
                                }}>
                                  ✓ {change}
                                </div>
                              ))}
                            </div>
                          )}

                          <div style={{
                            marginTop: 5, fontFamily: MONO, fontSize: 9,
                            color: MUTED, letterSpacing: "0.04em",
                            marginLeft: msg.role === "assistant" ? 32 : 0,
                          }}>
                            {timeAgo(msg.timestamp)}
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="editor-msg" style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                        background: "linear-gradient(135deg, #EA580C, #F97316)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div style={{
                        display: "flex", gap: 5, padding: "11px 14px",
                        background: SURFACE, border: `1px solid ${BORDER}`,
                        borderRadius: "14px 14px 14px 3px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                      }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: "#A8A29E",
                            animation: `editor-dot 1.3s ease-in-out ${i * 0.22}s infinite`,
                          }} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestion chips */}
                {showSuggestions && (
                  <div style={{
                    padding: "10px 14px 10px",
                    borderTop: `1px solid ${BORDER}`,
                    background: SURFACE,
                  }}>
                    <div style={{
                      fontFamily: MONO, fontSize: 9, color: MUTED,
                      letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8,
                    }}>
                      Try asking
                    </div>
                    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
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
                  padding: "12px 14px",
                  borderTop: `1px solid ${BORDER}`,
                  background: SURFACE, flexShrink: 0,
                }}>
                  <div style={{
                    display: "flex", gap: 10, alignItems: "flex-end",
                    background: "#FAF9F6",
                    border: `1.5px solid ${BORDER2}`,
                    borderRadius: 12, padding: "10px 12px",
                    transition: "border-color 0.2s ease",
                  }}>
                    <textarea
                      ref={inputRef}
                      className="editor-input"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Tell me what to change…"
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
                          border: "2px solid rgba(255,255,255,0.45)",
                          borderTopColor: "#fff", borderRadius: "50%",
                          animation: "editor-spin 0.7s linear infinite",
                        }} />
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div style={{
                    marginTop: 6, fontFamily: MONO, fontSize: 9, color: MUTED,
                    letterSpacing: "0.06em", display: "flex", justifyContent: "space-between",
                  }}>
                    <span>Enter to send · Shift+Enter for new line</span>
                    {undoStack.length > 0 && (
                      <button onClick={undo} style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: MONO, fontSize: 9, color: MUTED, letterSpacing: "0.06em",
                      }}>
                        ↩ undo ({undoStack.length})
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── SECTIONS TAB ── */}
            {activeTab === "sections" && (
              <div className="editor-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
                  Portfolio Sections
                </div>
                <div style={{ fontSize: 12, color: INK2, lineHeight: 1.55, marginBottom: 20, padding: "10px 12px", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8 }}>
                  Sections with data from your resume are shown automatically. Add missing sections below.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ALL_SECTIONS.map((sec) => {
                    const active = sec.isActive(session.portfolioData)
                    const count  = sec.count(session.portfolioData)
                    return (
                      <div key={sec.key} style={{
                        padding: "12px 14px",
                        background: SURFACE,
                        border: `1.5px solid ${active ? "rgba(5,150,105,0.25)" : BORDER}`,
                        borderRadius: 10,
                        display: "flex", alignItems: "center", gap: 12,
                        transition: "all 0.2s",
                        opacity: active ? 1 : 0.7,
                      }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{sec.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13, fontWeight: 700,
                            color: active ? INK : INK2,
                            letterSpacing: "-0.01em",
                            display: "flex", alignItems: "center", gap: 7,
                          }}>
                            {sec.label}
                            {active && count !== null && (
                              <span style={{
                                fontSize: 10, fontWeight: 600,
                                color: SUCCESS,
                                background: "#ECFDF5",
                                border: "1px solid #A7F3D0",
                                padding: "1px 7px", borderRadius: 20,
                                letterSpacing: 0,
                              }}>{count}</span>
                            )}
                          </div>
                          <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{sec.desc}</div>
                        </div>
                        {active ? (
                          <div style={{
                            width: 20, height: 20, borderRadius: "50%",
                            background: SUCCESS, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                              <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        ) : (
                          <button
                            onClick={() => addSection(sec.addPrompt)}
                            style={{
                              flexShrink: 0, padding: "5px 11px",
                              background: ACCENT, color: "#fff",
                              border: "none", borderRadius: 7,
                              fontSize: 11, fontWeight: 700,
                              cursor: "pointer", letterSpacing: "-0.01em",
                              transition: "all 0.15s",
                              fontFamily: SANS,
                              boxShadow: "0 2px 8px rgba(234,88,12,0.25)",
                            }}
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── STYLE TAB ── */}
            {activeTab === "style" && (
              <div className="editor-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>

                {/* Accent color */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, color: MUTED,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14,
                  }}>
                    Accent Color
                  </div>

                  {/* Current color preview */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px",
                    background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 10, marginBottom: 14,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9,
                      background: session.accentColor, flexShrink: 0,
                      boxShadow: `0 3px 10px ${session.accentColor}40`,
                    }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 2, letterSpacing: "-0.01em" }}>
                        {ACCENT_PRESETS.find(p => p.value === session.accentColor)?.name || "Custom"}
                      </div>
                      <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
                        {session.accentColor.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Swatches grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 14 }}>
                    {ACCENT_PRESETS.map((preset) => (
                      <div key={preset.value} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <div
                          className={`editor-color-swatch ${session.accentColor === preset.value ? "active" : ""}`}
                          style={{ background: preset.value }}
                          onClick={() => setAccentColor(preset.value)}
                          title={preset.name}
                        />
                        <div style={{ fontFamily: MONO, fontSize: 8, color: MUTED, letterSpacing: "0.03em" }}>
                          {preset.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom hex input */}
                  <div style={{
                    display: "flex", gap: 10, alignItems: "center",
                    padding: "10px 14px",
                    background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                  }}>
                    <input
                      type="color"
                      value={session.accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      style={{
                        width: 28, height: 28, borderRadius: 6,
                        border: "none", background: "none",
                        cursor: "pointer", padding: 0, flexShrink: 0,
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
                      placeholder="#EA580C"
                      style={{
                        flex: 1, background: "none", border: "none", outline: "none",
                        fontFamily: MONO, fontSize: 12, color: INK,
                        letterSpacing: "0.04em",
                      }}
                    />
                  </div>
                </div>

                <div style={{ height: 1, background: BORDER, marginBottom: 28 }} />

                {/* Template switcher */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, color: MUTED,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span>Template</span>
                    <span style={{ fontSize: 8, color: MUTED }}>
                      {TEMPLATES.find(t => t.id === session.templateId)?.name || session.templateId}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {TEMPLATES.map(tpl => {
                      const isActive = session.templateId === tpl.id
                      return (
                        <div
                          key={tpl.id}
                          className={`editor-tpl-card ${isActive ? "active" : ""}`}
                          style={{ "--tpl-accent": tpl.accent } as React.CSSProperties}
                          onClick={() => setTemplate(tpl.id)}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 12, fontWeight: 700,
                              color: isActive ? INK : INK2,
                              letterSpacing: "-0.01em",
                            }}>
                              {tpl.name}
                            </div>
                          </div>
                          {isActive && (
                            <div style={{
                              width: 16, height: 16, borderRadius: "50%",
                              background: ACCENT, flexShrink: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                                <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                          {!isActive && (
                            <div style={{
                              width: 10, height: 10, borderRadius: "50%",
                              background: tpl.accent, flexShrink: 0,
                              opacity: 0.7,
                            }} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div style={{ height: 1, background: BORDER, marginBottom: 28 }} />

                {/* Portfolio summary stats */}
                <div>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, color: MUTED,
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14,
                  }}>
                    Content Summary
                  </div>
                  <div style={{
                    background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 10, overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}>
                    {[
                      { label: "Experience roles", value: session.portfolioData?.experience?.length || 0 },
                      { label: "Projects",         value: session.portfolioData?.projects?.length || 0 },
                      { label: "Skills",           value: session.portfolioData?.skills?.length || 0 },
                      { label: "Education",        value: session.portfolioData?.education?.length || 0 },
                      { label: "Certifications",   value: session.portfolioData?.certifications?.length || 0 },
                      { label: "Languages",        value: session.portfolioData?.languages?.length || 0 },
                    ].map((item, i, arr) => (
                      <div key={i} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "11px 14px",
                        borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
                      }}>
                        <span style={{ fontSize: 12, color: INK2, fontWeight: 500 }}>{item.label}</span>
                        <span style={{
                          fontFamily: MONO, fontSize: 13,
                          color: item.value > 0 ? INK : MUTED,
                          fontWeight: 700, letterSpacing: "-0.02em",
                        }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MOBILE BOTTOM SHEET ── */}
        {isMobile && (() => {
          const COLLAPSED_H = 72
          const EXPANDED_H  = Math.round(window?.innerHeight * 0.88) || 600
          const isExpanded  = sheetState === "expanded"

          const onTouchStart = (e: React.TouchEvent) => {
            sheetTouchStartY.current = e.touches[0].clientY
            sheetDragY.current = null
          }

          const onTouchMove = (e: React.TouchEvent) => {
            const deltaY = e.touches[0].clientY - sheetTouchStartY.current
            sheetDragY.current = deltaY
          }

          const onTouchEnd = () => {
            const delta = sheetDragY.current ?? 0
            if (!isExpanded && delta < -50) setSheetState("expanded")
            else if (isExpanded && delta > 80)  setSheetState("collapsed")
            sheetDragY.current = null
          }

          const currentTpl = TEMPLATES.find(t => t.id === session.templateId)

          return (
            <div
              className="editor-sheet"
              style={{
                height: isExpanded ? EXPANDED_H : COLLAPSED_H,
                transform: "translateY(0)",
              }}
            >
              {/* Handle bar */}
              <div
                className="editor-sheet-handle"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onClick={() => setSheetState(isExpanded ? "collapsed" : "expanded")}
              >
                <div className="editor-sheet-pill" />
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", marginTop: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>
                      Edit Portfolio
                    </span>
                    {currentTpl && (
                      <span style={{
                        fontFamily: MONO, fontSize: 9, color: INK2,
                        background: PANEL, border: `1px solid ${BORDER}`,
                        padding: "2px 8px", borderRadius: 5,
                        letterSpacing: "0.02em",
                      }}>
                        {currentTpl.name}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 12, height: 12, borderRadius: "50%",
                      background: session.accentColor,
                      border: `2px solid rgba(0,0,0,0.1)`,
                    }} />
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      style={{
                        color: INK2,
                        transform: isExpanded ? "rotate(180deg)" : "none",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sheet body — editor panel content */}
              {isExpanded && (
                <div className="editor-sheet-body">
                  {/* Tab bar */}
                  <div style={{
                    display: "flex", borderBottom: `1px solid ${BORDER}`,
                    padding: "0 4px", flexShrink: 0, background: SURFACE,
                  }}>
                    <button className={`editor-tab ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
                      Chat
                    </button>
                    <button className={`editor-tab ${activeTab === "sections" ? "active" : ""}`} onClick={() => setActiveTab("sections")}>
                      Sections
                    </button>
                    <button className={`editor-tab ${activeTab === "style" ? "active" : ""}`} onClick={() => setActiveTab("style")}>
                      Style
                    </button>
                  </div>

                  {/* Tab content — reuse same content as desktop */}
                  <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", background: PANEL }}>
                    {activeTab === "chat" && (
                      <>
                        <div className="editor-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className="editor-msg"
                              style={{
                                marginBottom: 18,
                                display: "flex", flexDirection: "column",
                                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                              }}
                            >
                              {msg.role === "system" ? (
                                <div style={{ alignSelf: "center", fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: "0.05em", padding: "4px 12px", background: "#E7E5E4", borderRadius: 5 }}>
                                  {msg.content}
                                </div>
                              ) : (
                                <>
                                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                                    {msg.role === "assistant" && (
                                      <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, background: "linear-gradient(135deg, #EA580C, #F97316)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                                        </svg>
                                      </div>
                                    )}
                                    <div style={{
                                      maxWidth: "78%", padding: "10px 14px",
                                      borderRadius: msg.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                                      background: msg.role === "user" ? ACCENT : SURFACE,
                                      border: msg.role === "assistant" ? `1px solid ${BORDER}` : "none",
                                      fontSize: 13, lineHeight: 1.68,
                                      color: msg.role === "user" ? "#fff" : INK,
                                    }}>
                                      {msg.content}
                                    </div>
                                  </div>
                                  {msg.changesMade && msg.changesMade.length > 0 && (
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7, maxWidth: "82%", marginLeft: msg.role === "assistant" ? 32 : 0 }}>
                                      {msg.changesMade.map((change, i) => (
                                        <div key={i} style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: SUCCESS, background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "3px 9px", borderRadius: 5 }}>
                                          ✓ {change}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                          {loading && (
                            <div className="editor-msg" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 24, height: 24, borderRadius: 7, background: "linear-gradient(135deg, #EA580C, #F97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                                </svg>
                              </div>
                              <div style={{ display: "flex", gap: 5, padding: "11px 14px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "14px 14px 14px 3px" }}>
                                {[0,1,2].map(i => (
                                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#A8A29E", animation: `editor-dot 1.3s ease-in-out ${i * 0.22}s infinite` }} />
                                ))}
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                        <div style={{ padding: "12px 14px", borderTop: `1px solid ${BORDER}`, background: SURFACE, flexShrink: 0 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "#FAF9F6", border: `1.5px solid ${BORDER2}`, borderRadius: 12, padding: "10px 12px" }}>
                            <textarea
                              ref={inputRef}
                              className="editor-input"
                              value={input}
                              onChange={e => setInput(e.target.value)}
                              onKeyDown={onKeyDown}
                              placeholder="Tell me what to change…"
                              rows={1}
                              style={{ maxHeight: 120, overflowY: input.split("\n").length > 4 ? "auto" : "hidden" }}
                              onInput={e => {
                                const t = e.target as HTMLTextAreaElement
                                t.style.height = "auto"
                                t.style.height = Math.min(t.scrollHeight, 120) + "px"
                              }}
                            />
                            <button className="editor-send-btn" onClick={() => send()} disabled={loading || !input.trim()}>
                              {loading ? (
                                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.45)", borderTopColor: "#fff", borderRadius: "50%", animation: "editor-spin 0.7s linear infinite" }} />
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {activeTab === "sections" && (
                      <div className="editor-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                        <div style={{ fontSize: 12, color: INK2, lineHeight: 1.55, marginBottom: 16, padding: "10px 12px", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8 }}>
                          Sections with data from your resume are shown automatically.
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {ALL_SECTIONS.map((sec) => {
                            const active = sec.isActive(session.portfolioData)
                            const count  = sec.count(session.portfolioData)
                            return (
                              <div key={sec.key} style={{ padding: "12px 14px", background: SURFACE, border: `1.5px solid ${active ? "rgba(5,150,105,0.25)" : BORDER}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 18, flexShrink: 0 }}>{sec.icon}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: active ? INK : INK2, display: "flex", alignItems: "center", gap: 7 }}>
                                    {sec.label}
                                    {active && count !== null && (
                                      <span style={{ fontSize: 10, fontWeight: 600, color: SUCCESS, background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "1px 7px", borderRadius: 20 }}>{count}</span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{sec.desc}</div>
                                </div>
                                {active ? (
                                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: SUCCESS, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                      <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </div>
                                ) : (
                                  <button onClick={() => addSection(sec.addPrompt)} style={{ flexShrink: 0, padding: "5px 11px", background: ACCENT, color: "#fff", border: "none", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: SANS }}>
                                    + Add
                                  </button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {activeTab === "style" && (
                      <div className="editor-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
                        {/* Template switcher — mobile sheet */}
                        <div style={{ marginBottom: 24 }}>
                          <div style={{ fontFamily: MONO, fontSize: 9, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Template</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                            {TEMPLATES.map(tpl => {
                              const isActive = session.templateId === tpl.id
                              return (
                                <div
                                  key={tpl.id}
                                  className={`editor-tpl-card ${isActive ? "active" : ""}`}
                                  style={{ "--tpl-accent": tpl.accent } as React.CSSProperties}
                                  onClick={() => setTemplate(tpl.id)}
                                >
                                  <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: isActive ? INK : INK2 }}>{tpl.name}</div>
                                  {isActive && (
                                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div style={{ height: 1, background: BORDER, marginBottom: 20 }} />
                        {/* Accent color — mobile */}
                        <div>
                          <div style={{ fontFamily: MONO, fontSize: 9, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Accent Color</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
                            {ACCENT_PRESETS.map((preset) => (
                              <div key={preset.value} className={`editor-color-swatch ${session.accentColor === preset.value ? "active" : ""}`} style={{ background: preset.value }} onClick={() => setAccentColor(preset.value)} title={preset.name} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })()}
      </div>

    {/* ── PUBLISH MODAL ── */}
    {publishModal && (
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.54)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}
        onClick={e => { if (e.target === e.currentTarget) setPublishModal(null) }}
      >
        <div style={{
          background: "#fff", borderRadius: 20, padding: "36px 32px",
          width: "100%", maxWidth: 420,
          boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
          animation: "editorModalIn 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
        }}>

          {/* ── STEP 1: Sign up ── */}
          {publishModal === "signup" && (
            <>
              <div style={{ marginBottom: 22 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, #EA580C, #F97316)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16, boxShadow: "0 4px 14px rgba(234,88,12,0.3)",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.025em", marginBottom: 6 }}>
                  Create your account
                </h2>
                <p style={{ fontSize: 13, color: "#78716C", lineHeight: 1.65 }}>
                  Sign up to save and publish your portfolio. Takes 10 seconds.
                </p>
              </div>

              <form onSubmit={handlePublishSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="email" required placeholder="your@email.com"
                  value={publishEmail} onChange={e => setPublishEmail(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px",
                    border: "1.5px solid #E7E5E4", borderRadius: 10,
                    fontSize: 14, fontFamily: SANS, fontWeight: 500,
                    color: "#1C1917", background: "#FAFAF8", outline: "none",
                  }}
                />
                <input
                  type="password" required minLength={6} placeholder="Password (6+ characters)"
                  value={publishPassword} onChange={e => setPublishPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px",
                    border: "1.5px solid #E7E5E4", borderRadius: 10,
                    fontSize: 14, fontFamily: SANS, fontWeight: 500,
                    color: "#1C1917", background: "#FAFAF8", outline: "none",
                  }}
                />
                {publishError && (
                  <div style={{ padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, fontSize: 12, color: "#B91C1C" }}>
                    {publishError}
                  </div>
                )}
                <button type="submit" disabled={publishLoading} style={{
                  padding: "13px", borderRadius: 11, border: "none",
                  background: "#1C1917", color: "#FAF9F6",
                  fontSize: 14, fontWeight: 700, fontFamily: SANS,
                  cursor: publishLoading ? "not-allowed" : "pointer",
                  opacity: publishLoading ? 0.6 : 1, letterSpacing: "-0.01em", marginTop: 4,
                }}>
                  {publishLoading ? "Creating account…" : "Create account →"}
                </button>
                <p style={{ fontSize: 12, color: "#A8A29E", textAlign: "center", marginTop: 4 }}>
                  Already have an account?{" "}
                  <a href="/login" style={{ color: "#EA580C", fontWeight: 700, textDecoration: "none" }}>Log in</a>
                </p>
              </form>
            </>
          )}

          {/* ── STEP 2: Payment placeholder ── */}
          {publishModal === "payment" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "#003087",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16, boxShadow: "0 4px 14px rgba(0,48,135,0.25)",
                }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                    <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H8.86a.483.483 0 0 1-.477-.558L9.936 11h2.543c4.577 0 7.8-1.967 8.518-6.108a5.29 5.29 0 0 1 1.07 3.586z"/>
                  </svg>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.025em", marginBottom: 6 }}>
                  Publish your portfolio
                </h2>
                <p style={{ fontSize: 13, color: "#78716C", lineHeight: 1.65 }}>
                  Go live and get a public shareable link to your portfolio.
                </p>
              </div>

              {/* Plan card */}
              <div style={{
                background: "#FFF7ED", border: "1.5px solid #FED7AA",
                borderRadius: 14, padding: "18px 20px", marginBottom: 20,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.02em", marginBottom: 4 }}>Pro Plan</div>
                    <div style={{ fontSize: 12, color: "#78716C", lineHeight: 1.6 }}>Live portfolio · Custom subdomain · All templates</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#EA580C", letterSpacing: "-0.03em" }}>$9</div>
                    <div style={{ fontSize: 11, color: "#A8A29E" }}>/month</div>
                  </div>
                </div>
              </div>

              {publishError && (
                <div style={{ padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, fontSize: 12, color: "#B91C1C", marginBottom: 14 }}>
                  {publishError}
                </div>
              )}

              <button
                onClick={handleGoLive}
                disabled={publishLoading}
                style={{
                  width: "100%", padding: "14px", borderRadius: 11, border: "none",
                  background: "#FFC439", color: "#003087",
                  fontSize: 15, fontWeight: 800, fontFamily: SANS,
                  cursor: publishLoading ? "not-allowed" : "pointer",
                  opacity: publishLoading ? 0.7 : 1, letterSpacing: "-0.01em",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
              >
                {publishLoading ? "Publishing…" : (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#003087">
                      <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H8.86a.483.483 0 0 1-.477-.558L9.936 11h2.543c4.577 0 7.8-1.967 8.518-6.108a5.29 5.29 0 0 1 1.07 3.586z"/>
                    </svg>
                    Pay with PayPal
                  </>
                )}
              </button>

              <button
                onClick={async () => {
                  if (session) {
                    await save()
                    if (currentUser) {
                      await fetch("/api/portfolios", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ subdomain: session.subdomain, userId: currentUser.id }),
                      })
                    }
                  }
                  setPublishModal(null)
                  router.push("/dashboard")
                }}
                style={{
                  width: "100%", padding: "11px", borderRadius: 10, border: "none",
                  background: "none", color: "#A8A29E", fontSize: 12, fontWeight: 600,
                  fontFamily: SANS, cursor: "pointer", marginTop: 10,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#57534E")}
                onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}
              >
                Save as draft — go to dashboard
              </button>
            </>
          )}

        </div>
      </div>
    )}

    </div>
  )
}
