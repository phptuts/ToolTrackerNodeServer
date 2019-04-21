import mongoose, { Model, Schema, Document } from "mongoose";
import uniqueValidator  from 'mongoose-unique-validator';
import { User } from "../model/User";

interface ITool extends Document {
	createdBy: string;
	rfid: string;
	name: string;
	description: string;
	createdAt?: Date;
	updatedAt?: Date;
	checkoutHistory: Array<ICheckout>;
}



interface ICheckout  {
	userCheckingOutTool: string;
	checkoutDate: Date;
	userReturningTool?: string;
	returnDate?: Date;
}

interface ICheckoutDisplay  {
	userCheckingOutTool: User;
	checkoutDate: Date;
	userReturningTool?: User;
	returnDate?: Date;

}

interface IToolDisplay  {
	_id: string;
	createdBy: User;
	rfid: string;
	name: string;
	description: string;
	createdAt?: Date;
	updatedAt?: Date;
	checkoutHistory: Array<ICheckoutDisplay>;
}

const CheckoutSchema = new Schema({
	userCheckingOutTool: { type: String, required: true },
	checkoutDate: { type: Date, required: true },
	userReturningTool: { type: String, required: false },
	returnDate: { type: Date, required: false },
}, {
	timestamps: true,
	validateBeforeSave: true,
	strict: true
});

const ToolSchema = new Schema( {
		createdBy: { type: String, required: true },
		rfid: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		description: { type: String, required: false },
		checkoutHistory: [CheckoutSchema]
	},
	{
		timestamps: true,
		validateBeforeSave: true,
		strict: true
	} );

ToolSchema.plugin(uniqueValidator);

const Tool: Model<ITool> = mongoose.model<ITool>( "Tool", ToolSchema );

export {
	Tool,
	ITool,
	IToolDisplay,
	ICheckout,
	ICheckoutDisplay
}
