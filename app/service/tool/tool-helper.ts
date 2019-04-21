import { ICheckoutDisplay, ITool } from "../../entity/tool";
import { getUserObject } from "../fetch-user-service";

export const sortToolCheckoutHistory = ( tool: ITool ) => {
	tool.checkoutHistory.sort( ( a, b ) =>
		a.checkoutDate.getMilliseconds() - b.checkoutDate.getMilliseconds() );
};


export const populateTool = async ( tool ) => {

	const checkoutHistory = await populateToolHistory(tool);

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
};

export const populateToolHistory = async (tool: ITool): Promise<ICheckoutDisplay[]> => {
	return Promise.all( tool.checkoutHistory.map( async ( entry ) => {
		const returnUser = entry.userReturningTool ? await getUserObject( entry.userReturningTool ) : undefined;

		return {
			userCheckingOutTool: await getUserObject( entry.userCheckingOutTool ),
			checkoutDate: entry.checkoutDate,
			userReturningTool: returnUser,
			returnDate: entry.returnDate
		}
	}));
};
