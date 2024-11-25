import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import * as util from '../models/application';
import { app } from '../app';
import { MultipleNotificationResponse, User } from '../types';

const saveMessageSpy = jest.spyOn(util, 'saveMessage');
const fetchConversationByIdSpy = jest.spyOn(util, 'fetchConversationById');
const addMessageSpy = jest.spyOn(util, 'addMessage');
const areUsersRegisteredSpy = jest.spyOn(util, 'areUsersRegistered');
const fetchUserByIdSpy = jest.spyOn(util, 'fetchUserById');
const markMessageAsReadSpy = jest.spyOn(util, 'markMessageAsRead');
const fetchUserByUsernameSpy = jest.spyOn(util, 'fetchUserByUsername');
const sendEmailSpy = jest.spyOn(util, 'sendEmail');
const saveNotificationSpy = jest.spyOn(util, 'saveNotification');
const fetchNotifsByUsernameSpy = jest.spyOn(util, 'fetchNotifsByUsername');
const deleteNotificationByIdSpy = jest.spyOn(util, 'deleteNotificationById');

const user1: User = {
  _id: new ObjectId('45e9b58910afe6e94fc6e6dc'),
  username: 'user1',
  firstName: 'Lily',
  lastName: 'Flower',
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
  firstName: 'Carson',
  lastName: 'Brown',
  email: 'user2@gmail.com',
  password: 'password',
  profileGraphic: 6,
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

    const mockSendMsgPayload = {
      success: true,
      message: 'Email sent successfully',
    };

    fetchUserByUsernameSpy.mockResolvedValueOnce(user1);

    areUsersRegisteredSpy.mockResolvedValueOnce(true);

    fetchConversationByIdSpy.mockResolvedValueOnce(mockConversation);

    saveMessageSpy.mockResolvedValueOnce(mockMessage);

    addMessageSpy.mockResolvedValueOnce(mockConversation);

    sendEmailSpy.mockResolvedValueOnce(mockSendMsgPayload);

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

  it('should throw a database error when saveNotification throws', async () => {
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

    saveNotificationSpy.mockResolvedValueOnce({ error: 'error' });

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding message: error');
  });

  it('should throw a database error when sendEmailResponse is unsuccesful', async () => {
    const validCid = new mongoose.Types.ObjectId();
    const validMid = new mongoose.Types.ObjectId();
    const validNid = new mongoose.Types.ObjectId();

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

    const mockNotification = {
      _id: validNid,
      message: mockMessage,
      user: user2.username,
    };

    const mockSendMsgPayload = {
      success: false,
      message: 'error',
    };

    fetchUserByUsernameSpy.mockResolvedValueOnce(user1);

    areUsersRegisteredSpy.mockResolvedValueOnce(true);

    fetchConversationByIdSpy.mockResolvedValueOnce(mockConversation);

    saveMessageSpy.mockResolvedValueOnce(mockMessage);

    addMessageSpy.mockResolvedValueOnce(mockConversation);

    saveNotificationSpy.mockResolvedValueOnce(mockNotification);

    sendEmailSpy.mockResolvedValueOnce(mockSendMsgPayload);

    const response = await supertest(app).post('/message/sendMessage').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding message: error');
  });
});

