import { BaseGoldRushTool } from "./base";
import { z } from "zod";
export declare const HistoricalTokenPriceSchema: z.ZodObject<{
    chain: z.ZodEnum<[string, ...string[]]>;
    address: z.ZodString;
    contractAddress: z.ZodString;
    timeframe: z.ZodEnum<["1h", "24h", "7d", "30d"]>;
}, "strip", z.ZodTypeAny, {
    chain: string;
    address: string;
    timeframe: "1h" | "24h" | "7d" | "30d";
    contractAddress: string;
}, {
    chain: string;
    address: string;
    timeframe: "1h" | "24h" | "7d" | "30d";
    contractAddress: string;
}>;
export type HistoricalTokenPriceParams = z.infer<typeof HistoricalTokenPriceSchema>;
export declare class HistoricalTokenPriceTool extends BaseGoldRushTool {
    constructor(apiKey?: string);
    protected fetchData(params: HistoricalTokenPriceParams): Promise<string>;
}
//# sourceMappingURL=historical-token-price.d.ts.map