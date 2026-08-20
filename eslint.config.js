import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginPrettier from '@vue/eslint-config-prettier';

export default [
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}']
    },
    {
        name: 'app/files-to-ignore',
        ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**']
    },
    ...pluginVue.configs['flat/essential'],
    ...vueTsEslintConfig(),
    pluginPrettier,
    {
        // Fail on leftover eslint-disable directives so suppressions can't pile up unnoticed.
        linterOptions: {
            reportUnusedDisableDirectives: 'error'
        },
        rules: {
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
            // Vuetify exposes scoped slots as `v-slot:item.<column>`, which the parser reads as a
            // slot with a modifier. Allow it so we never need per-line eslint-disable for table slots.
            'vue/valid-v-slot': ['error', { allowModifiers: true }]
        }
    }
];
