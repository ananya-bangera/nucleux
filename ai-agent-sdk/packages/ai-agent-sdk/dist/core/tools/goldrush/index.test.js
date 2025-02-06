"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_1 = require("../../agent");
const base_1 = require("../../base");
const state_1 = require("../../state");
const base_2 = require("../base");
const historical_token_price_1 = require("./historical-token-price");
const nft_balances_1 = require("./nft-balances");
const token_balances_1 = require("./token-balances");
const transactions_1 = require("./transactions");
require("dotenv/config");
const vitest_1 = require("vitest");
let apiKey;
(0, vitest_1.beforeAll)(() => {
    if (!process.env["GOLDRUSH_API_KEY"]) {
        throw new Error("GOLDRUSH_API_KEY environment variable is not set");
    }
    apiKey = process.env["GOLDRUSH_API_KEY"];
});
(0, vitest_1.test)("blockchain research agent with goldrush tools", async () => {
    const tools = {
        tokenBalances: new token_balances_1.TokenBalancesTool(apiKey),
        nftBalances: new nft_balances_1.NFTBalancesTool(apiKey),
        transactions: new transactions_1.TransactionsTool(apiKey),
    };
    const agent = new agent_1.Agent({
        name: "blockchain researcher",
        model: {
            provider: "OPEN_AI",
            name: "gpt-4o-mini",
        },
        description: "You are a blockchain researcher analyzing wallet activities across different chains.",
        instructions: [
            "Analyze wallet activities using the provided blockchain tools",
            "Summarize token holdings, NFT collections, and recent transactions",
            "Provide insights about the wallet's activity patterns",
        ],
        tools,
    });
    const state = state_1.StateFn.root(agent.description);
    state.messages.push((0, base_1.user)("Analyze wallet address karanpargal.eth on eth-mainnet and provide a complete analysis of its activities"));
    try {
        const result = await agent.run(state);
        console.log(result);
        (0, vitest_1.expect)(result.messages.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(result.status).toEqual("paused");
    }
    catch (error) {
        console.error("Test failed:", error);
        throw error;
    }
});
(0, vitest_1.test)("blockchain research agent should analyze token balances", async () => {
    const tools = {
        tokenBalances: new token_balances_1.TokenBalancesTool(apiKey),
    };
    const agent = new agent_1.Agent({
        name: "token analyzer",
        model: {
            provider: "OPEN_AI",
            name: "gpt-4o-mini",
        },
        description: "You are a blockchain researcher analyzing wallet token holdings.",
        instructions: [
            "Analyze wallet token balances using the provided blockchain tools",
            "Provide insights about the wallet's token holdings",
        ],
        tools,
    });
    const state = state_1.StateFn.root(agent.description);
    state.messages.push((0, base_1.user)("Analyze the token balances for address karanpargal.eth on eth-mainnet"));
    const result = await agent.run(state);
    (0, vitest_1.expect)(result.status).toEqual("paused");
    const toolCall = result.messages[result.messages.length - 1];
    (0, vitest_1.expect)(toolCall?.tool_calls).toBeDefined();
    const toolResponses = await (0, base_2.runToolCalls)(tools, toolCall?.tool_calls ?? []);
    const updatedState = {
        ...result,
        status: "running",
        messages: [...result.messages, ...toolResponses],
    };
    const finalResult = await agent.run(updatedState);
    (0, vitest_1.expect)(finalResult.status).toEqual("finished");
    (0, vitest_1.expect)(finalResult.messages[finalResult.messages.length - 1]?.content).toBeDefined();
    console.log("Final analysis:", finalResult.messages[finalResult.messages.length - 1]?.content);
});
(0, vitest_1.test)("blockchain research agent should analyze NFT holdings", async () => {
    const tools = {
        nftBalances: new nft_balances_1.NFTBalancesTool(apiKey),
    };
    const agent = new agent_1.Agent({
        name: "nft analyzer",
        model: {
            provider: "OPEN_AI",
            name: "gpt-4o-mini",
        },
        description: "You are a blockchain researcher analyzing NFT collections.",
        instructions: [
            "Analyze wallet NFT holdings using the provided blockchain tools",
            "Summarize the NFT collections owned by the wallet",
        ],
        tools,
    });
    const state = state_1.StateFn.root(agent.description);
    state.messages.push((0, base_1.user)("What NFTs does address karanpargal.eth own on eth-mainnet?"));
    const result = await agent.run(state);
    (0, vitest_1.expect)(result.messages.length).toBeGreaterThan(1);
    (0, vitest_1.expect)(result.status).toEqual("paused");
});
(0, vitest_1.test)("blockchain research agent should analyze recent transactions", async () => {
    const tools = {
        transactions: new transactions_1.TransactionsTool(apiKey),
    };
    const agent = new agent_1.Agent({
        name: "transaction analyzer",
        model: {
            provider: "OPEN_AI",
            name: "gpt-4o-mini",
        },
        description: "You are a blockchain researcher analyzing transaction patterns.",
        instructions: [
            "Analyze wallet transactions using the provided blockchain tools",
            "Identify patterns in transaction history",
        ],
        tools,
    });
    const state = state_1.StateFn.root(agent.description);
    state.messages.push((0, base_1.user)("Show me the last 24 hours of transactions for address karanpargal.eth on eth-mainnet"));
    const result = await agent.run(state);
    console.log(result);
    (0, vitest_1.expect)(result.messages.length).toBeGreaterThan(1);
    (0, vitest_1.expect)(result.status).toEqual("paused");
});
(0, vitest_1.test)("blockchain research agent should analyze tokens and their transactions", async () => {
    const tools = {
        tokenBalances: new token_balances_1.TokenBalancesTool(apiKey),
        transactions: new transactions_1.TransactionsTool(apiKey),
    };
    const agent = new agent_1.Agent({
        name: "token analyzer",
        model: {
            provider: "OPEN_AI",
            name: "gpt-4o-mini",
        },
        description: "You are a blockchain researcher analyzing token holdings and their transaction patterns.",
        instructions: [
            "First analyze top 5 token balances by value",
            "Then analyze up to 10 recent transactions for tokens with significant holdings in the last 30 days",
            "Provide insights about the wallet's token activity and the transactions.",
            "If the wallet does big transactions, analyze the transactions in detail and mention if he's a whale or not.",
        ],
        tools,
    });
    const state = state_1.StateFn.root(agent.description);
    state.messages.push((0, base_1.user)("Analyze the token balances for address 0x2738523c25209dbdc279a75b6648730844845c7b on arbitrum-mainnet and then show me recent transactions for the tokens with highest value"));
    const result = await agent.run(state);
    console.log(result);
    (0, vitest_1.expect)(result.status).toEqual("paused");
    const toolCall = result.messages[result.messages.length - 1];
    (0, vitest_1.expect)(toolCall?.tool_calls).toBeDefined();
    const toolResponses = await (0, base_2.runToolCalls)(tools, toolCall?.tool_calls ?? []);
    const updatedState = {
        ...result,
        status: "running",
        messages: [...result.messages, ...toolResponses],
    };
    const secondResult = await agent.run(updatedState);
    console.log(secondResult);
    (0, vitest_1.expect)(secondResult.status).toEqual("paused");
    const secondToolCall = secondResult.messages[secondResult.messages.length - 1];
    (0, vitest_1.expect)(secondToolCall?.tool_calls).toBeDefined();
    const transactionResponses = await (0, base_2.runToolCalls)(tools, secondToolCall?.tool_calls ?? []);
    const finalState = {
        ...secondResult,
        messages: [...secondResult.messages, ...transactionResponses],
    };
    const finalResult = await agent.run(finalState);
    console.log(finalResult);
    (0, vitest_1.expect)(finalResult.status).toEqual("finished");
    (0, vitest_1.expect)(finalResult.messages[finalResult.messages.length - 1]?.content).toBeDefined();
    console.log("Final analysis:", finalResult.messages[finalResult.messages.length - 1]?.content);
});
(0, vitest_1.test)("blockchain research agent should analyze historical token prices", async () => {
    const tools = {
        historicalTokenPrice: new historical_token_price_1.HistoricalTokenPriceTool(apiKey),
    };
    const agent = new agent_1.Agent({
        name: "price analyzer",
        model: {
            provider: "OPEN_AI",
            name: "gpt-4o-mini",
        },
        description: "You are a blockchain researcher analyzing historical token price movements.",
        instructions: [
            "Analyze historical token prices using the provided blockchain tools",
            "Identify price trends and significant movements",
            "Provide insights about the token's price performance over the specified timeframe",
        ],
        tools,
    });
    const state = state_1.StateFn.root(agent.description);
    state.messages.push((0, base_1.user)("Show me the price history for USDC (0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) on eth-mainnet over the last 30 days"));
    const result = await agent.run(state);
    (0, vitest_1.expect)(result.messages.length).toBeGreaterThan(1);
    (0, vitest_1.expect)(result.status).toEqual("paused");
    const toolCall = result.messages[result.messages.length - 1];
    (0, vitest_1.expect)(toolCall?.tool_calls).toBeDefined();
    const toolResponses = await (0, base_2.runToolCalls)(tools, toolCall?.tool_calls ?? []);
    const updatedState = {
        ...result,
        status: "running",
        messages: [...result.messages, ...toolResponses],
    };
    const finalResult = await agent.run(updatedState);
    (0, vitest_1.expect)(finalResult.status).toEqual("finished");
    (0, vitest_1.expect)(finalResult.messages[finalResult.messages.length - 1]?.content).toBeDefined();
    console.log("Final analysis:", finalResult.messages[finalResult.messages.length - 1]?.content);
});
(0, vitest_1.test)("analyze wallet balances and suggest token swaps based on historical prices", async () => {
    const tools = {
        tokenBalances: new token_balances_1.TokenBalancesTool(apiKey),
        historicalTokenPrice: new historical_token_price_1.HistoricalTokenPriceTool(apiKey),
    };
    const agent = new agent_1.Agent({
        name: "portfolio optimizer",
        model: {
            provider: "OPEN_AI",
            name: "gpt-4o-mini",
        },
        description: "You are a crypto portfolio analyzer that provides token swap suggestions based on historical performance.",
        instructions: [
            "First fetch token balances for the wallet",
            "Identify top 5 tokens by USD value",
            "For each of these tokens, analyze their 7-day price history",
            "Compare price trends and volatility",
            "Suggest potential token swaps that could improve portfolio value based on historical performance",
            "Provide reasoning for each suggestion",
        ],
        tools,
    });
    const state = state_1.StateFn.root(agent.description);
    state.messages.push((0, base_1.user)("Analyze the token holdings for karanpargal.eth on eth-mainnet and suggest optimal token swaps based on 7-day historical performance"));
    const result = await agent.run(state);
    (0, vitest_1.expect)(result.status).toEqual("paused");
    const toolCall = result.messages[result.messages.length - 1];
    (0, vitest_1.expect)(toolCall?.tool_calls).toBeDefined();
    const toolResponses = await (0, base_2.runToolCalls)(tools, toolCall?.tool_calls ?? []);
    const updatedState = {
        ...result,
        status: "running",
        messages: [...result.messages, ...toolResponses],
    };
    const secondResult = await agent.run(updatedState);
    (0, vitest_1.expect)(secondResult.status).toEqual("paused");
    const secondToolCall = secondResult.messages[secondResult.messages.length - 1];
    (0, vitest_1.expect)(secondToolCall?.tool_calls).toBeDefined();
    const historicalPriceResponses = await (0, base_2.runToolCalls)(tools, secondToolCall?.tool_calls ?? []);
    const finalState = {
        ...secondResult,
        messages: [...secondResult.messages, ...historicalPriceResponses],
    };
    const finalResult = await agent.run(finalState);
    (0, vitest_1.expect)(finalResult.status).toEqual("finished");
    (0, vitest_1.expect)(finalResult.messages[finalResult.messages.length - 1]?.content).toBeDefined();
    console.log("Portfolio Analysis and Recommendations:", finalResult.messages[finalResult.messages.length - 1]?.content);
});
//# sourceMappingURL=index.test.js.map