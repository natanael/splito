import fs from "fs-extra";
import chalk from "chalk";
import { NUKE, NEW_LINE } from "../../config";

export default {
	regex: `^${NUKE} file (.*)`,
	fn: (chunks, match, value, key) => {
		let [, filename] = match;
		filename = JSON.parse(filename);
		console.log(chalk.bold("file", filename));
		try {
			fs.ensureFileSync(filename);
			const response = fs.writeFileSync(
				filename,
				value.join(NEW_LINE)
			);
			console.log(JSON.stringify(response));
			chunks[`${NUKE} file "${filename}"`] = value;
		} catch (e) {
			console.error(
				chalk.red(chalk.bold(`Sry bruce! I failed you! :'(\n`)),
				e
			);
			chunks[`${NUKE} FAILURE file "${filename}"`] = value;
		}
		return chunks;
	}
};
