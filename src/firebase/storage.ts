import {
	getDownloadURL,
	getStorage,
	uploadBytesResumable,
	deleteObject,
	ref,
} from "firebase/storage";

export const useFirebaseStorage = () => {
	const storage = getStorage();

	const fileObj = reactive({
		url: null as string | null,
		reference: null as string | null,
		progress: 0,
		status: "no file provided"
	});

	const uploadFile = async (file: File, key: string) => {
		const storageRef = ref(storage, key);
		fileObj.reference = storageRef.toString();
		const uploadTask = await uploadBytesResumable(storageRef, file);
		const progress = computed(() => {
			return Math.round((uploadTask.bytesTransferred / uploadTask.totalBytes) * 100);
		});
		const status = computed(() => {
			return uploadTask.state
		});
		fileObj.status = status.value;
		fileObj.progress = progress.value;
		fileObj.url = await getDownloadURL(uploadTask.ref);
	}

	const deleteFile = async (key: string) => {
		const storageRef = ref(storage, key);
		await deleteObject(storageRef);
	}

	const downloadFile = async (key: string) => {
		const storageRef = ref(storage, key);
		const url = await getDownloadURL(storageRef);
		fileObj.url = url;
	}
	return {
		uploadFile,
		deleteFile,
		downloadFile,
		fileObj,
	};
};
