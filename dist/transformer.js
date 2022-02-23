"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransformer = void 0;
const ts = require("typescript");
const factory_1 = require("./utils/factory");
const layout_1 = require("./utils/layout");
const ast_1 = require("./utils/ast");
function createTransformer(program) {
    const checker = program.getTypeChecker();
    return function binaryTransformer(context) {
        function visit(node) {
            var _a;
            node = ts.visitEachChild(node, visit, context);
            if (ts.isCallExpression(node)) {
                const calledFunctionName = node.expression.escapedText;
                if (calledFunctionName === 'sizeof') {
                    const typeArguments = node.typeArguments;
                    const type = checker.getTypeAtLocation(typeArguments[0]);
                    const properties = checker.getPropertiesOfType(type);
                    const structName = (0, ast_1.getInterfaceOrTypeAliesName)(type);
                    console.log('Struct name', structName, type);
                    // TODO: check when symbol.valueDeclaration can be undefined
                    const { size } = (0, layout_1.calcLayout)(properties, symbol => checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));
                    console.log('total size', size);
                    return ts.factory.createNumericLiteral(size);
                }
                if (calledFunctionName === 'readValue') {
                    const typeArguments = node.typeArguments;
                    const type = checker.getTypeAtLocation(typeArguments[0]);
                    const structName = (0, ast_1.getInterfaceOrTypeAliesName)(type);
                    console.log('readValue Struct name', structName);
                    const properties = checker.getPropertiesOfType(type);
                    // TODO: check when symbol.valueDeclaration can be undefined
                    const { layout, size } = (0, layout_1.calcLayout)(properties, symbol => checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));
                    const fieldName = node.arguments[2].text;
                    const fieldData = layout.get(fieldName);
                    if (!fieldData) {
                        console.warn(`field ${fieldName} doesnt exist in sctruct ${structName}`);
                        return node;
                    }
                    const bufferType = checker.getTypeAtLocation(node.arguments[0]);
                    const bufferTypeName = bufferType.symbol.escapedName;
                    console.log('bufferTypeName', bufferTypeName);
                    if (bufferTypeName === 'Int8Array' || bufferTypeName === 'Uint8Array') {
                        const transformedNode = (0, factory_1.createReadBy1Byte)(node.arguments[0], node.arguments[1], size, fieldData);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Int16Array' || bufferTypeName === 'Uint16Array') {
                        const transformedNode = (0, factory_1.createReadBy2Byte)(node.arguments[0], node.arguments[1], size, fieldData);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Int32Array' || bufferTypeName === 'Uint32Array') {
                        const transformedNode = (0, factory_1.createReadBy4Byte)(node.arguments[0], node.arguments[1], size, fieldData);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Float32Array') {
                        const transformedNode = (0, factory_1.createReadBy4Byte)(node.arguments[0], node.arguments[1], size, fieldData);
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
                    const structName = (0, ast_1.getInterfaceOrTypeAliesName)(type);
                    console.log('writeValue Struct name', structName);
                    const properties = checker.getPropertiesOfType(type);
                    const { layout, size } = (0, layout_1.calcLayout)(properties, symbol => checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));
                    const fieldName = (_a = node.arguments[2]) === null || _a === void 0 ? void 0 : _a.text;
                    const fieldData = layout.get(fieldName);
                    if (!fieldData) {
                        console.warn(`field ${fieldName} doesnt exist in sctruct ${structName}`);
                        return node;
                    }
                    const bufferType = checker.getTypeAtLocation(node.arguments[0]);
                    const bufferTypeName = bufferType.symbol.escapedName;
                    if (bufferTypeName === 'Int8Array' || bufferTypeName === 'Uint8Array') {
                        const transformedNode = (0, factory_1.createWriteBy1Byte)(node.arguments[0], node.arguments[1], size, fieldData, node.arguments[3]);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Int16Array' || bufferTypeName === 'Uint16Array') {
                        const transformedNode = (0, factory_1.createWriteBy2Byte)(node.arguments[0], node.arguments[1], size, fieldData, node.arguments[3]);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Int32Array' || bufferTypeName === 'Uint32Array') {
                        const transformedNode = (0, factory_1.createWriteBy4Byte)(node.arguments[0], node.arguments[1], size, fieldData, node.arguments[3]);
                        if (!transformedNode) {
                            console.warn(`Unsupported size ${fieldData.size} for ${fieldName} in sctruct ${structName}`);
                            return node;
                        }
                        return transformedNode;
                    }
                    if (bufferTypeName === 'Float32Array') {
                        const transformedNode = (0, factory_1.createWriteBy4Byte)(node.arguments[0], node.arguments[1], size, fieldData, node.arguments[3]);
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
                if (calledFunctionName === 'loadEffectiveAddress') {
                    const typeArguments = node.typeArguments;
                    const funcArguments = node.arguments;
                    const structTypeArg = typeArguments[0];
                    const type = checker.getTypeAtLocation(structTypeArg);
                    const structName = (0, ast_1.getInterfaceOrTypeAliesName)(type);
                    console.log('readValueStruct Struct name', structName);
                    const properties = checker.getPropertiesOfType(type);
                    // TODO: check when symbol.valueDeclaration can be undefined
                    const { layout, size } = (0, layout_1.calcLayout)(properties, symbol => checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));
                    const address = funcArguments[0];
                    const element = funcArguments.length === 3 ? funcArguments[1] : ts.factory.createNumericLiteral(0);
                    const field = funcArguments.length === 3 ? funcArguments[2] : funcArguments[1];
                    const fieldName = field.text;
                    const fieldData = layout.get(fieldName);
                    if (!fieldData) {
                        console.warn(`field ${fieldName} doesn't exist in sctruct ${structName}`);
                        return node;
                    }
                    return (0, factory_1.createEffectAddress)(address, element, size, fieldData.offset);
                }
            }
            return node;
        }
        return (node) => ts.visitNode(node, visit);
    };
}
exports.createTransformer = createTransformer;
