# 🏥 Medical Claim Review Dashboard

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<p align="center">
  <strong>A modern, responsive React single-page application for reviewing medical insurance claims.</strong>
</p>

---

## 🚀 Overview

The **Medical Claim Review Dashboard** loads extracted claim data (JSON) and a source PDF, allowing reviewers to effortlessly cross-check bills, NME (Non-Medical Expense) items, audit issues, and document segments against the original document with intuitive one-click navigation to PDF pages.

---

## ✨ Features

- 📊 **Comprehensive Claim Summary** — Instantly view Claim ID, type, status, claimed amount, actual bills total, discrepancy amount, and reason.
- 👤 **Patient Demographics** — Quick access to patient name, DOB, policy number, phone, and email.
- 🧾 **Itemized Bills & NME Tracking** — Granular invoice-level bills with itemized lines. NME items are highlighted seamlessly with deduction reasons.
- 🚨 **Audit Insights** — Medical legibility flags and policy violations visually highlighted with details and actionable recommendations.
- 📑 **Smart Document Segments** — Detected segment types (e.g., prescriptions, bills) automatically mapped to PDF page numbers.
- 🔍 **Integrated PDF Viewer** — Side-by-side source document viewer with smooth scroll-to-page capability directly from bills or segments.
- 🛡️ **Resilience & Recovery** — App-level error boundaries, fallback UIs, and robust retry mechanisms for both claim data and PDF load failures.
- ♿ **Accessible by Design** — Skip links, `focus-visible` states, ARIA liveregions for loading states, and built-in screen reader support.

---

## 🛠️ Tech Stack

| Category        | Technology |
|----------------|------------|
| **UI Library** | React 18 ⚛️ |
| **Language**   | TypeScript 5.6 🟦 |
| **Build Tool** | Vite 5 ⚡ |
| **Styling**    | Tailwind CSS 3 🎨 |
| **PDF Engine** | react-pdf, pdfjs-dist 4.8.69 📄 |
| **Testing**    | Vitest, Testing Library 🧪 |

---

## 🏗️ Architecture & Data Flow

```mermaid
graph TD
    A[index.html] -->|Loads| B[main.tsx]
    B -->|Mounts in ErrorBoundary| C[App.tsx]
    C -->|Fetches json & pdf| D[public/assets/]
    D -->|ClaimData URL| E[normalizeClaim()]
    E -->|NormalizedViewModel| F[UI Components]
    
    F -->|Renders| G[ClaimSummaryCard]
    F -->|Renders| H[BillsSection]
    F -->|Renders| I[DocumentSegmentsCard]
    
    H & I -->|onJumpToPage N| J[PdfPanel]
    J -->|Scrolls & Highlights| K[Target PDF Page]
```

<details>
<summary><strong>Explore the Data Model 🧩</strong></summary>

### Raw API shape: `ClaimData`
- **Root:** `session_id`, `claim_id`, `status`, `claim_type`, `created_at`
- **edited_data**
  - **nme_analysis.bills:** `BillEntry[]` (bill metadata + `items: BillItem[]`)
  - **patient_summary:** optional patient, hospitalization, clinical details
- **audit_analysis:** optional amounts, discrepancy, legibility flags, policy violations
- **segments:** optional `aggregated_segments` (segment type → page ranges)

### Normalized view (UI)
- **NormalizedClaimViewModel:** Data is strictly typed and securely cast into camelCase UI views (`claimSummary`, `patientInfo`, `bills`, `auditIssues`, `segments`) with safe string/number fallbacks for seamless component rendering.
</details>

---

## ⚙️ Setup & Installation

Follow these steps to get the dashboard running locally:

### 1. Prerequisites
- **Node.js** 18+ (recommended: 20+)
- **npm** 9+

### 2. Clone the repository
```bash
git clone <repository-url>
cd HealthPay
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the development server
```bash
npm run dev
```
> Vite will start and print the local URL (e.g. `http://localhost:5173`). Open it in your browser.

---

## 💻 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server. |
| `npm run build` | TypeScript compile (`tsc -b`) then production build. Outputs to `dist/`. |
| `npm run preview` | Serve the `dist/` build locally. |
| `npm run test` | Run the Vitest test suite once. |
| `npm run test:watch` | Run Vitest in watch mode for active development. |

---

## 📂 Project Structure

<details>
<summary>Click to expand folder structure</summary>

```text
HealthPay/
├── index.html                 # Entry point
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite + Vitest config
├── tailwind.config.ts         # Tailwind theme (colors, fonts)
├── public/                    # Static assets
│   └── assets/
│       ├── data.json          # Mock Claim payload
│       └── final.pdf          # Source claim PDF mock
└── src/
    ├── main.tsx               # React root 
    ├── App.tsx                # Data fetch, layout orchestrator
    ├── index.css              # Tailwind directives & overrides
    ├── types/                 # TypeScript models (ClaimData, Views)
    ├── utils/                 # Data normalizers, formatters
    ├── components/            # UI components (Cards, PdfPanel, etc.)
    └── test/                  # Vitest setup
```
</details>

---

## 🧪 Testing

The app is rigorously tested using **Vitest** and **Testing Library**.
- Run `npm run test` to verify selectors, components, and utilities isolated with test mocks.
- Test environments utilize `@testing-library/jest-dom/vitest`.

---

## 📁 Public Assets

The app expects two files to be present during local dev or production:
- `/assets/data.json` - Single claim payload conforming to `ClaimData`.
- `/assets/final.pdf` - Target PDF corresponding to JSON claims.
*Note: To replace mock data with real data, swap out these files or change the endpoints in `App.tsx`.*

---

## 📜 License

Private. See repository or organization for terms.
