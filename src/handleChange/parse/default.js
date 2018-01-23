import { NUKE } from "../config";
import _reduce from "lodash/reduce";
import _size from "lodash/size";

export default {
	regex: `^${NUKE} (.*)`,
	fn: (chunks, match, value, key) => {
		const [, cmd] = match;
		console.log(chalk.bold("IGNORED"), cmd);
		chunks[`${NUKE} IGNORED "${cmd}"`] = value;
		return chunks;
	}
}
