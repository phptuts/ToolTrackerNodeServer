const fetch = require('cross-fetch');
(global as any).fetch = (global as any).fetch || fetch;
const config = require('./../../config.json');
import { CognitoUserPool, AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';


const poolData = {
	UserPoolId: config.userPoolId,
	ClientId: config.userPoolWebClientId
};

const userPool = new CognitoUserPool(poolData);


const printToken =  (email: string, password: string) => {

	try {


		const authenticationData = {
			Username: email,
			Password: password
		};
		const authenticationDetails = new AuthenticationDetails(authenticationData);


		const userData = {
			Username: email,
			Pool: userPool
		};

		const cognitoUser = new CognitoUser(userData);



		return  cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess(session: CognitoUserSession, userConfirmationNecessary?: boolean) {
				console.log();
				console.log(session.getAccessToken().getJwtToken());
				console.log();

			},
			onFailure(err: any) {
				console.error(err);
			}
		} )


	} catch (e) {
		console.log(e);
	}

};


printToken('glaserpower+1@gmail.com', 'moomoo');

