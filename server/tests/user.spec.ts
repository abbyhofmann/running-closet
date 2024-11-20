import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { User } from '../types';

const saveUserSpy = jest.spyOn(util, 'saveUser');
const isUsernameAvailableSpy = jest.spyOn(util, 'isUsernameAvailable');
const hashPasswordSpy = jest.spyOn(util, 'hashPassword');
const fetchUserByUsernameSpy = jest.spyOn(util, 'fetchUserByUsername');
const comparePasswordsSpy = jest.spyOn(util, 'comparePasswords');
const fetchAllUsersSpy = jest.spyOn(util, 'fetchAllUsers');
const followAnotherUserSpy = jest.spyOn(util, 'followAnotherUser');
const unfollowAnotherUserSpy = jest.spyOn(util, 'unfollowAnotherUser');
const getCurrentUserSpy = jest.spyOn(util, 'getCurrentUser');

const user1: User = {
  _id: new ObjectId('45e9b58910afe6e94fc6e6dc'),
  username: 'user1',
  firstName: 'Abby',
  lastName: 'Hofmann',
  email: 'user1@gmail.com',
  password: 'password',
  profileGraphic: 1,
  deleted: false,
  following: [],
  followers: [],
};

const user2: User = {
  _id: new ObjectId('46e9b58910afe6e94fc6e6dd'),
  username: 'user2',
  firstName: 'Kate',
  lastName: 'Stuntz',
  email: 'user2@gmail.com',
  password: 'password',
  profileGraphic: 2,
  deleted: false,
  following: [],
  followers: [],
};

const user3: User = {
  _id: new ObjectId('47e9b58910afe6e94fc6e6dd'),
  username: 'user3',
  firstName: 'Elizabeth',
  lastName: 'Jamison',
  email: 'user3@gmail.com',
  password: 'password',
  profileGraphic: 3,
  deleted: false,
  following: [],
  followers: [],
};

const user4: User = {
  _id: new ObjectId('46e9b58910afe6e94fc6e6dd'),
  username: 'user1',
  firstName: 'Phineas',
  lastName: 'Flynn',
  email: 'user1@gmail.com',
  password: 'password',
  profileGraphic: 6,
  deleted: false,
  following: [],
  followers: [user1],
};

const updateDeletedStatusSpy = jest.spyOn(util, 'updateDeletedStatus');

