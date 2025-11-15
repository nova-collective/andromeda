import React from 'react';

import Image from 'next/image';

import { 
  Header,
  Heading,
  Paragraph,
} from '@/app/components';





export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-8 pt-24">
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50 px-6 py-3 rounded-full font-semibold text-lg mb-8 animate-pulse">
            🚧 coming soon... 🚧
          </div>
          <Heading level={1} align="center" className="font-bold text-primary mb-4 flex items-center justify-center gap-3">
            Welcome to Andromeda
          </Heading>
          <Paragraph size="xl" align="center" className="text-secondary max-w-2xl mx-auto mb-8">
            A Web3 bookstore, from authors to readers
          </Paragraph>
        </div>

        <div className="relative mb-12 max-w-4xl mx-auto">
          <div className="bg-secondary rounded-2xl p-8 backdrop-blur-sm border border-color">
            <Image
              src="/assets/wip.png"
              alt="Work in Progress"
              width={268}
              height={178}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="mb-12 text-center py-16">
          <Heading level={1} align="center" className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Discover, Collect, and Sell
          </Heading>
          <Paragraph size="xl" align="center" className="text-secondary max-w-2xl mx-auto">
            Explore the world&apos;s leading NFT marketplace
          </Paragraph>
        </section>

        <footer className="mt-16 text-center">
          <Paragraph className="text-secondary">&copy; {new Date().getFullYear()} Andromeda - All rights reserved</Paragraph>
          <Paragraph size="sm" muted className="text-secondary text-sm mt-2">Building the future of reading, one block at a time</Paragraph>
        </footer>
      </div>
    </>
  );
}