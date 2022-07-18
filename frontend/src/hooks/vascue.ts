import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import VascueAbi from '~/abi/contract.json'

export function useVascueContract() {
  return useContract({
    abi: VascueAbi as Abi,
    address: '0x063c09d45fef3c4968102c2384fff92b40f41edd9ab4d89f93c2dd93c87ecc74',
  })
}
