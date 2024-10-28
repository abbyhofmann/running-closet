import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { User } from '../types';
import { ObjectId } from 'mongodb';

const saveUserSpy = jest.spyOn(util, 'saveUser');
const isUsernameAvailableSpy = jest.spyOn(util, 'isUsernameAvailable');
const hashPasswordSpy = jest.spyOn(util, 'hashPassword');
const fetchAllUsersSpy = jest.spyOn(util, 'fetchAllUsers');

const user1: User = {
  _id: new ObjectId('45e9b58910afe6e94fc6e6dc'),
  username: 'user1',
  email: 'user1@gmail.com',
  password: 'password',
  deleted: false,
  following: [],
  followers: [],
};

const user2: User = {
  _id: new ObjectId('46e9b58910afe6e94fc6e6dd'),
  username: 'user2',
  email: 'user2@gmail.com',
  password: 'password',
  deleted: false,
  following: [],
  followers: [],
};

const user3: User = {
  _id: new ObjectId('47e9b58910afe6e94fc6e6dd'),
  username: 'user3',
  email: 'user3@gmail.com',
  password: 'password',
  deleted: false,
  following: [],
  followers: [],
};

describe('POST /registerUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return invalid request error if username is missing', async () => {
    const mockReqBody = {
      email: 'fairytalechar@gmail.com',
      password: 'x1x2x33*',
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid register request');
  });

  it('should return invalid request error if email is missing', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      password: 'x1x2x33*',
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid register request');
  });

  it('should return invalid request error if password is missing', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      email: 'fairytalechar@gmail.com',
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid register request');
  });

  it('should return invalid email error if email is improperly formatted', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      email: 'bad email',
      password: 'x1x2x33*',
    };

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid email');
  });

  // todo - this test will need to be updated once the JWT work gets added
  it('should return user object and jwt upon valid request', async () => {
    const validUid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      username: 'humptydumpty',
      email: 'fairytalechar@gmail.com',
      password: 'x1x2x33*',
    };

    const mockUserFromDb = {
      _id: validUid,
      username: 'humptydumpty',
      email: 'fairytalechar@gmail.com',
      password: 'hashedPassworddddd',
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
      email: 'fairytalechar@gmail.com',
      password: 'hashedPassworddddd',
      deleted: false,
      following: [],
      followers: [],
    });
  });

  it('should return unavailable username message if username is already in use', async () => {
    const mockReqBody = {
      username: 'humptydumpty',
      email: 'fairytalechar@gmail.com',
      password: 'x1x2x33*',
    };

    isUsernameAvailableSpy.mockResolvedValue(false);

    const response = await supertest(app).post('/user/registerUser').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Username already in use');
  });

  it('should return database error in response if saveUser method throws an error', async () => {
    const mockReqBody = {
      username: 'user1',
      email: 'this.is.an.email@gmail.com',
      password: '1234abcd',
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

    const expectedResponse = [user1, user2, user3].map(user => ({ ...user, _id: user._id?.toString() }));

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
