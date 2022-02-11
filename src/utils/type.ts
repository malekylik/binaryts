export enum SupportedTypes {
  Int8 =  'Int8',
  Int16 = 'Int16',
  Int32 = 'Int32',

  Float32 = 'Float32',
}

export function getTypeSizeInBytes(type: SupportedTypes): number {
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

export function align(size: number, alignment: number): number {
  return (size + alignment - 1) & ~(alignment - 1);
}
