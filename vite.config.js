import { defineConfig } from "vite";
import { resolve } from "path";
import fg from "fast-glob";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "cesiumStatic";

// Include both HTML and JSX entry points
const entries = fg.sync(["*.html", "src/**/*.jsx"], { cwd: __dirname });

const input = entries.reduce((acc, file) => {
	const name = file.replace(/\.(html|jsx)$/, "");
	acc[name] = resolve(__dirname, file);
	return acc;
}, {});

export default defineConfig({
	plugins: [
		react(),
		viteStaticCopy({
			targets: [
				{ src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
				{ src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
				{ src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
				{ src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
			],
		}),
	],
	define: {
		CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl),
	},
	build: {
		rollupOptions: {
			input,
			output: {
				// Fix for Cesium nested dependencies
				manualChunks: (id) => {
					if (id.includes("cesium")) return "cesium";
					if (id.includes("node_modules")) return "vendor";
				},
			},
		},
	},
	resolve: {
		alias: {
			// Add React-specific aliases if needed
			"@": resolve(__dirname, "./src"),
		},
	},
});
