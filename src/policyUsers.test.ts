import type { Enforcer } from "casbin"
import { beforeAll, describe, expect, it } from "vitest"
import { ALL_USERS, PolicyUserAlice, PolicyUserBob, PolicyUserJohn, PolicyUserRoot } from "./policies.js"
import { type TestCtx, assertPermission, assertPermissions, getTestCtx } from "./testSetup.js"
import { PolicyAct, PolicyCRUD, PolicyEft, PolicyObj } from "./types.js"

let ctx: TestCtx
let ef: Enforcer
beforeAll(async () => {
	ctx = await getTestCtx()
	ef = ctx.ef
})

describe("policies", () => {
	for (const u of ALL_USERS) {
		it(`groups of user ${u}`, async () => {
			expect(await ef.getImplicitRolesForUser(u)).toMatchSnapshot()
		})
	}
})

// todo: should be true as wildcards should work properly
describe.skip("permissions of PolicyUserRoot", () => {
	assertPermission({
		sub: PolicyUserRoot,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(true)
})

describe("permissions of PolicyUserAlice", () => {
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Create,
	})(true)
	assertPermissions({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieBrandedData,
	})({ acts: PolicyCRUD })(true)
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
		obj: PolicyObj.Movie,
		act: PolicyAct.Update,
	})(false)
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.Movie,
		act: PolicyAct.Update,
		eft: PolicyEft.Deny,
		explicit: true,
	})(true) // checking if requesting for an explicit deny works as expected here
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
		explicit: true,
	})(false) // checking if requesting for an explicit deny works as expected here
	assertPermission({
		sub: PolicyUserAlice,
		obj: PolicyObj.MovieLocalizedData,
		act: PolicyAct.Update,
	})(false)
})

describe("permissions of PolicyUserBob", () => {
	assertPermission({
		sub: PolicyUserBob,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(true)

	assertPermission({
		sub: PolicyUserBob,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
	})(false)
	assertPermission({
		sub: PolicyUserBob,
		obj: PolicyObj.MovieLocalizedData,
		act: PolicyAct.Create,
	})(false) // explicitely set on PolicyUserBob
})

describe("permissions of PolicyUserJohn", () => {
	assertPermission({
		sub: PolicyUserJohn,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Create,
	})(true)

	assertPermission({
		sub: PolicyUserJohn,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(false)
})
