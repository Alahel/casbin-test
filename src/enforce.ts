import { Effect, type Enforcer } from "casbin"
import { type Enforce, PolicyEft, PolicyEftValueMapping } from "./types"

const enforce = async ({ ef, sub, dom, obj, act, eft = PolicyEft.Allow }: Enforce) => {
	let ret = false // deny by default

	if (eft === PolicyEft.Allow) ret = await ef.enforce(dom, sub, obj, act)
	else {
		const policies = await ef.getFilteredPolicy(0, dom, sub, obj, act)
		ret = policies.some((policy) => policy[4] === eft)
	}

	if (eft === PolicyEft.Allow) console.log(`===>${sub} ${ret ? "allowed" : "denied"} to ${act} ${obj}`)
	else if (eft === PolicyEft.Deny) console.error(`===>${sub} ${ret ? "denied" : "allowed"} to ${act} ${obj}`)

	return ret
}

export const policyEnforceCheck =
	(ef: Enforcer) =>
	({ sub, dom, obj, act, eft }: Omit<Enforce, "ef">) =>
		enforce({ ef, sub, dom, obj, act, eft })
