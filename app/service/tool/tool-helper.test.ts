import { expect } from 'chai';
import * as sinon from 'sinon';

import { ITool } from "../../entity/tool";
import { populateTool, sortToolCheckoutHistory } from "./tool-helper";
import * as userInfo from "../fetch-user";

describe('tool helpers', () => {

	let sandBox : sinon.SinonSandbox;

	before(() => {
		sandBox = sinon.createSandbox();
	});

	afterEach(() => {
		sandBox.restore();
	});

	describe('sortToolCheckoutHistory', () => {
		it ('should sort a tool list in descending order', () => {

			const tool: any|ITool = {
				checkoutHistory: [
					{
						checkoutDate: new Date('2019-02-02'),
						userCheckingOutTool: 'user_id'
					},
					{
						checkoutDate: new Date('2019-03-02'),
						userCheckingOutTool: 'user_id'
					},
					{
						checkoutDate: new Date('2019-01-02'),
						userCheckingOutTool: 'user_id'
					},
				]
			};

			sortToolCheckoutHistory(tool);

			expect(tool.checkoutHistory[0].checkoutDate).to.eql(new Date('2019-03-02'));
			expect(tool.checkoutHistory[1].checkoutDate).to.eql(new Date('2019-02-02'));
			expect(tool.checkoutHistory[2].checkoutDate).to.eql(new Date('2019-01-02'));
		});
	});

	// describe('populate tool',  () => {
	//
	// 	it ('should populate the tools with the user information', async () => {
	// 		const getUserInfoStub = sinon.stub(userInfo, 'getUserObject');
	// 		const expectedUser = {
	// 			email: 'user@gmail.com',
	// 			id: 'user_id_fake'
	// 		};
	//
	// 		getUserInfoStub.withArgs('user_id').resolves(expectedUser);
	//
	// 		const tool: any|ITool = {
	// 			createdBy: 'user_id',
	// 			name: 'hammer',
	// 			checkoutHistory: [
	// 				{
	// 					checkoutDate: new Date('2019-04-02'),
	// 					userCheckingOutTool: 'user_id'
	// 				},
	// 				{
	// 					checkoutDate: new Date('2019-03-02'),
	// 					userCheckingOutTool: 'user_id',
	// 					userReturningTool: 'user_id',
	// 					returnDate: new Date('2019-03-04')
	// 				},
	// 				{
	// 					checkoutDate: new Date('2019-02-02'),
	// 					userCheckingOutTool: 'user_id',
	// 					userReturningTool: 'user_id',
	// 					returnDate: new Date('2019-02-04')
	// 				},
	// 			]
	// 		};
	//
	// 		const displayTool = await populateTool(tool);
	//
	// 		expect(displayTool.createdBy).to.eq(expectedUser);
	// 		expect(displayTool.checkoutHistory[0].userCheckingOutTool).to.eq(expectedUser);
	//
	// 		expect(displayTool.checkoutHistory[1].userCheckingOutTool).to.eq(expectedUser);
	// 		expect(displayTool.checkoutHistory[1].userReturningTool).to.eq(expectedUser);
	//
	// 		expect(displayTool.checkoutHistory[2].userCheckingOutTool).to.eq(expectedUser);
	// 		expect(displayTool.checkoutHistory[2].userReturningTool).to.eq(expectedUser);
	//
	// 		getUserInfoStub.restore();
	//
	// 	});
	//
	// });
});
