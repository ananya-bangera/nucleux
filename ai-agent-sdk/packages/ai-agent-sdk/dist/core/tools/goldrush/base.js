"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGoldRushTool = exports.BaseGoldRushSchema = void 0;
const base_1 = require("../base");
const client_sdk_1 = require("@covalenthq/client-sdk");
const zod_1 = require("zod");
exports.BaseGoldRushSchema = zod_1.z.object({
    chain: zod_1.z.enum(Object.values(client_sdk_1.ChainName)),
    address: zod_1.z.string(),
});
class BaseGoldRushTool extends base_1.Tool {
    client;
    constructor(id, description, schema, apiKey = process.env["GOLDRUSH_API_KEY"] ?? "") {
        super(id, description, schema, async (parameters) => await this.fetchData(parameters));
        if (!apiKey) {
            throw new Error("GOLDRUSH_API_KEY is not set");
        }
        this.client = new client_sdk_1.GoldRushClient(apiKey);
    }
    bigIntReplacer(_key, value) {
        if (typeof value === "bigint") {
            return value.toString();
        }
        return value;
    }
}
exports.BaseGoldRushTool = BaseGoldRushTool;
//# sourceMappingURL=base.js.map