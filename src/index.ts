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
	PolicyTenant1,
	PolicyUserAlice,
	PolicyUserBob,
	PolicyUserJohn,
	PolicyUserRoot,
} from "./policies"
import { type Context, PolicyAct, PolicyObj } from "./types"

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
	ef.enableLog(false)

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
	console.log(
		`===>all roles of group ${PolicyGroupRedacFR}`,
		await ef.getImplicitRolesForUser(PolicyGroupRedacFR, PolicyTenant1),
	)
	console.log(
		`===>all roles of group ${PolicyGroupB2BAppdot}`,
		await ef.getImplicitRolesForUser(PolicyGroupB2BAppdot, PolicyTenant1),
	)
	console.log(
		`===>all roles of group ${PolicyGroupB2BRidgefield}`,
		await ef.getImplicitRolesForUser(PolicyGroupB2BRidgefield, PolicyTenant1),
	)
	console.log(
		`===>all roles of group ${PolicyGroupRedacTransverseFR}`,
		await ef.getImplicitRolesForUser(PolicyGroupRedacTransverseFR, PolicyTenant1),
	)

	console.log("\n")
	console.log(
		`===>members of group ${PolicyGroupRedacFR}`,
		await ef.getImplicitUsersForRole(PolicyGroupRedacFR, PolicyTenant1),
	)

	console.log("\n")
	console.log(`===>groups of user ${PolicyUserAlice}`, await ef.getImplicitRolesForUser(PolicyUserAlice, PolicyTenant1))
	console.log(`===>groups of user ${PolicyUserBob}`, await ef.getImplicitRolesForUser(PolicyUserBob, PolicyTenant1))
	console.log(`===>groups of user ${PolicyUserJohn}`, await ef.getImplicitRolesForUser(PolicyUserJohn, PolicyTenant1))

	const policyCheck = policyEnforceCheck({ ef, log: true })

	// root
	// todo: make those wildcard policies work
	console.log("\n")
	await policyCheck({
		sub: PolicyUserRoot,
		dom: PolicyTenant1,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})

	// PolicyGroupB2BRidgefield
	await policyCheck({
		sub: PolicyGroupB2BRidgefield,
		dom: PolicyTenant1,
		obj: PolicyObj.Theater,
		act: PolicyAct.Export,
	})

	await policyCheck({
		sub: PolicyGroupRedacTransverseFR,
		dom: PolicyTenant1,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Update,
	})
	await policyCheck({
		sub: PolicyGroupRedacTransverseFR,
		dom: PolicyTenant1,
		obj: PolicyObj.Theater,
		act: PolicyAct.Export,
	})

	// alice
	console.log("\n")
	await policyCheck({
		sub: PolicyUserAlice,
		dom: PolicyTenant1,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})
	await policyCheck({
		sub: PolicyUserAlice,
		dom: PolicyTenant1,
		obj: PolicyObj.Movie,
		act: PolicyAct.Delete,
	})
	await policyCheck({
		sub: PolicyUserAlice,
		dom: PolicyTenant1,
		obj: PolicyObj.Movie,
		act: PolicyAct.Create,
	})
	await policyCheck({
		sub: PolicyUserAlice,
		dom: PolicyTenant1,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
	})
	await policyCheck({
		sub: PolicyUserAlice,
		dom: PolicyTenant1,
		obj: PolicyObj.MovieLocalizedData,
		act: PolicyAct.Update,
	})
	await policyCheck({
		sub: PolicyUserAlice,
		dom: PolicyTenant1,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Delete,
	})

	// bob
	console.log("\n")
	await policyCheck({
		sub: PolicyUserBob,
		dom: PolicyTenant1,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})
	await policyCheck({
		sub: PolicyUserBob,
		dom: PolicyTenant1,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
	})
	await policyCheck({
		sub: PolicyUserBob,
		dom: PolicyTenant1,
		obj: PolicyObj.MovieLocalizedData,
		act: PolicyAct.Create,
	})

	// john
	console.log("\n")
	await policyCheck({
		sub: PolicyUserJohn,
		dom: PolicyTenant1,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})
	await policyCheck({
		sub: PolicyUserJohn,
		dom: PolicyTenant1,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
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
