"use client";

import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
interface OCRUploadProps {
  onExtract: (text: string) => void;
}

export default function OCRUpload({ onExtract }: OCRUploadProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);


      const result = await Tesseract.recognize(file, "eng");
      const text = result.data.text.trim();

      if (text) {
        onExtract(text);
        if (fileRef.current) fileRef.current.value = "";
        setPreview(null);
      } else {
        alert("No text found in image. Try a clearer photo.");
      }
    } catch (err) {
      console.error("OCR Error:", err);
      alert("OCR failed. Try a different image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label className="small muted">Upload product label</label>
      <div
        style={{
          marginTop: 8,
          padding: 12,
          border: "2px dashed #cbd5e1",
          borderRadius: 8,
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <div>
            <img
              src={preview}
              alt="preview"
              style={{ maxWidth: "100%", maxHeight: 120, borderRadius: 4 }}
            />
            <p className="small muted" style={{ margin: "8px 0 0 0" }}>
              {loading ? "Extracting text..." : "Click to change"}
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "24px", marginBottom: 4 }}>📷</div>
            <p className="small" style={{ margin: 0 }}>
              {loading ? "Processing..." : "Click to upload image"}
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={loading}
        />
      </div>
    </div>
  );
}
