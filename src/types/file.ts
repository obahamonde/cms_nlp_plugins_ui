type FileObject = {
	id: string;
	bytes: number;
	created_at: number;
	filename: string;
	object: "file";
	purpose: "fine-tune" | "fine-tune-results" | "assistants" | "assistants_output";
	status: "uploaded" | "processed" | "error";
	status_details: string;
	metadata?: {
		[key: string]: string;
	};
};

export type { FileObject };