describe('POST /registerUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return invalid request error if username is missing', async () => {
    const mockReqBody = {
      firstName: 'Hum',
      lastName: 'Dum',
      email: 'fairytalechar@gmail.com',
      password: 'x1x2x33*',
      profileGraphic: 4,
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid register request');
  });

  it('should return invalid request error if email is missing', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      firstName: 'Hum',
      lastName: 'Dum',
      password: 'x1x2x33*',
      profileGraphic: 4,
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid register request');
  });

  it('should return invalid request error if password is missing', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      firstName: 'Hum',
      lastName: 'Dum',
      email: 'fairytalechar@gmail.com',
      profileGraphic: 4,
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid register request');
  });

  it('should return invalid request error if firstName is missing', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      lastName: 'Dum',
      email: 'fairytalechar@gmail.com',
      password: 'x1x2x33*',
      profileGraphic: 4,
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid register request');
  });

  it('should return invalid request error if lastName is missing', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      firstName: 'Hum',
      email: 'fairytalechar@gmail.com',
      password: 'x1x2x33*',
      profileGraphic: 4,
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid register request');
  });

  it('should return invalid request error if profileGraphic is missing', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      firstName: 'Hum',
      lastName: 'Dum',
      email: 'fairytalechar@gmail.com',
      password: 'x1x2x33*',
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid register request');
  });

  it('should return invalid email error if email is improperly formatted', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      firstName: 'Hum',
      lastName: 'Dum',
      email: 'bad email',
      password: 'x1x2x33*',
      profileGraphic: 3,
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid email');
  });

  it('should return user object upon valid request', async () => {
    const validUid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      username: 'humptydumpty',
      firstName: 'Hum',
      lastName: 'Dum',
      email: 'fairytalechar@gmail.com',
      password: 'x1x2x33*',
      profileGraphic: 4,
    };

    const mockUserFromDb = {
      _id: validUid,
      username: 'humptydumpty',
      firstName: 'Humpty',
      lastName: 'Dumpty',
      email: 'fairytalechar@gmail.com',
      password: 'hashedPassworddddd',
      profileGraphic: 3,
      deleted: false,
      following: [],
      followers: [],
    };

    isUsernameAvailableSpy.mockResolvedValue(true);
    saveUserSpy.mockResolvedValue(mockUserFromDb);
    hashPasswordSpy.mockResolvedValue('hashedPassworddddd');

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validUid.toString(),
      username: 'humptydumpty',
      firstName: 'Humpty',
      lastName: 'Dumpty',
      email: 'fairytalechar@gmail.com',
      password: 'hashedPassworddddd',
      profileGraphic: 3,
      deleted: false,
      following: [],
      followers: [],
    });
  });

  it('should return unavailable username message if username is already in use', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      firstName: 'H',
      lastName: 'D',
      email: 'fairytalechar@gmail.com',
      password: 'x1x2x33*',
      profileGraphic: 4,
    };

    isUsernameAvailableSpy.mockResolvedValue(false);

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Username already in use');
  });

  it('should return database error in response if saveUser method throws an error', async () => {
    const mockReqBody = {
      username: 'user1',
      firstName: 'Amanda',
      lastName: 'Nighengale',
      email: 'this.is.an.email@gmail.com',
      password: '1234abcd',
      profileGraphic: 2,
    };

    isUsernameAvailableSpy.mockResolvedValueOnce(true);
    hashPasswordSpy.mockResolvedValue('thisPasswordIsHashed');
    saveUserSpy.mockResolvedValueOnce({ error: 'Error when saving a user' });

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when registering user: Error when saving a user');
  });
});

describe('GET /getAllUsers', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return all users in the database', async () => {
    jest.spyOn(util, 'fetchAllUsers').mockResolvedValue([user1, user2, user3]);

    const response = await supertest(app).get('/user/getAllUsers');

    const expectedResponse = [user1, user2, user3].map(user => ({
      ...user,
      _id: user._id?.toString(),
    }));

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return database error in response if fetchAllUsers method throws an error', async () => {
    fetchAllUsersSpy.mockResolvedValue({ error: 'Error when fetching all users' });

    const response = await supertest(app).get('/user/getAllUsers');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when fetching all users: Error when fetching all users');
  });
});

