import { Float32, Int16, Int32, Int8, loadEffectiveAddress } from '../src/binaryts.types';

type Vec3 = {
  x: Float32;
  y: Float32;
  z: Float32;
}

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

const offsetValueWithZeroBase = loadEffectiveAddress<ComplexTable>(0, 'value'); // 0
console.log('loadEffectiveAddress<ComplexTable>(0, "value") === 0', offsetValueWithZeroBase, offsetValueWithZeroBase === 0);
const offsetPositionWithZeroBase = loadEffectiveAddress<ComplexTable>(0, 'position'); // 4
console.log('loadEffectiveAddress<ComplexTable>(0, "position") === 4', offsetPositionWithZeroBase, offsetPositionWithZeroBase === 4);
const offsetPadStartWithZeroBase = loadEffectiveAddress<ComplexTable>(0, 'padStart'); // 16
console.log('loadEffectiveAddress<ComplexTable>(0, "padStart") === 16', offsetPadStartWithZeroBase, offsetPadStartWithZeroBase === 16);
const offsetMaterialWithZeroBase = loadEffectiveAddress<ComplexTable>(0, 'material'); // 20
console.log('loadEffectiveAddress<ComplexTable>(0, "material") === 20', offsetMaterialWithZeroBase, offsetMaterialWithZeroBase === 20);
const offsetPadEndWithZeroBase = loadEffectiveAddress<ComplexTable>(0, 'padEnd'); // 52
console.log('loadEffectiveAddress<ComplexTable>(0, "padEnd") === 52', offsetPadEndWithZeroBase, offsetPadEndWithZeroBase === 52);

const base = 234;

const offsetValueWithComplexBase = loadEffectiveAddress<ComplexTable>(base, 'value'); // base
console.log('loadEffectiveAddress<ComplexTable>(base, "value") === base + 0', offsetValueWithComplexBase, offsetValueWithComplexBase === base + 0);
const offsetPositionWithComplexBase = loadEffectiveAddress<ComplexTable>(base, 'position'); // base + 4
console.log('loadEffectiveAddress<ComplexTable>(base, "position") === base + 4', offsetPositionWithComplexBase, offsetPositionWithComplexBase === base + 4);
const offsetPadStartWithComplexBase = loadEffectiveAddress<ComplexTable>(base, 'padStart'); // base + 16
console.log('loadEffectiveAddress<ComplexTable>(base, "padStart") === base + 16', offsetPadStartWithComplexBase, offsetPadStartWithComplexBase === base + 16);
const offsetMaterialWithComplexBase = loadEffectiveAddress<ComplexTable>(base, 'material'); // base + 20
console.log('loadEffectiveAddress<ComplexTable>(base, "material") === base + 20', offsetMaterialWithComplexBase, offsetMaterialWithComplexBase === base + 20);
const offsetPadEndWithComplexBase = loadEffectiveAddress<ComplexTable>(base, 'padEnd'); // base + 52
console.log('loadEffectiveAddress<ComplexTable>(base, "padEnd") === base + 52', offsetPadEndWithComplexBase, offsetPadEndWithComplexBase === base + 52);

const materialOffset = loadEffectiveAddress<ComplexTable>(base, 'material');

const offsetMaterialPad1 = loadEffectiveAddress<Material>(materialOffset, 'pad1');
console.log('loadEffectiveAddress<Material>(materialOffset, "pad1") === materialOffset + 0', offsetMaterialPad1, offsetMaterialPad1 === materialOffset + 0);
const offsetMaterialColor = loadEffectiveAddress<Material>(materialOffset, 'color');
console.log('loadEffectiveAddress<Material>(materialOffset, "color") === materialOffset + 4', offsetMaterialColor, offsetMaterialColor === materialOffset + 4);
const offsetMaterialIntensity = loadEffectiveAddress<Material>(materialOffset, 'intensity');
console.log('loadEffectiveAddress<Material>(materialOffset, "intensity") === materialOffset + 16', offsetMaterialIntensity, offsetMaterialIntensity === materialOffset + 16);
const offsetMaterialPad2 = loadEffectiveAddress<Material>(materialOffset, 'pad2');
console.log('loadEffectiveAddress<Material>(materialOffset, "pad2") === materialOffset + 28', offsetMaterialPad2, offsetMaterialPad2 === materialOffset + 28);

const colorlOffset = loadEffectiveAddress<Material>(materialOffset, 'color');

const offsetColorX = loadEffectiveAddress<Vec3>(colorlOffset, 'x');
console.log('loadEffectiveAddress<Vec3>(colorlOffset, "x") === colorlOffset + 0', offsetColorX, offsetColorX === colorlOffset + 0);
const offsetColorY = loadEffectiveAddress<Vec3>(colorlOffset, 'y');
console.log('loadEffectiveAddress<Vec3>(colorlOffset, "y") === colorlOffset + 4', offsetColorY, offsetColorY === colorlOffset + 4);
const offsetColorZ = loadEffectiveAddress<Vec3>(colorlOffset, 'z');
console.log('loadEffectiveAddress<Vec3>(colorlOffset, "z") === colorlOffset + 8', offsetColorZ, offsetColorZ === colorlOffset + 8);


const intensityOffset = loadEffectiveAddress<Material>(materialOffset, 'intensity');

const offsetIntensityX = loadEffectiveAddress<Vec3>(intensityOffset, 'x');
console.log('loadEffectiveAddress<Vec3>(intensityOffset, "x") === intensityOffset + 0', offsetIntensityX, offsetIntensityX === intensityOffset + 0);
const offsetIntensityY = loadEffectiveAddress<Vec3>(intensityOffset, 'y');
console.log('loadEffectiveAddress<Vec3>(intensityOffset, "y") === intensityOffset + 4', offsetIntensityY, offsetIntensityY === intensityOffset + 4);
const offsetIntensityZ = loadEffectiveAddress<Vec3>(intensityOffset, 'z');
console.log('loadEffectiveAddress<Vec3>(intensityOffset, "z") === intensityOffset + 8', offsetIntensityZ, offsetIntensityZ === intensityOffset + 8);
