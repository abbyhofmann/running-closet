import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { FakeSOSocket, CreateAccessoryRequest, FindOutfitItemsByUserIdRequest } from '../types';
import { fetchAllAccessoriesByUser, fetchUserById, saveAccessory } from '../models/application';

const accessoryController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided create accessory request contains the required fields.
   *
   * @param req The request object containing the new accessory's runner id, brand, and model.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isCreateAccessoryRequestValid(req: CreateAccessoryRequest): boolean {
    return !!req.body.runnerId && !!req.body.brand && !!req.body.model;
  }

  /**
   * Adds a new accessory to the database. The accessory request is validated and the accessory is then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The CreateAccessoryRequest object containing the Accessory data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user.
   *
   * @returns A Promise that resolves to void.
   */
  const createAccessory = async (req: CreateAccessoryRequest, res: Response): Promise<void> => {
    if (!isCreateAccessoryRequestValid(req)) {
      res.status(400).send('Invalid create accessory request');
      return;
    }

    const { runnerId, brand, model } = req.body;

    try {
      // get the user (runner) object
      const user = await fetchUserById(runnerId);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      const newAccessory = {
        runner: user,
        brand,
        model,
        outfits: [],
      };

      const accessoryFromDb = await saveAccessory(newAccessory);

      if ('error' in accessoryFromDb) {
        throw new Error(accessoryFromDb.error as string);
      }

      res.json(accessoryFromDb);
    } catch (err) {
      res.status(500).send(`Error when creating a new accessory: ${(err as Error).message}`);
    }
  };

  const getAccessories = async (
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
      const userAccessories = await fetchAllAccessoriesByUser(uid);
      if ('error' in userAccessories) {
        throw new Error(userAccessories.error as string);
      }
      res.json(userAccessories);
    } catch (err) {
      res.status(500).send(`Error when fetching all accessories: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/createAccessory', createAccessory);
  router.get('/getAccessories/:uid', getAccessories);

  return router;
};

export default accessoryController;
