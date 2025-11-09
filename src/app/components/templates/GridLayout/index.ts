/**
 * GridLayout Template Barrel Export
 * 
 * Exports the responsive grid layout template component for organizing
 * content in a flexible, responsive grid. Ideal for card-based layouts
 * like galleries, product listings, and dashboard widgets.
 * 
 * @example
 * ```tsx
 * // Named import
 * import { GridLayout } from '@/app/components/templates/GridLayout';
 * 
 * // Default import
 * import GridLayout from '@/app/components/templates/GridLayout';
 * 
 * // Usage with default responsive grid
 * <GridLayout>
 *   <Card title="Item 1" />
 *   <Card title="Item 2" />
 *   <Card title="Item 3" />
 * </GridLayout>
 * 
 * // Custom column configuration
 * <GridLayout cols={{ sm: 1, md: 3, lg: 4, xl: 6 }}>
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </GridLayout>
 * ```
 */

export { default as GridLayout } from './GridLayout';
export { default } from './GridLayout';
export type { GridLayoutProps } from './GridLayout';
