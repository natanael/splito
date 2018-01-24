import chalk from "chalk";
import cp from "child_process";
import { NUKE, NEW_LINE } from "../../config";

export default {
	regex: `^${NUKE} exec (.*)`,
	fn: (chunks, match, value, key) => {
		const [, cmd] = match;
		console.log(chalk.bold(cmd));
		try {
			const response = cp.execSync(cmd).toString();
			console.log(JSON.stringify(response));
			chunks[`${NUKE} SUCCESS ${cmd}`] = response.split(NEW_LINE);
		} catch (e) {
			console.error(
				chalk.red(chalk.bold(`Sry bruce! I failed you! :'(\n`)),
				e
			);
			chunks[`${NUKE} FAILURE ${cmd}`] = value;
		}
		return chunks;
	}
};
