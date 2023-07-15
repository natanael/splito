import { IGNORE } from "./ignore.js";
import { EXECUTE } from "./execute.js";
import { FILE } from "./file.js";
import { LOAD } from "./load.js";
import { OPEN } from "./open.js";
import { DEFAULT } from "./default.js";
export function parseChunk(chunk, output) {
    if (IGNORE.parseIfApplicable(chunk, output)) {
        return;
    }
    if (EXECUTE.parseIfApplicable(chunk, output)) {
        return;
    }
    if (FILE.parseIfApplicable(chunk, output)) {
        return;
    }
    if (LOAD.parseIfApplicable(chunk, output)) {
        return;
    }
    if (OPEN.parseIfApplicable(chunk, output)) {
        return;
    }
    if (DEFAULT.parseIfApplicable(chunk, output)) {
        return;
    }
}
