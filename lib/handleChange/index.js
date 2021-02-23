"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeHandler = void 0;
var readline_1 = __importDefault(require("readline"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var config_1 = require("../config");
var parse_1 = require("./parse");
var ChangeHandler = /** @class */ (function () {
    function ChangeHandler() {
        this.thatWasUs = false;
        this.handling = false;
        this.mtimeMs = 0;
        this.handling = false;
    }
    ChangeHandler.prototype.handle = function (path, stats) {
        var _this = this;
        // if (this.thatWasUs) {
        // 	console.log(chalk.grey("last change was ours, ignoring.."));
        // 	this.thatWasUs = false;
        // 	return;
        // }
        // if (stats.size == 0) {
        // 	console.log(chalk.grey("got an empty file, false change, fs hiccup, ignoring.."));
        // 	return;
        // }
        if (stats.mtimeMs === this.mtimeMs) {
            console.log(chalk_1.default.grey("same modification time, false change, ignoring.."));
            return;
        }
        console.info(chalk_1.default.blue(config_1.GHOSTFILE + " CHANGED, PROCESSING..."));
        if (this.handling) {
            console.warn(chalk_1.default.bold(chalk_1.default.yellowBright("IGNORED CHANGE, STILL PROCESSING PREVIOUS EVENT")));
            return;
        }
        this.handling = true;
        var readStream = fs_1.default.createReadStream(path);
        var tempPath = path + ".tmp";
        var writeStream = fs_1.default.createWriteStream(tempPath);
        var lineRead = readline_1.default.createInterface({ input: readStream });
        var currentChunk = null;
        lineRead.on('line', function (line) {
            if (line.match("^" + config_1.NUKE)) {
                if (currentChunk != null) {
                    parse_1.parseChunk(currentChunk, writeStream);
                }
                currentChunk = {
                    key: line,
                    content: ''
                };
                return;
            }
            if (currentChunk == null) {
                currentChunk = {
                    key: config_1.NUKE + " IGNORED no statement",
                    content: ''
                };
            }
            currentChunk.content += "" + line + config_1.NEW_LINE;
        });
        readStream.on('end', function () {
            if (currentChunk != null) {
                parse_1.parseChunk(currentChunk, writeStream);
            }
            console.log(chalk_1.default.grey("Finished, updating " + config_1.GHOSTFILE + "..."));
            // fs.renameSync(tempPath, path);
            writeStream.close();
            var overwriteStream = fs_1.default.createReadStream(tempPath);
            overwriteStream.pipe(fs_1.default.createWriteStream(path));
            overwriteStream.on('end', function () {
                try {
                    fs_1.default.unlinkSync(tempPath);
                }
                catch (_a) { }
                _this.handling = false;
                // Capture system's mTimeMs
                _this.mtimeMs = fs_1.default.statSync(path).mtimeMs;
                // this.thatWasUs = true;
                console.log(chalk_1.default.grey("... done updating " + config_1.GHOSTFILE));
            });
        });
    };
    return ChangeHandler;
}());
exports.ChangeHandler = ChangeHandler;
