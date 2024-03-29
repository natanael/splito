import readline from 'readline';

import fs from "fs";
import chalk from "chalk";

import _map from "lodash/map.js";

import { NUKE, GHOSTFILE } from "../config.js";
import { Chunk } from "./parse/types.js";
import { parseChunk } from "./parse/index.js";

export class ChangeHandler {
	handling: boolean = false;

	constructor() {
		this.handling = false;
	}

	handle(path: string) {
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
			currentChunk.content += `${line}\n`;
		});

		readStream.on('end', () => {
			if (currentChunk != null) {
				parseChunk(currentChunk, writeStream);
			}
			console.log(chalk.grey(`Finished, updating ${GHOSTFILE}...`));
			writeStream.close();
			if (process.platform === 'win32') {
				fs.unlinkSync(path);
			}
			const overwriteStream = fs.createReadStream(tempPath);
			overwriteStream.pipe(fs.createWriteStream(path));
			overwriteStream.on('end', () => {
				try {
					fs.unlinkSync(tempPath);
				} catch {}
				this.handling = false;
				console.log(chalk.grey(`... done updating ${GHOSTFILE}`));
			})
		});
	}
}
