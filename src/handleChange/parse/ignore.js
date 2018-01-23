import { NUKE } from "../config";
import _reduce from "lodash/reduce";
import _size from "lodash/size";

export default {
	regex: `^${NUKE} (IGNORED|SUCCESS|FAILURE) (.*)`,
	fn: (chunks, match, value, key) => {
		const [, state, cmd] = match;
		console.log(chalk.bold(state), cmd);
		chunks[`${NUKE} ${state} ${cmd}`] = value;
		return chunks;
	}
};
