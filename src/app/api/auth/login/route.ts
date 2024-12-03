import { NextResponse } from 'next/server'
import { verifySignature } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { wallet, signature, nonce } = await request.json()
    
    const sessionKey = await verifySignature(wallet, signature, nonce)
    
    return NextResponse.json({ sessionKey })
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}