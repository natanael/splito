import fs from "fs";
import chalk from "chalk";
import { NUKE } from "../../config.js";
export var OPEN = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^".concat(NUKE, " open (.*)"));
        if (match == null) {
            return false;
        }
        var filename = match[1];
        filename = JSON.parse(filename);
        console.log(chalk.bold("open", filename));
        try {
            outputStream.write("\n".concat(NUKE, " file \"").concat(filename, "\"\n").concat(fs.readFileSync(filename).toString()));
        }
        catch (e) {
            console.error(chalk.red(chalk.bold("FAILED TO LOAD FILE")), e);
        }
        return true;
    }
};
