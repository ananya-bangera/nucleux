"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const agent_1 = require("../agent");
const base_1 = require("../base");
const state_1 = require("../state");
const tools_1 = require("../tools");
const goldrush_1 = require("../tools/goldrush");
const node_fetch_1 = __importDefault(require("node-fetch"));
const vitest_1 = require("vitest");
const zod_1 = require("zod");
(0, vitest_1.describe)("@ai-agent-sdk/zee", () => {
    (0, vitest_1.test)("workflow with two agents", async () => {
        const script_writer = new agent_1.Agent({
            name: "script writer",
            description: "You are an expert screenplay writer. Given a movie idea and genre, develop a compelling script outline with character descriptions and key plot points.",
            instructions: [
                "Write a script outline with 3-5 main characters and key plot points.",
                "Outline the three-act structure and suggest 2-3 twists.",
                "Ensure the script aligns with the specified genre and target audience.",
            ],
            model: {
                provider: "OPEN_AI",
                name: "gpt-4o-mini",
            },
        });
        const producer = new agent_1.Agent({
            name: "movie producer",
            description: "Experienced movie producer overseeing script and casting.",
            instructions: [
                "Ask script writer for a script outline based on the movie idea.",
                "Summarize the script outline.",
                "Provide a concise movie concept overview.",
            ],
            model: {
                provider: "OPEN_AI",
                name: "gpt-4o-mini",
            },
        });
        const zee = new _1.ZeeWorkflow({
            description: "Plan a script for a movie that is 10 minutes long and has a happy ending.",
            output: "A scene by scene outline of the movie script.",
            agents: {
                script_writer,
                producer,
            },
        });
        const result = await _1.ZeeWorkflow.run(zee);
        console.log(result);
    });
    (0, vitest_1.test)("workflow with custom tools", async () => {
        const weather = (0, tools_1.createTool)({
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
        });
        const agent = new agent_1.Agent({
            name: "research agent",
            model: {
                provider: "OPEN_AI",
                name: "gpt-4o-mini",
            },
            description: "You are a senior NYT researcher writing an article on the current weather in Vancouver, BC.",
            instructions: ["Use the weather tool to get the current weather"],
            tools: {
                weather,
            },
        });
        const zee = new _1.ZeeWorkflow({
            description: "Plan a script for a movie that is 10 minutes long and has a climax dealing with the weather.",
            output: "A scene by scene outline of the movie script.",
            agents: {
                agent,
            },
        });
        const result = await _1.ZeeWorkflow.run(zee);
        console.log(result);
    });
    (0, vitest_1.test)("workflow with goldrush tools", async () => {
        const tools = {
            tokenBalances: new goldrush_1.TokenBalancesTool(process.env["GOLDRUSH_API_KEY"]),
            transactions: new goldrush_1.TransactionsTool(process.env["GOLDRUSH_API_KEY"]),
        };
        const portfolio_analyst = new agent_1.Agent({
            name: "portfolio analyst",
            model: {
                provider: "OPEN_AI",
                name: "gpt-4o-mini",
            },
            description: "You are a blockchain portfolio analyst that analyzes wallet holdings and provides insights.",
            instructions: [
                "Provide a comprehensive overview of the wallet's portfolio",
            ],
            tools: {
                tokenBalances: tools.tokenBalances,
            },
        });
        const transaction_analyst = new agent_1.Agent({
            name: "transaction analyst",
            model: {
                provider: "OPEN_AI",
                name: "gpt-4o-mini",
            },
            description: "You are a blockchain transaction analyst that analyzes trading patterns and token price movements.",
            instructions: [
                "Provide a comprehensive overview of the transaction",
            ],
            tools: {
                transactions: tools.transactions,
            },
        });
        const zee = new _1.ZeeWorkflow({
            description: "Analyze a wallet's blockchain activity",
            output: "A comprehensive report on the wallet's holdings and trading patterns.",
            agents: {
                portfolio_analyst,
                transaction_analyst,
            },
        });
        const initialState = state_1.StateFn.root(zee.description);
        initialState.messages.push((0, base_1.user)("Analyze the wallet address 'karanpargal.eth' on 'eth-mainnet' for the last 24 hours. Provide a complete analysis of their portfolio and trading activity."));
        const result = await _1.ZeeWorkflow.run(zee, initialState);
        console.log(result);
        (0, vitest_1.expect)(result.messages.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(result.status).toEqual("finished");
        const finalMessage = result.messages[result.messages.length - 1];
        (0, vitest_1.expect)(finalMessage?.content).toBeDefined();
        console.log("Final Analysis:", finalMessage?.content);
    });
    (0, vitest_1.test)("workflow with dynamic maxIterations", async () => {
        const script_writer = new agent_1.Agent({
            name: "script writer",
            description: "You are an expert screenplay writer. Given a movie idea and genre, develop a compelling script outline with character descriptions and key plot points.",
            instructions: [
                "Write a script outline with 3-5 main characters and key plot points.",
                "Outline the three-act structure and suggest 2-3 twists.",
                "Ensure the script aligns with the specified genre and target audience.",
            ],
            model: {
                provider: "OPEN_AI",
                name: "gpt-4o-mini",
            },
        });
        const producer = new agent_1.Agent({
            name: "movie producer",
            description: "Experienced movie producer overseeing script and casting.",
            instructions: [
                "Ask script writer for a script outline based on the movie idea.",
                "Summarize the script outline.",
                "Provide a concise movie concept overview.",
            ],
            model: {
                provider: "OPEN_AI",
                name: "gpt-4o-mini",
            },
        });
        const zeeWorkflowParams = {
            description: "Plan a script for a movie that is 10 minutes long and has a happy ending.",
            output: "A scene by scene outline of the movie script.",
            agents: {
                script_writer,
                producer,
            },
        };
        const zeeWithMaxIterationsFive = new _1.ZeeWorkflow({
            ...zeeWorkflowParams,
            maxIterations: 5,
        });
        (0, vitest_1.expect)(zeeWithMaxIterationsFive.maxIterations).toEqual(5);
        const zeeWithMaxIterationsNotSet = new _1.ZeeWorkflow({
            ...zeeWorkflowParams,
        });
        (0, vitest_1.expect)(zeeWithMaxIterationsNotSet.maxIterations).toEqual(50);
        const zeeWithMaxIterationsZero = new _1.ZeeWorkflow({
            ...zeeWorkflowParams,
            maxIterations: 0,
        });
        (0, vitest_1.expect)(zeeWithMaxIterationsZero.maxIterations).toEqual(50);
        const zeeWithMaxIterationsMinus = new _1.ZeeWorkflow({
            ...zeeWorkflowParams,
            maxIterations: -10,
        });
        (0, vitest_1.expect)(zeeWithMaxIterationsMinus.maxIterations).toEqual(50);
        const zeeWithMaxIterationsAThousand = new _1.ZeeWorkflow({
            ...zeeWorkflowParams,
            maxIterations: 1000,
        });
        (0, vitest_1.expect)(zeeWithMaxIterationsAThousand.maxIterations).toEqual(1000);
    });
});
//# sourceMappingURL=zee.test.js.map