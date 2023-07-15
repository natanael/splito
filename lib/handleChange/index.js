import readline from 'readline';
import fs from "fs";
import chalk from "chalk";
import { NUKE, GHOSTFILE } from "../config.js";
import { parseChunk } from "./parse/index.js";
var ChangeHandler = /** @class */ (function () {
    function ChangeHandler() {
        this.thatWasUs = false;
        this.handling = false;
        this.mtimeMs = 0;
        this.handling = false;
    }
    ChangeHandler.prototype.handle = function (path) {
        var _this = this;
        console.info(chalk.blue("".concat(GHOSTFILE, " CHANGED, PROCESSING...")));
        if (this.handling) {
            console.warn(chalk.bold(chalk.yellowBright("IGNORED CHANGE, STILL PROCESSING PREVIOUS EVENT")));
            return;
        }
        this.handling = true;
        var readStream = fs.createReadStream(path);
        var tempPath = "".concat(path, ".tmp");
        var writeStream = fs.createWriteStream(tempPath);
        var lineRead = readline.createInterface({ input: readStream });
        var currentChunk = null;
        lineRead.on('line', function (line) {
            if (line.match("^".concat(NUKE))) {
                if (currentChunk != null) {
                    parseChunk(currentChunk, writeStream);
                }
                currentChunk = {
                    key: line,
                    content: ''
                };
                return;
            }
            if (currentChunk == null) {
                currentChunk = {
                    key: "".concat(NUKE, " IGNORED no statement"),
                    content: ''
                };
            }
            currentChunk.content += "".concat(line, "\n");
        });
        readStream.on('end', function () {
            if (currentChunk != null) {
                parseChunk(currentChunk, writeStream);
            }
            console.log(chalk.grey("Finished, updating ".concat(GHOSTFILE, "...")));
            // fs.renameSync(tempPath, path);
            writeStream.close();
            var overwriteStream = fs.createReadStream(tempPath);
            overwriteStream.pipe(fs.createWriteStream(path));
            overwriteStream.on('end', function () {
                try {
                    fs.unlinkSync(tempPath);
                }
                catch (_a) { }
                _this.handling = false;
                // Capture system's mTimeMs
                _this.mtimeMs = fs.statSync(path).mtimeMs;
                // this.thatWasUs = true;
                console.log(chalk.grey("... done updating ".concat(GHOSTFILE)));
            });
        });
    };
    return ChangeHandler;
}());
export { ChangeHandler };
