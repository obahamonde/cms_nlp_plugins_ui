<script setup lang="ts">
import { User } from "firebase/auth";

const props = defineProps<{
  user: User;
  assistant_id: string;
}>();  

    const { request, response } = useRequest<any>();
    const { state } = useStore();
    const emit = defineEmits<{
      run:[any]}>();
    const createRun = async () => {
      if (!props.user) return;
      if (!state.threadId) return;
      await request(
        `/api/runs?assistant_id=${props.assistant_id}&thread_id=${state.threadId}`
      );
      emit("run", response.value);
    };

</script>

   <template>
         <Icon class="text-primary x2 hover:text-white" icon="mdi-play"  
          @click="createRun" />
    </template> 
