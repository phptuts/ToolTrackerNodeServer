import { Request } from "express";
import  atob  from 'atob';

export const getUserIdFromJWTToken = (token: string) => {
	const { sub } = decodeJWTTokenPayload(token);

	return sub;
};

export const decodeJWTTokenPayload = (token: string) => {
	const [, payloadEncoded] = token.split('.');

	return JSON.parse(atob(payloadEncoded));
};

export const getJWTTokenFromRequest = (req: Request) => {
	const authHeader = req.headers.authorization.split(' ');

	const  [ ,jwtToken] = authHeader;

	return jwtToken;
};
