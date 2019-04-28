import 'jest'

import { returnTool, ReturnToolStatus } from "./return-tool";
import { ITool, Tool } from "../../entity/tool";

describe('return tool', () => {

	let findByIdSpy: jest.SpyInstance;

	beforeEach(() => {
		findByIdSpy = jest.spyOn(Tool, 'findById');
	});

	afterEach(() => {
		findByIdSpy.mockReset();
	});

	it ('tool is not found it should return not found status.', async () => {
		findByIdSpy.mockImplementation(() => {
			return 	{ exec: () => Promise.resolve(undefined) };
		});

		expect(await returnTool('tool_id', 'user_id'))
			.toBe(ReturnToolStatus.TOOL_NOT_FOUND);

		expect(findByIdSpy).toHaveBeenCalledWith('tool_id');
		expect(findByIdSpy).toHaveBeenCalledTimes(1);
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

		findByIdSpy.mockImplementation(() => {
			return 	{ exec: () => Promise.resolve(toolAlreadyReturn) };
		});


		expect(await returnTool('tool_id', 'user_id'))
			.toBe(ReturnToolStatus.TOOL_ALREADY_RETURNED);

		expect(findByIdSpy).toHaveBeenCalledWith('tool_id');
		expect(findByIdSpy).toHaveBeenCalledTimes(1);
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

		const toolSaveSpy = jest.spyOn(tool, 'save');
		toolSaveSpy.mockImplementation(tool => Promise.resolve(tool));
		findByIdSpy.mockImplementation(() => {
			return 	{ exec: () => Promise.resolve(tool) };
		});


		expect(await returnTool('tool_id', 'user_id'))
			.toBe(ReturnToolStatus.RETURNED);

		expect(toolSaveSpy).toHaveBeenCalledWith({ validateBeforeSave: true });
		expect(tool.checkoutHistory[0].returnDate).toBeDefined();
		expect(tool.checkoutHistory[0].userReturningTool).toBe('user_id');
	});

});
