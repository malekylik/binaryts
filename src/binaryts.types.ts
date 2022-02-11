type ExcludeFloat <T> = {
    [K in keyof T]: T[K] extends Int ? K : never;
}[keyof T];

type ExcludeInt <T> = {
    [K in keyof T]: T[K] extends Float ? K : never;
}[keyof T];

export type Int8  = number & { readonly __tag: unique symbol };
export type Int16 = number & { readonly __tag: unique symbol };
export type Int32 = number & { readonly __tag: unique symbol };
export type Float32 = number & { readonly __tag: unique symbol };

export type Int = Int8 | Int16 | Int32;
export type Float = Float32;

export type Struct = Record<string, Int | Float32>;

export declare function sizeof<T extends Struct>(): number;

export declare function readValue<T extends Struct>(buffer: Float32Array, elemenet: number, field: ExcludeInt<T>): number;
export declare function writeValue<T extends Struct>(buffer: Float32Array, elemenet: number, field: ExcludeInt<T>, value: number): void;

export declare function readValue<T extends Struct>(buffer: Int8Array, elemenet: number, field: ExcludeFloat<T>): number;
export declare function readValue<T extends Struct>(buffer: Uint8Array, elemenet: number, field: ExcludeFloat<T>): number;
export declare function readValue<T extends Struct>(buffer: Int16Array, elemenet: number, field: ExcludeFloat<T>): number;
export declare function readValue<T extends Struct>(buffer: Uint16Array, elemenet: number, field: ExcludeFloat<T>): number;
export declare function readValue<T extends Struct>(buffer: Int32Array, elemenet: number, field: ExcludeFloat<T>): number;
export declare function readValue<T extends Struct>(buffer: Uint32Array, elemenet: number, field: ExcludeFloat<T>): number;

export declare function writeValue<T extends Struct>(buffer: Int8Array, elemenet: number, field: ExcludeFloat<T>, value: number): void;
export declare function writeValue<T extends Struct>(buffer: Uint8Array, elemenet: number, field: ExcludeFloat<T>, value: number): void;
export declare function writeValue<T extends Struct>(buffer: Int16Array, elemenet: number, field: ExcludeFloat<T>, value: number): void;
export declare function writeValue<T extends Struct>(buffer: Uint16Array, elemenet: number, field: ExcludeFloat<T>, value: number): void;
export declare function writeValue<T extends Struct>(buffer: Int32Array, elemenet: number, field: ExcludeFloat<T>, value: number): void;
export declare function writeValue<T extends Struct>(buffer: Uint32Array, elemenet: number, field: ExcludeFloat<T>, value: number): void;
