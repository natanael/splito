import fs from "fs";
import path from "path";
import chalk from "chalk";
import { NUKE } from "../../config.js";
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
			ensureFileSync(filename, chunk.content);
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

function ensureFileSync(filepath: string, content: string | Buffer) {
  const normalizedPath = path.normalize(filepath);
  const dirname = path.dirname(normalizedPath);

  try {
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    if (!fs.existsSync(normalizedPath)) {
      fs.writeFileSync(normalizedPath, content);
    }
  } catch (error) {
		console.error(chalk.red(chalk.bold(`COULD NOT ENSURE FILE ${filepath}`)), error);
		if (error instanceof Error) {
			throw new Error(`Failed to ensure the existence of file: ${filepath}\n${error.message}`);
		}
  }
}
