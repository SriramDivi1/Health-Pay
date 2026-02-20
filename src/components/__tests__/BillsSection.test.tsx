import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BillsSection from '../BillsSection';

describe('BillsSection', () => {
  it('highlights NME rows and triggers page jump callback', () => {
    const onJumpToPage = vi.fn();

    render(
      <BillsSection
        bills={[
          {
            bill: {
              bill_id: 'bill-1',
              bill_type: 'itemized_bill',
              bill_date: '2025-02-01',
              invoice_number: 'INV-001',
              net_amount: 100,
              page_number: 7,
            },
            items: [
              {
                item_id: '1',
                item_name: 'Admission Fee',
                category: 'Admin',
                final_amount: 10,
                is_nme: true,
                deduction_reason: 'Not covered',
              },
              {
                item_id: '2',
                item_name: 'Consultation',
                category: 'Doctor',
                final_amount: 50,
                is_nme: false,
              },
            ],
          },
        ]}
        onJumpToPage={onJumpToPage}
      />,
    );

    const nmeRows = screen.getAllByTestId('nme-row');
    expect(nmeRows).toHaveLength(1);
    expect(nmeRows[0]).toHaveClass('bg-dashboard-dangerSoft');

    fireEvent.click(screen.getByRole('button', { name: 'Page 7' }));
    expect(onJumpToPage).toHaveBeenCalledWith(7);
  });
});
