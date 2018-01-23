import { NUKE } from "../config";
import _reduce from "lodash/reduce";
import _size from "lodash/size";

export default {
	regex: `^${NUKE} load (.*)`,
	fn: (chunks, match, value, key) => {
		let [, wildcard] = match;
		wildcard = JSON.parse(wildcard);
		console.log(chalk.bold("load", wildcard));
		try {
			chunks[`${NUKE} SUCCESS load "${wildcard}"`] = _map(
				glob.sync(wildcard),
				filename => `\t${NUKE} pick "${filename}"`
			);
		} catch (e) {
			console.error(
				chalk.red(chalk.bold(`Sry bruce! I failed you! :'(\n`)),
				e
			);
			chunks[`${NUKE} FAILURE load ${glob}`] = value;
		}
		return chunks;
	}
}