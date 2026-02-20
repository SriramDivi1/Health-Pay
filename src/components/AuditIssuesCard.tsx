import type { AuditIssuesView } from '../types/claim';
import { formatCurrency } from '../utils/currency';
import SectionCard from './SectionCard';

interface AuditIssuesCardProps {
  audit: AuditIssuesView;
}

const AuditIssuesCard = ({ audit }: AuditIssuesCardProps) => (
  <SectionCard title="Audit Issues" subtitle="Medical legibility flags and policy violations">
    <div className="mb-4 grid gap-3 text-sm sm:grid-cols-2">
      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs uppercase text-dashboard-muted">Medical Legibility Flags</p>
        <p className="mt-1 text-xl font-semibold text-dashboard-ink">{audit.medicalLegibilityCount}</p>
      </div>
      <div className="rounded-md border border-red-200 bg-red-50 p-3">
        <p className="text-xs uppercase text-red-600">Policy Violations</p>
        <p className="mt-1 text-xl font-semibold text-red-700">{audit.policyViolationCount}</p>
      </div>
    </div>

    <div className="space-y-3 text-sm">
      <div className="rounded-md border border-slate-200 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-dashboard-muted">Legibility Summary</p>
        <p className="mt-1 text-dashboard-ink">{audit.legibilitySummary}</p>
      </div>
      <div className="rounded-md border border-slate-200 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-dashboard-muted">Policy Remarks</p>
        <p className="mt-1 text-dashboard-ink">{audit.policyRemarks}</p>
      </div>
    </div>

    <div className="mt-4 space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-dashboard-ink">Legibility Details</h3>
        <div className="space-y-2 text-sm">
          {audit.legibilityDetails.map((issue, index) => (
            <div className="rounded-md border border-slate-200 p-3" key={`${issue.billId}-${issue.itemName}-${index}`}>
              <p className="font-semibold text-dashboard-ink">{issue.itemName}</p>
              <p className="text-dashboard-muted">Bill ID: {issue.billId}</p>
              <p className="text-dashboard-ink">Reason: {issue.reason}</p>
              <p className="text-dashboard-muted">Recommendation: {issue.recommendation}</p>
            </div>
          ))}
          {audit.legibilityDetails.length === 0 ? (
            <p className="rounded-md border border-slate-200 p-3 text-dashboard-muted">No legibility issues found.</p>
          ) : null}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-dashboard-ink">Policy Violation Details</h3>
        <div className="space-y-2 text-sm">
          {audit.policyViolations.map((violation, index) => (
            <div className="rounded-md border border-red-200 bg-red-50 p-3" key={`${violation.billId}-${violation.itemName}-${index}`}>
              <p className="font-semibold text-red-800">{violation.itemName}</p>
              <p className="text-red-700">Rule: {violation.ruleName}</p>
              <p className="text-red-700">Bill ID: {violation.billId}</p>
              <p className="text-red-700">Details: {violation.details}</p>
              <p className="text-red-700">Amount Impacted: {formatCurrency(violation.amountImpacted)}</p>
              <p className="text-red-700">Recommendation: {violation.recommendation}</p>
            </div>
          ))}
          {audit.policyViolations.length === 0 ? (
            <p className="rounded-md border border-slate-200 p-3 text-dashboard-muted">No policy violations found.</p>
          ) : null}
        </div>
      </div>
    </div>
  </SectionCard>
);

export default AuditIssuesCard;
