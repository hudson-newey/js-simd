use std::simd::u32x4;
use wasm_bindgen::prelude::*;

use super::utils::apply_simd;

#[wasm_bindgen]
pub fn simd_add(input: Vec<u32>, value: u32) -> Vec<u32> {
    let simd_value = u32x4::splat(value);
    apply_simd(input, |chunk| chunk + simd_value, |x| x + value)
}
