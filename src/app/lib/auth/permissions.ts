import { User } from '@/app/lib/types';

/**
 * Check whether a user belongs to a specific group.
 *
 * @param user - The user object to check. If `groups` is undefined, the
 *               function returns `false`.
 * @param group - The group name to test membership for.
 * @returns `true` when the user is a member of the group, otherwise `false`.
 */
export function hasGroup(user: User, group: string): boolean {
  return user.groups?.includes(group) || false;
}

/**
 * Convenience helper to check whether a user is an administrator.
 *
 * @param user - The user to check.
 * @returns `true` if the user belongs to the `admin` group.
 */
export function isAdmin(user: User): boolean {
  return hasGroup(user, 'admin');
}

/**
 * Check whether the user belongs to any of the provided groups.
 *
 * This is useful for coarse-grained permission checks where membership in
 * any one of the supplied groups grants access.
 *
 * @param user - The user to check.
 * @param groups - Array of group names to test.
 * @returns `true` if the user is a member of at least one group in `groups`.
 */
export function hasAnyGroup(user: User, groups: string[]): boolean {
  return groups.some(group => hasGroup(user, group));
}

/**
 * Check whether the user belongs to every group in the supplied list.
 *
 * Useful for strict permission checks that require membership in multiple
 * groups/roles before granting access.
 *
 * @param user - The user to check.
 * @param groups - Array of group names which the user must belong to.
 * @returns `true` if the user belongs to all groups in `groups`.
 */
export function hasAllGroups(user: User, groups: string[]): boolean {
  return groups.every(group => hasGroup(user, group));
}