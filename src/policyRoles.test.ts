import type { Enforcer } from "casbin"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import {
	ALL_GROUPS,
	ALL_USERS,
	PolicyGroupB2BRidgefield,
	PolicyGroupRedacFR,
	PolicyGroupRedacTransverseFR,
	PolicyRoleB2BMavens,
	PolicyRoleRedac,
	PolicyUserAlice,
	PolicyUserBob,
	PolicyUserJohn,
	PolicyUserRoot,
} from "./policies.js"
import { type TestCtx, assertPermission, assertPermissions, getTestCtx } from "./testSetup.js"
import { PolicyAct, PolicyCRUD, PolicyEft, PolicyObj } from "./types.js"

describe("permissions", () => {
	// ---role PolicyRoleRedac---
	// ==>allowed
	assertPermission({
		sub: PolicyRoleRedac,
		obj: PolicyObj.Movie,
		act: PolicyAct.Create,
	})(true)
	assertPermissions({
		sub: PolicyRoleRedac,
		obj: PolicyObj.MovieBrandedData,
	})({ acts: PolicyCRUD })(true)
	// ==>denied
	assertPermission({
		sub: PolicyRoleRedac,
		obj: PolicyObj.Theater,
		act: PolicyAct.Read,
	})(false)
	assertPermissions({
		sub: PolicyRoleRedac,
		obj: PolicyObj.Movie,
	})({ acts: [PolicyAct.Read, PolicyAct.Delete] })(false)

	// ---role PolicyRoleB2BMavens---
	// ==>allowed
	assertPermission({
		sub: PolicyRoleB2BMavens,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(true)
	assertPermissions({
		sub: PolicyRoleB2BMavens,
		obj: PolicyObj.MovieLocalizedData,
	})({ acts: PolicyCRUD })(true)
	// ==>denied
	assertPermission({
		sub: PolicyRoleB2BMavens,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Delete,
	})(false)
})
