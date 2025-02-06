"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeeWorkflow = void 0;
const agent_1 = require("../agent");
const base_1 = require("../base");
const state_1 = require("../state");
const runTools = async (zeeWorkflow, context, state) => {
    const toolCall = state.messages.at(-1);
    if (toolCall && !("tool_calls" in toolCall)) {
        throw new Error("No tool calls found");
    }
    const agent = zeeWorkflow.agent(state.agent);
    const tools = agent.tools;
    const results = await Promise.all(toolCall?.tool_calls?.map(async (tc) => {
        if (tc.type !== "function") {
            throw new Error("Tool call needs to be a function");
        }
        const fn = tools[tc.function.name];
        if (!fn) {
            throw new Error(`Tool ${tc.function.name} not found`);
        }
        const args = JSON.parse(tc.function.arguments);
        const fnResult = await fn.execute(args);
        return {
            role: "tool",
            tool_call_id: tc.id,
            content: fnResult,
        };
    }) ?? []);
    return results;
};
const execute = async (zeeWorkflow, context, state) => {
    if (state.messages.length > zeeWorkflow.maxIterations) {
        return state_1.StateFn.childState({
            ...state,
            agent: "finalBoss",
        });
    }
    if (state.children.length > 0) {
        console.log("zee start 0000000000000000000")
        const children = await Promise.all(state.children.map((child) => execute(zeeWorkflow, context.concat(state.messages), child)));
        if (children.every((child) => child.status === "finished")) {
            return {
                ...state,
                messages: [
                    ...state.messages,
                    ...children.flatMap((child) => child.messages),
                ],
                children: [],
            };
        }
        return {
            ...state,
            children,
        };
    }
    if (state.status === "paused") {
        const toolsResponse = await runTools(zeeWorkflow, context, state);
        return {
            ...state,
            status: "running",
            messages: [...state.messages, ...toolsResponse],
        };
    }
    const agent = zeeWorkflow.agent(state.agent);
    if (state.status === "running" || state.status === "idle") {
        try {
            return agent.run(state);
        }
        catch (error) {
            return state_1.StateFn.finish(state, (0, base_1.assistant)(error instanceof Error ? error.message : "Unknown error"));
        }
    }
    return state;
};
class ZeeWorkflow extends base_1.Base {
    _agents;
    config;
    constructor(options) {
        super("zee");
        console.log("^^^^^^^^^^^^^^^^^^^^^^");
        console.log(options.agents);
        this._agents = {
            router: (0, agent_1.router)(),
            resource_planner: (0, agent_1.resource_planner)(options.agents),
            ...options.agents,
        };
        this.config = options;
    }
    get description() {
        return this.config.description;
    }
    get output() {
        return this.config.output;
    }
    get maxIterations() {
        return 50;
    }
    agent(agentName) {

        const maybeAgent = this._agents[agentName];
        // console.log("&&&&&&&&&&&&&&&&&&&&&&")
        console.log(agentName)
        if (maybeAgent) {
            return maybeAgent;
        }
        throw new Error(`Agent ${agentName} not found`);
    }
    static printState = (state, depth = 0) => {
        const indent = "  ".repeat(depth);
        const arrow = depth > 0 ? "⊢ " : "";
        const statusText = state.children.length > 0
            ? ""
            : (() => {
                if (state.agent === "router-pfhrob" &&
                    (state.status === "idle" ||
                        state.status === "running")) {
                    return "Looking for next task...";
                }
                if (state.agent === "resource_planner") {
                    return "Looking for best agent...";
                }
                switch (state.status) {
                    case "idle":
                    case "running": {
                        const lastMessage = state.messages.at(-1);
                        return `Working on: ${lastMessage?.content}`;
                    }
                    case "paused":
                        return "Paused";
                    case "failed":
                        return "Failed";
                    case "finished":
                        return "Finished";
                }
            })();
        console.log(`${indent}${arrow}${state.agent} ${depth == 0 ? "(" + state.messages.length + ")" : ""} ${statusText}`);
        state.children.forEach((child) => ZeeWorkflow.printState(child, depth + 1));
    };
    static async iterate(zeeWorkflow, state) {
        const nextState = await execute(zeeWorkflow, [], state);
        ZeeWorkflow.printState(nextState);
        return nextState;
    }
    static async run(zeeWorkflow, state = state_1.StateFn.root(zeeWorkflow.description)) {
        if (state.status === "finished") {
            return state;
        }
        return ZeeWorkflow.run(zeeWorkflow, await ZeeWorkflow.iterate(zeeWorkflow, state));
    }
}
exports.ZeeWorkflow = ZeeWorkflow;
//# sourceMappingURL=zee.js.map