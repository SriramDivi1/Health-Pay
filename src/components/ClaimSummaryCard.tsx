import type { ClaimSummaryView } from '../types/claim';
import { formatCurrency } from '../utils/currency';
import SectionCard from './SectionCard';

interface ClaimSummaryCardProps {
  summary: ClaimSummaryView;
}

const ClaimSummaryCard = ({ summary }: ClaimSummaryCardProps) => (
  <SectionCard title="Claim Summary" subtitle="Core claim status and amount comparison">
    <div className="grid gap-3 text-sm sm:grid-cols-2">
      <div className="rounded-md bg-slate-50 p-3">
        <p className="text-xs uppercase text-dashboard-muted">Claim ID</p>
        <p className="font-semibold text-dashboard-ink">{summary.claimId}</p>
      </div>
      <div className="rounded-md bg-slate-50 p-3">
        <p className="text-xs uppercase text-dashboard-muted">Type</p>
        <p className="font-semibold text-dashboard-ink">{summary.claimType}</p>
      </div>
      <div className="rounded-md bg-slate-50 p-3">
        <p className="text-xs uppercase text-dashboard-muted">Status</p>
        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
          {summary.status}
        </span>
      </div>
      <div className="rounded-md bg-slate-50 p-3">
        <p className="text-xs uppercase text-dashboard-muted">Claimed Amount</p>
        <p className="font-semibold text-dashboard-ink">{formatCurrency(summary.claimedAmount)}</p>
      </div>
      <div className="rounded-md bg-slate-50 p-3">
        <p className="text-xs uppercase text-dashboard-muted">Actual Bills Total</p>
        <p className="font-semibold text-dashboard-ink">{formatCurrency(summary.actualBillsTotal)}</p>
      </div>
      <div className="rounded-md bg-red-50 p-3">
        <p className="text-xs uppercase text-red-600">Discrepancy Amount</p>
        <p className="font-semibold text-red-700">{formatCurrency(summary.discrepancyAmount)}</p>
      </div>
    </div>
    <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <p className="text-xs font-semibold uppercase tracking-wide">Discrepancy Reason</p>
      <p className="mt-1 leading-relaxed">{summary.discrepancyReason}</p>
    </div>
  </SectionCard>
);

export default ClaimSummaryCard;
