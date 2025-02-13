import { ObjectId } from 'mongodb';
import sgMail from '@sendgrid/mail';
import Tags from '../models/tags';
import QuestionModel from '../models/questions';
import {
  addTag,
  getQuestionsByOrder,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  fetchAndIncrementQuestionViewsById,
  saveQuestion,
  processTags,
  saveAnswer,
  addAnswerToQuestion,
  getTagCountMap,
  saveComment,
  addComment,
  addVoteToQuestion,
  saveUser,
  hashPassword,
  isUsernameAvailable,
  fetchAllUsers,
  fetchUserByUsername,
  updateDeletedStatus,
  saveConversation,
  areUsersRegistered,
  saveMessage,
  addMessage,
  fetchUserById,
  markMessageAsRead,
  doesConversationExist,
  fetchConvosByParticipants,
  fetchConversationById,
  createOrFetchConversation,
  followAnotherUser,
  unfollowAnotherUser,
  deleteNotificationById,
  saveNotification,
  fetchNotifsByUsername,
  removeUserFromFollowerFollowingLists,
  sendEmail,
  comparePasswords,
  saveAndAddMessage,
} from '../models/application';
import {
  Answer,
  Question,
  Tag,
  Comment,
  User,
  Conversation,
  Message,
  Notification,
} from '../types';
import { T1_DESC, T2_DESC, T3_DESC } from '../data/posts_strings';
import AnswerModel from '../models/answers';
import UserModel from '../models/users';
import ConversationModel from '../models/conversations';
import MessageModel from '../models/messages';
import NotificationModel from '../models/notifications';
import * as util from '../models/application';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const createMessageSpy = jest.spyOn(MessageModel, 'create');
const createNotificationSpy = jest.spyOn(NotificationModel, 'create');
const createUserSpy = jest.spyOn(UserModel, 'create');
const createConversationSpy = jest.spyOn(ConversationModel, 'create');

const tag1: Tag = {
  _id: new ObjectId('507f191e810c19729de860ea'),
  name: 'react',
  description: T1_DESC,
};

const tag2: Tag = {
  _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'javascript',
  description: T2_DESC,
};

const tag3: Tag = {
  _id: new ObjectId('65e9b4b1766fca9451cba653'),
  name: 'android',
  description: T3_DESC,
};

const com1: Comment = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'com1',
  commentBy: 'com_by1',
  commentDateTime: new Date('2023-11-18T09:25:00'),
};

const ans1: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'ans1',
  ansBy: 'ansBy1',
  ansDateTime: new Date('2023-11-18T09:24:00'),
  comments: [],
};

const ans2: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'ans2',
  ansBy: 'ansBy2',
  ansDateTime: new Date('2023-11-20T09:24:00'),
  comments: [],
};

const ans3: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'ans3',
  ansBy: 'ansBy3',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
};

const ans4: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'ans4',
  ansBy: 'ansBy4',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
};

