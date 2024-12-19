import express, { Response } from 'express';
import { FakeSOSocket, CreateBottomRequest } from '../types';
import { fetchUserById, saveBottom } from '../models/application';

const bottomController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided create bottom request contains the required fields.
   *
   * @param req The request object containing the new bottom's runner id, brand, model, and photo URL.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isCreateBottomRequestValid(req: CreateBottomRequest): boolean {
    return !!req.body.runnerId && !!req.body.brand && !!req.body.model && !!req.body.s3PhotoUrl;
  }

  /**
   * Adds a new bottom to the database. The bottom request is validated and the bottom is then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The CreateBottomRequest object containing the Bottom data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user.
   *
   * @returns A Promise that resolves to void.
   */
  const createBottom = async (req: CreateBottomRequest, res: Response): Promise<void> => {
    if (!isCreateBottomRequestValid(req)) {
      res.status(400).send('Invalid create bottom request');
      return;
    }

    const { runnerId, brand, model, s3PhotoUrl } = req.body;

    try {
      // get the user (runner) object
      const user = await fetchUserById(runnerId);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      const newBottom = {
        runner: user,
        brand,
        model,
        s3PhotoUrl,
        outfits: [],
      };

      const bottomFromDb = await saveBottom(newBottom);

      if ('error' in bottomFromDb) {
        throw new Error(bottomFromDb.error as string);
      }

      res.json(bottomFromDb);
    } catch (err) {
      res.status(500).send(`Error when creating a new bottom: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/createBottom', createBottom);

  return router;
};

export default bottomController;
