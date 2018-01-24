import { NUKE } from "../../config";
import _reduce from "lodash/reduce";
import _size from "lodash/size";

import IGNORE from "./ignore";
import EXECUTE from "./execute";
import FILE from "./file";
import LOAD from "./load";
import PICK from "./pick";
import DEFAULT from "./default";

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
