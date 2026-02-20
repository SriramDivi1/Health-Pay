import { useCallback, useEffect, useMemo, useState } from 'react';
import AuditIssuesCard from './components/AuditIssuesCard';
import BillsSection from './components/BillsSection';
import ClaimSummaryCard from './components/ClaimSummaryCard';
import DocumentSegmentsCard from './components/DocumentSegmentsCard';
import PatientInfoCard from './components/PatientInfoCard';
import PdfPanel from './components/PdfPanel';
import type { ClaimData } from './types/claim';
import { countNmeItems, normalizeClaim } from './utils/claimSelectors';

const DATA_URL = '/assets/data.json';

const App = () => {
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(DATA_URL);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const parsed = (await response.json()) as ClaimData;
      setClaimData(parsed);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Unknown data loading error';
      setError(`Unable to load claim data: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (claimData?.claim_id) {
      document.title = `Claim ${claimData.claim_id} — Medical Claim Review Dashboard`;
    }
    return () => {
      document.title = 'Medical Claim Review Dashboard';
    };
  }, [claimData?.claim_id]);

  const model = useMemo(() => (claimData ? normalizeClaim(claimData) : null), [claimData]);

  const handleJumpToPage = useCallback(
    (page: number) => {
      if (activePage === page) {
        setActivePage(null);
        window.setTimeout(() => setActivePage(page), 0);
        return;
      }

      setActivePage(page);
    },
    [activePage],
  );

  return (
    <main className="min-h-screen bg-dashboard-bg p-4 lg:p-5">
      <a
        href="#claim-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-dashboard-accent"
      >
        Skip to claim content
      </a>
      <div className="mx-auto max-w-[1800px]">
        <header className="mb-4 rounded-xl bg-gradient-to-r from-dashboard-accent to-teal-600 p-5 text-white shadow-card">
          <h1 className="text-2xl font-semibold">Medical Claim Review Dashboard</h1>
          <p className="mt-1 text-sm text-teal-50">Cross-check extracted claim data with source PDF pages.</p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
          <PdfPanel activePage={activePage} pdfUrl="/assets/final.pdf" />

          <section
            id="claim-content"
            className="max-h-[calc(100vh-2.5rem)] space-y-4 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-card"
            aria-live="polite"
            aria-busy={loading}
          >
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-dashboard-muted" aria-label="Loading claim data">
                <span className="size-5 animate-spin rounded-full border-2 border-dashboard-muted border-t-transparent" />
                <span>Loading claim data...</span>
              </div>
            ) : null}
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                <p>{error}</p>
                <button
                  type="button"
                  className="mt-2 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  onClick={() => void loadData()}
                >
                  Retry
                </button>
              </div>
            ) : null}

            {model ? (
              <>
                <ClaimSummaryCard summary={model.claimSummary} />
                <PatientInfoCard patient={model.patientInfo} />

                <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
                  <p className="font-semibold">Quick Stats</p>
                  <p>
                    Bills: {model.bills.length} | NME Items: {countNmeItems(model.bills)}
                  </p>
                </div>

                <BillsSection bills={model.bills} onJumpToPage={handleJumpToPage} />
                <AuditIssuesCard audit={model.auditIssues} />
                <DocumentSegmentsCard
                  activePage={activePage}
                  onJumpToPage={handleJumpToPage}
                  segments={model.segments}
                />
              </>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
