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
        class="apple-button inline-flex items-center justify-center text-base"
        :href="authURL"
        target="_self"
      >
        <svg-icon name="github" class="mr-2 text-xl" />
        <span>{{ $t('loginTip') }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { BRAND } from '@/constants';

const authURL = `https://github.com/login/oauth/authorize?client_id=${
  import.meta.env.VITE_GITSTARS_CLIENT_ID
}&redirect_uri=${location.origin}&scope=public_repo`;
</script>

<style scoped>
.unauth {
  background-color: var(--background-light);
  background-image: linear-gradient(180deg, #ffffff 0%, var(--background-light) 100%);
}
</style>
