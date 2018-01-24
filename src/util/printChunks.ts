import _reduce from "lodash/reduce";

const printChunks = chunks => {
	return _reduce(
		chunks,
		(a, v, k) => {
			return (a += k + "\n" + v.join("\n") + "\n");
		},
		""
	);
};

export default printChunks;
