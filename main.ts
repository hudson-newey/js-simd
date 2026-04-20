import initWasm, {
  u8_add,  u8_sub,  u8_mul,  u8_div,  u8_mod,
  u16_add, u16_sub, u16_mul, u16_div, u16_mod,
  u32_add, u32_sub, u32_mul, u32_div, u32_mod,
  i8_add,  i8_sub,  i8_mul,  i8_div,  i8_mod,
  i16_add, i16_sub, i16_mul, i16_div, i16_mod,
  i32_add, i32_sub, i32_mul, i32_div, i32_mod,
  f32_add, f32_sub, f32_mul, f32_div, f32_mod,
  f64_add, f64_sub, f64_mul, f64_div, f64_mod,
} from "./build/wasm";

await initWasm();

// ── Types ────────────────────────────────────────────────────────────────────

type AnyTypedArray =
  | Uint8Array | Uint16Array | Uint32Array
  | Int8Array  | Int16Array  | Int32Array
  | Float32Array | Float64Array;

type SimdFn = (arr: any, val: number) => AnyTypedArray;
type JsFn   = (arr: AnyTypedArray, val: number) => AnyTypedArray;

interface OpDef {
  name:  string;
  simd:  SimdFn;
  js:    JsFn;
  value: number;
}

interface TypeDef {
  name:    string;
  jsLabel: string;
  ctor:    new (n: number) => AnyTypedArray;
  ops:     OpDef[];
}

interface BenchResult {
  typeName: string;
  jsLabel:  string;
  opName:   string;
  jsMs:     number;
  simdMs:   number;
  speedup:  number;
}

// ── JS reference implementations ─────────────────────────────────────────────

function makeJsFn(op: (a: number, b: number) => number): JsFn {
  return (arr, val) => {
    const out = new (arr.constructor as any)(arr.length) as AnyTypedArray;
    for (let i = 0; i < arr.length; i++) (out as any)[i] = op((arr as any)[i], val);
    return out;
  };
}

const jsAdd = makeJsFn((a, b) => a + b);
const jsSub = makeJsFn((a, b) => a - b);
const jsMul = makeJsFn((a, b) => a * b);
const jsDiv = makeJsFn((a, b) => a / b);
const jsMod = makeJsFn((a, b) => a % b);

// ── Benchmark config ──────────────────────────────────────────────────────────

function makeOps(
  add: SimdFn, sub: SimdFn, mul: SimdFn, div: SimdFn, mod: SimdFn,
): OpDef[] {
  return [
    { name: "add", simd: add, js: jsAdd, value: 7 },
    { name: "sub", simd: sub, js: jsSub, value: 3 },
    { name: "mul", simd: mul, js: jsMul, value: 3 },
    { name: "div", simd: div, js: jsDiv, value: 4 },
    { name: "mod", simd: mod, js: jsMod, value: 7 },
  ];
}

const TYPES: TypeDef[] = [
  { name: "u8",  jsLabel: "Uint8Array",   ctor: Uint8Array,   ops: makeOps(u8_add,  u8_sub,  u8_mul,  u8_div,  u8_mod)  },
  { name: "u16", jsLabel: "Uint16Array",  ctor: Uint16Array,  ops: makeOps(u16_add, u16_sub, u16_mul, u16_div, u16_mod) },
  { name: "u32", jsLabel: "Uint32Array",  ctor: Uint32Array,  ops: makeOps(u32_add, u32_sub, u32_mul, u32_div, u32_mod) },
  { name: "i8",  jsLabel: "Int8Array",    ctor: Int8Array,    ops: makeOps(i8_add,  i8_sub,  i8_mul,  i8_div,  i8_mod)  },
  { name: "i16", jsLabel: "Int16Array",   ctor: Int16Array,   ops: makeOps(i16_add, i16_sub, i16_mul, i16_div, i16_mod) },
  { name: "i32", jsLabel: "Int32Array",   ctor: Int32Array,   ops: makeOps(i32_add, i32_sub, i32_mul, i32_div, i32_mod) },
  { name: "f32", jsLabel: "Float32Array", ctor: Float32Array, ops: makeOps(f32_add, f32_sub, f32_mul, f32_div, f32_mod) },
  { name: "f64", jsLabel: "Float64Array", ctor: Float64Array, ops: makeOps(f64_add, f64_sub, f64_mul, f64_div, f64_mod) },
];

// ── Timing ────────────────────────────────────────────────────────────────────

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function timeMs(fn: () => void, runs: number): number {
  fn(); // warmup (not counted)
  const samples: number[] = [];
  for (let i = 0; i < runs; i++) {
    const t = performance.now();
    fn();
    samples.push(performance.now() - t);
  }
  return median(samples);
}

