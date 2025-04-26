import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Generates a placeholder image URL
 */
export function getPlaceholderImage(width: number, height: number, text?: string): string {
  const textParam = text ? `&text=${encodeURIComponent(text)}` : ''
  return `https://via.placeholder.com/${width}x${height}?text=${textParam}`
}

/**
 * Formats a number to a human-readable string (e.g., 1.2K, 3.4M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Extracts domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch (e) {
    return ''
  }
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * Generates initials from a name
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

/**
 * Formats a spotify URI to a human-readable link
 */
export function formatSpotifyUri(uri: string): string {
  // Example: spotify:track:4iV5W9uYEdYUVa79Axb7Rh -> https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
  if (!uri || typeof uri !== 'string') return ''
  
  const parts = uri.split(':')
  if (parts.length < 3) return ''
  
  return `https://open.spotify.com/${parts[1]}/${parts[2]}`
}

/**
 * Debounce function for limiting how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}