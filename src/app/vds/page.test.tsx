import '@testing-library/jest-dom/vitest';
import React, { createElement } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mocks
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => createElement('img', props),
}));

vi.mock('../components/organisms/Header', () => ({
  __esModule: true,
  default: () => createElement('div', { 'data-testid': 'mock-header' }, 'Header'),
}));

vi.mock('../components/atoms/Button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) =>
    createElement('button', { ...props, tabIndex: 0 }, children),
}));

vi.mock('../components/organisms/Card', () => ({
  Card: (props: Record<string, unknown>) =>
    createElement('div', { 'data-testid': 'mock-card' }, JSON.stringify(props)),
  __esModule: true,
  default: (props: Record<string, unknown>) =>
    createElement('div', { 'data-testid': 'mock-card' }, JSON.stringify(props)),
}));

import VDSPage from './page';

describe('Visual Design System page', () => {
  it('renders header and main title', () => {
    render(<VDSPage />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /visual design system/i })).toBeInTheDocument();
  });

  it('shows buttons panel and typography panel headings', () => {
    render(<VDSPage />);
    expect(screen.getByRole('heading', { level: 2, name: /buttons/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /typography/i })).toBeInTheDocument();
  });

  it('renders cards panel with sample cards', () => {
    render(<VDSPage />);
    expect(screen.getByRole('heading', { level: 2, name: /cards/i })).toBeInTheDocument();
    const cards = screen.getAllByTestId('mock-card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
    expect(cards[0]).toHaveTextContent('Cosmic Explorer');
  });

  it('includes sample buttons', () => {
    render(<VDSPage />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });
});
