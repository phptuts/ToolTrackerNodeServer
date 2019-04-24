import { ListUsersResponse } from "aws-sdk/clients/cognitoidentityserviceprovider";
const cache = require('memory-cache');
const config = require('./../../config.json');
import { cognitoClient } from './congito-client';


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

	const [userData] = userList.Users;

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



