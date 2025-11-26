'use client'
import React, { useState } from 'react';

import { Wallet, ArrowRight, Heart, Search } from 'lucide-react';

import { Button, Header, Card, Heading, Paragraph, Label, Caption, Link, TextInput, TextArea, Checkbox, RadioButton, Dropdown, Toggle, SearchInput, Avatar, ProgressBar, Spinner, Skeleton, PriceTag, Rating, Image } from '@/app/components';

export default function VDSPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary pt-24">
        <div className="mx-auto max-w-6xl px-6 pb-24 space-y-20">
          {/* Intro */}
          <section className="text-center space-y-3">
            <Heading level={1} align="center" className="text-4xl md:text-5xl font-bold tracking-tight">Visual Design System</Heading>
            <Paragraph size="lg" align="center" className="text-secondary max-w-3xl mx-auto leading-relaxed">A living reference for Andromeda’s visual language.</Paragraph>
          </section>

          {/* Tabs Navigation for Atoms & Molecules */}
          <section className="space-y-8">
            <div className="space-y-3">
              <Heading level={2} className="text-xl font-semibold">Components</Heading>
              <Paragraph muted className="text-secondary max-w-3xl">Browse core atoms and composite molecules via tabs.</Paragraph>
            </div>
            <Tabs />
          </section>

        </div>
      </main>
    </>
  );
}

