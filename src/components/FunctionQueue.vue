<script setup lang="ts">
import type { User } from "firebase/auth";
const { state, setState } = useState();
const props = defineProps<{
  user: User;
}>();
const { error, result } = usePubSub(props.user);
watch(result, (val) => {
  if (val) {
    setState(val);
  }
});
</script>
<template>
  <slot :error="error" :state="state" />
</template>
