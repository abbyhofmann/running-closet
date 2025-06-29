import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { FakeSOSocket, CreateOuterwearRequest, FindOutfitItemsByUserIdRequest } from '../types';
import { fetchAllOuterwearItemsByUser, fetchUserById, saveOuterwear } from '../models/application';

const outerwearController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided create outerwear request contains the required fields.
   *
   * @param req The request object containing the new outerwear item's runner id, brand, and model.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isCreateOuterwearRequestValid(req: CreateOuterwearRequest): boolean {
    return !!req.body.runnerId && !!req.body.brand && !!req.body.model;
  }

  /**
   * Adds a new outerwear to the database. The outerwear request is validated and the outerwear is then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The CreateOuterwearRequest object containing the Outerwear data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user.
   *
   * @returns A Promise that resolves to void.
   */
  const createOuterwear = async (req: CreateOuterwearRequest, res: Response): Promise<void> => {
    if (!isCreateOuterwearRequestValid(req)) {
      res.status(400).send('Invalid create outerwear request');
      return;
    }

    const { runnerId, brand, model } = req.body;

    try {
      // get the user (runner) object
      const user = await fetchUserById(runnerId);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      const newOuterwear = {
        runner: user,
        brand,
        model,
        outfits: [],
      };

      const outerwearFromDb = await saveOuterwear(newOuterwear);

      if ('error' in outerwearFromDb) {
        throw new Error(outerwearFromDb.error as string);
      }

      res.json(outerwearFromDb);
    } catch (err) {
      res.status(500).send(`Error when creating a new outerwear: ${(err as Error).message}`);
    }
  };

  const getOuterwearItems = async (
    req: FindOutfitItemsByUserIdRequest,
    res: Response,
  ): Promise<void> => {
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
      const userOuterwearItems = await fetchAllOuterwearItemsByUser(uid);
      if ('error' in userOuterwearItems) {
        throw new Error(userOuterwearItems.error as string);
      }
      res.json(userOuterwearItems);
    } catch (err) {
      res.status(500).send(`Error when fetching all outerwear items: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/createOuterwear', createOuterwear);
  router.get('/getOuterwearItems/:uid', getOuterwearItems);

  return router;
};

export default outerwearController;
