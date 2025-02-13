import type { Enforcer } from "casbin"
import { beforeAll, describe, expect, it } from "vitest"
import { ALL_GROUPS, PolicyGroupB2BRidgefield, PolicyGroupRedacFR, PolicyGroupRedacTransverseFR } from "./policies.js"
import { type TestCtx, assertPermission, getTestCtx } from "./testSetup.js"
import { PolicyAct, PolicyEft, PolicyObj } from "./types.js"

let ctx: TestCtx
let ef: Enforcer
beforeAll(async () => {
	ctx = await getTestCtx()
	ef = ctx.ef
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
})

describe("permissions", () => {
	// ---group PolicyGroupRedacFR---
	// ==>denied
	assertPermission({
		sub: PolicyGroupRedacFR,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Update,
		eft: PolicyEft.Deny,
	})(false)

	// ---group PolicyGroupB2BRidgefield---
	// ==>allowed
	assertPermission({
		sub: PolicyGroupB2BRidgefield,
		obj: PolicyObj.Theater,
		act: PolicyAct.Export,
	})(true)

	// ---group PolicyGroupRedacTransverseFR---
	// ==>allowed
	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.Theater,
		act: PolicyAct.Delete,
	})(true)
	// ==>denied
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
})
