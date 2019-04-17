import mongoose from "mongoose";
const config = require('./../../config.json');

const uri = `mongodb://${config.database_url}/local`;


export const bootstrap = () => {
	mongoose.connect( uri, ( err: any ) => {
		if (err) {
			console.log( err.message );
		} else {
			console.log( "Successfully Connected!" );
		}
	});
};

