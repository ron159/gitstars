<template>
  <div class="flex h-full w-72 flex-none flex-col bg-apple-gray-50 text-[var(--text-primary)] border-r border-apple-gray-200">
    <a :href="BRAND_URI" class="block no-underline">
      <h1
        class="flex h-16 flex-none items-center justify-center font-sf-pro-display text-2xl font-bold text-[var(--primary)] border-b border-apple-gray-200"
      >
        <svg-icon name="logo" class="mr-2" />
        {{ BRAND }}
      </h1>
    </a>

    <TagSrcTab />

    <TagSrcTabSelf v-show="tagStore.tagSrc === 'star'" />
    <TagSrcGithub v-show="tagStore.tagSrc === 'ranking'" />

    <footer
      class="h-10 flex-none border-t border-solid border-apple-gray-200 font-sf-pro text-sm"
    >
      <a
        :href="userStore.userinfo.html_url"
        class="flex h-full items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300"
        rel="noopener noreferrer"
      >
        <span class="mr-1">作者：</span>
        <span class="font-medium">
          {{ userStore.userinfo.html_url.split('/').pop() }}
          <svg-icon name="share" class="text-xs ml-1" />
        </span>
      </a>
    </footer>
  </div>
</template>

<script setup>
import TagSrcTab from './tag-src-tab.vue';
import TagSrcTabSelf from './tag-src-self/index.vue';
import TagSrcGithub from './tag-src-github.vue';
import { useUserStore } from '@/store/user';
import { useTagStore } from '@/store/tag';
import { BRAND, BRAND_URI } from '@/constants';

const userStore = useUserStore();
const tagStore = useTagStore();
</script>

<style scoped>
:deep(.tag-item) {
  border-left: 3px solid transparent;
  @apply transition-all duration-200;
}

:deep(.tag-item.selected) {
  border-left-color: var(--primary);
  background-color: #ffffff;
  @apply shadow-sm;
}

:deep(.tag-item:hover:not(.selected)) {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
