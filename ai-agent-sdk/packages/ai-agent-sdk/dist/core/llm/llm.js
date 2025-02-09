"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLM = void 0;
const base_1 = require("../base");
const openai_1 = __importDefault(require("openai"));
const zod_1 = require("openai/helpers/zod");
const zod_2 = require("zod");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const entryToObject = ([key, value]) => {
    return zod_2.z.object({ type: zod_2.z.literal(key), value });
};
const responseAsStructuredOutput = (schema) => {
    const [first, ...rest] = Object.entries(schema);
    if (!first) {
        throw new Error("No schema provided");
    }
    return (0, zod_1.zodResponseFormat)(zod_2.z.object({
        response: zod_2.z.discriminatedUnion("type", [
            entryToObject(first),
            ...rest.map(entryToObject),
        ]),
    }), "task_result");
};
const formatOpenAITools = (tools) => {
    return Object.entries(tools).map(([name, tool]) => ({
        type: "function",
        function: {
            name,
            parameters: (0, zod_to_json_schema_1.zodToJsonSchema)(tool.schema),
            description: tool.description,
            strict: true,
        },
    }));
};
class LLM extends base_1.Base {
    model;
    constructor(model) {
        super("llm");
        this.model = model;
    }
    async generate(messages, response_schema, tools, agentName, basicAuth) {
        const config = {
            apiKey: this.model.apiKey,
        };
        const provider = this.model.provider;
        switch (provider) {
            case "OPEN_AI":
                break;
            case "DEEPSEEK":
                config.baseURL = "https://api.deepseek.com/v1";
                config.apiKey =
                    process.env["DEEPSEEK_API_KEY"] || this.model.apiKey;
                break;
            case "GROK":
                config.baseURL = "https://api.groq.com/openai/v1/models";
                config.apiKey =
                    process.env["GROK_API_KEY"] || this.model.apiKey;
                break;
            case "GROQ":
                config.baseURL = "https://api.groq.com/openai/v1/models";
                config.apiKey =
                    process.env["GROQ_API_KEY"] || this.model.apiKey;
                break;
            case "GEMINI":
                config.baseURL = "https://api.gemini.google.com/v1";
                config.apiKey =
                    process.env["GEMINI_API_KEY"] || this.model.apiKey;
                break;
            case "NUCLEUX":
                config.baseURL = "https://autonome.alt.technology/" + agentName;
                config.apiKey =
                    process.env["NUCLEUX_API_KEY"] || this.model.apiKey;
                break;
            default:
                var _exhaustiveCheck = provider;
                throw new Error(`Unhandled model provider: ${_exhaustiveCheck}`);
        }
        if (provider === "NUCLEUX") {

            const apiUrl = `https://autonome.alt.technology/${agentName}`;
            const encodedBasicAuth = btoa(basicAuth);
            try {
                const res = await fetch(`${apiUrl}/agents`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${encodedBasicAuth}`,
                    },
                });
                if (!res.ok) {
                    throw new Error(`Error: ${res.statusText}`);
                }
                const data = await res.json();
                const agentId = data?.agents?.[0]?.id;
                if (agentId) {
                    const elizaChatEndpoint = `${apiUrl}/${agentId}/message`;
                    const res2 = await fetch(elizaChatEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${encodedBasicAuth}`
                        },
                        body: JSON.stringify({ text: `${JSON.stringify(messages)}` })
                    });
                    if (!res2.ok) {
                        throw new Error(`Error: ${res2.statusText}`);
                    }
                    const data2 = await res2.json();

                    return { agent: agentName, message: data2[0].text, type: agentName.includes("router") ? "next_task" : (agentName.includes(process.env["RESOURCE_PLANNER_NAME"]) ? "select_agent" : "end"), value: { "task": agentName.includes("router") ? JSON.stringify(messages) : data2[0].text } };
                }
                else {
                    console.log('Agent ID not found');
                }
            }
            catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            const client = new openai_1.default(config);
            const mappedTools = tools ? formatOpenAITools(tools) : [];
            const response = await client.beta.chat.completions.parse({
                model: this.model.name,
                messages,
                tools: mappedTools.length > 0 ? mappedTools : undefined,
            });
            const message = response.choices[0] && response.choices[0].message;
            if (message && message.tool_calls && message.tool_calls.length > 0) {
                return {
                    type: "tool_call",
                    value: message.tool_calls,
                };
            }
            if (message?.parsed?.response) {
                return message.parsed.response;
            }
            throw new Error("No response in message");
        }
    }
}
exports.LLM = LLM;
//# sourceMappingURL=index.js.map