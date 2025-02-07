import { Effect } from "casbin"
import {
	type GroupingPolicyTuple,
	PolicyActionEnum,
	PolicyCRUD,
	PolicyRessourceEnum,
	type PolicySubject,
	type PolicyTuple,
} from "./types"

export const PolicyAvailablePermissions = {
	[PolicyRessourceEnum.Movie]: PolicyCRUD,
	[PolicyRessourceEnum.MovieLocalizedData]: PolicyCRUD,
	[PolicyRessourceEnum.MovieBrandedData]: PolicyCRUD,
	[PolicyRessourceEnum.Theater]: [PolicyActionEnum.Read],
} as const

// ---users---
export const PolicyUserAlice: PolicySubject = "PolicyUser:alice"
export const PolicyUserBob: PolicySubject = "PolicyUser:bob"
export const PolicyUserJohn: PolicySubject = "PolicyUser:john"

// ---roles---
export const PolicyRoleRedac = "PolicyRole:redac"
export const PolicyRoleB2BMavens = "PolicyRole:b2b_mavens"

// ---groups---
export const PolicyGroupRedacFR = "PolicyGroup:redac_fr"
export const PolicyGroupRedacTransverseFR = "PolicyGroup:redac_transverse_fr"
export const PolicyGroupB2BRidgefield = "PolicyGroup:b2b_ridgefield"
export const PolicyGroupB2BAppdot = "PolicyGroup:b2b_appdot"

export const ALL_POLICIES: PolicyTuple[] = [
	// roles
	[PolicyRoleRedac, PolicyRessourceEnum.Movie, PolicyActionEnum.Read, Effect.Allow],
	[PolicyRoleRedac, PolicyRessourceEnum.MovieBrandedData, PolicyActionEnum.Create, Effect.Allow],
	[PolicyRoleRedac, PolicyRessourceEnum.MovieBrandedData, PolicyActionEnum.Read, Effect.Allow],
	[PolicyRoleRedac, PolicyRessourceEnum.MovieBrandedData, PolicyActionEnum.Update, Effect.Allow],
	[PolicyRoleRedac, PolicyRessourceEnum.MovieBrandedData, PolicyActionEnum.Delete, Effect.Allow],

	[PolicyRoleB2BMavens, PolicyRessourceEnum.Movie, PolicyActionEnum.Read, Effect.Allow],
	[PolicyRoleB2BMavens, PolicyRessourceEnum.MovieLocalizedData, PolicyActionEnum.Create, Effect.Allow],
	[PolicyRoleB2BMavens, PolicyRessourceEnum.MovieLocalizedData, PolicyActionEnum.Read, Effect.Allow],
	[PolicyRoleB2BMavens, PolicyRessourceEnum.MovieLocalizedData, PolicyActionEnum.Update, Effect.Allow],
	[PolicyRoleB2BMavens, PolicyRessourceEnum.MovieLocalizedData, PolicyActionEnum.Delete, Effect.Allow],

	// user
	[PolicyUserAlice, PolicyRessourceEnum.Movie, PolicyActionEnum.Delete, Effect.Allow],

	// group
	[PolicyGroupB2BRidgefield, PolicyRessourceEnum.Movie, PolicyActionEnum.Update, Effect.Allow],
]

export const ALL_GROUPING_POLICIES: GroupingPolicyTuple[] = [
	// roles of groups
	[PolicyGroupRedacFR, PolicyRoleRedac],
	[PolicyGroupB2BRidgefield, PolicyRoleB2BMavens],

	// users in groups
	[PolicyUserAlice, PolicyGroupRedacFR],
	[PolicyUserBob, PolicyGroupB2BRidgefield],
	[PolicyUserJohn, PolicyGroupB2BAppdot],

	// groups inheritance
	[PolicyGroupB2BAppdot, PolicyGroupRedacFR],
	[PolicyGroupRedacTransverseFR, PolicyGroupRedacFR],
	[PolicyGroupRedacTransverseFR, PolicyGroupB2BRidgefield],
]
