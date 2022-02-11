"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const fs = require("fs");
const transformer_1 = require("./transformer");
const options = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.CommonJS
};
const fileName = process.argv.length > 2 ? process.argv[2] : undefined;
if (!fileName) {
    console.log('pass path to file');
    process.exit(0);
}
const fileNames = [fileName];
const program = ts.createProgram(fileNames, options);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const sourceFile = program.getSourceFile(fileNames[0]);
if (sourceFile) {
    const result = ts.transform(sourceFile, [(0, transformer_1.createTransformer)(program)]);
    const transformedFile = printer.printFile(result.transformed[0]);
    console.log('------');
    console.log('------');
    console.log(transformedFile);
    fs.writeFile(`./${fileName}_transformed.ts`, transformedFile, function (err) {
        if (err) {
            console.log('error write to file', err);
        }
    });
}
else {
    console.log('sourceFile is undefined');
}
