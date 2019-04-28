import { expect } from 'chai';
import * as sinon from 'sinon';

import { ITool, Tool } from "../../entity/tool";
import { saveTool, updateTool } from "./save-tool";

describe('save-tool', () => {

	const tool: any = {
		'save': async (arg: any) : Promise<any> => {  }
	};

	const toolSaveStub = sinon.stub(tool, 'save');

	let sandBox : sinon.SinonSandbox;

	before(() => {
		sandBox = sinon.createSandbox();
	});

	afterEach(() => {
		sandBox.restore();
	});

	it ('should call save tool', async () => {
		toolSaveStub
			.withArgs({ validateBeforeSave: true })
			.resolves(tool);

		const actualTool = await saveTool(tool);

		expect(toolSaveStub.calledOnce).to.be.true;

		expect(actualTool).to.eq(tool);
	});

	it ('should update the tool', async () => {
		let requestBody: any|ITool = {};
		requestBody._id = 'tool_id';
		requestBody.rfid = 'rfid_number';
		requestBody.name = 'tool name';
		requestBody.description = 'tool description';

		const toolMock = sinon.mock(Tool);

		toolMock.expects('findById')
			.withArgs('tool_id')
			.returns({ exec: () => Promise.resolve(tool) });

		toolSaveStub
			.withArgs({ validateBeforeSave: true })
			.resolves(tool);


		const actualTool = await updateTool(requestBody);

		expect(actualTool.name).to.eq('tool name');
		expect(actualTool.rfid).to.eq('rfid_number');
		expect(actualTool.description).to.eq('tool description');

		toolMock.verify();
		toolMock.restore();
	});
});
