import { ElNotification } from 'element-plus'
import { useWallet } from 'solana-wallets-vue'
import { watch } from 'vue'
import { useEmit } from '~/hooks'
import { useConnectionStore } from '~/stores'
import { shortenAddress } from '~/utils'

export const WALLET_CONNECT_EVENT = Symbol('WALLET_CONNECT_EVENT')
export const WALLET_DISCONNECT_EVENT = Symbol('WALLET_DISCONNECT_EVENT')
export const ACCOUNT_CHANGE_EVENT = Symbol('ACCOUNT_CHANGE_EVENT')

const noticeTimeout = 5000

export function initWallet() {
  const { connection } = useConnectionStore()
  const { emit } = useEmit().emitter
  const { wallet } = useWallet()

  watch(
    wallet,
    (w) => {
      if (!w) {
        return
      }

      const onConnect = () => {
        const publicKey = w.publicKey!
        connection.onAccountChange(publicKey, (acc) => {
          emit(ACCOUNT_CHANGE_EVENT, acc)
        })
        connection.onLogs(publicKey, (logs) => {
          console.log(logs)
        })
        ElNotification({
          title: 'Wallet update',
          message: `Connected to wallet ${shortenAddress(publicKey.toBase58(), 7)}`,
          type: 'success',
          duration: noticeTimeout,
        })
        emit(WALLET_CONNECT_EVENT, w)
      }

      const onDisconnect = () => {
        ElNotification({
          title: 'Wallet update',
          message: 'Disconnected from wallet',
          type: 'success',
          duration: noticeTimeout,
        })
        emit(WALLET_DISCONNECT_EVENT, w)
      }

      const onError = (e) => {
        if (!e?.message) {
          return
        }
        ElNotification({
          type: 'error',
          title: 'Wallet update',
          message: e.message,
          duration: noticeTimeout,
        })
      }

      w.once('connect', onConnect)
      w.once('disconnect', onDisconnect)

      w.removeAllListeners('error')
      w.on('error', onError)
    },
    { immediate: true },
  )
}
