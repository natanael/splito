import fs from "fs-extra";
import * as glob from "glob";
import chalk from "chalk";
import { promisify } from "bluebird";
import chokidar from "chokidar";
import _map from "lodash/map";
import _size from "lodash/size";
import _reduce from "lodash/reduce";
import cp from "child_process";
import nodeCleanup from "node-cleanup";

import { DEFAULT_CONTENT } from "./config";

import handleChange from "./handleChange";

export default () => {
	fs.writeFileSync("./ghostfile.js", DEFAULT_CONTENT);

	const watcher = chokidar.watch("./ghostfile.js");

	watcher.on("all", handleChange);

	nodeCleanup((exitCode, signal) => {
		console.log(chalk.bold(`[ Cleaning up ]`));
		fs.unlink("./ghostfile.js");
	});
};
