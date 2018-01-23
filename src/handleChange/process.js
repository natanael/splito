import { NUKE } from "../config";
import _reduce from "lodash/reduce";
import _size from "lodash/size";

export const IGNORE = {
	regex: `^${NUKE} (IGNORED|SUCCESS|FAILURE) (.*)`,
	fn: (chunks, match, value, key) => {
		const [, state, cmd] = match;
		console.log(chalk.bold(state), cmd);
		chunks[`${NUKE} ${state} ${cmd}`] = value;
		return chunks;
	}
};

export const EXECUTE = {
	regex: `^${NUKE} exec (.*)`,
	fn: (chunks, match, value, key) => {
		const [, cmd] = match;
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
};

export const FILE = {
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

export const LOAD = {
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
};

export const PICK = {
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

export const DEFAULT = {
	regex: `^${NUKE} (.*)`,
	fn: (chunks, match, value, key) => {
		const [, cmd] = match;
		console.log(chalk.bold("IGNORED"), cmd);
		chunks[`${NUKE} IGNORED "${cmd}"`] = value;
		return chunks;
	}
};

export default chunks => {
	return _reduce(
		chunks,
		(chunks, value, key) => {
			let match;

			match = key.match(IGNORE.regex);
			if (_size(match)) {
				return IGNORE.fn(chunks, match, value, key);
			}

			match = key.match(EXECUTE.regex);
			if (_size(match)) {
				return EXECUTE.fn(chunks, match, value, key);
			}

			match = key.match(FILE.regex);
			if (_size(match)) {
				return FILE.fn(chunks, match, value, key);
			}

			match = key.match(LOAD.regex);
			if (_size(match)) {
				return LOAD.fn(chunks, match, value, key);
			}

			match = key.match(PICK.regex);
			if (_size(match)) {
				return PICK.fn(chunks, match, value, key);
			}

			match = key.match(DEFAULT.regex);
			if (_size(match)) {
				return DEFAULT.fn(chunks, match, value, key);
			}

			return chunks;
		},
		{}
	);
};
