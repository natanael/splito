import * as fs from "fs-extra";
import chalk from "chalk";
import * as chokidar from "chokidar";
import _map from "lodash/map";
import _size from "lodash/size";
import _reduce from "lodash/reduce";

import { DEFAULT_CONTENT, GHOSTFILE, TEMP_GHOSTFILE } from "./config";

import {ChangeHandler} from "./handleChange";
import { Stats } from "fs-extra";

class Cleaner {
	cleaned: boolean = false;
	constructor(private readonly watcher: chokidar.FSWatcher) {}
	cleanup() {
		if (this.cleaned) { return; }
		console.log(chalk.bold(`[ Cleaning up ]`));
		this.watcher.close();
		try {
			fs.unlinkSync(GHOSTFILE);
			fs.unlinkSync(TEMP_GHOSTFILE);
		} catch {}
		console.log(chalk.grey(`All done`));
		this.cleaned = true;
	}
}

export function main () {
	fs.writeFileSync(GHOSTFILE, DEFAULT_CONTENT);

	const watcher = chokidar.watch(GHOSTFILE);
	const cleaner = new Cleaner(watcher);
	process.on('SIGINT',  () => cleaner.cleanup());
	process.on('SIGTERM', () => cleaner.cleanup());
	process.on('uncaughtException', () => cleaner.cleanup());

	const mainChangeHandler = new ChangeHandler();

	watcher.on("change", (path: string, fsStats: Stats) => mainChangeHandler.handle(path, fsStats));

	console.info(chalk.blue(`All set! edit ./${GHOSTFILE}`));
};

if (require.main === module) {
	main();
}