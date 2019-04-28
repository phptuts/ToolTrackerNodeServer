import 'jest'

import { getTool, getTools } from "./get-tool";
import { ITool, Tool } from "../../entity/tool";
import * as userInfo from "../fetch-user";


describe('get tools', () => {

	let findByIdSpy: jest.SpyInstance;
	let findSpy: jest.SpyInstance;

	let getUserInfoStub: jest.SpyInstance;

	const expectedUser = {
		email: 'user@gmail.com',
		id: 'user_id_fake'
	};

	beforeEach(() => {
		findByIdSpy = jest.spyOn(Tool, 'findById');
		findSpy = jest.spyOn(Tool, 'find');
		getUserInfoStub = jest.spyOn(userInfo, 'getUserObject');
		getUserInfoStub.mockImplementation(() => Promise.resolve(expectedUser));
	});

	afterEach(() => {
		findByIdSpy.mockReset();
		getUserInfoStub.mockReset();
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

	it('return the tool with sorted history.', async () => {
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


		findByIdSpy.mockImplementation(() => {
			return { exec: () => Promise.resolve(toolFromDb) };
		});

		const tool = await getTool('tool_id');

		expect(tool).toBeDefined();

		expect(tool.checkoutHistory[0].checkoutDate).toEqual(new Date('2019-03-02'));
		expect(tool.checkoutHistory[1].checkoutDate).toEqual(new Date('2019-02-02'));
		expect(tool.checkoutHistory[2].checkoutDate).toEqual(new Date('2019-01-02'));
	});


	it('return the tool with sorted history.', async () => {

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
				expect(limit).toBe(300);

				return this;
			},

			sort(field: string) {
				expect(field).toBe('name');
				return this;
			},

			exec() {
				return Promise.resolve([toolFromDb2, toolFromDb1]);
			}
		};

		findSpy.mockImplementation(() => mockDoc);

		const tools = await getTools();

		expect(tools).toBeDefined();

		const [tool1, tool2] = tools;

		expect(tool1.checkoutHistory[0].checkoutDate).toEqual(new Date('2019-03-02'));
		expect(tool1.checkoutHistory[1].checkoutDate).toEqual(new Date('2019-02-02'));
		expect(tool1.checkoutHistory[2].checkoutDate).toEqual(new Date('2019-01-02'));

		expect(tool2.checkoutHistory[0].checkoutDate).toEqual(new Date('2019-03-02'));
		expect(tool2.checkoutHistory[1].checkoutDate).toEqual(new Date('2019-02-02'));
		expect(tool2.checkoutHistory[2].checkoutDate).toEqual(new Date('2019-01-02'));

	});

});
