import express, { Response } from 'express';
import { FakeSOSocket, RegisterUserRequest } from '../types';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const userController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided register user request contains the required fields.
   *
   * @param req The request object containing the answer user.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: RegisterUserRequest): boolean {
    return !!req.body.username && !!req.body.email && !!req.body.password;
  }

  /**
   * Checks if the provided email is a valid email using regular expressions.
   *
   * @param ans The email string to validate.
   *
   * @returns `true` if the email is valid, otherwise `false`.
   */
  function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Adds a new user to the database. The user request and user are
   * validated and then saved. If there is an error, the HTTP response's status is updated.
   *
   * @param req The RegisterUserRequest object containing the User data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const registerUser = async (req: RegisterUserRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid register request');
      return;
    }
    if (!isEmailValid(req.body.email)) {
      res.status(400).send('Invalid email');
      return;
    }

    const { username, email, password } = req.body;

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new userModel({
      username,
      email,
      password: hash,
      deleted: false, 
      following: [], 
      followers: [],
    });
    
    try {
      const user = await newUser.save(); // todo - model off of saveAnswer and saveQuestion functions 
      res.send({
        success: true,
        message: `${username} successfully added.`,
      });      
    } catch (err) {
      res.send({
        success: false,
        message: `Server error: ${err}`,
      });
    }

    // try {
    //   const ansFromDb = await saveAnswer(ansInfo);

    //   if ('error' in ansFromDb) {
    //     throw new Error(ansFromDb.error as string);
    //   }

      
    //   if (populatedAns && 'error' in populatedAns) {
    //     throw new Error(populatedAns.error as string);
    //   }

    //   res.json(ansFromDb);
    // } catch (err) {
    //   res.status(500).send(`Error when adding answer: ${(err as Error).message}`);
    // }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/registerUser', registerUser);

  return router;
};

export default userController;
