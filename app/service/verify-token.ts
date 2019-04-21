const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
import  jwk = require('../../public_key.json');
// Where the token is store
// https://cognito-idp.{region}.amazonaws.com/{userpoolid}/.well-known/jwks.json
const pem = jwkToPem(jwk);

export const verifyToken = (jwtToken: string): boolean => {
	try {
		jwt.verify(jwtToken, pem);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};
