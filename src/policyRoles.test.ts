import { describe } from "vitest"
import { PolicyRoleB2BMavens, PolicyRoleRedac } from "./policies.js"
import { assertPermission, assertPermissions } from "./testSetup.js"
import { PolicyAct, PolicyCRUD, PolicyObj } from "./types.js"

describe("permissions of PolicyRoleRedac", () => {
	assertPermission({
		sub: PolicyRoleRedac,
		obj: PolicyObj.Movie,
		act: PolicyAct.Create,
	})(true)
	assertPermissions({
		sub: PolicyRoleRedac,
		obj: PolicyObj.MovieBrandedData,
	})({ acts: PolicyCRUD })(true)

	assertPermission({
		sub: PolicyRoleRedac,
		obj: PolicyObj.Theater,
		act: PolicyAct.Read,
	})(false)
	assertPermissions({
		sub: PolicyRoleRedac,
		obj: PolicyObj.Movie,
	})({ acts: [PolicyAct.Read, PolicyAct.Delete] })(false)
})

describe("permissions of PolicyRoleB2BMavens", () => {
	assertPermission({
		sub: PolicyRoleB2BMavens,
		obj: PolicyObj.Movie,
		act: PolicyAct.Read,
	})(true)
	assertPermissions({
		sub: PolicyRoleB2BMavens,
		obj: PolicyObj.MovieLocalizedData,
	})({ acts: PolicyCRUD })(true)

	assertPermission({
		sub: PolicyRoleB2BMavens,
		obj: PolicyObj.MovieBrandedData,
		act: PolicyAct.Delete,
	})(false)
})
