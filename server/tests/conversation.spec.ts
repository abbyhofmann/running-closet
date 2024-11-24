import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import {
  User,
  MultipleConversationResponse,
  Conversation,
  Message,
  Notification,
  SendEmailPayload,
} from '../types';
import * as util from '../models/application';

const saveConversationSpy = jest.spyOn(util, 'saveConversation');
const areUsersRegisteredSpy = jest.spyOn(util, 'areUsersRegistered');
const doesConversationExistSpy = jest.spyOn(util, 'doesConversationExist');
const fetchConvosByParticipantsSpy = jest.spyOn(util, 'fetchConvosByParticipants');
const fetchConversationByIdSpy = jest.spyOn(util, 'fetchConversationById');

const user1: User = {
  _id: new ObjectId('45e9b58910afe6e94fc6e6dc'),
  username: 'user1',
  firstName: 'James',
  lastName: 'Jeffery',
  email: 'user1@gmail.com',
  password: 'password',
  profileGraphic: 4,
  deleted: false,
  following: [],
  followers: [],
};

const user2: User = {
  _id: new ObjectId('46e9b58910afe6e94fc6e6dd'),
  username: 'user2',
  firstName: 'Amanda',
  lastName: 'Nighengale',
  email: 'user2@gmail.com',
  password: 'password',
  profileGraphic: 5,
  deleted: false,
  following: [],
  followers: [],
};

const user3: User = {
  _id: new ObjectId('47e9b58910afe6e94fc6e6dc'),
  username: 'user3',
  firstName: 'Kim',
  lastName: 'Kardashian',
  email: 'user3@gmail.com',
  password: 'password',
  profileGraphic: 6,
  deleted: false,
  following: [],
  followers: [user1],
};

describe('POST /addConversation', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    jest.resetAllMocks();
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
          firstName: 'James',
          lastName: 'Jeffery',
          email: user1.email,
          password: user1.password,
          profileGraphic: 4,
          deleted: user1.deleted,
          following: user1.following,
          followers: user1.followers,
        },
        {
          _id: user2._id?.toString(),
          username: user2.username,
          firstName: 'Amanda',
          lastName: 'Nighengale',
          email: user2.email,
          password: user2.password,
          profileGraphic: 5,
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

describe('GET /conversation/:cid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return the conversation if a valid id is given', async () => {
    const validCid = new mongoose.Types.ObjectId();
    const mockReqParams = {
      cid: validCid.toString(),
    };
    const mockConvoFromDb = {
      _id: validCid,
      users: [user1, user2],
      messages: [],
      updatedAt: new Date('2023-11-18T09:24:00'),
    };

    fetchConversationByIdSpy.mockResolvedValueOnce(mockConvoFromDb);

    const response = await supertest(app).get(`/conversation/getConversation/${mockReqParams.cid}`);

    expect(response.status).toBe(200);
    expect(response.body._id.toString()).toBe(validCid.toString());
    expect(response.body.users.length).toBe(2);
    expect(response.body.users[0]._id.toString()).toBe(user1._id?.toString());
    expect(response.body.users[1]._id.toString()).toBe(user2._id?.toString());
    expect(response.body.messages.length).toBe(0);
  });

  it('should return invalid request error if cid is invalid', async () => {
    const mockReqParams = {
      cid: 'invalidId',
    };

    fetchConversationByIdSpy.mockResolvedValueOnce({
      error: 'Error when fetching the conversation',
    });

    const response = await supertest(app).get(`/conversation/getConversation/${mockReqParams.cid}`);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return invalid request error if fetchConversationById errors', async () => {
    const mockReqParams = {
      cid: '65e9a5c2b26199dbcc3e6dc7',
    };

    fetchConversationByIdSpy.mockResolvedValueOnce({
      error: 'Error when fetching the conversation',
    });

    const response = await supertest(app).get(`/conversation/getConversation/${mockReqParams.cid}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when fetching conversation: Error when fetching the conversation',
    );
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
            username: user1.username,
            firstName: 'James',
            lastName: 'Jeffery',
            email: user1.email,
            password: user1.password,
            profileGraphic: 4,
            deleted: user1.deleted,
            following: user1.following,
            followers: user1.followers,
          },
          {
            _id: user2._id?.toString(),
            username: user2.username,
            firstName: 'Amanda',
            lastName: 'Nighengale',
            email: user2.email,
            password: user2.password,
            profileGraphic: 5,
            deleted: user2.deleted,
            following: user2.following,
            followers: user2.followers,
          },
        ],
      },
    ];

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toEqual(expectedResponse);
  });
});

describe('POST /sendBlastMessage', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return invalid request error if req body is empty', async () => {
    const mockReqBody = {};

    const response = await supertest(app).post('/conversation/sendBlastMessage').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid blast message request body');
  });

  it('should return invalid request error if missing uid', async () => {
    const mockReqBody = {
      messageContent: 'message',
    };

    const response = await supertest(app).post('/conversation/sendBlastMessage').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid blast message request body');
  });

  it('should return invalid request error if missing message content', async () => {
    const mockReqBody = {
      uid: new mongoose.Types.ObjectId(),
    };

    const response = await supertest(app).post('/conversation/sendBlastMessage').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid blast message request body');
  });

  it('should return invalid request error if message is an empty string', async () => {
    const mockReqBody = {
      uid: new mongoose.Types.ObjectId(),
      messageContent: '   ',
    };

    const response = await supertest(app).post('/conversation/sendBlastMessage').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid blast message request body');
  });

  it('should return a list of conversation ids upon valid request', async () => {
    jest.clearAllMocks();
    const dateObj = new Date('December 17, 1995');
    const mockConversation = {
      _id: new mongoose.Types.ObjectId(),
      users: [user3, user1],
      messages: [],
      updatedAt: dateObj,
    };

    const mockMessage = {
      _id: new mongoose.Types.ObjectId(),
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: mockConversation._id.toString(),
    };

    const mockConversationWithMessage = {
      _id: new mongoose.Types.ObjectId(),
      users: [user3, user1],
      messages: [mockMessage],
      updatedAt: dateObj,
    };

    const mockNotification = {
      _id: new mongoose.Types.ObjectId(),
      user: user1.username,
      message: mockMessage,
    };

    const mockSendMsgPayload = {
      success: true,
      message: 'Email sent successfully',
    };

    jest.spyOn(util, 'fetchUserById').mockResolvedValueOnce(user3 as User);
    jest
      .spyOn(util, 'fetchConvosByParticipants')
      .mockResolvedValueOnce([mockConversation] as Conversation[]);
    jest
      .spyOn(util, 'createOrFetchConversation')
      .mockResolvedValueOnce(mockConversation as Conversation);
    jest.spyOn(util, 'saveMessage').mockResolvedValueOnce(mockMessage as Message);
    jest
      .spyOn(util, 'addMessage')
      .mockResolvedValueOnce(mockConversationWithMessage as Conversation);
    jest.spyOn(util, 'saveAndAddMessage').mockResolvedValue(mockMessage as Message);
    jest.spyOn(util, 'saveNotification').mockResolvedValue(mockNotification as Notification);
    jest.spyOn(util, 'sendEmail').mockResolvedValueOnce(mockSendMsgPayload as SendEmailPayload);

    const mockReqBody = {
      uid: user3._id?.toString(),
      messageContent: 'User 3 sending message!',
    };

    const response = await supertest(app).post('/conversation/sendBlastMessage').send(mockReqBody);

    const expectedResponse = [mockConversation._id.toString()];

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toEqual(expectedResponse);
  });
});
