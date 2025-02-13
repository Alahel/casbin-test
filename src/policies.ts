import { type GroupingPolicyTuple, PolicyAct, PolicyEft, PolicyObj, type PolicySub, type PolicyTuple } from "./types.js"

// ---users---
export const PolicyUserRoot: PolicySub = "u:root"
export const PolicyUserAlice: PolicySub = "u:alice"
export const PolicyUserBob: PolicySub = "u:bob"
export const PolicyUserJohn: PolicySub = "u:john"

export const ALL_USERS = [PolicyUserRoot, PolicyUserAlice, PolicyUserBob, PolicyUserJohn]

// ---roles---
export const PolicyRoleRedac: PolicySub = "r:redac"
export const PolicyRoleB2BMavens: PolicySub = "r:b2b_mavens"
export const ALL_ROLES = [PolicyRoleRedac, PolicyRoleB2BMavens]

// ---groups---
export const PolicyGroupRedacFR: PolicySub = "g:redac_fr"
export const PolicyGroupRedacTransverseFR: PolicySub = "g:redac_transverse_fr"
export const PolicyGroupB2BRidgefield: PolicySub = "g:b2b_ridgefield"
export const PolicyGroupB2BAppdot: PolicySub = "g:b2b_appdot"
export const ALL_GROUPS = [
	PolicyGroupRedacFR,
	PolicyGroupRedacTransverseFR,
	PolicyGroupB2BRidgefield,
	PolicyGroupB2BAppdot,
]

export const ALL_POLICIES: PolicyTuple[] = [
	// todo: make those wildcard policies just work for obj and act
	[PolicyUserRoot, "*", "*", PolicyEft.Allow],

	// roles
	[PolicyRoleRedac, PolicyObj.Movie, PolicyAct.Create, PolicyEft.Allow],
	[PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Create, PolicyEft.Allow],
	[PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Read, PolicyEft.Allow],
	[PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Update, PolicyEft.Allow],
	[PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Delete, PolicyEft.Allow],
	[PolicyRoleRedac, PolicyObj.Movie, PolicyAct.Read, PolicyEft.Deny],
	[PolicyRoleRedac, PolicyObj.Movie, PolicyAct.Delete, PolicyEft.Deny],

	[PolicyRoleB2BMavens, PolicyObj.Movie, PolicyAct.Read, PolicyEft.Allow],
	[PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Create, PolicyEft.Allow],
	[PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Read, PolicyEft.Allow],
	[PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Update, PolicyEft.Allow],
	[PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Delete, PolicyEft.Allow],

	// groups
	[PolicyGroupB2BRidgefield, PolicyObj.Movie, PolicyAct.Update, PolicyEft.Allow],
	[PolicyGroupB2BRidgefield, PolicyObj.Movie, PolicyAct.Read, PolicyEft.Allow],
	[PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Export, PolicyEft.Allow],
	[PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Create, PolicyEft.Allow],
	[PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Read, PolicyEft.Allow],
	[PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Update, PolicyEft.Allow],
	[PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Delete, PolicyEft.Allow],

	[PolicyGroupRedacTransverseFR, PolicyObj.Theater, PolicyAct.Delete, PolicyEft.Allow],
	[PolicyGroupRedacTransverseFR, PolicyObj.Theater, PolicyAct.Update, PolicyEft.Deny],

	// users
	[PolicyUserAlice, PolicyObj.Movie, PolicyAct.Delete, PolicyEft.Allow],
	[PolicyUserAlice, PolicyObj.Movie, PolicyAct.Read, PolicyEft.Allow],
	[PolicyUserAlice, PolicyObj.Movie, PolicyAct.Update, PolicyEft.Deny],

	[PolicyUserBob, PolicyObj.MovieLocalizedData, PolicyAct.Create, PolicyEft.Deny],

	[PolicyUserJohn, PolicyObj.ConfigurationImport, PolicyAct.Execute, PolicyEft.Allow],
]

export const ALL_GROUPING_POLICIES: GroupingPolicyTuple[] = [
	// roles of groups
	[PolicyGroupRedacFR, PolicyRoleRedac],
	[PolicyGroupB2BRidgefield, PolicyRoleB2BMavens],

	// groups inheritance
	[PolicyGroupB2BAppdot, PolicyGroupRedacFR],
	[PolicyGroupRedacTransverseFR, PolicyGroupRedacFR],
	[PolicyGroupRedacTransverseFR, PolicyGroupB2BRidgefield],

	// users in groups
	[PolicyUserAlice, PolicyGroupRedacFR],
	[PolicyUserBob, PolicyGroupB2BRidgefield],
	[PolicyUserJohn, PolicyGroupB2BAppdot],
]
