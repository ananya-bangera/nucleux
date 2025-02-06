"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
const llm_1 = require("./llm");
const vitest_1 = require("vitest");
const zod_1 = __importDefault(require("zod"));
(0, vitest_1.describe)("@ai-agent-sdk/llm", () => {
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
            const llm = new llm_1.LLM(config);
            (0, vitest_1.test)("text with custom schema output", async () => {
                const schema = {
                    step: zod_1.default.object({
                        answer: zod_1.default.string(),
                        explanation: zod_1.default.number(),
                    }),
                };
                const result = await llm.generate([(0, base_1.user)("What is the answer to 5+7?")], schema, {});
                console.log(result);
                if (result.type !== "step") {
                    throw new Error(`Expected step response, got ${result.type}`);
                }
                (0, vitest_1.expect)(result.value).toBeDefined();
                (0, vitest_1.expect)(result.value["answer"]).toBeDefined();
                (0, vitest_1.expect)(result.value["answer"]).toEqual("12");
                (0, vitest_1.expect)(result.value["explanation"]).toBeDefined();
            });
            vitest_1.test.skipIf(config.provider === "GEMINI")("image with custom schema output", async () => {
                const messages = [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "What's in this image? Suggest Improvements to the logo as well",
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
                                    detail: "auto",
                                },
                            },
                        ],
                    },
                ];
                const schema = {
                    analysis: zod_1.default.object({
                        description: zod_1.default.string(),
                        colors: zod_1.default.array(zod_1.default.string()),
                        text_content: zod_1.default.string().optional(),
                        improvements: zod_1.default.string().optional(),
                    }),
                };
                const result = await llm.generate(messages, schema, {});
                console.log(result);
                if (result.type !== "analysis") {
                    throw new Error(`Expected step response, got ${result.type}`);
                }
                (0, vitest_1.expect)(result.value).toBeDefined();
                (0, vitest_1.expect)(result.value.description).toBeDefined();
                (0, vitest_1.expect)(result.value.colors).toBeDefined();
                (0, vitest_1.expect)(Array.isArray(result.value.colors)).toBe(true);
            });
            vitest_1.test.skipIf(config.provider === "GEMINI")("image as base64 input", async () => {
                const messages = [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "What's in this image and what color is it?",
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
                                    detail: "auto",
                                },
                            },
                        ],
                    },
                ];
                const schema = {
                    analysis: zod_1.default.object({
                        description: zod_1.default.string(),
                        color: zod_1.default.string(),
                        dimensions: zod_1.default.object({
                            width: zod_1.default.number(),
                            height: zod_1.default.number(),
                        }),
                    }),
                };
                const result = await llm.generate(messages, schema, {});
                console.log("Base64 image analysis result:", result);
                if (result.type !== "analysis") {
                    throw new Error(`Expected analysis response, got ${result.type}`);
                }
                (0, vitest_1.expect)(result.value).toBeDefined();
                (0, vitest_1.expect)(result.value.description).toBeDefined();
                (0, vitest_1.expect)(result.value.color).toBeDefined();
                (0, vitest_1.expect)(result.value.dimensions).toBeDefined();
            });
        });
    });
});
//# sourceMappingURL=llm.test.js.map