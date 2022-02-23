"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcLayout = void 0;
const type_1 = require("./type");
function calcLayout(properties, getType) {
    let offset = 0;
    let totalSize = 0;
    const offsetMap = new Map();
    properties.forEach(v => {
        var _a;
        const fieldName = v.escapedName;
        const type = getType(v);
        const typeName = (_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.escapedName;
        const fieldSize = (0, type_1.getTypeSizeInBytes)(typeName);
        offsetMap.set(fieldName, { offset, size: fieldSize });
        offset += (0, type_1.align)(fieldSize, 4);
    });
    totalSize = (0, type_1.align)(offset, 4);
    return { layout: offsetMap, size: totalSize };
}
exports.calcLayout = calcLayout;
