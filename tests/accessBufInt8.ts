import { Float32, Int16, Int32, Int8, readValue, sizeof, writeValue } from '../src/binaryts.types';

type Table = {
  byte: Int32;
  x: Int8;
  y: Int8;
  prev: Int32;
  current: Int16;
  aver: Float32;
};

const ubuffer = new Uint8Array(sizeof<Table>() * 10);
const buffer = new Int8Array(sizeof<Table>() * 10);

const indx = 1;
const value = 128;
const bigValue = 33577969;

console.log('----Uint8Array----');

console.log('----Int8----');
writeValue<Table>(ubuffer, 2, 'x', value);
readValue<Table>(ubuffer, 2, 'x');

console.log('writeValue<Table>(ubuffer, 2, "x", value) === readValue<Table>(ubuffer, 2, "x")', readValue<Table>(ubuffer, 2, 'x'), value === readValue<Table>(ubuffer, 2, 'x'));

writeValue<Table>(ubuffer, indx, 'x', value);
readValue<Table>(ubuffer, indx, 'x');

console.log('writeValue<Table>(ubuffer, indx, "x", value) === readValue<Table>(ubuffer, indx, "x")', readValue<Table>(ubuffer, indx, 'x'), value === readValue<Table>(ubuffer, indx, 'x'));

writeValue<Table>(ubuffer, 2, 'x', bigValue);
readValue<Table>(ubuffer, 2, 'x');

console.log('writeValue<Table>(ubuffer, 2, "x", bigValue) === readValue<Table>(ubuffer, 2, "x")', readValue<Table>(ubuffer, 2, 'x'), (bigValue & 0xFF) === readValue<Table>(ubuffer, 2, 'x'));

writeValue<Table>(ubuffer, indx, 'x', bigValue);
readValue<Table>(ubuffer, indx, 'x');

console.log('writeValue<Table>(ubuffer, indx, "x", bigValue) === readValue<Table>(ubuffer, indx, "x")', readValue<Table>(ubuffer, indx, 'x'), (bigValue & 0xFF) === readValue<Table>(ubuffer, indx, 'x'));

console.log('----Int16----');
writeValue<Table>(ubuffer, 2, 'current', value);
readValue<Table>(ubuffer, 2, 'current');

console.log('writeValue<Table>(ubuffer, 2, "current", value) === readValue<Table>(ubuffer, 2, "current")', readValue<Table>(ubuffer, 2, 'current'), value === readValue<Table>(ubuffer, 2, 'current'));

writeValue<Table>(ubuffer, indx, 'current', value);
readValue<Table>(ubuffer, indx, 'current');

console.log('writeValue<Table>(ubuffer, indx, "current", value) === readValue<Table>(ubuffer, indx, "current")', readValue<Table>(ubuffer, indx, 'current'), value === readValue<Table>(ubuffer, indx, 'current'));

writeValue<Table>(ubuffer, 2, 'current', bigValue);
readValue<Table>(ubuffer, 2, 'current');

console.log('writeValue<Table>(ubuffer, 2, "current", bigValue) === readValue<Table>(ubuffer, 2, "current")', readValue<Table>(ubuffer, 2, 'current'), (bigValue & 0xFFFF) === readValue<Table>(ubuffer, 2, 'current'));

writeValue<Table>(ubuffer, indx, 'current', bigValue);
readValue<Table>(ubuffer, indx, 'current');

console.log('writeValue<Table>(ubuffer, indx, "current", bigValue) === readValue<Table>(ubuffer, indx, "current")', readValue<Table>(ubuffer, indx, 'current'), (bigValue & 0xFFFF) === readValue<Table>(ubuffer, indx, 'current'));

console.log('----Int32----');
writeValue<Table>(ubuffer, 2, 'prev', value);
readValue<Table>(ubuffer, 2, 'prev');

console.log('writeValue<Table>(ubuffer, 2, "prev", value) === readValue<Table>(ubuffer, 2, "prev")', readValue<Table>(ubuffer, 2, 'prev'), value === readValue<Table>(ubuffer, 2, 'prev'));

writeValue<Table>(ubuffer, indx, 'prev', value);
readValue<Table>(ubuffer, indx, 'prev');

console.log('writeValue<Table>(ubuffer, indx, "prev", value) === readValue<Table>(ubuffer, indx, "prev")', readValue<Table>(ubuffer, indx, 'prev'), value === readValue<Table>(ubuffer, indx, 'prev'));

writeValue<Table>(ubuffer, 2, 'prev', bigValue);
readValue<Table>(ubuffer, 2, 'prev');

console.log('writeValue<Table>(ubuffer, 2, "prev", bigValue) === readValue<Table>(ubuffer, 2, "prev")', readValue<Table>(ubuffer, 2, 'prev'), bigValue === readValue<Table>(ubuffer, 2, 'prev'));

