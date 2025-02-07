import { PolicyActionEnum, PolicyRessourceEnum } from "./types"

// ---shape of basic policies---
export const PolicyCRUD = [
	PolicyActionEnum.CREATE,
	PolicyActionEnum.READ,
	PolicyActionEnum.UPDATE,
	PolicyActionEnum.DELETE,
] as const

export const PolicyAvailablePermissions = {
	[PolicyRessourceEnum.MOVIE]: PolicyCRUD,
	[PolicyRessourceEnum.MOVIE_LOCALIZED_DATA]: PolicyCRUD,
	[PolicyRessourceEnum.MOVIE_BRANDED_DATA]: PolicyCRUD,
	[PolicyRessourceEnum.THEATER]: [PolicyActionEnum.READ],
} as const

// ---user policies---
export const POLICY_USER_ALICE = "PolicyUser:alice"
export const POLICY_USER_BOB = "PolicyUser:bob"
export const POLICY_USER_JOHN = "PolicyUser:john"

// ---roles policies---
export const POLICY_ROLE_REDAC = "PolicyRole:redac"
export const POLICY_ROLE_B2B_MAVENS = "PolicyRole:b2b_mavens"

// ---group policies---
export const POLICY_GROUP_REDAC_FR = "PolicyGroup:redac_fr"
export const POLICY_GROUP_B2B_RIDGEFIELD = "PolicyGroup:b2b_ridgefield"
export const POLICY_GROUP_B2B_APPDOT = "PolicyGroup:b2b_appdot"

export const ALL_POLICIES = [
	// roles
	[POLICY_ROLE_REDAC, PolicyRessourceEnum.MOVIE, PolicyActionEnum.READ],
	[POLICY_ROLE_REDAC, PolicyRessourceEnum.MOVIE_BRANDED_DATA, PolicyActionEnum.CREATE],
	[POLICY_ROLE_REDAC, PolicyRessourceEnum.MOVIE_BRANDED_DATA, PolicyActionEnum.READ],
	[POLICY_ROLE_REDAC, PolicyRessourceEnum.MOVIE_BRANDED_DATA, PolicyActionEnum.UPDATE],
	[POLICY_ROLE_REDAC, PolicyRessourceEnum.MOVIE_BRANDED_DATA, PolicyActionEnum.DELETE],

	[POLICY_ROLE_B2B_MAVENS, PolicyRessourceEnum.MOVIE, PolicyActionEnum.READ],
	[POLICY_ROLE_B2B_MAVENS, PolicyRessourceEnum.MOVIE_LOCALIZED_DATA, PolicyActionEnum.CREATE],
	[POLICY_ROLE_B2B_MAVENS, PolicyRessourceEnum.MOVIE_LOCALIZED_DATA, PolicyActionEnum.READ],
	[POLICY_ROLE_B2B_MAVENS, PolicyRessourceEnum.MOVIE_LOCALIZED_DATA, PolicyActionEnum.UPDATE],
	[POLICY_ROLE_B2B_MAVENS, PolicyRessourceEnum.MOVIE_LOCALIZED_DATA, PolicyActionEnum.DELETE],

	// user
	[POLICY_USER_ALICE, PolicyRessourceEnum.MOVIE, PolicyActionEnum.DELETE],

	// group
	[POLICY_GROUP_B2B_RIDGEFIELD, PolicyRessourceEnum.MOVIE, PolicyActionEnum.UPDATE],
]

export const ALL_GROUPING_POLICIES = [
	// roles of groups
	[POLICY_GROUP_REDAC_FR, POLICY_ROLE_REDAC],
	[POLICY_GROUP_B2B_RIDGEFIELD, POLICY_ROLE_B2B_MAVENS],

	// users in groups
	[POLICY_USER_ALICE, POLICY_GROUP_REDAC_FR],
	[POLICY_USER_BOB, POLICY_GROUP_B2B_RIDGEFIELD],
	[POLICY_USER_JOHN, POLICY_GROUP_B2B_APPDOT],

	// groups inheritance
	[POLICY_GROUP_B2B_APPDOT, POLICY_GROUP_REDAC_FR],
]
