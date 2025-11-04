import React from 'react';

import Image from 'next/image';

import Header from './components/Header';
import UserProfile from './components/UserProfile';

const demoWalletAddress = "0x75C3d1F328d5Ce9fCFC29Dac48C8Ca64D1E745E1";

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8 pt-24">
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-500 text-yellow-900 px-6 py-3 rounded-full font-semibold text-lg mb-8 animate-pulse">
            🚧 coming soon... 🚧
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span>Welcome to</span>
            <span className="inline-block">
              <Image
                src="/assets/andromeda-logo.png"
                alt="Andromeda"
                width={312}
                height={94}
                className="inline-block object-contain"
              />
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A Web3 bookstore, from authors to readers
          </p>
        </div>

        <div className="relative mb-12 max-w-4xl mx-auto">
          <div className="bg-gray-700/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-600">
            <Image
              src="/assets/wip.png"
              alt="Work in Progress"
              width={268}
              height={178}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>

        <div className="mt-12 w-full max-w-2xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              🧪 Test Area
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Testing db connection
            </p>
            <UserProfile walletAddress={demoWalletAddress} />
          </div>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Andromeda - All rights reserved
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Building the future of reading, one block at a time
          </p>
        </footer>
      </div>
    </>
  );
}