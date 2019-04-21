import { ITool, Tool } from "../../entity/tool";
import { sortToolCheckoutHistory } from "./tool-helper";

export enum ReturnToolStatus {
	RETURNED,
	TOOL_NOT_FOUND,
	TOOL_ALREADY_RETURNED
}

export const returnTool = async ( toolId: string, userId: string ): Promise<ReturnToolStatus> => {

	let tool: ITool;

	tool = await Tool.findById( toolId ).exec();

	if (!tool) {
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
