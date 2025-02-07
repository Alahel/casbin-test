import { Effect, newEnforcer } from "casbin"
import KnexAdapter from "casbin-knex-adapter"
import Knex from "knex"
import { policyEnforceCheck } from "./enforce"
import {
	ALL_GROUPING_POLICIES,
	ALL_POLICIES,
	PolicyGroupB2BAppdot,
	PolicyGroupB2BRidgefield,
	PolicyGroupRedacFR,
	PolicyGroupRedacTransverseFR,
	PolicyUserAlice,
	PolicyUserBob,
	PolicyUserJohn,
} from "./policies"
import { type Context, PolicyActionEnum, PolicyRessourceEnum } from "./types"

/**
 * @deprecated prefer mainFromDB
 * @returns
 */

// biome-ignore lint/correctness/noUnusedVariables: alternate between mainFromDB and mainFromFile for testing
const mainFromFile = async (): Promise<Context> => {
	const ef = await newEnforcer("casbin/model.conf", "casbin/policy.csv")
	return {
		ef,
	}
}

const mainFromDB = async (): Promise<Context> => {
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

	await ef.clearPolicy()

	await ef.addPolicies(ALL_POLICIES as string[][])
	await ef.addGroupingPolicies(ALL_GROUPING_POLICIES)

	await ef.savePolicy()
	await ef.loadPolicy()

	return {
		ef,
	}
}

const main = async () => {
	console.log("----starting----")
	const { ef } = await mainFromDB()

	console.log("===>groups policies", await ef.getGroupingPolicy())
	console.log(`===>roles of group ${PolicyGroupRedacFR}`, await ef.getRolesForUser(PolicyGroupRedacFR))
	console.log(`===>roles of group ${PolicyGroupB2BAppdot}`, await ef.getRolesForUser(PolicyGroupB2BAppdot))
	console.log(`===>roles of group ${PolicyGroupB2BRidgefield}`, await ef.getRolesForUser(PolicyGroupB2BRidgefield))

	console.log("\n")
	console.log(`===>parent groups of group ${PolicyGroupB2BAppdot}`, await ef.getRolesForUser(PolicyGroupB2BAppdot))
	console.log(
		`===>parent groups of group ${PolicyGroupRedacTransverseFR}`,
		await ef.getRolesForUser(PolicyGroupRedacTransverseFR),
	)

	console.log("\n")
	console.log(`===>members of group ${PolicyGroupRedacFR}`, await ef.getUsersForRole(PolicyGroupRedacFR))

	console.log("\n")
	console.log(`===>groups of user ${PolicyUserAlice}`, await ef.getRolesForUser(PolicyUserAlice))
	console.log(`===>groups of user ${PolicyUserBob}`, await ef.getRolesForUser(PolicyUserBob))
	console.log(`===>groups of user ${PolicyUserJohn}`, await ef.getRolesForUser(PolicyUserJohn))

	console.log("\n")
	const policyCheck = policyEnforceCheck(ef)

	// alice
	await policyCheck({
		sub: PolicyUserAlice,
		obj: PolicyRessourceEnum.Movie,
		act: PolicyActionEnum.Read,
	})
	await policyCheck({
		sub: PolicyUserAlice,
		obj: PolicyRessourceEnum.Movie,
		act: PolicyActionEnum.Delete,
	})
	await policyCheck({
		sub: PolicyUserAlice,
		obj: PolicyRessourceEnum.Movie,
		act: PolicyActionEnum.Create,
	})
	await policyCheck({
		sub: PolicyUserAlice,
		obj: PolicyRessourceEnum.MovieBrandedData,
		act: PolicyActionEnum.Create,
	})
	await policyCheck({
		sub: PolicyUserAlice,
		obj: PolicyRessourceEnum.MovieLocalizedData,
		act: PolicyActionEnum.Update,
	})

	// bob
	await policyCheck({
		sub: PolicyUserBob,
		obj: PolicyRessourceEnum.Movie,
		act: PolicyActionEnum.Read,
	})
	await policyCheck({
		sub: PolicyUserBob,
		obj: PolicyRessourceEnum.MovieBrandedData,
		act: PolicyActionEnum.Create,
	})
	await policyCheck({
		sub: PolicyUserBob,
		obj: PolicyRessourceEnum.MovieLocalizedData,
		act: PolicyActionEnum.Create,
	})

	// john
	await policyCheck({
		sub: PolicyUserJohn,
		obj: PolicyRessourceEnum.Movie,
		act: PolicyActionEnum.Read,
	})
	await policyCheck({
		sub: PolicyUserJohn,
		obj: PolicyRessourceEnum.MovieBrandedData,
		act: PolicyActionEnum.Create,
	})
}

main()
	.then(() => {
		console.log("----done----")
		process.exit(0)
	})
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
