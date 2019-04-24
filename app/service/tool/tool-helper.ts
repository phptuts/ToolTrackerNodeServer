import { ICheckoutDisplay, ITool, IToolDisplay } from "../../entity/tool";
import { getUserObject } from "../fetch-user";

/**
 * Sorts the tools checkout date in descending order
 */
export const sortToolCheckoutHistory = ( tool: ITool ) => {
	tool.checkoutHistory = tool.checkoutHistory.sort( ( a, b ) =>
		b.checkoutDate.getTime() - a.checkoutDate.getTime() );
};

/**
 * Populates the a user with user information
 */
export const populateTool = async ( tool: ITool ): Promise<IToolDisplay> => {

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

/**
 * Populates the tool's user history with user information
 */
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
