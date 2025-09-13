# Digital Solution Scorecard for Nonprofits

*A simple, nonprofit‑friendly scorecard to compare digital proposals and partners.*  
2 axes × 10 questions each + an optional “context” section. Exports CSV and a quadrant chart PNG. Fully editable questions so you can repurpose it as a general decision framework for many decisions (vendor selection, grant triage, feature prioritization, etc.).

> **License:** Code is MIT.  
> Icons: lucide‑react (ISC). React (MIT).

---

## Features
- **2D scoring** with quadrant chart (inline SVG)
- **Weights per question** (defaults are even)
- **Unlimited candidates/options**
- **CSV export** (scores + question/answer matrix)
- **Chart export** (PNG)
- **Inline editing** of questions/answers/categories
- **No backend** — single React component

---

## Quick start (Vite + React)

```bash
# 1) Create a React + TypeScript app
npm create vite@latest digital-rfp-scorecard -- --template react-ts
cd digital-rfp-scorecard

# 2) Install dependencies used by the component
npm i lucide-react

# 3) Use the component
#    Replace the contents of src/App.tsx with your single-file component
#    (or add the file as src/DigitalRFPScorecard.tsx and import it in App.tsx)

# 4) Run & build
npm run dev
npm run build
```

### Standard filename
Use **`src/App.tsx`** for the single-file version. That’s the conventional entry for Vite/CRA.  
If you plan to reuse this component across apps, you can name it **`src/DigitalRFPScorecard.tsx`** and `export default` it.

---

## Embedding options

### A) Easiest: embed as an `<iframe>`
1. Deploy the built `dist/` (e.g., GitHub Pages, Netlify).  
2. Paste this on any website:

```html
<iframe
  src="https://YOUR_USERNAME.github.io/digital-rfp-scorecard/"
  style="width:100%;height:800px;border:1px solid #ddd;border-radius:12px"
  loading="lazy"
  title="Digital RFP Scorecard"></iframe>
```

Optional auto-resize (if you control the parent page and can add a listener in the iframe app):
```html
<script>
  window.addEventListener("message", (e) => { if(e.data?.scorecardHeight){ 
    document.querySelector('iframe[title="Digital RFP Scorecard"]').style.height = e.data.scorecardHeight + "px";
  }});
</script>
```

### B) React sites: import the component
Copy the single file into your app and use it directly:

```tsx
import DigitalRFPScorecard from "./DigitalRFPScorecard"; // or from 'src/App'

export default function Page() { 
  return <DigitalRFPScorecard />; 
}
```

### C) Plain HTML (no React build tools)
Build a single bundle and drop it into any HTML page.

1) Add a tiny build script with **esbuild**:
```bash
npm i -D esbuild
```

```js
// scripts/build-iife.mjs
import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/DigitalRFPScorecard.tsx"],
  outfile: "dist/scorecard.iife.js",
  bundle: true,
  format: "iife",
  globalName: "DigitalRFPScorecard",
  jsx: "automatic",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  external: ["react", "react-dom"], // keep React external
});
```

Run it:
```bash
node scripts/build-iife.mjs
```

2) Use it in an HTML page:
```html
<div id="scorecard-root"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="/dist/scorecard.iife.js"></script>
<script>
  const root = ReactDOM.createRoot(document.getElementById("scorecard-root"));
  // The IIFE exposes window.DigitalRFPScorecard.default
  root.render(React.createElement(DigitalRFPScorecard.default));
</script>
```

> Note: `lucide-react` is bundled into the IIFE above, so you don't need to load it separately.

---

## Using templates (other decision frameworks)

You can repurpose this for many decisions (feature prioritization, vendor selection, grant triage, etc.).  
Each template mirrors the structure the app expects:

```ts
type Question = { id: string; attribute: string; question: string; answers: string[]; defaultWeight: number };
type EvaluationData = Record<string /* category name */, Question[]>;

// 2 main categories with 10 questions each + a 3rd "context" category with ~5 questions
```

**How to apply a template**
- Open `src/App.tsx` (or your component file) and find the `defaultEvaluationData` object.  
- Replace that object with one of the JSON templates in `/templates`.

**Templates in this repo**
- `templates/feature_prioritization.json`
- `templates/grant_triage.json`
- `templates/vendor_selection.json`

You can also create your own — just follow the same structure.

---

## Roadmap ideas
- Optional import/export of templates as JSON in the UI
- Save/load from localStorage
- Web component wrapper for no‑build embedding
- Print/PDF view

---

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md). We follow the [Contributor Covenant](CODE_OF_CONDUCT.md).

## Security
Please read [SECURITY.md](SECURITY.md) for how to report vulnerabilities.

## License
MIT © 2025 Vess N  
Icons: lucide‑react (ISC). React (MIT).
