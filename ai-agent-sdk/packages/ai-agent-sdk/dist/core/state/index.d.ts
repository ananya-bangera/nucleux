import type { AgentName } from "../agent";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
type ZeeWorkflowStatus = "idle" | "running" | "paused" | "failed" | "finished";
type ZeeWorkflowStateOptions = {
    agent: AgentName;
    messages: ChatCompletionMessageParam[];
    status?: ZeeWorkflowStatus;
    children?: ZeeWorkflowState[];
};
export type ZeeWorkflowState = Required<ZeeWorkflowStateOptions>;
export declare const StateFn: {
    childState: (options: ZeeWorkflowStateOptions) => ZeeWorkflowState;
    root: (workflowDescription: string) => ZeeWorkflowState;
    passdown: (state: ZeeWorkflowState, agent: AgentName) => ZeeWorkflowState;
    assign: (state: ZeeWorkflowState, context: [AgentName, ChatCompletionMessageParam][]) => ZeeWorkflowState;
    finish: (state: ZeeWorkflowState, agentResponse: ChatCompletionMessageParam) => ZeeWorkflowState;
};
export {};
//# sourceMappingURL=index.d.ts.map