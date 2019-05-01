import 'jest';
import { ITool, Tool } from "../../entity/tool";
import { deleteTool, DeleteToolStatus } from "./delete-tool";


describe('delete tool', () => {

	let deleteToolSpy: jest.SpyInstance;



	beforeEach(() => {
		deleteToolSpy = jest.spyOn(Tool, 'deleteOne');
	});

	it ('should return tool not found if it\'s not returned', async () => {
		deleteToolSpy.mockImplementation(() =>  Promise.resolve({ ok: 0 }));

		const status = await deleteTool('tool_id');

		expect(status).toBe(DeleteToolStatus.ERROR);
		expect(deleteToolSpy).toHaveBeenCalledWith({_id: 'tool_id'});
	});

	it ('should return delete if a tool is returned', async () => {
		deleteToolSpy
			.mockImplementation(() => Promise.resolve({ ok: 1 }));

		const status = await deleteTool('tool_id');

		expect(status).toBe(DeleteToolStatus.DELETED);
		expect(deleteToolSpy).toHaveBeenCalledWith({_id: 'tool_id'});

	});

});
