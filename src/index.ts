import { newEnforcer } from "casbin";
import KnexAdapter from "casbin-knex-adapter";
import Knex from "knex";
import { checkPermission, enforce } from "./enforce";
import {
	ALL_GROUPING_POLICIES,
	ALL_POLICIES,
	POLICY_USER_ALICE,
	POLICY_USER_BOB,
	POLICY_USER_JOHN,
} from "./policies";
import { Context, PolicyActionEnum, PolicyObjectEnum } from "./types";

/**
 * @deprecated prefer mainFromDB
 * @returns
 */
const mainFromFile = async (): Promise<Context> => {
	const ef = await newEnforcer("casbin/model.conf", "casbin/policy.csv");
	return {
		ef,
	};
};

const mainFromDB = async (): Promise<Context> => {
	const knex = Knex({
		acquireConnectionTimeout: 1000,
		client: "pg",
		connection: "pgsql://postgres:1234@localhost:5436",
		pool: {
			min: 0,
			max: 50,
			destroyTimeoutMillis: 1000,
			idleTimeoutMillis: 60000,
			reapIntervalMillis: 500,
			createRetryIntervalMillis: 500,
			propagateCreateError: false,
		},
	});
	const adapter = await KnexAdapter.newAdapter(knex);

	const ef = await newEnforcer("casbin/model.conf", adapter);

	await ef.clearPolicy();

	await ef.addPolicies(ALL_POLICIES);
	await ef.addGroupingPolicies(ALL_GROUPING_POLICIES);

	await ef.savePolicy();
	await ef.loadPolicy();

	return {
		ef,
	};
};

const main = async () => {
	console.log("----starting----");
	const { ef } = await mainFromDB();

	console.log("===>groups policies", await ef.getGroupingPolicy());

	console.log(
		`===>groups of user ${POLICY_USER_ALICE}`,
		await ef.getRolesForUser(POLICY_USER_ALICE),
	);
	console.log(
		`===>groups of user ${POLICY_USER_BOB}`,
		await ef.getRolesForUser(POLICY_USER_BOB),
	);
	console.log(
		`===>groups of user ${POLICY_USER_JOHN}`,
		await ef.getRolesForUser(POLICY_USER_JOHN),
	);

	const check = checkPermission(ef);

	// alice
	await check(POLICY_USER_ALICE, PolicyObjectEnum.MOVIE, PolicyActionEnum.READ);
	await check(
		POLICY_USER_ALICE,
		PolicyObjectEnum.MOVIE,
		PolicyActionEnum.DELETE,
	);
	await check(
		POLICY_USER_ALICE,
		PolicyObjectEnum.MOVIE,
		PolicyActionEnum.CREATE,
	);
	await check(
		POLICY_USER_ALICE,
		PolicyObjectEnum.MOVIE_BRANDED_DATA,
		PolicyActionEnum.CREATE,
	);
	await check(
		POLICY_USER_ALICE,
		PolicyObjectEnum.MOVIE_LOCALIZED_DATA,
		PolicyActionEnum.UPDATE,
	);

	// bob
	await check(POLICY_USER_BOB, PolicyObjectEnum.MOVIE, PolicyActionEnum.READ);
	await check(
		POLICY_USER_BOB,
		PolicyObjectEnum.MOVIE_BRANDED_DATA,
		PolicyActionEnum.CREATE,
	);
	await check(
		POLICY_USER_BOB,
		PolicyObjectEnum.MOVIE_LOCALIZED_DATA,
		PolicyActionEnum.CREATE,
	);

	// john
	await check(POLICY_USER_JOHN, PolicyObjectEnum.MOVIE, PolicyActionEnum.READ);
	await check(
		POLICY_USER_JOHN,
		PolicyObjectEnum.MOVIE_BRANDED_DATA,
		PolicyActionEnum.CREATE,
	);
};

main()
	.then(() => {
		console.log("----done----");
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
