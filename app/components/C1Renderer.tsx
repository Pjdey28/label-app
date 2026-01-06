"use client";

import { useState } from "react";

interface C1RendererProps {
  c1Response: string;
}

export function C1Renderer({ c1Response }: C1RendererProps) {
  const parseC1 = (xml: string) => {
    const sections: { type: string; title: string; content: string }[] = [];

    const get = (tag: string) => {
      const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : null;
    };

    const insight = get("Insight");
    if (insight) sections.push({ type: "insight", title: "Key Insight", content: insight });

    const evidence = get("Evidence");
    if (evidence) sections.push({ type: "evidence", title: "Evidence", content: evidence });

    const tradeoff = get("Tradeoff");
    if (tradeoff) sections.push({ type: "tradeoff", title: "Trade-offs", content: tradeoff });

    const uncertainty = get("Uncertainty");
    if (uncertainty) sections.push({ type: "uncertainty", title: "Uncertainty", content: uncertainty });

    const takeaway = get("Takeaway");
    if (takeaway) sections.push({ type: "takeaway", title: "Takeaway", content: takeaway });

    return sections;
  };

  const sections = parseC1(c1Response);
  const [showEvidence, setShowEvidence] = useState(false);

  const uncertaintyText = sections.find(s => s.type === "uncertainty")?.content || "";
  const uncertaintyScore = Math.min(1, Math.max(0, uncertaintyText.length / 200));

  if (sections.length === 0) {
    return (
      <div className="panel" style={{ color: "#b91c1c" }}>
        Could not parse C1 response
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        {sections.filter(s => s.type !== "evidence").map((section, idx) => (
          <div key={idx} className="panel" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{section.title}</h3>
              <div className="small muted">{section.type === "insight" ? "\u2605" : ""}</div>
            </div>
            <p style={{ marginTop: 8, color: "#334155", lineHeight: 1.6 }}>{section.content}</p>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="btn ghost">Why this matters</button>
              <button className="btn ghost">Alternatives</button>
            </div>
          </div>
        ))}
      </div>

      <aside style={{ width: 320 }}>
        <div className="panel" style={{ marginBottom: 12 }}>
          <h4 style={{ margin: 0 }}>Uncertainty</h4>
          <div style={{ marginTop: 10 }}>
            <div style={{ height: 12, background: "#eef2ff", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ width: `${Math.round(uncertaintyScore * 100)}%`, height: "100%", background: uncertaintyScore > 0.6 ? "#fb7185" : "#f59e0b" }} />
            </div>
            <div className="small muted" style={{ marginTop: 8 }}>{uncertaintyText || "Low uncertainty"}</div>
          </div>
        </div>

        <div className="panel">
          <h4 style={{ margin: 0 }}>Evidence</h4>
          <div style={{ marginTop: 8 }}>
            <button className="btn ghost" onClick={() => setShowEvidence(s => !s)}>{showEvidence ? "Hide" : "Show"} evidence</button>
            {showEvidence && (
              <div style={{ marginTop: 10, color: "#334155" }}>
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{sections.find(s => s.type === "evidence")?.content || "No evidence provided."}</pre>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