describe('POST /loginUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return invalid request error if password is missing', async () => {
    const mockReqBody = {
      username: 'jack_sparrow',
    };

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid login request');
  });

  it('should return invalid request error if username is missing', async () => {
    const mockReqBody = {
      password: 'i$landLyfe',
    };

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid login request');
  });

  it('should return invalid request error if password is empty string', async () => {
    const mockReqBody = {
      username: 'jack_sparrow',
      password: ' ',
    };

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid login request');
  });

  it('should return invalid request error if username is empty string', async () => {
    const mockReqBody = {
      username: ' ',
      password: 'i$landLyfe',
    };

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid login request');
  });

  it('should return user object upon valid login request', async () => {
    const validUid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      username: 'jack_sparrow',
      password: 'i$landLyfe',
    };

    const mockUserFromDb = {
      _id: validUid,
      username: 'jack_sparrow',
      firstName: 'Jack',
      lastName: 'Sparrow',
      email: 'i_am_a_pirate@hotmail.com',
      password: 'hashedPassworddddd',
      profileGraphic: 5,
      deleted: false,
      following: [],
      followers: [],
    };

    fetchUserByUsernameSpy.mockResolvedValue(mockUserFromDb);
    comparePasswordsSpy.mockResolvedValue(true);

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validUid.toString(),
      username: 'jack_sparrow',
      firstName: 'Jack',
      lastName: 'Sparrow',
      email: 'i_am_a_pirate@hotmail.com',
      password: 'hashedPassworddddd',
      profileGraphic: 5,
      deleted: false,
      following: [],
      followers: [],
    });
  });

  it('should return request error if passwords do not match', async () => {
    const validUid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      username: 'jack_sparrow',
      password: 'i$landLyfe',
    };

    const mockUserFromDb = {
      _id: validUid,
      username: 'jack_sparrow',
      firstName: 'Jack',
      lastName: 'Sparrow',
      email: 'i_am_a_pirate@hotmail.com',
      password: 'hashedPassworddddd',
      profileGraphic: 4,
      deleted: false,
      following: [],
      followers: [],
    };

    fetchUserByUsernameSpy.mockResolvedValue(mockUserFromDb);
    comparePasswordsSpy.mockResolvedValue(false);

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);

    expect(response.status).toBe(401);
    expect(response.text).toBe('Incorrect password');
  });

  it('should return 400 if user is not fetched', async () => {
    const mockReqBody = {
      username: 'jack_sparrow',
      password: 'i$landLyfe',
    };

    fetchUserByUsernameSpy.mockResolvedValue({
      error: `Error when fetching user: Failed to fetch user with username jack_sparrow`,
    });
    comparePasswordsSpy.mockResolvedValue(true);

    const response = await supertest(app).post('/user/loginUser').send(mockReqBody);

    expect(response.status).toBe(401);
    expect(response.text).toBe(
      'Error when fetching user: Failed to fetch user with username jack_sparrow',
    );
  });
});

describe('POST /deleteUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return invalid request error if request body is empty', async () => {
    const mockReqBody = {};

    const response = await supertest(app).post('/user/deleteUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return invalid request error if uid is missing', async () => {
    const mockReqBody = {
      uid: '',
    };

    const response = await supertest(app).post('/user/deleteUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return error if updateDeletedStatus errors', async () => {
    const mockReqBody = {
      username: 'someUid',
    };

    updateDeletedStatusSpy.mockResolvedValueOnce({ error: 'User not found!' });

    const response = await supertest(app).post('/user/deleteUser').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when deleting user someUid: User not found!');
  });

  it('should return user with deleted field updated upon successful deletion', async () => {
    const validUid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      username: 'humptydumpty',
    };

    const updatedUser = {
      _id: validUid,
      username: 'humptydumpty',
      firstName: 'Humpyyy',
      lastName: 'Dumpyyy',
      email: 'fairytalechar@gmail.com',
      password: 'hashedPassworddddd',
      profileGraphic: 2,
      deleted: true,
      following: [],
      followers: [],
    };

    updateDeletedStatusSpy.mockResolvedValueOnce(updatedUser);

    const response = await supertest(app).post('/user/deleteUser').send(mockReqBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validUid.toString(),
      username: 'humptydumpty',
      firstName: 'Humpyyy',
      lastName: 'Dumpyyy',
      email: 'fairytalechar@gmail.com',
      password: 'hashedPassworddddd',
      profileGraphic: 2,
      deleted: true,
      following: [],
      followers: [],
    });
  });
});

describe('GET /getUserByUsername', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return a user from the database', async () => {
    fetchUserByUsernameSpy.mockResolvedValueOnce(user1);

    const response = await supertest(app).get('/user/getUserByUsername/jack_sparrow');

    const expectedResponse = {
      ...user1,
      _id: user1._id?.toString(),
    };

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return database error in response if fetchUserByUsername method throws an error', async () => {
    fetchUserByUsernameSpy.mockResolvedValue({ error: 'error' });

    const response = await supertest(app).get('/user/getUserByUsername/jack_sparrow');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when fetching user: error');
  });
});

