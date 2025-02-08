import { composeContext, generateObjectDeprecated } from "@elizaos/core";
import {
    type Action,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
} from "@elizaos/core";
import { getSwapTemplate } from "./template.ts";
import { swapExamples } from "./examples.ts";


export const getSwapAction: Action = {
    name: "SWAP",

    similes: [
        "GET_SWAP",
        "GET_SWAP_PRICE",
        "GET_SWAP_RATE",
        "GET_SWAPPING_PRICE",
        "GET_SWAPPING_RATE",
        "GET_CONVERSION_PRICE",
        "GET_CONVERSION_RATE",
        "SWAP_POOL",
        "CONVERT",
    ],

    description:
        "ALWAYS use this action whenever the message involves swapping/converting of cryptocurrency within the same chain.",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Do not trigger the action if the message does not talk about swapping/converting a token or about a liquidity pool

        const keywords = [
            "swap",
            "convert",
            "pool",
        ];
        return !keywords.some((keyword) => message.content.text.toLowerCase().includes(keyword))
    },

    handler: async (runtime: IAgentRuntime, message: Memory) => {
        async function _getSwapRoute(state: State): Promise<boolean> {
            const shouldFollowContext = composeContext({
                state,
                template: getSwapTemplate, // Define this template separately
            });

            const response = await generateObjectDeprecated({
                runtime,
                context: shouldFollowContext,
                modelClass: ModelClass.LARGE,
            });

            return response;
        }

        const state = await runtime.composeState(message);
        const swapRoute = await _getSwapRoute(state);

        if (swapRoute) {
            console.log("Swap route found: ", swapRoute);
        }
    },
    examples: swapExamples
} as Action;