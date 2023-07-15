import { NUKE } from "../../config.js";
;
export var IGNORE = {
    parseIfApplicable: function (chunk, outputStream) {
        var match = chunk.key.match("^".concat(NUKE, " (IGNORED|SUCCESS|FAILURE) (.*)"));
        if (match == null) {
            return false;
        }
        outputStream.write("".concat(chunk.key, "\n"));
        outputStream.write(chunk.content);
        return true;
    }
};
