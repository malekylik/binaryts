import { Float32, Int16, Int32, Int8, sizeof } from '../src/binaryts.types';

type Int8Wrap = {
  value: Int8;
};

type Int16Wrap = {
  value: Int16;
};
type Int32Wrap = {
  value: Int32;
};

type Float32Wrap = {
  value: Float32;
};

console.log('---Field Size---');

console.log('sizeof<Int8Wrap>() === 4', sizeof<Int8Wrap>(), sizeof<Int8Wrap>() === 4);
console.log('sizeof<Int16Wrap>() === 4', sizeof<Int16Wrap>(), sizeof<Int16Wrap>() === 4);
console.log('sizeof<Int32Wrap>() === 4', sizeof<Int32Wrap>(), sizeof<Int32Wrap>() === 4);
console.log('sizeof<Float32Wrap>() === 4', sizeof<Float32Wrap>(), sizeof<Float32Wrap>() === 4);

type StartPadding8Int8Wrap = {
  pad: Int8;
  value: Int8;
};

type StartPadding8Int16Wrap = {
  pad: Int8;
  value: Int16;
};
type StartPadding8Int32Wrap = {
  pad: Int8;
  value: Int32;
};

type StartPadding8Float32Wrap = {
  pad: Int8;
  value: Float32;
};

console.log('---Start Padding 8 Field Size---');

console.log('sizeof<StartPadding8Int8Wrap>() === 8', sizeof<StartPadding8Int8Wrap>(), sizeof<StartPadding8Int8Wrap>() === 8);
console.log('sizeof<StartPadding8Int16Wrap>() === 8', sizeof<StartPadding8Int16Wrap>(), sizeof<StartPadding8Int16Wrap>() === 8);
console.log('sizeof<StartPadding8Int32Wrap>() === 8', sizeof<StartPadding8Int32Wrap>(), sizeof<StartPadding8Int32Wrap>() === 8);
console.log('sizeof<StartPadding8Float32Wrap>() === 8', sizeof<StartPadding8Float32Wrap>(), sizeof<StartPadding8Float32Wrap>() === 8);

type EndPadding8Int8Wrap = {
  value: Int8;
  pad: Int8;
};

type EndPadding8Int16Wrap = {
  value: Int16;
  pad: Int8;
};
type EndPadding8Int32Wrap = {
  value: Int32;
  pad: Int8;
};

type EndPadding8Float32Wrap = {
  value: Float32;
  pad: Int8;
};

console.log('---End Padding 8 Field Size---');

console.log('sizeof<EndPadding8Int8Wrap>() === 8', sizeof<EndPadding8Int8Wrap>(), sizeof<EndPadding8Int8Wrap>() === 8);
console.log('sizeof<EndPadding8Int16Wrap>() === 8', sizeof<EndPadding8Int16Wrap>(), sizeof<EndPadding8Int16Wrap>() === 8);
console.log('sizeof<EndPadding8Int32Wrap>() === 8', sizeof<EndPadding8Int32Wrap>(), sizeof<EndPadding8Int32Wrap>() === 8);
console.log('sizeof<EndPadding8Float32Wrap>() === 8', sizeof<EndPadding8Float32Wrap>(), sizeof<EndPadding8Float32Wrap>() === 8);

type StartPadding16Int8Wrap = {
  pad: Int16;
  value: Int8;
};

type StartPadding16Int16Wrap = {
  pad: Int16;
  value: Int16;
};
type StartPadding16Int32Wrap = {
  pad: Int16;
  value: Int32;
};

type StartPadding16Float32Wrap = {
  pad: Int16;
  value: Float32;
};

console.log('---Start Padding 16 Field Size---');

console.log('sizeof<StartPadding16Int8Wrap>() === 8', sizeof<StartPadding16Int8Wrap>(), sizeof<StartPadding16Int8Wrap>() === 8);
console.log('sizeof<StartPadding16Int16Wrap>() === 8', sizeof<StartPadding16Int16Wrap>(), sizeof<StartPadding16Int16Wrap>() === 8);
console.log('sizeof<StartPadding16Int32Wrap>() === 8', sizeof<StartPadding16Int32Wrap>(), sizeof<StartPadding16Int32Wrap>() === 8);
console.log('sizeof<StartPadding16Float32Wrap>() === 8', sizeof<StartPadding16Float32Wrap>(), sizeof<StartPadding16Float32Wrap>() === 8);

type EndPadding16Int8Wrap = {
  value: Int8;
  pad: Int16;
};

type EndPadding16Int16Wrap = {
  value: Int16;
  pad: Int16;
};
type EndPadding16Int32Wrap = {
  value: Int32;
  pad: Int16;
};

type EndPadding16Float32Wrap = {
  value: Float32;
  pad: Int16;
};

console.log('---End Padding 16 Field Size---');

console.log('sizeof<EndPadding16Int8Wrap>() === 8', sizeof<EndPadding16Int8Wrap>(), sizeof<EndPadding16Int8Wrap>() === 8);
console.log('sizeof<EndPadding16Int16Wrap>() === 8', sizeof<EndPadding16Int16Wrap>(), sizeof<EndPadding16Int16Wrap>() === 8);
console.log('sizeof<EndPadding16Int32Wrap>() === 8', sizeof<EndPadding16Int32Wrap>(), sizeof<EndPadding16Int32Wrap>() === 8);
console.log('sizeof<EndPadding16Float32Wrap>() === 8', sizeof<EndPadding16Float32Wrap>(), sizeof<EndPadding16Float32Wrap>() === 8);

type Vec3 = {
  x: Float32;
  y: Float32;
  z: Float32;
}

type Vec3Wrap = {
  value: Vec3;
};

console.log('---Struct Size---');

console.log('sizeof<Vec3Wrap>() === 12', sizeof<Vec3Wrap>(), sizeof<Vec3Wrap>() === 12);

type StartPaddingVec3Wrap = {
  pad: Float32;
  value: Vec3;
};

console.log('---Start Padding Struct Size---');

console.log('sizeof<StartPaddingVec3Wrap>() === 16', sizeof<StartPaddingVec3Wrap>(), sizeof<StartPaddingVec3Wrap>() === 16);

type EndPaddingVec3Wrap = {
  value: Vec3;
  pad: Float32;
};

console.log('---End Padding Struct Size---');

console.log('sizeof<EndPaddingVec3Wrap>() === 16', sizeof<EndPaddingVec3Wrap>(), sizeof<EndPaddingVec3Wrap>() === 16);

type Material = {
  pad1: Int32;
  color: Vec3;
  intensity: Vec3;
  pad2: Int16;
};

type ComplexTable = {
  value: Int8;
  position: Vec3;
  padStart: Float32;
  material: Material;
  padEnd: Int32;
};

console.log('---Complex Struct Size---');

console.log('sizeof<ComplexTable>() === 56', sizeof<ComplexTable>(), sizeof<ComplexTable>() === 56);
