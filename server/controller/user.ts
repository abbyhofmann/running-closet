import express, { Request, Response } from 'express';
import {
  FakeSOSocket,
  RegisterUserRequest,
  LoginUserRequest,
  DeleteUserRequest,
  GetUserRequest,
} from '../types';
import {
  saveUser,
  isUsernameAvailable,
  hashPassword,
  fetchAllUsers,
  fetchUserByUsername,
  comparePasswords,
  updateDeletedStatus,
  getCurrentUser,
  setCurrentUser,
  logoutCurrentUser,
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
   * Adds a new user to the database. The user request and user are validated and then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The RegisterUserRequest object containing the User data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user.
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

      res.json(userFromDb);
    } catch (err) {
      res.status(500).send(`Error when registering user: ${(err as Error).message}`);
    }
  };

  /**
   * Logs in a user. The user request and user are validated and then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The LoginUserRequest object containing the User data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the user.
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
        const userErrorString: string = user.error as string;
        if (userErrorString.includes('Failed to fetch user with username')) {
          res.status(401).send(userErrorString);
          return;
        }
        throw new Error(user.error as string);
      }

      // check if the password from the db matches the provided password
      const correctPassword = (await comparePasswords(password, user.password)) as boolean;
      if (!correctPassword) {
        res.status(401).send('Incorrect password');
        return;
      }

      res.json(user);
      setCurrentUser(user);
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

  /**
   * Deletes the requested user from the db; here, deleting involves updating the user's deleted field to
   * be true.
   * @param req The DeleteUserRequest object containing the uid of the user to delete.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const deleteUser = async (req: DeleteUserRequest, res: Response): Promise<void> => {
    if (!req.body.uid) {
      res.status(400).send('Invalid request');
      return;
    }

    const { uid } = req.body;

    try {
      const result = await updateDeletedStatus(uid);

      if (result && 'error' in result) {
        throw new Error(result.error as string);
      }

      res.json(result);
    } catch (err) {
      res.status(500).send(`Error when deleting user ${uid}: ${(err as Error).message}`);
    }
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

  /**
   * Retrieves the current logged in user.
   *
   * @param req The request object needed for the route handlers.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const currentUser = async (req: Request, res: Response): Promise<void> => {
    const user = await getCurrentUser();

    if (!user) {
      res.status(500).send('No current user logged in');
      return;
    }

    res.json(user);
  };

  /**
   * Logs out the current user (i.e. sets the current user to null).
   *
   * @param req The request object needed for the route handlers.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
      await logoutCurrentUser();

      const loggedInUser = await getCurrentUser();

      if (loggedInUser) {
        throw new Error('Current user was not logged out');
      }

      // this response message will be used in the client to check that the user was logged out
      res.json('User successfully logged out');
    } catch (err) {
      res.status(500).send(`Error when logging out user: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/registerUser', registerUser);
  router.post('/loginUser', loginUser);
  router.get('/getAllUsers', getAllUsers);
  router.post('/deleteUser', deleteUser);
  router.get('/getCurrentUser', currentUser);
  router.get('/getUserByUsername/:username', getUserByUsername);
  router.post('/logoutUser', logoutUser);

  return router;
};

export default userController;
