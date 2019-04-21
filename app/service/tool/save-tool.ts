import { ITool, Tool } from "../../entity/tool";

export const saveTool = async ( tool: ITool ) => {
	const toolEntity = new Tool( tool );
	toolEntity.checkoutHistory = [];
	return await toolEntity.save();
};
