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
                    console.log('Struct name', structName, properties);
                    const { size } = (0, layout_1.calcLayout)(properties, checker);
                    console.log('total size', size);
                    return ts.factory.createNumericLiteral(size);
                }
                if (calledFunctionName === 'readValue') {
                    const typeArguments = node.typeArguments;
                    const structType = typeArguments[0];
                    const funcArguments = node.arguments;
                    const buffer = funcArguments[0];
                    const address = funcArguments[1];
                    const element = funcArguments.length === 4 ? funcArguments[2] : ts.factory.createNumericLiteral(0);
                    const field = funcArguments.length === 4 ? funcArguments[3] : funcArguments[2];
                    const type = checker.getTypeAtLocation(structType);
                    const structName = (0, ast_1.getInterfaceOrTypeAliesName)(type);
                    console.log('readValue Struct name', structName);
                    const properties = checker.getPropertiesOfType(type);
                    const { layout, size } = (0, layout_1.calcLayout)(properties, checker);
                    const fieldName = field.text;
                    const fieldData = layout.get(fieldName);
                    if (!fieldData) {
                        console.warn(`field ${fieldName} doesnt exist in sctruct ${structName}`);
                        return node;
                    }
                    const bufferType = checker.getTypeAtLocation(buffer);
                    const bufferTypeName = bufferType.symbol.escapedName;
                    console.log('bufferTypeName', bufferTypeName);
                    let transformedNode;
                    if (bufferTypeName === 'Int8Array' || bufferTypeName === 'Uint8Array') {
                        transformedNode = (0, factory_1.createReadBy1Byte)(buffer, address, element, size, fieldData);
                    }
                    else if (bufferTypeName === 'Int16Array' || bufferTypeName === 'Uint16Array') {
                        transformedNode = (0, factory_1.createReadBy2Byte)(buffer, address, element, size, fieldData);
                    }
                    else if (bufferTypeName === 'Int32Array' || bufferTypeName === 'Uint32Array') {
                        transformedNode = (0, factory_1.createReadBy4Byte)(buffer, address, element, size, fieldData);
                    }
                    else if (bufferTypeName === 'Float32Array') {
                        transformedNode = (0, factory_1.createReadBy4Byte)(buffer, address, element, size, fieldData);
                    }
                    else {
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
                    const typeArguments = node.typeArguments;
                    const structType = typeArguments[0];
                    const funcArguments = node.arguments;
                    const buffer = funcArguments[0];
                    const address = funcArguments[1];
                    const element = funcArguments.length === 5 ? funcArguments[2] : ts.factory.createNumericLiteral(0);
                    const field = funcArguments.length === 5 ? funcArguments[3] : funcArguments[2];
                    const value = funcArguments.length === 5 ? node.arguments[4] : node.arguments[3];
                    const type = checker.getTypeAtLocation(structType);
                    const structName = (0, ast_1.getInterfaceOrTypeAliesName)(type);
                    console.log('writeValue Struct name', structName);
                    const properties = checker.getPropertiesOfType(type);
                    const { layout, size } = (0, layout_1.calcLayout)(properties, checker);
                    const fieldName = (_a = field) === null || _a === void 0 ? void 0 : _a.text;
                    const fieldData = layout.get(fieldName);
                    if (!fieldData) {
                        console.warn(`field ${fieldName} doesnt exist in sctruct ${structName}`);
                        return node;
                    }
                    const bufferType = checker.getTypeAtLocation(buffer);
                    const bufferTypeName = bufferType.symbol.escapedName;
                    let transformedNode;
                    if (bufferTypeName === 'Int8Array' || bufferTypeName === 'Uint8Array') {
                        transformedNode = (0, factory_1.createWriteBy1Byte)(buffer, address, element, size, fieldData, value);
                    }
                    else if (bufferTypeName === 'Int16Array' || bufferTypeName === 'Uint16Array') {
                        transformedNode = (0, factory_1.createWriteBy2Byte)(buffer, address, element, size, fieldData, value);
                    }
                    else if (bufferTypeName === 'Int32Array' || bufferTypeName === 'Uint32Array') {
                        transformedNode = (0, factory_1.createWriteBy4Byte)(buffer, address, element, size, fieldData, value);
                    }
                    else if (bufferTypeName === 'Float32Array') {
                        transformedNode = (0, factory_1.createWriteBy4Byte)(buffer, address, element, size, fieldData, value);
                    }
                    else {
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
                    const typeArguments = node.typeArguments;
                    const funcArguments = node.arguments;
                    const structType = typeArguments[0];
                    const type = checker.getTypeAtLocation(structType);
                    const structName = (0, ast_1.getInterfaceOrTypeAliesName)(type);
                    console.log('readValueStruct Struct name', structName);
                    const properties = checker.getPropertiesOfType(type);
                    const { layout, size } = (0, layout_1.calcLayout)(properties, checker);
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
