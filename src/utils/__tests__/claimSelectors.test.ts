import { describe, expect, it } from 'vitest';
import type { ClaimData } from '../../types/claim';
import {
  flattenPageRanges,
  getActualBillsTotal,
  getClaimedAmount,
  getDiscrepancyAmount,
  getSegmentPages,
  normalizeClaim,
} from '../claimSelectors';

const baseData: ClaimData = {
  session_id: 'session-1',
  claim_id: 'claim-123',
  status: 'OPEN',
  claim_type: 'OPD',
  created_at: '2026-02-16T15:38:50.985922+05:30',
  edited_data: {
    nme_analysis: {
      bills: [
        {
          bill: {
            bill_id: 'b1',
            bill_type: 'itemized_bill',
            bill_date: '2025-02-01',
            invoice_number: 'INV-001',
            net_amount: 100,
            page_number: 1,
          },
          items: [],
        },
        {
          bill: {
            bill_id: 'b2',
            bill_type: 'itemized_bill',
            bill_date: '2025-02-02',
            invoice_number: 'INV-002',
            net_amount: 50,
            page_number: 2,
          },
          items: [],
        },
      ],
    },
    patient_summary: {
      hospitalization_details: {
        claimed_amount: 80,
      },
      patient_details: {
        patient_name: 'John Doe',
        patient_dob: '1990-01-01',
        patient_policy_no: 'POL-1',
        patient_mobile: '123',
        patient_email: 'john@example.com',
      },
    },
  },
  audit_analysis: {
    true_total_of_bills: 150,
    updated_claimed_amount: 80,
    discrepancy_amount: 70,
    discrepancy_reason: 'Mismatch',
    medical_legibility_issues: 1,
    policy_violations_count: 0,
  },
  segments: {
    aggregated_segments: {
      itemized_bill: {
        page_ranges: [
          {
            start: 1,
            end: 1,
          },
          {
            start: 3,
            end: 4,
          },
        ],
      },
    },
  },
};

describe('claimSelectors', () => {
  it('uses claim amount from audit analysis when available', () => {
    expect(getClaimedAmount(baseData)).toBe(80);
  });

  it('falls back to sum of bill net amounts when true_total_of_bills is missing', () => {
    const withoutAuditTotal: ClaimData = {
      ...baseData,
      audit_analysis: {
        ...baseData.audit_analysis,
        true_total_of_bills: undefined,
      },
    };

    expect(getActualBillsTotal(withoutAuditTotal)).toBe(150);
  });

  it('computes discrepancy when discrepancy_amount is absent', () => {
    const withoutDiscrepancy: ClaimData = {
      ...baseData,
      audit_analysis: {
        ...baseData.audit_analysis,
        discrepancy_amount: undefined,
      },
    };

    expect(getDiscrepancyAmount(withoutDiscrepancy)).toBe(70);
  });

  it('flattens page ranges across single and multi-page spans', () => {
    expect(
      flattenPageRanges([
        { start: 2, end: 2 },
        { start: 5, end: 7 },
      ]),
    ).toEqual([2, 5, 6, 7]);
  });

  it('normalizes segments into labeled page arrays', () => {
    const segmentPages = getSegmentPages(baseData);
    expect(segmentPages).toEqual([
      {
        segmentType: 'itemized_bill',
        pages: [1, 3, 4],
      },
    ]);
  });

  it('builds model safely even when optional fields are missing', () => {
    const minimal: ClaimData = {
      ...baseData,
      audit_analysis: undefined,
      segments: undefined,
      edited_data: {
        ...baseData.edited_data,
        patient_summary: undefined,
      },
    };

    const model = normalizeClaim(minimal);
    expect(model.claimSummary.claimedAmount).toBe(0);
    expect(model.patientInfo.name).toBe('-');
    expect(model.segments).toEqual([]);
  });
});
