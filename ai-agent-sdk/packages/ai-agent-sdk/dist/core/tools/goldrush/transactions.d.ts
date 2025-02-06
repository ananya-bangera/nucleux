import { BaseGoldRushTool } from "./base";
import { z } from "zod";
export declare const TransactionsSchema: z.ZodObject<z.objectUtil.extendShape<{
    chain: z.ZodEnum<[string, ...string[]]>;
    address: z.ZodString;
}, {
    timeframe: z.ZodEnum<["1h", "24h", "7d", "30d"]>;
}>, "strip", z.ZodTypeAny, {
    chain: string;
    address: string;
    timeframe: "1h" | "24h" | "7d" | "30d";
}, {
    chain: string;
    address: string;
    timeframe: "1h" | "24h" | "7d" | "30d";
}>;
export type TransactionsParams = z.infer<typeof TransactionsSchema>;
export declare class TransactionsTool extends BaseGoldRushTool {
    constructor(apiKey?: string);
    protected fetchData(params: TransactionsParams): Promise<string>;
}
//# sourceMappingURL=transactions.d.ts.map