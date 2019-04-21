import AWS from "aws-sdk";
import { ListUsersResponse } from "aws-sdk/clients/cognitoidentityserviceprovider";
const config = require('./../../config.json');
const cache = require('memory-cache');


const cognitoClient = new AWS.CognitoIdentityServiceProvider({
	region: config.region
});

export const getUserObject = async (id: string) => {

	const cacheUser = cache.get(`user-${id}`);
	if (cacheUser) {
		return cacheUser;
	}

	const filter = "sub = \"" + id + "\"";
	const req = {
		"Filter": filter,
		"UserPoolId": config.userPoolId 
	};

	const userList: ListUsersResponse =  await cognitoClient.listUsers(req).promise();

	const userData = userList.Users[0];

	if (!userData) {
		return undefined;
	}

	const [emailAttribute] =
		userData.Attributes.filter(attribute => attribute.Name == 'email');

	if (!emailAttribute) {
		return undefined;
	}
	const user =  {
		email: emailAttribute.Value,
		id
	};

	// 30 minutes is the cache time
	cache.put(`user-${id}`, user, 1000 * 60 * 30);

	return user;
};


export const getUserIdFromJWTToken = (token: string) => {
	const { sub } = decodeJWTTokenPayload(token);

	return sub;
};


const decodeJWTTokenPayload = (token: string) => {
	const [, payloadEncoded] = token.split('.');

	const buff = new Buffer(payloadEncoded, 'base64');
	const text = buff.toString('ascii');
	return JSON.parse(text);
};

