"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsTool = exports.TransactionsSchema = void 0;
const base_1 = require("./base");
const zod_1 = require("zod");
exports.TransactionsSchema = base_1.BaseGoldRushSchema.extend({
    timeframe: zod_1.z.enum(["1h", "24h", "7d", "30d"]),
});
class TransactionsTool extends base_1.BaseGoldRushTool {
    constructor(apiKey) {
        super("transactions", "Fetch transactions for a wallet address on a specific blockchain", exports.TransactionsSchema, apiKey);
    }
    async fetchData(params) {
        try {
            const { chain, address, timeframe = "24h" } = params;
            const txs = await this.client.TransactionService.getAllTransactionsForAddressByPage(chain, address, {
                quoteCurrency: "USD",
                noLogs: true,
                withSafe: true,
            });
            if (txs.error) {
                throw new Error(txs.error_message);
            }
            return `Transactions for ${address} on ${chain} in last ${timeframe}: ${JSON.stringify(txs.data, this.bigIntReplacer)}`;
        }
        catch (error) {
            return `Error fetching transactions: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
    }
}
exports.TransactionsTool = TransactionsTool;
//# sourceMappingURL=transactions.js.map