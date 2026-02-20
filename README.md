# Medical Claim Review Dashboard

A React single-page application for reviewing medical insurance claims. It loads extracted claim data (JSON) and a source PDF, then lets reviewers cross-check bills, NME (Non-Medical Expense) items, audit issues, and document segments against the original document with one-click navigation to PDF pages.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Architecture & Data Flow](#architecture--data-flow)
- [Data Model](#data-model)
- [Components](#components)
- [Utilities & Selectors](#utilities--selectors)
- [Configuration](#configuration)
- [Testing](#testing)
- [Accessibility & Resilience](#accessibility--resilience)
- [Public Assets](#public-assets)
- [Related documentation](#related-documentation)

---

## Features

- **Claim summary** — Claim ID, type, status, claimed amount, actual bills total, discrepancy amount and reason.
- **Patient info** — Name, DOB, policy number, phone, email.
- **Bills & NME** — Invoice-level bills with itemized lines; NME items highlighted and deduction reasons shown.
- **Audit issues** — Medical legibility flags and policy violations with details and recommendations.
- **Document segments** — Detected segment types (e.g. prescriptions, bills) mapped to PDF page numbers.
- **PDF viewer** — Source document viewer with smooth scroll-to-page when clicking “Page N” in bills or segments.
- **Retry** — Retry for claim data and PDF load failures.
- **Error boundary** — App-level error boundary with “Try again” to recover from render errors.
- **Accessibility** — Skip link, focus-visible styles, `aria-live`/`aria-busy` for loading, `role="alert"` for errors.

---

## Tech Stack

| Category        | Technology |
|----------------|------------|
| Runtime        | Browser (ES2020+) |
| UI             | React 18 |
| Language       | TypeScript 5.6 |
| Build          | Vite 5 |
| Styling        | Tailwind CSS 3, PostCSS, Autoprefixer |
| PDF            | react-pdf, pdfjs-dist 4.8.69 |
| Testing        | Vitest, Testing Library (React, user-event, jest-dom) |

---

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** 9+

---

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HealthPay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Vite will start and print the local URL (e.g. **http://localhost:5173**). Open it in your browser.

4. **Verify setup (optional)**
   - **Build:** `npm run build` — compiles TypeScript and produces the `dist/` folder.
   - **Tests:** `npm run test` — runs the Vitest test suite.

The app loads claim data from `public/assets/data.json` and the PDF from `public/assets/final.pdf`. Ensure these files exist (they are included in the repo). To use your own data, replace them or point the app at different URLs in the code.

---

## Scripts

| Command           | Description |
|-------------------|-------------|
| `npm run dev`     | Start Vite dev server (default: http://localhost:5173). |
| `npm run build`   | TypeScript compile (`tsc -b`) then production build. Output: `dist/`. |
| `npm run preview` | Serve the `dist/` build locally. |
| `npm run test`    | Run Vitest once. |
| `npm run test:watch` | Run Vitest in watch mode. |

---

## Project Structure

```
HealthPay/
├── index.html                 # Entry HTML; root div and script to main.tsx
├── package.json               # Dependencies and scripts
├── package-lock.json
├── vite.config.ts             # Vite + Vitest config, manual chunks
├── tailwind.config.ts         # Tailwind content paths and theme (dashboard colors, fonts)
├── postcss.config.js         # Tailwind + Autoprefixer
├── tsconfig.json             # References to app and node configs
├── tsconfig.app.json         # Compiler options for src/
├── tsconfig.node.json        # Compiler options for Vite/Tailwind config files
├── .gitignore
│
├── public/                   # Static assets (served at /)
│   └── assets/
│       ├── data.json         # Claim payload (see Data Model)
│       └── final.pdf         # Source claim PDF
│
└── src/
    ├── main.tsx              # React root, ErrorBoundary, global CSS
    ├── App.tsx               # Data fetch, normalized model, layout, skip link
    ├── index.css             # Tailwind directives, :root, scrollbar, focus-visible
    ├── vite-env.d.ts         # Vite client types
    │
    ├── types/
    │   └── claim.ts          # ClaimData, BillEntry, views, NormalizedClaimViewModel
    │
    ├── utils/
    │   ├── claimSelectors.ts # normalizeClaim, getClaimedAmount, getActualBillsTotal, etc.
    │   ├── currency.ts       # formatCurrency, formatDate, toLabel
    │   └── __tests__/
    │       └── claimSelectors.test.ts
    │
    ├── components/
    │   ├── SectionCard.tsx           # Reusable section with title/subtitle
    │   ├── ClaimSummaryCard.tsx      # Claim ID, type, status, amounts, discrepancy
    │   ├── PatientInfoCard.tsx       # Patient details (name, DOB, policy, phone, email)
    │   ├── BillsSection.tsx          # Bills list + tables, NME highlight, “Page N” buttons
    │   ├── AuditIssuesCard.tsx       # Legibility and policy violation blocks
    │   ├── DocumentSegmentsCard.tsx  # Segment types and page buttons
    │   ├── PdfPanel.tsx              # PDF viewer, scroll-to-page, retry on error
    │   ├── ErrorBoundary.tsx         # Class component error boundary with fallback
    │   └── __tests__/
    │       ├── BillsSection.test.tsx
    │       └── DocumentSegmentsCard.test.tsx
    │
    └── test/
        └── setup.ts          # Vitest setup: jest-dom, ResizeObserver mock
```

---

## Architecture & Data Flow

1. **Entry** — `index.html` loads `/src/main.tsx`. `main.tsx` mounts the app inside `StrictMode` and `ErrorBoundary`, and imports global CSS and react-pdf layer CSS.

2. **Data loading** — `App` fetches `/assets/data.json` on mount (via `loadData`). Loading and error state are stored in React state; on error the user can click **Retry** to call `loadData` again.

3. **Normalization** — Raw JSON is typed as `ClaimData`. `normalizeClaim(claimData)` in `claimSelectors.ts` produces a `NormalizedClaimViewModel` (camelCase view types, safe defaults, derived totals). This model is memoized from `claimData` and passed into presentational components.

4. **PDF** — `PdfPanel` receives `pdfUrl` (e.g. `/assets/final.pdf`) and `activePage`. When the user clicks “Page N” in `BillsSection` or `DocumentSegmentsCard`, `onJumpToPage(N)` is called; `App` sets `activePage`, and `PdfPanel` scrolls to that page and briefly highlights it. PDF worker is set once from `pdfjs-dist` (version must match the library; see package.json pin).

5. **Document title** — When `claimData.claim_id` is set, the browser tab title is updated to `Claim <id> — Medical Claim Review Dashboard`; it resets on cleanup.

---

## Data Model

### Raw API shape: `ClaimData`

- **Root:** `session_id`, `claim_id`, `status`, `claim_type`, `created_at`
- **edited_data**
  - **nme_analysis.bills:** `BillEntry[]` (bill metadata + `items: BillItem[]`)
  - **patient_summary:** optional patient, hospitalization, clinical details
- **audit_analysis:** optional amounts, discrepancy, legibility flags, policy violations
- **segments:** optional `aggregated_segments` (segment type → page ranges)
- **review_notes**, **validation_scores** (optional)

### Bill & item

- **BillEntry:** `bill` (e.g. `bill_id`, `bill_type`, `bill_date`, `invoice_number`, `net_amount`, `page_number`), `items: BillItem[]`
- **BillItem:** `item_name`, `category`, `final_amount`, `is_nme`, `nme_item_name`, `nme_bill_amount`, `deduction_reason`, etc.

### Normalized view (UI)

- **NormalizedClaimViewModel:** `claimSummary` (ClaimSummaryView), `patientInfo` (PatientInfoView), `bills` (BillEntry[]), `auditIssues` (AuditIssuesView), `segments` (SegmentPagesView[]).
- View types use camelCase and safe string/number fallbacks (e.g. `-`, `0`) so components never see `undefined` for required fields.

All types are defined in `src/types/claim.ts`.

---

## Components

| Component | Purpose |
|-----------|--------|
| **App** | Fetches claim JSON, normalizes to view model, holds `activePage`, renders header, skip link, `PdfPanel`, and claim section (loading/error/retry + cards). |
| **PdfPanel** | Renders react-pdf `Document`/`Page`, ResizeObserver for width, scroll-to-page and highlight when `activePage` changes, retry button on load error. |
| **SectionCard** | Wrapper: section with title, optional subtitle, and children. Used by all card components. |
| **ClaimSummaryCard** | Displays claim ID, type, status, claimed/actual/discrepancy amounts, discrepancy reason. |
| **PatientInfoCard** | Displays patient name, DOB, policy number, phone, email (uses `formatDate` for DOB). |
| **BillsSection** | One card per bill: header (invoice, date, amount, “Page N” if `page_number`), table of items with NME badge and deduction reason. |
| **AuditIssuesCard** | Counts for legibility and policy violations, summary/remarks, then lists legibility details and policy violation details. |
| **DocumentSegmentsCard** | Lists segment types (with `formatSegmentLabel`) and buttons “Page N”; active page is visually highlighted. |
| **ErrorBoundary** | Catches render errors in subtree, shows message and “Try again” to reset state and re-render. |

---

## Utilities & Selectors

### `src/utils/claimSelectors.ts`

- **normalizeClaim(data)** — Maps `ClaimData` → `NormalizedClaimViewModel` (summary, patient, bills, audit issues, segments).
- **getClaimedAmount(data)** — From audit or patient summary.
- **getActualBillsTotal(data)** — From audit or sum of bill `net_amount`.
- **getDiscrepancyAmount(data)** — From audit or derived.
- **flattenPageRanges(ranges)** — Expands `{ start, end }[]` to sorted unique page numbers.
- **getSegmentPages(data)** — Builds `SegmentPagesView[]` from `aggregated_segments`.
- **countNmeItems(bills)** — Counts items with `is_nme === true`.
- **formatSegmentLabel(segmentType)** — Uses `toLabel` for display (e.g. `some_type` → “Some Type”).

Uses internal `safeNumber`/`safeText` for defensive parsing.

### `src/utils/currency.ts`

- **formatCurrency(value)** — `Intl.NumberFormat` en-US, USD, 2 decimals.
- **formatDate(value)** — Parses string, returns `month short, day, year` or `-`/raw if invalid.
- **toLabel(value)** — Splits on `_`, capitalizes, joins with space.

---

## Configuration

### Vite (`vite.config.ts`)

- **Plugins:** `@vitejs/plugin-react`
- **Build:** Manual chunks: `pdf-viewer` (react-pdf, pdfjs-dist), `react-vendor` (react, react-dom); `chunkSizeWarningLimit: 600`
- **Test:** Vitest with `jsdom`, `globals: true`, `setupFiles: ./src/test/setup.ts`
- **Reference:** `/// <reference types="vitest/config" />` so Vite and Vitest share the file

### Tailwind (`tailwind.config.ts`)

- **Content:** `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- **Theme extend:**
  - **colors.dashboard:** `bg`, `card`, `ink`, `accent`, `muted`, `danger`, `dangerSoft`
  - **fontFamily.sans:** Source Sans 3, Segoe UI
  - **boxShadow.card:** custom card shadow

### TypeScript

- **tsconfig.json** — References only (`tsconfig.app.json`, `tsconfig.node.json`)
- **tsconfig.app.json** — App code: `include: ["src"]`, strict, ESNext, bundler, `noEmit: true`, `jsx: "react-jsx"`, `types: ["vite/client", "vitest/globals"]`
- **tsconfig.node.json** — Config files: `include: ["vite.config.ts", "tailwind.config.ts"]`

### PostCSS (`postcss.config.js`)

- `tailwindcss`, `autoprefixer`

---

## Testing

- **Runner:** Vitest (same config as Vite).
- **Setup:** `src/test/setup.ts` — imports `@testing-library/jest-dom/vitest`, mocks `ResizeObserver` with `vi.stubGlobal`.
- **Unit tests:**
  - **claimSelectors.test.ts** — `normalizeClaim`, getters, `flattenPageRanges`, `getSegmentPages`, `countNmeItems`, `formatSegmentLabel`.
  - **BillsSection.test.tsx** — Renders bills, NME row test id.
  - **DocumentSegmentsCard.test.tsx** — Renders segments and page buttons.

Run: `npm run test` or `npm run test:watch`.

---

## Accessibility & Resilience

- **Skip link** — “Skip to claim content” (sr-only until focus), targets `#claim-content`.
- **Live region** — Claim section has `aria-live="polite"` and `aria-busy={loading}`.
- **Errors** — Claim and PDF error blocks use `role="alert"`; both have retry actions.
- **Focus** — Global `:focus-visible` outline for buttons and links (see `index.css`).
- **Error boundary** — Catches runtime errors in the component tree and shows a fallback with “Try again”.

---

## Public Assets

Served from the project root in dev and from `dist/` in production (Vite copies `public/` into `dist/`).

| Path | Description |
|------|-------------|
| `/assets/data.json` | Single claim payload conforming to `ClaimData`. |
| `/assets/final.pdf` | Source claim PDF; linked from `App` as `pdfUrl`. |

To use another claim or PDF, replace these files or point the app at different URLs (e.g. by changing `DATA_URL` in `App.tsx` and the `pdfUrl` prop passed to `PdfPanel`).

---

## Related documentation

- **[docs/VIDEO_SCRIPT.md](docs/VIDEO_SCRIPT.md)** — Script for recording a walkthrough video of how the code works (entry point, data flow, PDF sync, components).

---

## License

Private. See repository or organization for terms.
