import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@/components": path.resolve(__dirname, "resources/js/components"),
            "@/layouts": path.resolve(__dirname, "resources/js/layouts"),
            "@/pages": path.resolve(__dirname, "resources/js/pages"),
            "@utils": path.resolve(__dirname, "resources/js/utils"),
            "@/lib": path.resolve(__dirname, "resources/js/lib"),
        },
    },
});
