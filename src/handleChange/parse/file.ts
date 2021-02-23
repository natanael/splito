import fs from "fs-extra";
import chalk from "chalk";
import { NUKE, NEW_LINE } from "../../config";
import { Parser } from "./types";


export const FILE: Parser = {
	parseIfApplicable(chunk, outputStream) {
		const match = chunk.key.match(`^${NUKE} file "([^\"]+)"`);
		if (match == null) {
			return false;
		}
	
		const [, filename] = match;
		console.log(chalk.bold("FILE"), filename);
		
		try {
			fs.ensureFileSync(filename);
			const response = fs.writeFileSync(filename, chunk.content);
			console.log(JSON.stringify(response));
			outputStream.write(`${chunk.key}\n${chunk.content}\n`
				.replace(/\n/g, '‡')
				.replace(/‡+$/, '‡')
				.replace(/‡/g, '\n')
			);
		} catch (e) {
			outputStream.write(`${NUKE} FAILED file ${filename}\n`);
			console.error(chalk.red(chalk.bold(`COULD NOT WRITE TO FILE ${filename}`)),	e);
		}

		return true;
	}
};

