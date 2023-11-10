<script setup lang="ts">
import { FileData } from '~/types';
import { User } from '@firebase/auth';
const props = defineProps<{
	user: User;
}>();
const [ getFiles, addFile, delFile, files] = useFirestore<FileData>('files');
const { response, loading, error, request } = useRequest<FileData[]>();			
onMounted(async () => {
		await request("/api/files");
});
</script>
<template>
	<section>
		<h1>Files</h1>
		<div v-for="file in files" :key="file.id" class="sh col center text-accent p-4 rounded">
			<Icon icon="mdi-delete" class="x2 text-primary cp" @click="delFile(file.id!)" />
			<p>{{ file.id }}</p>
			<p>{{ file.created_at }}</p>
		</div>
		<div class="col center">
			<button class="btn-get rf" @click="addFile(props.user)"><Icon class="x2" icon="mdi-plus" /> </button>
		</div>
	</section>

</template>