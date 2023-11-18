type ThreadMessage = {
	id: string;
	assistant_id: string;
	content: Array<MessageContentImageFile | MessageContentText>;
	created_at: number;
	file_ids: string[];
	metadata: any; // Replace with more specific type if available
	object: "thread.message";
	role: "user" | "assistant";
	run_id: string;
	thread_id: string;
};

type MessageContentImageFile = {
	image_file: ImageFile; // Replace with actual ImageFile type
	type: "image_file";
};

type MessageContentText = {
	text: TText; // Replace with actual Text type
	type: "text";
};

type ImageFile = {
	file_id: string;
};

type TText = {
	annotations: Array<TextAnnotationFileCitation | TextAnnotationFilePath>;
	value: string;
};

type TextAnnotationFileCitation = {
	end_index: number;
	file_citation: TextAnnotationFileCitationFileCitation; // Replace with actual type
	start_index: number;
	text: string;
	type: "file_citation";
};

type TextAnnotationFileCitationFileCitation = {
	file_id: string;
	quote: string;
};

type TextAnnotationFilePath = {
	end_index: number;
	file_path: TextAnnotationFilePathFilePath; // Replace with actual type
	start_index: number;
	text: string;
	type: "file_path";
};

type TextAnnotationFilePathFilePath = {
	file_id: string;
};

type Thread = {
	id: string;
	created_at: number;
	metadata: Record<string, any>
	object: "thread";
};

export type { ThreadMessage, Thread };