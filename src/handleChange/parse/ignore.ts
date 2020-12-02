import chalk from "chalk";
import { NUKE } from "../../config";
import { Parser } from "./types";

export const IGNORE: Parser = {
	parseIfApplicable(chunk, outputStream) {
		const match = chunk.key.match(`^${NUKE} (IGNORED|SUCCESS|FAILURE) (.*)`);
		if (match == null) {
			return false;
		}

		outputStream.write(`${chunk.key}\n`);
		outputStream.write(chunk.content);
		
		return true;
	}
};
