# LabelAI: AI-Powered Ingredient Label Co-Pilot

## Overview
LabelAI is a Next.js application that helps users interpret food ingredient labels with structured, explainable AI output. Users can paste ingredient lists or upload product-label images for OCR extraction, then receive concise insights in a consistent C1 XML format.

The system combines:
- Client-side OCR using Tesseract.js
- Ingredient enrichment and conceptualization
- LLM-based structured reasoning via LangChain and Google Gemini
- A modern React UI for transparent, user-friendly interpretation

## Core Capabilities
- Ingredient analysis from pasted text input
- OCR-based text extraction from uploaded product label images
- Structured AI output using a strict C1 XML schema
- Evidence-aware explanation with uncertainty and trade-off framing
- Fallback ingredient retrieval from Open Food Facts when no input is provided
- Interactive rendering of insights, evidence, trade-offs, uncertainty, and suggestions

## Technology Stack
- Framework: Next.js 16 (App Router), React 19, TypeScript
- AI Orchestration: LangChain
- Model Provider: Google Gemini (`gemini-2.5-flash-lite`)
- OCR: Tesseract.js
- UI Libraries: `@crayonai/react-ui`, custom React components
- Data Utilities: lightweight rule-based conceptual mapping in `lib/websets.ts`

## Project Structure
```text
pjdey28-label-app/
	app/
		api/analyze/route.ts        # Analysis API endpoint
		components/                 # UI components (input, rendering, modal, OCR)
		globals.css                 # Global styles
		layout.tsx                  # Root layout
		page.tsx                    # Main app page
		providers.tsx               # Client providers wrapper
	lib/
		chains.ts                   # LangChain prompt + model runnable sequence
		openfoodfacts.ts            # Fallback ingredient source
		websets.ts                  # Ingredient conceptual mapping
	package.json
	tsconfig.json
	next.config.ts
```

## How It Works
1. User provides ingredient data by either:
- Pasting/editing text in the input panel, or
- Uploading a label image for OCR extraction.
2. The frontend submits ingredients to `POST /api/analyze`.
3. The API optionally enriches input using Open Food Facts when ingredients are empty.
4. Ingredients are conceptually mapped (for prompt context).
5. LangChain invokes Gemini with strict instructions to return valid C1 XML.
6. The UI parses XML and renders insights in dedicated sections.
7. If generation fails or output is invalid, the API returns a safe fallback C1 response so the UI does not break.

## C1 Output Schema
The application expects responses in this structure:

```xml
<C1>
	<Insight>...</Insight>
	<Evidence>...</Evidence>
	<Tradeoff>...</Tradeoff>
	<Uncertainty>...</Uncertainty>
	<Takeaway>...</Takeaway>
	<Suggestion>...</Suggestion>
	<AlternativeIngredient>...</AlternativeIngredient>
</C1>
```

## Prerequisites
- Node.js 20+
- npm (or compatible package manager)
- Google AI API key for Gemini access

## Environment Variables
Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

## Installation
```bash
npm install
```

## Run in Development
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build and Run in Production
```bash
npm run build
npm run start
```

## Linting
```bash
npm run lint
```

## API Reference
### `POST /api/analyze`
Accepts `multipart/form-data` with optional field:
- `ingredients` (string): comma-separated or free-text ingredient list

Behavior:
- If `ingredients` is provided, the API analyzes that input.
- If missing or empty, the API fetches a sample product from Open Food Facts and analyzes it.

Success response:
```json
{
	"c1": "<C1>...</C1>"
}
```

Error/fallback response:
```json
{
	"c1": "<C1><Insight ...>Unable to generate AI response.</Insight>...</C1>",
	"error": "<error_message>"
}
```

## Limitations
- OCR quality depends on image clarity, lighting, and text readability.
- Concept mapping in `lib/websets.ts` is intentionally lightweight and heuristic.
- Nutritional conclusions are advisory and should not be treated as medical guidance.
- The app currently focuses on explainability and UX, not regulatory-grade nutrition validation.

## Security and Operational Considerations
- Keep `GEMINI_API_KEY` server-side and never expose it in client code.
- Add rate limiting and abuse protection before public deployment.
- Add request validation and logging policies for production environments.

## Future Enhancements
- Stronger ingredient ontology and risk scoring
- Localization and multilingual OCR/analysis
- Product barcode scanning flow
- User profiles and dietary preference personalization
- Monitoring, analytics, and observability for model outputs
