"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var reduce_1 = __importDefault(require("lodash/reduce"));
var printChunks = function (chunks) {
    return reduce_1.default(chunks, function (a, v, k) {
        return (a += k + "\n" + v.join("\n") + "\n");
    }, "");
};
exports.default = printChunks;
