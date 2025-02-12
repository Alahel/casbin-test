import { mainFromDB } from "./bootstrap.js"

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
