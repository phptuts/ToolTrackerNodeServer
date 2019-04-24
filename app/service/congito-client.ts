import AWS from "aws-sdk";
const config = require('./../../config.json');

export const cognitoClient = new AWS.CognitoIdentityServiceProvider({
	region: config.region
});
