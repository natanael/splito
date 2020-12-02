import { WriteStream } from "fs-extra";

export interface Chunk {
	key: string;
	content: string;
}

export interface Parser {
	parseIfApplicable(chunk: Chunk, outputStream: WriteStream): boolean;
}