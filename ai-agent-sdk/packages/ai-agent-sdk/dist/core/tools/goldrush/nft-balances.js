"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTBalancesTool = exports.NFTBalancesSchema = void 0;
const base_1 = require("./base");
exports.NFTBalancesSchema = base_1.BaseGoldRushSchema;
class NFTBalancesTool extends base_1.BaseGoldRushTool {
    constructor(apiKey) {
        super("nft-balances", "Fetch NFT balances for a wallet address on a specific blockchain", exports.NFTBalancesSchema, apiKey);
    }
    async fetchData(params) {
        try {
            const { chain, address } = params;
            const nfts = await this.client.NftService.getNftsForAddress(chain, address);
            if (nfts.error) {
                throw new Error(nfts.error_message);
            }
            return `NFT balances for ${address} on ${chain}: ${JSON.stringify(nfts.data, this.bigIntReplacer)}`;
        }
        catch (error) {
            return `Error fetching NFT balances: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
    }
}
exports.NFTBalancesTool = NFTBalancesTool;
//# sourceMappingURL=nft-balances.js.map