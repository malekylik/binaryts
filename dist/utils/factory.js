"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEffectAddress = exports.createWriteBy4Byte = exports.createWriteBy2Byte = exports.createWriteBy1Byte = exports.createReadBy4Byte = exports.createReadBy2Byte = exports.createReadBy1Byte = exports.createCommanNode = exports.createLogicalAnd = exports.createLeftShiftedExpression = exports.createRightShiftedExpression = exports.createBufferAccess = void 0;
const ts = require("typescript");
const ast_1 = require("./ast");
function createBufferAccess(buffer, address, readSize) {
    const shiftBy = Math.log2(readSize);
    if (shiftBy === 0) {
        return ts.factory.createElementAccessExpression(buffer, address);
    }
    if ((0, ast_1.isExpressionNumbericLiteral)(address)) {
        return ts.factory.createElementAccessExpression(buffer, ts.factory.createNumericLiteral((0, ast_1.getNumberFromNumericLiteral)(address) >>> shiftBy));
    }
    return ts.factory.createElementAccessExpression(buffer, createRightShiftedExpression(ts.factory.createParenthesizedExpression(address), ts.factory.createNumericLiteral(shiftBy)));
}
exports.createBufferAccess = createBufferAccess;
function createRightShiftedExpression(expToShift, shiftExp) {
    return ts.factory.createBinaryExpression(expToShift, ts.factory.createToken(ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken), shiftExp);
}
exports.createRightShiftedExpression = createRightShiftedExpression;
function createLeftShiftedExpression(expToShift, shiftExp) {
    return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(expToShift, ts.factory.createToken(ts.SyntaxKind.LessThanLessThanToken), shiftExp));
}
exports.createLeftShiftedExpression = createLeftShiftedExpression;
function createLogicalAnd(expToAnd, andExp) {
    return ts.factory.createBinaryExpression(expToAnd, ts.factory.createToken(ts.SyntaxKind.AmpersandToken), andExp);
}
exports.createLogicalAnd = createLogicalAnd;
function createCommanNode(firstExp, secondExp) {
    return ts.factory.createBinaryExpression(firstExp, ts.factory.createToken(ts.SyntaxKind.CommaToken), secondExp);
}
exports.createCommanNode = createCommanNode;
function createReadBy1Byte(buffer, address, element, structSize, fieldData) {
    if (fieldData.size === 1) {
        return createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1);
    }
    else if (fieldData.size === 2) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createLeftShiftedExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 1), 1), ts.factory.createNumericLiteral(8)), ts.factory.createToken(ts.SyntaxKind.BarToken), createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1)));
    }
    else if (fieldData.size === 4) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createLeftShiftedExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 3), 1), ts.factory.createNumericLiteral(24)), ts.factory.createToken(ts.SyntaxKind.BarToken), ts.factory.createBinaryExpression(createLeftShiftedExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 2), 1), ts.factory.createNumericLiteral(16)), ts.factory.createToken(ts.SyntaxKind.BarToken), ts.factory.createBinaryExpression(createLeftShiftedExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 1), 1), ts.factory.createNumericLiteral(8)), ts.factory.createToken(ts.SyntaxKind.BarToken), createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1)))));
    }
    return undefined;
}
exports.createReadBy1Byte = createReadBy1Byte;
function createReadBy2Byte(buffer, address, element, structSize, fieldData) {
    if (fieldData.size === 1) {
        return createLogicalAnd(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2), ts.factory.createNumericLiteral('0xFF'));
    }
    else if (fieldData.size === 2) {
        return createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2);
    }
    else if (fieldData.size === 4) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createLeftShiftedExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 2), 2), ts.factory.createNumericLiteral(16)), ts.factory.createToken(ts.SyntaxKind.BarToken), createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2)));
    }
    return undefined;
}
exports.createReadBy2Byte = createReadBy2Byte;
function createReadBy4Byte(buffer, address, element, structSize, fieldData) {
    if (fieldData.size === 1) {
        return createLogicalAnd(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4), ts.factory.createNumericLiteral('0xFF'));
    }
    else if (fieldData.size === 2) {
        return createLogicalAnd(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4), ts.factory.createNumericLiteral('0xFFFF'));
    }
    else if (fieldData.size === 4) {
        return createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4);
    }
    return undefined;
}
exports.createReadBy4Byte = createReadBy4Byte;
// Little-endian
function createWriteBy1Byte(buffer, address, element, structSize, fieldData, value) {
    if (fieldData.size === 1) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(value, ts.factory.createNumericLiteral('0xFF')))));
    }
    else if (fieldData.size === 2) {
        return createCommanNode(ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(value, ts.factory.createNumericLiteral('0xFF'))))), ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 1), 1), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(ts.factory.createParenthesizedExpression(createRightShiftedExpression(value, ts.factory.createNumericLiteral('8'))), ts.factory.createNumericLiteral('0xFF'))))));
    }
    else if (fieldData.size === 4) {
        return createCommanNode(ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 1), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(value, ts.factory.createNumericLiteral('0xFF'))))), createCommanNode(ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 1), 1), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(ts.factory.createParenthesizedExpression(createRightShiftedExpression(value, ts.factory.createNumericLiteral('8'))), ts.factory.createNumericLiteral('0xFF'))))), createCommanNode(ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 2), 1), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(ts.factory.createParenthesizedExpression(createRightShiftedExpression(value, ts.factory.createNumericLiteral('16'))), ts.factory.createNumericLiteral('0xFF'))))), ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 3), 1), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(ts.factory.createParenthesizedExpression(createRightShiftedExpression(value, ts.factory.createNumericLiteral('24'))), ts.factory.createNumericLiteral('0xFF'))))))));
    }
    return undefined;
}
exports.createWriteBy1Byte = createWriteBy1Byte;
// Little-endian
function createWriteBy2Byte(buffer, address, element, structSize, fieldData, value) {
    if (fieldData.size === 1) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(value, ts.factory.createNumericLiteral('0xFF')))));
    }
    else if (fieldData.size === 2) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(value, ts.factory.createNumericLiteral('0xFFFF')))));
    }
    else if (fieldData.size === 4) {
        return createCommanNode(ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 2), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(value, ts.factory.createNumericLiteral('0xFFFF'))))), ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset + 2), 2), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(ts.factory.createParenthesizedExpression(createRightShiftedExpression(value, ts.factory.createNumericLiteral('16'))), ts.factory.createNumericLiteral('0xFFFF'))))));
    }
    return undefined;
}
exports.createWriteBy2Byte = createWriteBy2Byte;
// Little-endian
function createWriteBy4Byte(buffer, address, element, structSize, fieldData, value) {
    if (fieldData.size === 1) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(value, ts.factory.createNumericLiteral('0xFF')))));
    }
    else if (fieldData.size === 2) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(value, ts.factory.createNumericLiteral('0xFFFF')))));
    }
    else if (fieldData.size === 4) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccess(buffer, createEffectAddress(address, element, structSize, fieldData.offset), 4), ts.factory.createToken(ts.SyntaxKind.EqualsToken), value));
    }
    return undefined;
}
exports.createWriteBy4Byte = createWriteBy4Byte;
function createEffectAddress(address, element, structSize, fieldOffset) {
    if ((0, ast_1.isExpressionNumbericLiteral)(element)) {
        element = ts.factory.createNumericLiteral((0, ast_1.getNumberFromNumericLiteral)(element) * structSize);
    }
    else {
        element = ts.factory.createBinaryExpression(element, ts.factory.createToken(ts.SyntaxKind.AsteriskToken), ts.factory.createNumericLiteral(structSize));
    }
    if ((0, ast_1.isExpressionNumbericLiteral)(address)) {
        const resultOffset = (0, ast_1.getNumberFromNumericLiteral)(address) + fieldOffset;
        if ((0, ast_1.isExpressionNumbericLiteral)(element)) {
            return ts.factory.createNumericLiteral(resultOffset + (0, ast_1.getNumberFromNumericLiteral)(element));
        }
        if (resultOffset === 0) {
            return element;
        }
        return ts.factory.createBinaryExpression(ts.factory.createNumericLiteral(resultOffset), ts.factory.createToken(ts.SyntaxKind.PlusToken), element);
    }
    if ((0, ast_1.isExpressionNumbericLiteral)(element)) {
        const resultOffset = (0, ast_1.getNumberFromNumericLiteral)(element) + fieldOffset;
        if (resultOffset === 0) {
            return address;
        }
        return ts.factory.createBinaryExpression(address, ts.factory.createToken(ts.SyntaxKind.PlusToken), ts.factory.createNumericLiteral(resultOffset));
    }
    const elementWithFieldOffset = fieldOffset !== 0 ?
        ts.factory.createBinaryExpression(element, ts.factory.createToken(ts.SyntaxKind.PlusToken), ts.factory.createNumericLiteral(fieldOffset)) : element;
    return ts.factory.createBinaryExpression(address, ts.factory.createToken(ts.SyntaxKind.PlusToken), elementWithFieldOffset);
}
exports.createEffectAddress = createEffectAddress;
