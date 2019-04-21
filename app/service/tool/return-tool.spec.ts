import 'jasmine';
import * as AllTool from "../../entity/tool";
import { returnTool, ReturnToolStatus } from "./return-tool";
import { ITool } from "../../entity/tool";

describe('return tool', () => {

	let findByIdSpy: jasmine.Spy;

	beforeEach(() => {
		findByIdSpy = spyOn(AllTool.Tool, 'findById');
	});

	it ('tool is not found it should return not found status.', async () => {
		findByIdSpy.withArgs('tool_id').and.callFake(() => {
			return 	{ exec: () => Promise.resolve(undefined) };
		});

		expect(await returnTool('tool_id', 'user_id'))
			.toBe(ReturnToolStatus.TOOL_NOT_FOUND);
	});

	it ('if tools has already been return show correct status', async () => {

		const toolAlreadyReturn: any|ITool = {
			checkoutHistory: [
				{
					returnDate: new Date(),
					userReturningTool: 'user_id'
				}
			]
		};

		findByIdSpy.withArgs('tool_id').and.callFake(() => {
			return 	{ exec: () => Promise.resolve(toolAlreadyReturn) };
		});

		expect(await returnTool('tool_id', 'user_id'))
			.toBe(ReturnToolStatus.TOOL_ALREADY_RETURNED);

	});

	it ('should be able to return tool', async () => {
		const tool: any|ITool = {
			checkoutHistory: [
				{
					checkoutDate: new Date(),
					userCheckingOutTool: 'user_id'
				},
			],
			'save': () => {}
		};

		const toolSaveSpay = spyOn(tool, 'save')
			.withArgs({ validateBeforeSave: true })
			.and.returnValue(Promise.resolve());

		findByIdSpy.withArgs('tool_id').and.callFake(() => {
			return 	{ exec: () => Promise.resolve(tool) };
		});


		expect(await returnTool('tool_id', 'user_id'))
			.toBe(ReturnToolStatus.RETURNED);

		expect(toolSaveSpay).toHaveBeenCalledWith({ validateBeforeSave: true });
		expect(tool.checkoutHistory[0].returnDate).toBeDefined();
		expect(tool.checkoutHistory[0].userReturningTool).toBe('user_id');
	});

});
