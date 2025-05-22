<template>
  <header
    class="flex h-16 flex-none items-center justify-between gap-2 border-b border-solid border-apple-gray-200 bg-white px-6 backdrop-blur-md bg-opacity-90"
  >
    <div class="flex items-center">
      <a :href="userinfo.html_url" rel="noopener noreferrer" class="transition-opacity duration-300 hover:opacity-80">
        <img :src="userinfo.avatar_url" alt="" class="w-10 h-10 rounded-full object-cover border border-apple-gray-100 shadow-sm" />
      </a>

      <a
        :href="`${userinfo.html_url}?tab=repositories`"
        rel="noopener noreferrer"
        class="ml-3 text-xl font-sf-pro-display font-semibold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300"
      >
        <h2 class="flex items-center">
          {{ $t('userTitle', { username: userinfo.name }) }}
          <svg-icon name="share" class="ml-1 text-sm text-[var(--primary)]" />
        </h2>
      </a>
    </div>

    <span class="flex-auto"></span>

    <span class="cursor-pointer flex items-center apple-button text-sm py-1 px-3" @click="handleChangeLang">
      <svg-icon name="translate" class="text-lg mr-1" />
      <span>{{ userStore.lang === 'zh' ? '中文' : 'English' }}</span>
    </span>

    <a :href="BRAND_URI" class="ml-4 flex items-center text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300">
      <svg-icon name="github" class="text-xl" />
    </a>
  </header>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import { BRAND_URI } from '@/constants';

const userStore = useUserStore();
const { userinfo } = userStore;

const handleChangeLang = () => {
  const newLang = userStore.lang === 'zh' ? 'en' : 'zh';
  userStore.$patch({ lang: newLang });
};
</script>
