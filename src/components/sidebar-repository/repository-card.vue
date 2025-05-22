<template>
  <div class="flex items-center justify-between font-sf-pro-display text-[var(--text-primary)]">
    <h2 class="text-base font-medium">
      <span
        v-if="medalMap[repository.ranking]"
        v-html="medalMap[repository.ranking]"
        class="mr-1"
      ></span>
      <a
        :href="`https://github.com/${repository.owner.login}/${repository.name}`"
        rel="noopener noreferrer"
        class="hover:text-[var(--primary)] transition-colors duration-300"
      >
        <span class="text-apple-gray-500">{{ repository.owner.login }}</span> / 
        <span class="font-bold">{{ repository.name }}</span>
      </a>
      <svg-icon name="share" class="ml-1 text-xs text-[var(--primary)]" />
    </h2>

    <a
      v-if="repository.homepage"
      :href="repository.homepage"
      class="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors duration-300"
      rel="noopener noreferrer"
    >
      <svg-icon name="link" />
    </a>
  </div>

  <ul
    class="flex flex-wrap text-xs text-apple-gray-500 mt-2"
    :class="{ disabled: disableTopic }"
    @click="handleClickTopic"
  >
    <li
      v-for="topic in repository.topics"
      :key="topic"
      :data-topic="topic"
      :class="{
        'selected-tag':
          !disableTopic &&
          tagStore.selectedTagType === 'topic' &&
          tagStore.selectedTag === topic,
      }"
      class="tag-topic mr-1 mt-1 rounded-full bg-apple-gray-100 px-2 py-0.5 hover:bg-[var(--primary)] hover:text-white transition-colors duration-300"
    >
      {{ topic }}
    </li>
  </ul>

  <div class="my-3 text-sm text-[var(--text-secondary)] leading-relaxed">{{ repository.description }}</div>

  <div class="flex justify-between items-center text-xs font-medium text-apple-gray-500">
    <div class="flex items-center">
      <span class="inline-flex items-center mr-3 bg-apple-gray-100 px-2 py-1 rounded-md">
        <svg-icon name="star-fill" class="mr-1 text-[var(--primary)]" />
        <span>{{ repository.stargazers_count }}</span>
      </span>

      <span class="inline-flex items-center bg-apple-gray-100 px-2 py-1 rounded-md">
        <svg-icon name="branch" class="mr-1 text-[var(--primary)]" />
        <span>{{ repository.forks_count }}</span>
      </span>
    </div>

    <span class="px-2 py-1 bg-apple-gray-100 rounded-md">{{ repository.language }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTagStore } from '@/store/tag';

defineProps({
  repository: {
    type: Object,
    required: true,
  },
});

const medalMap = {
  1: '&#129351;',
  2: '&#129352;',
  3: '&#129353;',
};
const tagStore = useTagStore();
const disableTopic = computed(() => tagStore.tagSrc !== 'star');

function handleClickTopic(e) {
  if (disableTopic.value) return;

  let elTag = e.target;
  while (!elTag.dataset.topic) {
    elTag = elTag.parentElement;
    if (!elTag) return;
  }
  tagStore.$patch({
    selectedTagTypeNav: 'topic',
    selectedTagType: 'topic',
    selectedTag: elTag.dataset.topic,
  });
}
</script>

<style scoped>
.selected-tag {
  background-color: var(--primary) !important;
  color: white !important;
}

.disabled .tag-topic {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
