// vite.config.ts
import { defineConfig } from "file:///Users/emilmarkov/dev/tauri/VEK-Launcher/node_modules/vite/dist/node/index.js";
import react from "file:///Users/emilmarkov/dev/tauri/VEK-Launcher/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_dirname = "/Users/emilmarkov/dev/tauri/VEK-Launcher";
var __vite_injected_original_import_meta_url = "file:///Users/emilmarkov/dev/tauri/VEK-Launcher/vite.config.ts";
var config = async () => {
  return {
    plugins: [react()],
    clearScreen: false,
    server: {
      port: 1420,
      strictPort: true
    },
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      target: "esnext",
      minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
      sourcemap: !!process.env.TAURI_DEBUG,
      rollupOptions: {
        input: {
          main: resolve(__vite_injected_original_dirname, "src/pages/index.html"),
          splashscreen: resolve(__vite_injected_original_dirname, "src/pages/splashscreen.html")
        }
      }
    },
    resolve: {
      alias: {
        "@": resolve(__vite_injected_original_dirname, "src"),
        "@assets": resolve(__vite_injected_original_dirname, "src/assets"),
        "@components": resolve(__vite_injected_original_dirname, "src/components"),
        "@pages": resolve(__vite_injected_original_dirname, "src/pages"),
        "@services": resolve(__vite_injected_original_dirname, "src/services"),
        "@store": resolve(__vite_injected_original_dirname, "src/store"),
        "@styles": resolve(__vite_injected_original_dirname, "src/styles"),
        "@fonts": resolve(__vite_injected_original_dirname, "src/assets/fonts"),
        "@utils": resolve(__vite_injected_original_dirname, "src/utils"),
        "webtorrent": fileURLToPath(new URL("./node_modules/webtorrent/dist/webtorrent.min.js", __vite_injected_original_import_meta_url))
      }
    }
  };
};
var vite_config_default = defineConfig(config);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZW1pbG1hcmtvdi9kZXYvdGF1cmkvVkVLLUxhdW5jaGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZW1pbG1hcmtvdi9kZXYvdGF1cmkvVkVLLUxhdW5jaGVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9lbWlsbWFya292L2Rldi90YXVyaS9WRUstTGF1bmNoZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIFVzZXJDb25maWdFeHBvcnQgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcblxuY29uc3QgY29uZmlnOiBVc2VyQ29uZmlnRXhwb3J0ID0gYXN5bmMgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgICBjbGVhclNjcmVlbjogZmFsc2UsXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiAxNDIwLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICB9LFxuICAgIGVudlByZWZpeDogW1wiVklURV9cIiwgXCJUQVVSSV9cIl0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHRhcmdldDogXCJlc25leHRcIixcbiAgICAgIG1pbmlmeTogIXByb2Nlc3MuZW52LlRBVVJJX0RFQlVHID8gXCJlc2J1aWxkXCIgOiBmYWxzZSxcbiAgICAgIHNvdXJjZW1hcDogISFwcm9jZXNzLmVudi5UQVVSSV9ERUJVRyxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgICBtYWluOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wYWdlcy9pbmRleC5odG1sJyksXG4gICAgICAgICAgc3BsYXNoc2NyZWVuOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wYWdlcy9zcGxhc2hzY3JlZW4uaHRtbCcpXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgICAnQGFzc2V0cyc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2Fzc2V0cycpLFxuICAgICAgICAnQGNvbXBvbmVudHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb21wb25lbnRzJyksXG4gICAgICAgICdAcGFnZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wYWdlcycpLFxuICAgICAgICAnQHNlcnZpY2VzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvc2VydmljZXMnKSxcbiAgICAgICAgJ0BzdG9yZSc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3N0b3JlJyksXG4gICAgICAgICdAc3R5bGVzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvc3R5bGVzJyksXG4gICAgICAgICdAZm9udHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9hc3NldHMvZm9udHMnKSxcbiAgICAgICAgJ0B1dGlscyc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3V0aWxzJyksXG4gICAgICAgICd3ZWJ0b3JyZW50JzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL25vZGVfbW9kdWxlcy93ZWJ0b3JyZW50L2Rpc3Qvd2VidG9ycmVudC5taW4uanMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhjb25maWcpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUyxTQUFTLG9CQUFzQztBQUN6VixPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLFNBQVMscUJBQXFCO0FBSDlCLElBQU0sbUNBQW1DO0FBQStJLElBQU0sMkNBQTJDO0FBS3pPLElBQU0sU0FBMkIsWUFBWTtBQUMzQyxTQUFPO0FBQUEsSUFDTCxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsSUFDakIsYUFBYTtBQUFBLElBQ2IsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLElBQ2Q7QUFBQSxJQUNBLFdBQVcsQ0FBQyxTQUFTLFFBQVE7QUFBQSxJQUM3QixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixRQUFRLENBQUMsUUFBUSxJQUFJLGNBQWMsWUFBWTtBQUFBLE1BQy9DLFdBQVcsQ0FBQyxDQUFDLFFBQVEsSUFBSTtBQUFBLE1BQ3pCLGVBQWU7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNMLE1BQU0sUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxVQUMvQyxjQUFjLFFBQVEsa0NBQVcsNkJBQTZCO0FBQUEsUUFDaEU7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxRQUM3QixXQUFXLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQzFDLGVBQWUsUUFBUSxrQ0FBVyxnQkFBZ0I7QUFBQSxRQUNsRCxVQUFVLFFBQVEsa0NBQVcsV0FBVztBQUFBLFFBQ3hDLGFBQWEsUUFBUSxrQ0FBVyxjQUFjO0FBQUEsUUFDOUMsVUFBVSxRQUFRLGtDQUFXLFdBQVc7QUFBQSxRQUN4QyxXQUFXLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQzFDLFVBQVUsUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxRQUMvQyxVQUFVLFFBQVEsa0NBQVcsV0FBVztBQUFBLFFBQ3hDLGNBQWMsY0FBYyxJQUFJLElBQUksb0RBQW9ELHdDQUFlLENBQUM7QUFBQSxNQUMxRztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWEsTUFBTTsiLAogICJuYW1lcyI6IFtdCn0K
