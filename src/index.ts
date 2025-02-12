import { mainFromDB } from "./bootstrap"
import { policyEnforceCheck } from "./enforce"
import {
	PolicyGroupB2BAppdot,
	PolicyGroupB2BRidgefield,
	PolicyGroupRedacFR,
	PolicyGroupRedacTransverseFR,
	PolicyUserAlice,
	PolicyUserBob,
	PolicyUserJohn,
	PolicyUserRoot,
} from "./policies"
import { PolicyAct, PolicyEft, PolicyObj } from "./types"

const main = async () => {
	console.log("----starting----")
	await mainFromDB()
}

main()
	.then(() => {
		console.log("----done----")
		process.exit(0)
	})
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
