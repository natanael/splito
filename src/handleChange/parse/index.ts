import { NUKE } from "../../config";
import _reduce from "lodash/reduce";
import _size from "lodash/size";

import {IGNORE} from "./ignore";
import {EXECUTE} from "./execute";
import {FILE} from "./file";
import {LOAD} from "./load";
import {OPEN} from "./open";
import {DEFAULT} from "./default";

import { WriteStream } from "fs-extra";
import { Chunk } from "./types";


export function parseChunk(chunk: Chunk, output: WriteStream) {
	if (IGNORE.parseIfApplicable(chunk, output)) { return; }
	
	if (EXECUTE.parseIfApplicable(chunk, output)) { return; }
	
	if (FILE.parseIfApplicable(chunk, output)) { return; }
	
	if (LOAD.parseIfApplicable(chunk, output)) { return; }
	
	if (OPEN.parseIfApplicable(chunk, output)) { return; }
	
	if (DEFAULT.parseIfApplicable(chunk, output)) { return; }
}