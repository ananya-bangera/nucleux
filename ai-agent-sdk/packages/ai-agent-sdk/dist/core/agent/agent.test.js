"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const base_1 = require("../base");
const state_1 = require("../state");
const tools_1 = require("../tools");
const node_fetch_1 = __importDefault(require("node-fetch"));
const vitest_1 = require("vitest");
const zod_1 = require("zod");
(0, vitest_1.describe)("agent", () => {
    const providers = [
        {
            provider: "OPEN_AI",
            name: "gpt-4o-mini",
        },
        {
            provider: "GEMINI",
            name: "gemini-1.5-flash",
        },
    ];
    providers.forEach((config) => {
        (0, vitest_1.describe)(config.provider, () => {
            (0, vitest_1.test)("default agent flow", async () => {
                const agent = new _1.Agent({
                    name: "research agent",
                    model: config,
                    description: "You are a senior NYT researcher writing an article on a topic.",
                    instructions: [
                        "For a given topic, search for the top 5 links.",
                        "Then read each URL and extract the article text, if a URL isn't available, ignore it.",
                        "Analyse and prepare an NYT worthy article based on the information.",
                    ],
                });
                const schema = {
                    article: zod_1.z.object({
                        title: zod_1.z.string(),
                        text: zod_1.z.string(),
                    }),
                };
                const result = await agent.generate([(0, base_1.user)("The future of AI")], schema);
                console.log(result);
                if (result.type !== "article") {
                    throw new Error(`Expected article response, got ${result.type}`);
                }
                (0, vitest_1.expect)(result.value["title"]).toBeDefined();
                (0, vitest_1.expect)(result.value["text"]).toBeDefined();
            });
            (0, vitest_1.test)("agent with custom tool", async () => {
                const tools = {
                    weather: (0, tools_1.createTool)({
                        id: "weather-tool",
                        description: "Fetch the current weather in Vancouver, BC",
                        schema: zod_1.z.object({
                            temperature: zod_1.z.number(),
                        }),
                        execute: async (_args) => {
                            const lat = 49.2827, lon = -123.1207;
                            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
                            const r = await (0, node_fetch_1.default)(url);
                            const data = await r.json();
                            return `Current temperature in Vancouver, BC is ${data.current_weather.temperature}°C`;
                        },
                    }),
                };
                const agent = new _1.Agent({
                    name: "research agent",
                    model: config,
                    description: "You are a senior NYT researcher writing an article on the current weather in Vancouver, BC.",
                    instructions: [
                        "Use the weather tool to get the current weather in Celsius.",
                        "Elaborate on the weather.",
                    ],
                    tools,
                });
                const state = state_1.StateFn.root(agent.description);
                state.messages.push((0, base_1.user)("What is the weather in Vancouver, BC?"));
                const result = await agent.run(state);
                (0, vitest_1.expect)(result.status).toEqual("paused");
                (0, vitest_1.expect)(result.messages.length).toBeGreaterThan(0);
                const toolCall = result.messages[result.messages.length - 1];
                (0, vitest_1.expect)(toolCall?.tool_calls?.length).toBeGreaterThanOrEqual(1);
                const toolResponses = await (0, tools_1.runToolCalls)(tools, toolCall?.tool_calls ?? []);
                const updatedState = {
                    ...result,
                    status: "running",
                    messages: [...result.messages, ...toolResponses],
                };
                const finalResult = await agent.run(updatedState);
                console.log(finalResult);
                (0, vitest_1.expect)(finalResult.messages.length).toBeGreaterThan(1);
                (0, vitest_1.expect)(finalResult.status).toEqual("finished");
            });
        });
    });
});
//# sourceMappingURL=agent.test.js.map