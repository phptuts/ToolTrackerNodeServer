import { IToolDisplay, Tool } from "../../entity/tool";
import { populateTool, sortToolCheckoutHistory } from "./tool-helper";

/**
 * Gets all the tools and sorts them by name
 */
export const getTools = async (): Promise<IToolDisplay[]> => {
	const tools = await Tool.find()
								.limit(300)
								.sort('name')
								.exec();

	tools.forEach( tool => {
		sortToolCheckoutHistory( tool );
	});

	return await Promise.all( tools.map(populateTool));
};

/**
 * Gets a single tool
 */
export const getTool = async (id: string): Promise<IToolDisplay|undefined>  => {
	const tool = await Tool.findById(id).exec();

	if (!tool) {
		return undefined;
	}

	sortToolCheckoutHistory(tool);

	return populateTool(tool);
};
