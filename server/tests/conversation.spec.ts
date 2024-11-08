import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import { User, MultipleConversationResponse } from '../types';
import * as util from '../models/application';

const saveConversationSpy = jest.spyOn(util, 'saveConversation');
const areUsersRegisteredSpy = jest.spyOn(util, 'areUsersRegistered');
const doesConversationExistSpy = jest.spyOn(util, 'doesConversationExist');
const fetchConvosByParticipantsSpy = jest.spyOn(util, 'fetchConvosByParticipants');

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

describe('POST /addConversation', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return invalid request error if users field is missing from req body', async () => {
    const mockReqBody = {};

    const response = await supertest(app).post('/conversation/addConversation').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid conversation body');
  });

  it('should return invalid request error if users list is empty', async () => {
    const mockReqBody = {
      users: [],
    };

    const response = await supertest(app).post('/conversation/addConversation').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid conversation body');
  });

  it('should return invalid request error if users list has one object', async () => {
    const mockReqBody = {
      users: [user1],
    };

    const response = await supertest(app).post('/conversation/addConversation').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid conversation body');
  });

  it('should return invalid request error if user is not registered', async () => {
    const mockReqBody = {
      users: [user1, user2],
    };

    areUsersRegisteredSpy.mockResolvedValueOnce(false);

    const response = await supertest(app).post('/conversation/addConversation').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid conversation user');
  });

  it('should return error status if conversation already exists', async () => {
    const mockReqBody = {
      users: [user1, user2],
    };

    areUsersRegisteredSpy.mockResolvedValueOnce(true);
    doesConversationExistSpy.mockResolvedValueOnce(true);

    const response = await supertest(app).post('/conversation/addConversation').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Conversation with provided users already exists');
  });

  it('should return error status if error during fetch convo', async () => {
    const mockReqBody = {
      users: [user1, user2],
    };

    areUsersRegisteredSpy.mockResolvedValueOnce(true);
    doesConversationExistSpy.mockResolvedValueOnce(new Error('Error thrown'));

    const response = await supertest(app).post('/conversation/addConversation').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Conversation with provided users already exists');
  });

  it('should return conversation object upon valid request', async () => {
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      users: [user1, user2],
    };

    const dateObj = new Date('December 17, 1995 03:24:00');
    const mockConvoFromDb = {
      _id: validCid,
      users: [user1, user2],
      messages: [],
      updatedAt: dateObj,
    };

    saveConversationSpy.mockResolvedValueOnce(mockConvoFromDb);
    areUsersRegisteredSpy.mockResolvedValueOnce(true);
    fetchConvosByParticipantsSpy.mockResolvedValueOnce([]);
    doesConversationExistSpy.mockResolvedValueOnce(false);

    const response = await supertest(app).post('/conversation/addConversation').send(mockReqBody);
    expect(response.status).toBe(200);
    const responseBody = {
      ...response.body,
      updatedAt: new Date(response.body.updatedAt),
    };
    expect(responseBody).toEqual({
      _id: validCid.toString(),
      users: [
        {
          _id: user1._id?.toString(),
          username: user1.username,
          email: user1.email,
          password: user1.password,
          deleted: user1.deleted,
          following: user1.following,
          followers: user1.followers,
        },
        {
          _id: user2._id?.toString(),
          username: user2.username,
          email: user2.email,
          password: user2.password,
          deleted: user2.deleted,
          following: user2.following,
          followers: user2.followers,
        },
      ],
      messages: [],
      updatedAt: dateObj,
    });
  });
});

describe('GET /getConversations', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return invalid ID error if provided uid is not an ObjectId', async () => {
    const mockReqParams = {
      uid: 'id',
    };

    const response = await supertest(app).get(
      `/conversation/getConversations/${mockReqParams.uid}`,
    );

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return a list of conversations upon valid request', async () => {
    jest.clearAllMocks();
    const dateObj = new Date('December 17, 1995');
    const mockConversation = {
      _id: new mongoose.Types.ObjectId(),
      users: [user1, user2],
      messages: [],
      updatedAt: dateObj,
    };

    jest.spyOn(util, 'fetchUserById').mockResolvedValueOnce(user1 as User);
    jest
      .spyOn(util, 'fetchConvosByParticipants')
      .mockResolvedValueOnce([mockConversation] as MultipleConversationResponse);

    const response = await supertest(app).get(`/conversation/getConversations/${user1._id}`);

    const expectedResponse = [
      {
        _id: mockConversation._id.toString(),
        messages: [],
        updatedAt: new Date(dateObj).toISOString(),
        users: [
          {
            _id: user1._id?.toString(),
            username: 'user1',
            email: 'user1@gmail.com',
            password: 'password',
            deleted: false,
            following: [],
            followers: [],
          },
          {
            _id: user2._id?.toString(),
            username: 'user2',
            email: 'user2@gmail.com',
            password: 'password',
            deleted: false,
            following: [],
            followers: [],
          },
        ],
      },
    ];

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toEqual(expectedResponse);
  });
});
