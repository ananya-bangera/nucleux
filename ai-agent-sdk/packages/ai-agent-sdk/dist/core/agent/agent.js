"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = exports.resource_planner = exports.router = void 0;
const base_1 = require("../base");
const llm_1 = require("../llm");
const state_1 = require("../state");
const zod_1 = __importDefault(require("zod"));
const getSteps = (conversation) => {
    const messagePairs = conversation.reduce((pairs, message, index) => {
        if (index % 2 === 0) {
            pairs.push([message]);
        }
        else {
            pairs[pairs.length - 1]?.push(message);
        }
        return pairs;
    }, []);
    return messagePairs.map(([task, result]) => (0, base_1.user)(`
          <step>
            <name>${task?.content}</name>
            <result>${result?.content}</result>
          </step>
        `));
};
const defaultFn = async (agent, state) => {
    const messages = [
        (0, base_1.system)(`
            ${agent.description}

            Your job is to complete the assigned task:
              - You can break down complex tasks into multiple steps if needed.
              - You can use available tools if needed.
        `),
        (0, base_1.assistant)("What have been done so far?"),
        (0, base_1.user)(`Here is all the work done so far by other agents:`),
        ...getSteps(state.messages),
        (0, base_1.assistant)("Is there anything else I need to know?"),
        (0, base_1.user)("No, I do not have additional information"),
        (0, base_1.assistant)("What is the request?"),
        ...state.messages,
    ];
    const schema = {
        step: zod_1.default.object({
            name: zod_1.default
                .string()
                .describe("Name of the current step or action being performed"),
            result: zod_1.default
                .string()
                .describe("The output of this step. Include all relevant details and information."),
            reasoning: zod_1.default
                .string()
                .describe("The reasoning for performing this step."),
            next_step: zod_1.default.string().describe(`
              The next step ONLY if required by the original request.
              Return empty string if you have fully answered the current request, even if
              you can think of additional tasks.
            `),
            has_next_step: zod_1.default
                .boolean()
                .describe("True if you provided next_step. False otherwise."),
        }),
    };
    const response = await agent.generate(messages, schema);
    if (response.type === "tool_call") {
        return {
            ...state,
            status: "paused",
            messages: [
                ...state.messages,
                {
                    role: "assistant",
                    content: "",
                    tool_calls: response.value,
                },
            ],
        };
    }
    const stepResponse = response.value;
    const agentResponse = (0, base_1.assistant)(stepResponse.result);
    if (stepResponse.has_next_step) {
        return {
            ...state,
            status: "running",
            messages: [
                ...state.messages,
                agentResponse,
                (0, base_1.user)(stepResponse.next_step),
            ],
        };
    }
    const nextState = state_1.StateFn.finish(state, agentResponse);
    return nextState;
};
const router = () => new Agent({
    name: process.env["ROUTER_NAME"],
    basicAuth: process.env["ROUTER_AUTH"],
    description: "You are a router that oversees the workflow.",
    model: {
        provider: "NUCLEUX",
        name: "eliza",
    },
    runFn: async (agent, state) => {
        const [workflowRequest, ..._messages] = state.messages;
        console.log(workflowRequest)
        const messages = [
            (0, base_1.system)(`
                You are a planner that breaks down complex workflows into smaller, actionable steps.
                Your job is to determine the next task that needs to be done based on the ${workflowRequest.content} and what has been completed so far.

                Rules:
                1. Each task should be self-contained and achievable
                2. Tasks should be specific and actionable
                3. Return null when the workflow is complete
                4. Consider dependencies and order of operations
                5. Use context from completed tasks to inform next steps
              `),
            (0, base_1.assistant)("What is the request?"),
            workflowRequest,
            ...(_messages.length > 0
                ? [
                    (0, base_1.assistant)("What has been completed so far?"),
                    ...getSteps(_messages),
                ]
                : []),
        ];
        const schema = {
            next_task: zod_1.default.object({
                task: zod_1.default
                    .string()
                    .describe("The next task to be completed, or empty string if workflow is complete"),
                reasoning: zod_1.default
                    .string()
                    .describe("The reasoning for selecting the next task or why the workflow is complete"),
            }),
        };
        const result = await agent.generate(messages, schema);
        console.log("Router result", result);
        try {
            if (result.type !== "next_task") {
                throw new Error("Expected next_task response, got " + result.type);
            }
            if (result.value["task"]) {
                const nextState = state_1.StateFn.assign(state, [
                    ["resource_planner", (0, base_1.user)(result.value["task"])],
                ]);
                return nextState;
            }
            return {
                ...state,
                status: "finished",
            };
        }
        catch (error) {
            throw new Error(`Failed to determine next task because "${error}`);
        }
    },
});
exports.router = router;
const resource_planner = (agents) => new Agent({
    name: process.env["RESOURCE_PLANNER_NAME"],
    basicAuth: process.env["RESOURCE_PLANNER_AUTH"],
    description: "You are a resource planner.",
    model: {
        provider: "NUCLEUX",
        name: "eliza",
    },
    runFn: async (agent, state) => {
        const agents_description = Object.entries(agents)
            .map(([name, agent]) => `<agent name="${name}">${agent.description}</agent>`)
            .join("");
        const messages = [
            (0, base_1.system)(`
            You are an agent selector that matches tasks to the most capable agent.
            Analyze the task requirements and each agent's capabilities to select the best match.

            Consider:
            1. Required tools and skills
            2. Agent's specialization
            3. Model capabilities
            4. Previous task context if available
              `),
            (0, base_1.user)(`Here are the available agents:
            <agents>
                ${agents_description}
            </agents>
    `),
            (0, base_1.assistant)("What is the task?"),
            ...state.messages,
        ];
        const schema = {
            select_agent: zod_1.default.object({
                agent: zod_1.default.enum(Object.keys(agents)),
                reasoning: zod_1.default.string(),
            }),
        };
        const result = await agent.generate(messages, schema);
        if (result.type !== "select_agent") {
            throw new Error("Expected select_agent response, got " + result.type);
        }
        return state_1.StateFn.passdown(state, result.value.agent);
    },
});
exports.resource_planner = resource_planner;
class Agent extends base_1.Base {
    config;
    llm;
    _tools;
    constructor(config) {
        super("agent");
        this.config = config;
        this.llm = new llm_1.LLM(config.model);
        this._tools = config.tools || {};
    }
    get description() {
        return this.config.description;
    }
    get instructions() {
        return this.config.instructions;
    }
    get tools() {
        return this._tools;
    }
    async generate(messages, response_schema) {
        return this.llm.generate(messages, response_schema, this.tools, this.config.name, this.config.basicAuth);
    }
    async run(state = state_1.StateFn.root(this.description)) {
        return this.config.runFn
            ? this.config.runFn(this, state)
            : defaultFn(this, state);
    }
}
exports.Agent = Agent;
//# sourceMappingURL=index.js.map