import 'jest'

import { ITool } from "../../entity/tool";
import { saveTool, updateTool } from "./save-tool";
import * as AllTool from "../../entity/tool";

describe('save-tool', () => {

	let tool: any|ITool;

	let findByIdSpy: jest.SpyInstance;

	let toolSaveSpy: jest.SpyInstance;

	beforeEach(() => {
		findByIdSpy = jest.spyOn(AllTool.Tool, 'findById');
		tool = {
			'save': () => {}
		};
		toolSaveSpy = jest.spyOn(tool, 'save');

		toolSaveSpy.mockImplementation(() => Promise.resolve(tool));
	});

	it ('should call save tool', async () => {
		const actualTool = await saveTool(tool);
		expect(toolSaveSpy).toHaveBeenCalledWith({ validateBeforeSave: true });
		expect(actualTool).toBeDefined();
	});

	it ('should update the tool', async () => {
		let requestBody: any|ITool = {};
		requestBody._id = 'tool_id';
		requestBody.rfid = 'rfid_number';
		requestBody.name = 'tool name';
		requestBody.description = 'tool description';
		findByIdSpy.mockImplementation(() => {
			return { exec: () => Promise.resolve(tool) };
		});



		const actualTool = await updateTool(requestBody);
		expect(findByIdSpy).toHaveBeenCalledWith('tool_id');
		expect(actualTool.name).toBe('tool name');
		expect(actualTool.rfid).toBe('rfid_number');
		expect(actualTool.description).toBe('tool description');
	});
});
