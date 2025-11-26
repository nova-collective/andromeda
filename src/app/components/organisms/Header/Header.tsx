'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Wallet,
  User,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  LayoutGrid
} from 'lucide-react';

import { useTheme } from '@/app/components/providers/ThemeProvider/ThemeProvider';

/**
 * Header Component
 * 
 * Main navigation header for the application with responsive design.
 * Features include theme toggle, search functionality, navigation links,
 * user authentication, and mobile menu. Follows OpenSea's modern design aesthetic.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Header />
 * ```
 * 
 * Features:
 * - Responsive navigation with mobile menu
 * - Theme toggle (light/dark mode)
 * - Search bar (desktop and mobile versions)
 * - Wallet connection button
 * - User profile access
 * - Sticky positioning with backdrop blur
 * 
 * @returns The application header with navigation and user controls
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Explore', href: '/explore', icon: TrendingUp },
    { name: 'Stats', href: '/stats', icon: Sparkles },
    { name: 'Create', href: '/create', icon: ShoppingBag },
    { name: 'VDS', href: '/vds', icon: LayoutGrid },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-color bg-primary backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-[var(--bg-primary)] font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:block">
              Andromeda
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-lg text-secondary hover:bg-secondary hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className={`relative w-full transition-all ${isSearchFocused ? 'scale-105' : ''}`}>
              <Search 
                size={20} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" 
              />
              <input
                type="text"
                placeholder="Search items, collections, and accounts"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-color bg-secondary text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-secondary" />
              ) : (
                <Sun size={20} className="text-secondary" />
              )}
            </button>

            {/* User Menu */}
            <button className="hidden md:flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
              <User size={20} className="text-secondary" />
            </button>

            {/* Connect Wallet Button */}
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--text-primary)] hover:opacity-95 active:opacity-90 text-[var(--bg-primary)] font-medium transition-colors cursor-pointer">
              <Wallet size={18} />
              <span>Connect</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" 
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-color bg-secondary text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)]"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden border-t border-color bg-primary"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
              >
                <link.icon size={20} />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
            <button className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-[var(--text-primary)] hover:opacity-95 active:opacity-90 text-[var(--bg-primary)] font-medium transition-colors justify-center cursor-pointer">
              <Wallet size={20} />
              <span>Connect Wallet</span>
            </button>
          </nav>
        </motion.div>
      )}
    </header>
  );
}