import type { Enforcer } from "casbin"
import type { Knex } from "knex"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { mainFromDB } from "./bootstrap.js"
import { policyEnforceCheck } from "./enforce.js"
import {
	ALL_GROUPS,
	ALL_USERS,
	PolicyGroupB2BAppdot,
	PolicyGroupB2BRidgefield,
	PolicyGroupRedacFR,
	PolicyGroupRedacTransverseFR,
	PolicyUserAlice,
	PolicyUserBob,
	PolicyUserJohn,
	PolicyUserRoot,
} from "./policies.js"
import { type Enforce, PolicyAct, PolicyEft, PolicyObj } from "./types.js"

let ef: Enforcer
let knex: Knex
let policyCheck: ReturnType<typeof policyEnforceCheck>
beforeAll(async () => {
	const init = await mainFromDB()
	ef = init.ef
	knex = init.knex
	policyCheck = policyEnforceCheck({ ef })
})

describe("policies", () => {
	it("list all group policies tuples for inheritance", async () => {
		expect(await ef.getGroupingPolicy()).toMatchSnapshot()
	})

	for (const g of ALL_GROUPS) {
		it(`roles/groups of group ${g}`, async () => {
			expect(await ef.getImplicitRolesForUser(g)).toMatchSnapshot()
		})
	}

	for (const g of ALL_GROUPS) {
		it(`members of group ${g}`, async () => {
			expect(await ef.getImplicitUsersForRole(g)).toMatchSnapshot()
		})
	}

	for (const u of ALL_USERS) {
		it(`groups of user ${u}`, async () => {
			expect(await ef.getImplicitRolesForUser(u)).toMatchSnapshot()
		})
	}
})

const assertPermission =
	({ sub, obj, act, eft = PolicyEft.Allow, explicit }: Omit<Enforce, "log" | "ef">) =>
	(expectedResult = true) => {
		it(`check permission for "${sub}" to ${eft === PolicyEft.Allow ? "perform" : "prevent"} "${act}" on "${obj}", ${explicit ? "explicitely" : "with inheritance"}`, async () => {
			expect(
				await policyCheck({
					sub,
					obj,
					act,
					eft,
				}),
			).toBe(expectedResult)
		})
	}

describe("permissions", () => {
	// group redac fr
	assertPermission({
		sub: PolicyGroupRedacFR,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Update,
		eft: PolicyEft.Deny,
	})(false)

	// group ridgefield
	assertPermission({
		sub: PolicyGroupB2BRidgefield,
		obj: PolicyObj.Theater,
		act: PolicyAct.Export,
	})(true)

	// group redac transverse fr
	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.Theater,
		act: PolicyAct.Delete,
	})(true)
	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Update,
	})(false)
	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.Theater,
		act: PolicyAct.Export,
	})(false)

	// root
	assertPermission({
		sub: PolicyUserRoot,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(false)

	// alice
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Create,
	})(false)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Create,
		explicit: true,
	})(false)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(true)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
		explicit: true,
	})(true)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Update,
	})(false)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Update,
		explicit: true,
	})(false)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Delete,
	})(true)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Delete,
		explicit: true,
	})(true)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
	})(false)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
		explicit: true,
	})(false)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Delete,
	})(false)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Delete,
		eft: PolicyEft.Deny,
	})(false)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieLocalizedData,
		act: PolicyAct.Update,
	})(false)

	// bob
	assertPermission({
		sub: PolicyUserBob,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(false)
	assertPermission({
		sub: PolicyUserBob,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
	})(false)
	assertPermission({
		sub: PolicyUserBob,
		obj: PolicyObj.MovieLocalizedData,
		act: PolicyAct.Create,
	})(false)

	// john
	assertPermission({
		sub: PolicyUserJohn,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(false)
	assertPermission({
		sub: PolicyUserJohn,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
	})(false)
})

afterAll(async () => {
	await knex.destroy()
})
