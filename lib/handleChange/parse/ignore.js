"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGNORE = void 0;
var config_1 = require("../../config");
exports.IGNORE = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^" + config_1.NUKE + " (IGNORED|SUCCESS|FAILURE) (.*)");
        if (match == null) {
            return false;
        }
        outputStream.write(chunk.key + "\n");
        outputStream.write(chunk.content);
        return true;
    }
};
