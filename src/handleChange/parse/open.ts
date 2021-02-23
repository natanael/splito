import fs from "fs-extra";
import chalk from "chalk";
import { NUKE } from "../../config";
import { Parser } from "./types";

export const OPEN: Parser = {
	parseIfApplicable(chunk, outputStream) {
		const match = chunk.key.match(`^${NUKE} open (.*)`);
		if (match == null) {
			return false;
		}
		
		let [, filename] = match;
		filename = JSON.parse(filename);
		console.log(chalk.bold("open", filename));
		try {
			outputStream.write(`\n${NUKE} file "${filename}"\n${fs.readFileSync(filename).toString()}`)
		} catch (e) {
			console.error(chalk.red(chalk.bold(`FAILED TO LOAD FILE`)), e);
		}
		return true;
	}
};

