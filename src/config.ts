export const NUKE = "☢";

export const NEW_LINE = "\n";

export const DEFAULT_CONTENT = `
${NUKE} exec echo "do something"
${NUKE} IGNORED load "src/**/*.*"
${NUKE} IGNORED exec find \`pwd\`src -type f"
${NUKE} IGNORED file myNewFolder/myNewFile.txt"
${NUKE} IGNORED open myExistingFolder/myExistingFile.txt"
`;

export const GHOSTFILE = `ghostfile.splito`;
export const TEMP_GHOSTFILE = `ghostfile.tmp`;
