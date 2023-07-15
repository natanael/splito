var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { createHash } from 'crypto';
import { createReadStream, watch as fsWatch } from 'fs';
import { EventEmitter } from 'events';
var ChecksumEmitter = /** @class */ (function (_super) {
    __extends(ChecksumEmitter, _super);
    function ChecksumEmitter(filepath, algorithm) {
        if (algorithm === void 0) { algorithm = 'sha1'; }
        var _this = _super.call(this) || this;
        _this.filepath = filepath;
        _this.algorithm = algorithm;
        _this.hash = '';
        _this.fsWatcher = null;
        _this.handleFileChange = function (filepath) {
            _this.checkSum(function (newHash) {
                if (newHash !== _this.hash) {
                    _this.hash = newHash;
                    _this.emit('checksumChanged', newHash);
                }
            });
        };
        _this.startWatching();
        return _this;
    }
    ChecksumEmitter.prototype.close = function () {
        var _a;
        (_a = this.fsWatcher) === null || _a === void 0 ? void 0 : _a.close();
    };
    ChecksumEmitter.prototype.checkSum = function (onEnd) {
        var _this = this;
        var hash = createHash(this.algorithm).setEncoding('hex')
            .once('finish', function () { return onEnd(hash.read()); });
        createReadStream(this.filepath)
            .once('error', function (error) { return _this.emit('error', error); })
            .pipe(hash);
    };
    ChecksumEmitter.prototype.startWatching = function () {
        var _this = this;
        this.checkSum(function (prevHash) {
            _this.hash = prevHash;
            _this.fsWatcher = fsWatch(_this.filepath, function (event, filepath) {
                if (event === 'change' && filepath === _this.filepath) {
                    _this.handleFileChange(filepath);
                }
            });
        });
    };
    return ChecksumEmitter;
}(EventEmitter));
export { ChecksumEmitter };
