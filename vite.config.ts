import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['lab1/**/*.test.ts', '**/*.test.ts'],
    },
})