import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  FakeSOSocket,
  CreateOutfitRequest,
  GetUserRequest,
  Outfit,
  FindOutfitItemsByUserIdRequest,
} from '../types';
import {
  fetchUserByUsername,
  fetchUserById,
  fetchWorkoutById,
  fetchTopById,
  fetchBottomById,
  fetchAccessoryById,
  fetchShoeById,
  saveOutfit,
  addOutfitToTop,
  addOutfitToBottom,
  addOutfitToOuterwear,
  addOutfitToAccessory,
  addOutfitToShoe,
  addOutfitToUser,
  fetchOuterwearById,
  fetchOutfitById,
  extractOutfitItems,
} from '../models/application';

const outfitController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided create outfit request contains the required fields.
   *
   * @param req The request object containing the new outfit's clothing items. There must
   * be at least one top, one bottom, and one shoe, while the outerwear and accessories are optional (i.e.
   * can be empty lists).
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isCreateOutfitRequestValid(req: CreateOutfitRequest): boolean {
    return (
      !!req.body.creatorId &&
      !!req.body.workoutId &&
      !!req.body.topIds &&
      req.body.topIds.length > 0 &&
      !!req.body.bottomIds &&
      req.body.bottomIds.length > 0 &&
      !!req.body.outerwearIds &&
      !!req.body.accessoriesIds &&
      !!req.body.shoesId
    );
  }

  /**
   * Adds a new outfit to the database. The outfit request is validated and the outfit is then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The CreateOutfitRequest object containing the Outfit data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user.
   *
   * @returns A Promise that resolves to void.
   */
  const createOutfit = async (req: CreateOutfitRequest, res: Response): Promise<void> => {
    if (!isCreateOutfitRequestValid(req)) {
      res.status(400).send('Invalid create outfit request');
      return;
    }

    const { creatorId, workoutId, topIds, bottomIds, outerwearIds, accessoriesIds, shoesId } =
      req.body;

    try {
      // function to fetch and validate the components of the outfit
      const fetchAndValidate = async <T extends object>(
        fetchFunction: (id: string) => Promise<T | { error: string }>,
        ids: string[],
      ): Promise<T[]> => {
        const responses = await Promise.all(ids.map(id => fetchFunction(id)));

        for (const response of responses) {
          if ('error' in response) {
            throw new Error(response.error as string);
          }
        }

        return responses as T[];
      };

      // fetch the components of the outfit, as provided in the initial request
      const [user, workout, tops, bottoms, outerwear, accessories, shoes] = await Promise.all([
        fetchUserById(creatorId).then(userRes => {
          if ('error' in userRes) throw new Error(userRes.error);
          return userRes;
        }),
        fetchWorkoutById(workoutId).then(workoutRes => {
          if ('error' in workoutRes) throw new Error(workoutRes.error);
          return workoutRes;
        }),
        fetchAndValidate(fetchTopById, topIds),
        fetchAndValidate(fetchBottomById, bottomIds),
        fetchAndValidate(fetchOuterwearById, outerwearIds),
        fetchAndValidate(fetchAccessoryById, accessoriesIds),
        fetchShoeById(shoesId).then(shoeRes => {
          if ('error' in shoeRes) throw new Error(shoeRes.error);
          return shoeRes;
        }),
      ]);

      // create and save the outfit
      const outfit = {
        wearer: user,
        workout,
        ratings: [],
        tops,
        bottoms,
        outerwear,
        accessories,
        shoes,
      };

      const outfitFromDb = await saveOutfit(outfit);
      if ('error' in outfitFromDb) {
        throw new Error(outfitFromDb.error as string);
      }

      // function to update items with the new outfit
      const updateWithOutfit = async <T extends object>(
        updateFn: (outfit: Outfit, item: T) => Promise<T | { error: string }>,
        items: T[],
      ) => {
        const responses = await Promise.all(items.map(item => updateFn(outfitFromDb, item)));
        for (const response of responses) {
          if ('error' in response) {
            throw new Error(`Error while updating: ${response.error}`);
          }
        }
        return responses;
      };

      // update all related items with the new outfit
      await Promise.all([
        updateWithOutfit(addOutfitToTop, tops),
        updateWithOutfit(addOutfitToBottom, bottoms),
        updateWithOutfit(addOutfitToOuterwear, outerwear),
        updateWithOutfit(addOutfitToAccessory, accessories),
        addOutfitToShoe(outfitFromDb, shoes).then(outfitToShoeRes => {
          if ('error' in outfitToShoeRes) throw new Error(outfitToShoeRes.error);
        }),
        addOutfitToUser(outfitFromDb, creatorId).then(outfitToUserRes => {
          if ('error' in outfitToUserRes) throw new Error(outfitToUserRes.error);
        }),
      ]);

      // fetch the most updated outfit
      if (!outfitFromDb._id) {
        throw new Error('Outfit ID is undefined');
      }

      const updatedOutfit = await fetchOutfitById(outfitFromDb._id.toString());
      if ('error' in updatedOutfit) {
        throw new Error(updatedOutfit.error);
      }

      res.json(updatedOutfit);
    } catch (err) {
      res.status(500).send(`Error when creating outfit: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves a list of all outfits from the database.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The request object that will be empty
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getAllOutfits = async (req: Request, res: Response): Promise<void> => {
    // try {
    //   const olist = await fetchAllOutfits();
    //   if ('error' in olist) {
    //     throw new Error(olist.error as string);
    //   }
    //   res.json(olist);
    // } catch (err) {
    //   res.status(500).send(`Error when fetching all outfits: ${(err as Error).message}`);
    // }
  };

  /**
   * Retrieves the user with the given username from the database.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The request object with the username of the user to retrieve.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getUserByUsername = async (req: GetUserRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      const user = await fetchUserByUsername(username);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      res.json(user);
    } catch (err) {
      res.status(500).send(`Error when fetching user: ${(err as Error).message}`);
    }
  };

  const getAllOutfitItems = async (
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
      const allOutfitItems = await extractOutfitItems(user.outfits);
      if ('error' in allOutfitItems) {
        throw new Error(allOutfitItems.error as string);
      }
      res.json(allOutfitItems);
    } catch (err) {
      res.status(500).send(`Error when fetching all outfit items: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/createOutfit', createOutfit);
  router.get('/getAllOutfitItems/:uid', getAllOutfitItems);

  return router;
};

export default outfitController;
