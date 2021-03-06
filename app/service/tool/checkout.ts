import { ITool, Tool } from "../../entity/tool";
import { sortToolCheckoutHistory } from "./tool-helper";


export enum CheckoutRequestStatus {
	CHECKED_OUT,
	CURRENTLY_INUSE,
	TOOL_NOT_FOUND
}

/**
 * Checks out a tool
 */
export const checkoutTool = async ( toolId: string, userId: string ): Promise<CheckoutRequestStatus> => {
	let tool: ITool;

	tool = await Tool.findById( toolId ).exec();

	if (!tool) {
		return CheckoutRequestStatus.TOOL_NOT_FOUND;
	}

	sortToolCheckoutHistory( tool );

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

	return CheckoutRequestStatus.CHECKED_OUT;
};
