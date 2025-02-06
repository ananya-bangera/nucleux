"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.system = exports.assistant = exports.user = exports.Base = exports.logger = void 0;
require("dotenv/config");
const pino_1 = __importDefault(require("pino"));
exports.logger = (0, pino_1.default)({
    level: "debug",
});
class Base {
    logger;
    module;
    constructor(module) {
        this.logger = exports.logger;
        this.module = module;
    }
    info(message, ...args) {
        console.log(`[${this.module}] ${message}`, ...args);
    }
}
exports.Base = Base;
const user = (content) => ({
    role: "user",
    content,
});
exports.user = user;
const assistant = (content) => ({
    role: "assistant",
    content,
});
exports.assistant = assistant;
const system = (content) => ({
    role: "system",
    content,
});
exports.system = system;
//# sourceMappingURL=index.js.map