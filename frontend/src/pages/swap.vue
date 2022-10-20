<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Eleme } from '@element-plus/icons-vue'
const loading = ref(true)

interface Token {
  name: string
  label: string
  usd: number
}

const onSubmit = async () => {
  loading.value = !loading.value

  loading.value = !loading.value
}

const initData = async () => {
  loading.value = true
  const route = useRoute()
  console.log(route.query)
  loading.value = false
}

onMounted(async () => {
  try {
  } catch (error) {

  }
})
</script>

<template>
  <div class="swap">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Confirm swap</span>
        </div>
      </template>

      <el-button
        type="secondary" size="large" :disabled="!valid" class="confirm-button" :loading-icon="Eleme"
        :loading="loading" @click="onSubmit"
      >
        Swap
      </el-button>
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
