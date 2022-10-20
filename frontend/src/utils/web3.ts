import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import type BN from 'bn.js'

/**
 * Shorten the checksummed version of the input address
 * to have 4 characters at start and end
 */
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function lamportsToSol(lamports: number | BN): number {
  if (typeof lamports === 'number') {
    return Math.abs(lamports) / LAMPORTS_PER_SOL
  }

  let signMultiplier = 1
  if (lamports.isNeg()) {
    signMultiplier = -1
  }

  const absLamports = lamports.abs()
  const lamportsString = absLamports.toString(10).padStart(10, '0')
  const splitIndex = lamportsString.length - 9
  const solString = `${lamportsString.slice(0, splitIndex)}.${lamportsString.slice(splitIndex)}`
  return signMultiplier * parseFloat(solString)
}
