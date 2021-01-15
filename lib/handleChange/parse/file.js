"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var chalk_1 = __importDefault(require("chalk"));
var config_1 = require("../../config");
exports.FILE = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^" + config_1.NUKE + " file \"([^\"]+)\"");
        if (match == null) {
            return false;
        }
        var filename = match[1];
        console.log(chalk_1.default.bold("FILE"), filename);
        try {
            fs_extra_1.default.ensureFileSync(filename);
            var response = fs_extra_1.default.writeFileSync(filename, chunk.content);
            console.log(JSON.stringify(response));
            outputStream.write((chunk.key + "\n" + chunk.content + "\n")
                .replace(/\n/g, '‡')
                .replace(/‡+$/, '‡')
                .replace(/‡/g, '\n'));
        }
        catch (e) {
            outputStream.write(config_1.NUKE + " FAILED file " + filename + "\n");
            console.error(chalk_1.default.red(chalk_1.default.bold("COULD NOT WRITE TO FILE " + filename)), e);
        }
        return true;
    }
};
