import express from 'express';
import routes from './routes';
import cors from 'cors';

import { logger } from './services';

import type { Server } from 'http';
import {messageFeedClient} from './services/messagefeed/messagefeed'

const { Api_Port, Api_Host } = process.env;

function startServer(): Server {
    const PORT = Api_Port ? parseInt(Api_Port) : 3010;
    const HOST = Api_Host || 'localhost';
    // it will initiate the socket to listen for incoming messages
    messageFeedClient.init();

    const server = app.listen({ port: PORT }, () => {
        logger.info(`Express Server is now running on http://${HOST}:${PORT}`);
    });
    return server;
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

export { startServer };
