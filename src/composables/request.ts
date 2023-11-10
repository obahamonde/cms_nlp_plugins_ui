import { UnwrapRef } from "vue";

export const useRequest = <T>() => {
  const response = ref<T>(undefined as unknown as T);
  const error = ref<any>(null);
  const loading = ref<boolean>(false);
  const lastResponseTime = ref<Date>();
  const request = async (
    url: string,
    options?: RequestInit,
    refetch?: boolean,
  ) => {
    const { data, error, isFetching } = await useFetch(url, options||{}, {
      refetch: refetch,
    }).json();
    response.value = unref(data) as UnwrapRef<T>;
    error.value = unref(error) as any;
    loading.value = unref(isFetching.value) as boolean;
    lastResponseTime.value = new Date();
  };
  return {
    response,
    error,
    loading,
    request,
    lastResponseTime,
  };
};
