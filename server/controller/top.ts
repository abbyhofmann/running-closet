import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { FakeSOSocket, CreateTopRequest, FindOutfitItemsByUserIdRequest } from '../types';
import { fetchAllTopsByUser, fetchUserById, saveTop } from '../models/application';

const topController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided create top request contains the required fields.
   *
   * @param req The request object containing the new top's runner id, brand, model, and photo URL.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isCreateTopRequestValid(req: CreateTopRequest): boolean {
    return !!req.body.runnerId && !!req.body.brand && !!req.body.model && !!req.body.s3PhotoUrl;
  }

  /**
   * Adds a new top to the database. The top request is validated and the top is then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The CreateTopRequest object containing the Top data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user.
   *
   * @returns A Promise that resolves to void.
   */
  const createTop = async (req: CreateTopRequest, res: Response): Promise<void> => {
    if (!isCreateTopRequestValid(req)) {
      res.status(400).send('Invalid create top request');
      return;
    }

    const { runnerId, brand, model, s3PhotoUrl } = req.body;

    try {
      // get the user (runner) object
      const user = await fetchUserById(runnerId);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      const newTop = {
        runner: user,
        brand,
        model,
        s3PhotoUrl,
        outfits: [],
      };

      const topFromDb = await saveTop(newTop);

      if ('error' in topFromDb) {
        throw new Error(topFromDb.error as string);
      }

      res.json(topFromDb);
    } catch (err) {
      res.status(500).send(`Error when creating a new top: ${(err as Error).message}`);
    }
  };

  const getTops = async (req: FindOutfitItemsByUserIdRequest, res: Response): Promise<void> => {
    const { uid } = req.params;

    if (!ObjectId.isValid(uid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const user = await fetchUserById(uid);

      if ('error' in user) {
        throw new Error(user.error as string);
      }
      const userTops = await fetchAllTopsByUser(uid);
      if ('error' in userTops) {
        throw new Error(userTops.error as string);
      }
      res.json(userTops);
    } catch (err) {
      res.status(500).send(`Error when fetching all tops: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/createTop', createTop);
  router.get('/getTops/:uid', getTops);
  return router;
};

export default topController;
