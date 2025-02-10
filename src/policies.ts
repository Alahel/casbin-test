import {
	type GroupingPolicyTuple,
	PolicyAct,
	type PolicyDom,
	PolicyEft,
	PolicyObj,
	type PolicySub,
	type PolicyTuple,
} from "./types"

// ---tenants---
export const PolicyTenant1: PolicyDom = "d:tenant1"
export const PolicyTenant2: PolicyDom = "d:tenant2"

// ---users---
export const PolicyUserRoot: PolicySub = "u:root"
export const PolicyUserAlice: PolicySub = "u:alice"
export const PolicyUserBob: PolicySub = "u:bob"
export const PolicyUserJohn: PolicySub = "u:john"

// ---roles---
export const PolicyRoleRedac: PolicySub = "r:redac"
export const PolicyRoleB2BMavens: PolicySub = "r:b2b_mavens"

// ---groups---
export const PolicyGroupRedacFR: PolicySub = "g:redac_fr"
export const PolicyGroupRedacTransverseFR: PolicySub = "g:redac_transverse_fr"
export const PolicyGroupB2BRidgefield: PolicySub = "g:b2b_ridgefield"
export const PolicyGroupB2BAppdot: PolicySub = "g:b2b_appdot"

export const ALL_POLICIES: PolicyTuple[] = [
	[PolicyTenant1, PolicyUserRoot, "*", "*", PolicyEft.Allow],

	// roles	
	[PolicyTenant1, PolicyRoleRedac, PolicyObj.Movie, PolicyAct.Read, PolicyEft.Allow],
	[PolicyTenant1, PolicyRoleRedac, PolicyObj.Movie, PolicyAct.Delete, PolicyEft.Deny],
	[PolicyTenant1, PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Create, PolicyEft.Allow],
	[PolicyTenant1, PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Read, PolicyEft.Allow],
	[PolicyTenant1, PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Update, PolicyEft.Allow],
	[PolicyTenant1, PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Delete, PolicyEft.Allow],

	[PolicyTenant1, PolicyRoleB2BMavens, PolicyObj.Movie, PolicyAct.Read, PolicyEft.Allow],
	[PolicyTenant1, PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Create, PolicyEft.Allow],
	[PolicyTenant1, PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Read, PolicyEft.Allow],
	[PolicyTenant1, PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Update, PolicyEft.Allow],
	[PolicyTenant1, PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Delete, PolicyEft.Allow],

	// user
	[PolicyTenant1, PolicyUserAlice, PolicyObj.Movie, PolicyAct.Delete, PolicyEft.Allow],
	[PolicyTenant1, PolicyUserAlice, PolicyObj.MovieBrandedData, PolicyAct.Delete, PolicyEft.Deny],
	[PolicyTenant1, PolicyUserJohn, PolicyObj.ConfigurationImport, PolicyAct.Execute, PolicyEft.Allow],

	// group
	[PolicyTenant1, PolicyGroupB2BRidgefield, PolicyObj.Movie, PolicyAct.Update, PolicyEft.Allow],
	[PolicyTenant1, PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Export, PolicyEft.Allow],
	[PolicyTenant1, PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Read, PolicyEft.Allow],
	[PolicyTenant1, PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Create, PolicyEft.Allow],
	[PolicyTenant1, PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Update, PolicyEft.Allow],
	[PolicyTenant1, PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Delete, PolicyEft.Allow],

	[PolicyTenant1, PolicyGroupRedacFR, PolicyObj.MovieBrandedData, PolicyAct.Update, PolicyEft.Deny],
	[PolicyTenant1, PolicyGroupRedacTransverseFR, PolicyObj.Theater, PolicyAct.Delete, PolicyEft.Allow],
]

export const ALL_GROUPING_POLICIES: GroupingPolicyTuple[] = [
	// roles of groups
	[PolicyGroupRedacFR, PolicyRoleRedac, PolicyTenant1],
	[PolicyGroupB2BRidgefield, PolicyRoleB2BMavens, PolicyTenant1],

	// users in groups
	[PolicyUserAlice, PolicyGroupRedacFR, PolicyTenant1],
	[PolicyUserBob, PolicyGroupB2BRidgefield, PolicyTenant1],
	[PolicyUserJohn, PolicyGroupB2BAppdot, PolicyTenant1],

	// groups inheritance
	[PolicyGroupB2BAppdot, PolicyGroupRedacFR, PolicyTenant1],
	[PolicyGroupRedacTransverseFR, PolicyGroupRedacFR, PolicyTenant1],
	[PolicyGroupRedacTransverseFR, PolicyGroupB2BRidgefield, PolicyTenant1],
]
