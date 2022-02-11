"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWriteBy4Byte = exports.createWriteBy2Byte = exports.createWriteBy1Byte = exports.createReadBy4Byte = exports.createReadBy2Byte = exports.createReadBy1Byte = exports.createCommanNode = exports.createLogicalAnd = exports.createRightShiftedExpression = exports.createLeftShiftedExpression = exports.createBufferAccessFrom4ByteNode = exports.createBufferAccessFrom2ByteNode = exports.createBufferAccessFrom1ByteNode = exports.createStructReadOffsetNode = void 0;
const ts = require("typescript");
function createStructReadOffsetNode(structSize, elementIndxExp, fieldOffset) {
    const structOffsetNode = ts.factory.createBinaryExpression(ts.factory.createNumericLiteral(structSize), ts.factory.createToken(ts.SyntaxKind.AsteriskToken), elementIndxExp);
    return ts.factory.createBinaryExpression(structOffsetNode, ts.factory.createToken(ts.SyntaxKind.PlusToken), ts.factory.createNumericLiteral(fieldOffset));
}
exports.createStructReadOffsetNode = createStructReadOffsetNode;
function createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldOffset) {
    const structOffsetNode = createStructReadOffsetNode(structSize, elementIndxExp, fieldOffset);
    return ts.factory.createElementAccessExpression(bufferExp, structOffsetNode);
}
exports.createBufferAccessFrom1ByteNode = createBufferAccessFrom1ByteNode;
function createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldOffset) {
    const structOffsetNode = createStructReadOffsetNode(structSize, elementIndxExp, fieldOffset);
    return ts.factory.createElementAccessExpression(bufferExp, createRightShiftedExpression(ts.factory.createParenthesizedExpression(structOffsetNode), ts.factory.createNumericLiteral(1)));
}
exports.createBufferAccessFrom2ByteNode = createBufferAccessFrom2ByteNode;
function createBufferAccessFrom4ByteNode(bufferExp, structSize, elementIndxExp, fieldOffset) {
    const structOffsetNode = createStructReadOffsetNode(structSize, elementIndxExp, fieldOffset);
    return ts.factory.createElementAccessExpression(bufferExp, createRightShiftedExpression(ts.factory.createParenthesizedExpression(structOffsetNode), ts.factory.createNumericLiteral(2)));
}
exports.createBufferAccessFrom4ByteNode = createBufferAccessFrom4ByteNode;
function createLeftShiftedExpression(expToShift, shiftExp) {
    return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(expToShift, ts.factory.createToken(ts.SyntaxKind.LessThanLessThanToken), shiftExp));
}
exports.createLeftShiftedExpression = createLeftShiftedExpression;
function createRightShiftedExpression(expToShift, shiftExp) {
    return ts.factory.createBinaryExpression(expToShift, ts.factory.createToken(ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken), shiftExp);
}
exports.createRightShiftedExpression = createRightShiftedExpression;
function createLogicalAnd(expToAnd, andExp) {
    return ts.factory.createBinaryExpression(expToAnd, ts.factory.createToken(ts.SyntaxKind.AmpersandToken), andExp);
}
exports.createLogicalAnd = createLogicalAnd;
function createCommanNode(firstExp, secondExp) {
    return ts.factory.createBinaryExpression(firstExp, ts.factory.createToken(ts.SyntaxKind.CommaToken), secondExp);
}
exports.createCommanNode = createCommanNode;
function createReadBy1Byte(bufferExp, elementIndxExp, structSize, fieldData) {
    if (fieldData.size === 1) {
        return createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset);
    }
    else if (fieldData.size === 2) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createLeftShiftedExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 1), ts.factory.createNumericLiteral(8)), ts.factory.createToken(ts.SyntaxKind.BarToken), createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset)));
    }
    else if (fieldData.size === 4) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createLeftShiftedExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 3), ts.factory.createNumericLiteral(24)), ts.factory.createToken(ts.SyntaxKind.BarToken), ts.factory.createBinaryExpression(createLeftShiftedExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 2), ts.factory.createNumericLiteral(16)), ts.factory.createToken(ts.SyntaxKind.BarToken), ts.factory.createBinaryExpression(createLeftShiftedExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 1), ts.factory.createNumericLiteral(8)), ts.factory.createToken(ts.SyntaxKind.BarToken), createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset)))));
    }
    return undefined;
}
exports.createReadBy1Byte = createReadBy1Byte;
function createReadBy2Byte(bufferExp, elementIndxExp, structSize, fieldData) {
    if (fieldData.size === 1) {
        return createLogicalAnd(createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createNumericLiteral('0xFF'));
    }
    else if (fieldData.size === 2) {
        return createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset);
    }
    else if (fieldData.size === 4) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createLeftShiftedExpression(createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 2), ts.factory.createNumericLiteral(16)), ts.factory.createToken(ts.SyntaxKind.BarToken), createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset)));
    }
    return undefined;
}
exports.createReadBy2Byte = createReadBy2Byte;
function createReadBy4Byte(bufferExp, elementIndxExp, structSize, fieldData) {
    if (fieldData.size === 1) {
        return createLogicalAnd(createBufferAccessFrom4ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createNumericLiteral('0xFF'));
    }
    else if (fieldData.size === 2) {
        return createLogicalAnd(createBufferAccessFrom4ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createNumericLiteral('0xFFFF'));
    }
    else if (fieldData.size === 4) {
        return createBufferAccessFrom4ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset);
    }
    return undefined;
}
exports.createReadBy4Byte = createReadBy4Byte;
// Little-endian
function createWriteBy1Byte(bufferExp, elementIndxExp, structSize, fieldData, valueExp) {
    if (fieldData.size === 1) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFF')))));
    }
    else if (fieldData.size === 2) {
        return createCommanNode(ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFF'))))), ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 1), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(ts.factory.createParenthesizedExpression(createRightShiftedExpression(valueExp, ts.factory.createNumericLiteral('8'))), ts.factory.createNumericLiteral('0xFF'))))));
    }
    else if (fieldData.size === 4) {
        return createCommanNode(ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFF'))))), createCommanNode(ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 1), ts.factory.createToken(ts.SyntaxKind.EqualsToken), 
        // create separete func getNByteFromExp
        ts.factory.createParenthesizedExpression(createLogicalAnd(ts.factory.createParenthesizedExpression(createRightShiftedExpression(valueExp, ts.factory.createNumericLiteral('8'))), ts.factory.createNumericLiteral('0xFF'))))), createCommanNode(ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 2), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(ts.factory.createParenthesizedExpression(createRightShiftedExpression(valueExp, ts.factory.createNumericLiteral('16'))), ts.factory.createNumericLiteral('0xFF'))))), ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom1ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 3), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(ts.factory.createParenthesizedExpression(createRightShiftedExpression(valueExp, ts.factory.createNumericLiteral('24'))), ts.factory.createNumericLiteral('0xFF'))))))));
    }
    return undefined;
}
exports.createWriteBy1Byte = createWriteBy1Byte;
// Little-endian
function createWriteBy2Byte(bufferExp, elementIndxExp, structSize, fieldData, valueExp) {
    if (fieldData.size === 1) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFF')))));
    }
    else if (fieldData.size === 2) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFFFF')))));
    }
    else if (fieldData.size === 4) {
        return createCommanNode(ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFFFF'))))), ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom2ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset + 2), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(ts.factory.createParenthesizedExpression(createRightShiftedExpression(valueExp, ts.factory.createNumericLiteral('16'))), ts.factory.createNumericLiteral('0xFFFF'))))));
    }
    return undefined;
}
exports.createWriteBy2Byte = createWriteBy2Byte;
// Little-endian
function createWriteBy4Byte(bufferExp, elementIndxExp, structSize, fieldData, valueExp) {
    if (fieldData.size === 1) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom4ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFF')))));
    }
    else if (fieldData.size === 2) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom4ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createToken(ts.SyntaxKind.EqualsToken), ts.factory.createParenthesizedExpression(createLogicalAnd(valueExp, ts.factory.createNumericLiteral('0xFFFF')))));
    }
    else if (fieldData.size === 4) {
        return ts.factory.createParenthesizedExpression(ts.factory.createBinaryExpression(createBufferAccessFrom4ByteNode(bufferExp, structSize, elementIndxExp, fieldData.offset), ts.factory.createToken(ts.SyntaxKind.EqualsToken), valueExp));
    }
    return undefined;
}
exports.createWriteBy4Byte = createWriteBy4Byte;
