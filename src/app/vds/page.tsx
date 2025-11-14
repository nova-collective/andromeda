import React from 'react';

import { Wallet, ArrowRight, Heart } from 'lucide-react';

import { Button, Header, Card } from '@/app/components';

/**
 * Visual Design System Page
 * Central hub showcasing reusable UI tokens, components, and typography.
 * Extracted from the home page for clearer separation of marketing vs. design docs.
 */
export default function VDSPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary pt-24">
        <div className="mx-auto max-w-6xl px-6 pb-24">
          {/* Intro */}
          <section className="text-center mb-16 space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Visual Design System</h1>
            <p className="text-secondary text-lg max-w-3xl mx-auto leading-relaxed">
              A living reference for Andromeda’s visual language: components, states, and typography. Keep interfaces
              consistent, accessible, and theme-aware.
            </p>
          </section>

          {/* Two-column layout for components + typography */}
          <section className="grid gap-10 lg:grid-cols-2">
            {/* Buttons Panel */}
            <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-8 shadow-card">
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-semibold text-primary">Buttons</h2>
                <span className="text-xs uppercase tracking-wider text-secondary">Component</span>
              </header>

              {/* Core variants grouped */}
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                  <Button variant="ghost" size="sm">Ghost</Button>
                  <Button variant="danger" size="sm">Danger</Button>
                  <Button variant="gradient" size="sm">Gradient</Button>
                </div>

                {/* Icon examples */}
                <div className="space-y-2">
                  <p className="text-xs text-secondary">Icons</p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" leftIcon={<Heart size={16} />}>Like</Button>
                    <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>Next</Button>
                    <Button variant="gradient" leftIcon={<Wallet size={16} />}>Connect</Button>
                  </div>
                </div>

                {/* States */}
                <div className="space-y-2">
                  <p className="text-xs text-secondary">States</p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Normal</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                    <Button variant="primary" loading>Loading</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Panel */}
            <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-8 shadow-card">
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-semibold text-primary">Typography</h2>
                <span className="text-xs uppercase tracking-wider text-secondary">Foundations</span>
              </header>
              <div className="grid gap-8">
                {/* Headings */}
                <div className="space-y-3">
                  <h1 className="font-serif text-3xl md:text-4xl">Heading One – Discover New Worlds</h1>
                  <h2 className="font-serif text-2xl md:text-3xl">Heading Two – Curated Collections</h2>
                  <h3 className="font-serif text-xl md:text-2xl">Heading Three – Author Spotlights</h3>
                  <h4 className="font-serif text-lg">Heading Four – Weekly Picks</h4>
                  <h5 className="font-serif text-base">Heading Five – Reading Lists</h5>
                  <h6 className="font-serif text-sm tracking-wide uppercase">Heading Six – Footnotes</h6>
                </div>
                {/* Paragraph Samples */}
                <div className="space-y-4 font-sans text-secondary leading-relaxed">
                  <p>
                    Andromeda is a decentralized bookstore where every title is a tokenized asset. Explore limited
                    editions, unlock exclusive author content, and build a collection that travels with you across the
                    Web3 universe.
                  </p>
                  <p>
                    Fonts: Headings use <span className="font-serif text-primary">Merriweather (serif)</span>. Body text uses
                    <span className="font-sans text-primary"> Inter (sans-serif)</span> for clean, readable UI.
                  </p>
                  <p>
                    This pairing balances immersive storytelling with accessible interface patterns—ideal for
                    discovery and long-form reading.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cards Showcase */}
          <section className="rounded-2xl bg-primary border border-color p-6 shadow-card">
            <header className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-serif font-semibold text-primary">Cards</h2>
              <span className="text-xs uppercase tracking-wider text-secondary">Component</span>
            </header>
            <div className="space-y-8">
              <p className="text-secondary text-sm leading-relaxed max-w-3xl">
                Cards display NFT or book items with image, collection, pricing and interaction affordances. They support
                hover elevation, like toggling, and optional previous sale price. Below are common usage patterns.
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card
                  image="/placeholder-1.jpg"
                  title="Cosmic Explorer #1234"
                  price="2.5 ETH"
                  lastPrice="2.1 ETH"
                  collection="Cosmic Collection"
                  likes={142}
                  href="#"
                />
                <Card
                  image="/placeholder-1.jpg"
                  title="Nebula Chronicle #77"
                  price="0.85 ETH"
                  collection="Nebula Series"
                  likes={12}
                  href="#"
                />
                <Card
                  image="/placeholder-1.jpg"
                  title="Galactic Archive Vol. 3"
                  price="5.0 ETH"
                  lastPrice="4.4 ETH"
                  likes={0}
                  href="#"
                />
              </div>
              <div className="space-y-4">
                <p className="text-xs text-secondary">State Notes</p>
                <ul className="list-disc pl-5 space-y-1 text-secondary text-sm">
                  <li><span className="text-primary font-medium">Likes</span> increment locally; initial count provided via props.</li>
                  <li><span className="text-primary font-medium">Hover</span> scales image and reveals action buttons (like, more).</li>
                  <li><span className="text-primary font-medium">Focus</span> ring applied when card receives keyboard focus.</li>
                  <li><span className="text-primary font-medium">Last Sale</span> appears only when <code className="font-mono text-xs">lastPrice</code> is provided.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
