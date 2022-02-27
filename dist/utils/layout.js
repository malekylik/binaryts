"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcLayout = void 0;
const ts = require("typescript");
const type_1 = require("./type");
function calcComplexTypeSize(properties, checker) {
    let size = 0;
    properties.forEach(v => {
        var _a;
        // TODO: check when symbol.valueDeclaration can be undefined
        const type = checker.getTypeOfSymbolAtLocation(v, v.valueDeclaration);
        const typeName = (_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.escapedName;
        if (type.flags & ts.TypeFlags.Object) {
            const properties = checker.getPropertiesOfType(type);
            size += calcComplexTypeSize(properties, checker);
        }
        else {
            size += (0, type_1.getTypeSizeInBytes)(typeName);
        }
    });
    return size;
}
function calcLayout(properties, checker) {
    let offset = 0;
    let totalSize = 0;
    const offsetMap = new Map();
    properties.forEach(v => {
        var _a;
        const fieldName = v.escapedName;
        // TODO: check when symbol.valueDeclaration can be undefined
        const type = checker.getTypeOfSymbolAtLocation(v, v.valueDeclaration);
        const typeName = (_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.escapedName;
        let fieldSize = -1;
        if (type.flags & ts.TypeFlags.Object) {
            const properties = checker.getPropertiesOfType(type);
            fieldSize = calcComplexTypeSize(properties, checker);
        }
        else {
            fieldSize = (0, type_1.getTypeSizeInBytes)(typeName);
        }
        offsetMap.set(fieldName, { offset, size: fieldSize });
        offset += (0, type_1.align)(fieldSize, 4);
    });
    totalSize = (0, type_1.align)(offset, 4);
    return { layout: offsetMap, size: totalSize };
}
exports.calcLayout = calcLayout;
