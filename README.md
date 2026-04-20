# JS SIMD

Bringing seamless SIMD to JavaScript

## Usage

```sh
$ npm install @hudson-newey/js-simd
>
```

```ts
import initWasm, {
  i32_add,
  i32_sub,
  i32_mul,
  i32_div,
  i32_mod,
} from "./build/wasm";

await initWasm();

// Add two 32-bit integers
const a = ;
const resultAdd = i32_add(
 Uint32Array.from([1, 2, 3, 4]),
 42,
);
console.log("Addition Result:", resultAdd);
// [43, 44, 45, 46]

const resultSub = i32_sub(
  Uint32Array.from([1, 2, 3, 4]),
  42,
);
console.log("Subtraction Result:", resultSub);
// // [-41, -40, -39, -38]
```
