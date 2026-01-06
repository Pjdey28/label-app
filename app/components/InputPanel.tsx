"use client";

import { useState } from "react";

export default function InputPanel({ setC1Response }: { setC1Response: (s: string | null) => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const ingredients = (formData.get("ingredients") as string)?.trim() || "";

    const apiForm = new FormData();
    apiForm.append("ingredients", ingredients);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: apiForm });
      const text = await res.text();
      const data = JSON.parse(text);
      setC1Response(data.c1);
    } catch (err) {
      console.error(err);
      setC1Response(`<C1><Insight>Unable to fetch response</Insight></C1>`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel">
      <form onSubmit={handleSubmit}>
        <label className="small muted">Paste ingredients</label>
        <textarea name="ingredients" rows={5} style={{ width: "100%", marginTop: 8 }} placeholder="e.g. wheat flour, sugar, salt" />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="btn" type="submit" disabled={loading}>{loading ? "Analyzing…" : "Analyze"}</button>
          <button type="button" className="btn ghost" onClick={() => setC1Response(`<C1>\n  <Insight emphasis=\"high\">Quick test insight</Insight>\n  <Takeaway>Sample takeaway</Takeaway>\n</C1>`)}>Force render</button>
        </div>
      </form>
      <hr style={{ margin: "14px 0" }} />
      <div className="small muted">Tip: paste ingredients or upload label (OCR coming soon)</div>
    </div>
  );
}
