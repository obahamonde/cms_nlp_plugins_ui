
import { FunctionDefinition } from "./assistant";

type Run = {
	id: string;
	assistant_id: string;
	cancelled_at: number;
	completed_at: number;
	created_at: number;
	expires_at: number;
	failed_at: number;
	file_ids: string[];
	instructions: string;
	last_error: LastError;
	metadata: any; // Replace with a more specific type if available
	model: string;
	object: "thread.run";
	required_action: RequiredAction;
	started_at: number;
	status: "queued" | "in_progress" | "requires_action" | "cancelling" | "cancelled" | "failed" | "completed" | "expired";
	thread_id: string;
	tools: Array<ToolAssistantToolsCode | ToolAssistantToolsRetrieval | ToolAssistantToolsFunction>;
};

type LastError = {
	code: "server_error" | "rate_limit_exceeded";
	message: string;
};


type RequiredAction = {
	submit_tool_outputs: RequiredActionSubmitToolOutputs;
	type: "submit_tool_outputs";
};

type RequiredActionFunctionToolCall = {
	id: string;
	function: Function; // Replace with actual Function type
	type: "function";
};

type Function = {
	arguments: string;
	name: string;
};

type RequiredActionSubmitToolOutputs = {
	tool_calls: RequiredActionFunctionToolCall[];
};

type ToolAssistantToolsCode = {
	type: "code_interpreter";
};
type ToolAssistantToolsRetrieval = {
	type: "retrieval";
};

type ToolAssistantToolsFunction = {
	function: FunctionDefinition; // Replace with actual FunctionDefinition type
	type: "function";
};

export type { Run };