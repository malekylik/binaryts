"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.align = exports.getTypeSizeInBytes = exports.SupportedTypes = void 0;
var SupportedTypes;
(function (SupportedTypes) {
    SupportedTypes["Int8"] = "Int8";
    SupportedTypes["Int16"] = "Int16";
    SupportedTypes["Int32"] = "Int32";
    SupportedTypes["Float32"] = "Float32";
})(SupportedTypes = exports.SupportedTypes || (exports.SupportedTypes = {}));
function getTypeSizeInBytes(type) {
    if (type === 'Int8') {
        return 1;
    }
    if (type === 'Int16') {
        return 2;
    }
    if (type === 'Int32' || type === 'Float32') {
        return 4;
    }
    return -1;
}
exports.getTypeSizeInBytes = getTypeSizeInBytes;
function align(size, alignment) {
    return (size + alignment - 1) & ~(alignment - 1);
}
exports.align = align;
