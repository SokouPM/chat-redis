import express from 'express';
import {Server} from "socket.io";
import http from "http";
import {createClient} from "redis";
import pino from "pino";

const app = express();
const PORT = process.env.PORT || 3001;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

app.use(express.json());
app.use(express.static('public'));

const logger = pino({
	transport: {
		target: 'pino-pretty'
	},
})
const server = http.createServer(app);
const io = new Server(server);
const client = await createClient({
	url: `redis://localhost:${REDIS_PORT}`
})
.on('error', err => logger.error('Redis Client Error', err))
.on('ready', () => logger.info('Redis Client Ready'))
.connect();

// * ///////////////////////////////////// Routes /////////////////////////////////// * //
app.get('/api/messages', async (req, res) => {
	try {
		const messages = await client.hGetAll('messages');
		const parsedMessages = Object.keys(messages)
		.map(key => ({id: key, ...JSON.parse(messages[key])}))
		.sort((a, b) => parseInt(a.id) - parseInt(b.id));

		res.json(parsedMessages);
	} catch (error) {
		logger.error('Error while getting messages:', error);
		return res.status(500).json({error: 'An error occured while getting the messages.'});
	}
});

app.post('/api/messages', async (req, res) => {
	try {
		const {user, message} = req.body;

		if (!message) {
			return res.status(400).json({error: 'A message is required.'});
		}

		const messageId = new Date().getTime().toString();
		await client.hSet('messages', messageId, JSON.stringify({user, message}));

		io.emit('chat message', {user, message});
		return res.status(201).json({message: 'Message posted successfully.'});
	} catch (error) {
		logger.error('Error while posting message:', error);
		return res.status(500).json({error: 'An error occured while posting the message.'});
	}

});
// * /////////////////////////////////// End Routes ///////////////////////////////// * //

server.listen(PORT, () => {
	logger.info("App listening on :" + PORT + " with Redis on port " + REDIS_PORT + "\n");
});
