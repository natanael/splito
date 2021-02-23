"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMP_GHOSTFILE = exports.GHOSTFILE = exports.DEFAULT_CONTENT = exports.NEW_LINE = exports.NUKE = void 0;
exports.NUKE = "☢";
exports.NEW_LINE = "\n";
exports.DEFAULT_CONTENT = "\n" + exports.NUKE + " exec echo \"do something\"\n" + exports.NUKE + " IGNORED exec grep console.log -irl src | awk '{print \"\u2622 open \"\" $1 \"\"\"}'\n" + exports.NUKE + " IGNORED load \"src/**/*.*\"\n" + exports.NUKE + " IGNORED exec find $(pwd)/src -type f\n" + exports.NUKE + " IGNORED file \"myNewFolder/myNewFile.txt\"\n" + exports.NUKE + " IGNORED open \"myExistingFolder/myExistingFile.txt\"\n";
exports.GHOSTFILE = "ghostfile.splito";
exports.TEMP_GHOSTFILE = "ghostfile.tmp";
