<script setup lang="ts">
import { User } from "firebase/auth";
import { Assistant } from "~/types";
const props = defineProps<{
	user: User;
}>();
const [setAssistant,getAssistant,delAssistant,assistants] = useFirestore<Assistant>('assistants');
const { request, response, error, loading } = useRequest<Assistant>()
const { uploadFile, fileObj } = useFirebaseStorage()
const { state } = useStore()
watchEffect(()=>{
	assistants.value ? state.assistants = assistants.value : null
})
const query = reactive({
	name:"",
	instructions:"",
	file_ids:[],
})
const queryString = computed(()=>{
	const fileIds = query.file_ids ? `file_ids=${query.file_ids}&` : ""
	return `${fileIds}name=${query.name}&instructions=${query.instructions}`
})
const createAssistant = async () => {
	await request(`/api/assistants?${queryString.value}&thread_id=${state.threadId}`)
	const blob = await fetch(response.value.picture).then(r => r.blob())
	await uploadFile(new File([blob], `${response.value.name}.png`),`assistants/${response.value.id}`)
	while (fileObj.progress !== 100) {
		console.log(fileObj.progress)
	}

	response.value.picture = fileObj.url!
	await setAssistant(response.value,props.user)
	state.assistants.push(response.value)
}

const deleteAssistant = async (ass:Assistant) => {
	await delAssistant(ass.id)
	await request(`/api/assistants/${ass.metadata.id}`,{
		method:"DELETE"
	})
}
onMounted(async() => {
	await getAssistant(props.user)
})

const carouselIndex = ref(0);

const nextImage = () => {
  carouselIndex.value = (carouselIndex.value + 1) % state.assistants.length;
};

const previousImage = () => {
  carouselIndex.value = (carouselIndex.value - 1 + state.assistants.length) % state.assistants.length;
};
</script>

<template>
			<div v-for="assistant in state.assistants" class="flex flex-row">
				<div class="w-1/4 p-2 border border-gray-300 rounded-md">
					{{ assistant.name }}
				</div>
<div v-if="state.assistants.length > 0" class="bottom-0 absolute">
    <div class="carousel-container ">
      <img :src="state.assistants[carouselIndex].picture" class="rf x8" />
      <div>
        {{ state.assistants[carouselIndex].name }}
      </div>
      <button @click="previousImage" class="carousel-control"><Icon icon="mdi-chevron-left" x2/></button>
      <button @click="nextImage" class="carousel-control"><Icon icon="mdi-chevron-right" x2/></button>
			</div>
  </div>
  <div v-else>
    No assistants available
  </div>
				<div class="x4 rf bottom-24 absolute">
					<button
						@click="deleteAssistant(assistant)"
						class="rf bg-transparent border-none"
					>
						<Icon icon="mdi-delete" class="x2 text-warning hover:text-error cp scale" />
					</button>
				</div>
			</div>
	
</template>
<style scoped>
.carousel-container {
  position: relative;
  width: 175px; /* Adjust as needed */
  margin: auto;
}


.carousel-control {
  position: absolute;
  top: 50%;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  transform: translateX(-75%);
}

.carousel-control:first-of-type {
  left: 10px;
}

.carousel-control:last-of-type {
  right: 10px;
}</style>