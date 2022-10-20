<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <error-container :code="404" message="Page not found">
    <div class="mt-lg">
      <el-button type="primary" size="large" @click="router.back()">
        Back
      </el-button>
    </div>
  </error-container>
</template>

<route lang="yaml">
meta:
  layout: 404
</route>
