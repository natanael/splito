import chalk from "chalk";
import { sync as globSync } from "glob";

import _map from "lodash/map.js";

import { NUKE } from "../../config.js";
import { Parser } from "./types";

export const LOAD: Parser = {
	parseIfApplicable(chunk, outputStream) {
		const match = chunk.key.match(`^${NUKE} load (.*)`);
		if (match == null) {
			return false;
		}

		let [, wildcard] = match;
		console.log(chalk.bold("load", wildcard));
		try {
			const result = _map(
				globSync(wildcard.replace(/^\"|"$/g, '')),
				filename => `\t${NUKE} open "${filename}"`
			).join("\n");
			outputStream.write(`${NUKE} SUCCESS load ${wildcard}\n${result}\n`);
		} catch (e) {
			console.error(chalk.red(chalk.bold(`FAILED TO PERFORM LOAD`)), e);
			outputStream.write(`${NUKE} FAILURE load ${wildcard}\n${chunk.content}`);
		}
		return true;
	}
};
