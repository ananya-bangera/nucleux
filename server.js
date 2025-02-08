const express = require('express');
const { ZeeWorkflow, Agent, createTool } = require('./ai-agent-sdk/packages/ai-agent-sdk/dist');
const app = express();
const z = require("zod");

app.get('/', async (req, res) => {
    const portfolio_analyst = new Agent({
        name: process.env["AGENT_1_NAME"],
        basicAuth: process.env["AGENT_1_AUTH"],
        model: {
            provider: "NUCLEUX",
            name: "eliza",
        },
        description:
            "Description: Manages disaster response and mitigation by assessing risks, coordinating emergency teams, and deploying resources effectively. Specialization: Crisis management, real-time risk assessment, and logistics coordination. Model Capabilities: Utilizes predictive analytics, geospatial data, and AI-driven simulations to enhance disaster preparedness and response.",
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
            "Description: A cryptocurrency swap expert that analyzes and executes optimal token swaps based on real-time market conditions. It evaluates liquidity pools, slippage, gas fees, and trade execution risks across multiple decentralized and centralized exchanges. Specialization: Smart contract interaction, on- chain data analysis, market depth evaluation, and alternative liquidity sourcing in case of disruptions. Model Capabilities: Uses external APIs(e.g., 1inch, Uniswap, Paraswap) and direct on - chain queries to assess trade feasibility, identify best execution paths, and mitigate risks such as front - running and impermanent loss",
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
        description: "I'm the CFO of a global fintech company, and our primary cryptocurrency liquidity provider has suddenly gone offline due to a major cyberattack. I have two AI agents: one specializes in cryptocurrency swaps, and the other in disaster recovery management. By working together, can you develop a structured response plan to ensure uninterrupted crypto swaps? The swap expert should assess available decentralized and alternative liquidity sources, while the disaster recovery expert should evaluate risk mitigation, contingency measures, and potential regulatory implications. Discuss viable fallback strategies, weigh the trade- offs of each approach, and ensure a clear, actionable conclusion that minimizes financial disruption without excessive delays or risk exposure.",
        agents: { [process.env["AGENT_1_NAME"]]: portfolio_analyst, [process.env["AGENT_2_NAME"]]: weather_analyst },
    });
    const result = await ZeeWorkflow.run(zee);

    // const result = await agent.generate([{
    //     role: "user",
    //     content: "Whats the future of AI in todays world?",
    // }], schema);

    console.log("///***///")
    console.log(result);

    // const result = await agent.run();
    // console.log(result);
    res.send({ response: result });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});