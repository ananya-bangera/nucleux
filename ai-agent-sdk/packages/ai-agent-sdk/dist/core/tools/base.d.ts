import type { AnyZodType } from "../base";
import type { ChatCompletionToolMessageParam } from "openai/resources";
import type { ParsedFunctionToolCall } from "openai/resources/beta/chat/completions";
export declare class Tool {
    private id;
    private _schema;
    private _description;
    private _execute;
    constructor(id: string, description: string, schema: AnyZodType, execute: (parameters: unknown) => Promise<string>);
    get description(): string;
    get schema(): AnyZodType;
    execute(parameters: unknown): Promise<string>;
}
interface ToolOptions {
    id: string;
    description: string;
    schema: AnyZodType;
    execute: (parameters: unknown) => Promise<string>;
}
export declare const createTool: (options: ToolOptions) => Tool;
export declare const runToolCalls: (tools: Record<string, Tool>, toolCalls: ParsedFunctionToolCall[]) => Promise<ChatCompletionToolMessageParam[]>;
export {};
//# sourceMappingURL=base.d.ts.map