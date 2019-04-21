import 'jasmine';
import * as AllTool from '../../entity/tool';
import { ICheckout, ITool } from '../../entity/tool';
import { CheckoutRequestStatus, checkoutTool } from "./checkout";


describe('checkout', () => {

	let findByIdSpy: jasmine.Spy;

	beforeEach(() => {
		findByIdSpy = spyOn(AllTool.Tool, 'findById');
	});

	it('should return a status of not found if it can not find a tool in the database', async () => {
		findByIdSpy.withArgs('uuid_tool').and.returnValue({exec: () => Promise.resolve(null) });

		expect(await checkoutTool('uuid_tool', 'user_id')).toBe(CheckoutRequestStatus.TOOL_NOT_FOUND);
	});


	it ('tool with no history should be able to be checked out', async () => {
		const tool : ITool|any  = {
			checkoutHistory: [],
			name: 'Tool',
			save: () => {}
		};

		const toolSpy = spyOn(tool, 'save');
		findByIdSpy.withArgs('uuid_tool')
			.and.returnValue({exec: () => Promise.resolve(tool) });
		const status = await checkoutTool('uuid_tool', 'user_id');

		expect(status).toBe(CheckoutRequestStatus.CHECKED_OUT);
		expect(tool.checkoutHistory.length).toBe(1);
		const [checkoutEntry]: ICheckout|any = tool.checkoutHistory;
		expect(checkoutEntry.userCheckingOutTool).toBe('user_id');
		expect(checkoutEntry.checkoutDate).toBeDefined();
		expect(toolSpy).toHaveBeenCalledWith({ validateBeforeSave: true });
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

		findByIdSpy.withArgs('uuid_tool')
			.and.returnValue({exec: () => Promise.resolve(tool) });
		const status = await checkoutTool('uuid_tool', 'user_id');

		expect(status).toBe(CheckoutRequestStatus.CURRENTLY_INUSE);

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

		const toolSpy = spyOn(tool, 'save');
		findByIdSpy.withArgs('uuid_tool')
			.and.returnValue({exec: () => Promise.resolve(tool) });
		const status = await checkoutTool('uuid_tool', 'user_id');

		expect(status).toBe(CheckoutRequestStatus.CHECKED_OUT);
		expect(tool.checkoutHistory.length).toBe(2);
		const [,checkoutEntry]: ICheckout|any = tool.checkoutHistory;
		expect(checkoutEntry.userCheckingOutTool).toBe('user_id');
		expect(checkoutEntry.checkoutDate).toBeDefined();
		expect(toolSpy).toHaveBeenCalledWith({ validateBeforeSave: true });

	});
});
