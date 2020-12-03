"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseChunk = void 0;
var ignore_1 = require("./ignore");
var execute_1 = require("./execute");
var file_1 = require("./file");
var load_1 = require("./load");
var open_1 = require("./open");
var default_1 = require("./default");
function parseChunk(chunk, output) {
    if (ignore_1.IGNORE.parseIfApplicable(chunk, output)) {
        return;
    }
    if (execute_1.EXECUTE.parseIfApplicable(chunk, output)) {
        return;
    }
    if (file_1.FILE.parseIfApplicable(chunk, output)) {
        return;
    }
    if (load_1.LOAD.parseIfApplicable(chunk, output)) {
        return;
    }
    if (open_1.OPEN.parseIfApplicable(chunk, output)) {
        return;
    }
    if (default_1.DEFAULT.parseIfApplicable(chunk, output)) {
        return;
    }
}
exports.parseChunk = parseChunk;
