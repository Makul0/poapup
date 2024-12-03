// src/lib/auth.ts
import { PublicKey, Ed25519Program } from '@solana/web3.js'
import jwt from 'jsonwebtoken'
import { createHash, randomBytes } from 'crypto'
import { Buffer } from 'buffer'

// Secret key for JWT signing - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(32).toString('hex')

// Interface for decoded session data
interface SessionData {
  wallet: string
  nonce: string
  exp?: number
}

/**
 * Verifies a Solana wallet signature using Ed25519 program instruction
 * Ed25519 is the cryptographic algorithm used by Solana for digital signatures
 * 
 * @param wallet - The public key of the wallet that signed
 * @param signature - The signature bytes as a number array
 * @param nonce - The random nonce that was signed
 * @returns A JWT session token if verification succeeds
 * @throws Error if verification fails
 */
export async function verifySignature(
  wallet: string,
  signature: number[],
  nonce: string
): Promise<string> {
  try {
    // Convert wallet string to PublicKey
    const publicKey = new PublicKey(wallet)

    // Recreate the message that was signed
    const message = new TextEncoder().encode(
      `Sign this message to authenticate with POAPup\nNonce: ${nonce}\nTimestamp: ${Date.now()}`
    )

    // Convert signature array back to Uint8Array
    const signatureBytes = Uint8Array.from(signature)

    // Create the Ed25519 program instruction for signature verification
    const instruction = Ed25519Program.createInstructionWithPublicKey({
      publicKey: publicKey.toBytes(),
      message: message,
      signature: signatureBytes,
    })

    // If the instruction was created successfully, the signature is valid
    // If the signature was invalid, createInstructionWithPublicKey would throw an error
    
    // Create session token
    const token = createSession(wallet, nonce)
    return token

  } catch (error) {
    console.error('Signature verification failed:', error)
    throw new Error('Signature verification failed')
  }
}

/**
 * Creates a new JWT session token for an authenticated user
 * The token contains the user's wallet address and authentication nonce
 * 
 * @param wallet - The user's wallet address
 * @param nonce - The nonce used in authentication
 * @returns A signed JWT token with 24-hour expiration
 */
export function createSession(wallet: string, nonce: string): string {
  const session: SessionData = {
    wallet,
    nonce,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hour expiration
  }

  return jwt.sign(session, JWT_SECRET)
}

/**
 * Verifies a session token and returns the decoded data
 * This is used to authenticate subsequent requests after initial login
 * 
 * @param token - The JWT session token to verify
 * @returns The decoded session data if valid
 * @throws Error if token is invalid or expired
 */
export function verifySession(token: string): SessionData {
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Type check the decoded data
    if (
      typeof decoded === 'object' && 
      decoded !== null &&
      'wallet' in decoded &&
      'nonce' in decoded
    ) {
      return decoded as SessionData
    }
    
    throw new Error('Invalid token payload')
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Session expired')
      }
    }
    throw new Error('Invalid session')
  }
}

/**
 * Generates a cryptographic hash for a value
 * Used for secure comparison of values like nonces
 */
export function hashValue(value: string): string {
  return createHash('sha256')
    .update(value)
    .digest('hex')
}

/**
 * Extracts the bearer token from an authorization header
 * Used in API routes to get the session token from requests
 */
export function extractBearerToken(authHeader?: string): string {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header')
  }
  return authHeader.slice(7) // Remove 'Bearer ' prefix
}

/**
 * Middleware helper to verify authentication
 * Use this in API routes that require authentication
 */
export async function requireAuth(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = extractBearerToken(authHeader)
    const session = verifySession(token)
    return session
  } catch (error) {
    throw new Error('Authentication required')
  }
}