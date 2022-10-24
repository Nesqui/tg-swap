<script lang="ts" setup>
import type { Wallet } from 'solana-wallets-vue'
import { useWallet } from 'solana-wallets-vue'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { shortenAddress } from '~/utils'
import ledgerDarkSvg from '~/assets/img/wallets/ledger.svg'
import mathWalletDarkSvg from '~/assets/img/wallets/mathwallet.svg'

const walletPriority = {
  solflare: 10,
  phantom: 20,
  sollet: 5,
  blocto: 4,
}
const darkIcons = {
  ledger: ledgerDarkSvg,
  mathwallet: mathWalletDarkSvg,
}

const wallet = useWallet()
const { publicKey, connected } = wallet

const isActiveWallet = (w: Wallet) => [WalletReadyState.Installed, WalletReadyState.Loadable].includes(w.readyState)

const walletAddress = computed(() => publicKey.value?.toBase58() ?? '')
const walletShortAddress = computed(() => shortenAddress(walletAddress.value))
const wallets = computed<Wallet[]>(() =>
  [...wallet.wallets.value]
    .map((w) => {
      // @ts-expect-error ...
      w.darkIcon = darkIcons[w.name.toLowerCase()]
      return w
    })
    .sort((a, b) => {
      const aPriority = walletPriority[a.name.toLowerCase()] ?? 1
      const bPriority = walletPriority[b.name.toLowerCase()] ?? 1
      return (
        bPriority - aPriority + ((isActiveWallet(b) ? 1 : 0) - (isActiveWallet(a) ? 1 : 0))
      )
    }),
)
const dialog = ref(false)

async function select(w: Wallet) {
  await wallet.select(w.name)
  dialog.value = false
  await wallet.connect()
}

function disconnect() {
  wallet.disconnect()
  dialog.value = false
}

function ok() {
  dialog.value = false
}
</script>

<template>
  <el-button v-bind="$attrs" size="large" class="wallet-btn" type="success" round @click="dialog = true">
    <img src="@/assets/img/logo/solana-logo.svg" class="solana-logo" alt="">

    <span>{{ connected ? walletShortAddress : "Connect Wallet" }}</span>
  </el-button>

  <el-dialog
    v-model="dialog" modal-class="wallets-dialog" :append-to-body="true"
    :title="connected ? 'Your wallet' : 'Connect to a wallet'"
  >
    <div v-if="connected">
      <div>
        <!-- <copy-to-clipboard :text="walletAddress" /> -->
        {{ walletAddress }}
      </div>
      <el-divider />
      <div>
        <div class="q-gutter-md row justify-between">
          <el-button outline rounded @click="disconnect">
            Disconnect
          </el-button>
          <el-button outline rounded @click="ok">
            Ok
          </el-button>
        </div>
      </div>
    </div>

    <el-row v-else class="wallet-connect-card" :class="{ 'wallet-connect-card--dark': isDark }">
      <el-col v-for="(w, i) in wallets" :key="`wallet${i}`" :span="24" :sm="12">
        <el-card clickable :disable="!isActiveWallet(w)" shadow="hover" @click="select(w)">
          <el-row class="wallet-content" justify="space-between">
            <div>
              <b>{{ w.name }}</b>
              <div
                class="text-light-gray text-caption full-width text-no-wrap"
                style="text-overflow: ellipsis; overflow: hidden"
              >
                {{ w.url }}
              </div>
            </div>
            <el-avatar :size="40" square>
              <img :src="isDark ? w.icon : w.darkIcon ?? w.icon" alt="wallet icon">
            </el-avatar>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style scoped lang="scss">
.wallet-connect-card {
  .el-card {
    min-height: 48px;
    padding: 0;
    cursor: pointer;
    border: 1px solid #f5f5f5;
    margin: 3px;

    &:hover {
      border-color: #e8e8e8;
    }
  }

  .el-card__body {
    padding: 8px 16px;
  }

  .wallet-content {
    height: 40px;
    width: 100%;

    >:first-child {
      width: auto;
      min-width: 0;
      max-width: 100%;
      flex: 10000 1 0%;
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;

      div {
        font-size: .75rem;
        line-height: 1.25rem;
        letter-spacing: .03333em;
        color: #9eb3bd !important;
        white-space: nowrap;
      }
    }

    >:last-child {
      align-items: flex-end;
      padding-right: 0;
      padding-left: 16px;
    }
  }

  .el-avatar {
    background: var(--el-fill-color-blank);
  }

  &--dark {
    .el-avatar {
      background: var(--el-bg-color-overlay);
    }
  }
}

.wallet-btn {
  color: var(--el-color-white);
  font-size: 15px;
  background: var(--tg-theme-secondary-bg-color);
  border: none;
  padding: 12px 6px;

  span {
    padding: 0 7px;
  }

  img {
    background-color: white;
    border-radius: 50%;
    width: 31px;
    height: 31px;
    padding: 8px;
  }
}
</style>

<style lang="scss">
.wallets-dialog {
  .el-dialog {
    max-width: 560px;
    border-radius: 12px;
    margin-top: 10vh;
    max-height: 80vh;
    margin-left: auto;
    margin-right: auto;
    width: 92vw;
    overflow-y: auto;
  }
}

.wallet-connect-card {
  .el-card__body {
    padding: 8px 16px;
  }
}
</style>
