"use client";

import { useState } from "react";
import Modal from "./Modal";

interface C1RendererProps {
  c1Response: string;
}

export function C1Renderer({ c1Response }: C1RendererProps) {
  const parseC1 = (xml: string) => {
    const get = (tag: string) => {
      const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : null;
    };

    return {
      insight: get("Insight"),
      evidence: get("Evidence"),
      tradeoff: get("Tradeoff"),
      uncertainty: get("Uncertainty"),
      takeaway: get("Takeaway"),
      suggestion: get("Suggestion"),
      alternative: get("AlternativeIngredient"),
    };
  };

  const parsed = parseC1(c1Response);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showWhyMatters, setShowWhyMatters] = useState(false);
  const [activeTab, setActiveTab] = useState<"why" | "tradeoff" | "alternative">("why");

  if (!parsed.insight) {
    return (
      <div className="panel" style={{ color: "#b91c1c" }}>
        Could not parse response
      </div>
    );
  }

  const uncertaintyScore = Math.min(1, Math.max(0, (parsed.uncertainty?.length || 0) / 200));

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        {/* Main Insight Card */}
        <div className="panel" style={{ marginBottom: 12, borderLeft: "4px solid #2563eb" }}>
          <h2 style={{ margin: "0 0 8px 0" }}> Key Insight</h2>
          <p style={{ marginTop: 8, color: "#334155", lineHeight: 1.6, fontSize: "1.05rem" }}>
            {parsed.insight}
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="btn ghost"
              onClick={() => setShowWhyMatters(true)}
              style={{ cursor: "pointer" }}
            >
               Why this matters
            </button>
            {parsed.suggestion && (
              <button
                className="btn ghost"
                onClick={() => setActiveTab("alternative")}
                style={{ cursor: "pointer" }}
              >
                 See suggestion
              </button>
            )}
          </div>
        </div>

        {/* Takeaway */}
        {parsed.takeaway && (
          <div className="panel" style={{ marginBottom: 12, background: "#f0fdf4", borderLeft: "4px solid #16a34a" }}>
            <h3 style={{ margin: "0 0 8px 0" }}> What you should know</h3>
            <p style={{ margin: 0, color: "#334155", lineHeight: 1.6 }}>
              {parsed.takeaway}
            </p>
          </div>
        )}

        {/* Tradeoffs */}
        {parsed.tradeoff && (
          <div className="panel" style={{ marginBottom: 12 }}>
            <h3 style={{ margin: "0 0 8px 0" }}> Trade-offs</h3>
            <p style={{ margin: 0, color: "#334155", lineHeight: 1.6 }}>
              {parsed.tradeoff}
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside style={{ width: 350 }}>
        {/* Uncertainty Meter */}
        <div className="panel" style={{ marginBottom: 12 }}>
          <h4 style={{ margin: 0 }}> Uncertainty Level</h4>
          <div style={{ marginTop: 10 }}>
            <div style={{ height: 12, background: "#eef2ff", borderRadius: 8, overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.round(uncertaintyScore * 100)}%`,
                  height: "100%",
                  background: uncertaintyScore > 0.6 ? "#fb7185" : "#f59e0b",
                  transition: "width 0.3s",
                }}
              />
            </div>
            {parsed.uncertainty && (
              <div className="small muted" style={{ marginTop: 8 }}>
                {parsed.uncertainty}
              </div>
            )}
          </div>
        </div>

        {/* Evidence Drawer */}
        <div className="panel" style={{ marginBottom: 12 }}>
          <h4 style={{ margin: 0 }}> Evidence</h4>
          <div style={{ marginTop: 8 }}>
            <button
              className="btn ghost"
              onClick={() => setShowEvidence((s) => !s)}
              style={{ cursor: "pointer" }}
            >
              {showEvidence ? "Hide" : "Show"} details
            </button>
            {showEvidence && parsed.evidence && (
              <div style={{ marginTop: 10, color: "#334155", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {parsed.evidence}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="panel" style={{ background: "#f0f7ff" }}>
          <p className="small" style={{ margin: 0 }}>
             <strong>Note:</strong> Upload a product image or paste ingredients to see personalized insights.
          </p>
        </div>
      </aside>

      {/* Modal: Why This Matters */}
      <Modal
        title="Why This Matters"
        open={showWhyMatters}
        onClose={() => setShowWhyMatters(false)}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 16, borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
          <button
            className={`btn ${activeTab === "why" ? "" : "ghost"}`}
            onClick={() => setActiveTab("why")}
            style={{ cursor: "pointer" }}
          >
            Why
          </button>
          {parsed.tradeoff && (
            <button
              className={`btn ${activeTab === "tradeoff" ? "" : "ghost"}`}
              onClick={() => setActiveTab("tradeoff")}
              style={{ cursor: "pointer" }}
            >
              Trade-offs
            </button>
          )}
          {parsed.suggestion && (
            <button
              className={`btn ${activeTab === "alternative" ? "" : "ghost"}`}
              onClick={() => setActiveTab("alternative")}
              style={{ cursor: "pointer" }}
            >
              Suggestions
            </button>
          )}
        </div>

        {activeTab === "why" && (
          <div>
            <p>{parsed.insight}</p>
            <p>{parsed.evidence}</p>
          </div>
        )}

        {activeTab === "tradeoff" && parsed.tradeoff && <p>{parsed.tradeoff}</p>}

        {activeTab === "alternative" && (
          <div>
            {parsed.suggestion && (
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ marginTop: 0 }}>Suggestion</h4>
                <p>{parsed.suggestion}</p>
              </div>
            )}
            {parsed.alternative && (
              <div>
                <h4>Alternative Ingredients</h4>
                <p>{parsed.alternative}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
