import fs from "fs";
import path from "path";
import chalk from "chalk";
import { NUKE } from "../../config.js";
export var FILE = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^".concat(NUKE, " file \"([^\"]+)\""));
        if (match == null) {
            return false;
        }
        var filename = match[1];
        console.log(chalk.bold("FILE"), filename);
        try {
            ensureFileSync(filename, chunk.content);
            outputStream.write("".concat(chunk.key, "\n").concat(chunk.content, "\n")
                .replace(/\n/g, '‡')
                .replace(/‡+$/, '‡')
                .replace(/‡/g, '\n'));
        }
        catch (e) {
            outputStream.write("".concat(NUKE, " FAILED file ").concat(filename, "\n"));
            console.error(chalk.red(chalk.bold("COULD NOT WRITE TO FILE ".concat(filename))), e);
        }
        return true;
    }
};
function ensureFileSync(filepath, content) {
    var normalizedPath = path.normalize(filepath);
    var dirname = path.dirname(normalizedPath);
    try {
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }
        if (!fs.existsSync(normalizedPath)) {
            fs.writeFileSync(normalizedPath, content);
        }
    }
    catch (error) {
        console.error(chalk.red(chalk.bold("COULD NOT ENSURE FILE ".concat(filepath))), error);
        if (error instanceof Error) {
            throw new Error("Failed to ensure the existence of file: ".concat(filepath, "\n").concat(error.message));
        }
    }
}
