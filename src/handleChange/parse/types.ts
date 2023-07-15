import { WriteStream } from "fs";

export interface Chunk {
	key: string;
	content: string;
}

export interface Parser {
	parseIfApplicable(chunk: Chunk, outputStream: WriteStream): boolean;
}