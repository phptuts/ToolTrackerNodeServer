import { verifyToken } from "./verify-token";


export enum JWT_ENUM {
	NO_JWT_TOKEN,
	INVALID_JWT_TOKEN,
	VALID_JWT_TOKEN
}

export const verifyAuthToken = (token: string|undefined): JWT_ENUM => {

	if (!token) {
		return JWT_ENUM.NO_JWT_TOKEN;
	}

	token = token.split(' ')[1];

	if (token) {
		return JWT_ENUM.NO_JWT_TOKEN;
	}

	if (!verifyToken(token)) {
		return JWT_ENUM.INVALID_JWT_TOKEN
	}

	return JWT_ENUM.VALID_JWT_TOKEN;
}
