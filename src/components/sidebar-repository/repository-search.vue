<template>
  <div class="flex h-10 items-center bg-apple-gray-50 px-4 text-xs text-[var(--text-secondary)] border-b border-apple-gray-200">
    <div class="relative flex-auto">
      <svg-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-400" />

      <input
        :placeholder="$t('repo.filterTip', { div: '|' })"
        ref="refInput"
        type="text"
        class="h-7 w-full flex-auto rounded-full bg-white px-8 outline-none shadow-sm border border-apple-gray-200 focus:border-[var(--primary)] transition-colors duration-300"
        @input="handleInputRepositoryName"
      />

      <svg-icon
        v-show="repositoryStore.filterText"
        name="close"
        class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-apple-gray-400 hover:text-apple-gray-600 transition-colors duration-300"
        @click="handleClickClose"
      />
    </div>

    <div
      v-show="tagStore.tagSrc === 'star'"
      :aria-label="$t(`repo.sort.${repositoryStore.sortType}`)"
      role="tooltip"
      data-microtip-position="top"
      class="ml-3 cursor-pointer text-base text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300"
    >
      <svg-icon
        :name="repositoryStore.sortType"
        @click="handleChangeSortType"
      ></svg-icon>
    </div>

    <div
      v-if="
        tagStore.tagSrc === 'star' &&
        repositoryStore.all.length !== 0 &&
        repositoryStore.loading
      "
      :aria-label="$t('repo.updating')"
      role="tooltip"
      data-microtip-position="top"
      class="ml-3 text-base"
    >
      <svg-icon name="loading" class="animate-spin text-[var(--primary)]" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRepositoryStore } from '@/store/repository';
import { useTagStore } from '@/store/tag';
import { debounce } from 'lodash';

const tagStore = useTagStore();
const repositoryStore = useRepositoryStore();
const refInput = ref(null);

const handleInputRepositoryName = debounce(({ target }) => {
  repositoryStore.$patch({ filterText: target.value });
}, 300);

function handleClickClose() {
  repositoryStore.$patch({ filterText: '' });
  refInput.value.value = '';
}

function handleChangeSortType() {
  const newSortType = repositoryStore.sortType === 'time' ? 'star' : 'time';
  repositoryStore.$patch({ sortType: newSortType });
}
</script>
