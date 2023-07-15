import chalk from "chalk";
import cp from "child_process";
import { NUKE } from "../../config.js";
export var EXECUTE = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^".concat(NUKE, " exec (.*)"));
        if (match == null) {
            return false;
        }
        var cmd = match[1];
        console.log(chalk.bold("EXECUTE"), cmd);
        try {
            var response = cp.execSync(cmd).toString();
            outputStream.write("".concat(NUKE, " SUCCESS exec ").concat(cmd, "\n").concat(response, "\n"));
        }
        catch (e) {
            console.error(chalk.red(chalk.bold("EXECUTE statement failed: \n")), e);
            if (e instanceof Error) {
                outputStream.write("".concat(NUKE, " FAILURE exec ").concat(cmd, "\n").concat(e.message, "\n").concat(e.stack));
            }
        }
        return true;
    }
};
