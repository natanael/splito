import chalk from "chalk";
import { NUKE } from "../../config.js";
;
export var DEFAULT = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^".concat(NUKE, " (.*)"));
        if (match == null) {
            return false;
        }
        var cmd = match[1];
        console.log(chalk.bold("IGNORED"), cmd);
        outputStream.write("".concat(NUKE, " IGNORED \"").concat(cmd, "\"\n"));
        outputStream.write(chunk.content);
        return true;
    }
};