describe('POST /followUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return the users with updated followers list from the database', async () => {
    const mockReqBody = {
      currentUserId: '45e9b58910afe6e94fc6e6dc',
      userToFollowId: '46e9b58910afe6e94fc6e6dd',
    };
    const mockUser1: User = { ...user1, following: user1.following.concat(user2) };
    const mockUser2: User = { ...user2, followers: user2.followers.concat(user1) };
    const users: User[] = [mockUser1, mockUser2];
    followAnotherUserSpy.mockResolvedValueOnce(users);

    const response = await supertest(app).post('/user/followUser').send(mockReqBody);

    expect(response.status).toBe(200);
    expect((response.body as User)._id).toEqual('46e9b58910afe6e94fc6e6dd');
    expect((response.body as User).followers[0]._id).toEqual('45e9b58910afe6e94fc6e6dc');
  });

  it('should return error when currentUserId is missing', async () => {
    const mockReqBody = {
      userToFollowId: '46e9b58910afe6e94fc6e6dd',
    };

    const mockUser1: User = { ...user1, following: user1.following.concat(user2) };
    const mockUser2: User = { ...user2, followers: user2.followers.concat(user1) };
    const users: User[] = [mockUser1, mockUser2];
    followAnotherUserSpy.mockResolvedValueOnce(users);

    const response = await supertest(app).post('/user/followUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid follow user request');
  });

  it('should return the user with same followers list when trying to follow the same user - no duplicates', async () => {
    const mockReqBody = {
      currentUserId: '46e9b58910afe6e94fc6e6dd',
      userToFollowId: '45e9b58910afe6e94fc6e6dc',
    };

    followAnotherUserSpy.mockResolvedValueOnce([user1, user4]);

    const response = await supertest(app).post('/user/followUser').send(mockReqBody);

    expect(response.status).toBe(200);
    expect((response.body as User)._id).toEqual('46e9b58910afe6e94fc6e6dd');
    expect((response.body as User).followers.length).toEqual(1);
    expect((response.body as User).followers[0]._id).toEqual('45e9b58910afe6e94fc6e6dc');
  });

  it('should return error when userToFollowId is missing', async () => {
    const mockReqBody = {
      userToFollowId: '46e9b58910afe6e94fc6e6dd',
    };

    const mockUser1: User = { ...user1, following: user1.following.concat(user2) };
    const mockUser2: User = { ...user2, followers: user2.followers.concat(user1) };
    const users: User[] = [mockUser1, mockUser2];
    followAnotherUserSpy.mockResolvedValueOnce(users);

    const response = await supertest(app).post('/user/followUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid follow user request');
  });

  it('should return error when request body is empty', async () => {
    const mockReqBody = {};

    const mockUser1: User = { ...user1, following: user1.following.concat(user2) };
    const mockUser2: User = { ...user2, followers: user2.followers.concat(user1) };
    const users: User[] = [mockUser1, mockUser2];
    followAnotherUserSpy.mockResolvedValueOnce(users);

    const response = await supertest(app).post('/user/followUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid follow user request');
  });

  it('should return error when currentUserId is invalid', async () => {
    const mockReqBody = {
      currentUserId: 'invalidFormat',
      userToFollowId: '45e9b58910afe6e94fc6e6dc',
    };

    const mockUser1: User = { ...user1, following: user1.following.concat(user2) };
    const mockUser2: User = { ...user2, followers: user2.followers.concat(user1) };
    const users: User[] = [mockUser1, mockUser2];
    followAnotherUserSpy.mockResolvedValueOnce(users);

    const response = await supertest(app).post('/user/followUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return error when userToFollowId is invalid', async () => {
    const mockReqBody = {
      currentUserId: '45e9b58910afe6e94fc6e6dc',
      userToFollowId: 'invalidFormat',
    };

    const mockUser1: User = { ...user1, following: user1.following.concat(user2) };
    const mockUser2: User = { ...user2, followers: user2.followers.concat(user1) };
    const users: User[] = [mockUser1, mockUser2];
    followAnotherUserSpy.mockResolvedValueOnce(users);

    const response = await supertest(app).post('/user/followUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return error when currentUserId is empty', async () => {
    const mockReqBody = {
      currentUserId: '',
      userToFollowId: '45e9b58910afe6e94fc6e6dc',
    };

    const mockUser1: User = { ...user1, following: user1.following.concat(user2) };
    const mockUser2: User = { ...user2, followers: user2.followers.concat(user1) };
    const users: User[] = [mockUser1, mockUser2];
    followAnotherUserSpy.mockResolvedValueOnce(users);

    const response = await supertest(app).post('/user/followUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid follow user request');
  });

  it('should return error when userToFollowId is empty', async () => {
    const mockReqBody = {
      currentUserId: '45e9b58910afe6e94fc6e6dc',
      userToFollowId: '',
    };

    const mockUser1: User = { ...user1, following: user1.following.concat(user2) };
    const mockUser2: User = { ...user2, followers: user2.followers.concat(user1) };
    const users: User[] = [mockUser1, mockUser2];
    followAnotherUserSpy.mockResolvedValueOnce(users);

    const response = await supertest(app).post('/user/followUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid follow user request');
  });

  it('should return database error in response if followAnotherUser method throws an error', async () => {
    const mockReqBody = {
      currentUserId: '45e9b58910afe6e94fc6e6dc',
      userToFollowId: '46e9b58910afe6e94fc6e6dd',
    };

    followAnotherUserSpy.mockResolvedValue({ error: 'error' });

    const response = await supertest(app).post('/user/followUser').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when following user: error');
  });
});
describe('POST /unfollowUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return the user with updated followers list from the database', async () => {
    const mockReqBody = {
      currentUserId: '45e9b58910afe6e94fc6e6dc',
      userToFollowId: '46e9b58910afe6e94fc6e6dd',
    };

    unfollowAnotherUserSpy.mockResolvedValueOnce([user1, user2]);

    const response = await supertest(app).post('/user/unfollowUser').send(mockReqBody);

    expect(response.status).toBe(200);
    expect((response.body as User[])[0]._id).toEqual('45e9b58910afe6e94fc6e6dc');
    expect((response.body as User[])[0].followers.length).toEqual(0);
  });

  it('should return error when currentUserId is missing', async () => {
    const mockReqBody = {
      userToFollowId: '46e9b58910afe6e94fc6e6dd',
    };

    unfollowAnotherUserSpy.mockResolvedValueOnce([user1, user2]);

    const response = await supertest(app).post('/user/unfollowUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid unfollow user request');
  });

  it('should return error when userToFollowId is missing', async () => {
    const mockReqBody = {
      userToFollowId: '46e9b58910afe6e94fc6e6dd',
    };

    unfollowAnotherUserSpy.mockResolvedValueOnce([user1, user2]);

    const response = await supertest(app).post('/user/unfollowUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid unfollow user request');
  });

  it('should return error when request body is empty', async () => {
    const mockReqBody = {};

    unfollowAnotherUserSpy.mockResolvedValueOnce([user1, user2]);

    const response = await supertest(app).post('/user/unfollowUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid unfollow user request');
  });

  it('should return error when currentUserId is invalid', async () => {
    const mockReqBody = {
      currentUserId: 'invalidFormat',
      userToFollowId: '45e9b58910afe6e94fc6e6dc',
    };

    unfollowAnotherUserSpy.mockResolvedValueOnce([user1, user2]);

    const response = await supertest(app).post('/user/unfollowUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });
});

describe('GET /getCurrentUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should return 500 status when no user is logged in', async () => {
    const response = await supertest(app).get('/user/getCurrentUser');

    getCurrentUserSpy.mockResolvedValueOnce(null);

    expect(response.status).toBe(500);
    expect(response.text).toBe('No current user logged in');
  });
});

describe('POST /logoutUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 500 if logout is unsuccessful', async () => {
    getCurrentUserSpy.mockResolvedValueOnce(user1);

    const response = await supertest(app).post('/user/logoutUser');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when logging out user: Current user was not logged out');
  });

  it('should return success message if logout is successful', async () => {
    getCurrentUserSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).post('/user/logoutUser');

    expect(response.status).toBe(200);
    expect(response.text).toBe('"User successfully logged out"');
  });
});
