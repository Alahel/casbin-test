import os from "node:os"
import { defineConfig } from "vitest/config"

const maxParallel = os.cpus().length

export default defineConfig({
	test: {
		pool: "threads",
		poolOptions: {
			threads: {
				minThreads: 1,
				maxThreads: maxParallel,
				singleThread: true,
				useAtomics: true,
			},
		},
		setupFiles: ["./src/testSetup.ts"],
		isolate: true,
		maxConcurrency: maxParallel,
		maxWorkers: maxParallel,
		minWorkers: 1,
		bail: 3,
		sequence: {
			concurrent: false,
		},
		typecheck: {
			enabled: false,
		},
	},
})
