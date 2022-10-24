<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import { reactive, ref } from 'vue'
import { Eleme } from '@element-plus/icons-vue'
import { getTokenPrice } from '~/hooks/api/coingecko'
import type { ExchangeForm } from '~/hooks/api/tg'
import { useApiTg } from '~/hooks/api/tg'
const loading = ref(true)
const { tg } = useTg()
const FIXED_COUNT = 6

interface Token {
  name: string
  label: string
  usd: number
}

const apiTg = useApiTg()

const tokens = ref<Token[]>([
  {
    name: 'SOL',
    label: 'solana',
    usd: 1,
  },
  {
    name: 'JSOL',
    label: 'jpool',
    usd: 1,
  },
])

const form = ref<ExchangeForm>({
  sendToken: 0,
  sendCurrency: 0,
  receiveToken: 0,
  receiveCurrency: 1,
  wallet: '',
})

const onSubmit = async () => {
  loading.value = !loading.value
  const data = {
    ...form.value,
    sendCurrency: tokens.value[form.value.sendCurrency].name,
    receiveCurrency: tokens.value[form.value.receiveCurrency].name,
  }
  await tg.sendData(JSON.stringify(data))
  loading.value = !loading.value
}

const swap = () => {
  [form.value.receiveToken, form.value.sendToken, form.value.sendCurrency, form.value.receiveCurrency] = [form.value.sendToken, form.value.receiveToken, form.value.receiveCurrency, form.value.sendCurrency]
}

const topInputChange = () => {
  form.value.receiveToken = form.value.sendToken * tokens.value[form.value.sendCurrency].usd / tokens.value[form.value.receiveCurrency].usd
  form.value.receiveToken = Number(form.value.receiveToken.toFixed(FIXED_COUNT))
}

const bottomInputChange = () => {
  form.value.sendToken = form.value.receiveToken * tokens.value[form.value.receiveCurrency].usd / tokens.value[form.value.sendCurrency].usd
  form.value.sendToken = Number(form.value.sendToken.toFixed(FIXED_COUNT))
}

const topSelectChange = () => {
  form.value.receiveCurrency = form.value.sendCurrency === 1 ? 0 : 1
}

const initData = async () => {
  loading.value = true
  await Promise.all(tokens.value.map(async (token) => {
    const answer = await getTokenPrice(token.label, 'usd')
    token.usd = answer.current_price
  }))

  loading.value = false
}
const valid: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return form.value.receiveCurrency !== undefined && !!form.value.receiveToken && !form.value.sendCurrency !== undefined && !!form.value.sendToken && !!form.value.wallet
  },
  set() { },
})

onMounted(async () => {
  try {
    await initData()
  } catch (error) {

  }
})
</script>

<template>
  <div class="swap">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Exchange token</span>
        </div>
      </template>
      <el-input
        v-model="form.sendToken" autofocus type="number" size="large" placeholder="You send"
        @input="topInputChange"
      >
        <template #append>
          <el-select
            v-model="form.sendCurrency" size="large" placeholder="Select" style="width: 100px"
            @change="topSelectChange"
          >
            <el-option v-for="(token, index) of tokens" :key="index" :label="token.name" :value="index" />
          </el-select>
        </template>
      </el-input>
      <div>
        <el-button class="swap-button" @click="swap">
          <el-icon>
            <refresh />
          </el-icon>
        </el-button>
      </div>
      <el-input v-model="form.receiveToken" size="large" placeholder="You get" @input="bottomInputChange">
        <template #append>
          <el-select v-model="form.receiveCurrency" disabled="" size="large" placeholder="Select" style="width: 100px">
            <el-option v-for="(token, index) of tokens" :key="index" :label="token.name" :value="index" />
          </el-select>
        </template>
      </el-input>

      <div class="swap-label">
        <span>{{ tokens[form.receiveCurrency].name }} Wallet receiver:</span>
      </div>

      <el-input v-model="form.wallet" :placeholder="`${tokens[form.receiveCurrency].name}`" class="input-wallet" />

      <el-button
        type="secondary" size="large" :disabled="!valid" class="confirm-button" :loading-icon="Eleme"
        :loading="loading" @click="onSubmit"
      >
        Swap
      </el-button>

      <div v-if="!loading" class="swap-label text-right">
        <span>
          1 {{ tokens[form.sendCurrency].name }} = {{ (tokens[form.sendCurrency].usd
            / tokens[form.receiveCurrency].usd).toFixed(FIXED_COUNT) }} {{ tokens[form.receiveCurrency].name }}
        </span>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.swap {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;

  .swap-button {
    position: absolute;
    z-index: 10;
    left: calc(50% - 15px);
    top: 45px;
    border-radius: 50%;
    padding: 0;
    height: 30px;
    width: 30px;
  }

  .confirm-button {
    margin-top: 15px;
    width: 100%;
  }
}
</style>

<style lang="scss">
.text-right {
  text-align: right;
}

.swap {
  .el-card__body {
    position: relative;
  }

  .swap-label {
    margin-top: 10px;
    padding: 6px 0;
    margin-bottom: 0px;
    font-size: 12px;
  }
}
</style>
