use std::simd::u32x4;

pub(crate) fn apply_simd(
    input: Vec<u32>,
    simd_op: impl Fn(u32x4) -> u32x4,
    scalar_op: impl Fn(u32) -> u32,
) -> Vec<u32> {
    let mut output = input;
    let chunks = output.len() / 4;

    for i in 0..chunks {
        let offset = i * 4;
        let chunk = u32x4::from_slice(&output[offset..offset + 4]);
        let result = simd_op(chunk);
        output[offset..offset + 4].copy_from_slice(result.as_array());
    }

    for elem in output[chunks * 4..].iter_mut() {
        *elem = scalar_op(*elem);
    }

    output
}