function Tabs() {
  const [active, setActive] = useState<'atoms' | 'molecules'>('atoms');
  const tabBtnBase = 'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition focus:outline-none cursor-pointer';
  return (
    <div className="space-y-10">
      <div role="tablist" aria-label="Component categories" className="flex gap-2 border-b border-color">
        <button
          role="tab"
          aria-selected={active === 'atoms'}
          aria-controls="panel-atoms"
          id="tab-atoms"
          onClick={() => setActive('atoms')}
          className={[
            tabBtnBase,
            active === 'atoms'
              ? 'text-primary border-[color:var(--link-color)]'
              : 'text-secondary border-transparent hover:text-textBase'
          ].join(' ')}
          type="button"
        >
          Atoms
        </button>
        <button
          role="tab"
          aria-selected={active === 'molecules'}
          aria-controls="panel-molecules"
          id="tab-molecules"
          onClick={() => setActive('molecules')}
          className={[
            tabBtnBase,
            active === 'molecules'
              ? 'text-primary border-[color:var(--link-color)]'
              : 'text-secondary border-transparent hover:text-textBase'
          ].join(' ')}
          type="button"
        >
          Molecules
        </button>
      </div>
      <div>
        {active === 'atoms' && (
          <div role="tabpanel" id="panel-atoms" aria-labelledby="tab-atoms" className="space-y-12 animate-fade-in">
            <Heading level={2} className="text-lg font-serif font-semibold">Atoms</Heading>
            <Paragraph muted className="text-secondary max-w-3xl">Smallest building blocks: typography, links, buttons, labels, captions, form inputs.</Paragraph>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-8 shadow-card">
                  <header className="flex items-center justify-between">
                    <Heading level={2} className="text-lg font-serif font-semibold">Typography primary</Heading>
                  </header>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Heading level={1}>Heading One</Heading>
                      <Heading level={2}>Heading Two</Heading>
                      <Heading level={3}>Heading Three</Heading>
                      <Heading level={4}>Heading Four</Heading>
                      <Heading level={5}>Heading Five</Heading>
                      <Heading level={6}>Heading Six</Heading>
                    </div>
                    <div className="space-y-4 font-sans text-secondary leading-relaxed">
                      <Paragraph>Andromeda is a decentralized bookstore of tokenized titles.</Paragraph>
                      <Paragraph>Fonts: <span className="font-serif">Merriweather</span> + <span className="font-sans">Inter</span>.</Paragraph>
                      <Paragraph>Designed for discovery & long‑form reading.</Paragraph>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-8 shadow-card">
                  <header className="flex items-center justify-between">
                    <Heading level={2} className="text-lg font-serif font-semibold" variant="secondary">Typography secondary</Heading>
                  </header>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Heading variant="secondary" level={1}>Heading One</Heading>
                      <Heading variant="secondary" level={2}>Heading Two</Heading>
                      <Heading variant="secondary" level={3}>Heading Three</Heading>
                      <Heading variant="secondary" level={4}>Heading Four</Heading>
                      <Heading variant="secondary" level={5}>Heading Five</Heading>
                      <Heading variant="secondary" level={6}>Heading Six</Heading>
                    </div>
                    <div className="space-y-4 font-sans text-secondary leading-relaxed">
                      <Paragraph variant="secondary">Andromeda is a decentralized bookstore of tokenized titles.</Paragraph>
                      <Paragraph variant="secondary">Fonts: <span className="font-serif">Merriweather</span> + <span className="font-sans">Inter</span>.</Paragraph>
                      <Paragraph variant="secondary">Designed for discovery & long‑form reading.</Paragraph>
                    </div>
                  </div>
                </div>
            </div>

            {/* Links */}
            <div className="grid gap-8 md:grid-cols-1">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Links</Heading>
                </header>
                <div className="space-y-4">
                  <Paragraph size="sm" muted className="text-secondary">Underline behaviors + external handling.</Paragraph>
                  <Paragraph>Browse <Link href="#">catalog</Link> or <Link href="#" underline="always">docs</Link>.</Paragraph>
                  <Paragraph>Muted: <Link href="#" muted>muted link</Link></Paragraph>
                  <Paragraph>External: <Link href="https://example.com">example.com</Link></Paragraph>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid gap-8 md:grid-cols-1">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-8 shadow-card">
                  <header className="flex items-center justify-between">
                    <Heading level={2} className="text-lg font-serif font-semibold">Buttons</Heading>
                  </header>
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary" size="sm">Primary</Button>
                      <Button variant="secondary" size="sm">Secondary</Button>
                      <Button variant="outline" size="sm">Outline</Button>
                      <Button variant="ghost" size="sm">Ghost</Button>
                      <Button variant="danger" size="sm">Danger</Button>
                      <Button variant="gradient" size="sm">Gradient</Button>
                    </div>
                    <div className="space-y-2">
                      <Paragraph size="sm" muted className="text-secondary text-xs">Icons</Paragraph>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="primary" leftIcon={<Heart size={16} />}>Like</Button>
                        <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>Next</Button>
                        <Button variant="gradient" leftIcon={<Wallet size={16} />}>Connect</Button>
                      </div>
                    </div>
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
            </div>

            {/* Labels */}
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Labels primary</Heading>
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
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold" variant="secondary">Labels secondary</Heading>
                </header>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary text-xs">Solid</Paragraph>
                    <div className="flex flex-wrap gap-2">
                      <Label textVariant="secondary" severity="neutral" variant="solid">Neutral</Label>
                      <Label severity="info" variant="solid">Info</Label>
                      <Label severity="success" variant="solid">Success</Label>
                      <Label severity="warning" variant="solid">Warning</Label>
                      <Label severity="danger" variant="solid">Danger</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary text-xs">Soft</Paragraph>
                    <div className="flex flex-wrap gap-2">
                      <Label textVariant="secondary" severity="neutral" variant="soft">Neutral</Label>
                      <Label severity="info" variant="soft">Info</Label>
                      <Label severity="success" variant="soft">Success</Label>
                      <Label severity="warning" variant="soft">Warning</Label>
                      <Label severity="danger" variant="soft">Danger</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary text-xs">Outline</Paragraph>
                    <div className="flex flex-wrap gap-2">
                      <Label textVariant="secondary" severity="neutral" variant="outline">Neutral</Label>
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
            </div>

            {/* Captions */}
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Captions primary</Heading>
                </header>
                <div className="space-y-4">
                  <Caption size="xs">Tiny caption size (xs)</Caption>
                  <Caption align="center">Centered caption</Caption>
                  <Caption align="right">Right-aligned caption</Caption>
                  <figure className="space-y-2">
                    <div className="w-full h-32 bg-[color:var(--border)] rounded-lg" />
                    <Caption as="figcaption" align="center">Figure placeholder with figcaption</Caption>
                  </figure>
                </div>
              </div>
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold" variant="secondary">Captions secondary</Heading>
                </header>
                <div className="space-y-4">
                  <Caption variant="secondary" size="xs">Tiny caption size (xs)</Caption>
                  <Caption variant="secondary" align="center">Centered caption</Caption>
                  <Caption variant="secondary" align="right">Right-aligned caption</Caption>
                  <figure className="space-y-2">
                    <div className="w-full h-32 bg-[color:var(--border)] rounded-lg" />
                    <Caption variant="secondary" as="figcaption" align="center">Figure placeholder with figcaption</Caption>
                  </figure>
                </div>
              </div>
            </div>

            {/* Avatars */}
            <div className="grid gap-8 md:grid-cols-1">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Avatars</Heading>
                </header>
                <Paragraph size="sm" muted className="text-secondary">User representation via image or initials fallback.</Paragraph>
                <div className="flex flex-wrap gap-3 items-center">
                  <Avatar alt="Alice Doe" />
                  <Avatar alt="Bob Stone" size="sm" />
                  <Avatar alt="Carla Green" size="lg" />
                  <Avatar alt="Dana Fox" initials="DF" />
                  <Avatar src="/placeholder-1.jpg" alt="Sample User" />
                  <Avatar variant="secondary" alt="Evan Lund" />
                  <Avatar variant="secondary" alt="Fiona Hale" size="sm" />
                  <Avatar variant="secondary" alt="Gina Park" size="lg" />
                  <Avatar variant="secondary" alt="Henry Ives" initials="HI" />
                  <Avatar variant="secondary" src="/placeholder-1.jpg" alt="Sample Secondary" />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="grid gap-8 md:grid-cols-1">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Images</Heading>
                </header>
                <Paragraph size="sm" muted className="text-secondary">Framed images with sizes, rounded corners, and optional labels.</Paragraph>
                <div className="flex flex-wrap gap-4 items-start">
                  <Image src="/assets/book.jpg" alt="Sample cover small" size="sm" />
                  <Image src="/assets/book.jpg" alt="Sample cover" />
                  <Image src="/assets/book.jpg" alt="Sample cover large" size="lg" showLabel label="Cover image" />
                  <Image src="/assets/book.jpg" alt="Secondary variant" variant="secondary" rounded={false} />
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="grid gap-8 md:grid-cols-1">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Progress bars</Heading>
                </header>
                <Paragraph size="sm" muted className="text-secondary">Determinate and indeterminate progress feedback across variants.</Paragraph>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">Primary variant</Paragraph>
                    <div className="space-y-2">
                      <ProgressBar value={30} max={60} showLabel />
                      <ProgressBar value={75} showLabel size="sm" />
                      <ProgressBar indeterminate size="lg" showLabel />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">Secondary variant</Paragraph>
                    <div className="space-y-2">
                      <ProgressBar variant="secondary" value={30} max={60} showLabel />
                      <ProgressBar variant="secondary" value={75} showLabel size="sm" />
                      <ProgressBar variant="secondary" indeterminate size="lg" showLabel />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spinners */}
            <div className="grid gap-8 md:grid-cols-1">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Spinners</Heading>
                </header>
                <Paragraph size="sm" muted className="text-secondary">Animated loading indicators for transient background tasks.</Paragraph>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">Primary variant</Paragraph>
                    <div className="flex items-center gap-4">
                      <Spinner size="sm" />
                      <Spinner />
                      <Spinner size="lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">Secondary variant</Paragraph>
                    <div className="flex items-center gap-4">
                      <Spinner variant="secondary" size="sm" />
                      <Spinner variant="secondary" />
                      <Spinner variant="secondary" size="lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">With accessible label</Paragraph>
                    <div className="flex items-center gap-4">
                      <Spinner showLabel label="Loading data" />
                      <Spinner variant="secondary" showLabel label="Fetching books" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skeletons */}
            <div className="grid gap-8 md:grid-cols-1">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Skeletons</Heading>
                </header>
                <Paragraph size="sm" muted className="text-secondary">Structural placeholders approximating final content layout.</Paragraph>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">Primary variant</Paragraph>
                    <div className="flex items-center gap-4">
                      <Skeleton size="sm" />
                      <Skeleton />
                      <Skeleton size="lg" />
                      <Skeleton shape="circle" />
                      <Skeleton shape="rect" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">Secondary variant</Paragraph>
                    <div className="flex items-center gap-4">
                      <Skeleton variant="secondary" size="sm" />
                      <Skeleton variant="secondary" />
                      <Skeleton variant="secondary" size="lg" />
                      <Skeleton variant="secondary" shape="circle" />
                      <Skeleton variant="secondary" shape="rect" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">With accessible label</Paragraph>
                    <div className="flex items-center gap-4">
                      <Skeleton showLabel label="Loading profile" />
                      <Skeleton variant="secondary" showLabel label="Loading metadata" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Tags */}
            <div className="grid gap-8 md:grid-cols-1">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Price tags</Heading>
                </header>
                <Paragraph size="sm" muted className="text-secondary">Current price display with optional previous value & trend indicator.</Paragraph>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">Primary variant</Paragraph>
                    <div className="flex flex-col gap-2">
                      <PriceTag value={2.5} currency="ETH" />
                      <PriceTag value={3} previousValue={2.5} currency="ETH" />
                      <PriceTag value={1.5} previousValue={2} currency="ETH" />
                      <PriceTag value={250} currency="USD" size="lg" showLabel />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">Secondary variant</Paragraph>
                    <div className="flex flex-col gap-2">
                      <PriceTag variant="secondary" value={0.85} currency="ETH" />
                      <PriceTag variant="secondary" value={1.2} previousValue={1.0} currency="ETH" />
                      <PriceTag variant="secondary" value={0.9} previousValue={1.1} currency="ETH" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="grid gap-8 md:grid-cols-1">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Ratings</Heading>
                </header>
                <Paragraph size="sm" muted className="text-secondary">Star-based rating display with sizes and variants.</Paragraph>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">Primary variant</Paragraph>
                    <div className="flex items-center gap-4">
                      <Rating value={3} size="sm" />
                      <Rating value={4} />
                      <Rating value={5} size="lg" showLabel label="User Rating" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Paragraph size="sm" muted className="text-secondary">Secondary variant</Paragraph>
                    <div className="flex items-center gap-4">
                      <Rating variant="secondary" value={2} size="sm" />
                      <Rating variant="secondary" value={3} />
                      <Rating variant="secondary" value={4} size="lg" showLabel label="Score" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold">Form primary</Heading>
                </header>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Paragraph size="sm" muted className="text-secondary">Text inputs & search.</Paragraph>
                    <div className="space-y-3">
                      <SearchInput placeholder="Search catalog" clearable />
                      <TextInput placeholder="Search books…" leftIcon={<Search className="text-primary" size={16} />} />
                      <TextInput size="sm" placeholder="Small size" />
                      <TextInput size="lg" placeholder="Large size" />
                      <TextInput invalid placeholder="Invalid input" />
                      <TextInput disabled placeholder="Disabled input" />
                    </div>
                    <div className="space-y-4">
                      <Paragraph size="sm" muted className="text-secondary">Checkboxes.</Paragraph>
                      <div className="space-y-3">
                        <Checkbox label="Accept terms" />
                        <Checkbox defaultChecked label="Subscribed" />
                        <Checkbox indeterminate label="Partially selected" />
                        <Checkbox disabled label="Disabled option" />
                        <Checkbox invalid label="Invalid choice" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Paragraph size="sm" muted className="text-secondary">Dropdowns.</Paragraph>
                      <div className="space-y-3">
                        <Dropdown placeholder="Select plan" options={[{value:'basic',label:'Basic'},{value:'pro',label:'Pro'},{value:'enterprise',label:'Enterprise'}]} />
                        <Dropdown size="sm" options={[{value:'a',label:'Alpha'},{value:'b',label:'Beta'}]} />
                        <Dropdown size="lg" options={[{value:'x',label:'Extended'},{value:'y',label:'Yield'}]} />
                        <Dropdown invalid options={[{value:'error',label:'Error state only'}]} />
                        <Dropdown disabled options={[{value:'disabled',label:'Disabled state'}]} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Paragraph size="sm" muted className="text-secondary">Toggles.</Paragraph>
                      <div className="space-y-3">
                        <Toggle label="Dark mode" />
                        <Toggle defaultChecked label="Notifications" />
                        <Toggle size="sm" label="Compact UI" />
                        <Toggle size="lg" label="Large display" />
                        <Toggle disabled label="Beta feature" />
                        <Toggle invalid label="Require acceptance" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Paragraph size="sm" muted className="text-secondary">Radio buttons.</Paragraph>
                      <div className="space-y-3">
                        <div>
                          <Paragraph size="sm" muted className="text-secondary">Plan</Paragraph>
                          <div className="space-y-2">
                            <RadioButton name="plan-primary" value="basic" label="Basic" />
                            <RadioButton name="plan-primary" value="pro" label="Pro" />
                            <RadioButton name="plan-primary" value="enterprise" label="Enterprise" />
                          </div>
                        </div>
                        <div>
                          <Paragraph size="sm" muted className="text-secondary">Preferences</Paragraph>
                          <div className="space-y-2">
                            <RadioButton name="pref-primary" value="light" label="Light" />
                            <RadioButton name="pref-primary" value="dark" label="Dark" />
                            <RadioButton name="pref-primary" value="system" label="System" disabled />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Paragraph size="sm" muted className="text-secondary">Text areas.</Paragraph>
                    <TextArea placeholder="Describe your collection…" />
                    <TextArea size="sm" placeholder="Short notes" />
                    <TextArea size="lg" placeholder="Extended description" showCount maxLength={200} value={"Readonly preview."} readOnly />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-primary border border-color p-6 flex flex-col gap-6 shadow-card">
                <header className="flex items-center justify-between">
                  <Heading level={2} className="text-lg font-serif font-semibold" variant="secondary">Form secondary</Heading>
                </header>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Paragraph size="sm" muted className="text-secondary">Text inputs & search.</Paragraph>
                    <div className="space-y-3">
                      <SearchInput variant="secondary" placeholder="Search catalog" clearable />
                      <TextInput variant="secondary" placeholder="Search books…" leftIcon={<Search className="text-secondary" size={16} />} />
                      <TextInput variant="secondary" size="sm" placeholder="Small size" />
                      <TextInput variant="secondary" size="lg" placeholder="Large size" />
                      <TextInput variant="secondary" invalid placeholder="Invalid input" />
                      <TextInput variant="secondary" disabled placeholder="Disabled input" />
                    </div>
                    <div className="space-y-4">
                      <Paragraph size="sm" muted className="text-secondary">Checkboxes.</Paragraph>
                      <div className="space-y-3">
                        <Checkbox variant="secondary" label="Accept terms" />
                        <Checkbox variant="secondary" defaultChecked label="Subscribed" />
                        <Checkbox variant="secondary" indeterminate label="Partially selected" />
                        <Checkbox variant="secondary" disabled label="Disabled option" />
                        <Checkbox variant="secondary" invalid label="Invalid choice" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Paragraph size="sm" muted className="text-secondary">Dropdowns.</Paragraph>
                      <div className="space-y-3">
                        <Dropdown variant="secondary" placeholder="Select plan" options={[{value:'basic',label:'Basic'},{value:'pro',label:'Pro'},{value:'enterprise',label:'Enterprise'}]} />
                        <Dropdown variant="secondary" size="sm" options={[{value:'a',label:'Alpha'},{value:'b',label:'Beta'}]} />
                        <Dropdown variant="secondary" size="lg" options={[{value:'x',label:'Extended'},{value:'y',label:'Yield'}]} />
                        <Dropdown variant="secondary" invalid options={[{value:'error',label:'Error state only'}]} />
                        <Dropdown variant="secondary" disabled options={[{value:'disabled',label:'Disabled state'}]} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Paragraph size="sm" muted className="text-secondary">Toggles.</Paragraph>
                      <div className="space-y-3">
                        <Toggle variant="secondary" label="Dark mode" />
                        <Toggle variant="secondary" defaultChecked label="Notifications" />
                        <Toggle variant="secondary" size="sm" label="Compact UI" />
                        <Toggle variant="secondary" size="lg" label="Large display" />
                        <Toggle variant="secondary" disabled label="Beta feature" />
                        <Toggle variant="secondary" invalid label="Require acceptance" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Paragraph size="sm" muted className="text-secondary">Radio buttons.</Paragraph>
                      <div className="space-y-3">
                        <div>
                          <Paragraph size="sm" muted className="text-secondary">Plan</Paragraph>
                          <div className="space-y-2">
                            <RadioButton variant="secondary" name="plan-secondary" value="basic" label="Basic" />
                            <RadioButton variant="secondary" name="plan-secondary" value="pro" label="Pro" />
                            <RadioButton variant="secondary" name="plan-secondary" value="enterprise" label="Enterprise" />
                          </div>
                        </div>
                        <div>
                          <Paragraph size="sm" muted className="text-secondary">Preferences</Paragraph>
                          <div className="space-y-2">
                            <RadioButton variant="secondary" name="pref-secondary" value="light" label="Light" />
                            <RadioButton variant="secondary" name="pref-secondary" value="dark" label="Dark" />
                            <RadioButton variant="secondary" name="pref-secondary" value="system" label="System" disabled />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Paragraph size="sm" muted className="text-secondary">Text areas.</Paragraph>
                    <TextArea variant="secondary" placeholder="Describe your collection…" />
                    <TextArea variant="secondary" size="sm" placeholder="Short notes" />
                    <TextArea variant="secondary" size="lg" placeholder="Extended description" showCount maxLength={200} value={"Readonly preview."} readOnly />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {active === 'molecules' && (
          <div role="tabpanel" id="panel-molecules" aria-labelledby="tab-molecules" className="space-y-12 animate-fade-in">
            <Heading level={2} className="text-lg font-serif font-semibold">Molecules</Heading>
            <Paragraph muted className="text-secondary max-w-3xl">Compound building blocks composed of multiple atoms.</Paragraph>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-primary border border-color p-6 shadow-card space-y-8">
                <header className="flex items-center justify-between mb-2">
                  <Heading level={2} className="text-lg font-serif font-semibold">Cards primary</Heading>
                </header>
                <Paragraph size="sm" muted className="text-secondary leading-relaxed">Cards display tokenized items with imagery, collection & pricing.</Paragraph>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Card image="/placeholder-1.jpg" title="Cosmic Explorer #1234" price="2.5 ETH" lastPrice="2.1 ETH" collection="Cosmic Collection" likes={142} href="#" />
                  <Card image="/placeholder-1.jpg" title="Nebula Chronicle #77" price="0.85 ETH" collection="Nebula Series" likes={12} href="#" />
                </div>
                <ul className="list-disc pl-5 space-y-1 text-secondary text-sm">
                  <li><span className="text-primary font-medium">Likes</span> increment locally.</li>
                  <li><span className="text-primary font-medium">Hover</span> elevates & reveals actions.</li>
                  <li><span className="text-primary font-medium">Focus</span> ring for keyboard access.</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-primary border border-color p-6 shadow-card space-y-8">
                <header className="flex items-center justify-between mb-2">
                  <Heading level={2} className="text-lg font-serif font-semibold">Cards secondary</Heading>
                </header>
                <Paragraph size="sm" muted className="text-secondary leading-relaxed">Cards display tokenized items with imagery, collection & pricing.</Paragraph>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Card image="/placeholder-1.jpg" title="Cosmic Explorer #1234" price="2.5 ETH" lastPrice="2.1 ETH" collection="Cosmic Collection" likes={142} href="#" />
                  <Card image="/placeholder-1.jpg" title="Nebula Chronicle #77" price="0.85 ETH" collection="Nebula Series" likes={12} href="#" />
                </div>
                <ul className="list-disc pl-5 space-y-1 text-secondary text-sm">
                  <li><span className="text-primary font-medium">Likes</span> increment locally.</li>
                  <li><span className="text-primary font-medium">Hover</span> elevates & reveals actions.</li>
                  <li><span className="text-primary font-medium">Focus</span> ring for keyboard access.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
