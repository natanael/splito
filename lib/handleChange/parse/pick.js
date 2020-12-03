"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PICK = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var chalk_1 = __importDefault(require("chalk"));
var config_1 = require("../../config");
exports.PICK = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^" + config_1.NUKE + " pick (.*)");
        if (match == null) {
            return false;
        }
        var filename = match[1];
        filename = JSON.parse(filename);
        console.log(chalk_1.default.bold("pick", filename));
        try {
            outputStream.write(config_1.NUKE + " file \"" + filename + "\"\n" + fs_extra_1.default.readFileSync(filename).toString());
        }
        catch (e) {
            console.error(chalk_1.default.red(chalk_1.default.bold("FAILED TO LOAD FILE")), e);
        }
        return true;
    }
};
