import 'jest';
import { getJWTTokenFromRequest, getUserIdFromJWTToken } from "./jwt";
import  { Request } from 'express'

describe('jwt', () => {

	const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

	it ('get a user if from user token', () => {
		expect(getUserIdFromJWTToken(jwtToken)).toBe('1234567890');
	});

	it ('should fff be able to parse jwt from header', () => {
		const req: any|Request = {
			headers: {
				authorization: `Bearer ${jwtToken}`
			}
		}

		expect(getJWTTokenFromRequest(req)).toBe(jwtToken);
	});
});
