<template>
  <div
    class="relative w-96 flex-none border-r border-solid border-apple-gray-200 bg-white"
  >
    <RepositorySearch />

    <DynamicScroller
      ref="refRepositoryList"
      :items="repositoryStore.filteredRepositories"
      :min-item-size="100"
      key-field="id"
      class="overflow-y-auto overflow-x-hidden"
      style="height: calc(100% - 2.25rem)"
      @click="handleClickRepository"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          class="cursor-pointer border-b border-solid border-apple-gray-100 px-6 py-5 transition-all duration-200"
          :item="item"
          :active="active"
          :size-dependencies="[
            item.name,
            item.topics,
            item.description,
            item.language,
          ]"
          :data-repository-id="item.id"
          :data-index="index"
          :class="{
            selected: item.id === repositoryStore.selectedId,
          }"
        >
          <RepositoryCard :repository="item" />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>

    <div 
      v-show="tagStore.tagSrc === 'star' && repositoryStore.all.length === 0"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
    >
      <svg-icon
        name="loading"
        class="animate-spin text-3xl text-[var(--primary)] mb-4"
      />
      <p class="text-[var(--text-secondary)] text-sm">加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import RepositoryCard from './repository-card.vue';
import RepositorySearch from './repository-search.vue';
import { useRepositoryStore } from '@/store/repository';
import { useTagStore } from '@/store/tag';

const repositoryStore = useRepositoryStore();
const tagStore = useTagStore();
const refRepositoryList = ref(null);

watch(
  () => repositoryStore.filteredRepositories,
  () => {
    refRepositoryList.value?.$el.scrollTo({ top: 0 });
  },
);

function handleClickRepository(e) {
  let elRepository = e.target;
  while (!elRepository.dataset.repositoryId) {
    elRepository = elRepository.parentElement;
    if (!elRepository) return;
  }
  repositoryStore.$patch({
    selectedId: Number(elRepository.dataset.repositoryId),
  });
}

repositoryStore.resolveRepositories();
</script>

<style scoped>
.selected {
  background-color: var(--background-light);
  border-left: 3px solid var(--primary);
}

:deep(.vue-recycle-scroller__item-wrapper) {
  overflow: visible;
}

:deep(.selected:hover) {
  background-color: var(--background-light);
}
</style>
