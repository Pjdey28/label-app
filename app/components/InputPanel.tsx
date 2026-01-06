"use client";

import { useState } from "react";
import OCRUpload from "./OCRUpload";

export default function InputPanel({ setC1Response }: { setC1Response: (s: string | null) => void }) {
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);

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

  const handleOCRExtract = (text: string) => {
    setIngredients((prev) => (prev ? `${prev}\n${text}` : text));
  };

  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>Analyze Ingredients</h3>

      <OCRUpload onExtract={handleOCRExtract} />

      <form onSubmit={handleSubmit}>
        <label className="small muted">Paste or edit ingredients</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={5}
          style={{ width: "100%", marginTop: 8, marginBottom: 12 }}
          placeholder="e.g. wheat flour, sugar, salt, palm oil"
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" type="submit" disabled={loading || !ingredients.trim()}>
            {loading ? "Analyzing…" : "Analyze"}
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => setC1Response(`<C1>
  <Insight emphasis="high">This is a test of the insight rendering system.</Insight>
  <Evidence>Test evidence shows how the component handles structured data.</Evidence>
  <Tradeoff>Trade-off: Test data vs. real analysis.</Tradeoff>
  <Uncertainty>This is a test, so uncertainty is high.</Uncertainty>
  <Takeaway>Use real ingredients for accurate results.</Takeaway>
  <Suggestion>Try uploading a real product label or pasting ingredients.</Suggestion>
  <AlternativeIngredient>Test alternatives</AlternativeIngredient>
</C1>`)}
          >
            Test Render
          </button>
        </div>
      </form>

      <hr style={{ margin: "14px 0" }} />
      <div className="small muted">
                  <p className="small" style={{ margin: 0 }}>
             <strong>Important:</strong> Test Render is for testing purposes only and may not reflect real analysis.
          </p>
      </div>
    </div>
  );
}
