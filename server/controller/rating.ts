import express, { Response } from 'express';
import { FakeSOSocket, CreateRatingRequest } from '../types';
import { saveRating } from '../models/application';

const ratingController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided create rating request contains the required fields.
   *
   * @param req The request object containing the new rating's outfit id, number of stars, and temperature guage.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isCreateRatingRequestValid(req: CreateRatingRequest): boolean {
    return !!req.body.stars && !!req.body.temperatureGauge;
  }

  /**
   * Adds a new rating to the database. The rating request is validated and the rating is then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The CreateRatingRequest object containing the Rating data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user.
   *
   * @returns A Promise that resolves to void.
   */
  const createRating = async (req: CreateRatingRequest, res: Response): Promise<void> => {
    if (!isCreateRatingRequestValid(req)) {
      res.status(400).send('Invalid create rating request');
      return;
    }

    const { stars, temperatureGauge } = req.body;

    try {
      const newRating = {
        stars,
        temperatureGauge,
      };

      const ratingFromDb = await saveRating(newRating);

      if ('error' in ratingFromDb) {
        throw new Error(ratingFromDb.error as string);
      }

      res.json(ratingFromDb);
    } catch (err) {
      res.status(500).send(`Error when creating a new rating: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/createRating', createRating);

  return router;
};

export default ratingController;
