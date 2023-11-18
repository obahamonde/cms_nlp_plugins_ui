
type Assistant = {
	id: string;
	created_at: number;
	description: string;
	file_ids: string[];
	instructions: string;
	metadata: Object;
	model: string;
	name: string;
	object: "assistant";
	tools: Array<ToolCodeInterpreter | ToolRetrieval | ToolFunction>;
};


type FunctionDefinition = {
	name: string;
	parameters: Object;
	description: string;
};

type ToolRetrieval = {
	type: "retrieval";
};

type ToolFunction = {
	function: FunctionDefinition;
	type: "function";
};

type ToolCodeInterpreter = {
	type: "code_interpreter";
};


export type { Assistant, FunctionDefinition };