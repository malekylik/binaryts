import { Float32, Int16, Int32, Int8, loadEffectiveAddress } from '../src/binaryts.types';

type Table = {
  byte: Int32;
  x: Int8;
  y: Int8;
  prev: Int32;
  current: Int16;
  aver: Float32;
};

// zero base
const offsetByteWithZeroBase = loadEffectiveAddress<Table>(0, 12, 'byte'); // 288
const offsetXWithZeroBase = loadEffectiveAddress<Table>(0, 12, 'x'); // 292
const offsetYWithZeroBase = loadEffectiveAddress<Table>(0, 12, 'y'); // 296
const offsetPrevWithZeroBase = loadEffectiveAddress<Table>(0, 12, 'prev'); // 300
const offsetCurrentWithZeroBase = loadEffectiveAddress<Table>(0, 12, 'current'); // 304
const offsetAverWithZeroBase = loadEffectiveAddress<Table>(0, 12, 'aver'); // 308

// zero element
const offsetByteWithZeroElement = loadEffectiveAddress<Table>(27, 0, 'byte'); // 27
const offsetXWithZeroElement = loadEffectiveAddress<Table>(27, 0, 'x'); // 31
const offsetYWithZeroElement = loadEffectiveAddress<Table>(27, 0, 'y'); // 35
const offsetPrevWithZeroElement = loadEffectiveAddress<Table>(27, 0, 'prev'); // 39
const offsetCurrentWithZeroElement = loadEffectiveAddress<Table>(27, 0, 'current'); // 43
const offsetAverWithZeroElement = loadEffectiveAddress<Table>(27, 0, 'aver'); // 47

// zero base and zero element
const offsetByteWithZeroBaseAndZeroElement = loadEffectiveAddress<Table>(0, 0, 'byte'); // 0
const offsetXWithZeroBaseAndZeroElement = loadEffectiveAddress<Table>(0, 0, 'x'); // 4
const offsetYWithZeroBaseAndZeroElement = loadEffectiveAddress<Table>(0, 0, 'y'); // 8
const offsetPrevWithZeroBaseAndZeroElement = loadEffectiveAddress<Table>(0, 0, 'prev'); // 0
const offsetCurrentWithZeroBaseAndZeroElement = loadEffectiveAddress<Table>(0, 0, 'current'); // 16
const offsetAverWithZeroBaseAndZeroElement = loadEffectiveAddress<Table>(0, 0, 'aver'); // 20

// literal base and literal element
const offsetByteWithNonZeroBase = loadEffectiveAddress<Table>(27, 12, 'byte'); // 315
const offsetXWithNonZeroBase = loadEffectiveAddress<Table>(27, 12, 'x'); // 319
const offsetYWithNonZeroBase = loadEffectiveAddress<Table>(27, 12, 'y'); // 323
const offsetPrevWithNonZeroBase = loadEffectiveAddress<Table>(27, 12, 'prev'); // 327
const offsetCurrentWithNonZeroBase = loadEffectiveAddress<Table>(27, 12, 'current'); // 331
const offsetAverWithNonZeroBase = loadEffectiveAddress<Table>(27, 12, 'aver'); // 335

const base = 234;
// complex base
const offsetByteWithComplexBase = loadEffectiveAddress<Table>(base, 12, 'byte'); // base + 288
const offsetXWithComplexBase = loadEffectiveAddress<Table>(base, 12, 'x'); // base + 292
const offsetYWithComplexBase = loadEffectiveAddress<Table>(base, 12, 'y'); // base + 296
const offsetPrevWithComplexBase = loadEffectiveAddress<Table>(base, 12, 'prev'); // base + 300
const offsetCurrentWithComplexBase = loadEffectiveAddress<Table>(base, 12, 'current'); // base + 304
const offsetAverWithComplexBase = loadEffectiveAddress<Table>(base, 12, 'aver'); // base + 308

const element = 14;
// complex element
const offsetByteWithComplexElement = loadEffectiveAddress<Table>(27, element, 'byte'); // 27 + element * 24
const offsetXWithComplexElement = loadEffectiveAddress<Table>(27, element, 'x'); // 31 + element * 24
const offsetYWithComplexElement = loadEffectiveAddress<Table>(27, element, 'y'); // 35 + element * 24
const offsetPrevWithComplexElement = loadEffectiveAddress<Table>(27, element, 'prev'); // 39 + element * 24
const offsetCurrentWithComplexElement = loadEffectiveAddress<Table>(27, element, 'current'); // 43 + element * 24
const offsetAverWithComplexElement = loadEffectiveAddress<Table>(27, element, 'aver'); // 47 + element * 24
// complex base and complex element
const offsetByteWithComplexBaseAndElement = loadEffectiveAddress<Table>(base, element, 'byte'); // base + element * 24
const offsetXWithComplexBaseAndElement = loadEffectiveAddress<Table>(base, element, 'x'); // base + element * 24 + 4
const offsetYWithComplexBaseAndElement = loadEffectiveAddress<Table>(base, element, 'y'); // base + element * 24 + 8
const offsetPrevWithComplexBaseAndElement = loadEffectiveAddress<Table>(base, element, 'prev'); // base + element * 24 + 12
const offsetCurrentWithComplexBaseAndElement = loadEffectiveAddress<Table>(base, element, 'current'); // base + element * 24 + 16
const offsetAverWithComplexBaseAndElement = loadEffectiveAddress<Table>(base, element, 'aver'); // base + element * 24 + 20
