module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          outDir: null,
          esModuleInterop: true,
        },
      },
    ],
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/index.ts",
    "!src/**/*.interface.ts",
    "!src/**/*.type.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testTimeout: 15000,
  moduleFileExtensions: ["ts", "js", "json"],
  verbose: true,
  // CI/CD Settings
  ci: process.env.CI === "true",
  forceExit: true,
  detectOpenHandles: true,
};
