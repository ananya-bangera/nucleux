import { Tool } from "../base";
import { GoldRushClient } from "@covalenthq/client-sdk";
import { z, type AnyZodObject } from "zod";
export declare const BaseGoldRushSchema: z.ZodObject<{
    chain: z.ZodEnum<[string, ...string[]]>;
    address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    chain: string;
    address: string;
}, {
    chain: string;
    address: string;
}>;
export declare abstract class BaseGoldRushTool extends Tool {
    protected client: GoldRushClient;
    constructor(id: string, description: string, schema: AnyZodObject, apiKey?: string);
    protected abstract fetchData(params: unknown): Promise<string>;
    protected bigIntReplacer(_key: string, value: unknown): unknown;
}
//# sourceMappingURL=base.d.ts.map