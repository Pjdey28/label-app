/* 
"use client";

import { useState } from "react";
import { C1Component } from "@thesysai/genui-sdk";
//import Tesseract from "tesseract.js";
export default function Home() {
  const [c1Response, setC1Response] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runOCR(file: File) {
    const result = await Tesseract.recognize(file, "eng");
    return result.data.text;
  }
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const image = formData.get("image") as File;
    let ingredients = (formData.get("ingredients") as string)?.trim() || "";

    // OCR ONLY in browser, ONLY if image exists
     if (image && image.size > 0) {
      const ocrText = await runOCR(image);
      ingredients = ingredients
        ? `${ingredients}\n${ocrText}`
        : ocrText;
    

    const apiForm = new FormData();
    apiForm.append("ingredients", ingredients);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: apiForm,
    });

    const data = await res.json();
    setC1Response(data.c1);
    setLoading(false);
  }
  return (

      <main style={{ maxWidth: 1200, maxHeight: 4000, margin: "40px auto" , backgroundColor:'skyblue', padding: '20px', borderRadius: '8px', color: 'black' }}>
        <h1>LabelSense</h1>

        <form
          onSubmit={handleSubmit}
        >
          <input type="file" name="image" accept="image/*" />
          <br /><br />
          <textarea
            name="ingredients"
            placeholder="Or paste ingredients"
            rows={4}
            style={{ width: "100%", fontSize: 16, padding: '8px', border: '1px solid black' }}
          />
          <br /><br />
          <button type="submit">Analyze</button>
        </form>
        <button
  onClick={() =>
    setC1Response(`<C1>
      <Insight>This should render</Insight>
    </C1>`)
  }
>
  Force Render
</button>

        {c1Response && (
          <div style={{ marginTop: 40 }}>
            <C1Component c1Response={c1Response} isStreaming={false} />
          </div>
        )}
      </main>
  );
}
*/ 

"use client";

import { useState } from "react";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import { C1Renderer } from "./components/C1Renderer";

export default function Home() {
  const [c1Response, setC1Response] = useState<string | null>(null);

  return (
    <main className="container">
      <Header />

      <div className="grid">
        <div>
          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Results</h2>
            {!c1Response ? (
              <div className="muted">No analysis yet. Paste ingredients and click Analyze.</div>
            ) : (
              <C1Renderer c1Response={c1Response} />
            )}
          </div>
        </div>

        <aside>
          <InputPanel setC1Response={setC1Response} />
        </aside>
      </div>
    </main>
  );
}
