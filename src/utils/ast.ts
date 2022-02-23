import ts = require('typescript');

export function getInterfaceOrTypeAliesName(type: ts.ObjectType): string {
  return (type.objectFlags & ts.ObjectFlags.Interface ? type.symbol.escapedName : (type.aliasSymbol?.escapedName ?? type.symbol.escapedName)) as string;
}

export function isExpressionNumbericLiteral(exp: ts.Expression): exp is ts.NumericLiteral {
  return ts.isNumericLiteral(exp);
}

export function getNumberFromNumericLiteral(exp: ts.NumericLiteral): number {
  return Number(exp.text);
}