// ── DOM helpers ───────────────────────────────────────────────────────────────

const $  = (id: string) => document.getElementById(id)!;
const setStatus = (msg: string) => { $("status").textContent = msg; };

function appendSeparatorRow(firstRow: boolean): void {
  if (firstRow) return;
  const tbody = $("tbody");
  const tr = document.createElement("tr");
  tr.className = "separator";
  tr.innerHTML = `<td colspan="6"></td>`;
  tbody.appendChild(tr);
}

function appendRow(r: BenchResult, delay: number): void {
  const tbody = $("tbody");
  const tr    = document.createElement("tr");
  tr.style.animationDelay = `${delay}ms`;

  const speedupClass =
    r.speedup >= 1.5  ? "fast"
    : r.speedup >= 1.1 ? "ok"
    : r.speedup >= 0.9 ? "neutral"
    : "slow";

  const speedupLabel =
    r.speedup >= 1.05 ? `${r.speedup.toFixed(2)}× faster`
    : r.speedup <= 0.95 ? `${(1 / r.speedup).toFixed(2)}× slower`
    : "≈ same";

  tr.innerHTML = `
    <td class="col-type">${r.typeName}</td>
    <td class="col-jslabel">${r.jsLabel}</td>
    <td class="col-op">${r.opName}</td>
    <td class="col-num">${r.jsMs.toFixed(3)}</td>
    <td class="col-num">${r.simdMs.toFixed(3)}</td>
    <td class="col-speedup ${speedupClass}">${speedupLabel}</td>
  `;
  tbody.appendChild(tr);
}

function showSummary(results: BenchResult[]): void {
  const avg  = results.reduce((s, r) => s + r.speedup, 0) / results.length;
  const best = results.reduce((a, b) => b.speedup > a.speedup ? b : a);
  const worst = results.reduce((a, b) => b.speedup < a.speedup ? b : a);

  const el = $("summary");
  el.innerHTML =
    `Median speedup across all benchmarks: <strong>${avg.toFixed(2)}×</strong>`
    + ` &nbsp;|&nbsp; Best: <strong>${best.speedup.toFixed(2)}×</strong>`
    + ` on <strong>${best.typeName} ${best.opName}</strong>`
    + ` &nbsp;|&nbsp; Worst: <strong>${worst.speedup.toFixed(2)}×</strong>`
    + ` on <strong>${worst.typeName} ${worst.opName}</strong>`;
  el.classList.remove("hidden");
}

// ── Benchmark runner ──────────────────────────────────────────────────────────

async function runBenchmarks(arraySize: number, runs: number): Promise<void> {
  $("tbody").innerHTML   = "";
  $("summary").classList.add("hidden");
  $("results").classList.remove("hidden");

  const allResults: BenchResult[] = [];
  let rowDelay = 0;

  for (let ti = 0; ti < TYPES.length; ti++) {
    const td  = TYPES[ti];
    const arr = new td.ctor(arraySize);

    // Fill with values 1–50 to stay within signed i8 range after mul×3
    for (let i = 0; i < arr.length; i++) (arr as any)[i] = (i % 50) + 1;

    appendSeparatorRow(ti === 0);

    for (const op of td.ops) {
      setStatus(`Benchmarking ${td.name}_${op.name}  (${ti * td.ops.length + 1} / ${TYPES.length * td.ops.length})…`);
      await new Promise(r => setTimeout(r, 0)); // yield → UI repaint

      const jsMs   = timeMs(() => op.js(arr, op.value),   runs);
      const simdMs = timeMs(() => op.simd(arr, op.value), runs);

      const result: BenchResult = {
        typeName: td.name,
        jsLabel:  td.jsLabel,
        opName:   op.name,
        jsMs,
        simdMs,
        speedup: jsMs / simdMs,
      };

      allResults.push(result);
      appendRow(result, rowDelay);
      rowDelay += 30;
    }
  }

  showSummary(allResults);
  setStatus("✓ Done");
}

// ── Wire up ───────────────────────────────────────────────────────────────────

$("runBtn").addEventListener("click", async () => {
  const arraySize = parseInt(($("arraySize") as HTMLSelectElement).value);
  const runs      = parseInt(($("runs")      as HTMLSelectElement).value);

  const btn = $("runBtn") as HTMLButtonElement;
  btn.disabled    = true;
  btn.textContent = "⏳  Running…";

  try {
    await runBenchmarks(arraySize, runs);
  } finally {
    btn.disabled    = false;
    btn.textContent = "▶  Run Again";
  }
});

