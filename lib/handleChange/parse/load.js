"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAD = void 0;
var chalk_1 = __importDefault(require("chalk"));
var glob_1 = __importDefault(require("glob"));
var map_1 = __importDefault(require("lodash/map"));
var config_1 = require("../../config");
exports.LOAD = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^" + config_1.NUKE + " load (.*)");
        if (match == null) {
            return false;
        }
        var wildcard = match[1];
        console.log(chalk_1.default.bold("load", wildcard));
        try {
            var result = map_1.default(glob_1.default.sync(wildcard.replace(/^\"|"$/g, '')), function (filename) { return "\t" + config_1.NUKE + " open \"" + filename + "\""; }).join(config_1.NEW_LINE);
            outputStream.write(config_1.NUKE + " SUCCESS load " + wildcard + "\n" + result);
        }
        catch (e) {
            console.error(chalk_1.default.red(chalk_1.default.bold("FAILED TO PERFORM LOAD")), e);
            outputStream.write(config_1.NUKE + " FAILURE load " + glob_1.default + "\n" + chunk.content);
        }
        return true;
    }
};
