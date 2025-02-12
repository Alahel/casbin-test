import type { Enforcer } from "casbin"
import type { Knex } from "knex"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { mainFromDB } from "./bootstrap"
import { policyEnforceCheck } from "./enforce"
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
} from "./policies"
import { type Enforce, PolicyAct, PolicyEft, PolicyObj } from "./types"

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
		it(`permissions for sub "${sub}" / obj "${obj}" / act "${act} / eft "${eft}"${explicit ? ", explicitely" : ""}`, async () => {
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
	})(false)
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
	// todo: make those wildcard policies work
	assertPermission({
		sub: PolicyUserRoot,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(true)

	// alice
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Create,
	})(true)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Create,
		explicit: true,
	})(true)
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
	})(true)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Update,
		explicit: true,
	})(true)
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
	})(true)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
		explicit: true,
	})(true)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Delete,
	})(true)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Delete,
		eft: PolicyEft.Deny,
	})(true)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieLocalizedData,
		act: PolicyAct.Update,
	})(true)

	// bob
	assertPermission({
		sub: PolicyUserBob,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(true)
	assertPermission({
		sub: PolicyUserBob,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
	})(true)
	assertPermission({
		sub: PolicyUserBob,
		obj: PolicyObj.MovieLocalizedData,
		act: PolicyAct.Create,
	})(true)

	// john
	assertPermission({
		sub: PolicyUserJohn,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(true)
	assertPermission({
		sub: PolicyUserJohn,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
	})(true)
})

afterAll(async () => {
	await knex.destroy()
})
