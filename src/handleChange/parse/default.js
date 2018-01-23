import { NUKE } from "../config";

export default {
	regex: `^${NUKE} (.*)`,
	fn: (chunks, match, value, key) => {
		const [, cmd] = match;
		console.log(chalk.bold("IGNORED"), cmd);
		chunks[`${NUKE} IGNORED "${cmd}"`] = value;
		return chunks;
	}
};