writeValue<Table>(ubuffer, indx, 'prev', bigValue);
readValue<Table>(ubuffer, indx, 'prev');

console.log('writeValue<Table>(ubuffer, indx, "prev", bigValue) === readValue<Table>(ubuffer, indx, "prev")', readValue<Table>(ubuffer, indx, 'prev'), bigValue === readValue<Table>(ubuffer, indx, 'prev'));


console.log('----Int8Array----');

console.log('----Int8----');
writeValue<Table>(buffer, 2, 'x', value);
readValue<Table>(buffer, 2, 'x');

console.log('writeValue<Table>(buffer, 2, "x", value) === readValue<Table>(buffer, 2, "x")', readValue<Table>(buffer, 2, 'x'), value === readValue<Table>(buffer, 2, 'x'));

writeValue<Table>(buffer, indx, 'x', value);
readValue<Table>(buffer, indx, 'x');

console.log('writeValue<Table>(buffer, indx, "x", value) === readValue<Table>(buffer, indx, "x")', readValue<Table>(buffer, indx, 'x'), value === readValue<Table>(buffer, indx, 'x'));

writeValue<Table>(buffer, 2, 'x', bigValue);
readValue<Table>(buffer, 2, 'x');

console.log('writeValue<Table>(buffer, 2, "x", bigValue) === readValue<Table>(buffer, 2, "x")', readValue<Table>(buffer, 2, 'x'), (bigValue & 0xFF) === readValue<Table>(buffer, 2, 'x'));

writeValue<Table>(buffer, indx, 'x', bigValue);
readValue<Table>(buffer, indx, 'x');

console.log('writeValue<Table>(buffer, indx, "x", bigValue) === readValue<Table>(buffer, indx, "x")', readValue<Table>(buffer, indx, 'x'), (bigValue & 0xFF) === readValue<Table>(buffer, indx, 'x'));

console.log('----Int16----');
writeValue<Table>(buffer, 2, 'current', value);
readValue<Table>(buffer, 2, 'current');

console.log('writeValue<Table>(buffer, 2, "current", value) === readValue<Table>(buffer, 2, "current")', readValue<Table>(buffer, 2, 'current'), value === readValue<Table>(buffer, 2, 'current'));

writeValue<Table>(buffer, indx, 'current', value);
readValue<Table>(buffer, indx, 'current');

console.log('writeValue<Table>(buffer, indx, "current", value) === readValue<Table>(buffer, indx, "current")', readValue<Table>(buffer, indx, 'current'), value === readValue<Table>(buffer, indx, 'current'));

writeValue<Table>(buffer, 2, 'current', bigValue);
readValue<Table>(buffer, 2, 'current');

console.log('writeValue<Table>(buffer, 2, "current", bigValue) === readValue<Table>(buffer, 2, "current")', readValue<Table>(buffer, 2, 'current'), (bigValue & 0xFFFF) === readValue<Table>(buffer, 2, 'current'));

writeValue<Table>(buffer, indx, 'current', bigValue);
readValue<Table>(buffer, indx, 'current');

console.log('writeValue<Table>(buffer, indx, "current", bigValue) === readValue<Table>(buffer, indx, "current")', readValue<Table>(buffer, indx, 'current'), (bigValue & 0xFFFF) === readValue<Table>(buffer, indx, 'current'));

console.log('----Int32----');
writeValue<Table>(buffer, 2, 'prev', value);
readValue<Table>(buffer, 2, 'prev');

console.log('writeValue<Table>(buffer, 2, "prev", value) === readValue<Table>(buffer, 2, "prev")', readValue<Table>(buffer, 2, 'prev'), value === readValue<Table>(buffer, 2, 'prev'));

writeValue<Table>(buffer, indx, 'prev', value);
readValue<Table>(buffer, indx, 'prev');

console.log('writeValue<Table>(buffer, indx, "prev", value) === readValue<Table>(buffer, indx, "prev")', readValue<Table>(buffer, indx, 'prev'), value === readValue<Table>(buffer, indx, 'prev'));

writeValue<Table>(buffer, 2, 'prev', bigValue);
readValue<Table>(buffer, 2, 'prev');

console.log('writeValue<Table>(buffer, 2, "prev", bigValue) === readValue<Table>(buffer, 2, "prev")', readValue<Table>(buffer, 2, 'prev'), bigValue === readValue<Table>(buffer, 2, 'prev'));

writeValue<Table>(buffer, indx, 'prev', bigValue);
readValue<Table>(buffer, indx, 'prev');

console.log('writeValue<Table>(buffer, indx, "prev", bigValue) === readValue<Table>(buffer, indx, "prev")', readValue<Table>(buffer, indx, 'prev'), bigValue === readValue<Table>(buffer, indx, 'prev'));

