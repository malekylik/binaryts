"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransformer = void 0;
const ts = require("typescript");
const type_1 = require("./utils/type");
const factory_1 = require("./utils/factory");
function createTransformer(program) {
    const checker = program.getTypeChecker();
    return function binaryTransformer(context) {
        function visit(node) {
            var _a, _b, _c, _d, _e, _f, _g;
            node = ts.visitEachChild(node, visit, context);
            if (ts.isCallExpression(node)) {
                const calledFunctionName = node.expression.escapedText;
                if (calledFunctionName === 'sizeof') {
                    const typeArguments = node.typeArguments;
                    const type = checker.getTypeAtLocation(typeArguments[0]);
                    const properties = checker.getPropertiesOfType(type);
                    const structName = type.objectFlags & ts.ObjectFlags.Interface ? type.symbol.escapedName : ((_b = (_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.escapedName) !== null && _b !== void 0 ? _b : type.symbol.escapedName);
                    console.log('Struct name', structName, type);
                    let offset = 0;
                    let totalSize = 0;
                    properties.forEach(v => {
                        var _a;
                        const fieldName = v.escapedName;
                        const type = checker.getTypeOfSymbolAtLocation(v, v.valueDeclaration);
                        const typeName = (_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.escapedName;
                        const fieldSize = (0, type_1.getTypeSizeInBytes)(typeName);
                        console.log(`${fieldName}: ${typeName} - start at ${offset} size ${fieldSize} bytes`);
                        offset += (0, type_1.align)(fieldSize, 4);
                    });
                    totalSize = (0, type_1.align)(offset, 4);
                    console.log('total size', totalSize);
                    return ts.factory.createNumericLiteral(totalSize);
                }
                if (calledFunctionName === 'readValue') {
                    const typeArguments = node.typeArguments;
                    const type = checker.getTypeAtLocation(typeArguments[0]);
                    const structName = type.objectFlags & ts.ObjectFlags.Interface ? type.symbol.escapedName : ((_d = (_c = type.aliasSymbol) === null || _c === void 0 ? void 0 : _c.escapedName) !== null && _d !== void 0 ? _d : type.symbol.escapedName);
                    console.log('readValue Struct name', structName);
                    let offset = 0;
                    let totalSize = 0;
                    const properties = checker.getPropertiesOfType(type);
                    const offsetMap = new Map();
                    properties.forEach(v => {
                        var _a;
                        const fieldName = v.escapedName;
                        const type = checker.getTypeOfSymbolAtLocation(v, v.valueDeclaration);
                        const typeName = (_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.escapedName;
                        const fieldSize = (0, type_1.getTypeSizeInBytes)(typeName);
                        offsetMap.set(fieldName, { offset, size: fieldSize });
                        offset += (0, type_1.align)(fieldSize, 4);
                    });
                    totalSize = (0, type_1.align)(offset, 4);
                    const fieldName = node.arguments[2].text;
                    if (!offsetMap.has(fieldName)) {
                        console.warn(`field ${fieldName} doesnt exist in sctruct ${structName}`);
                        return node;
                    }
                    const fieldData = offsetMap.get(fieldName);
                    const bufferType = checker.getTypeAtLocation(node.arguments[0]);
                    const bufferTypeName = bufferType.symbol.escapedName;
                    console.log('bufferTypeName', bufferTypeName);
                    if (bufferTypeName === 'Int8Array' || bufferTypeName === 'Uint8Array') {
                        const transformedNode = (0, factory_1.createReadBy1Byte)(node.arguments[0], node.arguments[1], totalSize, fieldData);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Int16Array' || bufferTypeName === 'Uint16Array') {
                        const transformedNode = (0, factory_1.createReadBy2Byte)(node.arguments[0], node.arguments[1], totalSize, fieldData);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Int32Array' || bufferTypeName === 'Uint32Array') {
                        const transformedNode = (0, factory_1.createReadBy4Byte)(node.arguments[0], node.arguments[1], totalSize, fieldData);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Float32Array') {
                        const transformedNode = (0, factory_1.createReadBy4Byte)(node.arguments[0], node.arguments[1], totalSize, fieldData);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    else {
                        return node;
                    }
                }
                if (calledFunctionName === 'writeValue') {
                    const typeArguments = node.typeArguments;
                    const type = checker.getTypeAtLocation(typeArguments[0]);
                    const structName = type.objectFlags & ts.ObjectFlags.Interface ? type.symbol.escapedName : ((_f = (_e = type.aliasSymbol) === null || _e === void 0 ? void 0 : _e.escapedName) !== null && _f !== void 0 ? _f : type.symbol.escapedName);
                    console.log('writeValue Struct name', structName);
                    let offset = 0;
                    let totalSize = 0;
                    const properties = checker.getPropertiesOfType(type);
                    const offsetMap = new Map();
                    properties.forEach(v => {
                        var _a;
                        const fieldName = v.escapedName;
                        const type = checker.getTypeOfSymbolAtLocation(v, v.valueDeclaration);
                        const typeName = (_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.escapedName;
                        const fieldSize = (0, type_1.getTypeSizeInBytes)(typeName);
                        offsetMap.set(fieldName, { offset, size: fieldSize });
                        offset += (0, type_1.align)(fieldSize, 4);
                    });
                    totalSize = (0, type_1.align)(offset, 4);
                    const fieldName = (_g = node.arguments[2]) === null || _g === void 0 ? void 0 : _g.text;
                    if (!offsetMap.has(fieldName)) {
                        console.warn(`field ${fieldName} doesnt exist in sctruct ${structName}`);
                        return node;
                    }
                    const fieldData = offsetMap.get(fieldName);
                    const bufferType = checker.getTypeAtLocation(node.arguments[0]);
                    const bufferTypeName = bufferType.symbol.escapedName;
                    if (bufferTypeName === 'Int8Array' || bufferTypeName === 'Uint8Array') {
                        const transformedNode = (0, factory_1.createWriteBy1Byte)(node.arguments[0], node.arguments[1], totalSize, fieldData, node.arguments[3]);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Int16Array' || bufferTypeName === 'Uint16Array') {
                        const transformedNode = (0, factory_1.createWriteBy2Byte)(node.arguments[0], node.arguments[1], totalSize, fieldData, node.arguments[3]);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Int32Array' || bufferTypeName === 'Uint32Array') {
                        const transformedNode = (0, factory_1.createWriteBy4Byte)(node.arguments[0], node.arguments[1], totalSize, fieldData, node.arguments[3]);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Float32Array') {
                        const transformedNode = (0, factory_1.createWriteBy4Byte)(node.arguments[0], node.arguments[1], totalSize, fieldData, node.arguments[3]);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    else {
                        return node;
                    }
                }
            }
            return node;
        }
        return (node) => ts.visitNode(node, visit);
    };
}
exports.createTransformer = createTransformer;
