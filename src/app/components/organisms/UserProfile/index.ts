/**
 * UserProfile Component Barrel Export
 * 
 * Exports the UserProfile organism component following atomic design principles.
 * This barrel export allows for clean imports throughout the application.
 * 
 * @example
 * ```tsx
 * // Named import (recommended)
 * import { UserProfile } from '@/app/components/organisms/UserProfile';
 * 
 * // Default import
 * import UserProfile from '@/app/components/organisms/UserProfile';
 * 
 * // Import types
 * import type { UserProfileProps, UserSettings } from '@/app/components/organisms/UserProfile';
 * ```
 */

export { UserProfile, default, type UserProfileProps, type UserSettings } from './UserProfile';