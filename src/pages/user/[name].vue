<script setup lang="ts">
const props = defineProps<{ name: string }>();
const router = useRouter();
const greeting = ref("");
const greet = async () => {
  const res = await fetch(`/api/${props.name}`);
  const data = await res.json();
  greeting.value = data.message;
};
onMounted(greet);
const modelValue = defineModels<{
  modelValue: string;
}>();
</script>

<template>
  <main class="col center p-12 gap-4 bg-accent h-100vh">
    <div text-caption>
      {{ greeting }}
    </div>
    <p></p>
    <div>
      <button class="btn-del" @click="router.back()">Back</button>
    </div>
  </main>
</template>
