import { BaseGoldRushTool } from "./base";
import type { z } from "zod";
export declare const TokenBalancesSchema: z.ZodObject<{
    chain: z.ZodEnum<[string, ...string[]]>;
    address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    chain: string;
    address: string;
}, {
    chain: string;
    address: string;
}>;
export type TokenBalancesParams = z.infer<typeof TokenBalancesSchema>;
export declare class TokenBalancesTool extends BaseGoldRushTool {
    constructor(apiKey?: string);
    protected fetchData(params: TokenBalancesParams): Promise<string>;
}
//# sourceMappingURL=token-balances.d.ts.map