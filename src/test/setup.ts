import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
  observe() {
    return;
  }

  unobserve() {
    return;
  }

  disconnect() {
    return;
  }
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