describe('POST /markAsRead', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should mark a message as read successfully', async () => {
    const validMid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const validNid = new mongoose.Types.ObjectId();

    const mockMessage = {
      _id: validMid,
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: validCid.toString(),
    };

    const mockReqBody = {
      mid: validMid.toString(),
      uid: user1._id?.toString(),
    };

    const mockNotifications = [
      {
        _id: validNid,
        message: mockMessage,
        user: user1.username,
      },
    ];

    fetchUserByIdSpy.mockResolvedValueOnce(user2);
    markMessageAsReadSpy.mockResolvedValueOnce(mockMessage);
    fetchNotifsByUsernameSpy.mockResolvedValueOnce(mockNotifications);
    deleteNotificationByIdSpy.mockResolvedValueOnce(true);

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body._id?.toString()).toBe(validMid.toString());
    expect(response.body.messageContent).toBe('Hello');
    expect(response.body.sender._id?.toString()).toEqual(user1._id?.toString());
    expect(response.body.sentAt).toBe(mockMessage.sentAt.toISOString());
    expect(response.body.readBy.length).toBe(1);
    expect(response.body.readBy[0]._id?.toString()).toEqual(user1._id?.toString());
  });

  it('should throw a bad request error if the request body is missing', async () => {
    const response = await supertest(app).post('/message/markAsRead');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should throw a bad request error if mid is missing', async () => {
    const mockReqBody = {
      uid: user1._id?.toString(),
    };

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should throw a bad request error if mid is invalid', async () => {
    const mockReqBody = {
      mid: 'invalid mid',
      uid: user1._id?.toString(),
    };

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should throw a bad request error if uid is missing', async () => {
    const mockReqBody = {
      mid: new mongoose.Types.ObjectId().toString(),
    };

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should throw a bad request error if uid is invalid', async () => {
    const mockReqBody = {
      mid: new mongoose.Types.ObjectId().toString(),
      uid: 'invalid uid',
    };

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should throw a database error if there is an issue fetching the user', async () => {
    const validMid = new mongoose.Types.ObjectId();

    const mockReqBody = {
      mid: validMid.toString(),
      uid: user1._id?.toString(),
    };

    fetchUserByIdSpy.mockResolvedValueOnce({ error: 'error' });

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when marking message as read: error');
  });

  it('should throw a database error if there is an issue marking the message as read', async () => {
    const validMid = new mongoose.Types.ObjectId();

    const mockReqBody = {
      mid: validMid.toString(),
      uid: user1._id?.toString(),
    };

    fetchUserByIdSpy.mockResolvedValueOnce(user1);
    markMessageAsReadSpy.mockResolvedValueOnce({ error: 'error' });

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when marking message as read: error');
  });

  it('should mark a message as read successfully but not delete any notifications if there are no notifications for the user', async () => {
    const validMid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();

    const mockMessage = {
      _id: validMid,
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: validCid.toString(),
    };

    const mockReqBody = {
      mid: validMid.toString(),
      uid: user1._id?.toString(),
    };

    const mockNotifications: MultipleNotificationResponse = [];

    fetchUserByIdSpy.mockResolvedValueOnce(user2);
    markMessageAsReadSpy.mockResolvedValueOnce(mockMessage);
    fetchNotifsByUsernameSpy.mockResolvedValueOnce(mockNotifications);

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body._id?.toString()).toBe(validMid.toString());
    expect(response.body.messageContent).toBe('Hello');
    expect(response.body.sender._id?.toString()).toEqual(user1._id?.toString());
    expect(response.body.sentAt).toBe(mockMessage.sentAt.toISOString());
    expect(response.body.readBy.length).toBe(1);
    expect(response.body.readBy[0]._id?.toString()).toEqual(user1._id?.toString());
  });

  it('should mark a message as read successfully but not delete any notifications when there are no notifications with the correct id', async () => {
    const validMid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const validNid = new mongoose.Types.ObjectId();

    const mockMessage = {
      _id: validMid,
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: validCid.toString(),
    };

    const mockReqBody = {
      mid: validMid.toString(),
      uid: user1._id?.toString(),
    };

    const mockNotifications = [
      {
        _id: validNid,
        message: {
          _id: new mongoose.Types.ObjectId(),
          messageContent: 'Hello',
          sender: user1,
          sentAt: new Date('2024-11-03'),
          readBy: [user1],
          cid: validCid.toString(),
        },
        user: user1.username,
      },
    ];

    fetchUserByIdSpy.mockResolvedValueOnce(user2);
    markMessageAsReadSpy.mockResolvedValueOnce(mockMessage);
    fetchNotifsByUsernameSpy.mockResolvedValueOnce(mockNotifications);

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body._id?.toString()).toBe(validMid.toString());
    expect(response.body.messageContent).toBe('Hello');
    expect(response.body.sender._id?.toString()).toEqual(user1._id?.toString());
    expect(response.body.sentAt).toBe(mockMessage.sentAt.toISOString());
    expect(response.body.readBy.length).toBe(1);
    expect(response.body.readBy[0]._id?.toString()).toEqual(user1._id?.toString());
  });

  it('should return a database error when there is fetchNotifsByUsername throws an error', async () => {
    const validMid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();

    const mockMessage = {
      _id: validMid,
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: validCid.toString(),
    };

    const mockReqBody = {
      mid: validMid.toString(),
      uid: user1._id?.toString(),
    };

    fetchUserByIdSpy.mockResolvedValueOnce(user2);
    markMessageAsReadSpy.mockResolvedValueOnce(mockMessage);
    fetchNotifsByUsernameSpy.mockResolvedValueOnce({ error: 'error' });

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when marking message as read: error');
  });

  it('should throw an error when there are more than 1 notifications found for a message', async () => {
    const validMid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const validNid = new mongoose.Types.ObjectId();
    const validNid2 = new mongoose.Types.ObjectId();

    const mockMessage = {
      _id: validMid,
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: validCid.toString(),
    };

    const mockReqBody = {
      mid: validMid.toString(),
      uid: user1._id?.toString(),
    };

    const mockNotifications = [
      {
        _id: validNid,
        message: mockMessage,
        user: user1.username,
      },
      {
        _id: validNid2,
        message: mockMessage,
        user: user1.username,
      },
    ];

    fetchUserByIdSpy.mockResolvedValueOnce(user2);
    markMessageAsReadSpy.mockResolvedValueOnce(mockMessage);
    fetchNotifsByUsernameSpy.mockResolvedValueOnce(mockNotifications);

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      `Error when marking message as read: Issue finding notification for message ${validMid} for user ${user2.username}`,
    );
  });

  it('should throw an error when the notification id is undefined', async () => {
    const validMid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();

    const mockMessage = {
      _id: validMid,
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: validCid.toString(),
    };

    const mockReqBody = {
      mid: validMid.toString(),
      uid: user1._id?.toString(),
    };

    const mockNotifications = [
      {
        message: mockMessage,
        user: user1.username,
      },
    ];

    fetchUserByIdSpy.mockResolvedValueOnce(user2);
    markMessageAsReadSpy.mockResolvedValueOnce(mockMessage);
    fetchNotifsByUsernameSpy.mockResolvedValueOnce(mockNotifications);

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe(`Error when marking message as read: Notification id undefined`);
  });

  it('should throw an error when deleteNotificationById returns false', async () => {
    const validMid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const validNid = new mongoose.Types.ObjectId();

    const mockMessage = {
      _id: validMid,
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: validCid.toString(),
    };

    const mockReqBody = {
      mid: validMid.toString(),
      uid: user1._id?.toString(),
    };

    const mockNotifications = [
      {
        _id: validNid,
        message: mockMessage,
        user: user1.username,
      },
    ];

    fetchUserByIdSpy.mockResolvedValueOnce(user2);
    markMessageAsReadSpy.mockResolvedValueOnce(mockMessage);
    fetchNotifsByUsernameSpy.mockResolvedValueOnce(mockNotifications);
    deleteNotificationByIdSpy.mockResolvedValueOnce(false);

    const response = await supertest(app).post('/message/markAsRead').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      `Error when marking message as read: Notification not successully deleted`,
    );
  });
});
