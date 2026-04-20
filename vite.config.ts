import { defineConfig, type Plugin } from "vite";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { Application } from "typedoc";

async function generateDocs(): Promise<void> {
    if (!existsSync("./build/wasm.d.ts")) return;
    try {
        const app = await Application.bootstrapWithPlugins({});
        const project = await app.convert();
        if (project) {
            await app.generateDocs(project, "public/api-docs");
            console.log("[typedoc] ✓ /api-docs/");
        }
    } catch (e) {
        console.error("[typedoc] ✗", e);
    }
}

function wasmWatch(): Plugin {
    let building = false;
    let pendingRebuild = false;
    let debounce: ReturnType<typeof setTimeout> | null = null;

    function runWasmPack(): Promise<boolean> {
        return new Promise((resolve) => {
            console.log("\n[wasm] change detected — rebuilding…");
            const proc = spawn(
                "wasm-pack",
                ["build", "./wasm/", "--target", "web", "-d", "../build/"],
                { stdio: "inherit" },
            );
            proc.on("close", (code) => resolve(code === 0));
        });
    }

    async function rebuild(reload: () => void): Promise<void> {
        if (building) { pendingRebuild = true; return; }
        building = true;

        const ok = await runWasmPack();

        if (ok) {
            console.log("[wasm] ✓ build succeeded");
            await generateDocs();
            reload();
        } else {
            console.error("[wasm] ✗ build failed");
        }

        building = false;
        if (pendingRebuild) {
            pendingRebuild = false;
            rebuild(reload);
        }
    }

    return {
        name: "vite-plugin-wasm-watch",
        configureServer(server) {
            // Generate docs immediately if the wasm build already exists
            generateDocs().catch(console.error);

            server.watcher.add([
                "wasm/src/**/*.rs",
                "wasm/Cargo.toml",
                "wasm/Cargo.lock",
            ]);

            server.watcher.on("change", (file) => {
                if (!file.includes("/wasm/")) return;
                if (debounce) clearTimeout(debounce);
                debounce = setTimeout(
                    () => rebuild(() => server.ws.send({ type: "full-reload" })),
                    300,
                );
            });
        },
    };
}

export default defineConfig({
    plugins: [wasmWatch()],
    server: {
        hmr: false,
    },
    worker: {
        format: "es",
    },
});
