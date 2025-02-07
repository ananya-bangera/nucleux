"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateFn = void 0;
const base_1 = require("../base");
exports.StateFn = {
    childState: (options) => {
        const { agent, messages, status = "idle", children = [] } = options;
        return {
            agent,
            messages,
            status,
            children,
        };
    },
    root: (workflowDescription) => {
        return exports.StateFn.childState({
            agent: process.env["ROUTER_NAME"],
            messages: [
                (0, base_1.user)(`Here is a description of my workflow: ${workflowDescription}`),
            ],
        });
    },
    passdown: (state, agent) => {
        return exports.StateFn.childState({
            agent,
            messages: state.messages,
        });
    },
    assign: (state, context) => {
        return {
            ...state,
            status: "running",
            children: context.map(([agent, message]) => exports.StateFn.childState({ agent, messages: [message] })),
        };
    },
    finish: (state, agentResponse) => {
        if (state.messages[0]) {
            return {
                ...state,
                status: "finished",
                messages: [state.messages[0], agentResponse],
            };
        }
        throw new Error("No messages found in state");
    },
};
//# sourceMappingURL=index.js.map