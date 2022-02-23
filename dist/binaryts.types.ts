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

export declare function readValue<T extends Struct>(buffer: Float32Array, element: number, field: ExcludeInt<T>): number;
export declare function writeValue<T extends Struct>(buffer: Float32Array, element: number, field: ExcludeInt<T>, value: number): void;

export declare function readValue<T extends Struct>(buffer: Int8Array, element: number, field: ExcludeFloat<T>): number;
export declare function readValue<T extends Struct>(buffer: Uint8Array, element: number, field: ExcludeFloat<T>): number;
export declare function readValue<T extends Struct>(buffer: Int16Array, element: number, field: ExcludeFloat<T>): number;
export declare function readValue<T extends Struct>(buffer: Uint16Array, element: number, field: ExcludeFloat<T>): number;
export declare function readValue<T extends Struct>(buffer: Int32Array, element: number, field: ExcludeFloat<T>): number;
export declare function readValue<T extends Struct>(buffer: Uint32Array, element: number, field: ExcludeFloat<T>): number;

export declare function writeValue<T extends Struct>(buffer: Int8Array, element: number, field: ExcludeFloat<T>, value: number): void;
export declare function writeValue<T extends Struct>(buffer: Uint8Array, element: number, field: ExcludeFloat<T>, value: number): void;
export declare function writeValue<T extends Struct>(buffer: Int16Array, element: number, field: ExcludeFloat<T>, value: number): void;
export declare function writeValue<T extends Struct>(buffer: Uint16Array, element: number, field: ExcludeFloat<T>, value: number): void;
export declare function writeValue<T extends Struct>(buffer: Int32Array, element: number, field: ExcludeFloat<T>, value: number): void;
export declare function writeValue<T extends Struct>(buffer: Uint32Array, element: number, field: ExcludeFloat<T>, value: number): void;

export declare function readValueStruct<T extends Struct>(buffer: Float32Array, base: number, field: ExcludeInt<T>): number; // address->field
export declare function writeValueStruct<T extends Struct>(buffer: Float32Array, base: number, field: ExcludeInt<T>, value: number): void; // (address + Strcuct * element)->field

export declare function loadEffectiveAddress<T extends Struct>(base: number, field: keyof T): number; // Strcuct * element)->field
export declare function loadEffectiveAddress<T extends Struct>(base: number, element: number, field: keyof T): number;

// leal 8(%edx,%eax,4), %eax Set %eax to &r->a[i]
// 8 offset of array a
// edx address of r
// eax index
// 4 (bytes) size of element of a
