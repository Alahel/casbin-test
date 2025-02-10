import { Effect, type Enforcer } from "casbin"

export type PolicySub = string

export type PolicyDom = string

export type Enforce = {
	ef: Enforcer
	sub: PolicySub
	dom: PolicyDom
	obj: PolicyObj
	act: PolicyAct
	eft?: PolicyEft
}

export type Context = {
	ef: Enforcer
}

export type PolicyTuple = [PolicyDom | "*", PolicySub, PolicyObj | "*", PolicyAct | "*", PolicyEft]

// grouping of groups inside groups, or groups associated to roles, or users associated to roles
export type GroupingPolicyTuple = [PolicyDom | "*", PolicySub, PolicySub]

export enum PolicyDomain {
	Tenant1 = "tenant1",
	Tenant2 = "tenant2",
}

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
