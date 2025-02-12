import { newEnforcer } from "casbin"
import { KnexAdapter } from "casbin-knex-adapter"
import Knex from "knex"
import { ALL_GROUPING_POLICIES, ALL_POLICIES } from "./policies.js"
import type { Context } from "./types.js"

export const mainFromDB = async (): Promise<Context> => {
	const knex = Knex({
		acquireConnectionTimeout: 1000,
		client: "pg",
		connection: "pgsql://postgres:1234@localhost:5436",
		pool: {
			min: 0,
			max: 50,
			destroyTimeoutMillis: 1000,
			idleTimeoutMillis: 60000,
			reapIntervalMillis: 500,
			createRetryIntervalMillis: 500,
			propagateCreateError: false,
		},
	})
	const adapter = await KnexAdapter.newAdapter(knex)

	const ef = await newEnforcer("casbin/model.conf", adapter)
	ef.enableLog(false)

	await ef.clearPolicy()

	await ef.addPolicies(ALL_POLICIES as string[][])
	await ef.addGroupingPolicies(ALL_GROUPING_POLICIES)

	await ef.savePolicy()
	await ef.loadPolicy()

	return {
		knex,
		ef,
	}
}
