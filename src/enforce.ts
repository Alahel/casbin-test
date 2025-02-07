import type { Enforcer } from "casbin"
import type { PolicyActionEnum, PolicyObjectEnum } from "./types"

export type Enforce = {
	ef: Enforcer
	sub: string
	obj: PolicyObjectEnum
	act: PolicyActionEnum
}

export const enforce = async ({ ef, sub, obj, act }: Enforce): Promise<boolean> => {
	const ret = await ef.enforce(sub, obj, act)
	if (ret === true) console.log(`===>${sub} allowed to ${act} ${obj}`)
	else console.error(`===>${sub} denied to ${act} ${obj}`)
	return ret
}

export const checkPermission =
	(ef: Enforcer) =>
	async (sub: string, obj: PolicyObjectEnum, act: PolicyActionEnum): Promise<boolean> =>
		enforce({ ef, sub, obj, act })
