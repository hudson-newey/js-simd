/**
 * WASM SIMD — scalar arithmetic over JavaScript typed arrays.
 *
 * Each function applies a `value` to every element of the input array using
 * Rust's portable SIMD (128-bit vectors) compiled to WebAssembly.
 * The input array is **not** mutated; a new typed array of the same type is returned.
 *
 * **SIMD lane widths (128-bit registers):**
 * | Type group | JS Array      | SIMD lanes |
 * |------------|---------------|-----------|
 * | `u8`/`i8`  | `(U)Int8Array`  | 16        |
 * | `u16`/`i16`| `(U)Int16Array` | 8         |
 * | `u32`/`i32`/`f32` | `(U)Int32Array`, `Float32Array` | 4 |
 * | `f64`      | `Float64Array`  | 2         |
 *
 * @module
 */

// ── u8 — Uint8Array (16-lane SIMD) ───────────────────────────────────────────

/** Adds `value` to every element. @group u8 — Uint8Array */
export { u8_add } from "../build/js_simd";
/** Subtracts `value` from every element. @group u8 — Uint8Array */
export { u8_sub } from "../build/js_simd";
/** Multiplies every element by `value`. @group u8 — Uint8Array */
export { u8_mul } from "../build/js_simd";
/** Divides every element by `value`. @group u8 — Uint8Array */
export { u8_div } from "../build/js_simd";
/** Remainder of every element divided by `value`. @group u8 — Uint8Array */
export { u8_mod } from "../build/js_simd";

// ── u16 — Uint16Array (8-lane SIMD) ──────────────────────────────────────────

/** Adds `value` to every element. @group u16 — Uint16Array */
export { u16_add } from "../build/js_simd";
/** Subtracts `value` from every element. @group u16 — Uint16Array */
export { u16_sub } from "../build/js_simd";
/** Multiplies every element by `value`. @group u16 — Uint16Array */
export { u16_mul } from "../build/js_simd";
/** Divides every element by `value`. @group u16 — Uint16Array */
export { u16_div } from "../build/js_simd";
/** Remainder of every element divided by `value`. @group u16 — Uint16Array */
export { u16_mod } from "../build/js_simd";

// ── u32 — Uint32Array (4-lane SIMD) ──────────────────────────────────────────

/** Adds `value` to every element. @group u32 — Uint32Array */
export { u32_add } from "../build/js_simd";
/** Subtracts `value` from every element. @group u32 — Uint32Array */
export { u32_sub } from "../build/js_simd";
/** Multiplies every element by `value`. @group u32 — Uint32Array */
export { u32_mul } from "../build/js_simd";
/** Divides every element by `value`. @group u32 — Uint32Array */
export { u32_div } from "../build/js_simd";
/** Remainder of every element divided by `value`. @group u32 — Uint32Array */
export { u32_mod } from "../build/js_simd";

// ── i8 — Int8Array (16-lane SIMD) ────────────────────────────────────────────

/** Adds `value` to every element. @group i8 — Int8Array */
export { i8_add } from "../build/js_simd";
/** Subtracts `value` from every element. @group i8 — Int8Array */
export { i8_sub } from "../build/js_simd";
/** Multiplies every element by `value`. @group i8 — Int8Array */
export { i8_mul } from "../build/js_simd";
/** Divides every element by `value`. @group i8 — Int8Array */
export { i8_div } from "../build/js_simd";
/** Remainder of every element divided by `value`. @group i8 — Int8Array */
export { i8_mod } from "../build/js_simd";

// ── i16 — Int16Array (8-lane SIMD) ───────────────────────────────────────────

/** Adds `value` to every element. @group i16 — Int16Array */
export { i16_add } from "../build/js_simd";
/** Subtracts `value` from every element. @group i16 — Int16Array */
export { i16_sub } from "../build/js_simd";
/** Multiplies every element by `value`. @group i16 — Int16Array */
export { i16_mul } from "../build/js_simd";
/** Divides every element by `value`. @group i16 — Int16Array */
export { i16_div } from "../build/js_simd";
/** Remainder of every element divided by `value`. @group i16 — Int16Array */
export { i16_mod } from "../build/js_simd";

// ── i32 — Int32Array (4-lane SIMD) ───────────────────────────────────────────

/** Adds `value` to every element. @group i32 — Int32Array */
export { i32_add } from "../build/js_simd";
/** Subtracts `value` from every element. @group i32 — Int32Array */
export { i32_sub } from "../build/js_simd";
/** Multiplies every element by `value`. @group i32 — Int32Array */
export { i32_mul } from "../build/js_simd";
/** Divides every element by `value`. @group i32 — Int32Array */
export { i32_div } from "../build/js_simd";
/** Remainder of every element divided by `value`. @group i32 — Int32Array */
export { i32_mod } from "../build/js_simd";

// ── f32 — Float32Array (4-lane SIMD) ─────────────────────────────────────────

/** Adds `value` to every element. @group f32 — Float32Array */
export { f32_add } from "../build/js_simd";
/** Subtracts `value` from every element. @group f32 — Float32Array */
export { f32_sub } from "../build/js_simd";
/** Multiplies every element by `value`. @group f32 — Float32Array */
export { f32_mul } from "../build/js_simd";
/** Divides every element by `value`. @group f32 — Float32Array */
export { f32_div } from "../build/js_simd";
/** IEEE 754 remainder of every element divided by `value`. @group f32 — Float32Array */
export { f32_mod } from "../build/js_simd";

// ── f64 — Float64Array (2-lane SIMD) ─────────────────────────────────────────

/** Adds `value` to every element. @group f64 — Float64Array */
export { f64_add } from "../build/js_simd";
/** Subtracts `value` from every element. @group f64 — Float64Array */
export { f64_sub } from "../build/js_simd";
/** Multiplies every element by `value`. @group f64 — Float64Array */
export { f64_mul } from "../build/js_simd";
/** Divides every element by `value`. @group f64 — Float64Array */
export { f64_div } from "../build/js_simd";
/** IEEE 754 remainder of every element divided by `value`. @group f64 — Float64Array */
export { f64_mod } from "../build/js_simd";
