<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import { reactive, ref } from 'vue'
import { Eleme } from '@element-plus/icons-vue'
import { getTokenPrice } from '~/hooks/api/coingecko'
import type { StakeForm } from '~/hooks/api/tg'
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

const form = ref<StakeForm>({
  stakeToken: 0,
  stakeCurrency: 0,
  receiveToken: 0,
  receiveCurrency: 1,
  wallet: '',
})

const onSubmit = async () => {
  loading.value = !loading.value
  const data = {
    ...form.value,
    stakeCurrency: tokens.value[form.value.stakeCurrency].name,
    receiveCurrency: tokens.value[form.value.receiveCurrency].name,
  }
  await tg.sendData(JSON.stringify(data))
  loading.value = !loading.value
}

const initData = async () => {
  loading.value = true
  await Promise.all(tokens.value.map(async (token) => {
    const answer = await getTokenPrice(token.label, 'usd')
    token.usd = answer.current_price
  }))

  loading.value = false
}

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
          <span>Stake token</span>
        </div>
      </template>
      <el-input
        v-model="form.stakeToken" autofocus type="number" size="large" placeholder="You send"
      >
        <template #append>
          <el-select
            v-model="form.stakeCurrency" size="large" placeholder="Select" style="width: 100px"
          >
            <el-option v-for="(token, index) of tokens" :key="index" :label="token.name" :value="index" />
          </el-select>
        </template>
      </el-input>

      <el-button
        type="secondary" size="large" :disabled="!form.stakeCurrency===undefined || !form.stakeToken" class="confirm-button" :loading-icon="Eleme"
        :loading="loading" @click="onSubmit"
      >
        Swap
      </el-button>

      <div v-if="!loading" class="swap-label text-right">
        <span>
          1 {{ tokens[form.stakeCurrency].name }} = {{ tokens[form.stakeCurrency].usd }} USD
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
