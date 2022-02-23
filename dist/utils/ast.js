"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberFromNumericLiteral = exports.isExpressionNumbericLiteral = exports.getInterfaceOrTypeAliesName = void 0;
const ts = require("typescript");
function getInterfaceOrTypeAliesName(type) {
    var _a, _b;
    return (type.objectFlags & ts.ObjectFlags.Interface ? type.symbol.escapedName : ((_b = (_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.escapedName) !== null && _b !== void 0 ? _b : type.symbol.escapedName));
}
exports.getInterfaceOrTypeAliesName = getInterfaceOrTypeAliesName;
function isExpressionNumbericLiteral(exp) {
    return ts.isNumericLiteral(exp);
}
exports.isExpressionNumbericLiteral = isExpressionNumbericLiteral;
function getNumberFromNumericLiteral(exp) {
    return Number(exp.text);
}
exports.getNumberFromNumericLiteral = getNumberFromNumericLiteral;
