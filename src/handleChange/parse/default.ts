import chalk from "chalk";
import { NUKE } from "../../config.js";
import { Parser } from "./types";

export const DEFAULT: Parser = {
	parseIfApplicable(chunk, outputStream) {
		const match = chunk.key.match(`^${NUKE} (.*)`);
		if (match == null) {
			return false;
		}

		const [, cmd] = match;
		console.log(chalk.bold("IGNORED"), cmd);

		outputStream.write(`${NUKE} IGNORED "${cmd}"\n`);
		outputStream.write(chunk.content);

		return true;
	}
};
