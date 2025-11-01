import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
	__esModule: true,
	default: (props: React.ComponentProps<'img'>) => React.createElement('img', props),
}));

vi.mock('./components/Header', () => ({
	__esModule: true,
	default: () => <div data-testid="mock-header">Header</div>,
}));

vi.mock('./components/UserProfile', () => ({
	__esModule: true,
	default: ({ walletAddress }: { walletAddress: string }) => (
		<div data-testid="mock-user-profile">{walletAddress}</div>
	),
}));

import Home from './page';

describe('Home page', () => {
	it('renders header, hero content, and footer', () => {
		render(<Home />);

		expect(screen.getByTestId('mock-header')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 1, name: /welcome to/i })).toBeInTheDocument();
		expect(screen.getByText('A Web3 bookstore, from authors to readers')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 2, name: /test area/i })).toBeInTheDocument();
		expect(screen.getByText(/building the future of reading/i)).toBeInTheDocument();
	});

	it('passes demo wallet address down to UserProfile', () => {
		render(<Home />);

		expect(screen.getByTestId('mock-user-profile')).toHaveTextContent('0x75C3d1F328d5Ce9fCFC29Dac48C8Ca64D1E745E1');
	});
});
