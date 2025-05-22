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
      class="relative ml-3"
    >
      <div
        :aria-label="$t(`repo.sort.${repositoryStore.sortType}`)"
        role="tooltip"
        data-microtip-position="top"
        class="cursor-pointer text-base text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300"
        @click="toggleSortMenu"
      >
        <svg-icon :name="sortIconMap[repositoryStore.sortType]"></svg-icon>
      </div>

      <!-- 排序下拉菜单 -->
      <div 
        v-if="showSortMenu" 
        class="absolute top-full right-0 mt-1 w-36 bg-white rounded-lg shadow-apple-card z-10 py-1 border border-apple-gray-200"
        ref="sortMenu"
      >
        <div 
          v-for="type in sortTypes" 
          :key="type" 
          class="px-3 py-2 text-sm cursor-pointer hover:bg-apple-gray-50 flex items-center"
          :class="{'text-[var(--primary)]': repositoryStore.sortType === type}"
          @click="handleSelectSortType(type)"
        >
          <svg-icon :name="sortIconMap[type]" class="mr-2 text-base" />
          {{ $t(`repo.sort.${type}`) }}
        </div>
      </div>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRepositoryStore } from '@/store/repository';
import { useTagStore } from '@/store/tag';
import { debounce } from 'lodash';

const tagStore = useTagStore();
const repositoryStore = useRepositoryStore();
const refInput = ref(null);
const showSortMenu = ref(false);
const sortMenu = ref(null);

const sortTypes = ['time', 'star', 'commit'];
const sortIconMap = {
  time: 'time',
  star: 'star',
  commit: 'clock'
};

const handleInputRepositoryName = debounce(({ target }) => {
  repositoryStore.$patch({ filterText: target.value });
}, 300);

function handleClickClose() {
  repositoryStore.$patch({ filterText: '' });
  refInput.value.value = '';
}

function toggleSortMenu() {
  showSortMenu.value = !showSortMenu.value;
}

function handleSelectSortType(type) {
  repositoryStore.$patch({ sortType: type });
  showSortMenu.value = false;
}

// 点击外部关闭下拉菜单
function handleClickOutside(event) {
  if (sortMenu.value && !sortMenu.value.contains(event.target) && showSortMenu.value) {
    showSortMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
