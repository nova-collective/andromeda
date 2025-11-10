import '@testing-library/jest-dom/vitest';
import React, { createElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		button: ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => 
			createElement('button', props, children),
	},
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
	Loader2: (props: React.SVGProps<SVGSVGElement>) =>
		createElement('svg', { ...props, 'data-testid': 'loader-icon' }),
}));

import { Button } from './Button';

describe('Button component', () => {
	describe('Rendering', () => {
		it('renders with children text', () => {
			render(<Button>Click me</Button>);
			expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
		});

		it('renders without children', () => {
			render(<Button />);
			const button = screen.getByRole('button');
			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent('');
		});

		it('renders with custom className', () => {
			render(<Button className="custom-class">Button</Button>);
			expect(screen.getByRole('button')).toHaveClass('custom-class');
		});
	});

	describe('Variants', () => {
		it('renders primary variant by default', () => {
			render(<Button>Primary</Button>);
			expect(screen.getByRole('button')).toHaveClass('bg-primary-500');
		});

		it('renders secondary variant', () => {
			render(<Button variant="secondary">Secondary</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('bg-surface');
			expect(button).toHaveClass('hover:bg-surface-hover');
		});

		it('renders outline variant', () => {
			render(<Button variant="outline">Outline</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('bg-transparent');
			expect(button).toHaveClass('border-default');
		});

		it('renders ghost variant', () => {
			render(<Button variant="ghost">Ghost</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('bg-transparent');
			expect(button).toHaveClass('hover:bg-surface');
		});

		it('renders danger variant', () => {
			render(<Button variant="danger">Delete</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('bg-primary-800');
			expect(button).toHaveClass('hover:bg-primary-900');
		});

		it('renders gradient variant', () => {
			render(<Button variant="gradient">Gradient</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('bg-gradient-primary');
		});
	});

	describe('Sizes', () => {
		it('renders medium size by default', () => {
			render(<Button>Medium</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('px-4');
			expect(button).toHaveClass('py-2');
			expect(button).toHaveClass('text-base');
		});

		it('renders small size', () => {
			render(<Button size="sm">Small</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('px-3');
			expect(button).toHaveClass('py-1.5');
			expect(button).toHaveClass('text-sm');
		});

		it('renders large size', () => {
			render(<Button size="lg">Large</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('px-6');
			expect(button).toHaveClass('py-3');
			expect(button).toHaveClass('text-lg');
		});

		it('renders extra large size', () => {
			render(<Button size="xl">Extra Large</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('px-8');
			expect(button).toHaveClass('py-4');
			expect(button).toHaveClass('text-xl');
		});
	});

	describe('Full Width', () => {
		it('does not span full width by default', () => {
			render(<Button>Button</Button>);
			expect(screen.getByRole('button')).not.toHaveClass('w-full');
		});

		it('spans full width when fullWidth is true', () => {
			render(<Button fullWidth>Full Width</Button>);
			expect(screen.getByRole('button')).toHaveClass('w-full');
		});
	});

	describe('Loading State', () => {
		it('does not show loader by default', () => {
			render(<Button>Button</Button>);
			expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
		});

		it('shows loader when loading is true', () => {
			render(<Button loading>Loading</Button>);
			expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
		});

		it('is disabled when loading', () => {
			render(<Button loading>Loading</Button>);
			expect(screen.getByRole('button')).toBeDisabled();
		});

		it('hides left icon when loading', () => {
			render(
				<Button loading leftIcon={<span data-testid="left-icon">L</span>}>
					Loading
				</Button>
			);
			expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
			expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
		});

		it('hides right icon when loading', () => {
			render(
				<Button loading rightIcon={<span data-testid="right-icon">R</span>}>
					Loading
				</Button>
			);
			expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
			expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
		});

		it('shows children text when loading', () => {
			render(<Button loading>Processing...</Button>);
			expect(screen.getByText('Processing...')).toBeInTheDocument();
		});
	});

	describe('Icons', () => {
		it('renders left icon', () => {
			render(
				<Button leftIcon={<span data-testid="left-icon">←</span>}>
					Back
				</Button>
			);
			expect(screen.getByTestId('left-icon')).toBeInTheDocument();
		});

		it('renders right icon', () => {
			render(
				<Button rightIcon={<span data-testid="right-icon">→</span>}>
					Next
				</Button>
			);
			expect(screen.getByTestId('right-icon')).toBeInTheDocument();
		});

		it('renders both left and right icons', () => {
			render(
				<Button
					leftIcon={<span data-testid="left-icon">←</span>}
					rightIcon={<span data-testid="right-icon">→</span>}
				>
					Both
				</Button>
			);
			expect(screen.getByTestId('left-icon')).toBeInTheDocument();
			expect(screen.getByTestId('right-icon')).toBeInTheDocument();
		});

		it('renders icon-only button', () => {
			render(<Button leftIcon={<span data-testid="icon">✓</span>} />);
			const button = screen.getByRole('button');
			expect(screen.getByTestId('icon')).toBeInTheDocument();
			expect(button).toHaveTextContent('✓');
		});
	});

	describe('Disabled State', () => {
		it('is not disabled by default', () => {
			render(<Button>Button</Button>);
			expect(screen.getByRole('button')).not.toBeDisabled();
		});

		it('is disabled when disabled prop is true', () => {
			render(<Button disabled>Disabled</Button>);
			expect(screen.getByRole('button')).toBeDisabled();
		});

		it('has disabled styling', () => {
			render(<Button disabled>Disabled</Button>);
			expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
			expect(screen.getByRole('button')).toHaveClass('disabled:cursor-not-allowed');
		});
	});

	describe('Interactions', () => {
		it('calls onClick handler when clicked', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();

			render(<Button onClick={handleClick}>Click me</Button>);
			await user.click(screen.getByRole('button'));

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('does not call onClick when disabled', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();

			render(<Button onClick={handleClick} disabled>Disabled</Button>);
			await user.click(screen.getByRole('button'));

			expect(handleClick).not.toHaveBeenCalled();
		});

		it('does not call onClick when loading', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();

			render(<Button onClick={handleClick} loading>Loading</Button>);
			await user.click(screen.getByRole('button'));

			expect(handleClick).not.toHaveBeenCalled();
		});

		it('can be focused', () => {
			render(<Button>Button</Button>);
			const button = screen.getByRole('button');
			button.focus();
			expect(button).toHaveFocus();
		});

		it('supports keyboard interaction', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();

			render(<Button onClick={handleClick}>Button</Button>);
			const button = screen.getByRole('button');
			button.focus();
			await user.keyboard('{Enter}');

			expect(handleClick).toHaveBeenCalled();
		});
	});

	describe('Accessibility', () => {
		it('has button role', () => {
			render(<Button>Button</Button>);
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('supports aria-label', () => {
			render(<Button aria-label="Custom label">Button</Button>);
			expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
		});

		it('supports aria-describedby', () => {
			render(<Button aria-describedby="description">Button</Button>);
			expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'description');
		});

		it('has focus ring classes', () => {
			render(<Button>Button</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('focus:outline-none');
			expect(button).toHaveClass('focus:ring-2');
			expect(button).toHaveClass('focus:ring-primary-500');
		});

		it('provides loading state feedback', () => {
			render(<Button loading>Loading</Button>);
			expect(screen.getByLabelText('Loading')).toBeInTheDocument();
		});
	});

	describe('Style Combinations', () => {
		it('combines small size with danger variant', () => {
			render(<Button variant="danger" size="sm">Delete</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('bg-primary-800');
			expect(button).toHaveClass('px-3');
			expect(button).toHaveClass('text-sm');
		});

		it('combines large size with gradient variant', () => {
			render(<Button variant="gradient" size="lg">Get Started</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('bg-gradient-primary');
			expect(button).toHaveClass('px-6');
			expect(button).toHaveClass('text-lg');
		});

		it('combines full width with outline variant', () => {
			render(<Button variant="outline" fullWidth>Full Width Outline</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('border-default');
			expect(button).toHaveClass('w-full');
		});

		it('combines loading with secondary variant', () => {
			render(<Button variant="secondary" loading>Loading</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('bg-surface');
			expect(button).toBeDisabled();
			expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
		});
	});

	describe('Custom Props', () => {
		it('supports type attribute', () => {
			render(<Button type="submit">Submit</Button>);
			expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
		});

		it('supports data attributes', () => {
			render(<Button data-testid="custom-button" data-value="123">Button</Button>);
			const button = screen.getByTestId('custom-button');
			expect(button).toHaveAttribute('data-value', '123');
		});

		it('supports id attribute', () => {
			render(<Button id="my-button">Button</Button>);
			expect(screen.getByRole('button')).toHaveAttribute('id', 'my-button');
		});

		it('supports name attribute', () => {
			render(<Button name="action">Button</Button>);
			expect(screen.getByRole('button')).toHaveAttribute('name', 'action');
		});

		it('supports value attribute', () => {
			render(<Button value="submit-value">Button</Button>);
			expect(screen.getByRole('button')).toHaveAttribute('value', 'submit-value');
		});
	});

	describe('Edge Cases', () => {
		it('handles empty string as children', () => {
			render(<Button>{''}</Button>);
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('handles null children', () => {
			render(<Button>{null}</Button>);
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('handles undefined children', () => {
			render(<Button>{undefined}</Button>);
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('handles multiple children', () => {
			render(
				<Button>
					<span>Text 1</span>
					<span>Text 2</span>
				</Button>
			);
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('preserves base classes with custom className', () => {
			render(<Button className="my-custom-class">Button</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('my-custom-class');
			expect(button).toHaveClass('inline-flex');
			expect(button).toHaveClass('items-center');
		});

		it('handles rapid clicks', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();

			render(<Button onClick={handleClick}>Click</Button>);
			const button = screen.getByRole('button');
			
			await user.click(button);
			await user.click(button);
			await user.click(button);

			expect(handleClick).toHaveBeenCalledTimes(3);
		});
	});
});
