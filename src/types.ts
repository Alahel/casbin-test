import { Effect, type Enforcer } from "casbin"

export type PolicySubject = string

export type Enforce = {
	ef: Enforcer
	sub: PolicySubject
	obj: PolicyRessourceEnum
	act: PolicyActionEnum
	eft?: Effect
}

export type Context = {
	ef: Enforcer
}

export type PolicyTuple = [PolicySubject, PolicyRessourceEnum, PolicyActionEnum, Effect]

// grouping of groups inside groups, or groups associated to roles, or users associated to roles
export type GroupingPolicyTuple = [PolicySubject, PolicySubject]

export enum PolicyRessourceEnum {
	Movie = "Movie",
	MovieLocalizedData = "MovieLocalizedData",
	MovieBrandedData = "MovieBrandedData",
	Theater = "Theater",
}

export enum PolicyActionEnum {
	Create = "Create",
	Read = "Read",
	Update = "Update",
	Delete = "Delete",
}

export enum PolicyEffectValueEnum {
	Allow = "allow",
	Deny = "deny",
	Indeterminate = "indeterminate",
}

export const EffectValueMapping = {
	[Effect.Allow]: PolicyEffectValueEnum.Allow,
	[Effect.Deny]: PolicyEffectValueEnum.Deny,
	[Effect.Indeterminate]: PolicyEffectValueEnum.Indeterminate,
} as const

// ---shape of basic policies---
export const PolicyCRUD = [
	PolicyActionEnum.Create,
	PolicyActionEnum.Read,
	PolicyActionEnum.Update,
	PolicyActionEnum.Delete,
] as const
