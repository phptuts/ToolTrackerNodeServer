import { expect } from 'chai';
import * as sinon from 'sinon';

import { returnTool, ReturnToolStatus } from "./return-tool";
import { ITool } from "../../entity/tool";
import { Tool } from "../../entity/tool";

describe( 'return tool', () => {

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

	it( 'tool is not found it should return not found status.', async () => {


		toolMock
			.expects( 'findById' )
			.withArgs('tool_id')
			.returns(  { exec: () => Promise.resolve( undefined ) });

		expect( await returnTool( 'tool_id', 'user_id' ) )
			.to.eq( ReturnToolStatus.TOOL_NOT_FOUND );


	} );

	it( 'if tools has already been return show correct status', async () => {

		const toolAlreadyReturn: any | ITool = {
			checkoutHistory: [
				{
					returnDate: new Date(),
					userReturningTool: 'user_id'
				}
			]
		};

		toolMock.expects( 'findById' )
			.withArgs('tool_id')
			.returns( { exec: () => Promise.resolve( toolAlreadyReturn ) });


		expect( await returnTool( 'tool_id', 'user_id' ) )
			.to.eq( ReturnToolStatus.TOOL_ALREADY_RETURNED );

	} );

	it( 'should be able to return tool', async () => {

		const tool: any | ITool = {
			checkoutHistory: [
				{
					checkoutDate: new Date(),
					userCheckingOutTool: 'user_id'
				},
			],
			'save': () => {
			}
		};

		const toolSaveStub = sinon.stub(tool, 'save');

		toolSaveStub
			.withArgs({ validateBeforeSave: true })
			.resolves(tool);

		toolMock
			.expects( 'findById' )
			.withArgs('tool_id')
			.callsFake( () => {
				return { exec: () => Promise.resolve( tool ) };
			} );


		expect( await returnTool( 'tool_id', 'user_id' ) )
			.to.eq( ReturnToolStatus.RETURNED );

		expect( tool.checkoutHistory[ 0 ].returnDate ).to.not.undefined;
		expect( tool.checkoutHistory[ 0 ].userReturningTool ).to.eq( 'user_id' );
	} );

} );
