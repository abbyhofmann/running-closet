import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { FakeSOSocket, CreateShoeRequest, FindOutfitItemsByUserIdRequest } from '../types';
import { fetchAllShoesByUser, fetchUserById, saveShoe } from '../models/application';

const shoeController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided create shoe request contains the required fields.
   *
   * @param req The request object containing the new shoe's runner id, brand, and model.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isCreateShoeRequestValid(req: CreateShoeRequest): boolean {
    return !!req.body.runnerId && !!req.body.brand && !!req.body.model;
  }

  /**
   * Adds a new shoe to the database. The shoe request is validated and the shoe is then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The CreateShoeRequest object containing the Shoe data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user.
   *
   * @returns A Promise that resolves to void.
   */
  const createShoe = async (req: CreateShoeRequest, res: Response): Promise<void> => {
    if (!isCreateShoeRequestValid(req)) {
      res.status(400).send('Invalid create shoe request');
      return;
    }

    const { runnerId, brand, model } = req.body;

    try {
      // get the user (runner) object
      const user = await fetchUserById(runnerId);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      const newShoe = {
        runner: user,
        brand,
        model,
        outfits: [],
      };

      const shoeFromDb = await saveShoe(newShoe);

      if ('error' in shoeFromDb) {
        throw new Error(shoeFromDb.error as string);
      }

      res.json(shoeFromDb);
    } catch (err) {
      res.status(500).send(`Error when creating a new shoe: ${(err as Error).message}`);
    }
  };

  const getShoes = async (req: FindOutfitItemsByUserIdRequest, res: Response): Promise<void> => {
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
      const userShoes = await fetchAllShoesByUser(uid);
      if ('error' in userShoes) {
        throw new Error(userShoes.error as string);
      }
      res.json(userShoes);
    } catch (err) {
      res.status(500).send(`Error when fetching all shoes: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/createShoe', createShoe);
  router.get('/getShoes/:uid', getShoes);

  return router;
};

export default shoeController;
