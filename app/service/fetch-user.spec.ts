import 'jest';

import { cognitoClient } from "./congito-client";
import { ListUsersResponse } from "aws-sdk/clients/cognitoidentityserviceprovider";
import { getUserObject } from "./fetch-user";
const config = require('./../../config.json');
const cache = require('memory-cache');

describe('fetch user', () => {

	let listUserSpy: jest.SpyInstance;
	config.userPoolId = 'fake_config_id';

	beforeEach(() => {
		cache.clear();
		listUserSpy = jest.spyOn(cognitoClient, 'listUsers');
	});

	afterEach(() => {
		listUserSpy.mockReset();
	});

	it ('should be able to fetch a user and save it to the cache', async () => {
		const users: any|ListUsersResponse = {
			Users: [
				{
					Attributes: [
						{
							Name: 'email',
							Value: 'email@gmail.com'
						}
					]
				}
			]
		};

		listUserSpy.mockImplementation(() => {
			return { promise: () => Promise.resolve(users) }
		});

		const user = await getUserObject('user_id');
		const user2 = await getUserObject('user_id');

		expect(listUserSpy).toHaveBeenCalledTimes(1);

		expect(user).toEqual(user2);
		expect(user.email).toBe('email@gmail.com');
		expect(user.id).toBe('user_id');
	});

	it ('should return if it can not find the user', async () => {
		const users: any|ListUsersResponse = {
			Users: []
		};

		listUserSpy.mockImplementation(() => {
			return { promise: () => Promise.resolve(users) }
		});

		const user = await getUserObject('user_id');

		expect(user).toBeUndefined();
	});
});
