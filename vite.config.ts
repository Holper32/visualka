import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: [
            '**/*.{query,type,validator}.test.ts',
        ],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
        ],
        globals: true,
    },
})