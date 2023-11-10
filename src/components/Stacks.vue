<script setup lang="ts" generic="T extends DocumentRef">
import { DocumentRef } from "../types";
const props = defineProps({
	collection: {
		type: String,
		default: "",
	},
});
const [ getItems, addItem, delItem, items ] = useFirestore<T>(props.collection);
</script>
<template>

</template>