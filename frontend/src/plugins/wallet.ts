import type { App } from 'vue'
import SolanaWallets from 'solana-wallets-vue'
import {
  BitKeepWalletAdapter,
  BitpieWalletAdapter,
  BloctoWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  CoinhubWalletAdapter,
  ExodusWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SafePalWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  SolongWalletAdapter,
  TokenPocketWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { createPinia } from 'pinia'

export const install = ({ isClient, initialState, app }: { isClient, initialState, app: App<Element> }) => {
  const pinia = createPinia()
  app.use(pinia)
  // Refer to
  // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
  // for other serialization strategies.
  if (isClient) {
    pinia.state.value = initialState.pinia || {}
  } else {
    initialState.pinia = pinia.state.value
  }
  // const network = WalletAdapterNetwork.Mainnet;
  app.use(SolanaWallets, {
    wallets: [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolongWalletAdapter(),
      new CloverWalletAdapter(),
      new ExodusWalletAdapter(),
      new BitKeepWalletAdapter(),
      new BitpieWalletAdapter(),
      new Coin98WalletAdapter(),
      new CoinhubWalletAdapter(),
      new SafePalWalletAdapter(),
      new TokenPocketWalletAdapter(),
      new GlowWalletAdapter(),
      new MathWalletAdapter(),
      new LedgerWalletAdapter(),
      new BloctoWalletAdapter(),
    ],
    autoConnect: false,
  })
}
