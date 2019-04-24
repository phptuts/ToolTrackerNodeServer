import 'jasmine';
import { getTool } from "./get-tool";
import * as AllTool from "../../entity/tool";

describe('get tools', () => {

	let findByIdSpy: jasmine.Spy;

	beforeEach(() => {
		findByIdSpy = spyOn(AllTool.Tool, 'findById');
	});

	it('should return undefined if no tools is available.', async () => {

		findByIdSpy.withArgs('tool_id').and.callFake(() => {
			return { exec: () => Promise.resolve(undefined) };
		});

		const tool = await getTool('tool_id');

		expect(tool).toBeUndefined();
	});

});
