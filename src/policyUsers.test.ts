import type { Enforcer } from "casbin"
import { beforeAll, describe, expect, it } from "vitest"
import { ALL_USERS, PolicyUserAlice, PolicyUserBob, PolicyUserJohn, PolicyUserRoot } from "./policies.js"
import { type TestCtx, assertPermission, getTestCtx } from "./testSetup.js"
import { PolicyAct, PolicyEft, PolicyObj } from "./types.js"

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

describe("permissions", () => {
	// ---user PolicyUserRoot---
	// ==>denied
	assertPermission({
		sub: PolicyUserRoot,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(false)

	// ---user PolicyUserAlice---
	// ==>allowed
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
	// ==>denied
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

	// ---user PolicyUserBob---
	// ==>denied
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

	// ---user PolicyUserJohn---
	// ==>denied
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
