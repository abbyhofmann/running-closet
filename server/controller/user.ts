import express, { Response } from 'express';
import { FakeSOSocket, RegisterUserRequest } from '../types';
import { saveUser } from '../models/application';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

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

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = {
      username,
      email,
      password: hash,
      deleted: false,
      following: [],
      followers: [],
    };

    try {
      const userFromDb = await saveUser(newUser); // todo - saveUser method in application.ts

      if ('error' in userFromDb) {
        throw new Error(userFromDb.error as string);
      }

      res.json(userFromDb);
    } catch (err) {
      res.status(500).send(`Error when registering user: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/registerUser', registerUser);

  return router;
};

export default userController;
