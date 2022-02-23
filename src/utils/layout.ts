import ts = require('typescript');

import { align, getTypeSizeInBytes, SupportedTypes } from './type';

export function calcLayout(properties: Array<ts.Symbol>, getType: (symbol: ts.Symbol) => ts.Type) {
  let offset = 0;
  let totalSize = 0;

  const offsetMap = new Map<string, { offset: number; size: number }>();
  properties.forEach(v => {
    const fieldName = v.escapedName as string;
    const type = getType(v);
    const typeName = type.aliasSymbol?.escapedName;
    const fieldSize = getTypeSizeInBytes(typeName as SupportedTypes);

    offsetMap.set(fieldName, { offset, size: fieldSize });

    offset += align(fieldSize, 4);
  });

  totalSize = align(offset, 4);

  return { layout: offsetMap, size: totalSize };
}
