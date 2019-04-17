import { ITool, IToolDisplay, Tool } from "../entity/tool";
import { getUserObject } from "./user-service";

export const saveTool = async ( tool: ITool ) => {
	const toolEntity = new Tool( tool );
	toolEntity.checkoutHistory = [];
	return await toolEntity.save();
};

export const updateTool = async ( requestBody: ITool ) => {
	const tool = await Tool.findById( requestBody._id ).exec();
	tool.description = requestBody.description;
	tool.name = requestBody.name;
	tool.rfid = requestBody.rfid;
	return await tool.save( { validateBeforeSave: true } );
};

export const getTools = async (): Promise<IToolDisplay[]> => {
	const tools = await Tool.find().exec();

	tools.forEach( tool => {
		sortToolCheckoutHistory( tool );
	});

	return await Promise.all( tools.map( async ( tool ) => {

		const checkoutHistory = await Promise.all( tool.checkoutHistory.map( async ( entry ) => {
			const returnUser = entry.userReturningTool ? await getUserObject( entry.userReturningTool ) : undefined;

			return {
				userCheckingOutTool: await getUserObject( entry.userCheckingOutTool ),
				checkoutDate: entry.checkoutDate,
				userReturningTool: returnUser,
				returnDate: entry.returnDate
			}
		}));

		return {
			_id: tool._id,
			createdBy: await getUserObject( tool.createdBy ),
			rfid: tool.rfid,
			name: tool.name,
			description: tool.description,
			createdAt: tool.createdAt,
			updatedAt: tool.updatedAt,
			checkoutHistory: checkoutHistory
		}
	}));

};

export enum ReturnToolStatus {
	RETURNED,
	TOOL_NOT_FOUND,
	TOOL_ALREADY_RETURNED
}

const sortToolCheckoutHistory = ( tool: ITool ) => {
	tool.checkoutHistory.sort( ( a, b ) =>
		a.checkoutDate.getMilliseconds() - b.checkoutDate.getMilliseconds() );
};

export const returnTool = async ( toolId: string, userId: string ): Promise<ReturnToolStatus> => {

	let tool: ITool;

	try {
		tool = await Tool.findById( toolId ).exec();
	} catch (e) {
		return ReturnToolStatus.TOOL_NOT_FOUND;
	}

	sortToolCheckoutHistory( tool );

	const [ currentHistory ] = tool.checkoutHistory;

	if (currentHistory.returnDate) {
		return ReturnToolStatus.TOOL_ALREADY_RETURNED;
	}

	currentHistory.returnDate = new Date();
	currentHistory.userReturningTool = userId;

	await tool.save( { validateBeforeSave: true } );

	return ReturnToolStatus.RETURNED;
};

export enum CheckoutRequestStatus {
	CHECKEDOUT,
	CURRENTLY_INUSE,
	TOOL_NOT_FOUND
}

export const checkoutTool = async ( toolId: string, userId: string ): Promise<CheckoutRequestStatus> => {
	let tool: ITool;

	try {
		tool = await Tool.findById( toolId ).exec();
	} catch (e) {
		return CheckoutRequestStatus.TOOL_NOT_FOUND;
	}

	if (!tool) {
		return CheckoutRequestStatus.TOOL_NOT_FOUND;
	}

	tool.checkoutHistory.sort( ( a, b ) =>
		b.checkoutDate.getMilliseconds() - a.checkoutDate.getMilliseconds() );

	const [ currentHistory ] = tool.checkoutHistory;

	if (currentHistory && !currentHistory.returnDate) {
		return CheckoutRequestStatus.CURRENTLY_INUSE;
	}

	tool.checkoutHistory = !currentHistory ? [] : tool.checkoutHistory;

	tool.checkoutHistory.push( {
		userCheckingOutTool: userId,
		checkoutDate: new Date()
	} );


	await tool.save( { validateBeforeSave: true } );

	return CheckoutRequestStatus.CHECKEDOUT;
};

