import {
  type AuditIssuesView,
  type BillEntry,
  type ClaimData,
  type LegibilityIssueView,
  type NormalizedClaimViewModel,
  type PolicyViolationView,
  type SegmentPagesView,
} from '../types/claim';
import { toLabel } from './currency';

const safeNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const safeText = (value: unknown, fallback = '-'): string =>
  typeof value === 'string' && value.trim().length > 0 ? value : fallback;

export const getClaimedAmount = (data: ClaimData): number =>
  safeNumber(
    data.audit_analysis?.updated_claimed_amount,
    safeNumber(data.edited_data.patient_summary?.hospitalization_details?.claimed_amount),
  );

export const getActualBillsTotal = (data: ClaimData): number => {
  if (typeof data.audit_analysis?.true_total_of_bills === 'number') {
    return data.audit_analysis.true_total_of_bills;
  }

  return data.edited_data.nme_analysis.bills.reduce(
    (sum, billEntry) => sum + safeNumber(billEntry.bill.net_amount),
    0,
  );
};

export const getDiscrepancyAmount = (data: ClaimData): number => {
  if (typeof data.audit_analysis?.discrepancy_amount === 'number') {
    return data.audit_analysis.discrepancy_amount;
  }

  return getActualBillsTotal(data) - getClaimedAmount(data);
};

export const flattenPageRanges = (ranges: Array<{ start: number; end: number }>): number[] => {
  const pages: number[] = [];

  ranges.forEach((range) => {
    const start = Math.max(1, safeNumber(range.start, 1));
    const end = Math.max(start, safeNumber(range.end, start));

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
  });

  return Array.from(new Set(pages));
};

export const getSegmentPages = (data: ClaimData): SegmentPagesView[] => {
  const segments = data.segments?.aggregated_segments ?? {};

  return Object.entries(segments).map(([segmentType, segmentValue]) => ({
    segmentType,
    pages: flattenPageRanges(segmentValue.page_ranges ?? []),
  }));
};

const getLegibilityDetails = (data: ClaimData): LegibilityIssueView[] =>
  (data.audit_analysis?.medical_legibility?.flagged_items ?? []).map((item) => ({
    itemName: safeText(item.item_name),
    billId: safeText(item.bill_id),
    reason: safeText(item.flag_reason),
    recommendation: safeText(item.recommendation),
  }));

const getPolicyViolations = (data: ClaimData): PolicyViolationView[] =>
  (data.audit_analysis?.policy_violations ?? []).map((violation) => ({
    ruleName: safeText(violation.rule_name),
    itemName: safeText(violation.item_name),
    billId: safeText(violation.bill_id),
    details: safeText(violation.violation_details),
    amountImpacted: safeNumber(violation.amount_impacted),
    recommendation: safeText(violation.recommendation),
  }));

const getAuditIssues = (data: ClaimData): AuditIssuesView => ({
  medicalLegibilityCount: safeNumber(
    data.audit_analysis?.medical_legibility_issues,
    getLegibilityDetails(data).length,
  ),
  policyViolationCount: safeNumber(
    data.audit_analysis?.policy_violations_count,
    getPolicyViolations(data).length,
  ),
  legibilitySummary: safeText(data.audit_analysis?.medical_legibility?.summary),
  policyRemarks: safeText(data.audit_analysis?.policy_remarks),
  legibilityDetails: getLegibilityDetails(data),
  policyViolations: getPolicyViolations(data),
});

export const normalizeClaim = (data: ClaimData): NormalizedClaimViewModel => ({
  claimSummary: {
    claimId: safeText(data.claim_id),
    claimType: safeText(data.claim_type),
    status: safeText(data.status),
    claimedAmount: getClaimedAmount(data),
    actualBillsTotal: getActualBillsTotal(data),
    discrepancyAmount: getDiscrepancyAmount(data),
    discrepancyReason: safeText(data.audit_analysis?.discrepancy_reason),
  },
  patientInfo: {
    name: safeText(data.edited_data.patient_summary?.patient_details?.patient_name),
    dob: safeText(data.edited_data.patient_summary?.patient_details?.patient_dob),
    policyNumber: safeText(data.edited_data.patient_summary?.patient_details?.patient_policy_no),
    phone: safeText(data.edited_data.patient_summary?.patient_details?.patient_mobile),
    email: safeText(data.edited_data.patient_summary?.patient_details?.patient_email),
  },
  bills: data.edited_data.nme_analysis.bills ?? [],
  auditIssues: getAuditIssues(data),
  segments: getSegmentPages(data),
});

export const countNmeItems = (bills: BillEntry[]): number =>
  bills.reduce(
    (sum, billEntry) =>
      sum + billEntry.items.filter((item) => item.is_nme === true).length,
    0,
  );

export const formatSegmentLabel = (segmentType: string): string => toLabel(segmentType);
