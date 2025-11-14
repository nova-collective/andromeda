import React from 'react';

import Image from 'next/image';

import { Wallet, ArrowRight, BookOpen, Heart } from 'lucide-react';

import { 
  Button,
  Card,
  GridLayout,
  Header,
  UserProfile,
} from '@/app/components';



const demoWalletAddress = "0x75C3d1F328d5Ce9fCFC29Dac48C8Ca64D1E745E1";

export default function Home() {
  const mockItems = [
    {
      id: 1,
      image: '/placeholder-1.jpg',
      title: 'Cosmic Explorer #1234',
      price: '2.5 ETH',
      lastPrice: '2.1 ETH',
      collection: 'Cosmic Collection',
      likes: 142,
    },
    // Add more mock items...
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-8 pt-24">
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50 px-6 py-3 rounded-full font-semibold text-lg mb-8 animate-pulse">
            🚧 coming soon... 🚧
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <span>Welcome to Andromeda</span>
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto mb-8">
            A Web3 bookstore, from authors to readers
          </p>

          {/* Button Examples */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Button 
              variant="gradient" 
              size="lg"
              leftIcon={<Wallet size={20} />}
            >
              Connect Wallet
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              leftIcon={<BookOpen size={20} />}
              rightIcon={<ArrowRight size={20} />}
            >
              Explore Books
            </Button>
            <Button 
              variant="outline" 
              size="lg"
            >
              Learn More
            </Button>
          </div>
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

        <div className="mt-12 w-full max-w-2xl">
          <div className="bg-primary backdrop-blur-sm rounded-2xl p-6 border border-color">
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">
              🧪 Test Area
            </h2>
            <p className="text-secondary text-center mb-6">
              Testing db connection
            </p>
            <UserProfile walletAddress={demoWalletAddress} />

            {/* Design system showcases moved to /vds page */}
          </div>
        </div>

        {/* Hero Section */}
        <section className="mb-12 text-center py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Discover, Collect, and Sell
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Explore the world&apos;s leading NFT marketplace
          </p>
        </section>

        {/* Items Grid */}
        <section>
          <h2 className="text-3xl font-bold text-primary mb-8">Trending Items</h2>
          <GridLayout>
            {mockItems.map((item) => (
              <Card key={item.id} {...item} />
            ))}
          </GridLayout>
        </section>

        <footer className="mt-16 text-center">
          <p className="text-secondary">
            &copy; {new Date().getFullYear()} Andromeda - All rights reserved
          </p>
          <p className="text-secondary text-sm mt-2">
            Building the future of reading, one block at a time
          </p>
        </footer>
      </div>
    </>
  );
}