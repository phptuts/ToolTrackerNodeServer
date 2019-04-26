import 'jasmine';

import jwt from 'jsonwebtoken';
import { JWT_ENUM, verifyAuthToken } from "./verify-token";

describe('verify token', () => {

	let jwtSpy: jasmine.Spy;

	beforeEach(() => {
		jwtSpy = spyOn(jwt, 'verify');
	});

	it ('should return required status if not available.', () => {
		expect(verifyAuthToken(undefined)).toBe(JWT_ENUM.NO_JWT_TOKEN);
	});

	it ('should return valid jwt token if the token is valid', () => {
		jwtSpy.withArgs('token', jasmine.anything()).and.returnValue(true);
		expect(verifyAuthToken('token')).toBe(JWT_ENUM.VALID_JWT_TOKEN);
	});

	it ('should return in valid jwt token if it\' token is not valid', () => {
		jwtSpy.withArgs('token', jasmine.anything()).and.throwError('Error Invalid token');
		expect(verifyAuthToken('token')).toBe(JWT_ENUM.INVALID_JWT_TOKEN);
	});

});
