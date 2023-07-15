import fs from 'fs';
import chalk from "chalk";
import { GHOSTFILE, DEFAULT_CONTENT, TEMP_GHOSTFILE } from './config.js';
// Event loop locking actually simplifies this program and it is fine.
fs.writeFileSync(GHOSTFILE, DEFAULT_CONTENT);
var currentState = DEFAULT_CONTENT;
var watcher = fs.watch(GHOSTFILE, function (eventType, filename) {
    console.log('ghostfile changed', { eventType: eventType, filename: filename });
    var content = fs.readFileSync(GHOSTFILE, 'utf8');
    if (content === currentState) {
        console.log(chalk.grey('splito write'));
    }
    else {
        console.log(chalk.grey('user write'));
        currentState = content;
    }
});
function cleanup() {
    watcher.close();
    try {
        fs.unlinkSync(GHOSTFILE);
        fs.unlinkSync(TEMP_GHOSTFILE);
    }
    catch (_a) { }
}
process.on('SIGINT', function () { return cleanup(); });
process.on('SIGTERM', function () { return cleanup(); });
process.on('uncaughtException', function () { return cleanup(); });
