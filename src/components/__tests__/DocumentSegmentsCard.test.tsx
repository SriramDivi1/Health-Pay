import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DocumentSegmentsCard from '../DocumentSegmentsCard';

describe('DocumentSegmentsCard', () => {
  it('renders pages and calls jump handler when page is clicked', () => {
    const onJumpToPage = vi.fn();

    render(
      <DocumentSegmentsCard
        activePage={6}
        onJumpToPage={onJumpToPage}
        segments={[
          {
            segmentType: 'investigation_report',
            pages: [6, 11, 12],
          },
        ]}
      />,
    );

    const pageButton = screen.getByRole('button', { name: 'Page 11' });
    expect(pageButton).toBeInTheDocument();

    fireEvent.click(pageButton);
    expect(onJumpToPage).toHaveBeenCalledWith(11);
  });
});
