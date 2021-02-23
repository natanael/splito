import readline from 'readline';

import fs from "fs";
import chalk from "chalk";

import _map from "lodash/map";
import _size from "lodash/size";
import _reduce from "lodash/reduce";

import { NUKE, NEW_LINE, GHOSTFILE } from "../config";
import { Chunk } from "./parse/types.js";
import { parseChunk } from "./parse";

export class ChangeHandler {
	thatWasUs: boolean = false;
	handling: boolean = false;
	mtimeMs: number = 0;

	constructor() {
		this.handling = false;
	}

	handle(path: string, stats: fs.Stats) {
		// if (this.thatWasUs) {
		// 	console.log(chalk.grey("last change was ours, ignoring.."));
		// 	this.thatWasUs = false;
		// 	return;
		// }
		// if (stats.size == 0) {
		// 	console.log(chalk.grey("got an empty file, false change, fs hiccup, ignoring.."));
		// 	return;
		// }
		if (stats.mtimeMs === this.mtimeMs) {
			console.log(chalk.grey("same modification time, false change, ignoring.."));
			return;
		}
		console.info(chalk.blue(`${GHOSTFILE} CHANGED, PROCESSING...`));
		if (this.handling) {
			console.warn(chalk.bold(chalk.yellowBright("IGNORED CHANGE, STILL PROCESSING PREVIOUS EVENT")))
			return;
		}
		this.handling = true;
		const readStream = fs.createReadStream(path);
		const tempPath = `${path}.tmp`;
		const writeStream = fs.createWriteStream(tempPath);
		
		const lineRead = readline.createInterface({ input: readStream });
		
		let currentChunk: Chunk | null = null;
		lineRead.on('line', line => {
			if (line.match(`^${NUKE}`)) {
				if (currentChunk != null) {
					parseChunk(currentChunk, writeStream);
				}
				currentChunk = {
					key: line,
					content: ''
				};
				return;
			}
			if (currentChunk == null) {
				currentChunk = {
					key: `${NUKE} IGNORED no statement`,
					content: ''
				};
			}
			currentChunk.content += `${line}${NEW_LINE}`;
		});
		
		readStream.on('end', () => {
			if (currentChunk != null) {
				parseChunk(currentChunk, writeStream);
			}
			console.log(chalk.grey(`Finished, updating ${GHOSTFILE}...`));
			// fs.renameSync(tempPath, path);
			writeStream.close();
			const overwriteStream = fs.createReadStream(tempPath);
			overwriteStream.pipe(fs.createWriteStream(path));
			overwriteStream.on('end', () => {
				try {
					fs.unlinkSync(tempPath);
				} catch {}
				this.handling = false;
				// Capture system's mTimeMs
				this.mtimeMs = fs.statSync(path).mtimeMs;
				// this.thatWasUs = true;
				console.log(chalk.grey(`... done updating ${GHOSTFILE}`));
			})
		});
	}
}
