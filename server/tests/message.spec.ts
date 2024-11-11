import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import * as util from '../models/application';
import { app } from '../app';
import { User } from '../types';

const saveMessageSpy = jest.spyOn(util, 'saveMessage');
const fetchConversationByIdSpy = jest.spyOn(util, 'fetchConversationById');
const addMessageSpy = jest.spyOn(util, 'addMessage');
const areUsersRegisteredSpy = jest.spyOn(util, 'areUsersRegistered');
const fetchUserByUsernameSpy = jest.spyOn(util, 'fetchUserByUsername');

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

describe('POST /sendMessage', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should add a new message to the conversation', async () => {
    const validCid = new mongoose.Types.ObjectId();
    const validMid = new mongoose.Types.ObjectId();

    const mockConversation = {
      _id: validCid,
      users: [user1, user2],
      messages: [],
      updatedAt: new Date('2024-11-03'),
    };

    const mockReqBody = {
      messageContent: 'Hello',
      sentBy: 'user1',
      cid: validCid.toString(),
    };

    const mockMessage = {
      _id: validMid,
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: validCid.toString(),
    };

    fetchUserByUsernameSpy.mockResolvedValueOnce(user1);

    areUsersRegisteredSpy.mockResolvedValueOnce(true);

    fetchConversationByIdSpy.mockResolvedValueOnce(mockConversation);

    saveMessageSpy.mockResolvedValueOnce(mockMessage);

    addMessageSpy.mockResolvedValueOnce(mockConversation);

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body._id?.toString()).toBe(validMid.toString());
    expect(response.body.messageContent).toBe('Hello');
    expect(response.body.sender._id.toString()).toEqual(user1._id?.toString());
    expect(response.body.sentAt).toBe(mockMessage.sentAt.toISOString());
    expect(response.body.readBy.length).toBe(1);
    expect(response.body.readBy[0]._id?.toString()).toEqual(user1._id?.toString());
  });

  it('should throw a bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/message/sendMessage');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should throw a bad request error if cid is missing', async () => {
    const mockReqBody = {
      messageContent: 'Hello',
      sentBy: 'user1',
    };

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should throw a bad request error if message content is missing', async () => {
    const mockReqBody = {
      sentBy: 'user1',
      cid: new mongoose.Types.ObjectId().toString(),
    };

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should throw a bad request error if message content is empty', async () => {
    const mockReqBody = {
      sentBy: 'user1',
      messageContent: '',
      cid: new mongoose.Types.ObjectId().toString(),
    };

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should throw a bad request error if sentBy is missing', async () => {
    const mockReqBody = {
      messageContent: 'message content',
      cid: new mongoose.Types.ObjectId().toString(),
    };

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should throw a bad request error if sent by is empty', async () => {
    const mockReqBody = {
      sentBy: '',
      messageContent: 'message content',
      cid: new mongoose.Types.ObjectId().toString(),
    };

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should throw a bad request error if cid is invalid', async () => {
    const mockReqBody = {
      sentBy: 'user1',
      messageContent: 'message content',
      cid: 'invalid cid',
    };

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should throw an invalid request error when fetchUserByUsername throws an error', async () => {
    const validCid = new mongoose.Types.ObjectId();

    const mockReqBody = {
      messageContent: 'Hello',
      sentBy: 'user1',
      cid: validCid.toString(),
    };

    fetchUserByUsernameSpy.mockResolvedValueOnce({ error: 'error' });

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding message: error');
  });

  it('should throw a invalid request error when the conversation users are deleted', async () => {
    const validCid = new mongoose.Types.ObjectId();

    const mockConversation = {
      _id: validCid,
      users: [user1, user2],
      messages: [],
      updatedAt: new Date('2024-11-03'),
    };

    const mockReqBody = {
      messageContent: 'Hello',
      sentBy: 'user1',
      cid: validCid.toString(),
    };

    fetchUserByUsernameSpy.mockResolvedValueOnce(user1);

    fetchConversationByIdSpy.mockResolvedValueOnce(mockConversation);

    areUsersRegisteredSpy.mockResolvedValueOnce(false);

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Users are not still registered');
  });

  it('should throw a database error when fetchConversationById throws an error', async () => {
    const validCid = new mongoose.Types.ObjectId();

    const mockReqBody = {
      messageContent: 'Hello',
      sentBy: 'user1',
      cid: validCid.toString(),
    };

    fetchUserByUsernameSpy.mockResolvedValueOnce(user1);

    fetchConversationByIdSpy.mockResolvedValueOnce({ error: 'error' });

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding message: error');
  });

  it('should throw an unauthorized error if sender is not part of the conversation', async () => {
    const validCid = new mongoose.Types.ObjectId();

    const mockConversation = {
      _id: validCid,
      users: [user2],
      messages: [],
      updatedAt: new Date('2024-11-03'),
    };

    const mockReqBody = {
      messageContent: 'Hello',
      sentBy: 'user1',
      cid: validCid.toString(),
    };

    fetchUserByUsernameSpy.mockResolvedValueOnce(user1);

    fetchConversationByIdSpy.mockResolvedValueOnce(mockConversation);

    areUsersRegisteredSpy.mockResolvedValueOnce(true);

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(401);
    expect(response.text).toBe('Sender is not part of the conversation');
  });

  it('should throw a database error when saveMessage throws an error', async () => {
    const validCid = new mongoose.Types.ObjectId();

    const mockConversation = {
      _id: validCid,
      users: [user1, user2],
      messages: [],
      updatedAt: new Date('2024-11-03'),
    };

    const mockReqBody = {
      messageContent: 'Hello',
      sentBy: 'user1',
      cid: validCid.toString(),
    };

    fetchUserByUsernameSpy.mockResolvedValueOnce(user1);

    fetchConversationByIdSpy.mockResolvedValueOnce(mockConversation);

    areUsersRegisteredSpy.mockResolvedValueOnce(true);

    saveMessageSpy.mockResolvedValueOnce({ error: 'error' });

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding message: error');
  });

  it('should throw a database error when addMessage throws an error', async () => {
    const validCid = new mongoose.Types.ObjectId();
    const validMid = new mongoose.Types.ObjectId();

    const mockConversation = {
      _id: validCid,
      users: [user1, user2],
      messages: [],
      updatedAt: new Date('2024-11-03'),
    };

    const mockReqBody = {
      messageContent: 'Hello',
      sentBy: 'user1',
      cid: validCid.toString(),
    };

    const mockMessage = {
      _id: validMid,
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: validCid.toString(),
    };

    fetchUserByUsernameSpy.mockResolvedValueOnce(user1);

    fetchConversationByIdSpy.mockResolvedValueOnce(mockConversation);

    areUsersRegisteredSpy.mockResolvedValueOnce(true);

    saveMessageSpy.mockResolvedValueOnce(mockMessage);

    addMessageSpy.mockResolvedValueOnce({ error: 'error' });

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding message: error');
  });
});
