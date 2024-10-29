import express, { Request, Response } from 'express';
import { FakeSOSocket, RegisterUserRequest, LoginUserRequest } from '../types';
import {
  saveUser,
  isUsernameAvailable,
  hashPassword,
  fetchAllUsers,
  fetchUserByUsername,
  comparePasswords,
  generateJwt,
} from '../models/application';

const userController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided register user request contains the required fields.
   *
   * @param req The request object containing the new user's username, email, and password.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRegisterRequestValid(req: RegisterUserRequest): boolean {
    return !!req.body.username && !!req.body.email && !!req.body.password;
  }

  /**
   * Checks if the provided login user request contains the required fields.
   *
   * @param req The request object containing the user's username and password.
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isLoginRequestValid(req: LoginUserRequest): boolean {
    return (
      !!req.body.username &&
      !!req.body.password &&
      req.body.username?.trim() !== '' &&
      req.body.password?.trim() !== ''
    );
  }

  /**
   * Checks if the provided email is a valid email using regular expressions.
   *
   * @param email The email string to validate.
   *
   * @returns `true` if the email is valid, otherwise `false`.
   */
  function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Adds a new user to the database. The user request and user are validated and then saved, and a JWT is
   * created. If there is an error, the HTTP response's status is updated.
   *
   * @param req The RegisterUserRequest object containing the User data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user and the JWT.
   *
   * @returns A Promise that resolves to void.
   */
  const registerUser = async (req: RegisterUserRequest, res: Response): Promise<void> => {
    if (!isRegisterRequestValid(req)) {
      res.status(400).send('Invalid register request');
      return;
    }
    if (!isEmailValid(req.body.email)) {
      res.status(400).send('Invalid email');
      return;
    }
    if (!(await isUsernameAvailable(req.body.username))) {
      res.status(400).send('Username already in use');
      return;
    }

    const { username, email, password } = req.body;

    const hash = (await hashPassword(password)) as string;

    const newUser = {
      username,
      email,
      password: hash,
      deleted: false,
      following: [],
      followers: [],
    };

    try {
      const userFromDb = await saveUser(newUser);

      if ('error' in userFromDb) {
        throw new Error(userFromDb.error as string);
      }

      // generate JWT
      const token = await generateJwt(userFromDb._id);

      res.json({ userFromDb, token });
    } catch (err) {
      res.status(500).send(`Error when registering user: ${(err as Error).message}`);
    }
  };

  /**
   * Logs in a user. The user request and user are validated and then saved. A JWT is created for the logged in
   * user. If there is an error, the HTTP response's status is updated.
   *
   * @param req The LoginUserRequest object containing the User data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the user and the JWT.
   *
   * @returns A Promise that resolves to void.
   */
  const loginUser = async (req: LoginUserRequest, res: Response): Promise<void> => {
    if (!isLoginRequestValid(req)) {
      res.status(400).send('Invalid login request');
      return;
    }

    const { username, password } = req.body;

    try {
      const user = await fetchUserByUsername(username);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      // check if the password from the db matches the provided password
      const correctPassword = (await comparePasswords(password, user.password)) as boolean;
      if (!correctPassword) {
        res.status(400).send('Incorrect password');
        return;
      }

      // generate JWT
      const token = await generateJwt(user._id);

      res.json({ user, token });
    } catch (err) {
      res.status(500).send(`Error when logging in user: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves a list of all users from the database.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The request object that will be empty
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const ulist = await fetchAllUsers();

      if ('error' in ulist) {
        throw new Error(ulist.error as string);
      }

      res.json(ulist);
    } catch (err) {
      res.status(500).send(`Error when fetching all users: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/registerUser', registerUser);
  router.post('/loginUser', loginUser);
  router.get('/getAllUsers', getAllUsers);

  return router;
};

export default userController;
