// src/utils/address.ts
/**
 * Truncates a Solana address for display purposes
 * Example: "5b4ZfyhVEuHEiUWzoWPrQqvhWD3WLyktPpQm2xs2CnyJ" -> "5b4Z...CnyJ"
 */
export function truncateAddress(address: string, startLength = 4, endLength = 4): string {
    if (!address) return ''
    
    if (address.length <= startLength + endLength) {
      return address
    }
  
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
  }
  
  /**
   * Formats a number of POAPs for display
   * Adds commas for thousands and handles plural form
   */
  export function formatPoapCount(count: number): string {
    const formatted = count.toLocaleString()
    return `${formatted} POAP${count !== 1 ? 's' : ''}`
  }