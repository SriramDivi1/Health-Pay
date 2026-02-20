import { useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export interface PdfPanelProps {
  pdfUrl: string;
  activePage: number | null;
  onPageRendered?: (page: number) => void;
}

const PdfPanel = ({ pdfUrl, activePage, onPageRendered }: PdfPanelProps) => {
  const [numPages, setNumPages] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [highlightedPage, setHighlightedPage] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(760);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const pageWidth = useMemo(() => Math.max(260, Math.min(containerWidth - 32, 760)), [containerWidth]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activePage) {
      return;
    }

    const target = pageRefs.current[activePage];
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setHighlightedPage(activePage);

    const timer = window.setTimeout(() => {
      setHighlightedPage((current) => (current === activePage ? null : current));
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [activePage, numPages]);

  return (
    <div className="flex h-[50vh] min-h-[460px] flex-col rounded-xl border border-slate-200 bg-white shadow-card lg:h-[calc(100vh-2.5rem)]">
      <header className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-dashboard-ink">Source Document</h2>
        <p className="text-sm text-dashboard-muted">Compare extracted data against the original claim document.</p>
      </header>

      <div className="flex-1 overflow-y-auto bg-slate-100 p-4" ref={containerRef}>
        {loadError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            <p>{loadError}</p>
            <button
              type="button"
              className="mt-3 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              onClick={() => {
                setLoadError(null);
                setNumPages(0);
                setRetryKey((k) => k + 1);
              }}
            >
              Retry loading PDF
            </button>
          </div>
        ) : (
          <Document
            key={retryKey}
            file={pdfUrl}
            loading={<p className="text-sm text-dashboard-muted">Loading PDF...</p>}
            onLoadError={(error) => setLoadError(`Unable to load PDF: ${error.message}`)}
            onLoadSuccess={({ numPages: pages }) => {
              setNumPages(pages);
              setLoadError(null);
            }}
          >
            <div className="space-y-4">
              {Array.from({ length: numPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <div
                    className={`rounded-lg border p-2 transition ${
                      highlightedPage === pageNumber
                        ? 'border-dashboard-accent bg-teal-50 ring-2 ring-dashboard-accent'
                        : 'border-slate-200 bg-white'
                    }`}
                    key={`pdf-page-${pageNumber}`}
                    ref={(node) => {
                      pageRefs.current[pageNumber] = node;
                    }}
                  >
                    <p className="mb-2 text-xs font-semibold uppercase text-dashboard-muted">Page {pageNumber}</p>
                    <Page
                      pageNumber={pageNumber}
                      renderAnnotationLayer
                      renderTextLayer
                      width={pageWidth}
                      onRenderSuccess={() => onPageRendered?.(pageNumber)}
                    />
                  </div>
                );
              })}
            </div>
          </Document>
        )}
      </div>
    </div>
  );
};

export default PdfPanel;
