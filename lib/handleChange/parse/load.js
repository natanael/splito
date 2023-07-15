import chalk from "chalk";
import { sync as globSync } from "glob";
import _map from "lodash/map.js";
import { NUKE } from "../../config.js";
;
export var LOAD = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^".concat(NUKE, " load (.*)"));
        if (match == null) {
            return false;
        }
        var wildcard = match[1];
        console.log(chalk.bold("load", wildcard));
        try {
            var result = _map(globSync(wildcard.replace(/^\"|"$/g, '')), function (filename) { return "\t".concat(NUKE, " open \"").concat(filename, "\""); }).join("\n");
            outputStream.write("".concat(NUKE, " SUCCESS load ").concat(wildcard, "\n").concat(result, "\n"));
        }
        catch (e) {
            console.error(chalk.red(chalk.bold("FAILED TO PERFORM LOAD")), e);
            outputStream.write("".concat(NUKE, " FAILURE load ").concat(wildcard, "\n").concat(chunk.content));
        }
        return true;
    }
};
