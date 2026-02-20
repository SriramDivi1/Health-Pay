import type { BillEntry } from '../types/claim';
import { formatCurrency, formatDate } from '../utils/currency';
import SectionCard from './SectionCard';

export interface BillsSectionProps {
  bills: BillEntry[];
  onJumpToPage: (page: number) => void;
}

const BillsSection = ({ bills, onJumpToPage }: BillsSectionProps) => (
  <SectionCard title="Bills" subtitle="Invoice-level details with itemized NME tagging">
    <div className="space-y-6">
      {bills.map((billEntry) => {
        const pageNumber = billEntry.bill.page_number;

        return (
          <article className="rounded-lg border border-slate-200" key={billEntry.bill.bill_id}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <div>
                <p className="font-semibold text-dashboard-ink">{billEntry.bill.invoice_number}</p>
                <p className="text-dashboard-muted">{formatDate(billEntry.bill.bill_date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-dashboard-ink">{formatCurrency(billEntry.bill.net_amount)}</p>
                {typeof pageNumber === 'number' ? (
                  <button
                    className="rounded-md border border-dashboard-accent px-2 py-1 text-xs font-semibold text-dashboard-accent transition hover:bg-dashboard-accent hover:text-white"
                    onClick={() => onJumpToPage(pageNumber)}
                    type="button"
                  >
                    Page {pageNumber}
                  </button>
                ) : null}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-dashboard-muted">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">NME</th>
                    <th className="px-3 py-2">Deduction Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {billEntry.items.map((item, index) => (
                    <tr
                      className={item.is_nme ? 'bg-dashboard-dangerSoft' : ''}
                      data-testid={item.is_nme ? 'nme-row' : undefined}
                      key={`${billEntry.bill.bill_id}-${item.item_id ?? index}`}
                    >
                      <td className="px-3 py-2 font-medium text-dashboard-ink">{item.item_name ?? '-'}</td>
                      <td className="px-3 py-2 text-dashboard-muted">{item.category ?? '-'}</td>
                      <td className="px-3 py-2 text-dashboard-ink">{formatCurrency(item.final_amount ?? 0)}</td>
                      <td className="px-3 py-2">
                        {item.is_nme ? (
                          <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-dashboard-danger">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-dashboard-muted">{item.deduction_reason ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        );
      })}
    </div>
  </SectionCard>
);

export default BillsSection;
