"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXECUTE = void 0;
var chalk_1 = __importDefault(require("chalk"));
var child_process_1 = __importDefault(require("child_process"));
var config_1 = require("../../config");
exports.EXECUTE = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^" + config_1.NUKE + " exec (.*)");
        if (match == null) {
            return false;
        }
        var cmd = match[1];
        console.log(chalk_1.default.bold("EXECUTE"), cmd);
        try {
            var response = child_process_1.default.execSync(cmd).toString();
            outputStream.write(config_1.NUKE + " SUCCESS exec " + cmd + "\n" + response + "\n");
        }
        catch (e) {
            console.error(chalk_1.default.red(chalk_1.default.bold("EXECUTE statement failed: \n")), e);
            outputStream.write(config_1.NUKE + " FAILURE exec " + cmd + "\n" + e.message + "\n" + e.stack);
        }
        return true;
    }
};
