import { logger } from '../services';
import { messageFeedClient } from '../services/messagefeed/messagefeed';

import type { Request, Response } from 'express';

const pingController = (_req: Request, res: Response): void => {
    logger.info(`Health check successful`);
    res.status(200).json(messageFeedClient.messages);
};

export default pingController;
