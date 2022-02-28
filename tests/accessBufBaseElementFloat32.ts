import { Float32, Int16, Int32, Int8, readValue, sizeof, writeValue } from '../src/binaryts.types';

type Table = {
  byte: Int32;
  x: Int8;
  y: Int8;
  prev: Int32;
  current: Int16;
  aver: Float32;
};

const buffer = new Float32Array(sizeof<Table>() * 10);

const base = 8;
const element = 1;
const value = 128;
const bigValue = 16777216; // max decimal value
const floatValue = 123.543;

console.log('----Float32Array----');

console.log('----Float32----');
writeValue<Table>(buffer, base, 2, 'aver', value);
readValue<Table>(buffer, base, 2, 'aver');

console.log('writeValue<Table>(buffer, base, 2, "aver", value) === readValue<Table>(buffer, base, 2, "aver")', readValue<Table>(buffer, base, 2, 'aver'), value === readValue<Table>(buffer, base, 2, 'aver'));

writeValue<Table>(buffer, base, element, 'aver', value);
readValue<Table>(buffer, base, element, 'aver');

console.log('writeValue<Table>(buffer, base, element, "aver", value) === readValue<Table>(buffer, base, element, "aver")', readValue<Table>(buffer, base, element, 'aver'), value === readValue<Table>(buffer, base, element, 'aver'));

writeValue<Table>(buffer, base, 2, 'aver', bigValue);
readValue<Table>(buffer, base, 2, 'aver');

console.log('writeValue<Table>(buffer, base, 2, "aver", bigValue) === readValue<Table>(buffer, base, 2, "aver")', readValue<Table>(buffer, base, 2, 'aver'), bigValue === readValue<Table>(buffer, base, 2, 'aver'));

writeValue<Table>(buffer, base, element, 'aver', bigValue);
readValue<Table>(buffer, base, element, 'aver');

console.log('writeValue<Table>(buffer, base, element, "aver", bigValue) === readValue<Table>(buffer, base, element, "aver")', readValue<Table>(buffer, base, element, 'aver'), bigValue === readValue<Table>(buffer, base, element, 'aver'));

writeValue<Table>(buffer, base, element, 'aver', floatValue);
readValue<Table>(buffer, base, element, 'aver');

console.log('writeValue<Table>(buffer, base, element, "aver", bigValue) === readValue<Table>(buffer, base, element, "aver")', readValue<Table>(buffer, base, element, 'aver'), readValue<Table>(buffer, base, element, 'aver') === readValue<Table>(buffer, base, element, 'aver'));