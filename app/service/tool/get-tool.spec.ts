import 'jest'

import { getTool } from "./get-tool";
import { Tool } from "../../entity/tool";


describe('get tools', () => {

	let findByIdSpy: jest.SpyInstance;

	beforeEach(() => {
		findByIdSpy = jest.spyOn(Tool, 'findById');
	});

	afterEach(() => {
		findByIdSpy.mockReset();
	});

	it('should return undefined if no tools is available.', async () => {

		findByIdSpy.mockImplementation(() => {
			return { exec: () => Promise.resolve(undefined) };
		});

		const tool = await getTool('tool_id');

		expect(tool).toBeUndefined();
		expect(findByIdSpy).toHaveBeenCalledWith('tool_id');
		expect(findByIdSpy).toHaveBeenCalledTimes(1);
	});

	it ('should find a list of tools', () => {

	});

});
