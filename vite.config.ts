import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import JavaScriptObfuscator from 'javascript-obfuscator';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
 server: {
   host: "::",
   port: 8080,
 },
 plugins: [
   react(),
   mode === 'development' &&
   componentTagger(),
   // obfuscator معطل مؤقتاً بسبب مشاكل Stack Overflow
   // mode === 'production' && obfuscatorPlugin
 ].filter(Boolean),
 resolve: {
   alias: {
     "@": path.resolve(__dirname, "./src"),
   },
 },
 build: {
   minify: 'terser',
   terserOptions: {
     compress: {
       drop_console: true,
       drop_debugger: true,
       pure_funcs: ['console.log', 'console.info'],
       passes: 2,
     },
     mangle: {
       reserved: ['React', 'ReactDOM', 'ReactCurrentOwner', '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'],
       // تعطيل mangle للخصائص لتجنب كسر React
       properties: false
     },
     format: {
       comments: false,
     },
   },
   // إعدادات إضافية لتحسين الأداء
   rollupOptions: {
     output: {
       manualChunks: {
         vendor: ['react', 'react-dom'],
       },
     },
   },
 },
}));