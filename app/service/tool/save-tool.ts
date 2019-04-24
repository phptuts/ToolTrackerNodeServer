import { ITool, Tool } from "../../entity/tool";

export const saveTool = async ( tool: ITool ) => {
	return await tool.save({ validateBeforeSave: true });
};

export const updateTool = async ( requestBody: ITool ) => {
	const tool = await Tool.findById( requestBody._id ).exec();
	tool.description = requestBody.description;
	tool.name = requestBody.name;
	tool.rfid = requestBody.rfid;
	return await tool.save( { validateBeforeSave: true } );
};
