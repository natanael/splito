import chalk from "chalk";
import { NUKE, NEW_LINE } from "../../config";

export default {
	regex: `^${NUKE} pick (.*)`,
	fn: (chunks, match, value, key) => {
		let [, filename] = match;
		filename = JSON.parse(filename);
		console.log(chalk.bold("pick", filename));
		try {
			chunks[`${NUKE} file "${filename}"`] = fs
				.readFileSync(filename)
				.toString()
				.split(NEW_LINE);
		} catch (e) {
			console.error(
				chalk.red(chalk.bold(`Sry bruce! I failed you! :'(\n`)),
				e
			);
			chunks[`${NUKE} FAILURE pick "${filename}"`] = value;
		}
		return chunks;
	}
};
