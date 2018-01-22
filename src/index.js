import fs from "fs-extra";
import * as glob from "glob";
import chalk from "chalk";
import { promisify } from "bluebird";
import chokidar from "chokidar";
import _map from "lodash/map";
import _size from "lodash/size";
import _reduce from "lodash/reduce";
import cp from "child_process";

const NUKE = "☢";

const NEW_LINE = "\n";

const DEFAULT_CONTENT = `
${NUKE} exec echo "do something"
`;

const printChunks = chunks => {
	return _reduce(
		chunks,
		(a, v, k) => {
			return (a += k + "\n" + v.join("\n") + "\n");
		},
		""
	);
};

const handleChange = (event, path) => {
	console.log(path);
	const content = fs.readFileSync(path).toString();
	const lines = content.split(NEW_LINE);
	let current_chunk;

	const chunks = _reduce(
		lines,
		(chunks, line) => {
			if (line.match(NUKE)) {
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

	const output = _reduce(
		chunks,
		(chunks, value, key) => {
			let valuable;

			valuable = key.match(`^${NUKE} (IGNORED|SUCCESS|FAILURE) (.*)`);
			if (_size(valuable)) {
				const [, state, cmd] = valuable;
				console.log(chalk.bold(state), cmd);
				chunks[`${NUKE} ${state} ${cmd}`] = value;
				return chunks;
			}

			valuable = key.match(`^${NUKE} exec (.*)`);
			if (_size(valuable)) {
				const [, cmd] = valuable;
				console.log(chalk.bold(cmd));
				try {
					const response = cp.execSync(cmd).toString();
					console.log(JSON.stringify(response));
					chunks[`${NUKE} SUCCESS ${cmd}`] = response.split(NEW_LINE);
				} catch (e) {
					console.error(
						chalk.red(chalk.bold(`Sry bruce! I failed you! :'(\n`)),
						e
					);
					chunks[`${NUKE} FAILURE ${cmd}`] = value;
				}
				return chunks;
			}

			valuable = key.match(`^${NUKE} file (.*)`);
			if (_size(valuable)) {
				let [, filename] = valuable;
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

			valuable = key.match(`^${NUKE} load (.*)`);
			if (_size(valuable)) {
				let [, wildcard] = valuable;
				wildcard = JSON.parse(wildcard);
				console.log(chalk.bold("load", wildcard));
				try {
					chunks[`${NUKE} SUCCESS load "${wildcard}"`] = _map(
						glob.sync(wildcard),
						filename => `${NUKE} pick "${filename}"`
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

			valuable = key.match(`^${NUKE} pick (.*)`);
			if (_size(valuable)) {
				let [, filename] = valuable;
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

			valuable = key.match(`^${NUKE} (.*)`);
			if (_size(valuable)) {
				const [, cmd] = valuable;
				console.log(chalk.bold("IGNORED"), cmd);
				chunks[`${NUKE} IGNORED "${cmd}"`] = value;
				return chunks;
			}
		},
		{}
	);

	console.log(chalk.grey("Finished"));
	fs.writeFileSync("./ghostfile.js", printChunks(output));
};

export default () => {
	fs.writeFileSync("./ghostfile.js", DEFAULT_CONTENT);

	const watcher = chokidar.watch("./ghostfile.js");

	watcher.on("all", handleChange);
};
