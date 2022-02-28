import ts = require('typescript');

import {
  createEffectAddress,
  createReadBy1Byte, createReadBy2Byte, createReadBy4Byte,
  createWriteBy1Byte, createWriteBy2Byte, createWriteBy4Byte,
} from './utils/factory';
import { calcLayout } from './utils/layout';
import { getInterfaceOrTypeAliesName } from './utils/ast';

export function createTransformer (program: ts.Program) {
  const checker = program.getTypeChecker();

  return function binaryTransformer(context: ts.TransformationContext) {
    function visit(node: ts.Node) {
      node = ts.visitEachChild(node, visit, context);

      if (ts.isCallExpression(node)) {
        const calledFunctionName = (node.expression as ts.Identifier).escapedText;

        if (calledFunctionName === 'sizeof') {
          const typeArguments = node.typeArguments;

          const type = checker.getTypeAtLocation(typeArguments![0]!);
          const properties = checker.getPropertiesOfType(type);

          const structName = getInterfaceOrTypeAliesName(type as ts.ObjectType);

          console.log('Struct name', structName, properties);

          const { size } = calcLayout(properties, checker);

          console.log('total size', size);

          return ts.factory.createNumericLiteral(size);
        }

        if (calledFunctionName === 'readValue') {
          const typeArguments = node.typeArguments!;
          const structType = typeArguments[0]!;

          const funcArguments = node.arguments;
          const buffer = funcArguments[0]!;
          const address = funcArguments[1]!;
          const element = funcArguments.length === 4 ? funcArguments[2]! : ts.factory.createNumericLiteral(0);
          const field = funcArguments.length === 4 ? funcArguments[3]! : funcArguments[2]!;

          const type = checker.getTypeAtLocation(structType);
          const structName = getInterfaceOrTypeAliesName(type as ts.ObjectType);

          console.log('readValue Struct name', structName);

          const properties = checker.getPropertiesOfType(type);

          const { layout, size } = calcLayout(properties, checker);

          const fieldName = (field as ts.StringLiteral).text;
          const fieldData = layout.get(fieldName);

          if (!fieldData) {
            console.warn(`field ${fieldName} doesnt exist in sctruct ${structName}`);
            return node;
          }

          const bufferType = checker.getTypeAtLocation(buffer);
          const bufferTypeName = bufferType.symbol.escapedName;

          console.log('bufferTypeName', bufferTypeName);

          let transformedNode: ts.Node | undefined;

          if (bufferTypeName === 'Int8Array' || bufferTypeName === 'Uint8Array') {
            transformedNode = createReadBy1Byte(buffer, address, element, size, fieldData);
          } else if (bufferTypeName === 'Int16Array' || bufferTypeName === 'Uint16Array') {
            transformedNode = createReadBy2Byte(buffer, address, element, size, fieldData);
          } else if (bufferTypeName === 'Int32Array' || bufferTypeName === 'Uint32Array') {
            transformedNode = createReadBy4Byte(buffer, address, element, size, fieldData);
          } else if (bufferTypeName === 'Float32Array') {
            transformedNode = createReadBy4Byte(buffer, address, element, size, fieldData);
          } else {
            console.warn(`Unknow buffer type ${bufferType}. Return original node`);
            return node;
          }

          if (!transformedNode) {
            console.warn(`Unable to transform node for ${fieldName} in sctruct ${structName} with buffer type ${bufferTypeName}. Return original node`);
            return node;
          }

          return transformedNode;
        }

        if (calledFunctionName === 'writeValue') {
          const typeArguments = node.typeArguments!;
          const structType = typeArguments[0]!;

          const funcArguments = node.arguments;
          const buffer = funcArguments[0]!;
          const address = funcArguments[1]!;
          const element = funcArguments.length === 5 ? funcArguments[2]! : ts.factory.createNumericLiteral(0);
          const field = funcArguments.length === 5 ? funcArguments[3]! : funcArguments[2]!;
          const value = funcArguments.length === 5 ? node.arguments[4]! : node.arguments[3]!;

          const type = checker.getTypeAtLocation(structType);
          const structName = getInterfaceOrTypeAliesName(type as ts.ObjectType);

          console.log('writeValue Struct name', structName);

          const properties = checker.getPropertiesOfType(type);

          const { layout, size } = calcLayout(properties, checker);

          const fieldName = (field as ts.StringLiteral)?.text;
          const fieldData = layout.get(fieldName);

          if (!fieldData) {
            console.warn(`field ${fieldName} doesnt exist in sctruct ${structName}`);
            return node;
          }

          const bufferType = checker.getTypeAtLocation(buffer);
          const bufferTypeName = bufferType.symbol.escapedName;

          let transformedNode: ts.Node | undefined;

          if (bufferTypeName === 'Int8Array' || bufferTypeName === 'Uint8Array') {
            transformedNode = createWriteBy1Byte(buffer, address, element, size, fieldData, value);
          } else if (bufferTypeName === 'Int16Array' || bufferTypeName === 'Uint16Array') {
            transformedNode = createWriteBy2Byte(buffer, address, element, size, fieldData, value);
          } else if (bufferTypeName === 'Int32Array' || bufferTypeName === 'Uint32Array') {
            transformedNode = createWriteBy4Byte(buffer, address, element, size, fieldData, value);
          } else if (bufferTypeName === 'Float32Array') {
            transformedNode = createWriteBy4Byte(buffer, address, element, size, fieldData, value);
          } else {
            console.warn(`Unknow buffer type ${bufferType}. Return original node`);
            return node;
          }

          console.log('transformedNode', transformedNode);


          if (!transformedNode) {
            console.warn(`Unable to transform node for ${fieldName} in sctruct ${structName} with buffer type ${bufferTypeName}. Return original node`);
            return node;
          }

          return transformedNode;
        }

        if (calledFunctionName === 'loadEffectiveAddress') {
          const typeArguments = node.typeArguments!;
          const funcArguments = node.arguments;
          const structType = typeArguments[0]!;

          const type = checker.getTypeAtLocation(structType);
          const structName = getInterfaceOrTypeAliesName(type as ts.ObjectType);

          console.log('readValueStruct Struct name', structName);

          const properties = checker.getPropertiesOfType(type);

          const { layout, size } = calcLayout(properties, checker);

          const address = funcArguments[0]!;
          const element = funcArguments.length === 3 ? funcArguments[1]! : ts.factory.createNumericLiteral(0);
          const field = funcArguments.length === 3 ? funcArguments[2]! : funcArguments[1]!;

          const fieldName = (field as ts.StringLiteral).text;
          const fieldData = layout.get(fieldName);

          if (!fieldData) {
            console.warn(`field ${fieldName} doesn't exist in sctruct ${structName}`);
            return node;
          }

          return createEffectAddress(address, element, size, fieldData.offset);
        }
      }

      return node;
    }

    return (node: ts.Node) => ts.visitNode(node, visit);
  };
}
