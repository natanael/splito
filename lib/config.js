export var NUKE = "☢";
export var DEFAULT_CONTENT = "\n".concat(NUKE, " exec echo \"do something\"\n").concat(NUKE, " IGNORED exec grep console.log -irl src | awk '{print \"\u2622 open \\\"\" $1 \"\\\"\"}'\n").concat(NUKE, " IGNORED load \"src/**/*.*\"\n").concat(NUKE, " IGNORED exec find $(pwd)/src -type f\n").concat(NUKE, " IGNORED file \"myNewFolder/myNewFile.txt\"\n").concat(NUKE, " IGNORED open \"myExistingFolder/myExistingFile.txt\"\n");
export var GHOSTFILE = "ghostfile.splito";
export var TEMP_GHOSTFILE = "ghostfile.tmp";
