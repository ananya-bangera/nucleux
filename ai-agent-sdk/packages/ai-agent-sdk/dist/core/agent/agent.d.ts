import type { AgentConfig, AgentName } from ".";
import { Base } from "../base";
import { type ZeeWorkflowState } from "../state";
import type { Tool } from "../tools/base";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { type AnyZodObject } from "zod";
export declare const router: () => Agent;
export declare const resource_planner: (agents: Record<AgentName, Agent>) => Agent;
export declare class Agent extends Base {
    private config;
    private llm;
    private _tools;
    constructor(config: AgentConfig);
    get description(): string;
    get instructions(): string[] | undefined;
    get tools(): Record<AgentName, Tool>;
    generate<T extends Record<string, AnyZodObject>>(messages: ChatCompletionMessageParam[], response_schema: T): Promise<import("../llm").FunctionToolCall | import("../llm").LLMResponse<T>>;
    run(state?: ZeeWorkflowState): Promise<Required<{
        agent: AgentName;
        messages: ChatCompletionMessageParam[];
        status?: "idle" | "running" | "paused" | "failed" | "finished";
        children?: ZeeWorkflowState[];
    }>>;
}
//# sourceMappingURL=agent.d.ts.map