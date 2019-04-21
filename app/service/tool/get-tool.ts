import { IToolDisplay, Tool } from "../../entity/tool";
import { populateTool, sortToolCheckoutHistory } from "./tool-helper";

export const getTools = async (): Promise<IToolDisplay[]> => {
	const tools = await Tool.find().sort('name').exec();

	tools.forEach( tool => {
		sortToolCheckoutHistory( tool );
	});

	return await Promise.all( tools.map(populateTool));
};
