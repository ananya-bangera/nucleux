const express = require('express');
const { ZeeWorkflow, Agent, createTool } = require('./ai-agent-sdk/packages/ai-agent-sdk/dist');
const app = express();
const z = require("zod");

app.get('/', async (req, res) => {
    const portfolio_analyst = new Agent({
        name: process.env["AGENT_1_NAME"],
        basicAuth: process.env["AGENT_1_AUTH"],
        count: 1,
        model: {
            provider: "NUCLEUX",
            name: "eliza",
        },
        description:
            "Description: A specialist in transferring assets across different blockchains while ensuring speed, security, and cost efficiency. Identifies the best bridge solutions based on availability, liquidity, and potential risks. Specialization: Bridge protocol evaluation, security risk assessment, latency optimization, and cost analysis. Model Capabilities: Uses APIs and smart contract interactions with protocols like Stargate, Synapse, and Across to determine optimal cross- chain routes.Evaluates potential issues such as liquidity fragmentation, bridge delays, and attack vectors. ",
        instructions: [
            "Provide a comprehensive overview of the latest dress materials",
        ],
    });
    const weather = createTool({
        id: "weather-tool",
        description: "Fetch the current weather in Vancouver, BC",
        schema: z.object({
            temperature: z.number(),
        }),
        count: 1,
        execute: async (_args) => {
            const lat = 49.2827,
                lon = -123.1207;

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

            const r = await fetch(url);
            const data = await r.json();

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return `Current temperature in Vancouver, BC is ${data.current_weather.temperature}°C`;
        },
    });
    const weather_analyst = new Agent({
        name: process.env["AGENT_2_NAME"],
        basicAuth: process.env["AGENT_2_AUTH"],
        model: {
            provider: "NUCLEUX",
            name: "eliza",
        },
        description:
            "Description: A specialist in optimizing token swaps within the same blockchain. Analyzes liquidity pools, gas fees, slippage, and trade execution risks to ensure efficient swaps. Specialization: Smart contract interaction, on- chain liquidity assessment, market depth evaluation, and trade execution optimization. Model Capabilities: Uses APIs(e.g., 1inch, Uniswap, Paraswap) and direct on - chain queries to find the best swap routes while mitigating risks such as front - running and impermanent loss",
        instructions: [
            "Provides cryptocurrency swap analysis",
        ],
        tools: [weather],
    });
    const schema = {
        article: z.object({
            title: z.string(),
            text: z.string(),
        }),
    };
    const zee = new ZeeWorkflow({
        description: "A critical DeFi protocol on Ethereum has suffered a smart contract exploit, leading to a rapid drop in token value and liquidity depletion. Many users are looking to exit their positions or move funds to another blockchain before further losses occur. As the Treasury Lead of a Web3 investment firm, I must act quickly to protect our holdings and ensure minimal exposure to losses. The Swap Expert should analyze whether swapping the affected token for a stable asset on the same chain is feasible and efficient, considering slippage, gas fees, and liquidity availability. The Cross- Chain Bridge Expert should assess the best routes to move the funds to another blockchain, avoiding congestion, excessive fees, or compromised bridge protocols. Work together to devise a clear, structured action plan balancing execution speed, cost, and security while avoiding unnecessary risks or delays.",
        agents: { [process.env["AGENT_1_NAME"]]: portfolio_analyst, [process.env["AGENT_2_NAME"]]: weather_analyst },
    });
    const result = await ZeeWorkflow.run(zee);

    // const result = await agent.generate([{
    //     role: "user",
    //     content: "Whats the future of AI in todays world?",
    // }], schema);

    console.log("///***///")
    console.log(portfolio_analyst.response, weather_analyst.response);

    // const result = await agent.run();
    // console.log(result);
    res.send({ response: [portfolio_analyst.response, weather_analyst.response] });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});