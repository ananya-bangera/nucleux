import { type Agent, type AgentName } from "../agent";
import { Base } from "../base";
import { type ZeeWorkflowState } from "../state";
import type { ZeeWorkflowOptions } from "./zee.types";
export declare class ZeeWorkflow extends Base {
    private _agents;
    private config;
    constructor(options: ZeeWorkflowOptions);
    get description(): string;
    get output(): string;
    get maxIterations(): number;
    agent(agentName: string): Agent;
    static printState: (state: ZeeWorkflowState, depth?: number) => void;
    static iterate(zeeWorkflow: ZeeWorkflow, state: ZeeWorkflowState): Promise<Required<{
        agent: AgentName;
        messages: import("openai/resources/chat/completions").ChatCompletionMessageParam[];
        status?: "idle" | "running" | "paused" | "failed" | "finished";
        children?: ZeeWorkflowState[];
    }>>;
    static run(zeeWorkflow: ZeeWorkflow, state?: ZeeWorkflowState): Promise<ZeeWorkflowState>;
}
//# sourceMappingURL=zee.d.ts.map