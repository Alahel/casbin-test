import type { Enforcer } from "casbin"
import type { Knex } from "knex"

export type PolicySub = string

export type Enforce = {
	ef: Enforcer
	sub: PolicySub
	obj: PolicyObj
	act: PolicyAct
	eft?: PolicyEft
	log?: boolean
	explicit?: boolean
}

export type Context = {
	knex: Knex
	ef: Enforcer
}

export type PolicyTuple = [PolicySub, PolicyObj | "*", PolicyAct | "*", PolicyEft]
export const PolicyEftRetrieveStartIndex = 0
export const PolicyEftIndex = 3

// grouping of groups inside groups, or groups associated to roles, or users associated to roles
export type GroupingPolicyTuple = [PolicySub, PolicySub]

export enum PolicyObj {
	Movie = "movie",
	MovieLocalizedData = "movie_localized_data",
	MovieBrandedData = "movie_branded_data",
	Theater = "theater",
	ConfigurationImport = "configuration_import",
}

export enum PolicyAct {
	Create = "create",
	Read = "read",
	Update = "update",
	Delete = "delete",
	Export = "export",
	Execute = "execute",
}

export enum PolicyEft {
	Allow = "allow",
	Deny = "deny",
}

// ---shape of basic policies---
export const PolicyCRUD = [PolicyAct.Create, PolicyAct.Read, PolicyAct.Update, PolicyAct.Delete] as const

// todo: use those restricted permissions per objects
export const PolicyActPerObj = {
	[PolicyObj.Movie]: PolicyCRUD,
	[PolicyObj.MovieLocalizedData]: PolicyCRUD,
	[PolicyObj.MovieBrandedData]: PolicyCRUD,
	[PolicyObj.Theater]: [...PolicyCRUD, PolicyAct.Export],
	[PolicyObj.ConfigurationImport]: [PolicyAct.Execute],
} as const
