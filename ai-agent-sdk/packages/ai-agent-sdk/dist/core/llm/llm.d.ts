import { Base } from "../base";
import type { Tool } from "../tools/base";
import type { FunctionToolCall, LLMResponse, ModelConfig } from "./llm.types";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { AnyZodObject } from "zod";
export declare class LLM extends Base {
    private model;
    constructor(model: ModelConfig);
    generate<T extends Record<string, AnyZodObject>>(messages: ChatCompletionMessageParam[], response_schema: T, tools: Record<string, Tool>): Promise<FunctionToolCall | LLMResponse<T>>;
}
//# sourceMappingURL=llm.d.ts.map