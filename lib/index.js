"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var fs = __importStar(require("fs-extra"));
var chalk_1 = __importDefault(require("chalk"));
var chokidar = __importStar(require("chokidar"));
var config_1 = require("./config");
var handleChange_1 = require("./handleChange");
var Cleaner = /** @class */ (function () {
    function Cleaner(watcher) {
        this.watcher = watcher;
        this.cleaned = false;
    }
    Cleaner.prototype.cleanup = function () {
        if (this.cleaned) {
            return;
        }
        console.log(chalk_1.default.bold("[ Cleaning up ]"));
        this.watcher.close();
        try {
            fs.unlinkSync(config_1.GHOSTFILE);
            fs.unlinkSync(config_1.TEMP_GHOSTFILE);
        }
        catch (_a) { }
        console.log(chalk_1.default.grey("All done"));
        this.cleaned = true;
    };
    return Cleaner;
}());
function main() {
    fs.writeFileSync(config_1.GHOSTFILE, config_1.DEFAULT_CONTENT);
    var watcher = chokidar.watch(config_1.GHOSTFILE);
    var cleaner = new Cleaner(watcher);
    process.on('SIGINT', function () { return cleaner.cleanup(); });
    process.on('SIGTERM', function () { return cleaner.cleanup(); });
    process.on('uncaughtException', function () { return cleaner.cleanup(); });
    var mainChangeHandler = new handleChange_1.ChangeHandler();
    watcher.on("change", function (path, fsStats) { return mainChangeHandler.handle(path, fsStats); });
    console.info(chalk_1.default.blue("All set! edit ./" + config_1.GHOSTFILE));
}
exports.main = main;
;
if (require.main === module) {
    main();
}
