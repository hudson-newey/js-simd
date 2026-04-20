import initWasm, {
  u32_add,
  u32_sub,
  u32_mod,
  u32_mul,
  u32_div,
} from "./build/wasm";

await initWasm();
