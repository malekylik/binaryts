import ts = require('typescript');

import {
  SupportedTypes, align,
  getTypeSizeInBytes
} from './utils/type';
import {
  createReadBy1Byte, createReadBy2Byte, createReadBy4Byte,
  createWriteBy1Byte, createWriteBy2Byte, createWriteBy4Byte
} from './utils/factory';

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

          const structName = (type as ts.ObjectType).objectFlags & ts.ObjectFlags.Interface ? type.symbol.escapedName : (type.aliasSymbol?.escapedName ?? type.symbol.escapedName);

          console.log('Struct name', structName, type);

          let offset = 0;
          let totalSize = 0;

          properties.forEach(v => {
            const fieldName = v.escapedName;
            const type = checker.getTypeOfSymbolAtLocation(v, v.valueDeclaration!);
            const typeName = type.aliasSymbol?.escapedName;
            const fieldSize = getTypeSizeInBytes(typeName as SupportedTypes);

            console.log(`${fieldName}: ${typeName} - start at ${offset} size ${fieldSize} bytes`);
            offset += align(fieldSize, 4);
          });

          totalSize = align(offset, 4);

          console.log('total size', totalSize);

          return ts.factory.createNumericLiteral(totalSize);
        }

        if (calledFunctionName === 'readValue') {
          const typeArguments = node.typeArguments!;

          const type = checker.getTypeAtLocation(typeArguments[0]!);

          const structName = (type as ts.ObjectType).objectFlags & ts.ObjectFlags.Interface ? type.symbol.escapedName : (type.aliasSymbol?.escapedName ?? type.symbol.escapedName);

          console.log('readValue Struct name', structName);

          let offset = 0;
          let totalSize = 0;

          const properties = checker.getPropertiesOfType(type);

          const offsetMap = new Map();
          properties.forEach(v => {
            const fieldName = v.escapedName;
            const type = checker.getTypeOfSymbolAtLocation(v, v.valueDeclaration!);
            const typeName = type.aliasSymbol?.escapedName;
            const fieldSize = getTypeSizeInBytes(typeName as SupportedTypes);

            offsetMap.set(fieldName, { offset, size: fieldSize });

            offset += align(fieldSize, 4);
          });

          totalSize = align(offset, 4);

          const fieldName = (node.arguments[2] as ts.StringLiteral).text;

          if (!offsetMap.has(fieldName)) {
            console.warn(`field ${fieldName} doesnt exist in sctruct ${structName}`);
            return node;
          }

          const fieldData = offsetMap.get(fieldName);
          const bufferType = checker.getTypeAtLocation(node.arguments[0]!);
          const bufferTypeName = bufferType.symbol.escapedName;

          console.log('bufferTypeName', bufferTypeName);

          if (bufferTypeName === 'Int8Array' || bufferTypeName === 'Uint8Array') {
            const transformedNode = createReadBy1Byte(node.arguments[0]!, node.arguments[1]!, totalSize, fieldData);

            if (!transformedNode) {
              console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
              return node;
            }

            return transformedNode;
          } if (bufferTypeName === 'Int16Array' || bufferTypeName === 'Uint16Array') {
            const transformedNode = createReadBy2Byte(node.arguments[0]!, node.arguments[1]!, totalSize, fieldData);

            if (!transformedNode) {
              console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
              return node;
            }

            return transformedNode;
          } if (bufferTypeName === 'Int32Array' || bufferTypeName === 'Uint32Array') {
            const transformedNode = createReadBy4Byte(node.arguments[0]!, node.arguments[1]!, totalSize, fieldData);

            if (!transformedNode) {
              console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
              return node;
            }

            return transformedNode;
          } if (bufferTypeName === 'Float32Array') {
            const transformedNode = createReadBy4Byte(node.arguments[0]!, node.arguments[1]!, totalSize, fieldData);

            if (!transformedNode) {
              console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
              return node;
            }

            return transformedNode;
          } else {
            return node;
          }
        }

        if (calledFunctionName === 'writeValue') {
          const typeArguments = node.typeArguments!;
          const type = checker.getTypeAtLocation(typeArguments[0]!);
          const structName = (type as ts.ObjectType).objectFlags & ts.ObjectFlags.Interface ? type.symbol.escapedName : (type.aliasSymbol?.escapedName ?? type.symbol.escapedName);

          console.log('writeValue Struct name', structName);

          let offset = 0;
          let totalSize = 0;

          const properties = checker.getPropertiesOfType(type);

          const offsetMap = new Map();
          properties.forEach(v => {
            const fieldName = v.escapedName;
            const type = checker.getTypeOfSymbolAtLocation(v, v.valueDeclaration!);
            const typeName = type.aliasSymbol?.escapedName;
            const fieldSize = getTypeSizeInBytes(typeName as SupportedTypes);

            offsetMap.set(fieldName, { offset, size: fieldSize });

            offset += align(fieldSize, 4);
          });

          totalSize = align(offset, 4);

          const fieldName = (node.arguments[2] as ts.StringLiteral)?.text;

          if (!offsetMap.has(fieldName)) {
            console.warn(`field ${fieldName} doesnt exist in sctruct ${structName}`);
            return node;
          }

          const fieldData = offsetMap.get(fieldName);
          const bufferType = checker.getTypeAtLocation(node.arguments[0]!);
          const bufferTypeName = bufferType.symbol.escapedName;

          if (bufferTypeName === 'Int8Array' || bufferTypeName === 'Uint8Array') {
            const transformedNode = createWriteBy1Byte(node.arguments[0]!, node.arguments[1]!, totalSize, fieldData, node.arguments[3]!);

            if (!transformedNode) {
              console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
              return node;
            }

            return transformedNode;
          } if (bufferTypeName === 'Int16Array' || bufferTypeName === 'Uint16Array') {
            const transformedNode = createWriteBy2Byte(node.arguments[0]!, node.arguments[1]!, totalSize, fieldData, node.arguments[3]!);

            if (!transformedNode) {
              console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
              return node;
            }

            return transformedNode;
          } if (bufferTypeName === 'Int32Array' || bufferTypeName === 'Uint32Array') {
            const transformedNode = createWriteBy4Byte(node.arguments[0]!, node.arguments[1]!, totalSize, fieldData, node.arguments[3]!);

            if (!transformedNode) {
              console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
              return node;
            }

            return transformedNode;
          } if (bufferTypeName === 'Float32Array') {
            const transformedNode = createWriteBy4Byte(node.arguments[0]!, node.arguments[1]!, totalSize, fieldData, node.arguments[3]!);

            if (!transformedNode) {
              console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
              return node;
            }

            return transformedNode;
          } else {
            return node;
          }
        }
      }

      return node;
    }

    return (node: ts.Node) => ts.visitNode(node, visit);
  };
}
