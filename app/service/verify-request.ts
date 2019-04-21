import { verifyToken } from "./verify-token";


export const verifyAuthToken = (token: string|undefined): {'error': string, status: number}|undefined => {

	if (!token) {
		return {'error': 'JWT TOKEN REQUIRED', status: 401};;
	}

	token = token.split(' ')[1];

	if (!token || !verifyToken(token)) {
		return {'error': 'Invalid JWT Token', status: 403};
	}

	return undefined;
}
