import { fileURLToPath, URL } from 'url';
import { createRequire } from 'module';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

const require = createRequire(import.meta.url);

export default defineConfig({
    plugins: [
        vue(),
        vuetify({
            autoImport: true,
            styles: { configFile: require.resolve('vuetify-app-kit/variables.scss') }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
