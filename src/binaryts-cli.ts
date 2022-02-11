import ts = require('typescript');
import fs = require('fs');

import { createTransformer } from './transformer';

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

const sourceFile = program.getSourceFile(fileNames[0]!);

if (sourceFile) {
  const result = ts.transform(sourceFile, [createTransformer(program)]);

  const transformedFile = printer.printFile(result.transformed[0] as ts.SourceFile);
  console.log('------');
  console.log('------');
  console.log(transformedFile);
  fs.writeFile(`./${fileName}_transformed.ts`, transformedFile, function (err: Error | null) {
    if (err) {
      console.log('error write to file', err);
    }
  });
} else {
  console.log('sourceFile is undefined');
}
