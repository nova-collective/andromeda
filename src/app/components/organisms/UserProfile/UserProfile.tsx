'use client';
import React, { useState, useEffect } from 'react';

import { type IUser } from '../../../lib/types';

/**
 * Props for the UserProfile component
 */
export interface UserProfileProps {
  /** Ethereum wallet address of the user to display */
  walletAddress: string;
}

/**
 * User settings configuration
 */
export interface UserSettings {
  /** Theme preference (e.g., 'light', 'dark') */
  theme: string;
  /** Whether notifications are enabled */
  notifications: boolean;
}

/**
 * UserProfile Component
 * 
 * Displays user profile information and allows updating user settings.
 * Fetches user data from the API based on wallet address and provides
 * functionality to update user preferences.
 * 
 * @component
 * @example
 * ```tsx
 * // Display user profile
 * <UserProfile walletAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" />
 * ```
 * 
 * Features:
 * - Fetches user data by wallet address
 * - Displays loading and error states
 * - Allows updating user settings (theme, notifications)
 * - Handles API errors gracefully
 * 
 * @param props - Component props
 * @param props.walletAddress - Ethereum wallet address to fetch user data for
 * @returns User profile display with settings controls
 */
export function UserProfile({ walletAddress }: UserProfileProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    /**
     * Fetches user data from the API
     * @async
     */
    const fetchUser = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/users?walletAddress=${walletAddress}`);
        const userData = (await response.json()) as IUser;
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      void fetchUser();
    }
  }, [walletAddress]);

  /**
   * Updates user settings via API
   * @param newSettings - New settings to apply
   * @async
   */
  const updateUserSettings = async (newSettings: UserSettings): Promise<void> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          settings: newSettings,
        }),
      });
      const updatedUser = (await response.json()) as IUser;
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="font-sans">
      <h2 className="font-serif font-bold">User Profile</h2>
      <p>Wallet: {user.walletAddress}</p>
      <p>Theme: {user.settings?.theme}</p>
      <button onClick={() => void updateUserSettings({ theme: 'dark', notifications: true })}>
        Switch to Dark Mode
      </button>
    </div>
  );
}

export default UserProfile;