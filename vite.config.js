import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        about2: resolve(__dirname, "about2.html"),
        portfolio: resolve(__dirname, "portfolio.html"),
        shop: resolve(__dirname, "shop.html"),
        contact: resolve(__dirname, "contact.html"),
        engraving: resolve(__dirname, "engraving.html"),
        collection: resolve(__dirname, "collection.html"),
        product: resolve(__dirname, "product.html"),
        policies: resolve(__dirname, "policies.html"),
        pendants: resolve(__dirname, "pendants.html"),
      },
    },
    assetsInclude: [
      "**/*.webp",
      "**/*.webp",
      "**/*.webp",
      "**/*.svg",
      "**/*.gif",
    ],
    copyPublicDir: true,
  },
});
