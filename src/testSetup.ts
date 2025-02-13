import type { Enforcer } from "casbin"
import type { Knex } from "knex"
import { afterAll, beforeAll, expect, it } from "vitest"
import { mainFromDB } from "./bootstrap.js"
import { policyEnforceCheck } from "./enforce.js"
import { type Enforce, type PolicyAct, PolicyEft } from "./types.js"

let ef: Enforcer
let knex: Knex
let policyCheck: ReturnType<typeof policyEnforceCheck>
beforeAll(async () => {
	const init = await mainFromDB()
	ef = init.ef
	knex = init.knex
	policyCheck = policyEnforceCheck({ ef })
})

afterAll(async () => {
	await knex.destroy()
})

export type TestCtx = {
	ef: Enforcer
	knex: Knex
	policyCheck: ReturnType<typeof policyEnforceCheck>
}
export const getTestCtx = async (): Promise<TestCtx> => ({ ef, knex, policyCheck })

export const assertPermission =
	({ sub, obj, act, eft = PolicyEft.Allow, explicit }: Omit<Enforce, "log" | "ef">) =>
	(expectedResult = true) => {
		it(`check permission for "${sub}" to ${eft === PolicyEft.Allow ? "perform" : "prevent"} "${act}" on "${obj}", ${explicit ? "explicitely" : "with inheritance"}, expected to be "${expectedResult}"`, async () => {
			expect(
				await policyCheck({
					sub,
					obj,
					act,
					eft,
				}),
			).toBe(expectedResult)
		})
	}

export const assertPermissions =
	({ sub, obj, eft = PolicyEft.Allow, explicit }: Omit<Enforce, "log" | "ef" | "act">) =>
	({ acts }: { acts: readonly PolicyAct[] }) =>
	(expectedResult = true) => {
		for (const act of acts) assertPermission({ sub, obj, act, eft, explicit })(expectedResult)
	}
