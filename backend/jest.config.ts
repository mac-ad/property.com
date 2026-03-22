import type { Config } from 'jest';

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'json', 'js'],
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
} satisfies Config;