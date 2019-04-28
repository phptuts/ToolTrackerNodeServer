import { expect } from 'chai';
import * as sinon from 'sinon';

import { cognitoClient } from "./congito-client";
import { ListUsersResponse } from "aws-sdk/clients/cognitoidentityserviceprovider";
import { getUserObject } from "./fetch-user";
const config = require('./../../config.json');
const cache = require('memory-cache');

describe('fetch user', () => {

	config.userPoolId = 'fake_config_id';
	const listUserStub = sinon.stub(cognitoClient, 'listUsers');

	let sandBox : sinon.SinonSandbox;

	before(() => {
		sandBox = sinon.createSandbox();
	});

	beforeEach(() => {
		cache.clear();
	});

	afterEach(() => {
		sandBox.restore();
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

		const returnSub: any = { promise: () => Promise.resolve(users) };
		listUserStub
			 .withArgs({ Filter: 'sub = "user_id"', UserPoolId: 'fake_config_id' })
			 .returns(returnSub);

		const user = await getUserObject('user_id');
		const user2 = await getUserObject('user_id');

		expect(listUserStub.calledOnce).to.be.true;

		expect(user).to.eq(user2);
		expect(user.email).to.eq('email@gmail.com');
		expect(user.id).to.eq('user_id');
	});

	it ('should return undefined if email address is not present', async () => {
		const users: any|ListUsersResponse = {
			Users: [
				{
					Attributes: [

					]
				}
			]
		};

		const returnSub: any = { promise: () => Promise.resolve(users) };
		listUserStub
			.withArgs({ Filter: 'sub = "user_id"', UserPoolId: 'fake_config_id' })
			.returns(returnSub);

		const user = await getUserObject('user_id');

		expect(user).to.undefined;
	});

	it ('should return if it can not find the user', async () => {
		const users: any|ListUsersResponse = {
			Users: []
		};

		const returnSub: any = { promise: () => Promise.resolve(users) };

		listUserStub
			.withArgs({ Filter: 'sub = "user_id"', UserPoolId: 'fake_config_id' })
			.returns( returnSub);

		const user = await getUserObject('user_id');

		expect(user).to.undefined;
	});
});
