import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import * as util from '../models/application';
import { app } from '../app';
import { User, Notification } from '../types';

const fetchNotifsByUsernameSpy = jest.spyOn(util, 'fetchNotifsByUsername');
const deleteNotificationByIdSpy = jest.spyOn(util, 'deleteNotificationById');

const user1: User = {
  _id: new ObjectId('45e9b58910afe6e94fc6e6dc'),
  username: 'user1',
  email: 'user1@gmail.com',
  password: 'password',
  deleted: false,
  following: [],
  followers: [],
};

const user3: User = {
  _id: new ObjectId('47e9b58910afe6e94fc6e6dc'),
  username: 'user3',
  email: 'user3@gmail.com',
  password: 'password',
  deleted: false,
  following: [],
  followers: [user1],
};

describe('GET /getNototifications/:username', () => {
  afterEach(async () => {
    await mongoose.connection.close();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return empty user doesnt exist', async () => {
    const mockReqParams = {
      username: 'userDoesNotExist',
    };

    fetchNotifsByUsernameSpy.mockResolvedValueOnce([]);

    const response = await supertest(app).get(
      `/notification/getNotifications/${mockReqParams.username}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return error if fetchNotifsByUsername errors', async () => {
    const mockReqParams = {
      username: 'userDoesNotExist',
    };

    fetchNotifsByUsernameSpy.mockResolvedValueOnce({ error: 'error' });

    const response = await supertest(app).get(
      `/notification/getNotifications/${mockReqParams.username}`,
    );

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when fetching notifications: error');
  });

  it('should return a list of notifications upon valid request', async () => {
    jest.clearAllMocks();

    const mockConversation = {
      _id: new mongoose.Types.ObjectId(),
      users: [user3, user1],
      messages: [],
      updatedAt: new Date('2024-11-03'),
    };

    const mockMessage = {
      _id: new mongoose.Types.ObjectId(),
      messageContent: 'Hello',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: mockConversation._id.toString(),
    };

    const mockMessage2 = {
      _id: new mongoose.Types.ObjectId(),
      messageContent: 'how are you?',
      sender: user1,
      sentAt: new Date('2024-11-03'),
      readBy: [user1],
      cid: mockConversation._id.toString(),
    };

    const mockNotification = {
      _id: new mongoose.Types.ObjectId(),
      user: user3.username,
      message: mockMessage,
    };

    const mockNotification2 = {
      _id: new mongoose.Types.ObjectId(),
      user: user3.username,
      message: mockMessage2,
    };

    fetchNotifsByUsernameSpy.mockResolvedValueOnce([mockNotification, mockNotification2]);

    const response = await supertest(app).get(`/notification/getNotifications/${user1.username}`);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.body.length)).toEqual(2);
    expect((response.body[0] as Notification)._id?.toString()).toEqual(
      mockNotification._id.toString(),
    );
    expect((response.body[1] as Notification)._id?.toString()).toEqual(
      mockNotification2._id.toString(),
    );
  });
});

describe('DELETE /deleteNotification/:nid', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return error if if is invalid', async () => {
    const mockReqParams = {
      nid: 'invalid',
    };

    const response = await supertest(app).delete(
      `/notification/deleteNotification/${mockReqParams.nid}`,
    );

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return error if deleteNotificationById false', async () => {
    const mockReqParams = {
      nid: new ObjectId(),
    };

    deleteNotificationByIdSpy.mockResolvedValueOnce(false);

    const response = await supertest(app).delete(
      `/notification/deleteNotification/${mockReqParams.nid}`,
    );

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      `Error when deleting notification with id: ${mockReqParams.nid.toString()}`,
    );
  });

  it('should return true upon valid deletion', async () => {
    const mockReqParams = {
      nid: new ObjectId(),
    };

    deleteNotificationByIdSpy.mockResolvedValueOnce(true);

    const response = await supertest(app).delete(
      `/notification/deleteNotification/${mockReqParams.nid}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});
