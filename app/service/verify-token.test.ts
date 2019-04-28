import { expect } from 'chai';
import * as sinon from 'sinon';

import jwt from 'jsonwebtoken';
import { JWT_ENUM, verifyAuthToken } from "./verify-token";

describe('verify token', () => {

	const jwtStub = sinon.stub(jwt, 'verify');

	it ('should return required status if not available.', () => {
		expect(verifyAuthToken(undefined)).to.eq(JWT_ENUM.NO_JWT_TOKEN);
	});

	it ('should return valid jwt token if the token is valid', () => {
		jwtStub.withArgs('token', sinon.match.any).alwaysReturned(true);
		expect(verifyAuthToken('token')).to.eq(JWT_ENUM.VALID_JWT_TOKEN);
	});

	it ('should return in valid jwt token if it\' token is not valid', () => {
		jwtStub.withArgs('token', sinon.match.any).throws('Error Invalid JWT Token')
		expect(verifyAuthToken('token')).to.eq(JWT_ENUM.INVALID_JWT_TOKEN);
	});

});
