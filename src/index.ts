import fs, { type FSWatcher } from "fs";
import chalk from "chalk";
import _map from "lodash/map.js";

import { DEFAULT_CONTENT, GHOSTFILE, TEMP_GHOSTFILE } from "./config.js";

import {ChangeHandler} from "./handleChange/index.js";
import { ChecksumEmitter } from "./checksum.js";

export async function main () {
	fs.writeFileSync(GHOSTFILE, DEFAULT_CONTENT);

	const watcher = new ChecksumEmitter(GHOSTFILE);
	function cleanup() {
		watcher.close();
		try {
			fs.unlinkSync(GHOSTFILE);
			fs.unlinkSync(TEMP_GHOSTFILE);
		} catch {}
	}

	process.on('SIGINT',  () => {
		console.log(chalk.bold(`[ SIGINT ]`))
		cleanup()
	});
	process.on('SIGTERM', () => {
		console.log(chalk.bold(`[ SIGTERM ]`))
		cleanup()
	});
	process.on('uncaughtException', (e) => {
		console.log(chalk.bold(`[ uncaughtException ]`), e)
		cleanup()
	});

	const mainChangeHandler = new ChangeHandler();
	// let mem = process.memoryUsage()
	watcher.on("checksumChanged", () => {
		// console.log(memChange(mem, process.memoryUsage()))
		// mem = process.memoryUsage()
		mainChangeHandler.handle(GHOSTFILE);
	});

	console.info(chalk.blue(`All set! edit ./${GHOSTFILE}`));
};

// function memChange(mem: NodeJS.MemoryUsage, newMem: NodeJS.MemoryUsage) {
// 	return _map(newMem, (v, k) => {
// 		const diff = v - mem[k as keyof NodeJS.MemoryUsage]
// 		return `${k}: ${percentDiff(v, diff)}`
// 	}).join('\n')
// }

// function percentDiff(a: number, b: number) {
// 	return `${(100 - (((a - b) / a) * 100)).toFixed(2)}%`
// }

main()