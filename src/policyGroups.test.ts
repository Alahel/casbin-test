import type { Enforcer } from "casbin"
import { beforeAll, describe, expect, it } from "vitest"
import {
	ALL_GROUPS,
	PolicyGroupAdminMovie,
	PolicyGroupB2BRidgefield,
	PolicyGroupRedacFR,
	PolicyGroupRedacTransverseFR,
} from "./policies.js"
import { type TestCtx, assertPermission, assertPermissions, getTestCtx } from "./testSetup.js"
import { PolicyAct, PolicyCRUD, PolicyEft, PolicyObj } from "./types.js"

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
		it(`implicit permissions of group ${g}`, async () => {
			expect(await ef.getImplicitPermissionsForUser(g)).toMatchSnapshot()
		})
		it(`explicit permissions of group ${g}`, async () => {
			expect(await ef.getPermissionsForUser(g)).toMatchSnapshot()
		})
	}
	for (const g of ALL_GROUPS) {
		it(`members of group ${g}`, async () => {
			expect(await ef.getImplicitUsersForRole(g)).toMatchSnapshot()
		})
	}
})

describe("permissions of PolicyGroupB2BRidgefield", () => {
	assertPermissions({
		sub: PolicyGroupB2BRidgefield,
		obj: PolicyObj.Theater,
	})({ acts: [...PolicyCRUD, PolicyAct.Export] })(true)
	assertPermission({
		sub: PolicyGroupB2BRidgefield,
		obj: PolicyObj.Movie,
		act: PolicyAct.Update,
	})(true)
	assertPermission({
		sub: PolicyGroupB2BRidgefield,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(true) // inherited from PolicyRoleB2BMavens
})

describe("permissions of PolicyGroupRedacTransverseFR", () => {
	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.Theater,
		act: PolicyAct.Delete,
	})(true)
	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Update,
	})(true) // inherited from PolicyRoleRedac
	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.Theater,
		act: PolicyAct.Export,
	})(true) // inherited from PolicyGroupB2BRidgefield
	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(true) // denied from inherited PolicyRoleRedac, but allowed from inherited PolicyGroupB2BRidgefield

	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.Movie,
		act: PolicyAct.Delete,
	})(false)
	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.Theater,
		act: PolicyAct.Update,
	})(false)
	assertPermission({
		sub: PolicyGroupRedacTransverseFR,
		obj: PolicyObj.Theater,
		act: PolicyAct.Update,
		eft: PolicyEft.Deny,
		explicit: true,
	})(true)
})

describe("permissions of PolicyGroupRedacFR", () => {
	assertPermission({
		sub: PolicyGroupRedacFR,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Update,
	})(true)

	assertPermission({
		sub: PolicyGroupRedacFR,
		obj: PolicyObj.Movie,
		act: PolicyAct.Update,
	})(false)
	assertPermission({
		sub: PolicyGroupRedacFR,
		obj: PolicyObj.Movie,
		act: PolicyAct.Delete,
	})(false)
})

describe("permissions of PolicyGroupAdminMovie", () => {
	assertPermissions({
		sub: PolicyGroupAdminMovie,
		obj: PolicyObj.Movie,
	})({ acts: [...PolicyCRUD, PolicyAct.Export] })(true)

	assertPermissions({
		sub: PolicyGroupAdminMovie,
		obj: PolicyObj.Theater,
	})({ acts: [...PolicyCRUD, PolicyAct.Export] })(false)
})
