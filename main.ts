import initWasm, {
  simd_add,
  simd_sub,
  simd_mod,
  simd_mul,
  simd_div,
} from "./build/wasm";

await initWasm();
