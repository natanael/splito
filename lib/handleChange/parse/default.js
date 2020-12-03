"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT = void 0;
var chalk_1 = __importDefault(require("chalk"));
var config_1 = require("../../config");
exports.DEFAULT = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^" + config_1.NUKE + " (.*)");
        if (match == null) {
            return false;
        }
        var cmd = match[1];
        console.log(chalk_1.default.bold("IGNORED"), cmd);
        outputStream.write(config_1.NUKE + " IGNORED \"" + cmd + "\"\n");
        outputStream.write(chunk.content);
        return true;
    }
};
