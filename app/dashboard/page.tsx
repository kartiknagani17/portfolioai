"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"

type Portfolio = {
  subdomain: string
  portfolio_data: any
  template_id: string
  accent_color: string
  status: "draft" | "live"
  created_at: string
  updated_at: string
}

const TEMPLATE_NAMES: Record<string, string> = {
  "template-1": "Classic",
  "template-2": "Editorial",
  "template-3": "Maker",
  "template-axiom": "Axiom",
  "template-depth": "Depth",
  "template-the-atlas": "The Atlas",
  "template-pulse": "Pulse",
  "template-the-current": "The Current",
  "template-canvas": "Canvas",
  "template-meridian": "Meridian",
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace("/login"); return }
      setUser(user)

      const { data } = await supabase
        .from("portfolios")
        .select("subdomain, portfolio_data, template_id, accent_color, status, created_at, updated_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setPortfolios(data || [])
      setLoading(false)
    }
    init()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace("/")
  }

  const userInitials = (user?.email || "?").slice(0, 2).toUpperCase()
  const userLabel = user?.email?.split("@")[0] || "Account"
  const liveCount = portfolios.filter(p => p.status === "live").length
  const draftCount = portfolios.filter(p => p.status === "draft").length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: ${SANS}; background: #FAF9F6; -webkit-font-smoothing: antialiased; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .db-row {
          background: #fff;
          border: 1px solid #E7E5E4;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 0.22s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .db-row:hover {
          border-color: #D6D3D1;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.08);
        }

        .db-btn {
          padding: 7px 15px;
          border-radius: 8px;
          border: 1px solid #E7E5E4;
          background: #F5F5F4;
          color: #57534E;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.18s;
          white-space: nowrap;
          font-family: ${SANS};
          cursor: pointer;
        }
        .db-btn:hover { background: #EEECEB; color: #1C1917; border-color: #D6D3D1; }

        .db-btn-primary {
          padding: 7px 16px;
          border-radius: 8px;
          border: none;
          background: #1C1917;
          color: #FAF9F6;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.18s;
          white-space: nowrap;
          font-family: ${SANS};
          letter-spacing: -0.01em;
          cursor: pointer;
        }
        .db-btn-primary:hover { background: #292524; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.14); }

        .db-btn-new {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 22px;
          border-radius: 11px;
          background: #EA580C;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 2px 14px rgba(234,88,12,0.26);
          font-family: ${SANS};
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .db-btn-new:hover { background: #DC4B08; transform: translateY(-2px); box-shadow: 0 6px 22px rgba(234,88,12,0.36); }

        .badge-live {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px;
          border-radius: 100px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          font-size: 10px; font-weight: 700;
          color: #059669;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: ${MONO};
          white-space: nowrap;
        }
        .badge-draft {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px;
          border-radius: 100px;
          background: #F5F5F4;
          border: 1px solid #E7E5E4;
          font-size: 10px; font-weight: 700;
          color: #A8A29E;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: ${MONO};
          white-space: nowrap;
        }

        .stat-card {
          background: #fff;
          border: 1px solid #E7E5E4;
          border-radius: 14px;
          padding: 18px 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
          transition: all 0.2s;
        }
        .stat-card:hover { border-color: #D6D3D1; box-shadow: 0 5px 18px rgba(0,0,0,0.07); }

        .user-pill {
          display: flex; align-items: center; gap: 8px;
          background: #F5F5F4; border: 1px solid #E7E5E4;
          border-radius: 100px; padding: 5px 14px 5px 5px;
          cursor: pointer; transition: all 0.18s;
          position: relative;
        }
        .user-pill:hover { border-color: #D6D3D1; background: #EDECEB; }

        @media (max-width: 640px) {
          .db-header { flex-direction: column; align-items: flex-start !important; gap: 14px; }
          .db-row { flex-wrap: wrap; }
          .db-row-actions { width: 100%; justify-content: flex-end; }
          .db-stats { grid-template-columns: 1fr 1fr !important; }
          .db-row-meta { flex-wrap: wrap; }
        }
        @media (max-width: 380px) {
          .db-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#FAF9F6" }}>

        {/* ── Navbar ── */}
        <nav style={{
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "0 clamp(16px, 4vw, 36px)",
          height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(250,249,246,0.94)", backdropFilter: "blur(14px)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #EA580C, #F97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(234,88,12,0.26)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.03em" }}>PortfolioAI</span>
          </Link>

          {/* User pill + sign out */}
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="user-pill">
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "#EA580C",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: "#fff",
                }}>
                  {userInitials}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#57534E", fontFamily: SANS }}>
                  {userLabel}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="db-btn"
                style={{ fontSize: 12 }}
              >
                Sign out
              </button>
            </div>
          )}
        </nav>

        {/* ── Main ── */}
        <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px clamp(16px, 4vw, 28px) 100px" }}>

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
              <div style={{
                width: 28, height: 28,
                border: "3px solid #FED7AA",
                borderTopColor: "#EA580C",
                borderRadius: "50%",
                animation: "spin 0.75s linear infinite",
              }} />
            </div>
          ) : (
            <>
              {/* Header row */}
              <div
                className="db-header"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, animation: "fade-up 0.4s ease" }}
              >
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.03em", marginBottom: 4 }}>
                    Your Portfolios
                  </h1>
                  <p style={{ fontSize: 13, color: "#A8A29E", fontWeight: 500 }}>
                    {portfolios.length === 0
                      ? "No portfolios yet — create your first one"
                      : `${portfolios.length} portfolio${portfolios.length !== 1 ? "s" : ""} · ${liveCount} live · ${draftCount} draft`}
                  </p>
                </div>
                <Link href="/" className="db-btn-new">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Create another portfolio
                </Link>
              </div>

              {/* Stats */}
              {portfolios.length > 0 && (
                <div
                  className="db-stats"
                  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28, animation: "fade-up 0.4s ease 0.07s both" }}
                >
                  {[
                    { label: "Total", value: portfolios.length, icon: "📁" },
                    { label: "Live", value: liveCount, icon: "🟢" },
                    { label: "Draft", value: draftCount, icon: "✏️" },
                  ].map((s, i) => (
                    <div key={i} className="stat-card">
                      <div style={{ fontSize: 18, marginBottom: 8 }}>{s.icon}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.03em", marginBottom: 3 }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: 11, color: "#A8A29E", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {portfolios.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "72px 28px",
                  background: "#fff", border: "1px solid #E7E5E4",
                  borderRadius: 20, boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
                  animation: "fade-up 0.5s ease 0.1s both",
                }}>
                  <div style={{ animation: "float 3.5s ease-in-out infinite", display: "inline-block", marginBottom: 20 }}>
                    <div style={{
                      width: 68, height: 68, borderRadius: 18,
                      background: "#FFF7ED", border: "1px solid #FED7AA",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto", fontSize: 28,
                      boxShadow: "0 6px 20px rgba(234,88,12,0.1)",
                    }}>📋</div>
                  </div>
                  <h2 style={{ fontSize: 19, fontWeight: 800, color: "#1C1917", marginBottom: 9, letterSpacing: "-0.025em" }}>
                    No portfolios yet
                  </h2>
                  <p style={{ fontSize: 13, color: "#78716C", maxWidth: 340, margin: "0 auto 26px", lineHeight: 1.65 }}>
                    Upload your resume to generate an AI-powered portfolio in under 30 seconds.
                  </p>
                  <Link href="/" className="db-btn-new" style={{ fontSize: 14, padding: "12px 24px" }}>
                    Create my first portfolio →
                  </Link>
                </div>
              ) : (
                /* Portfolio list */
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {portfolios.map((p, i) => {
                    const name    = p.portfolio_data?.personal?.fullName || p.subdomain
                    const title   = p.portfolio_data?.personal?.professionalTitle || ""
                    const accent  = p.accent_color || "#EA580C"
                    const tName   = TEMPLATE_NAMES[p.template_id] || p.template_id
                    const isLive  = p.status === "live"
                    const initials = name.split(" ").map((n: string) => n[0] || "").join("").slice(0, 2).toUpperCase()
                    const updatedAt = p.updated_at
                      ? new Date(p.updated_at).toLocaleDateString("en", { month: "short", day: "numeric" })
                      : null

                    return (
                      <div
                        key={p.subdomain}
                        className="db-row"
                        style={{ animation: `slide-in 0.35s ease ${i * 0.06}s both` }}
                      >
                        {/* Avatar */}
                        <div style={{
                          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                          background: accent,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 800, color: "#fff",
                          boxShadow: `0 3px 12px ${accent}45`,
                          letterSpacing: "-0.02em",
                        }}>
                          {initials}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 14, fontWeight: 700, color: "#1C1917",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            letterSpacing: "-0.015em", marginBottom: 5,
                          }}>
                            {name}
                          </div>
                          <div className="db-row-meta" style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                            {/* Status badge */}
                            {isLive ? (
                              <span className="badge-live">
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#059669" }} />
                                Live
                              </span>
                            ) : (
                              <span className="badge-draft">
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#A8A29E" }} />
                                Draft
                              </span>
                            )}
                            {title && (
                              <span style={{ fontSize: 11, color: "#78716C", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
                                {title}
                              </span>
                            )}
                            <span style={{
                              fontSize: 10, color: "#C7C4C2",
                              background: "#F5F5F4", border: "1px solid #E7E5E4",
                              borderRadius: 4, padding: "2px 6px",
                              fontWeight: 600, letterSpacing: "0.02em",
                            }}>
                              {tName}
                            </span>
                            {updatedAt && (
                              <span style={{ fontSize: 11, color: "#C7C4C2" }}>· {updatedAt}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="db-row-actions" style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
                          {isLive && (
                            <a
                              href={`/p/${p.subdomain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="db-btn"
                            >
                              View ↗
                            </a>
                          )}
                          <Link href={`/dashboard/edit/${p.subdomain}`} className="db-btn-primary">
                            Edit →
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}
