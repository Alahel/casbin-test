import type { Enforcer } from "casbin"
import { type Enforce, PolicyEft, PolicyEftIndex, PolicyEftRetrieveStartIndex } from "./types.js"

const enforce = async ({ ef, sub, obj, act, eft = PolicyEft.Allow, log, explicit = false }: Enforce) => {
	let ret = false // denied by default

	if (explicit) {
		// we must check if permission is recorded explicitely in the policies
		// and not from inheritance
		const policies = await ef.getFilteredPolicy(PolicyEftRetrieveStartIndex, sub, obj, act)
		if (log)
			console.log(
				"asking to check explicitly for",
				{ sub, obj, act, eft },
				"retrieved policies:",
				policies,
				"result from global enforce:",
				await ef.enforce(sub, obj, act),
			)

		ret = policies.some((policy) => policy[PolicyEftIndex] === eft)

		if (log) {
			let permMsg = ""
			if (policies.length === 0) permMsg = "indeterminate"
			else if ((eft === PolicyEft.Allow && ret) || (eft === PolicyEft.Deny && !ret)) permMsg = "allowed"
			else if ((eft === PolicyEft.Allow && !ret) || (eft === PolicyEft.Deny && ret)) permMsg = "denied"
			console.log(`===>${sub} explicitly "${permMsg}" to "${act}" "${obj}"`)
		}
	} else {
		ret = await ef.enforce(sub, obj, act)
		if (log) {
			if (eft === PolicyEft.Allow) console.log(`===>${sub} "${ret ? "allowed" : "denied"}" to "${act}" "${obj}"`)
			else if (eft === PolicyEft.Deny) console.log(`===>${sub} "${ret ? "denied" : "allowed"}" to "${act}" "${obj}"`)
		}
	}

	return ret
}

export const policyEnforceCheck =
	({ ef, log = false }: { ef: Enforcer } & Pick<Enforce, "log">) =>
	(efParams: Omit<Enforce, "ef" | "log">) =>
		enforce({ ef, log, ...efParams })
