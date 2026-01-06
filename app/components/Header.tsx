"use client";

export default function Header() {
  return (
    <header style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>LabelAI</h1>
          <p style={{ margin: 0, color: "#475569" }} className="small">AI-native ingredient co-pilot — clear insights, honest uncertainty</p>
        </div>
      </div>
    </header>
  );
}
