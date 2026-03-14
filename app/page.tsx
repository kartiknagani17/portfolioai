"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const LOADING_MESSAGES = [
  "Reading your resume...",
  "Understanding your experience...",
  "Selecting the best design...",
  "Building your portfolio...",
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [authUser, setAuthUser] = useState<{ id: string; email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user ? { id: user.id, email: user.email || "" } : null);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(id);
  }, [loading]);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      // Get logged-in user upfront so we can link the portfolio on creation
      const { data: { user } } = await supabase.auth.getUser();

      const formData = new FormData();
      formData.append("file", file);

      const parseRes = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const portfolioData = await parseRes.json();
      if (!parseRes.ok) throw new Error(portfolioData.error || "Failed to parse resume");

      const layoutRes = await fetch("/api/generate-layout-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioData }),
      });
      const layoutConfig = await layoutRes.json();
      if (!layoutRes.ok) throw new Error(layoutConfig.error || "Failed to generate layout");

      // Pass userId so the portfolio is linked to the account from the start
      const createRes = await fetch("/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioData, layoutConfig, userId: user?.id ?? null }),
      });
      const createJson = await createRes.json();
      if (!createRes.ok) throw new Error(createJson?.error || "Failed to create portfolio");

      window.location.href = `/choose-template/${createJson.subdomain}`;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const ext = file.name.toLowerCase().split(".").pop();
      if (ext !== "pdf" && ext !== "docx") {
        setError("Please upload a PDF or Word (.docx) file.");
        return;
      }
      handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragOver(false), []);

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const ext = file.name.toLowerCase().split(".").pop();
      if (ext !== "pdf" && ext !== "docx") {
        setError("Please upload a PDF or Word (.docx) file.");
        return;
      }
      handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const openFilePicker = () => fileInputRef.current?.click();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #FAF9F6;
        }

        @keyframes blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(22px, -32px) scale(1.03); }
          50%  { transform: translate(-14px, 14px) scale(0.97); }
          75%  { transform: translate(10px, -14px) scale(1.01); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes reveal-word {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes dot-pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50%       { transform: scale(1.2); opacity: 1; }
        }
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(234,88,12,0.35); }
          50%       { box-shadow: 0 0 0 6px rgba(234,88,12,0); }
        }

        .word-reveal {
          display: inline-block;
          opacity: 0;
          animation: reveal-word 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border-radius: 10px;
          background: #1C1917;
          color: #FAF9F6;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          letter-spacing: -0.01em;
        }
        .nav-cta:hover { background: #292524; transform: translateY(-1px); }

        .upload-zone {
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }
        .upload-zone:focus-visible {
          box-shadow: 0 0 0 3px rgba(234,88,12,0.3);
        }

        .primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 30px;
          border-radius: 12px;
          background: #EA580C;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(234,88,12,0.3);
          letter-spacing: -0.01em;
        }
        .primary-btn:hover {
          background: #DC4B08;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(234,88,12,0.42);
        }
        .primary-btn:active { transform: translateY(0); }

        .step-card {
          background: #fff;
          border: 1px solid #E7E5E4;
          border-radius: 18px;
          padding: 28px 24px;
          transition: all 0.28s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .step-card:hover {
          border-color: #D6D3D1;
          transform: translateY(-5px);
          box-shadow: 0 20px 52px rgba(0,0,0,0.09);
        }

        .feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #fff;
          border: 1px solid #E7E5E4;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          color: #57534E;
          transition: all 0.2s ease;
        }
        .feature-pill:hover {
          border-color: #A8A29E;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
        }

        .nav-link {
          color: #78716C;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #1C1917; }

        @media (max-width: 768px) {
          .hero-title   { font-size: clamp(2.2rem, 9vw, 3.2rem) !important; }
          .steps-grid   { grid-template-columns: 1fr !important; }
          .nav-links    { display: none !important; }
          .hero-section { padding: 56px 20px 40px !important; }
          .section-pad  { padding-left: 20px !important; padding-right: 20px !important; }
          .upload-max   { max-width: 100% !important; }
          .footer-inner { flex-direction: column; align-items: flex-start !important; gap: 8px; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 1.9rem !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#FAF9F6", position: "relative", overflow: "hidden" }}>

        {/* ── Ambient background blobs ── */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", width: "55vw", height: "55vw",
            maxWidth: 720, maxHeight: 720,
            borderRadius: "40% 60% 55% 45% / 50% 45% 55% 50%",
            background: "radial-gradient(circle, rgba(254,215,170,0.38) 0%, transparent 65%)",
            top: "-15%", right: "-10%",
            animation: "blob-drift 24s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: "42vw", height: "42vw",
            maxWidth: 560, maxHeight: 560,
            borderRadius: "60% 40% 45% 55% / 45% 60% 40% 55%",
            background: "radial-gradient(circle, rgba(196,221,255,0.28) 0%, transparent 65%)",
            bottom: "-10%", left: "-10%",
            animation: "blob-drift 30s ease-in-out infinite reverse",
            animationDelay: "-8s",
          }} />
          <div style={{
            position: "absolute", width: "32vw", height: "32vw",
            maxWidth: 420, maxHeight: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,252,231,0.28) 0%, transparent 65%)",
            top: "48%", left: "52%",
            animation: "blob-drift 20s ease-in-out infinite",
            animationDelay: "-14s",
          }} />
        </div>

        {/* ── Navbar ── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 clamp(20px, 5vw, 48px)", height: 64,
          background: "rgba(250,249,246,0.88)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #EA580C, #F97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(234,88,12,0.32)",
              flexShrink: 0,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.03em" }}>
              PortfolioAI
            </span>
          </div>

          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <a href="#how-it-works" className="nav-link">How it works</a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!authLoading && (
              authUser ? (
                /* Logged-in: show name chip + dashboard link */
                <a href="/dashboard" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", border: "1px solid #E7E5E4",
                  borderRadius: 100, padding: "5px 14px 5px 5px",
                  textDecoration: "none", transition: "all 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#D6D3D1")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#E7E5E4")}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: "#EA580C",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: "#fff",
                  }}>
                    {authUser.email.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#57534E" }}>
                    {authUser.email.split("@")[0]}
                  </span>
                  <span style={{ fontSize: 11, color: "#A8A29E" }}>Dashboard →</span>
                </a>
              ) : (
                /* Not logged in: Login button */
                <a href="/login" style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "8px 18px",
                  borderRadius: 10,
                  background: "#fff",
                  border: "1px solid #E7E5E4",
                  color: "#57534E",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: "all 0.2s ease",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#D6D3D1"; e.currentTarget.style.color = "#1C1917"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E7E5E4"; e.currentTarget.style.color = "#57534E"; }}
                >
                  Login
                </a>
              )
            )}
            <a href="#upload" className="nav-cta">
              Build My Portfolio →
            </a>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section
          className="hero-section section-pad"
          style={{
            position: "relative", zIndex: 1,
            padding: "88px clamp(20px, 5vw, 48px) 64px",
            textAlign: "center",
            maxWidth: 920, margin: "0 auto",
          }}
        >
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#FFF7ED", border: "1px solid #FED7AA",
            borderRadius: 100, padding: "6px 16px", marginBottom: 36,
            animation: "fade-up 0.5s ease 0.1s both, badge-pulse 2.5s ease-in-out 1.5s infinite",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#EA580C" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#EA580C", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              AI-Powered Portfolio Builder
            </span>
          </div>

          {/* Headline with word-reveal */}
          <h1
            className="hero-title"
            style={{
              fontSize: "clamp(3rem, 7.5vw, 5.2rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.038em",
              color: "#1C1917",
              margin: "0 0 28px",
            }}
          >
            {[
              { text: "Upload", italic: false },
              { text: "resume.", italic: true },
              { text: " ", italic: false },
              { text: "Get", italic: false },
              { text: "a", italic: false },
              { text: "portfolio.", italic: true },
            ].map((w, i) =>
              w.text === " " ? (
                <br key={i} />
              ) : (
                <span
                  key={i}
                  className="word-reveal"
                  style={{
                    animationDelay: `${0.22 + i * 0.09}s`,
                    color: w.italic ? "#EA580C" : undefined,
                    fontStyle: w.italic ? "italic" : undefined,
                    marginRight: "0.22em",
                  }}
                >
                  {w.text}
                </span>
              )
            )}
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2.2vw, 1.15rem)", color: "#78716C",
            maxWidth: 520, margin: "0 auto 56px", lineHeight: 1.78,
            animation: "fade-up 0.6s ease 0.78s both",
          }}>
            No form filling. No theme selection. Just drop your resume — our AI reads
            it, designs your portfolio, and it&apos;s live in under 30 seconds.
          </p>

          {/* ── Upload zone ── */}
          <div
            className="upload-max"
            style={{ maxWidth: 548, margin: "0 auto", animation: "fade-up 0.7s ease 0.92s both" }}
          >
            <div
              id="upload"
              role="button"
              tabIndex={0}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={openFilePicker}
              onKeyDown={(e) => e.key === "Enter" && openFilePicker()}
              className="upload-zone"
              style={{
                background: isDragOver ? "#FFF7ED" : "#FFFFFF",
                border: isDragOver ? "2px dashed #EA580C" : "2px dashed #D6D3D1",
                borderRadius: 22,
                padding: "48px 36px 40px",
                boxShadow: isDragOver
                  ? "0 0 0 6px rgba(234,88,12,0.09), 0 12px 48px rgba(0,0,0,0.09)"
                  : "0 4px 36px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.03)",
                transform: isDragOver ? "scale(1.015)" : "scale(1)",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                style={{ display: "none" }}
                onClick={(e) => e.stopPropagation()}
                onChange={onFileSelect}
              />

              {/* Floating file icon */}
              <div style={{ animation: "float 3.8s ease-in-out infinite", display: "inline-block", marginBottom: 22 }}>
                <div style={{
                  width: 76, height: 76, borderRadius: 20,
                  background: "linear-gradient(145deg, #FFF7ED, #FFEDD5)",
                  border: "1.5px solid #FED7AA",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto",
                  boxShadow: "0 8px 24px rgba(234,88,12,0.16)",
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="14 2 14 8 20 8" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="18" x2="12" y2="12" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
                    <polyline points="9 15 12 12 15 15" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div style={{ fontSize: 19, fontWeight: 800, color: "#1C1917", marginBottom: 8, letterSpacing: "-0.025em" }}>
                {isDragOver ? "Release to upload ✦" : "Drop your resume here"}
              </div>
              <div style={{ fontSize: 14, color: "#A8A29E", marginBottom: 26, lineHeight: 1.5 }}>
                Supports PDF and Word (.docx) — we&apos;ll handle the rest
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); openFilePicker(); }}
                className="primary-btn"
                style={{ margin: "0 auto" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Browse Files
              </button>

              {/* File type badges */}
              <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                {["PDF", "DOCX"].map((type) => (
                  <div key={type} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: "#A8A29E", fontWeight: 600, letterSpacing: "0.04em",
                  }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#D6D3D1" }} />
                    {type}
                  </div>
                ))}
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#E7E5E4" }} />
                <div style={{ fontSize: 11, color: "#A8A29E", fontWeight: 500 }}>Free to use</div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                marginTop: 16, padding: "14px 20px",
                background: "#FEF2F2", border: "1px solid #FECACA",
                borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                animation: "fade-up 0.3s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 15 }}>⚠️</span>
                  <p style={{ fontSize: 13, color: "#B91C1C", margin: 0, lineHeight: 1.4 }}>{error}</p>
                </div>
                <button
                  onClick={() => { setError(null); setLoading(false); }}
                  style={{
                    padding: "6px 14px", borderRadius: 8,
                    background: "#FEE2E2", border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 700, color: "#B91C1C", flexShrink: 0,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: "background 0.2s",
                  }}
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── How it works ── */}
        <section
          id="how-it-works"
          className="section-pad"
          style={{
            position: "relative", zIndex: 1,
            padding: "72px clamp(20px, 5vw, 48px) 88px",
            maxWidth: 1100, margin: "0 auto",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: "#A8A29E",
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14,
            }}>
              How it works
            </div>
            <h2 style={{
              fontSize: "clamp(1.9rem, 4vw, 2.6rem)", fontWeight: 800,
              color: "#1C1917", letterSpacing: "-0.035em", margin: 0,
              lineHeight: 1.1,
            }}>
              From resume to live portfolio
            </h2>
          </div>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              {
                step: "01",
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="14 2 14 8 20 8" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                iconBg: "#FFF7ED", iconBorder: "#FED7AA",
                title: "Upload your resume",
                desc: "Drop your PDF or Word file. Our AI extracts every detail — experience, skills, projects, and achievements.",
              },
              {
                step: "02",
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17l10 5 10-5" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12l10 5 10-5" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                iconBg: "#F5F3FF", iconBorder: "#DDD6FE",
                title: "AI builds your portfolio",
                desc: "We detect your industry and craft a portfolio perfectly tailored to your profession. Zero decisions needed.",
              },
              {
                step: "03",
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                iconBg: "#ECFDF5", iconBorder: "#A7F3D0",
                title: "Edit & go live",
                desc: "Chat with AI to refine your copy, swap templates, or adjust colors. Share your live URL instantly.",
              },
            ].map((s, i) => (
              <div key={i} className="step-card" style={{ animation: `fade-up 0.6s ease ${0.15 + i * 0.14}s both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: 15,
                    background: s.iconBg, border: `1px solid ${s.iconBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}>
                    {s.icon}
                  </div>
                  <span style={{
                    fontSize: 28, fontWeight: 800, color: "#F0EFED",
                    letterSpacing: "-0.04em", lineHeight: 1,
                  }}>
                    {s.step}
                  </span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#1C1917", marginBottom: 10, letterSpacing: "-0.025em", lineHeight: 1.3 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 14, color: "#78716C", lineHeight: 1.72 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature pills ── */}
        <section
          className="section-pad"
          style={{
            position: "relative", zIndex: 1,
            padding: "0 clamp(20px, 5vw, 48px) 88px",
            maxWidth: 920, margin: "0 auto", textAlign: "center",
          }}
        >
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#A8A29E",
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24,
          }}>
            Everything included
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {[
              "🎨 Auto-designed templates",
              "✍️ AI-generated copy",
              "📱 Mobile responsive",
              "🔗 Instant live URL",
              "💬 Chat to edit",
              "↩ Undo any change",
              "🎯 Industry detection",
              "⚡ 30-second setup",
            ].map((f, i) => (
              <div key={i} className="feature-pill" style={{ animation: `fade-up 0.5s ease ${0.05 + i * 0.06}s both` }}>
                {f}
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          position: "relative", zIndex: 1,
          borderTop: "1px solid #E7E5E4",
          padding: "28px clamp(20px, 5vw, 48px)",
        }}>
          <div
            className="footer-inner"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: "linear-gradient(135deg, #EA580C, #F97316)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#57534E" }}>PortfolioAI</span>
            </div>
            <div style={{ fontSize: 12, color: "#A8A29E" }}>
              Build beautiful portfolios with AI — free to start.
            </div>
            <a href="/dashboard" style={{ fontSize: 12, color: "#78716C", textDecoration: "none", fontWeight: 500 }}>
              Dashboard →
            </a>
          </div>
        </footer>
      </div>

      {/* ── Loading overlay ── */}
      {loading && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(250,249,246,0.92)", backdropFilter: "blur(14px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#fff", border: "1px solid #E7E5E4",
            borderRadius: 22, padding: "44px 52px",
            textAlign: "center", maxWidth: 380, width: "90%",
            boxShadow: "0 24px 80px rgba(0,0,0,0.1)",
            animation: "fade-up 0.4s ease",
          }}>
            {/* Spinning ring */}
            <div style={{ position: "relative", width: 68, height: 68, margin: "0 auto 28px" }}>
              <div style={{
                position: "absolute", inset: 0,
                border: "3px solid #FED7AA", borderRadius: "50%",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                border: "3px solid transparent",
                borderTopColor: "#EA580C",
                borderRadius: "50%",
                animation: "spin 0.75s linear infinite",
              }} />
              <div style={{
                position: "absolute", inset: 9,
                background: "#FFF7ED", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#EA580C" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div style={{ fontSize: 18, fontWeight: 800, color: "#1C1917", marginBottom: 8, letterSpacing: "-0.025em" }}>
              Building your portfolio
            </div>
            <div style={{ fontSize: 13, color: "#78716C", minHeight: 20, transition: "all 0.3s ease" }}>
              {LOADING_MESSAGES[messageIndex]}
            </div>

            {/* Step dots */}
            <div style={{ marginTop: 28, display: "flex", gap: 6, justifyContent: "center" }}>
              {LOADING_MESSAGES.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === messageIndex ? 22 : 6,
                    height: 5, borderRadius: 3,
                    background: i === messageIndex ? "#EA580C" : "#E7E5E4",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
