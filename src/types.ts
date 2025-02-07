import type { Enforcer } from "casbin"

export type Context = {
	ef: Enforcer
}

export enum PolicyObjectEnum {
	MOVIE = "MOVIE",
	MOVIE_LOCALIZED_DATA = "MOVIE_LOCALIZED_DATA",
	MOVIE_BRANDED_DATA = "MOVIE_BRANDED_DATA",
	THEATER = "THEATER",
}

export enum PolicyActionEnum {
	CREATE = "CREATE",
	READ = "READ",
	UPDATE = "UPDATE",
	DELETE = "DELETE",
}
