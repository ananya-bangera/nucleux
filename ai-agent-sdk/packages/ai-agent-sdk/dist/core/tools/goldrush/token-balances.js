"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBalancesTool = exports.TokenBalancesSchema = void 0;
const base_1 = require("./base");
exports.TokenBalancesSchema = base_1.BaseGoldRushSchema;
class TokenBalancesTool extends base_1.BaseGoldRushTool {
    constructor(apiKey) {
        super("token-balances", "Fetch token balances for a wallet address on a specific blockchain", exports.TokenBalancesSchema, apiKey);
    }
    async fetchData(params) {
        try {
            const { chain, address } = params;
            const balances = await this.client.BalanceService.getTokenBalancesForWalletAddress(chain, address);
            if (balances.error) {
                throw new Error(balances.error_message);
            }
            return `Token balances for ${address} on ${chain}: ${JSON.stringify(balances.data, this.bigIntReplacer)}`;
        }
        catch (error) {
            return `Error fetching token balances: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
    }
}
exports.TokenBalancesTool = TokenBalancesTool;
//# sourceMappingURL=token-balances.js.map