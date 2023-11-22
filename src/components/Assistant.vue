<script setup lang="ts">
import { User } from "firebase/auth";
import { DocumentReference } from "firebase/firestore";
import { Assistant } from "~/types";
const props = defineProps<{
	user: User;
}>();
const [setAssistant,getAssistant,delAssistant,assistants] = useFirestore<Assistant>('assistants');
const { request, response } = useRequest<Assistant>()

const { state } = useStore()

const query = reactive({
	name:"",
	instructions:""
})
const queryString = computed(()=>{
	return `name=${query.name}&instructions=${query.instructions}`
})
const createAssistant = async () => {
	await request(`/api/assistants?${queryString.value}&thread_id=${state.threadId}`)
  response.value.metadata.id = response.value.id
	await setAssistant(response.value,props.user)
}

const deleteAssistant = async (ass:Assistant) => {
	await delAssistant(ass.id,props.user)
	await request(`/api/assistants/${ass.metadata.id}`,{
		method:"DELETE"
	})
}
onMounted(async() => {
	getAssistant(props.user)
})

const carouselIndex = ref(0);

const nextImage = () => {
  carouselIndex.value++
}
const previousImage = ()=>{
  carouselIndex.value--
}

const showModal = ref(false)

const currentAssistant = computed(()=>
  assistants.value[carouselIndex.value]
)

watchEffect(
  ()=>state.assistant = currentAssistant.value 
)

</script>

<template>
 
			<div v-if="assistants.length" class="row">
<div v-if="assistants.length > 0" class="bottom-20 absolute col center">
  <Icon class="x1 text-warning hover:text-error cp scale" icon="mdi-delete"
    @click="deleteAssistant(assistants[carouselIndex] as Assistant)"
  />
    <div class="carousel-container col center">
      <img :src="assistants[carouselIndex].picture" class="rf x8" />
      <div class="col center w-full text-center font-script">
        {{ assistants[carouselIndex].name }}
      </div>
      <button :disabled="carouselIndex<=0" @click="previousImage" class="carousel-control"><Icon
       icon="mdi-chevron-left" x2/></button>
      <button  :disabled="carouselIndex>assistants.length-2" @click="nextImage" class="carousel-control"><Icon icon="mdi-chevron-right" x2/></button>
			</div>
  </div>
			</div>


	<div v-if="showModal" class="bottom-18 absolute col center h-72 animate-slide-in-up w-49 rounded-lg bg-gray-400">
	<input v-model="query.name" placeholder="Name" class="w-36 m-4 h-8 rounded-lg bg-gray-200  p-1 text-center"/>
	<textarea v-model="query.instructions" placeholder="Instructions" class="w-36 rounded-lg bg-gray-200 m-4 p-1 text-center" rows="8"/>
		<Icon icon="mdi-plus" class="x2 text-primary rf bg-gray-100 hover:text-success cp scale hover:bg-primary" @click="createAssistant()" />
</div>		
	<button class="button bottom-8 absolute" @click="showModal=!showModal">
  <span>Create an Assistant</span>
</button>
</template>
<style scoped lang="scss">
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
}
@font-face {
  font-family: 'Geist';
  font-weight: 400;
  font-style: normal;
  src: url('https://assets.codepen.io/165585/Geist-Medium.woff2') format('woff2');
  font-display: swap;
  font-feature-settings: 'cv11' on;
}

.button {
	&:hover{
		@apply brightness-125;
	}
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  outline: none;
  border: none;
  cursor: pointer;
  background-image: linear-gradient(to bottom right, #6BBFFB, #8591FF, #D293F2);
  font: 16px/24px 'Geist';
  color: white;
  text-shadow: 0px 0.5px 0.75px rgba(9, 24, 85, .25);
  padding: 0;
  margin: 0;
  border-radius: 10px;
  box-shadow: 0px 0px 0.5px 0.5px rgba(0, 0, 0, 0.3) inset, 0px 4px 12px -3px rgba(147, 146, 253, 0.95), 0px 8px 20px 0 rgba(147, 146, 253, 0.2);
  --alternative-gradient-opacity: 0;

  &:before,
  &:after {
    content: '';
    position: absolute;
    pointer-events: none;
  }

  &:before {
    inset: 1px;
    box-shadow: 0 0 0 0.5px rgba(255, 255, 255, .7) inset;
    mix-blend-mode: overlay;
    filter: blur(0.25px);
    border-radius: 9px;
    z-index: 1;
  }

  &:after {
    border-radius: inherit;
    inset: 0;
    opacity: var(--alternative-gradient-opacity);
    background-image: linear-gradient(96deg, #F2CBFE, #57C3F9);
    box-shadow: 0px 0px 0.5px 0.5px rgba(0, 0, 0, 0.3) inset;
  }

  span {
    display: block;
    padding: 10px 24px;
    position: relative;
    z-index: 1;
    --button-glow-1-scale: .8;
    --button-glow-1-opacity: 0;
    --button-glow-1-blur: 0px;
    --button-glow-2-scale: .8;
    --button-glow-2-opacity: 0;
    --button-glow-2-blur: 0px;

    &:before,
    &:after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 10px;
      z-index: -1;
    }

    &:before {
      box-shadow: 0 0 0 3px #bc96ee;
      transform: scale(var(--button-glow-1-scale)) translateZ(0);
      opacity: var(--button-glow-1-opacity);
      filter: blur(var(--button-glow-1-blur));
    }

    &:after {
      box-shadow: 0 0 0 3px #80b9f5;
      transform: scale(var(--button-glow-2-scale)) translateZ(0);
      opacity: var(--button-glow-2-opacity);
      filter: blur(var(--button-glow-2-blur));
    }
  }

  div {
    position: absolute;
    inset: 0;
    border-radius: 10px;
    pointer-events: none;
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("https://assets.codepen.io/165585/noise_1.png");
      background-size: cover;
      z-index: 2;
      opacity: .15;
      mix-blend-mode: overlay;
      pointer-events: none;
    }

   
}
}



</style>