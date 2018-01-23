import fs from "fs-extra";
import * as glob from "glob";
import chalk from "chalk";
import cp from "child_process";
import nodeCleanup from "node-cleanup";

import _map from "lodash/map";
import _size from "lodash/size";
import _reduce from "lodash/reduce";

import printChunks from "./util/printChunks.js";
import { NUKE, NEW_LINE } from "./config";
import { setTimeout } from "core-js/library/web/timers";

import parse from "./process";

const handleChange = (event, path) => {
	const content = fs.readFileSync(path).toString();
	if (!_size(content)) {
		console.log("Nothing found, will try again in 300ms");
		return setTimeout(() => handleChange(event, path), 300);
	}

	const lines = content.split(NEW_LINE);
	console.log("handleChange", path, _size(lines));
	if (_size(lines) < 2) {
		console.log("content", content);
		console.log("lines", lines);
	}
	let current_chunk;

	const chunks = _reduce(
		lines,
		(chunks, line) => {
			if (line.match(`^${NUKE}`)) {
				chunks[line] = [];
				current_chunk = line;
				return chunks;
			}
			if (current_chunk) {
				chunks[current_chunk].push(line);
			}
			return chunks;
		},
		{}
	);

	const output = parse(chunks);

	console.log(chalk.grey("Finished"));
	fs.writeFileSync(
		"./ghostfile.js",
		printChunks(output).replace(/[\n]+$/g, "\n")
	);
};

export default handleChange;
