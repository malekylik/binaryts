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

const indx = 1;
const value = 128;
const bigValue = 16777216; // max decimal value
const floatValue = 123.543;

console.log('----Float32Array----');

console.log('----Float32----');
writeValue<Table>(buffer, 2, 'aver', value);
readValue<Table>(buffer, 2, 'aver');

console.log('writeValue<Table>(buffer, 2, "aver", value) === readValue<Table>(buffer, 2, "aver")', readValue<Table>(buffer, 2, 'aver'), value === readValue<Table>(buffer, 2, 'aver'));

writeValue<Table>(buffer, indx, 'aver', value);
readValue<Table>(buffer, indx, 'aver');

console.log('writeValue<Table>(buffer, indx, "aver", value) === readValue<Table>(buffer, indx, "aver")', readValue<Table>(buffer, indx, 'aver'), value === readValue<Table>(buffer, indx, 'aver'));

writeValue<Table>(buffer, 2, 'aver', bigValue);
readValue<Table>(buffer, 2, 'aver');

console.log('writeValue<Table>(buffer, 2, "aver", bigValue) === readValue<Table>(buffer, 2, "aver")', readValue<Table>(buffer, 2, 'aver'), bigValue === readValue<Table>(buffer, 2, 'aver'));

writeValue<Table>(buffer, indx, 'aver', bigValue);
readValue<Table>(buffer, indx, 'aver');

console.log('writeValue<Table>(buffer, indx, "aver", bigValue) === readValue<Table>(buffer, indx, "aver")', readValue<Table>(buffer, indx, 'aver'), bigValue === readValue<Table>(buffer, indx, 'aver'));

writeValue<Table>(buffer, indx, 'aver', floatValue);
readValue<Table>(buffer, indx, 'aver');

console.log('writeValue<Table>(buffer, indx, "aver", bigValue) === readValue<Table>(buffer, indx, "aver")', readValue<Table>(buffer, indx, 'aver'), readValue<Table>(buffer, indx, 'aver') === readValue<Table>(buffer, indx, 'aver'));
