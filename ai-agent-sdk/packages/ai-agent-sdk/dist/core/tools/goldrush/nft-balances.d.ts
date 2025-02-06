import { BaseGoldRushTool } from "./base";
import type { z } from "zod";
export declare const NFTBalancesSchema: z.ZodObject<{
    chain: z.ZodEnum<[string, ...string[]]>;
    address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    chain: string;
    address: string;
}, {
    chain: string;
    address: string;
}>;
export type NFTBalancesParams = z.infer<typeof NFTBalancesSchema>;
export declare class NFTBalancesTool extends BaseGoldRushTool {
    constructor(apiKey?: string);
    protected fetchData(params: NFTBalancesParams): Promise<string>;
}
//# sourceMappingURL=nft-balances.d.ts.map