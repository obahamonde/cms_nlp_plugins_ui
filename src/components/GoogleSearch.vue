<script setup lang="ts">
type SearchResult = {
  title: string;
  url: string;
};

const props = defineProps<{
  content: SearchResult[];
}>();
</script>
<template>
  <div class="col start w-auto">
    <ul class="list-none">
      <li v-for="r in props.content" class="mb-4">
        <a
          :href="r.url"
          target="_blank"
          class="text-xs text-accent no-underline text-caption hover:underline"
        >
          {{ r.title }}
        </a>
      </li>
    </ul>
  </div>
</template>
