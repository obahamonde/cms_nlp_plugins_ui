<script setup lang="ts">
import type { FileObject as FileData, Message } from "~/types";
import { User } from "@firebase/auth";
const props = defineProps<{
  user: User;
}>();
const [setFile, getFiles, delFile, files] = useFirestore<FileData>("uploads");
const [setMessage, getMessages, _, messages] = useFirestore<Message>(
  "messages"
);
const {  request } = useRequest<FileData>();
const { uploadFile, deleteFile, __, fileObj } = useFirebaseStorage();
const { state } = useStore();
onMounted(async () => {
  getFiles(props.user);
});
const addFile = async (f: File, user: User) => {
  try {
    const formData = new FormData();
    formData.append("file", f);
    const res = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });
    const data:Partial<FileData> = await res.json();
			// @ts-ignore
      console.log(data);
      // @ts-ignore
			if (data.error) {
				// @ts-ignore
      console.log(data.error);
    } else {
			await uploadFile(f,data.id!);
      data.metadata = {
				url:fileObj.url!,
        id: data.id!,
				
			}
			await setFile(data as FileData, user);
    }
  } catch (e) {
    console.log(e);
  }
};
const removeFile = async (id: FileData) => {
	try {
		await request(`/api/files/${id.metadata.id}`, {
			method: "DELETE",
		});
		await deleteFile(id.metadata!.id);
		await delFile(id.id, props.user);
	} catch (e) {
		console.log(e);
	}
  fileObj.progress = 0;
}

const showModal = ref(false);
async function useVision(image_url:string){
  try {
    const text = unref(modelValue)
    const urlParams = new URLSearchParams({
      image_url,
      text,
    });
       state.messages.unshift({
      role: "user",
      content: text,
      user: {
        name: props.user.displayName!,
        photoURL: props.user.photoURL!,
        id: props.user.uid,
        email: props.user.email!,
      },
      threadId: state.threadId!,
      createdAt: new Date(),
    });
    const res = await fetch(`/api/vision?${urlParams.toString()}`);
    const data = await res.text();
    state.messages.unshift({
      role: "assistant",
      content: data,
      user: {
        name: props.user.displayName!,
        photoURL: props.user.photoURL!,
        id: props.user.uid,
        email: props.user.email!,
        
      },
      threadId: state.threadId!,
      createdAt: new Date(),
    });
    await setMessage(state.messages[1], props.user);
    await setMessage(state.messages[0], props.user);
  } catch (e) {
    console.log(e);
  }
}
const { modelValue } = defineModels<{
  modelValue: string;
}>();

const dropzoneRef = ref<HTMLElement | null>(null);


const onDrop = async(files:File[] | null ,event:DragEvent)=>{
  if (!files) return;
  event.preventDefault();
  const promises = files.map(async (f) => {
    await addFile(f, props.user);
  });
    await Promise.all(promises);
    fileObj.progress = 0;
}
const { isOverDropZone } = useDropZone(dropzoneRef, {
  onDrop
})

const progress = computed(() => {
  return fileObj.progress ? fileObj.progress : null;
});

const inputHook = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "*/*";
  input.multiple = true;
  input.onchange = async (e) => {
    //@ts-ignore
    const files = e!.target.files as File[]
    if (!files) return;
    const promises = Array.from(files).map(async (f) => {
      await addFile(f, props.user);
    });
    await Promise.all(promises);
    fileObj.progress = 0;
  };
  input.click();
};


</script>
<template>
  <section class="sh h-screen overflow-auto bg-gray-200">
     <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
    <div 
    v-if="progress"
      class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" 
      :style="`width: ${progress}%`">
      {{ progress }}%
    </div>
  </div>
    <input
      :multiple="true"
      type="file"
      accept="*/*"
    />
    <div class="dropzone cursor-pointer" :class="isOverDropZone ? 'dropzone-over ' : 'dropozone'">
      <div class="dropzone-inner" ref="dropzoneRef">
        <div class="dropzone-icon">
         <button class="rf py-1" @click="inputHook">
        <Icon class="x2 cp scale" 
        icon="mdi-upload" />
      </button>
   
        </div>
        <div class="dropzone-text">
          <p>Drag and drop your files here</p>
        </div>
      </div>
    </div> 
    <div
      v-for="f in files"
      :key="f.id"
      class="sh col center text-accent p-4 rounded"
    >
    <Icon class="x1 text-red right-2 absolute opacity-25 hover:opacity-100 cp scale" icon="mdi-delete" 
        @click="removeFile(f)"
        />
    <div v-if="f.status_details.includes('image')"
      class="sh rounded"
      
    >
  <img :src="f.metadata!.url" class="w-full" />
  <button class="btn-get" @click="showModal = true">Get</button>
  <Modal v-if="showModal" @close="showModal = false">
      <template #body>
       <textarea v-model="modelValue"></textarea>
        <button class="btn-get" @click="useVision(f.metadata!.url)">Get</button>
      </template>
    </Modal>
  </div>
    <div v-else-if ="f.status_details.includes('video')"
      class="sh rounded"
      :style="`background-image: url(${f.metadata!.url})`"
    ></div>
    <div v-else-if ="f.status_details.includes('audio')"
      class="sh rounded"
      :style="`background-image: url(${f.metadata!.url})`"

    ></div>
    <div v-else-if="f.status_details.includes('pdf') || f.status_details.includes('document') || f.status_details.includes('office')">
    <iframe :src="'https://docs.google.com/gview?url='+f.metadata!.url+'&embedded=true'" class="w-full"></iframe>
    </div>
    <div v-else class="sh rounded">
    <a :href="f.metadata!.url" target="_blank" class="text-accent">{{ new Date(f.created_at*1000).toLocaleDateString() }}</a>
    </div>
    {{new Date(f.created_at*1000).toLocaleDateString() }}
    </div>
    </section>
    
</template>
<style scoped lang="scss">
input {
  display: none;
}
.dropzone {
  border: 2px dashed #4a5568; // Color gris oscuro
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  background-color: #edf2f7; // Color gris claro
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #e2e8f0; // Un gris un poco más oscuro al pasar el mouse
  }

  &-over {
    background-color: #cbd5e0; // Un gris aún más oscuro cuando un archivo está sobre la zona
  }

  .dropzone-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .dropzone-icon {
      // Estilos para el icono
      margin-bottom: 1rem;
    }

    .dropzone-text {
      // Estilos para el texto
      p {
        color: #2d3748; // Color de texto oscuro
      }
    }
  }
}

</style>