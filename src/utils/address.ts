// src/utils/address.ts

/**
 * Truncates a Solana address for display purposes
 */
export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Formats collector counts with proper suffixes
 */
export function formatCollectorCount(count: number): string {
  const suffixes = ['', 'K', 'M', 'B'];
  let suffixNum = 0;
  let shortValue = count;

  while (shortValue >= 1000) {
    shortValue /= 1000;
    suffixNum++;
  }

  return shortValue.toFixed(suffixNum === 0 ? 0 : 1) + suffixes[suffixNum];
}