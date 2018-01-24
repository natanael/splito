import chalk from "chalk";
import { NUKE } from "../../config";

export default {
	regex: `^${NUKE} (IGNORED|SUCCESS|FAILURE) (.*)`,
	fn: (chunks, match, value, key) => {
		const [, state, cmd] = match;
		console.log(chalk.bold(state), cmd);
		chunks[`${NUKE} ${state} ${cmd}`] = value;
		return chunks;
	}
};
