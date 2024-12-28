import express, { Request, Response } from 'express';
import {
  FakeSOSocket,
  CreateOutfitRequest,
  GetUserRequest,
  Top,
  TopResponse,
  BottomResponse,
  Bottom,
  Outerwear,
  OuterwearResponse,
  AccessoryResponse,
  Accessory,
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
      !!req.body.shoeId
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

    const { creatorId, workoutId, topIds, bottomIds, outerwearIds, accessoriesIds, shoeId } =
      req.body;

    try {
      // get the user, workout, tops, bottoms, outerwear, accessories, shoes and create
      // outfit object

      // get the user (runner) object
      const user = await fetchUserById(creatorId);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      // get the workout object
      const workout = await fetchWorkoutById(workoutId);

      if ('error' in workout) {
        throw new Error(workout.error as string);
      }

      // get the top objects
      const topPromises: Promise<TopResponse>[] = topIds.map(async t => fetchTopById(t));

      const topResponses: TopResponse[] = await Promise.all(topPromises);

      // check each response for errors
      for (const response of topResponses) {
        if ('error' in response) {
          throw new Error(`Error occurred while fetching top: ${response.error}`);
        }
      }

      const tops: Top[] = topResponses as Top[];

      // get the bottom objects
      const bottomPromises: Promise<BottomResponse>[] = bottomIds.map(async b =>
        fetchBottomById(b),
      );

      const bottomResponses: BottomResponse[] = await Promise.all(bottomPromises);

      // check each response for errors
      for (const response of bottomResponses) {
        if ('error' in response) {
          throw new Error(`Error occurred while fetching bottom: ${response.error}`);
        }
      }

      const bottoms: Bottom[] = bottomResponses as Bottom[];

      // get the outerwear objects
      const outerwearPromises: Promise<OuterwearResponse>[] = outerwearIds.map(async o =>
        fetchOuterwearById(o),
      );

      const outerwearResponses: OuterwearResponse[] = await Promise.all(outerwearPromises);

      // check each response for errors
      for (const response of outerwearResponses) {
        if ('error' in response) {
          throw new Error(`Error occurred while fetching outerwear item: ${response.error}`);
        }
      }

      const outerwears: Outerwear[] = outerwearResponses as Outerwear[];

      // get the accessory objects
      const accessoryPromises: Promise<AccessoryResponse>[] = accessoriesIds.map(async a =>
        fetchAccessoryById(a),
      );

      const accessoryResponses: AccessoryResponse[] = await Promise.all(accessoryPromises);

      // check each response for errors
      for (const response of accessoryResponses) {
        if ('error' in response) {
          throw new Error(`Error occurred while fetching accessory: ${response.error}`);
        }
      }

      const accessories: Accessory[] = accessoryResponses as Accessory[];

      // get the shoe object
      const shoe = await fetchShoeById(shoeId);

      if ('error' in shoe) {
        throw new Error(shoe.error as string);
      }

      // create the outfit
      const outfit = {
        wearer: user,
        workout,
        ratings: [],
        tops,
        bottoms,
        outerwear: outerwears,
        accessories,
        shoes: shoe,
      };

      const outfitFromDb = await saveOutfit(outfit);

      if ('error' in outfitFromDb) {
        throw new Error(outfitFromDb.error as string);
      }

      // then add this outfit to each item (top, bottom, etc)'s list of outfits
      // add to tops
      const newTopPromises: Promise<TopResponse>[] = tops.map(async t =>
        addOutfitToTop(outfitFromDb, t),
      );

      const newTopResponses: TopResponse[] = await Promise.all(newTopPromises);

      // check each response for errors
      for (const response of newTopResponses) {
        if ('error' in response) {
          throw new Error(`Error occurred while updating top: ${response.error}`);
        }
      }

      const updatedTops: Top[] = newTopResponses as Top[];

      // add to bottoms
      const newBottomPromises: Promise<BottomResponse>[] = bottoms.map(async b =>
        addOutfitToBottom(outfitFromDb, b),
      );

      const newBottomResponses: BottomResponse[] = await Promise.all(newBottomPromises);

      // check each response for errors
      for (const response of newBottomResponses) {
        if ('error' in response) {
          throw new Error(`Error occurred while updating bottom: ${response.error}`);
        }
      }

      const updatedBottoms: Bottom[] = newBottomResponses as Bottom[];

      // add to outerwears
      const newOuterwearPromises: Promise<OuterwearResponse>[] = outerwears.map(async o =>
        addOutfitToOuterwear(outfitFromDb, o),
      );

      const newOuterwearResponses: OuterwearResponse[] = await Promise.all(newOuterwearPromises);

      // check each response for errors
      for (const response of newOuterwearResponses) {
        if ('error' in response) {
          throw new Error(`Error occurred while updating outerwear: ${response.error}`);
        }
      }

      const updatedOuterwears: Outerwear[] = newOuterwearResponses as Outerwear[];

      // add to accessories
      const newAccessoryPromises: Promise<AccessoryResponse>[] = accessories.map(async a =>
        addOutfitToAccessory(outfitFromDb, a),
      );

      const newAccessoryResponses: AccessoryResponse[] = await Promise.all(newAccessoryPromises);

      // check each response for errors
      for (const response of newAccessoryResponses) {
        if ('error' in response) {
          throw new Error(`Error occurred while updating accessory: ${response.error}`);
        }
      }

      const updatedAccessories: Accessory[] = newAccessoryResponses as Accessory[];

      // add to shoe
      const updatedShoe = await addOutfitToShoe(outfitFromDb, shoe);

      if ('error' in updatedShoe) {
        throw new Error(`Error occurred while updating shoe: ${updatedShoe.error}`);
      }

      // add outfit to user's list of outfits and list of workouts
      const updatedUser = await addOutfitToUser(outfitFromDb, creatorId);

      if ('error' in updatedUser) {
        throw new Error(`Error occurred while updating user's outfits: ${updatedUser.error}`);
      }

      // fetch the most updated outfit
      if (!outfitFromDb._id) {
        throw new Error('Outfit ID is undefined');
      }

      const updatedOutfit = await fetchOutfitById(outfitFromDb._id.toString());

      if ('error' in updatedOutfit) {
        throw new Error(`Error occurred while fetching outfit: ${updatedOutfit.error}`);
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

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/createOutfit', createOutfit);

  return router;
};

export default outfitController;
