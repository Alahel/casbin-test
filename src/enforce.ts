import { Effect, type Enforcer } from "casbin"
import { EffectValueMapping, type Enforce } from "./types"

const enforce = async ({ ef, sub, obj, act, eft = Effect.Allow }: Enforce) => {
	let ret = false

	if (eft === Effect.Allow) ret = await ef.enforce(sub, obj, act)
	else {
		const policies = await ef.getFilteredPolicy(0, sub, obj, act)
		ret = policies.some((policy) => policy[3] === EffectValueMapping[eft])
	}

	if (eft === Effect.Allow) console.log(`===>${sub} ${ret ? "allowed" : "denied"} to ${act} ${obj}`)
	else if (eft === Effect.Deny) console.error(`===>${sub} ${ret ? "denied" : "allowed"} to ${act} ${obj}`)

	return ret
}

export const policyEnforceCheck =
	(ef: Enforcer) =>
	({ sub, obj, act, eft }: Omit<Enforce, "ef">) =>
		enforce({ ef, sub, obj, act, eft })
