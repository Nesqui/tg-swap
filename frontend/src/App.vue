<script setup lang="ts">
import './assets/styles/main.scss'

useHead({
  title: import.meta.env.VITE_APP_TITLE,
  meta: [
    { name: 'description', content: import.meta.env.VITE_APP_DESCRIPTION },
    { name: 'keywords', content: import.meta.env.VITE_APP_KEYWORDS },
    {
      name: 'theme-color',
      content: computed(() => (isDark.value ? '#00aba9' : '#ffffff')),
    },
  ],

})
</script>

<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>
