import { defineConfig } from "vite";
import { resolve } from "path";
import fg from "fast-glob";
import { viteStaticCopy } from "vite-plugin-static-copy";

const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "cesiumStatic";

// Use fast-glob to locate all top-level HTML files.
const htmlFiles = fg.sync("*.html", { cwd: __dirname });

// Build an entry object for Rollup's input.
// Here, we use the filename (without extension) as the key.
const input = htmlFiles.reduce((entries, file) => {
	const name = file.replace(/\.html$/, "");
	entries[name] = resolve(__dirname, file);
	return entries;
}, {});

export default defineConfig({
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
				{ src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
				{ src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
				{ src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
			],
		}),
	],
	// Define additional Cesium-specific configurations
	define: {
		CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl),
	},
	build: {
		// The rollupOptions.input setting makes your build multi-page
		rollupOptions: {
			input,
		},
	},
});
