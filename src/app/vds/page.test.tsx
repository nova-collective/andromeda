import '@testing-library/jest-dom/vitest';
import React, { createElement } from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
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

  it('defaults to Atoms tab with typography & buttons headings', () => {
    render(<VDSPage />);
    // Atoms tab active by default
    expect(screen.getByRole('tab', { name: /atoms/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: /typography primary/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /buttons/i })).toBeInTheDocument();
  });

  it('renders cards after switching to Molecules tab', () => {
    render(<VDSPage />);
    const moleculesTab = screen.getByRole('tab', { name: /molecules/i });
    fireEvent.click(moleculesTab);
    expect(moleculesTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: /cards primary/i })).toBeInTheDocument();
    const cards = screen.getAllByTestId('mock-card');
    expect(cards.length).toBeGreaterThanOrEqual(2);
    expect(cards[0]).toHaveTextContent('Cosmic Explorer');
  });

  it('includes sample buttons in Atoms tab', () => {
    render(<VDSPage />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });
});
