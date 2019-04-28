import { expect } from 'chai';
import * as sinon from 'sinon';

import { ICheckout, ITool } from '../../entity/tool';
import { CheckoutRequestStatus, checkoutTool } from "./checkout";
import { Tool } from "../../entity/tool";
import * as userInfo from "../fetch-user";


describe('checkout', () => {

	let sandBox : sinon.SinonSandbox;
	let toolMock: sinon.SinonMock;

	before(() => {
		sandBox = sinon.createSandbox();
	});

	beforeEach(() => {
		toolMock = sinon.mock(Tool);
	});

	afterEach(() => {
		toolMock.verify();
		sandBox.reset();
	});

	it('should return a status of not found if it can not find a tool in the database', async () => {

		toolMock
			.expects( 'findById' )
			.withArgs('uuid_tool')
			.once()
			.callsFake( () => {
			return { exec: () => Promise.resolve( undefined ) };
		} );

		expect( await checkoutTool( 'uuid_tool', 'user_id' ) ).to.eq( CheckoutRequestStatus.TOOL_NOT_FOUND );

	});

	it ('tool with no history should be able to be checked out', async () => {

		const tool : ITool|any  = {
			checkoutHistory: [],
			name: 'Tool',
			save: () => {}
		};


		toolMock.expects( 'findById' )
			.once()
			.withArgs('uuid_tool')
			.callsFake( () => {
			return { exec: () => Promise.resolve( tool ) };
		} );


		const status = await checkoutTool('uuid_tool', 'user_id');

		expect(status).to.eq(CheckoutRequestStatus.CHECKED_OUT);
		expect(tool.checkoutHistory.length).to.eq(1);
		const [checkoutEntry]: ICheckout|any = tool.checkoutHistory;
		expect(checkoutEntry.userCheckingOutTool).to.eq('user_id');
		expect(checkoutEntry.checkoutDate).to.not.undefined;


	});

	it ('should return already checkout if tool is not available', async () => {
		const tool : ITool|any  = {
			checkoutHistory: [
				{
					userCheckingOutTool: 'user_id',
					checkoutDate: new Date()
				}
			],
			name: 'Tool',
			save: () => {}
		};

		toolMock.expects( 'findById' )
			.once()
			.withArgs('uuid_tool')
			.callsFake( () => {
				return { exec: () => Promise.resolve( tool ) };
			} );

		const status = await checkoutTool('uuid_tool', 'user_id');

		expect(status).to.eq(CheckoutRequestStatus.CURRENTLY_INUSE);


	});

	it ('should save and add to the checkout history one tool is available', async () => {

		const tool : ITool|any  = {
			checkoutHistory: [
				{
					userCheckingOutTool: 'user_id2',
					checkoutDate: new Date(),
					returnDate: new Date(),
					userReturningTool: 'user_id2'
				}
			],
			name: 'Tool',
			save: () => {}
		};

		toolMock.expects( 'findById' )
			.once()
			.withArgs('uuid_tool')
			.callsFake( () => {
				return { exec: () => Promise.resolve( tool ) };
			} );

		const status = await checkoutTool('uuid_tool', 'user_id');

		expect(status).to.eq(CheckoutRequestStatus.CHECKED_OUT);
		expect(tool.checkoutHistory.length).to.eq(2);
		const [,checkoutEntry]: ICheckout|any = tool.checkoutHistory;
		expect(checkoutEntry.userCheckingOutTool).to.eq('user_id');
		expect(checkoutEntry.checkoutDate).to.not.undefined;

	});
});
