export interface ClaimData {
  session_id: string;
  claim_id: string;
  status: string;
  claim_type: string;
  created_at: string;
  edited_data: {
    nme_analysis: {
      bills: BillEntry[];
    };
    patient_summary?: PatientSummary;
  };
  audit_analysis?: AuditAnalysis;
  segments?: {
    aggregated_segments?: SegmentMap;
  };
  review_notes?: string;
  validation_scores?: Record<string, number | string | boolean | null>;
}

export interface BillEntry {
  bill: {
    bill_id: string;
    bill_type: string;
    bill_date: string;
    invoice_number: string;
    net_amount: number;
    total_discount?: number;
    facility_details?: {
      name?: string;
    };
    page_number?: number;
  };
  items: BillItem[];
}

export interface BillItem {
  's.no.'?: number;
  item_id?: string;
  item_name?: string;
  category?: string;
  final_amount?: number;
  is_nme?: boolean;
  nme_item_name?: string;
  nme_bill_amount?: number;
  deduction_reason?: string;
}

export interface PatientSummary {
  patient_details?: PatientDetails;
  hospitalization_details?: HospitalizationDetails;
  clinical_details?: ClinicalDetails;
}

export interface PatientDetails {
  patient_name?: string;
  patient_mobile?: string;
  patient_email?: string;
  patient_dob?: string;
  patient_policy_no?: string;
}

export interface HospitalizationDetails {
  claimed_amount?: number;
  [key: string]: unknown;
}

export interface ClinicalDetails {
  [key: string]: unknown;
}

export interface LegibilityFlag {
  item_name?: string;
  bill_id?: string;
  flag_reason?: string;
  recommendation?: string;
}

export interface PolicyViolation {
  rule_name?: string;
  item_name?: string;
  bill_id?: string;
  item_s_no?: number;
  violation_details?: string;
  amount_impacted?: number;
  recommendation?: string;
}

export interface AuditAnalysis {
  original_claimed_amount?: number;
  original_total_of_bills?: number;
  updated_claimed_amount?: number;
  true_total_of_bills?: number;
  discrepancy_amount?: number;
  status?: string;
  discrepancy_reason?: string;
  medical_legibility_issues?: number;
  policy_violations_count?: number;
  policy_remarks?: string;
  medical_legibility?: {
    prescription_bill_match?: boolean;
    diagnosis_treatment_consistent?: boolean;
    flagged_items?: LegibilityFlag[];
    summary?: string;
  };
  policy_violations?: PolicyViolation[];
}

export interface PageRange {
  start: number;
  end: number;
}

export type SegmentMap = Record<string, { page_ranges: PageRange[] }>;

export interface ClaimSummaryView {
  claimId: string;
  claimType: string;
  status: string;
  claimedAmount: number;
  actualBillsTotal: number;
  discrepancyAmount: number;
  discrepancyReason: string;
}

export interface PatientInfoView {
  name: string;
  dob: string;
  policyNumber: string;
  phone: string;
  email: string;
}

export interface LegibilityIssueView {
  itemName: string;
  billId: string;
  reason: string;
  recommendation: string;
}

export interface PolicyViolationView {
  ruleName: string;
  itemName: string;
  billId: string;
  details: string;
  amountImpacted: number;
  recommendation: string;
}

export interface AuditIssuesView {
  medicalLegibilityCount: number;
  policyViolationCount: number;
  legibilitySummary: string;
  policyRemarks: string;
  legibilityDetails: LegibilityIssueView[];
  policyViolations: PolicyViolationView[];
}

export interface SegmentPagesView {
  segmentType: string;
  pages: number[];
}

export interface NormalizedClaimViewModel {
  claimSummary: ClaimSummaryView;
  patientInfo: PatientInfoView;
  bills: BillEntry[];
  auditIssues: AuditIssuesView;
  segments: SegmentPagesView[];
}
