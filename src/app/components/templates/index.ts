/**
 * Templates Component Barrel Export
 * 
 * Templates are page-level components that define the overall layout structure.
 * They combine organisms, molecules, and atoms to create complete page layouts
 * with defined content areas (header, sidebar, main, footer). Templates are
 * content-agnostic and focus on structure and composition.
 * 
 * Examples: GridLayout, DashboardLayout, AuthLayout, MarketplaceLayout
 * 
 * Characteristics:
 * - Define page structure and layout
 * - Combine multiple organisms and molecules
 * - Content-agnostic (accept children or slots)
 * - Establish responsive breakpoints
 * - Provide consistent page experiences
 * - Bridge between organisms and pages
 * 
 * @example
 * ```tsx
 * // Import template
 * import { GridLayout } from '@/app/components/templates';
 * 
 * // Use in a page
 * function GalleryPage() {
 *   return (
 *     <GridLayout>
 *       {items.map(item => <Card key={item.id} {...item} />)}
 *     </GridLayout>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Custom column configuration
 * import { GridLayout } from '@/app/components/templates';
 * 
 * <GridLayout cols={{ sm: 1, md: 2, lg: 4, xl: 6 }}>
 *   {products.map(product => (
 *     <ProductCard key={product.id} {...product} />
 *   ))}
 * </GridLayout>
 * ```
 */

// Grid Layout Template
export { GridLayout, default as GridLayoutDefault } from './GridLayout';
export type { GridLayoutProps } from './GridLayout';
