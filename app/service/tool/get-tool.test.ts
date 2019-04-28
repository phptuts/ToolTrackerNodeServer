import { expect } from 'chai';
import * as sinon from 'sinon';

import { getTool, getTools } from "./get-tool";
import { ITool, Tool } from "../../entity/tool";
import * as userInfo from "../fetch-user";
const cache = require('memory-cache');

describe('get tools', () => {

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
		sandBox.restore();
	});



	it('should return undefined if no tools is available.', async () => {

		toolMock.expects( 'findById' )
			.withArgs('tool_id')
			.once()
			.returns( { exec: () => Promise.resolve( undefined ) });

		const tool = await getTool('tool_id');

		expect(tool).to.undefined;
	});

	it('return the tool with sorted history.', async () => {
		// Because we are mocking the whole object we can't do anything in the before each
		const getUserInfoStub = sinon.stub(userInfo, 'getUserObject');
		const expectedUser = {
			email: 'user@gmail.com',
			id: 'user_id_fake'
		};

		getUserInfoStub.withArgs('user_id').resolves(expectedUser);

		const toolFromDb: any|ITool = {
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


		toolMock.expects( 'findById' )
			.withArgs('tool_id')
			.once()
			.returns( { exec: () => Promise.resolve( toolFromDb ) });

		const tool = await getTool('tool_id');

		expect(tool).to.not.undefined;

		expect(tool.checkoutHistory[0].checkoutDate).to.eql(new Date('2019-03-02'));
		expect(tool.checkoutHistory[1].checkoutDate).to.eql(new Date('2019-02-02'));
		expect(tool.checkoutHistory[2].checkoutDate).to.eql(new Date('2019-01-02'));
		getUserInfoStub.restore();
	});


	it('return the tool with sorted history.', async () => {
		// Because we are mocking the whole object we can't do anything in the before each
		const getUserInfoStub = sinon.stub(userInfo, 'getUserObject');
		const expectedUser = {
			email: 'user@gmail.com',
			id: 'user_id_fake'
		};

		getUserInfoStub.withArgs('user_id').resolves(expectedUser);

		const toolFromDb1: any|ITool = {
			checkoutHistory: [
				{
					checkoutDate: new Date('2019-02-02'),
					userCheckingOutTool: 'user_id',
					userReturningTool: 'user_id',
					returnDate: new Date('2019-01-02'),
				},
				{
					checkoutDate: new Date('2019-03-02'),
					userCheckingOutTool: 'user_id',
					userReturningTool: 'user_id',
					returnDate: new Date('2019-01-02'),

				},
				{
					checkoutDate: new Date('2019-01-02'),
					returnDate: new Date('2019-01-02'),
					userCheckingOutTool: 'user_id',
					userReturningTool: 'user_id'
				},
			]
		};

		const toolFromDb2: any|ITool = {
			checkoutHistory: [
				{
					checkoutDate: new Date('2019-02-02'),
					userCheckingOutTool: 'user_id',
					userReturningTool: 'user_id',
					returnDate: new Date('2019-01-02'),
				},
				{
					checkoutDate: new Date('2019-03-02'),
					userCheckingOutTool: 'user_id',
					userReturningTool: 'user_id',
					returnDate: new Date('2019-01-02'),

				},
				{
					checkoutDate: new Date('2019-01-02'),
					returnDate: new Date('2019-01-02'),
					userCheckingOutTool: 'user_id',
					userReturningTool: 'user_id'
				},
			]
		};


		const mockDoc = {

				limit(limit: number) {
					expect(limit).to.eq(300);

					return this;
				},

				sort(field: string) {

					return this;
				},

				exec() {
					return Promise.resolve([toolFromDb2, toolFromDb1]);
				}
		};

		toolMock
			.expects( 'find' )
			.once()
			.returns(mockDoc) ;

		const tools = await getTools();

		expect(tools).to.not.undefined;

		const [tool1, tool2] = tools;

		expect(tool1.checkoutHistory[0].checkoutDate).to.eql(new Date('2019-03-02'));
		expect(tool1.checkoutHistory[1].checkoutDate).to.eql(new Date('2019-02-02'));
		expect(tool1.checkoutHistory[2].checkoutDate).to.eql(new Date('2019-01-02'));

		expect(tool2.checkoutHistory[0].checkoutDate).to.eql(new Date('2019-03-02'));
		expect(tool2.checkoutHistory[1].checkoutDate).to.eql(new Date('2019-02-02'));
		expect(tool2.checkoutHistory[2].checkoutDate).to.eql(new Date('2019-01-02'));

		getUserInfoStub.restore();
	});
});
