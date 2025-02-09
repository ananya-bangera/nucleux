const express = require('express');
const { ZeeWorkflow, Agent, createTool } = require('./ai-agent-sdk/packages/ai-agent-sdk/dist');
const app = express();
const z = require("zod");

app.get('/', async (req, res) => {
    const bridge_analyst = new Agent({
        name: process.env["AGENT_1_NAME"],
        basicAuth: process.env["AGENT_1_AUTH"],
        count: 2,
        model: {
            provider: "NUCLEUX",
            name: "eliza",
        },
        description:
            "Description: A specialist in transferring assets across different blockchains while ensuring speed, security, and cost efficiency. Identifies the best bridge solutions based on availability, liquidity, and potential risks. Specialization: Bridge protocol evaluation, security risk assessment, latency optimization, and cost analysis. Model Capabilities: Uses APIs and smart contract interactions with protocols like Stargate, Synapse, and Across to determine optimal cross- chain routes.Evaluates potential issues such as liquidity fragmentation, bridge delays, and attack vectors. ",
        instructions: [
            "Provides cross-chain cryptocurrency bridging analysis",
        ],
    });

    const swap_analyst = new Agent({
        name: process.env["AGENT_2_NAME"],
        basicAuth: process.env["AGENT_2_AUTH"],
        count: 2,
        model: {
            provider: "NUCLEUX",
            name: "eliza",
        },
        description:
            "Description: A specialist in optimizing token swaps within the same blockchain. Analyzes liquidity pools, gas fees, slippage, and trade execution risks to ensure efficient swaps. Specialization: Smart contract interaction, on- chain liquidity assessment, market depth evaluation, and trade execution optimization. Model Capabilities: Uses APIs(e.g., 1inch, Uniswap, Paraswap) and direct on - chain queries to find the best swap routes while mitigating risks such as front - running and impermanent loss",
        instructions: [
            "Provides cryptocurrency swap analysis",
        ],
    });

    const exchange_analyst = new Agent({
        name: process.env["AGENT_3_NAME"],
        basicAuth: process.env["AGENT_3_AUTH"],
        count: 2,
        model: {
            provider: "NUCLEUX",
            name: "eliza",
        },
        description:
            "Description: A specialist in handling fiat-to-crypto and crypto-to-fiat transactions, ensuring users can efficiently move funds between traditional banking systems and blockchain networks. Specialization: Exchange liquidity evaluation, regulatory compliance, fiat on- ramping, off - ramping, and KYC / AML considerations. Model Capabilities: Integrates with platforms like MoonPay, Ramp, Wyre, and centralized exchanges(e.g., Binance, Coinbase, Kraken) to find the best routes for fiat conversion.Ensures compliance with jurisdictional restrictions and banking limitations while minimizing fees and transaction delays.",
        instructions: [
            "Provides fiat to cryptocurrency exchange analysis",
        ],
    });

    const zee = new ZeeWorkflow({
        description: "A major financial crisis has hit multiple economies, causing rapid devaluation of certain fiat currencies. Many users are rushing to convert their fiat into stablecoins or other crypto assets to preserve value. However, due to high demand, some fiat on-ramps are experiencing delays, higher fees, or liquidity shortages. As the Treasury Lead for a fintech company, I need to ensure we can: Convert fiat into crypto efficiently without excessive fees or regulatory roadblocks. Swap assets effectively on- chain to reach the desired stablecoin or asset. Bridge funds across chains if better opportunities exist on other networks. Identify the best available fiat on-ramp solutions, factoring in liquidity, fees, compliance restrictions, and transaction speed. Analyze the most efficient token swap routes, considering liquidity pools, slippage, and gas fees. Evaluate cross-chain bridge protocols to determine the optimal route for asset transfers. Work together to develop a structured, actionable response plan that balances transaction speed, cost, security, and regulatory considerations—ensuring a conclusive solution without unnecessary delays or loops.",
        agents: { [process.env["AGENT_1_NAME"]]: bridge_analyst, [process.env["AGENT_2_NAME"]]: swap_analyst, [process.env["AGENT_3_NAME"]]: exchange_analyst },
    });
    const result = await ZeeWorkflow.run(zee);

    res.send({ response: [bridge_analyst.response, swap_analyst.response, exchange_analyst.response] });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});