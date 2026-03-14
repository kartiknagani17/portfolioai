"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(redirectTo)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg(null)
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.replace(redirectTo)
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccessMsg("Account created! Check your email to confirm, or continue to dashboard.")
        setTimeout(() => router.replace(redirectTo), 2000)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: ${SANS}; background: #FAF9F6; -webkit-font-smoothing: antialiased; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(18px, -24px) scale(1.02); }
          66%       { transform: translate(-12px, 12px) scale(0.98); }
        }

        .auth-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #E7E5E4;
          border-radius: 10px;
          font-size: 14px;
          font-family: ${SANS};
          font-weight: 500;
          color: #1C1917;
          background: #FAFAF8;
          outline: none;
          transition: all 0.2s ease;
        }
        .auth-input:focus {
          border-color: #EA580C;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(234,88,12,0.1);
        }
        .auth-input::placeholder { color: #A8A29E; }

        .auth-btn {
          width: 100%;
          padding: 13px;
          border-radius: 11px;
          border: none;
          background: #1C1917;
          color: #FAF9F6;
          font-size: 14px;
          font-weight: 700;
          font-family: ${SANS};
          cursor: pointer;
          letter-spacing: -0.01em;
          transition: all 0.2s ease;
        }
        .auth-btn:hover:not(:disabled) { background: #292524; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.18); }
        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .mode-tab {
          flex: 1;
          padding: 9px;
          border: none;
          background: none;
          font-family: ${SANS};
          font-size: 13px;
          font-weight: 600;
          color: #A8A29E;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          letter-spacing: -0.01em;
        }
        .mode-tab.active { color: #1C1917; border-bottom-color: #EA580C; }
        .mode-tab:hover:not(.active) { color: #57534E; }
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600,
          borderRadius: "40% 60% 55% 45% / 50% 45% 55% 50%",
          background: "radial-gradient(circle, rgba(254,215,170,0.35) 0%, transparent 65%)",
          top: "-15%", right: "-10%",
          animation: "blob-drift 22s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: "38vw", height: "38vw", maxWidth: 480, maxHeight: 480,
          borderRadius: "60% 40% 45% 55% / 45% 60% 40% 55%",
          background: "radial-gradient(circle, rgba(196,221,255,0.24) 0%, transparent 65%)",
          bottom: "-10%", left: "-8%",
          animation: "blob-drift 28s ease-in-out infinite reverse",
          animationDelay: "-8s",
        }} />
      </div>

      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "24px 20px", position: "relative", zIndex: 1,
      }}>

        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 36, animation: "fade-up 0.4s ease" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, #EA580C, #F97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 3px 10px rgba(234,88,12,0.3)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.03em" }}>PortfolioAI</span>
        </a>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: 420,
          background: "#fff", border: "1px solid #E7E5E4",
          borderRadius: 20, overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          animation: "fade-up 0.5s ease 0.1s both",
        }}>

          {/* Mode tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #F0EFED", padding: "0 8px" }}>
            <button className={`mode-tab ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setError(null) }}>
              Log in
            </button>
            <button className={`mode-tab ${mode === "signup" ? "active" : ""}`} onClick={() => { setMode("signup"); setError(null) }}>
              Sign up
            </button>
          </div>

          <div style={{ padding: "28px 28px 32px" }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.03em", marginBottom: 6 }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p style={{ fontSize: 13, color: "#78716C", marginBottom: 24, lineHeight: 1.6 }}>
              {mode === "login"
                ? "Log in to manage and publish your portfolios."
                : "Sign up to save and publish your AI-generated portfolio."}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#57534E", marginBottom: 6, letterSpacing: "0.02em" }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#57534E", marginBottom: 6, letterSpacing: "0.02em" }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </div>

              {error && (
                <div style={{
                  padding: "11px 14px", background: "#FEF2F2",
                  border: "1px solid #FECACA", borderRadius: 9,
                  fontSize: 13, color: "#B91C1C", lineHeight: 1.5,
                }}>
                  {error}
                </div>
              )}

              {successMsg && (
                <div style={{
                  padding: "11px 14px", background: "#ECFDF5",
                  border: "1px solid #A7F3D0", borderRadius: 9,
                  fontSize: 13, color: "#065F46", lineHeight: 1.5,
                }}>
                  {successMsg}
                </div>
              )}

              <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: 4 }}>
                {loading
                  ? (mode === "login" ? "Signing in…" : "Creating account…")
                  : (mode === "login" ? "Sign in →" : "Create account →")}
              </button>
            </form>

            <p style={{ marginTop: 20, fontSize: 12, color: "#A8A29E", textAlign: "center", lineHeight: 1.6 }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null) }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#EA580C", fontWeight: 700, fontSize: 12, fontFamily: SANS, padding: 0 }}
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <a href="/" style={{ marginTop: 24, fontSize: 13, color: "#A8A29E", textDecoration: "none", fontWeight: 500, animation: "fade-up 0.5s ease 0.2s both" }}>
          ← Back to home
        </a>
      </div>
    </>
  )
}
