import { Tool } from "../../entity/tool";

export enum DeleteToolStatus {
	ERROR,
	DELETED
}

export const deleteTool = async (toolId: string): Promise<DeleteToolStatus> => {
	const {  ok } = await Tool.deleteOne({ _id: toolId });

	return ok === 1 ? DeleteToolStatus.DELETED : DeleteToolStatus.ERROR;
};
