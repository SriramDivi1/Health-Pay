import type { PatientInfoView } from '../types/claim';
import { formatDate } from '../utils/currency';
import SectionCard from './SectionCard';

interface PatientInfoCardProps {
  patient: PatientInfoView;
}

const PatientInfoCard = ({ patient }: PatientInfoCardProps) => (
  <SectionCard title="Patient Info">
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <div className="rounded-md bg-slate-50 p-3">
        <dt className="text-xs uppercase text-dashboard-muted">Name</dt>
        <dd className="font-semibold text-dashboard-ink">{patient.name}</dd>
      </div>
      <div className="rounded-md bg-slate-50 p-3">
        <dt className="text-xs uppercase text-dashboard-muted">DOB</dt>
        <dd className="font-semibold text-dashboard-ink">{formatDate(patient.dob)}</dd>
      </div>
      <div className="rounded-md bg-slate-50 p-3">
        <dt className="text-xs uppercase text-dashboard-muted">Policy Number</dt>
        <dd className="font-semibold text-dashboard-ink">{patient.policyNumber}</dd>
      </div>
      <div className="rounded-md bg-slate-50 p-3">
        <dt className="text-xs uppercase text-dashboard-muted">Phone</dt>
        <dd className="font-semibold text-dashboard-ink">{patient.phone}</dd>
      </div>
      <div className="rounded-md bg-slate-50 p-3 sm:col-span-2">
        <dt className="text-xs uppercase text-dashboard-muted">Email</dt>
        <dd className="font-semibold text-dashboard-ink">{patient.email}</dd>
      </div>
    </dl>
  </SectionCard>
);

export default PatientInfoCard;
