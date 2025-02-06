"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricalTokenPriceTool = exports.HistoricalTokenPriceSchema = void 0;
const base_1 = require("./base");
const client_sdk_1 = require("@covalenthq/client-sdk");
const zod_1 = require("zod");
exports.HistoricalTokenPriceSchema = zod_1.z.object({
    chain: zod_1.z.enum(Object.values(client_sdk_1.ChainName)),
    address: zod_1.z.string(),
    contractAddress: zod_1.z.string(),
    timeframe: zod_1.z.enum(["1h", "24h", "7d", "30d"]),
});
class HistoricalTokenPriceTool extends base_1.BaseGoldRushTool {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("GOLDRUSH_API_KEY is not set");
        }
        super("historical-token-price", "Fetch historical token prices for a specific token on a blockchain", exports.HistoricalTokenPriceSchema, apiKey);
    }
    async fetchData(params) {
        try {
            const { chain, contractAddress, timeframe } = params;
            let from;
            const formatDate = (date) => {
                return date.toISOString().split("T")[0];
            };
            switch (timeframe) {
                case "1h":
                    from = formatDate(new Date(Date.now() - 1000 * 60 * 60));
                    break;
                case "24h":
                    from = formatDate(new Date(Date.now() - 1000 * 60 * 60 * 24));
                    break;
                case "7d":
                    from = formatDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7));
                    break;
                case "30d":
                    from = formatDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30));
                    break;
            }
            const prices = await this.client.PricingService.getTokenPrices(chain, "USD", contractAddress, {
                from: from,
                to: formatDate(new Date(Date.now())),
            });
            if (prices.error) {
                throw new Error(prices.error_message);
            }
            return `Historical token prices for ${contractAddress} on ${chain} in last ${timeframe}: ${JSON.stringify(prices.data, this.bigIntReplacer)}`;
        }
        catch (error) {
            return `Error fetching historical token prices: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
    }
}
exports.HistoricalTokenPriceTool = HistoricalTokenPriceTool;
//# sourceMappingURL=historical-token-price.js.map