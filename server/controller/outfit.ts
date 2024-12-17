import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { FakeSOSocket, RegisterUserRequest, CreateOutfitRequest, GetUserRequest } from '../types';
import { saveUser, fetchUserByUsername } from '../models/application';

const outfitController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided register user request contains the required fields.
   *
   * @param req The request object containing the new user's username, email, and password.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRegisterRequestValid(req: RegisterUserRequest): boolean {
    return (
      !!req.body.username &&
      !!req.body.firstName &&
      !!req.body.lastName &&
      !!req.body.email &&
      !!req.body.password &&
      !!req.body.profileGraphic &&
      !!req.body.gender &&
      !!req.body.age
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
    // if (!isCreateOutfitRequestValid(req)) {
    //   res.status(400).send('Invalid create outfit request');
    //   return;
    // }

    const {
      creatorId,
      workoutId,
      ratingId,
      topIds,
      bottomIds,
      outerwearIds,
      accessoriesIds,
      shoeId,
    } = req.body;

    // get the user, workout, rating, tops, bottoms, outerwear, accessories, shoes and create
    // outfit object

    // then add this outfit to each item (top, bottom, etc)'s list of outfits

    // try {
    //   const userFromDb = await saveUser(newUser);

    //   if ('error' in userFromDb) {
    //     throw new Error(userFromDb.error as string);
    //   }

    //   res.json(userFromDb);
    // } catch (err) {
    //   res.status(500).send(`Error when registering user: ${(err as Error).message}`);
    // }
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
