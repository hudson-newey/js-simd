# JS SIMD

Fast, tree shakeable SIMD in JavaScript + WASM

## Usage

```sh
$ npm install @hudson-newey/js-simd
>
```

```ts
// main.ts
import initWasm, {
  i32_add,
  i32_sub,
  i32_mul,
  i32_div,
  i32_mod,
} from "./build/wasm";

await initWasm();

// Adding a value to each element in an Uint32Array using a single instruction
const resultAdd = i32_add(
 Uint32Array.from([1, 2, 3, 4]),
 42,
);
console.log("Addition Result:", resultAdd);
// [43, 44, 45, 46]

// Subtracting a value from each element in an Uint32Array using a single instruction
const resultSub = i32_sub(
  Uint32Array.from([1, 2, 3, 4]),
  42,
);
console.log("Subtraction Result:", resultSub);
// // [-41, -40, -39, -38]
```
