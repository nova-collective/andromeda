import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('shows label on hover', async () => {
    const user = userEvent.setup()

    render(
      <Tooltip label="Tooltip text">
        <button type="button">Trigger</button>
      </Tooltip>,
    )

    const trigger = screen.getByRole('button', { name: 'Trigger' })
    await user.hover(trigger)

    expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip text')
  })

  it('applies data attributes for placement and variant', async () => {
    const user = userEvent.setup()

    render(
      <Tooltip label="Info" placement="bottom" variant="secondary">
        <button type="button">Trigger</button>
      </Tooltip>,
    )

    const trigger = screen.getByRole('button', { name: 'Trigger' })
    await user.hover(trigger)

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveAttribute('data-placement', 'bottom')
    expect(tooltip).toHaveAttribute('data-variant', 'secondary')
  })
})
