"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runToolCalls = exports.createTool = exports.Tool = void 0;
class Tool {
    id;
    _schema;
    _description;
    _execute;
    constructor(id, description, schema, execute) {
        this.id = id;
        this._description = description;
        this._schema = schema;
        this._execute = execute;
    }
    get description() {
        return this._description;
    }
    get schema() {
        return this._schema;
    }
    execute(parameters) {
        return this._execute(parameters);
    }
}
exports.Tool = Tool;
const createTool = (options) => {
    return new Tool(options.id, options.description, options.schema, options.execute);
};
exports.createTool = createTool;
const runToolCalls = async (tools, toolCalls) => {
    const results = await Promise.all(toolCalls.map(async (tc) => {
        if (tc.type !== "function") {
            throw new Error("Tool call needs to be a function");
        }
        const tool = tools[tc.function.name];
        if (!tool) {
            throw new Error(`Tool ${tc.function.name} not found`);
        }
        const response = await tool.execute(JSON.parse(tc.function.arguments));
        return {
            role: "tool",
            tool_call_id: tc.id,
            content: response,
        };
    }));
    return results;
};
exports.runToolCalls = runToolCalls;
//# sourceMappingURL=base.js.map