import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import VascueAbi from '~/abi/contract.json'

export function useVascueContract() {
  return useContract({
    abi: VascueAbi as Abi,
    address: '0x07d8bb55dd997724a7df107c98ecb405c9a328cda99116b4d67bbaf313179f50',
  })
}
