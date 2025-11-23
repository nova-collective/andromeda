import React from 'react';

import { Wallet, ArrowRight, Heart, Search } from 'lucide-react';

import { Button, Header, Card, Heading, Paragraph, Label, Caption, Link, TextInput } from '@/app/components';

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
            <Heading level={1} align="center" className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Visual Design System</Heading>
            <Paragraph size="lg" align="center" className="text-secondary max-w-3xl mx-auto leading-relaxed">
              A living reference for Andromeda’s visual language: components, states, and typography. Keep interfaces
              consistent, accessible, and theme-aware.
            </Paragraph>
          </section>
          {/* Atoms Section */}
          <section className="space-y-6 mb-12">
            <Heading level={2} className="text-xl font-semibold text-primary">Atoms</Heading>
            <Paragraph muted className="text-secondary max-w-3xl">Smallest building blocks such as: typography, buttons, labels, icons.</Paragraph>
            <div className="grid gap-10 lg:grid-cols-2">
              {/* Typography Panel */}
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-8 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold text-primary">Typography</Heading>
                </header>
                <div className="grid gap-8">
                  {/* Headings */}
                  <div className="space-y-3">
                    <Heading level={1}>Heading One – Discover New Worlds</Heading>
                    <Heading level={2}>Heading Two – Curated Collections</Heading>
                    <Heading level={3}>Heading Three – Author Spotlights</Heading>
                    <Heading level={4}>Heading Four – Weekly Picks</Heading>
                    <Heading level={5}>Heading Five – Reading Lists</Heading>
                    <Heading level={6}>Heading Six – Footnotes</Heading>
                  </div>
                  {/* Paragraph Samples */}
                  <div className="space-y-4 font-sans text-secondary leading-relaxed">
                    <Paragraph>
                      Andromeda is a decentralized bookstore where every title is a tokenized asset. Explore limited
                      editions, unlock exclusive author content, and build a collection that travels with you across the
                      Web3 universe.
                    </Paragraph>
                    <Paragraph>
                      Fonts: Headings use <span className="font-serif text-primary">Merriweather (serif)</span>. Body text uses 
                      <span className="font-sans text-primary"> Inter (sans-serif)</span> for clean, readable UI.
                    </Paragraph>
                    <Paragraph>
                      This pairing balances immersive storytelling with accessible interface patterns—ideal for
                      discovery and long-form reading.
                    </Paragraph>
                  </div>
                </div>
              </div>

              {/* Links Panel */}
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold text-primary">Links</Heading>
                </header>
                <div className="space-y-4">
                  <Paragraph size="sm" muted className="text-secondary">Inline links with underline behavior and theme-aware color.</Paragraph>
                  <Paragraph>
                    Browse our <Link href="#">catalog</Link> or read <Link href="#" underline="always">the docs</Link>.
                  </Paragraph>
                  <Paragraph>
                    Subtle tone: <Link href="#" muted>muted link</Link>
                  </Paragraph>
                  <Paragraph>
                    External: <Link href="https://example.com">example.com</Link>
                  </Paragraph>
                </div>
              </div>

              {/* Buttons Panel */}
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-8 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold text-primary">Buttons</Heading>
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
                    <Paragraph size="sm" muted className="text-secondary text-xs">Icons</Paragraph>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary" leftIcon={<Heart size={16} />}>Like</Button>
                      <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>Next</Button>
                      <Button variant="gradient" leftIcon={<Wallet size={16} />}>Connect</Button>
                    </div>
                  </div>

                  {/* States */}
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary text-xs">States</Paragraph>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary">Normal</Button>
                      <Button variant="primary" disabled>Disabled</Button>
                      <Button variant="primary" loading>Loading</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Labels Panel */}
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card lg:col-span-2">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold text-primary">Labels</Heading>
                </header>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary text-xs">Solid</Paragraph>
                    <div className="flex flex-wrap gap-2">
                      <Label severity="neutral" variant="solid">Neutral</Label>
                      <Label severity="info" variant="solid">Info</Label>
                      <Label severity="success" variant="solid">Success</Label>
                      <Label severity="warning" variant="solid">Warning</Label>
                      <Label severity="danger" variant="solid">Danger</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary text-xs">Soft</Paragraph>
                    <div className="flex flex-wrap gap-2">
                      <Label severity="neutral" variant="soft">Neutral</Label>
                      <Label severity="info" variant="soft">Info</Label>
                      <Label severity="success" variant="soft">Success</Label>
                      <Label severity="warning" variant="soft">Warning</Label>
                      <Label severity="danger" variant="soft">Danger</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary text-xs">Outline</Paragraph>
                    <div className="flex flex-wrap gap-2">
                      <Label severity="neutral" variant="outline">Neutral</Label>
                      <Label severity="info" variant="outline">Info</Label>
                      <Label severity="success" variant="outline">Success</Label>
                      <Label severity="warning" variant="outline">Warning</Label>
                      <Label severity="danger" variant="outline">Danger</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary text-xs">Ghost & Pill</Paragraph>
                    <div className="flex flex-wrap gap-2">
                      <Label severity="info" variant="ghost">Info</Label>
                      <Label severity="success" variant="ghost">Success</Label>
                      <Label severity="warning" variant="ghost" pill>Warning</Label>
                      <Label severity="danger" variant="ghost" pill>Danger</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Captions Panel */}
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold text-primary">Captions</Heading>
                </header>
                <div className="space-y-4">
                  <Caption className="text-primary" size="xs">Tiny caption size (xs)</Caption>
                  <Caption className="text-primary" align="center">Centered caption</Caption>
                  <Caption className="text-primary" align="right" muted={false}>Right-aligned, not muted</Caption>
                  <figure className="space-y-2">
                    {/* Example figure/figcaption pairing */}
                    <div className="w-full h-32 bg-[color:var(--border)] rounded-lg" />
                    <Caption className="text-primary" as="figcaption" align="center">Figure 1 – Placeholder image with figcaption</Caption>
                  </figure>
                </div>
              </div>

              {/* Form Panel */}
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold text-primary">Form</Heading>
                </header>
                <div className="space-y-4">
                  <Paragraph size="sm" muted className="text-secondary">Text input states and sizes.</Paragraph>
                  <div className="space-y-3">
                    <TextInput className="text-primary" placeholder="Search books…" leftIcon={<Search className="text-primary"  size={16} />} />
                    <TextInput className="text-primary" size="sm" placeholder="Small size" />
                    <TextInput className="text-primary" size="lg" placeholder="Large size" />
                    <TextInput className="text-primary" invalid placeholder="Invalid input" />
                    <TextInput className="text-primary" disabled placeholder="Disabled input" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Molecules Section */}
          <section className="space-y-6">
            <Heading level={2} className="text-xl font-semibold text-primary">Molecules</Heading>
            <Paragraph muted className="text-secondary max-w-3xl">Compound building blocks composed of multiple atoms.</Paragraph>
            <div className="rounded-2xl bg-primary border border-color p-6 shadow-card">
              <header className="flex items-center justify-between mb-6">
                <Heading level={2} className="text-lg font-serif font-semibold text-primary">Cards</Heading>
              </header>
              <div className="space-y-8">
                {/* Card description */}
                <Paragraph size="sm" muted className="text-secondary leading-relaxed max-w-3xl">
                  Cards display NFT or book items with image, collection, pricing and interaction affordances. They support
                  hover elevation, like toggling, and optional previous sale price. Below are common usage patterns.
                </Paragraph>
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
                  <Paragraph size="sm" muted className="text-secondary text-xs">State Notes</Paragraph>
                  <ul className="list-disc pl-5 space-y-1 text-secondary text-sm">
                    <li><span className="text-primary font-medium">Likes</span> increment locally; initial count provided via props.</li>
                    <li><span className="text-primary font-medium">Hover</span> scales image and reveals action buttons (like, more).</li>
                    <li><span className="text-primary font-medium">Focus</span> ring applied when card receives keyboard focus.</li>
                    <li><span className="text-primary font-medium">Last Sale</span> appears only when <code className="font-mono text-xs">lastPrice</code> is provided.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
