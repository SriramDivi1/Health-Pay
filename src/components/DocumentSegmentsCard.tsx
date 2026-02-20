import type { SegmentPagesView } from '../types/claim';
import { formatSegmentLabel } from '../utils/claimSelectors';
import SectionCard from './SectionCard';

export interface DocumentSegmentsCardProps {
  segments: SegmentPagesView[];
  onJumpToPage: (page: number) => void;
  activePage: number | null;
}

const DocumentSegmentsCard = ({
  segments,
  onJumpToPage,
  activePage,
}: DocumentSegmentsCardProps) => (
  <SectionCard title="Document Segments" subtitle="Detected document types and source pages">
    <div className="space-y-3">
      {segments.map((segment) => (
        <div className="rounded-md border border-slate-200 p-3" key={segment.segmentType}>
          <p className="text-sm font-semibold text-dashboard-ink">{formatSegmentLabel(segment.segmentType)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {segment.pages.map((page) => (
              <button
                className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
                  activePage === page
                    ? 'border-dashboard-accent bg-dashboard-accent text-white'
                    : 'border-slate-300 text-slate-700 hover:border-dashboard-accent hover:text-dashboard-accent'
                }`}
                key={`${segment.segmentType}-${page}`}
                onClick={() => onJumpToPage(page)}
                type="button"
              >
                Page {page}
              </button>
            ))}
          </div>
        </div>
      ))}
      {segments.length === 0 ? (
        <p className="rounded-md border border-slate-200 p-3 text-sm text-dashboard-muted">No segments available.</p>
      ) : null}
    </div>
  </SectionCard>
);

export default DocumentSegmentsCard;
