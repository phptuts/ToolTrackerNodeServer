import jwt from 'jsonwebtoken';
import jwkToPem  from 'jwk-to-pem';
import jwk = require('../../public_key.json');
// Where the token is store
// https://cognito-idp.{region}.amazonaws.com/{userpoolid}/.well-known/jwks.json
const pem = jwkToPem(jwk);



export enum JWT_ENUM {
	NO_JWT_TOKEN,
	INVALID_JWT_TOKEN,
	VALID_JWT_TOKEN
}

export const verifyAuthToken = (token: string|undefined): JWT_ENUM => {

	if (!token) {
		return JWT_ENUM.NO_JWT_TOKEN;
	}

	if (!verifyToken(token)) {
		return JWT_ENUM.INVALID_JWT_TOKEN
	}

	return JWT_ENUM.VALID_JWT_TOKEN;
};

export const verifyToken = (jwtToken: string): boolean => {
	try {
		jwt.verify(jwtToken, pem);
		return true;
	} catch (e) {
		return false;
	}
};
