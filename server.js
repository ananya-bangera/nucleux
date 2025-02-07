const express = require('express');
const { ZeeWorkflow, Agent, createTool } = require('./ai-agent-sdk/packages/ai-agent-sdk/dist');
const app = express();
const z = require("zod");

app.get('/', async (req, res) => {
    const portfolio_analyst = new Agent({
        name:  process.env["AGENT_1_NAME"],
        basicAuth: process.env["AGENT_1_AUTH"],
        model: {
            provider: "NUCLEUX",
            name: "eliza",
        },
        description:
                "You are a material supplier",
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
                "You are a weather forecaster",
            instructions: [
                "Provides current weather forecast",
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
        description: "Todays weather forecast",
        output: "A comprehensive overview on the current weather",
        agents: { portfolio_analyst, weather_analyst },
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
    res.send({response: result});
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});