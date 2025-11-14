'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { Heart, MoreVertical } from 'lucide-react';

/**
 * Props for the Card component
 */
export interface CardProps {
  /** Image URL for the card thumbnail */
  image: string;
  /** Title/name of the item displayed on the card */
  title: string;
  /** Current price of the item (e.g., "2.5 ETH") */
  price: string;
  /** Optional last sale price for comparison */
  lastPrice?: string;
  /** Optional collection name the item belongs to */
  collection?: string;
  /** Initial like count for the item */
  likes?: number;
  /** Link URL when card is clicked (defaults to "#") */
  href?: string;
}

/**
 * Card Component
 * 
 * A feature-rich, interactive card component for displaying NFT/marketplace items.
 * Includes image preview, pricing information, like functionality, and hover effects.
 * Inspired by OpenSea's card design with smooth animations and dark mode support.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Card
 *   image="/nft-image.jpg"
 *   title="Cosmic Explorer #1234"
 *   price="2.5 ETH"
 * />
 * 
 * // Full features
 * <Card
 *   image="/nft-image.jpg"
 *   title="Cosmic Explorer #1234"
 *   price="2.5 ETH"
 *   lastPrice="2.1 ETH"
 *   collection="Cosmic Collection"
 *   likes={142}
 *   href="/item/1234"
 * />
 * ```
 * 
 * @param props - Component props
 * @param props.image - URL of the card image
 * @param props.title - Item title displayed on the card
 * @param props.price - Current price string
 * @param props.lastPrice - Optional previous sale price
 * @param props.collection - Optional collection name
 * @param props.likes - Initial like count (defaults to 0)
 * @param props.href - Card link destination (defaults to "#")
 * @returns An interactive card with image, pricing, and like functionality
 */
export function Card({
  image,
  title,
  price,
  lastPrice,
  collection,
  likes = 0,
  href = '#',
}: CardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  /**
   * Handles like button click
   * Prevents navigation and toggles like state
   * @param e - Mouse event from button click
   */
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <motion.a
      href={href}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group block"
    >
  <div className="relative overflow-hidden rounded-2xl border border-color bg-primary shadow-card hover:shadow-card-hover transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--text-primary)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-primary)]">
        {/* Image Container */}
  <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`p-2 rounded-lg backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-primary/90 text-secondary'
              }`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            </motion.button>
            <button className="p-2 rounded-lg bg-primary/90 backdrop-blur-sm text-secondary hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]">
              <MoreVertical size={18} />
            </button>
          </div>

          {/* Like Count Badge */}
          {likeCount > 0 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-primary/90 backdrop-blur-sm flex items-center gap-1.5">
              <Heart size={14} className="text-secondary" />
              <span className="text-sm font-medium text-secondary">
                {likeCount}
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
  <div className="p-4">
          {/* Collection Name */}
          {collection && (
            <p className="text-sm text-[var(--text-primary)] font-medium mb-1">
              {collection}
            </p>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold text-primary mb-3 truncate">
            {title}
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-secondary mb-1">
                Current Price
              </p>
              <p className="text-base font-bold text-primary">
                {price}
              </p>
            </div>
            {lastPrice && (
              <div className="text-right">
                <p className="text-xs text-secondary mb-1">
                  Last Sale
                </p>
                <p className="text-sm text-secondary">
                  {lastPrice}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default Card;