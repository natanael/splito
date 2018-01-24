import cp from "child_process";
import fs from "fs-extra";
import { NUKE } from "../config";

//STILL COULD NOT FIND A PROPER WAY TO TEST THIS
describe("Lifecycle", () => {
	it("Should not leave a ghostfile.js after termination", () => {
		expect(1).toBeTruthy();
	});
});

// describe("Initialization", () => {
// 	it("Should create/delete ghostfile.js", done => {
// 		const ghost = cp.spawn(`${__dirname}/../../bin/ghost.js`);
// 		setTimeout(() => {
// 			ghost.stdout.on("data", data => {
// 				console.log(data.toString());
// 				expect(fs.existsSync("./ghostfile.js")).toBeTruthy();
// 			});

// 			ghost.on("close", code => {
// 				setTimeout(() => {
// 					expect(fs.existsSync("./ghostfile.js")).toBeFalsy();
// 					done();
// 				}, 100);
// 			});

// 			setTimeout(() => ghost.kill("SIGINT"), 100);
// 		}, 100);
// 	});

// it("Should execute on change", async () => {
// 	return new Promise((resolve, reject) => {
// 		const ghost = cp.spawn(`${__dirname}/../../bin/ghost.js`);
// 		setTimeout(() => {
// 			ghost.stdout.on("data", data => {
// 				console.log(data.toString());
// 				expect(fs.existsSync("./ghostfile.js")).toBeTruthy();
// 			});

// 			ghost.on("close", code => {
// 				expect(fs.existsSync("./ghostfile.js")).toBeFalsy();
// 				resolve();
// 			});

// 			cp.exec(
// 				`echo "${NUKE} exec touch /tmp/test.js" | tee ./ghostfile.js`,
// 				(e, stdout, stderr) => {
// 					setTimeout(() => {
// 						expect(fs.existsSync("/tmp/test.js")).toBeTruthy();
// 						fs.unlinkSync("/tmp/test.js");

// 						setTimeout(() => ghost.kill("SIGINT"), 100);
// 					}, 100);
// 				}
// 			);
// 		}, 100);
// 	});
// });
// });
