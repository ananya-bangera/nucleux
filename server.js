const express = require('express');
const { ZeeWorkflow, Agent } = require('./ai-agent-sdk/packages/ai-agent-sdk/dist');
const app = express();
const z = require("zod");

app.get('/', async (req, res) => {
    const portfolio_analyst = new Agent({
        name: AGENT_1_NAME,
        basicAuth: AGENT_1_AUTH,
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
    const transaction_analyst = new Agent({
        name: AGENT_2_NAME,
        basicAuth: AGENT_2_AUTH,
        model: {
            provider: "NUCLEUX",
            name: "eliza",
        },
        description:
                "You are a fashion designer",
            instructions: [
                "Provide a comprehensive overview of the latest designs",
            ],
    });
    const schema = {
        article: z.object({
            title: z.string(),
            text: z.string(),
        }),
    };
    const zee = new ZeeWorkflow({
        description: "How the fashion sense will progress",
        output: "A comprehensive report on thetrending designs and branded materials",
        agents: { portfolio_analyst, transaction_analyst },
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