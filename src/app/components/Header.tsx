'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MenuItem {
  name: string;
  href: string;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    { name: 'Item1', href: '#' },
    { name: 'Item2', href: '#' },
    { name: 'Item3', href: '#' },
    { name: 'Item4', href: '#' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logica di login
    console.log('Login attempted');
    setIsLoginModalOpen(false);
  };

  const handleWalletConnect = () => {
    // Logica connessione wallet
    console.log('Wallet connect attempted');
    setIsWalletModalOpen(false);
  };

  return (
    <>
      <header className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Menu Items - Sinistra */}
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/assets/andromeda-logo.png"
                  alt="Andromeda"
                  width={160}
                  height={48}
                  className="h-8 w-auto"
                />
              </div>

              {/* Menu Desktop */}
              <nav className="hidden md:ml-8 md:flex md:space-x-6">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Bottoni Destra */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Bottone Login */}
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                Login
              </button>

              {/* Bottone Wallet */}
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 font-semibold"
              >
                🦊 Connect Wallet
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                🦊
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-gray-700 animate-slideDown">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-yellow-500 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Login</h3>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors duration-300"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors duration-300"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-900 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleWalletConnect}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg flex items-center justify-between transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <span>MetaMask</span>
                <span>🦊</span>
              </button>
              <button
                onClick={handleWalletConnect}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg flex items-center justify-between transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <span>WalletConnect</span>
                <span>⚡</span>
              </button>
              <button
                onClick={handleWalletConnect}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg flex items-center justify-between transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                <span>Coinbase Wallet</span>
                <span>⧉</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}