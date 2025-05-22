<template>
  <div class="unauth h-full w-full bg-[var(--background-light)] flex flex-col items-center justify-center">
    <div class="max-w-4xl mx-auto text-center px-6 py-16">
      <h1 class="apple-heading text-6xl mb-4 tracking-tight">{{ BRAND }}</h1>
      <p class="apple-subheading text-xl mb-12 max-w-2xl mx-auto">管理和发现您的GitHub收藏，以全新的方式组织和探索您关注的项目。</p>
      
      <div class="apple-card p-8 mb-12 max-w-3xl mx-auto">
        <img src="/example-your-stars.png" alt="Screenshot" class="w-full rounded-lg shadow-lg mb-8" />
        <p class="text-lg text-[var(--text-secondary)] mb-6">更简洁、更优雅的界面，帮助您高效管理GitHub星标。</p>
      </div>
      
      <a
        v-if="!clientIdError"
        class="apple-button inline-flex items-center justify-center text-base"
        :href="authURL"
        target="_self"
      >
        <svg-icon name="github" class="mr-2 text-xl" />
        <span>{{ $t('loginTip') }}</span>
      </a>
      
      <div v-else class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">配置错误：</strong>
        <span class="block sm:inline">{{ clientIdError }}</span>
        <p class="mt-2 text-sm">请配置环境变量 VITE_GITSTARS_CLIENT_ID</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BRAND } from '@/constants';

const clientIdError = ref('');
const clientId = import.meta.env.VITE_GITSTARS_CLIENT_ID;

onMounted(() => {
  if (!clientId) {
    clientIdError.value = '未找到GitHub OAuth客户端ID。';
    console.error('缺少VITE_GITSTARS_CLIENT_ID环境变量，无法生成认证URL');
  }
});

const authURL = clientId 
  ? `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${location.origin}&scope=public_repo`
  : '#';
</script>

<style scoped>
.unauth {
  background-color: var(--background-light);
  background-image: linear-gradient(180deg, #ffffff 0%, var(--background-light) 100%);
}
</style>
