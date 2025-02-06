import "dotenv/config";
import type { ChatCompletionAssistantMessageParam, ChatCompletionMessageParam, ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from "openai/resources/chat/completions";
import { type ZodType } from "zod";
export declare const logger: import("pino").Logger<never, boolean>;
export type MODULE = "agent" | "llm" | "tools" | "server" | "zee";
export type AnyZodType = ZodType<unknown>;
export declare class Base {
    private logger;
    private module;
    constructor(module: MODULE);
    info(message: string, ...args: unknown[]): void;
}
export declare const user: (content: string) => ChatCompletionUserMessageParam;
export declare const assistant: (content: string) => ChatCompletionAssistantMessageParam;
export declare const system: (content: string) => ChatCompletionSystemMessageParam;
export type Conversation = [
    ChatCompletionUserMessageParam,
    ...ChatCompletionMessageParam[]
];
//# sourceMappingURL=index.d.ts.map