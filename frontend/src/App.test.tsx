import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the useMidnight hook
vi.mock('./hooks/useMidnight', () => ({
  useMidnight: () => ({
    address: '0x123',
    network: 'preview',
    expectedNetwork: 'preview',
    isConnecting: false,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    clearError: vi.fn(),
    wallet: null,
  }),
}));

describe('App Component Smoke Test', () => {
  it('renders without crashing and displays Midnight Legacy text', () => {
    render(<App />);
    expect(screen.getAllByText(/MIDNIGHT/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/LEGACY/i).length).toBeGreaterThan(0);
  });
});
