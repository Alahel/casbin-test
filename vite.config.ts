import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		pool: "threads",
		poolOptions: {
			threads: {
				minThreads: 1,
				maxThreads: 1,
				singleThread: true,
				useAtomics: true,
			},
		},
		isolate: true,
		maxConcurrency: 1,
		maxWorkers: 1,
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
