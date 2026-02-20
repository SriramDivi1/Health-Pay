import { type PropsWithChildren } from 'react';

interface SectionCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
}

const SectionCard = ({ title, subtitle, children }: SectionCardProps) => (
  <section className="rounded-xl border border-slate-200 bg-dashboard-card p-5 shadow-card">
    <header className="mb-4 border-b border-slate-100 pb-3">
      <h2 className="text-lg font-semibold text-dashboard-ink">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-dashboard-muted">{subtitle}</p> : null}
    </header>
    {children}
  </section>
);

export default SectionCard;
