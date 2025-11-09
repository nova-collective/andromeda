import '@testing-library/jest-dom/vitest';
import React, { createElement } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// Mock Next.js Image component
vi.mock('next/image', () => ({
	__esModule: true,
	default: (props: React.ComponentProps<'img'>) => createElement('img', props),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		a: ({ children, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => 
			createElement('a', props, children),
		button: ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => 
			createElement('button', props, children),
	},
}));

import Card from './Card';

describe('Card component', () => {
	const defaultProps = {
		image: '/test-image.jpg',
		title: 'Test NFT #123',
		price: '2.5 ETH',
	};

	it('renders with required props only', () => {
		render(<Card {...defaultProps} />);

		expect(screen.getByText('Test NFT #123')).toBeInTheDocument();
		expect(screen.getByText('2.5 ETH')).toBeInTheDocument();
		expect(screen.getByText('Current Price')).toBeInTheDocument();
		expect(screen.getByAltText('Test NFT #123')).toBeInTheDocument();
	});

	it('renders with all optional props', () => {
		render(
			<Card
				{...defaultProps}
				collection="Test Collection"
				lastPrice="2.1 ETH"
				likes={142}
				href="/item/123"
			/>
		);

		expect(screen.getByText('Test Collection')).toBeInTheDocument();
		expect(screen.getByText('Last Sale')).toBeInTheDocument();
		expect(screen.getByText('2.1 ETH')).toBeInTheDocument();
		expect(screen.getByText('142')).toBeInTheDocument();
	});

	it('renders as a link with correct href', () => {
		render(<Card {...defaultProps} href="/item/456" />);

		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/item/456');
	});

	it('uses default href when not provided', () => {
		render(<Card {...defaultProps} />);

		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '#');
	});

	it('does not render last price section when lastPrice is not provided', () => {
		render(<Card {...defaultProps} />);

		expect(screen.queryByText('Last Sale')).not.toBeInTheDocument();
	});

	it('does not render collection when not provided', () => {
		render(<Card {...defaultProps} />);

		expect(screen.queryByText(/Collection/)).not.toBeInTheDocument();
	});

	it('does not render like count badge when likes is 0', () => {
		render(<Card {...defaultProps} likes={0} />);

		// Should not show the like count badge (bottom right)
		// The heart icon in the action button is different from the badge
		expect(screen.queryByText('0')).not.toBeInTheDocument();
	});

	it('renders like count badge when likes is greater than 0', () => {
		render(<Card {...defaultProps} likes={42} />);

		expect(screen.getByText('42')).toBeInTheDocument();
	});

	it('toggles like state when like button is clicked', async () => {
		const user = userEvent.setup();
		render(<Card {...defaultProps} likes={10} />);

		// Initially shows 10 likes
		expect(screen.getByText('10')).toBeInTheDocument();

		// Find all buttons and get the first one (like button)
		const buttons = screen.getAllByRole('button');
		const likeButton = buttons[0]; // First button is the like button

		// Click like button
		await user.click(likeButton);

		// Like count should increase
		await waitFor(() => {
			expect(screen.getByText('11')).toBeInTheDocument();
		});

		// Click again to unlike
		await user.click(likeButton);

		// Like count should decrease back
		await waitFor(() => {
			expect(screen.getByText('10')).toBeInTheDocument();
		});
	});

	it('prevents navigation when like button is clicked', async () => {
		const user = userEvent.setup();
		const href = '/item/789';
		render(<Card {...defaultProps} likes={5} href={href} />);

		const buttons = screen.getAllByRole('button');
		const likeButton = buttons[0];

		// Click like button should not trigger navigation
		await user.click(likeButton);

		// The link should still exist (not navigated)
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', href);
	});

	it('displays correct like count after multiple toggles', async () => {
		const user = userEvent.setup();
		render(<Card {...defaultProps} likes={100} />);

		const buttons = screen.getAllByRole('button');
		const likeButton = buttons[0];

		// Like (increase)
		await user.click(likeButton);
		await waitFor(() => expect(screen.getByText('101')).toBeInTheDocument());

		// Unlike (decrease)
		await user.click(likeButton);
		await waitFor(() => expect(screen.getByText('100')).toBeInTheDocument());

		// Like again
		await user.click(likeButton);
		await waitFor(() => expect(screen.getByText('101')).toBeInTheDocument());
	});

	it('renders with very long title (should truncate)', () => {
		const longTitle = 'This is a very long NFT title that should be truncated with an ellipsis';
		render(<Card {...defaultProps} title={longTitle} />);

		const titleElement = screen.getByText(longTitle);
		expect(titleElement).toBeInTheDocument();
		expect(titleElement).toHaveClass('truncate');
	});

	it('renders with large like count', () => {
		render(<Card {...defaultProps} likes={9999} />);

		expect(screen.getByText('9999')).toBeInTheDocument();
	});

	it('has correct CSS classes for styling', () => {
		const { container } = render(<Card {...defaultProps} />);

		const cardLink = container.querySelector('a');
		expect(cardLink).toHaveClass('group', 'block');

		const cardContainer = container.querySelector('.rounded-2xl');
		expect(cardContainer).toBeInTheDocument();
	});

	it('renders image with correct alt text', () => {
		render(<Card {...defaultProps} title="Amazing Artwork" />);

		const image = screen.getByAltText('Amazing Artwork');
		expect(image).toBeInTheDocument();
	});

	it('renders multiple action buttons', () => {
		render(<Card {...defaultProps} />);

		const buttons = screen.getAllByRole('button');
		// Should have like button and more options button
		expect(buttons.length).toBeGreaterThanOrEqual(2);
	});

	it('handles rapid like button clicks', async () => {
		const user = userEvent.setup();
		render(<Card {...defaultProps} likes={5} />);

		const buttons = screen.getAllByRole('button');
		const likeButton = buttons[0];

		// Click rapidly multiple times
		await user.click(likeButton);
		await user.click(likeButton);
		await user.click(likeButton);
		await user.click(likeButton);

		// Should end up back at original count (even number of toggles)
		await waitFor(() => {
			expect(screen.getByText('5')).toBeInTheDocument();
		});
	});

	it('renders image with correct source', () => {
		render(<Card {...defaultProps} image="/custom-image.png" />);

		const image = screen.getByAltText(defaultProps.title);
		expect(image).toHaveAttribute('src', '/custom-image.png');
	});

	it('truncates title that exceeds container width', () => {
		render(<Card {...defaultProps} />);

		const title = screen.getByText(defaultProps.title);
		expect(title).toHaveClass('truncate');
	});

	it('displays prices with correct formatting', () => {
		render(<Card {...defaultProps} price="10.5 ETH" lastPrice="9.25 ETH" />);

		expect(screen.getByText('10.5 ETH')).toBeInTheDocument();
		expect(screen.getByText('9.25 ETH')).toBeInTheDocument();
	});

	it('renders with collection name in correct color', () => {
		render(<Card {...defaultProps} collection="Premium Collection" />);

		const collection = screen.getByText('Premium Collection');
		expect(collection).toHaveClass('text-primary-500');
	});

	it('works with zero likes initially', async () => {
		const user = userEvent.setup();
		render(<Card {...defaultProps} likes={0} />);

		// No badge shown initially
		expect(screen.queryByText('0')).not.toBeInTheDocument();

		const buttons = screen.getAllByRole('button');
		const likeButton = buttons[0];

		// Like it
		await user.click(likeButton);

		// Now badge should show 1
		await waitFor(() => {
			expect(screen.getByText('1')).toBeInTheDocument();
		});
	});

	it('handles undefined optional props', () => {
		render(
			<Card
				image={defaultProps.image}
				title={defaultProps.title}
				price={defaultProps.price}
			/>
		);

		expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
		expect(screen.getByText(defaultProps.price)).toBeInTheDocument();
		expect(screen.queryByText(/Collection/)).not.toBeInTheDocument();
		expect(screen.queryByText('Last Sale')).not.toBeInTheDocument();
	});

	it('maintains like state across multiple interactions', async () => {
		const user = userEvent.setup();
		render(<Card {...defaultProps} likes={50} />);

		const buttons = screen.getAllByRole('button');
		const likeButton = buttons[0];

		// Like
		await user.click(likeButton);
		await waitFor(() => expect(screen.getByText('51')).toBeInTheDocument());

		// Unlike
		await user.click(likeButton);
		await waitFor(() => expect(screen.getByText('50')).toBeInTheDocument());

		// Like again
		await user.click(likeButton);
		await waitFor(() => expect(screen.getByText('51')).toBeInTheDocument());

		// Unlike again
		await user.click(likeButton);
		await waitFor(() => expect(screen.getByText('50')).toBeInTheDocument());
	});

	it('renders with special characters in title', () => {
		const specialTitle = 'NFT #123 & <Special> "Chars" \'Test\'';
		render(<Card {...defaultProps} title={specialTitle} />);

		expect(screen.getByText(specialTitle)).toBeInTheDocument();
	});

	it('applies hover shadow effects', () => {
		const { container } = render(<Card {...defaultProps} />);

		const cardContainer = container.querySelector('.rounded-2xl');
		expect(cardContainer).toHaveClass('hover:shadow-card-hover');
	});
});