const QUESTIONS: Question[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [tag3, tag2],
    answers: [ans1, ans2],
    askedBy: 'q_by1',
    askDateTime: new Date('2023-11-16T09:24:00'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [tag1, tag2],
    answers: [ans1, ans2, ans3],
    askedBy: 'q_by2',
    askDateTime: new Date('2023-11-17T09:24:00'),
    views: ['question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    title: 'Is there a language to write programmes by pictures?',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by3',
    askDateTime: new Date('2023-11-19T09:24:00'),
    views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    title: 'Unanswered Question #2',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by4',
    askDateTime: new Date('2023-11-20T09:24:00'),
    views: [],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
];

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
  firstName: 'Sally',
  lastName: 'Smith',
  email: 'user2@gmail.com',
  password: 'password',
  profileGraphic: 2,
  deleted: false,
  following: [user1],
  followers: [user1],
};

const user3: User = {
  _id: new ObjectId('47e9b58910afe6e94fc6e6dd'),
  username: 'user3',
  firstName: 'Serena',
  lastName: 'Williams',
  email: 'user3@gmail.com',
  password: 'password',
  profileGraphic: 3,
  deleted: false,
  following: [user1, user2],
  followers: [],
};

const CID1: string = '55e9b58910afe6e94fc6e6aa';

const message1 = {
  _id: new ObjectId('44e9b58910afe6e94fc6e6bb'),
  messageContent: 'message 1 content',
  sender: user1,
  sentAt: new Date('2024-11-03T09:24:00'),
  readBy: [user1],
  cid: CID1,
};

const message2 = {
  _id: new ObjectId('44e9b58910afe6e94fc6e6bc'),
  messageContent: 'message 2 content',
  sender: user1,
  sentAt: new Date('2024-11-02T09:24:00'),
  readBy: [],
  cid: CID1,
};

const conversation1 = {
  _id: new ObjectId('55e9b58910afe6e94fc6e6aa'),
  users: [user1, user2],
  messages: [message1],
};

const conversation2 = {
  _id: new ObjectId('55e9b58910afe6e94fc6e6ab'),
  users: [user1, user2],
  messages: [],
};

const notification1 = {
  _id: new ObjectId('88e9b58910afe6e94fc6e688'),
  user: user1.username,
  message: message1,
};

const notification2 = {
  _id: new ObjectId('88e9b58910afe6e94fc6e689'),
  user: user2.username,
  message: message2,
};

describe('application module', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });
  describe('Question model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('filterQuestionsBySearch', () => {
      test('filter questions with empty search string should return all questions', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '');

        expect(result.length).toEqual(QUESTIONS.length);
      });

      test('filter questions with empty list of questions should return empty list', () => {
        const result = filterQuestionsBySearch([], 'react');

        expect(result.length).toEqual(0);
      });

      test('filter questions with empty questions and empty string should return empty list', () => {
        const result = filterQuestionsBySearch([], '');

        expect(result.length).toEqual(0);
      });

      test('filter question by one tag', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android]');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('filter question by multiple tags', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android] [react]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one user', () => {
        const result = filterQuestionsByAskedBy(QUESTIONS, 'q_by4');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('filter question by tag and then by user', () => {
        let result = filterQuestionsBySearch(QUESTIONS, '[javascript]');
        result = filterQuestionsByAskedBy(result, 'q_by2');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by tag and keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website [android]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });
    });

    describe('getQuestionsByOrder', () => {
      test('get active questions, newest questions sorted by most recently answered 1', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS.slice(0, 3), 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get active questions, newest questions sorted by most recently answered 2', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            answers: [ans1, ans3], // 18, 19 => 19
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de02',
            answers: [ans1, ans2, ans3, ans4], // 18, 20, 19, 19 => 20
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de03',
            answers: [ans1], // 18 => 18
            askDateTime: new Date('2023-11-19T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            answers: [ans4], // 19 => 19
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            answers: [],
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(5);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[4]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest unanswered questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('unanswered');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get newest questions', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest most viewed questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('mostViewed');

        expect(result.length).toEqual(4);
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('getQuestionsByOrder should return empty list if find throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByOrder should return empty list if find returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });
    });

    describe('fetchAndIncrementQuestionViewsById', () => {
      test('fetchAndIncrementQuestionViewsById should return question and add the user to the list of views if new', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(
          { ...question, views: ['question1_user', ...question.views] },
          'findOneAndUpdate',
        );
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question1_user',
        )) as Question;

        expect(result.views.length).toEqual(2);
        expect(result.views).toEqual(['question1_user', 'question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return question and not add the user to the list of views if already viewed by them', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question2_user',
        )) as Question;

        expect(result.views.length).toEqual(1);
        expect(result.views).toEqual(['question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return null if id does not exist', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question1_user',
        );

        expect(result).toBeNull();
      });

      test('fetchAndIncrementQuestionViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question2_user',
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a question');
      });
    });

    describe('saveQuestion', () => {
      test('saveQuestion should return the saved question', async () => {
        const mockQn = {
          title: 'New Question Title',
          text: 'New Question Text',
          tags: [tag1, tag2],
          askedBy: 'question3_user',
          askDateTime: new Date('2024-06-06'),
          answers: [],
          views: [],
          upVotes: [],
          downVotes: [],
          comments: [],
        };

        const result = (await saveQuestion(mockQn)) as Question;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockQn.title);
        expect(result.text).toEqual(mockQn.text);
        expect(result.tags[0]._id?.toString()).toEqual(tag1._id?.toString());
        expect(result.tags[1]._id?.toString()).toEqual(tag2._id?.toString());
        expect(result.askedBy).toEqual(mockQn.askedBy);
        expect(result.askDateTime).toEqual(mockQn.askDateTime);
        expect(result.views).toEqual([]);
        expect(result.answers.length).toEqual(0);
      });
    });

    describe('addVoteToQuestion', () => {
      test('addVoteToQuestion should upvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('If a downvoter upvotes, add them to upvotes and remove them from downvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('should cancel the upvote if already upvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Upvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding an upvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Error when adding upvote to question' });
      });

      test('addVoteToQuestion should downvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('If an upvoter downvotes, add them to downvotes and remove them from upvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('should cancel the downvote if already downvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Downvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding a downvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Error when adding downvote to question' });
      });
    });
  });

  describe('Answer model', () => {
    describe('saveAnswer', () => {
      test('saveAnswer should return the saved answer', async () => {
        const mockAnswer = {
          text: 'This is a test answer',
          ansBy: 'dummyUserId',
          ansDateTime: new Date('2024-06-06'),
          comments: [],
        };

        const result = (await saveAnswer(mockAnswer)) as Answer;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(mockAnswer.text);
        expect(result.ansBy).toEqual(mockAnswer.ansBy);
        expect(result.ansDateTime).toEqual(mockAnswer.ansDateTime);
      });
    });

    describe('addAnswerToQuestion', () => {
      test('addAnswerToQuestion should return the updated question', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        (question.answers as Answer[]).push(ans4);
        jest.spyOn(QuestionModel, 'findOneAndUpdate').mockResolvedValueOnce(question);

        const result = (await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1)) as Question;

        expect(result.answers.length).toEqual(4);
        expect(result.answers).toContain(ans4);
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should throw an error if a required field is missing in the answer', async () => {
        const invalidAnswer: Partial<Answer> = {
          text: 'This is an answer text',
          ansBy: 'user123', // Missing ansDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addAnswerToQuestion(qid, invalidAnswer as Answer);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid answer');
        }
      });
    });
  });

  describe('Tag model', () => {
    describe('addTag', () => {
      test('addTag return tag if the tag already exists', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result?._id).toEqual(tag1._id);
      });

      test('addTag return tag id of new tag if does not exist in database', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeDefined();
      });

      test('addTag returns null if findOne throws an error', async () => {
        mockingoose(Tags).toReturn(new Error('error'), 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result).toBeNull();
      });

      test('addTag returns null if save throws an error', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(new Error('error'), 'save');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeNull();
      });
    });

    describe('processTags', () => {
      test('processTags should return the tags of tag names in the collection', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(tag1._id);
        expect(result[1]._id).toEqual(tag1._id);
      });

      test('processTags should return a list of new tags ids if they do not exist in the collection', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
      });

      test('processTags should return empty list if an error is thrown when finding tags', async () => {
        mockingoose(Tags).toReturn(Error('Dummy error'), 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });

      test('processTags should return empty list if an error is thrown when saving tags', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(Error('Dummy error'), 'save');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });
    });

    describe('getTagCountMap', () => {
      test('getTagCountMap should return a map of tag names and their counts', async () => {
        mockingoose(Tags).toReturn([tag1, tag2, tag3], 'find');
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        QuestionModel.schema.path('tags', Object);

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.size).toEqual(3);
        expect(result.get('react')).toEqual(1);
        expect(result.get('javascript')).toEqual(2);
        expect(result.get('android')).toEqual(1);
      });

      test('getTagCountMap should return an object with error if an error is thrown', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return an object with error if an error is thrown when finding tags', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return null if Tags find returns null', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(null, 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });

      test('getTagCountMap should return default map if QuestionModel find returns null but not tag find', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');
        mockingoose(Tags).toReturn([tag1], 'find');

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.get('react')).toBe(0);
      });

      test('getTagCountMap should return null if find returns []', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        mockingoose(Tags).toReturn([], 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });
    });
  });

  describe('Comment model', () => {
    describe('saveComment', () => {
      test('saveComment should return the saved comment', async () => {
        const result = (await saveComment(com1)) as Comment;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(com1.text);
        expect(result.commentBy).toEqual(com1.commentBy);
        expect(result.commentDateTime).toEqual(com1.commentDateTime);
      });
    });

    describe('addComment', () => {
      test('addComment should return the updated question when given `question`', async () => {
        // copy the question to avoid modifying the original
        const question = { ...QUESTIONS[0], comments: [com1] };
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');

        const result = (await addComment(
          question._id?.toString() as string,
          'question',
          com1,
        )) as Question;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return the updated answer when given `answer`', async () => {
        // copy the answer to avoid modifying the original
        const answer: Answer = { ...ans1 };
        (answer.comments as Comment[]).push(com1);
        mockingoose(AnswerModel).toReturn(answer, 'findOneAndUpdate');

        const result = (await addComment(
          answer._id?.toString() as string,
          'answer',
          com1,
        )) as Answer;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return an object with error if findOneAndUpdate throws an error', async () => {
        const question = QUESTIONS[0];
        mockingoose(QuestionModel).toReturn(
          new Error('Error from findOneAndUpdate'),
          'findOneAndUpdate',
        );
        const result = await addComment(question._id?.toString() as string, 'question', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Error from findOneAndUpdate' });
      });

      test('addComment should return an object with error if findOneAndUpdate returns null', async () => {
        const answer: Answer = { ...ans1 };
        mockingoose(AnswerModel).toReturn(null, 'findOneAndUpdate');
        const result = await addComment(answer._id?.toString() as string, 'answer', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Failed to add comment' });
      });

      test('addComment should throw an error if a required field is missing in the comment', async () => {
        const invalidComment: Partial<Comment> = {
          text: 'This is an answer text',
          commentBy: 'user123', // Missing commentDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addComment(qid, 'question', invalidComment as Comment);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid comment');
        }
      });
    });
  });

  describe('User model', () => {
    describe('saveUser', () => {
      test('saveUser returns new user', async () => {
        const mockUser = {
          username: 'husky009',
          firstName: 'Joseph',
          lastName: 'Aoun',
          email: 'neuStudent@northeastern.edu',
          password: 'strongPassword',
          profileGraphic: 1,
          deleted: false,
          followers: [],
          following: [],
        };

        const result = (await saveUser(mockUser)) as User;

        expect(result._id).toBeDefined();
        expect(result.username).toEqual(mockUser.username);
        expect(result.firstName).toEqual(mockUser.firstName);
        expect(result.lastName).toEqual(mockUser.lastName);
        expect(result.email).toEqual(mockUser.email);
        expect(result.password).toEqual(mockUser.password);
        expect(result.profileGraphic).toEqual(mockUser.profileGraphic);
        expect(result.deleted).toEqual(mockUser.deleted);
        expect(result.followers).toEqual(mockUser.followers);
        expect(result.following).toEqual(mockUser.following);
      });

      test('saveUser should return an error when create throws an error', async () => {
        createUserSpy.mockRejectedValueOnce(new Error('error'));

        const result = await saveUser(user1);

        expect(result).toEqual({ error: 'Error when saving a user' });
      });
    });

    describe('hashPassword', () => {
      test('hash password encrypts the password', async () => {
        const password = 'password';
        const hashedPassword = (await hashPassword(password)) as string;

        expect(hashedPassword).not.toEqual(password);
      });
    });

    describe('comparePasswords', () => {
      test('comparePasswords successfully compares a password and its hashed version', async () => {
        const password = 'password';
        const hashedPassword = (await hashPassword(password)) as string;

        const result = await comparePasswords(password, hashedPassword);
        expect(result).toEqual(true);
      });

      test('comparePasswords successfully says two passwords are different', async () => {
        const password = 'password';

        const result = await comparePasswords(password, password);
        expect(result).toEqual(false);
      });
    });

    describe('isUsernameAvailable', () => {
      test('isUsernameAvailable returns false when username is not available', async () => {
        const mockUserFromDb = {
          _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
          username: 'husky101',
          email: 'neuStudent@northeastern.edu',
          password: 'strongPassword',
          deleted: false,
          followers: [],
          following: [],
        };
        mockingoose(UserModel).toReturn(mockUserFromDb, 'findOne');
        const username = 'husky101';
        const result = await isUsernameAvailable(username);

        expect(result).toBe(false);
      });

      test('isUsernameAvailable returns true when username is available', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');
        const username = 'husky101';
        const result = await isUsernameAvailable(username);

        expect(result).toBe(true);
      });

      test('isUsernameAvailable returns false when db error occurs', async () => {
        mockingoose(UserModel).toReturn(
          new Error('Error when finding user by username'),
          'findOne',
        );
        const username = 'husky101';
        const result = await isUsernameAvailable(username);

        expect(result).toBe(false);
      });
    });
    describe('fetchAllUsers', () => {
      test('fetchAllUsers should return all users', async () => {
        mockingoose(UserModel).toReturn([user1, user2, user3], 'find');

        const result = (await fetchAllUsers()) as User[];

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('45e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('46e9b58910afe6e94fc6e6dd');
        expect(result[2]._id?.toString()).toEqual('47e9b58910afe6e94fc6e6dd');
      });

      test('fetchAllUsers should return an object with error if find throws an error', async () => {
        mockingoose(UserModel).toReturn(new Error('error'), 'find');

        const result = await fetchAllUsers();

        expect(result).toEqual({ error: 'Error when fetching all users' });
      });
    });

    describe('fetchUserByUsername', () => {
      test('fetchUserByUsername returns user', async () => {
        const mockUser = {
          _id: new ObjectId('507f191e810c19729de860ea'),
          username: 'husky009',
          firstName: 'Husky',
          lastName: 'Dog',
          email: 'neuStudent@northeastern.edu',
          password: 'strongPassword',
          profileGraphic: 3,
          deleted: false,
          followers: [],
          following: [],
        };

        mockingoose(UserModel).toReturn(mockUser, 'findOne');

        const result = (await fetchUserByUsername('husky009')) as User;
        expect(result._id?.toString()).toEqual(mockUser._id.toString());
        expect(result.username).toEqual(mockUser.username);
        expect(result.firstName).toEqual(mockUser.firstName);
        expect(result.lastName).toEqual(mockUser.lastName);
        expect(result.email).toEqual(mockUser.email);
        expect(result.password).toEqual(mockUser.password);
        expect(result.profileGraphic).toEqual(mockUser.profileGraphic);
        expect(result.deleted).toEqual(mockUser.deleted);
        expect(result.followers).toEqual(mockUser.followers);
        expect(result.following).toEqual(mockUser.following);
      });

      test('fetchUserByUsername returns error if findOne errors', async () => {
        mockingoose(UserModel).toReturn(
          new Error(`Failed to fetch user with username djKhaledRules`),
          'findOne',
        );

        const result = (await fetchUserByUsername('djKhaledRules')) as User;
        expect(result).toEqual({
          error: `Error when fetching user: Failed to fetch user with username djKhaledRules`,
        });
      });

      test('fetchUserByUsername returns error if findOne returns null', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');

        const result = (await fetchUserByUsername('djKhaledRules')) as User;
        expect(result).toEqual({
          error: `Error when fetching user: Failed to fetch user with username djKhaledRules`,
        });
      });
    });

    describe('updateDeletedStatus', () => {
      test('update deleted status should return user with deleted field set to true', async () => {
        const mockUserFromDb = {
          _id: new ObjectId('507f191e810c19729de860ea'),
          username: 'husky009',
          firstName: 'Husky',
          lastName: 'Dog',
          email: 'neuStudent@northeastern.edu',
          password: 'strongPassword',
          profileGraphic: 3,
          deleted: false,
          followers: [],
          following: [],
        };

        mockingoose(UserModel).toReturn(
          {
            _id: mockUserFromDb._id.toString(),
            username: 'husky101',
            firstName: 'Husky',
            lastName: 'Dog',
            email: 'neuStudent@northeastern.edu',
            password: 'strongPassword',
            profileGraphic: 3,
            deleted: true,
            followers: [],
            following: [],
          },
          'findOneAndUpdate',
        );

        const result = (await updateDeletedStatus('someUserId')) as User;

        expect(result._id?.toString()).toBe(mockUserFromDb._id.toString());
        expect(result.username).toBe('husky101');
        expect(result.firstName).toBe('Husky');
        expect(result.lastName).toBe('Dog');
        expect(result.email).toBe('neuStudent@northeastern.edu');
        expect(result.password).toBe('strongPassword');
        expect(result.profileGraphic).toBe(3);
        expect(result.deleted).toBe(true);
        expect(result.followers).toEqual([]);
        expect(result.following).toEqual([]);
      });

      test('updateDeletedStatus should return an error when there is an issue with finding and updating', async () => {
        mockingoose(UserModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await updateDeletedStatus('someUserId');

        expect(result).toEqual({
          error: `Error when deleting user with username someUserId`,
        });
      });

      test('updateDeletedStatus should return an error if the deleted field is not true after db update', async () => {
        const mockUserFromDb = {
          _id: new ObjectId('507f191e810c19729de860ea'),
          username: 'husky009',
          firstName: 'Husky',
          lastName: 'Dog',
          email: 'neuStudent@northeastern.edu',
          password: 'strongPassword',
          profileGraphic: 3,
          deleted: false,
          followers: [],
          following: [],
        };
        mockingoose(UserModel).toReturn(mockUserFromDb, 'findOneAndUpdate');

        const result = await updateDeletedStatus('someUserId');

        expect(result).toEqual({ error: 'User not deleted!' });
      });

      test('updateDeletedStatus should return an error when the user is not found', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await updateDeletedStatus('someUserId');

        expect(result).toEqual({ error: 'User not found!' });
      });
    });

    describe('followAnotherUser', () => {
      beforeEach(() => {
        mockingoose.resetAll();
      });

      test('followAnotherUser throws error if there is no first user with the given id', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await followAnotherUser(
          '45e9b58910afe6e94fc6e6d1', // no user has this id
          '45e9b58910afe6e94fc6e6dc',
        );
        expect(result).toEqual({
          error: `User not found!`,
        });
      });

      test('followAnotherUser throws error if there is no second user with the given id', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await followAnotherUser(
          '45e9b58910afe6e94fc6e6dc',
          '45e9b58910afe6e94fc6e6d1', // no user has this id
        );
        expect(result).toEqual({
          error: `User not found!`,
        });
      });

      test('followAnotherUser follows user upon success', async () => {
        const mockUserFromDb = {
          _id: new ObjectId('65e9a5c2b26199dbcc3e6dc9'),
          username: 'lily',
          email: 'lily@example.com',
          password: 'password!',
          deleted: false,
          followers: [],
          following: [user1],
        };
        mockingoose(UserModel).toReturn(mockUserFromDb, 'findOneAndUpdate');

        const result = await followAnotherUser(
          '45e9b58910afe6e94fc6e6dc',
          mockUserFromDb._id.toString(),
        );
        expect((result as User[])[0]._id?.toString()).toBe(mockUserFromDb._id.toString());
        expect((result as User[])[0].following[0]._id?.toString()).toBe('45e9b58910afe6e94fc6e6dc');
      });
    });

    describe('unfollowAnotherUser', () => {
      beforeEach(() => {
        mockingoose.resetAll();
      });

      test('unfollowAnotherUser throws error if there is no first user with the given id', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await unfollowAnotherUser(
          '45e9b58910afe6e94fc6e6d1', // no user has this id
          '45e9b58910afe6e94fc6e6dc',
        );
        expect(result).toEqual({
          error: `User not found!`,
        });
      });

      test('unfollowAnotherUser throws error if there is no second user with the given id', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await unfollowAnotherUser(
          '45e9b58910afe6e94fc6e6dc',
          '45e9b58910afe6e94fc6e6d1', // no user has this id
        );
        expect(result).toEqual({
          error: `User not found!`,
        });
      });

      test('unfollowAnotherUser follows user upon success', async () => {
        const mockUserFromDb = {
          _id: new ObjectId('65e9a5c2b26199dbcc3e6dc9'),
          username: 'lily',
          firstName: 'Lily',
          lastName: 'Dean',
          email: 'lily@example.com',
          password: 'password!',
          profileGraphic: 4,
          deleted: false,
          followers: [],
          following: [],
        };
        mockingoose(UserModel).toReturn(mockUserFromDb, 'findOneAndUpdate');

        const result = await unfollowAnotherUser(
          '45e9b58910afe6e94fc6e6dc',
          mockUserFromDb._id.toString(),
        );
        expect((result as User[])[0]._id?.toString()).toBe(mockUserFromDb._id.toString());
        expect((result as User[])[0].following.length).toBe(0);
      });
    });

    describe('fetchUserById', () => {
      test('fetchUserById returns user', async () => {
        const mockUser = {
          _id: new ObjectId('507f191e810c19729de860ea'),
          username: 'husky009',
          firstName: 'Husky',
          lastName: 'Dog',
          email: 'neuStudent@northeastern.edu',
          password: 'strongPassword',
          profileGraphic: 3,
          deleted: false,
          followers: [],
          following: [],
        };

        mockingoose(UserModel).toReturn(mockUser, 'findOne');

        const result = (await fetchUserById('507f191e810c19729de860ea')) as User;
        expect(result._id?.toString()).toEqual(mockUser._id.toString());
        expect(result.username).toEqual(mockUser.username);
        expect(result.firstName).toEqual(mockUser.firstName);
        expect(result.lastName).toEqual(mockUser.lastName);
        expect(result.email).toEqual(mockUser.email);
        expect(result.password).toEqual(mockUser.password);
        expect(result.profileGraphic).toEqual(mockUser.profileGraphic);
        expect(result.deleted).toEqual(mockUser.deleted);
        expect(result.followers).toEqual(mockUser.followers);
        expect(result.following).toEqual(mockUser.following);
      });

      test('fetchUserById returns error if findOne errors', async () => {
        mockingoose(UserModel).toReturn(new Error(`error`), 'findOne');

        const result = (await fetchUserById('507f191e810c19729de860ea')) as User;
        expect(result).toEqual({
          error: `Error when fetching user: error`,
        });
      });

      test('fetchUserByUsername returns error if findOne returns null', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');

        const result = (await fetchUserById('507f191e810c19729de860ea')) as User;
        expect(result).toEqual({
          error: `Error when fetching user: Failed to fetch user with id 507f191e810c19729de860ea`,
        });
      });
    });

    describe('removeUserFromFollowerFollowingLists', () => {
      test('removeUserFromFollowerFollowingLists returns error if fetch fails', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');
        const result = await removeUserFromFollowerFollowingLists('random_username');
        expect(result).toEqual({
          success: false,
          error: `Error when user random_username was being removed from others' following and followers lists: Error: Error when fetching user: Failed to fetch user with username random_username`,
        });
      });

      test('removeUserFromFollowerFollowingLists returns error if updateMany isnt acknowledged', async () => {
        const mockUser = {
          _id: new ObjectId('507f191e810c19729de860ea'),
          username: 'husky009',
          firstName: 'Husky',
          lastName: 'Dog',
          email: 'neuStudent@northeastern.edu',
          password: 'strongPassword',
          profileGraphic: 3,
          deleted: false,
          followers: [],
          following: [],
        };
        mockingoose(UserModel).toReturn(mockUser, 'findOne');
        mockingoose(UserModel).toReturn(
          {
            acknowledged: false,
            modifiedCount: 2,
            matchedCount: 2,
          },
          'updateMany',
        );
        const result = await removeUserFromFollowerFollowingLists('random_username');
        expect(result).toEqual({
          success: false,
          error: `Error when user random_username was being removed from others' following and followers lists: Error: Update not acknowledged by server.`,
        });
      });

      test('removeUserFromFollowerFollowingLists returns success upon successful updateMany', async () => {
        const mockUser = {
          _id: new ObjectId('507f191e810c19729de860ea'),
          username: 'husky009',
          firstName: 'Husky',
          lastName: 'Dog',
          email: 'neuStudent@northeastern.edu',
          password: 'strongPassword',
          profileGraphic: 3,
          deleted: false,
          followers: [],
          following: [],
        };
        mockingoose(UserModel).toReturn(mockUser, 'findOne');
        mockingoose(UserModel).toReturn(
          {
            acknowledged: true,
            modifiedCount: 2,
            matchedCount: 2,
          },
          'updateMany',
        );
        const result = await removeUserFromFollowerFollowingLists('random_username');
        expect(result).toEqual({ success: true });
      });
    });
  });

  describe('Message module', () => {
    describe('saveMessage', () => {
      test('saveMessage should return the saved message', async () => {
        const result = (await saveMessage(message1)) as Message;

        expect(result._id).toBeDefined();
        expect(result.messageContent).toEqual(message1.messageContent);
        expect(result.sender._id?.toString()).toEqual(message1.sender._id?.toString());
        expect(result.sentAt).toEqual(message1.sentAt);
        expect(result.readBy.length).toEqual(1);
        expect(result.readBy[0]._id?.toString()).toEqual(message1.sender._id?.toString());
      });

      test('saveMessage should return an error when create throws an error', async () => {
        createMessageSpy.mockRejectedValueOnce(new Error('error'));

        const result = await saveMessage(message2);

        expect(result).toEqual({ error: 'Error when saving a message' });
      });
    });

    describe('addMessage', () => {
      test('addMessage should return the updated conversation', async () => {
        const conversation: Conversation = {
          ...conversation2,
          messages: [message1],
          users: [user1, user2],
          updatedAt: new Date(),
        };

        mockingoose(ConversationModel).toReturn(conversation, 'findOneAndUpdate');

        const result = (await addMessage(message1)) as Conversation;

        expect(result.messages.length).toEqual(1);
        expect(result.messages[0]._id?.toString()).toContain(message1._id?.toString());
      });

      test('addMessage should throw an error if the message content is missing in the message', async () => {
        const invalidMessage: Partial<Message> = {
          sender: user1,
          sentAt: new Date(),
          readBy: [user1],
          cid: CID1,
        };

        try {
          await addMessage(invalidMessage as Message);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid message');
        }
      });

      test('addMessage should throw an error if the sender is missing in the message', async () => {
        const invalidMessage: Partial<Message> = {
          messageContent: 'hey!',
          sentAt: new Date(),
          readBy: [user1],
          cid: CID1,
        };

        try {
          await addMessage(invalidMessage as Message);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid message');
        }
      });

      test('addMessage should throw an error if the sentAt is missing in the message', async () => {
        const invalidMessage: Partial<Message> = {
          messageContent: 'hey!',
          sender: user1,
          readBy: [user1],
          cid: CID1,
        };

        try {
          await addMessage(invalidMessage as Message);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid message');
        }
      });

      test('addMessage should throw an error if the cid is missing in the message', async () => {
        const invalidMessage: Partial<Message> = {
          messageContent: 'hey!',
          sentAt: new Date(),
          sender: user1,
          readBy: [user1],
        };

        try {
          await addMessage(invalidMessage as Message);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid message');
        }
      });

      test('addMessage should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(ConversationModel).toReturn(null, 'findOneAndUpdate');
        const result = await addMessage(message1);
        expect(result).toEqual({
          error:
            'Error when adding a message to conversation:  Error when adding message to conversation',
        });
      });

      test('addMessage should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(ConversationModel).toReturn(new Error('error'), 'findOneAndUpdate');
        const result = await addMessage(message1);
        expect(result).toEqual({ error: 'Error when adding a message to conversation:  error' });
      });
    });

    describe('saveAndAddMessage', () => {
      test('saveAndAddMessage should return the updated message', async () => {
        const conversation: Conversation = {
          ...conversation2,
          messages: [message1],
          users: [user1, user2],
          updatedAt: new Date(),
        };

        jest.spyOn(util, 'saveMessage').mockResolvedValueOnce(message1);

        jest.spyOn(util, 'addMessage').mockResolvedValueOnce(conversation);

        const result = await saveAndAddMessage(
          conversation,
          message1.sender,
          message1.messageContent,
        );

        expect(result._id).toBeDefined();
        expect(result.messageContent).toEqual(message1.messageContent);
        expect(result.sender._id?.toString()).toEqual(message1.sender._id?.toString());
        expect(result.sentAt).toEqual(message1.sentAt);
        expect(result.readBy.length).toEqual(1);
        expect(result.readBy[0]._id?.toString()).toEqual(message1.sender._id?.toString());
      });

      test('saveAndAddMessage should throw an error if saveMessage throws', async () => {
        const conversation: Conversation = {
          ...conversation2,
          messages: [message1],
          users: [user1, user2],
          updatedAt: new Date(),
        };

        jest.spyOn(util, 'saveMessage').mockResolvedValueOnce({ error: 'error' });

        await expect(
          saveAndAddMessage(conversation, message1.sender, message1.messageContent),
        ).rejects.toThrow('error');
      });

      test('saveAndAddMessage should throw an error if saveMessage throws', async () => {
        const conversation: Conversation = {
          ...conversation2,
          messages: [message1],
          users: [user1, user2],
          updatedAt: new Date(),
        };

        jest.spyOn(util, 'saveMessage').mockResolvedValueOnce(message1);

        // Mock `addMessage` to avoid it being called
        jest.spyOn(util, 'addMessage').mockResolvedValueOnce({ error: 'error' });

        await expect(
          saveAndAddMessage(conversation, message1.sender, message1.messageContent),
        ).rejects.toThrow('error');
      });
    });

    describe('markMessageAsRead', () => {
      test('markMessageAsRead should return the updated message', async () => {
        mockingoose(MessageModel).toReturn(message1, 'findOneAndUpdate');

        const result = (await markMessageAsRead(message1._id?.toString(), user1)) as Message;

        expect(result._id?.toString()).toEqual(message1._id?.toString());
      });

      test('markMessageAsRead should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(MessageModel).toReturn(null, 'findOneAndUpdate');

        const result = await markMessageAsRead(message1._id?.toString(), user1);

        expect(result).toEqual({ error: 'Error when marking message as read: No message found' });
      });

      test('markMessageAsRead should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(MessageModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = await markMessageAsRead(message1._id?.toString(), user1);

        expect(result).toEqual({ error: 'Error when marking message as read: error' });
      });
    });
  });

  describe('Conversation model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });
    describe('saveConversation', () => {
      test('saveConversation returns new conversation', async () => {
        const mockConversation = {
          users: [user1, user2],
          messages: [],
          updatedAt: new Date(),
        };

        const result = (await saveConversation(mockConversation)) as Conversation;

        expect(result._id).toBeDefined();
        expect(result.users.length).toEqual(2);
        expect(result.users[0]).toEqual(user1._id);
        expect(result.users[1]).toEqual(user2._id);
      });

      test('saveConversation should return an error when create throws an error', async () => {
        const mockConversation = {
          users: [user1, user2],
          messages: [],
          updatedAt: new Date(),
        };

        createConversationSpy.mockRejectedValueOnce(new Error('error'));

        const result = await saveConversation(mockConversation);

        expect(result).toEqual({ error: 'Error when saving a conversation' });
      });
    });

    describe('areUsersRegistered', () => {
      test('areUsersRegistered returns false if user is not found', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');

        const result = await areUsersRegistered([user1]);

        expect(result).toEqual(false);
      });

      test('areUsersRegistered returns false if error during fetchUserByUsername', async () => {
        mockingoose(UserModel).toReturn(new Error('Error during findOne'), 'findOne');

        const result = await areUsersRegistered([user1]);

        expect(result).toEqual(false);
      });

      test('areUsersRegistered returns true for proper user', async () => {
        const mockUserFromDb = {
          _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
          username: 'husky101',
          email: 'neuStudent@northeastern.edu',
          password: 'strongPassword',
          deleted: false,
          followers: [],
          following: [],
        };
        mockingoose(UserModel).toReturn(mockUserFromDb, 'findOne');

        const result = await areUsersRegistered([]);

        expect(result).toEqual(true);
      });
    });

    describe('fetchConvosByParticipants', () => {
      test('fetchConvosByParticipants returns empty list if convo not found', async () => {
        mockingoose(ConversationModel).toReturn([], 'find');

        const result = (await fetchConvosByParticipants([], true)) as Conversation[];
        expect(result.length).toBe(0);
      });

      test('fetchConvosByParticipants can return multiple convos', async () => {
        const mockConversation = {
          users: [user1, user2],
          messages: [],
          updatedAt: new Date(),
        };
        mockingoose(ConversationModel).toReturn([mockConversation, mockConversation], 'find');

        const result = (await fetchConvosByParticipants([], true)) as Conversation[];
        expect(result.length).toBe(2);
      });

      test('fetchConvosByParticipants returns convo if convo found', async () => {
        const dateVar = new Date('October 1, 2024');
        const mockConversation = {
          users: [user1, user2],
          messages: [],
          updatedAt: dateVar,
        };
        mockingoose(ConversationModel).toReturn([mockConversation], 'find');

        const result = (await fetchConvosByParticipants([], true)) as Conversation[];
        expect(result[0]._id).toBeDefined();
        expect(result[0].messages.length).toEqual(0);
        expect(result[0].updatedAt).toEqual(dateVar);
        expect(result[0].users[0]).toEqual(user1._id);
        expect(result[0].users[1]).toEqual(user2._id);
      });

      test('fetchConvosByParticipants returns error message if error occurs', async () => {
        mockingoose(ConversationModel).toReturn(new Error('Error thrown'), 'find');

        const result = (await fetchConvosByParticipants([], true)) as Conversation[];
        expect(result).toEqual({ error: 'Error when fetching the conversations' });
      });

      test('fetchConvosByParticipants returns every convo containing given user', async () => {
        const dateVar = new Date('October 1, 2024');
        const mockConversation = {
          users: [user1, user2],
          messages: [],
          updatedAt: dateVar,
        };
        const mockConversation2 = {
          users: [user1, user3],
          messages: [],
          updatedAt: dateVar,
        };
        mockingoose(ConversationModel).toReturn([mockConversation, mockConversation2], 'find');

        const result = (await fetchConvosByParticipants([user1], false)) as Conversation[];
        expect(result.length).toEqual(2);
        expect(result[0].messages.length).toEqual(0);
        expect(result[0].updatedAt).toEqual(dateVar);
        expect(result[0].users[0]).toEqual(user1._id);
        expect(result[0].users[1]).toEqual(user2._id);
        expect(result[1].messages.length).toEqual(0);
        expect(result[1].updatedAt).toEqual(dateVar);
        expect(result[1].users[0]).toEqual(user1._id);
        expect(result[1].users[1]).toEqual(user3._id);
      });
    });

    describe('doesConversationExist', () => {
      beforeEach(() => {
        mockingoose.resetAll();
      });
      test('doesConversationExist returns false if fetch convos returns empty list', async () => {
        mockingoose(ConversationModel).toReturn([], 'find');

        const result = await doesConversationExist([]);
        expect(result).toBe(false);
      });

      test('doesConversationExist returns error if fetch convos list with more than one convo', async () => {
        const mockConvo1 = {
          _id: new ObjectId(),
          users: [user1._id, user2._id],
          messages: [],
          updatedAt: new Date(),
        };
        const mockConvo2 = {
          _id: new ObjectId(),
          users: [user2._id, user1._id],
          messages: [],
          updatedAt: new Date(),
        };
        mockingoose(ConversationModel).toReturn([mockConvo1, mockConvo2], 'find');
        await expect(doesConversationExist([user1, user2])).rejects.toThrow(
          'Duplicate conversations exist in the database',
        );
      });

      test('doesConversationExist returns error if fetch convos returns error', async () => {
        mockingoose(ConversationModel).toReturn(new Error('Error thrown'), 'find');

        await expect(doesConversationExist([])).rejects.toThrow(
          'Error occurred fetching conversation',
        );
      });

      test('doesConversationExist returns true upon successful fetch', async () => {
        const mockConversation = {
          users: [user1, user2],
          messages: [],
          updatedAt: new Date(),
        };
        mockingoose(ConversationModel).toReturn([mockConversation], 'find');

        const result = await doesConversationExist([]);
        expect(result).toBe(true);
      });
    });

    describe('fetchConversationById', () => {
      beforeEach(() => {
        mockingoose.resetAll();
      });

      test('fetchConversationById should return a conversation from the db with the given id if one exists', async () => {
        mockingoose(ConversationModel).toReturn(conversation1, 'findOne');
        ConversationModel.schema.path('users', Object);
        ConversationModel.schema.path('messages', Object);

        const result = (await fetchConversationById('55e9b58910afe6e94fc6e6aa')) as Conversation;

        expect(result._id?.toString()).toEqual('55e9b58910afe6e94fc6e6aa');
        expect(result.users.length).toEqual(2);
        expect(result.users[0]).toEqual(user1);
        expect(result.users[1]).toEqual(user2);
        expect(result.messages.length).toEqual(1);
        expect(result.messages[0]).toEqual(message1);
      });

      test('fetchConversationById should return an error when no conversation is found', async () => {
        mockingoose(ConversationModel).toReturn(null, 'findOne');

        const result = await fetchConversationById('55e9b58910afe6e94fc6e6aa');

        expect(result).toEqual({
          error:
            'Error when fetching conversation: Failed to fetch converation with id 55e9b58910afe6e94fc6e6aa',
        });
      });

      test('fetchConversationById should return an error when findOne throws an error', async () => {
        mockingoose(ConversationModel).toReturn(new Error('error'), 'findOne');

        const result = await fetchConversationById('55e9b58910afe6e94fc6e6aa');

        expect(result).toEqual({ error: 'Error when fetching conversation: error' });
      });

      test('fetchConversationById returns error if cid does not exist', async () => {
        mockingoose(ConversationModel).toReturn(null, 'findOne');

        const result = await fetchConversationById('dummyCid');
        expect(result).toEqual({
          error:
            'Error when fetching conversation: input must be a 24 character hex string, 12 byte Uint8Array, or an integer',
        });
      });

      test('fetchConversationById returns error if there is a DB error', async () => {
        const mockConversation = {
          _id: new ObjectId('65e9a5c2b26199dbcc3e6dc7'),
          users: [user1, user2],
          messages: [],
          updatedAt: new Date(),
        };

        mockingoose(ConversationModel).toReturn(new Error('DB error'), 'findOne');

        const result = await fetchConversationById(mockConversation._id.toString());
        expect(result).toEqual({ error: 'Error when fetching conversation: DB error' });
      });

      test('fetchConversationById returns error if id is not a valid objectId string', async () => {
        const mockConversation = {
          _id: 'mockId',
          users: [user1, user2],
          messages: [],
          updatedAt: new Date(),
        };

        mockingoose(ConversationModel).toReturn(mockConversation, 'findOne');

        const result = await fetchConversationById(mockConversation._id);
        expect(result).toEqual({
          error:
            'Error when fetching conversation: input must be a 24 character hex string, 12 byte Uint8Array, or an integer',
        });
      });

      test('fetchConversationById returns conversation with given cid', async () => {
        const mockConversation = {
          _id: new ObjectId('65e9a5c2b26199dbcc3e6dc7'),
          users: [user1, user2],
          messages: [],
          updatedAt: new Date(),
        };

        mockingoose(ConversationModel).toReturn(mockConversation, 'findOne');
        const result = await fetchConversationById(mockConversation._id.toString());
        expect((result as Conversation)._id?.toString()).toEqual(mockConversation._id.toString());
      });
    });

    describe('createOrFetchConversation', () => {
      test('createOrFetchConversation returns convo when it exists', async () => {
        const mockConversation = {
          _id: new ObjectId('6733979815f91991dab851bd'),
          users: [user1, user2],
          messages: [],
          updatedAt: new Date('October 1, 2024'),
        };
        mockingoose(ConversationModel).toReturn([mockConversation], 'find');

        const convo = (await createOrFetchConversation(user1, user2)) as Conversation;
        expect(convo).toBeDefined();
        expect(convo._id).toEqual(mockConversation._id);
        expect(convo.users).toEqual(mockConversation.users);
        expect(convo.messages).toEqual(mockConversation.messages);
        expect(convo.updatedAt).toEqual(mockConversation.updatedAt);
      });

      test('createOrFetchConversation creates new convo when it doesnt exist', async () => {
        mockingoose(ConversationModel).toReturn([], 'find');
        const mockConversation: Conversation = {
          _id: new ObjectId('6734a800f4078fe67cc1d2df'),
          users: [user1, user2],
          messages: [],
          updatedAt: new Date('October 1, 2024'),
        };
        mockingoose(ConversationModel).toReturn(mockConversation, 'create');

        const convo = (await createOrFetchConversation(user1, user2)) as Conversation;
        expect(convo).toBeDefined();
        expect(convo._id).toBeDefined();
        expect(convo._id).toBeInstanceOf(ObjectId);
        expect(convo.users).toEqual(mockConversation.users);
        expect(convo.messages).toEqual(mockConversation.messages);
        expect(convo.updatedAt).toBeInstanceOf(Date);
      });

      test('createOrFetchConversation throws error when fetchConvoByParticipants throws', async () => {
        mockingoose(ConversationModel).toReturn(new Error('error'), 'find');

        await expect(createOrFetchConversation(user1, user2)).rejects.toThrow(
          'Error when fetching the conversations',
        );
      });

      test('createOrFetchConversation throws when more than one convo was found', async () => {
        mockingoose(ConversationModel).toReturn([], 'find');
        const mockConversation: Conversation = {
          _id: new ObjectId('6734a800f4078fe67cc1d2df'),
          users: [user1, user2],
          messages: [],
          updatedAt: new Date('October 1, 2024'),
        };
        mockingoose(ConversationModel).toReturn([mockConversation, mockConversation], 'find');

        await expect(createOrFetchConversation(user1, user2)).rejects.toThrow(
          'More than one conversation returned',
        );
      });

      test('createOrFetchConversation throws an error when saveConversation fails', async () => {
        mockingoose(ConversationModel).toReturn([], 'find');

        createConversationSpy.mockRejectedValueOnce(new Error('error'));

        await expect(createOrFetchConversation(user1, user2)).rejects.toThrow(
          'Error when saving a conversation',
        );
      });
    });
  });

  describe('Notification model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
      jest.clearAllMocks();
    });
    describe('deleteNotificationById', () => {
      test('deleteNotificationById deletes a notification with the given id and returns true', async () => {
        const mockMessage = {
          _id: new ObjectId(),
          messageContent: 'Hello',
          sender: user1,
          sentAt: new Date('2024-11-03'),
          readBy: [user1],
          cid: new ObjectId(),
        };
        const mockNotification = {
          _id: new ObjectId(),
          user: user3.username,
          message: mockMessage,
        };
        mockingoose(NotificationModel).toReturn(
          { acknowledged: true, deletedCount: 1 },
          'deleteOne',
        );

        const result = await deleteNotificationById(mockNotification._id.toString());

        expect(result).toEqual(true);
      });
      test('deleteNotificationById returns false if ack is false', async () => {
        const mockMessage = {
          _id: new ObjectId(),
          messageContent: 'Hello',
          sender: user1,
          sentAt: new Date('2024-11-03'),
          readBy: [user1],
          cid: new ObjectId(),
        };
        const mockNotification = {
          _id: new ObjectId(),
          user: user3.username,
          message: mockMessage,
        };
        mockingoose(NotificationModel).toReturn(
          { acknowledged: false, deletedCount: 0 },
          'deleteOne',
        );

        const result = await deleteNotificationById(mockNotification._id.toString());

        expect(result).toEqual(false);
      });
      test('deleteNotificationById returns false if deleted count is 0', async () => {
        const mockMessage = {
          _id: new ObjectId(),
          messageContent: 'Hello',
          sender: user1,
          sentAt: new Date('2024-11-03'),
          readBy: [user1],
          cid: new ObjectId(),
        };
        const mockNotification = {
          _id: new ObjectId(),
          user: user3.username,
          message: mockMessage,
        };
        mockingoose(NotificationModel).toReturn(
          { acknowledged: true, deletedCount: 0 },
          'deleteOne',
        );

        const result = await deleteNotificationById(mockNotification._id.toString());

        expect(result).toEqual(false);
      });
      test('deleteNotificationById returns false if there is a db error', async () => {
        const mockMessage = {
          _id: new ObjectId(),
          messageContent: 'Hello',
          sender: user1,
          sentAt: new Date('2024-11-03'),
          readBy: [user1],
          cid: new ObjectId(),
        };
        const mockNotification = {
          _id: new ObjectId(),
          user: user3.username,
          message: mockMessage,
        };
        mockingoose(NotificationModel).toReturn(new Error('db error'));

        const result = await deleteNotificationById(mockNotification._id.toString());

        expect(result).toEqual(false);
      });
    });

    describe('saveNotification', () => {
      test('saveNotification saves notification', async () => {
        const mockNotification = {
          user: user1.username,
          message: message1,
        };
        const result = (await saveNotification(mockNotification)) as Notification;

        expect(result._id).toBeDefined();
        expect(result.user).toEqual(mockNotification.user);
        expect(result.message._id?.toString()).toEqual(message1._id?.toString());
      });

      test('saveNotification returns error if there is a db error', async () => {
        const mockMessage = {
          _id: new ObjectId(),
          messageContent: 'Hello',
          sender: user1,
          sentAt: new Date('2024-11-03'),
          readBy: [user1],
          cid: new ObjectId().toString(),
        };
        const mockNotification = {
          _id: new ObjectId(),
          user: user3.username,
          message: mockMessage,
        };
        createNotificationSpy.mockRejectedValueOnce(new Error('error'));

        const result = await saveNotification(mockNotification);

        expect(result).toEqual({ error: 'Error when saving a notification' });
      });
    });

    describe('fetchNotifsByUsername', () => {
      test('fetchNotifsByUsername returns a list of Notifications', async () => {
        mockingoose(NotificationModel).toReturn([notification1, notification2], 'find');

        const result = (await fetchNotifsByUsername(user3.username)) as Notification[];

        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(notification1._id);
        expect(result[1]._id).toEqual(notification2._id);
      });

      test('fetchNotifsByUsername returns error response if error during find', async () => {
        mockingoose(NotificationModel).toReturn(new Error('Error during find'), 'find');

        const result = await fetchNotifsByUsername('user1');

        expect(result).toEqual({ error: 'Error when fetching the notifications' });
      });
    });

    describe('sendEmail', () => {
      beforeEach(() => {
        jest.resetModules();
        process.env.SENDGRID_API_KEY = 'mock-sendgrid-api-key';
      });
      test('sendEmail returns success payload upon success', async () => {
        jest
          .spyOn(sgMail, 'send')
          .mockResolvedValueOnce([{ statusCode: 200, body: {}, headers: {} }, {}]);
        const result = await sendEmail('test@email.com', user1.username, user1.profileGraphic);
        expect(result).toEqual({ success: true, message: 'Email sent successfully!' });
        expect(sgMail.send).toHaveBeenCalledWith(
          expect.objectContaining({
            to: 'test@email.com',
            from: 'code_connect_neu@outlook.com',
            subject: 'New CodeConnect Message from user1!',
          }),
        );
      });

      test('sendEmail returns failure payload upon success', async () => {
        jest.spyOn(sgMail, 'send').mockRejectedValueOnce(new Error('SendGrid API error'));

        const result = await sendEmail('test@email.com', user1.username, user1.profileGraphic);
        expect(result).toEqual({
          success: false,
          message: 'Failed to send email: SendGrid API error',
        });
        expect(sgMail.send).toHaveBeenCalledWith(
          expect.objectContaining({
            to: 'test@email.com',
            from: 'code_connect_neu@outlook.com',
            subject: 'New CodeConnect Message from user1!',
          }),
        );
      });
    });
  });
});
