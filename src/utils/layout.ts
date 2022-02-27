import ts = require('typescript');

import { align, getTypeSizeInBytes, SupportedTypes } from './type';

function calcComplexTypeSize(properties: Array<ts.Symbol>, checker: ts.TypeChecker): number {
  let size = 0;

  properties.forEach(v => {
    // TODO: check when symbol.valueDeclaration can be undefined
    const type = checker.getTypeOfSymbolAtLocation(v, v.valueDeclaration!);
    const typeName = type.aliasSymbol?.escapedName;

    if (type.flags & ts.TypeFlags.Object) {
      const properties = checker.getPropertiesOfType(type);

      size += calcComplexTypeSize(properties, checker);
    } else {
      size += getTypeSizeInBytes(typeName as SupportedTypes);
    }
  });

  return size;
}

export function calcLayout(properties: Array<ts.Symbol>, checker: ts.TypeChecker) {
  let offset = 0;
  let totalSize = 0;

  const offsetMap = new Map<string, { offset: number; size: number }>();
  properties.forEach(v => {
    const fieldName = v.escapedName as string;
    // TODO: check when symbol.valueDeclaration can be undefined
    const type = checker.getTypeOfSymbolAtLocation(v, v.valueDeclaration!);
    const typeName = type.aliasSymbol?.escapedName;
    let fieldSize = -1;

    if (type.flags & ts.TypeFlags.Object) {
      const properties = checker.getPropertiesOfType(type);

      fieldSize = calcComplexTypeSize(properties, checker);
    } else {
      fieldSize = getTypeSizeInBytes(typeName as SupportedTypes);
    }

    offsetMap.set(fieldName, { offset, size: fieldSize });

    offset += align(fieldSize, 4);
  });

  totalSize = align(offset, 4);

  return { layout: offsetMap, size: totalSize };
}
