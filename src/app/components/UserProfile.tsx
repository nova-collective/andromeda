'use client';
import { useState, useEffect } from 'react';
import { IUser } from '../lib/types/mongoose';

interface UserProfileProps {
  walletAddress: string;
}

interface UserSettings {
  theme: string;
  notifications: boolean;
}

export default function UserProfile({ walletAddress }: UserProfileProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/users?address=${walletAddress}`);
        const userData: IUser = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchUser();
    }
  }, [walletAddress]);

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
      const updatedUser: IUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>User Profile</h2>
      <p>Wallet: {user.walletAddress}</p>
      <p>Theme: {user.settings.theme}</p>
      <button onClick={() => updateUserSettings({ theme: 'dark', notifications: true })}>
        Switch to Dark Mode
      </button>
    </div>
  );
}