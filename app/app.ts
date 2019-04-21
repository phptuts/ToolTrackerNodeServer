import express, { Request, Response } from 'express'
import { ITool, Tool } from "./entity/tool";
import { bootstrap } from "./bootstrap";
import { getUserIdFromJWTToken } from "./service/fetch-user";
import cors from 'cors';
import { saveTool } from "./service/tool/save-tool";
import { updateTool } from "./service/tool/update-tool";
import { getTools } from "./service/tool/get-tool";
import { CheckoutRequestStatus, checkoutTool } from "./service/tool/checkout";
import { returnTool, ReturnToolStatus } from "./service/tool/return-tool";
import { JWT_ENUM, verifyAuthToken } from "./service/verify-request";
import bodyParser = require("body-parser");
// Create a new express application instance
const app: express.Application = express();

const router = express.Router();
bootstrap();

// TO BE ABLE TO RESPOND TO OPTIONS REQUEST
app.use(cors());

router.use((req, res, next) => {

	const status = verifyAuthToken(getJWTTokenFromRequest(req));

	if (status == JWT_ENUM.VALID_JWT_TOKEN) {
		next();
		return;
	}

	if (status == JWT_ENUM.NO_JWT_TOKEN) {
		res.status(401);
		res.send({'error': 'AUTH TOKEN REQUIRED'});
		return;
	}

	res.status(403);
	res.send({'error': 'AUTH TOKEN INVALID'});
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/',  (req, res) => {
	res.send('Hello World!');
});


const getJWTTokenFromRequest = (req: Request) => {
	const authHeader = req.headers.authorization.split(' ');

	return authHeader.length == 2 ? authHeader[1] : undefined;
};


/**
 * Route for adding a tool
 */
router.post('/tool', async (req, res) => {
	try {

		const toolJson: ITool = req.body;
		toolJson.createdBy = getUserIdFromJWTToken(getJWTTokenFromRequest(req));

		const tool = await saveTool(new Tool(toolJson));
		res.status(201).send(tool.toJSON());
		return;
	} catch (error) {
		handleError(error, res);
	}
});

/**
 * Route for the updating a tool
 */
router.put('/tool', async (req, res) => {
	try {
		res.status(200).json(await updateTool(req.body));
		return;
	} catch (error) {
		handleError(error, res);
	}
});

router.get('/tool', async (req, res) => {

	try {
		const tools = await getTools();
		res.setHeader('Content-Type', 'application/json');
		res.status(200)
			.send(JSON.stringify(tools));

	} catch (e) {
		res.status(500).send();
	}

});

router.patch('/tool-checkout/:id', async (req, res) => {

	const id = req.params['id'];

	if (!id) {
		res.status(404).send({'error': 'Tool not found.'});
		return;
	}

	try {
		const checkoutStatus =
			await checkoutTool(id, getUserIdFromJWTToken(getJWTTokenFromRequest(req)));

		if (checkoutStatus === CheckoutRequestStatus.CHECKED_OUT) {
			res.status(204)
				.send( );
			return;
		}

		if (checkoutStatus === CheckoutRequestStatus.CURRENTLY_INUSE) {
			res.status(400)
				.send({'error':'Tool is currently being used.'});
			return;
		}

		res.status(404).send({'error': 'Tool not found.'});
		return;

	} catch (e) {
		console.log(e);
		res.status(500).send();
		return;
	}
});

router.patch('/tool-return/:id', async (req, res) => {
	const id = req.params['id'];

	if (!id) {
		res.status(404).send({'error': 'Tool not found.'});
		return;
	}

	try {
		const returnToolStatus =
			await returnTool(id, getUserIdFromJWTToken(getJWTTokenFromRequest(req)));

		if (returnToolStatus === ReturnToolStatus.RETURNED) {
			res.status(204)
				.send( );
			return;
		}

		if (returnToolStatus === ReturnToolStatus.TOOL_ALREADY_RETURNED) {
			res.status(400)
				.send({'error':'Tool has already been returned.'});
			return;
		}

		res.status(404).send({'error': 'Tool not found.'});
		return;

	} catch (e) {
		console.log(e);
		res.status(500).send();
		return;
	}
});


app.use('/', router);

/**
 * Handles Form Error and 500 Errors
 */
const handleError = (error, res: Response) => {
	if (error.name == 'ValidationError') {
		res.status(400)
			.json(error);
		return;
	}

	res.status(500).send({'error': 'Internal Service Error.'});
	return;
};

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

