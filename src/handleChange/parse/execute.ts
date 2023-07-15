import chalk from "chalk";
import cp from "child_process";
import { NUKE } from "../../config.js";
import { Parser } from "./types.js";

export const EXECUTE: Parser = {
	parseIfApplicable(chunk, outputStream) {
		const match = chunk.key.match(`^${NUKE} exec (.*)`);
		if (match == null) {
			return false;
		}

		const [, cmd] = match;
		console.log(chalk.bold("EXECUTE"), cmd);

		try {
			const response = cp.execSync(cmd).toString();
			outputStream.write(`${NUKE} SUCCESS exec ${cmd}\n${response}\n`);
		} catch (e) {
			console.error(chalk.red(chalk.bold(`EXECUTE statement failed: \n`)), e);
			if (e instanceof Error) {
				outputStream.write(`${NUKE} FAILURE exec ${cmd}\n${e.message}\n${e.stack}`);
			}
		}

		return true;
	}
};
