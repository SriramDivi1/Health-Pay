<div align="center">
  <h1>🏥 HealthPay</h1>
  <p><strong>Medical Claim Review Dashboard</strong></p>
  <p>
    <a href="https://health-pay-three.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-available-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  </p>
</div>

<br/>

> A blazing-fast React single-page application for reviewing medical insurance claims. Effortlessly cross-check extracted claim data against source PDFs with smart, one-click document navigation. 🚀

---

## ✨ Features

- **📊 Claim Summary** — Get comprehensive details at a glance: Claim ID, type, status, total claimed, actual bills, and discrepancy reasons.
- **👤 Patient Info** — Direct access to vital patient demographics and policy details.
- **🧾 Smart Bills & NME Highlight** — Invoice-level itemization with automatic highlighting of Non-Medical Expenses (NME) and corresponding deduction reasons.
- **⚠️ Audit & Compliance** — Automatic flagging of medical legibility issues and policy violations, complete with actionable recommendations.
- **🔍 Intelligent Document Segmentation** — Detects document types (e.g., prescriptions, bills) and maps them seamlessly to the correct PDF pages.
- **📄 Interactive PDF Viewer** — View the original source document alongside the data. Click any "Page N" button in the app, and the PDF smoothly scrolls into view.
- **🛡️ Built-in Resilience** — App-level error boundaries with integrated retry capabilities ensure a seamless, crash-free review process.

## 🛠️ Tech Stack

| Category        | Technology |
|----------------|------------|
| **Core UI**    | React 18, TypeScript 5.6 |
| **Build Tool** | Vite 5 |
| **Styling**    | Tailwind CSS 3, PostCSS |
| **PDF Engine** | `react-pdf`, `pdfjs-dist` (v4.8.69) |
| **Testing**    | Vitest, Testing Library |

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+ (20+ recommended)
- **npm**: v9+

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/SriramDivi1/Health-Pay.git
   cd Health-Pay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Spin up the development server**
   ```bash
   npm run dev
   ```
   *Vite will start a local server (typically at `http://localhost:5173`). Open the link in your browser to view the app!*

## 📁 Project Structure highlights

```text
src/
├── components/          # Modular React components (Cards, Panels, Sections)
├── types/               # TypeScript interfaces (ClaimData, Normalizations)
├── utils/               # Selectors, currency formatters, normalizers
├── App.tsx              # Main layout, data fetching, and PDF sync logic
└── main.tsx             # Entry point with global providers & Error Boundary
```

## 🧠 Architecture & Data Flow

1. **Hydration**: The app fetches `data.json` on mount, seamlessly resolving parsing and loading states.
2. **Data Normalization**: `claimSelectors.ts` sanitizes raw JSON into a highly typed `NormalizedClaimViewModel`, ensuring zero `undefined` errors in the presentation layer.
3. **PDF Sync Engine**: The custom `<PdfPanel />` listens to `activePage` state changes via React. Clicking "Page N" anywhere in the app instantly triggers a smooth scroll to the exact document location.

## 🧪 Testing

We believe in reliable software. Run the test suite powered by Vitest to ensure everything works perfectly.

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## ♿ Accessibility First

We've built HealthPay referencing modern accessibility standards to ensure an inclusive user experience:
- **Skip Links** for keyboard navigation.
- **ARIA Live Regions** (`aria-live`, `aria-busy`) for screen readers during loading phases.
- **Focus Rings** utilizing `:focus-visible` for clear UI states.
- Clean semantic HTML structure.

---

<div align="center">
  <i>Built with ❤️ to streamline healthcare workflows.</i>
</div>
