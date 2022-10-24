import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { Cluster, Commitment } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import { DEFAULT_COMMITMENT, DEFAULT_CONFIRM_TIMEOUT, DEFAULT_ENDPOINT, ENDPOINTS } from '~/config'

export type ExtendedCluster = Cluster | 'localnet'

export interface Endpoint {
  id: string
  name: string
  cluster: ExtendedCluster
  url: string
}

export const useConnectionStore = defineStore({
  id: 'connection',
  state: () => ({
    commitment: DEFAULT_COMMITMENT,
    confirmTransactionInitialTimeout: DEFAULT_CONFIRM_TIMEOUT,
    rpc: useStorage<string>('rpc', ''),
  }),
  getters: {
    endpoint(state) {
      return ENDPOINTS.find(e => e.id === state.rpc) ?? DEFAULT_ENDPOINT
    },
    connection(state): Connection {
      return new Connection(this.endpoint.url, {
        confirmTransactionInitialTimeout: state.confirmTransactionInitialTimeout,
        commitment: state.commitment,
      })
    },
    cluster(): ExtendedCluster {
      return this.endpoint.cluster
    },
  },
  actions: {
    setRpc(rpc: string) {
      this.rpc = rpc
    },
    setCommitment(commitment: Commitment) {
      this.commitment = commitment
    },
  },
})
