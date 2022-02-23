import { Float32, Int16, Int32, Int8, loadEffectiveAddress } from '../src/binaryts.types';

type Table = {
  byte: Int32;
  x: Int8;
  y: Int8;
  prev: Int32;
  current: Int16;
  aver: Float32;
};

const offsetByteWithZeroBase = loadEffectiveAddress<Table>(0, 'byte'); // 0
const offsetXWithZeroBase = loadEffectiveAddress<Table>(0, 'x'); // 4
const offsetYWithZeroBase = loadEffectiveAddress<Table>(0, 'y'); // 8
const offsetPrevWithZeroBase = loadEffectiveAddress<Table>(0, 'prev'); // 12
const offsetCurrentWithZeroBase = loadEffectiveAddress<Table>(0, 'current'); // 16
const offsetAverWithZeroBase = loadEffectiveAddress<Table>(0, 'aver'); // 20

const offsetByteWithNonZeroBase = loadEffectiveAddress<Table>(27, 'byte'); // 27
const offsetXWithNonZeroBase = loadEffectiveAddress<Table>(27, 'x'); // 31
const offsetYWithNonZeroBase = loadEffectiveAddress<Table>(27, 'y'); // 35
const offsetPrevWithNonZeroBase = loadEffectiveAddress<Table>(27, 'prev'); // 39
const offsetCurrentWithNonZeroBase = loadEffectiveAddress<Table>(27, 'current'); // 43
const offsetAverWithNonZeroBase = loadEffectiveAddress<Table>(27, 'aver'); // 47

const base = 234;

const offsetByteWithComplexBase = loadEffectiveAddress<Table>(base, 'byte'); // base
const offsetXWithComplexBase = loadEffectiveAddress<Table>(base, 'x'); // base + 4
const offsetYWithComplexBase = loadEffectiveAddress<Table>(base, 'y'); // base + 8
const offsetPrevWithComplexBase = loadEffectiveAddress<Table>(base, 'prev'); // base + 12
const offsetCurrentWithComplexBase = loadEffectiveAddress<Table>(base, 'current'); // base + 16
const offsetAverWithComplexBase = loadEffectiveAddress<Table>(base, 'aver'); // base + 20
