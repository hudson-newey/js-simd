use std::simd::{f32x4, f64x2, i16x8, i32x4, i8x16, u16x8, u32x4, u8x16};
use wasm_bindgen::prelude::*;

macro_rules! impl_simd_ops {
    ($prefix:ident, $simd_type:ty, $lanes:expr) => {
        paste::paste! {
            fn [<apply_simd_ $prefix>](
                input: Vec<$prefix>,
                simd_op: impl Fn($simd_type) -> $simd_type,
                scalar_op: impl Fn($prefix) -> $prefix,
            ) -> Vec<$prefix> {
                let mut output = input;
                let chunks = output.len() / $lanes;

                for i in 0..chunks {
                    let offset = i * $lanes;
                    let chunk = <$simd_type>::from_slice(&output[offset..offset + $lanes]);
                    let result = simd_op(chunk);
                    output[offset..offset + $lanes].copy_from_slice(result.as_array());
                }

                for elem in output[chunks * $lanes..].iter_mut() {
                    *elem = scalar_op(*elem);
                }

                output
            }

            #[wasm_bindgen]
            pub fn [<$prefix _add>](input: Vec<$prefix>, value: $prefix) -> Vec<$prefix> {
                let simd_value = <$simd_type>::splat(value);
                [<apply_simd_ $prefix>](input, |chunk| chunk + simd_value, |x| x + value)
            }

            #[wasm_bindgen]
            pub fn [<$prefix _sub>](input: Vec<$prefix>, value: $prefix) -> Vec<$prefix> {
                let simd_value = <$simd_type>::splat(value);
                [<apply_simd_ $prefix>](input, |chunk| chunk - simd_value, |x| x - value)
            }

            #[wasm_bindgen]
            pub fn [<$prefix _mul>](input: Vec<$prefix>, value: $prefix) -> Vec<$prefix> {
                let simd_value = <$simd_type>::splat(value);
                [<apply_simd_ $prefix>](input, |chunk| chunk * simd_value, |x| x * value)
            }

            #[wasm_bindgen]
            pub fn [<$prefix _div>](input: Vec<$prefix>, value: $prefix) -> Vec<$prefix> {
                let simd_value = <$simd_type>::splat(value);
                [<apply_simd_ $prefix>](input, |chunk| chunk / simd_value, |x| x / value)
            }

            #[wasm_bindgen]
            pub fn [<$prefix _mod>](input: Vec<$prefix>, value: $prefix) -> Vec<$prefix> {
                let simd_value = <$simd_type>::splat(value);
                [<apply_simd_ $prefix>](input, |chunk| chunk % simd_value, |x| x % value)
            }
        }
    };
}

impl_simd_ops!(u8, u8x16, 16);
impl_simd_ops!(u16, u16x8, 8);
impl_simd_ops!(u32, u32x4, 4);
impl_simd_ops!(i8, i8x16, 16);
impl_simd_ops!(i16, i16x8, 8);
impl_simd_ops!(i32, i32x4, 4);
impl_simd_ops!(f32, f32x4, 4);
impl_simd_ops!(f64, f64x2, 2);
