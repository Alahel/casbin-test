import {
	type GroupingPolicyTuple,
	PolicyAct,
	PolicyEft,
	PolicyObj,
	PolicyPri,
	type PolicySub,
	type PolicyTuple,
} from "./types.js"

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
	[PolicyPri.Role, PolicyUserRoot, "*", "*", PolicyEft.Allow],

	// roles
	[PolicyPri.Role, PolicyRoleRedac, PolicyObj.Movie, PolicyAct.Create, PolicyEft.Allow],
	[PolicyPri.Role, PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Create, PolicyEft.Allow],
	[PolicyPri.Role, PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Read, PolicyEft.Allow],
	[PolicyPri.Role, PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Update, PolicyEft.Allow],
	[PolicyPri.Role, PolicyRoleRedac, PolicyObj.MovieBrandedData, PolicyAct.Delete, PolicyEft.Allow],
	[PolicyPri.Role, PolicyRoleRedac, PolicyObj.Movie, PolicyAct.Read, PolicyEft.Deny],
	[PolicyPri.Role, PolicyRoleRedac, PolicyObj.Movie, PolicyAct.Delete, PolicyEft.Deny],

	[PolicyPri.Role, PolicyRoleB2BMavens, PolicyObj.Movie, PolicyAct.Read, PolicyEft.Allow],
	[PolicyPri.Role, PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Create, PolicyEft.Allow],
	[PolicyPri.Role, PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Read, PolicyEft.Allow],
	[PolicyPri.Role, PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Update, PolicyEft.Allow],
	[PolicyPri.Role, PolicyRoleB2BMavens, PolicyObj.MovieLocalizedData, PolicyAct.Delete, PolicyEft.Allow],

	// group
	[PolicyPri.Group, PolicyGroupB2BRidgefield, PolicyObj.Movie, PolicyAct.Update, PolicyEft.Allow],
	[PolicyPri.Group, PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Export, PolicyEft.Allow],
	[PolicyPri.Group, PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Read, PolicyEft.Allow],
	[PolicyPri.Group, PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Create, PolicyEft.Allow],
	[PolicyPri.Group, PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Update, PolicyEft.Allow],
	[PolicyPri.Group, PolicyGroupB2BRidgefield, PolicyObj.Theater, PolicyAct.Delete, PolicyEft.Allow],

	[PolicyPri.Group, PolicyGroupRedacTransverseFR, PolicyObj.Theater, PolicyAct.Delete, PolicyEft.Allow],

	// user
	[PolicyPri.User, PolicyUserAlice, PolicyObj.Movie, PolicyAct.Delete, PolicyEft.Allow],
	[PolicyPri.User, PolicyUserAlice, PolicyObj.Movie, PolicyAct.Read, PolicyEft.Allow],
	[PolicyPri.User, PolicyUserJohn, PolicyObj.ConfigurationImport, PolicyAct.Execute, PolicyEft.Allow],
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
