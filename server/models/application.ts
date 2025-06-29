import { ObjectId } from 'mongodb';
import { QueryOptions } from 'mongoose';
import sgMail from '@sendgrid/mail';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import {
  Answer,
  AnswerResponse,
  Comment,
  CommentResponse,
  OrderType,
  Question,
  QuestionResponse,
  Tag,
  UserResponse,
  User,
  MultipleUserResponse,
  ConversationResponse,
  MultipleConversationResponse,
  Conversation,
  Message,
  MessageResponse,
  NotificationResponse,
  Notification,
  MultipleNotificationResponse,
  RemoveUserResponse,
  SendEmailPayload,
  Top,
  TopResponse,
  Bottom,
  BottomResponse,
  Outerwear,
  OuterwearResponse,
  Accessory,
  AccessoryResponse,
  ShoeResponse,
  Shoe,
  Workout,
  WorkoutResponse,
  OutfitResponse,
  Rating,
  RatingResponse,
  Outfit,
  AllOutfitItemsResponse,
  AllOutfitItemsObject,
  MultipleTopResponse,
  MultipleBottomResponse,
  MultipleAccessoryResponse,
  MultipleOuterwearItemResponse,
  MultipleShoeResponse,
  MultipleWorkoutsResponse,
  MultipleOutfitResponse,
  OutfitData,
  ForwardGeocodePayload,
  WeatherDay,
  UploadImageResponse,
  OutfitItem,
} from '../types';
import AnswerModel from './answers';
import QuestionModel from './questions';
import TagModel from './tags';
import CommentModel from './comments';
import UserModel from './users';
import ConversationModel from './conversations';
import MessageModel from './messages';
import NotificationModel from './notifications';
import TopModel from './tops';
import BottomModel from './bottoms';
import OuterwearModel from './outerwears';
import AccessoryModel from './accessories';
import ShoeModel from './shoes';
import WorkoutModel from './workouts';
import OutfitModel from './outfits';
import RatingModel from './ratings';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

let currentUser: User | null = null;

/**
 * Parses tags from a search string.
 *
 * @param {string} search - Search string containing tags in square brackets (e.g., "[tag1][tag2]")
 *
 * @returns {string[]} - An array of tags found in the search string
 */
const parseTags = (search: string): string[] =>
  (search.match(/\[([^\]]+)\]/g) || []).map(word => word.slice(1, -1));

/**
 * Parses keywords from a search string by removing tags and extracting individual words.
 *
 * @param {string} search - The search string containing keywords and possibly tags
 *
 * @returns {string[]} - An array of keywords found in the search string
 */
const parseKeyword = (search: string): string[] =>
  search.replace(/\[([^\]]+)\]/g, ' ').match(/\b\w+\b/g) || [];

/**
 * Checks if given question contains any tags from the given list.
 *
 * @param {Question} q - The question to check
 * @param {string[]} taglist - The list of tags to check for
 *
 * @returns {boolean} - `true` if any tag is present in the question, `false` otherwise
 */
const checkTagInQuestion = (q: Question, taglist: string[]): boolean => {
  for (const tagname of taglist) {
    for (const tag of q.tags) {
      if (tagname === tag.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks if any keywords in the provided list exist in a given question's title or text.
 *
 * @param {Question} q - The question to check
 * @param {string[]} keywordlist - The list of keywords to check for
 *
 * @returns {boolean} - `true` if any keyword is present, `false` otherwise.
 */
const checkKeywordInQuestion = (q: Question, keywordlist: string[]): boolean => {
  for (const w of keywordlist) {
    if (q.title.includes(w) || q.text.includes(w)) {
      return true;
    }
  }

  return false;
};

/**
 * Gets the newest questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to sort
 *
 * @returns {Question[]} - The sorted list of questions
 */
const sortQuestionsByNewest = (qlist: Question[]): Question[] =>
  qlist.sort((a, b) => {
    if (a.askDateTime > b.askDateTime) {
      return -1;
    }

    if (a.askDateTime < b.askDateTime) {
      return 1;
    }

    return 0;
  });

/**
 * Gets unanswered questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of unanswered questions
 */
const sortQuestionsByUnanswered = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).filter(q => q.answers.length === 0);

/**
 * Records the most recent answer time for a question.
 *
 * @param {Question} question - The question to check
 * @param {Map<string, Date>} mp - A map of the most recent answer time for each question
 */
const getMostRecentAnswerTime = (question: Question, mp: Map<string, Date>): void => {
  // This is a private function and we can assume that the answers field is not undefined or an array of ObjectId
  const answers = question.answers as Answer[];
  answers.forEach((answer: Answer) => {
    if (question._id !== undefined) {
      const currentMostRecent = mp.get(question?._id.toString());
      if (!currentMostRecent || currentMostRecent < answer.ansDateTime) {
        mp.set(question._id.toString(), answer.ansDateTime);
      }
    }
  });
};

/**
 * Gets active questions from a list, sorted by the most recent answer date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of active questions
 */
const sortQuestionsByActive = (qlist: Question[]): Question[] => {
  const mp = new Map();
  qlist.forEach(q => {
    getMostRecentAnswerTime(q, mp);
  });

  return sortQuestionsByNewest(qlist).sort((a, b) => {
    const adate = mp.get(a._id?.toString());
    const bdate = mp.get(b._id?.toString());
    if (!adate) {
      return 1;
    }
    if (!bdate) {
      return -1;
    }
    if (adate > bdate) {
      return -1;
    }
    if (adate < bdate) {
      return 1;
    }
    return 0;
  });
};

/**
 * Sorts a list of questions by the number of views in descending order. First, the questions are
 * sorted by creation date (newest first), then by number of views, from highest to lowest.
 * If questions have the same number of views, the newer question will be before the older question.
 *
 * @param qlist The array of Question objects to be sorted.
 *
 * @returns A new array of Question objects sorted by the number of views.
 */
const sortQuestionsByMostViews = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).sort((a, b) => b.views.length - a.views.length);

/**
 * Adds a tag to the database if it does not already exist.
 *
 * @param {Tag} tag - The tag to add
 *
 * @returns {Promise<Tag | null>} - The added or existing tag, or `null` if an error occurred
 */
export const addTag = async (tag: Tag): Promise<Tag | null> => {
  try {
    // Check if a tag with the given name already exists
    const existingTag = await TagModel.findOne({ name: tag.name });

    if (existingTag) {
      return existingTag as Tag;
    }

    // If the tag does not exist, create a new one
    const newTag = new TagModel(tag);
    const savedTag = await newTag.save();

    return savedTag as Tag;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves questions from the database, ordered by the specified criteria.
 *
 * @param {OrderType} order - The order type to filter the questions
 *
 * @returns {Promise<Question[]>} - Promise that resolves to a list of ordered questions
 */
export const getQuestionsByOrder = async (order: OrderType): Promise<Question[]> => {
  try {
    let qlist = [];
    if (order === 'active') {
      qlist = await QuestionModel.find().populate([
        { path: 'tags', model: TagModel },
        { path: 'answers', model: AnswerModel },
      ]);
      return sortQuestionsByActive(qlist);
    }
    qlist = await QuestionModel.find().populate([{ path: 'tags', model: TagModel }]);
    if (order === 'unanswered') {
      return sortQuestionsByUnanswered(qlist);
    }
    if (order === 'newest') {
      return sortQuestionsByNewest(qlist);
    }
    return sortQuestionsByMostViews(qlist);
  } catch (error) {
    return [];
  }
};

/**
 * Filters a list of questions by the user who asked them.
 *
 * @param qlist The array of Question objects to be filtered.
 * @param askedBy The username of the user who asked the questions.
 *
 * @returns Filtered Question objects.
 */
export const filterQuestionsByAskedBy = (qlist: Question[], askedBy: string): Question[] =>
  qlist.filter(q => q.askedBy === askedBy);

/**
 * Filters questions based on a search string containing tags and/or keywords.
 *
 * @param {Question[]} qlist - The list of questions to filter
 * @param {string} search - The search string containing tags and/or keywords
 *
 * @returns {Question[]} - The filtered list of questions matching the search criteria
 */
export const filterQuestionsBySearch = (qlist: Question[], search: string): Question[] => {
  const searchTags = parseTags(search);
  const searchKeyword = parseKeyword(search);

  if (!qlist || qlist.length === 0) {
    return [];
  }
  return qlist.filter((q: Question) => {
    if (searchKeyword.length === 0 && searchTags.length === 0) {
      return true;
    }

    if (searchKeyword.length === 0) {
      return checkTagInQuestion(q, searchTags);
    }

    if (searchTags.length === 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    }

    return checkKeywordInQuestion(q, searchKeyword) || checkTagInQuestion(q, searchTags);
  });
};

/**
 * Fetches and populates a question or answer document based on the provided ID and type.
 *
 * @param {string | undefined} id - The ID of the question or answer to fetch.
 * @param {'question' | 'answer'} type - Specifies whether to fetch a question or an answer.
 *
 * @returns {Promise<QuestionResponse | AnswerResponse>} - Promise that resolves to the
 *          populated question or answer, or an error message if the operation fails
 */
export const populateDocument = async (
  id: string | undefined,
  type: 'question' | 'answer',
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!id) {
      throw new Error('Provided question ID is undefined.');
    }

    let result = null;

    if (type === 'question') {
      result = await QuestionModel.findOne({ _id: id }).populate([
        {
          path: 'tags',
          model: TagModel,
        },
        {
          path: 'answers',
          model: AnswerModel,
          populate: { path: 'comments', model: CommentModel },
        },
        { path: 'comments', model: CommentModel },
      ]);
    } else if (type === 'answer') {
      result = await AnswerModel.findOne({ _id: id }).populate([
        { path: 'comments', model: CommentModel },
      ]);
    }
    if (!result) {
      throw new Error(`Failed to fetch and populate a ${type}`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};

/**
 * Fetches a question by its ID and increments its view count.
 *
 * @param {string} qid - The ID of the question to fetch.
 * @param {string} username - The username of the user requesting the question.
 *
 * @returns {Promise<QuestionResponse | null>} - Promise that resolves to the fetched question
 *          with incremented views, null if the question is not found, or an error message.
 */
export const fetchAndIncrementQuestionViewsById = async (
  qid: string,
  username: string,
): Promise<QuestionResponse | null> => {
  try {
    const q = await QuestionModel.findOneAndUpdate(
      { _id: new ObjectId(qid) },
      { $addToSet: { views: username } },
      { new: true },
    ).populate([
      {
        path: 'tags',
        model: TagModel,
      },
      {
        path: 'answers',
        model: AnswerModel,
        populate: { path: 'comments', model: CommentModel },
      },
      { path: 'comments', model: CommentModel },
    ]);
    return q;
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Saves a new question to the database.
 *
 * @param {Question} question - The question to save
 *
 * @returns {Promise<QuestionResponse>} - The saved question, or error message
 */
export const saveQuestion = async (question: Question): Promise<QuestionResponse> => {
  try {
    const result = await QuestionModel.create(question);
    return result;
  } catch (error) {
    return { error: 'Error when saving a question' };
  }
};

/**
 * Saves a new answer to the database.
 *
 * @param {Answer} answer - The answer to save
 *
 * @returns {Promise<AnswerResponse>} - The saved answer, or an error message if the save failed
 */
export const saveAnswer = async (answer: Answer): Promise<AnswerResponse> => {
  try {
    const result = await AnswerModel.create(answer);
    return result;
  } catch (error) {
    return { error: 'Error when saving an answer' };
  }
};

/**
 * Saves a new comment to the database.
 *
 * @param {Comment} comment - The comment to save
 *
 * @returns {Promise<CommentResponse>} - The saved comment, or an error message if the save failed
 */
export const saveComment = async (comment: Comment): Promise<CommentResponse> => {
  try {
    const result = await CommentModel.create(comment);
    return result;
  } catch (error) {
    return { error: 'Error when saving a comment' };
  }
};

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user to save
 *
 * @returns {Promise<UserResponse>} - The saved user, or an error message if the save failed
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    const result = await UserModel.create(user);
    return result;
  } catch (error) {
    return { error: 'Error when saving a user' };
  }
};

/**
 * Saves a new conversation to the database.
 *
 * @param {Conversation} conversation - The conversation to save
 *
 * @returns {Promise<ConversationResponse>} - The saved conversation, or an error message if the save failed
 */
export const saveConversation = async (
  conversation: Conversation,
): Promise<ConversationResponse> => {
  try {
    const result = await ConversationModel.create(conversation);
    return result;
  } catch (error) {
    return { error: 'Error when saving a conversation' };
  }
};

/**
 * Saves a new message to the database.
 *
 * @param {Message} message - The message to save
 *
 * @returns {Promise<MessageResponse>} - The saved message, or an error message if the save failed
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> => {
  try {
    const result = await MessageModel.create(message);
    return result;
  } catch (error) {
    return { error: 'Error when saving a message' };
  }
};

/**
 * Checks if there already exists a user with the provided username.
 *
 * @param username The username to check.
 * @returns true if the username is available, false otherwise. Considers the username unavailable
 * if an error occurs.
 */
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  try {
    const user = await UserModel.findOne({ username });
    return !user;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error checking username availability:', error);
    return false;
  }
};

/**
 * Hashes the provided password for secure storage in db.
 *
 * @param password The password to hash.
 * @returns
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compares a given password string with a hashed password string, returning true if they are the same.
 *
 * @param password The non-hashed password.
 * @param hashedPassword The hashed password.
 * @returns boolean indicating if the passwords represent the same string.
 */
export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => bcrypt.compare(password, hashedPassword);

/**
 * Processes a list of tags by removing duplicates, checking for existing tags in the database,
 * and adding non-existing tags. Returns an array of the existing or newly added tags.
 * If an error occurs during the process, it is logged, and an empty array is returned.
 *
 * @param tags The array of Tag objects to be processed.
 *
 * @returns A Promise that resolves to an array of Tag objects.
 */
export const processTags = async (tags: Tag[]): Promise<Tag[]> => {
  try {
    // Extract unique tag names from the provided tags array using a Set to eliminate duplicates
    const uniqueTagNamesSet = new Set(tags.map(tag => tag.name));

    // Create an array of unique Tag objects by matching tag names
    const uniqueTags = [...uniqueTagNamesSet].map(
      name => tags.find(tag => tag.name === name)!, // The '!' ensures the Tag is found, assuming no undefined values
    );

    // Use Promise.all to asynchronously process each unique tag.
    const processedTags = await Promise.all(
      uniqueTags.map(async tag => {
        const existingTag = await TagModel.findOne({ name: tag.name });

        if (existingTag) {
          return existingTag; // If tag exists, return it as part of the processed tags
        }

        const addedTag = await addTag(tag);
        if (addedTag) {
          return addedTag; // If the tag does not exist, attempt to add it to the database
        }

        // Throwing an error if addTag fails
        throw new Error(`Error while adding tag: ${tag.name}`);
      }),
    );

    return processedTags;
  } catch (error: unknown) {
    // Log the error for debugging purposes
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.log('An error occurred while adding tags:', errorMessage);
    return [];
  }
};

/**
 * Adds a vote to a question.
 *
 * @param qid The ID of the question to add a vote to.
 * @param username The username of the user who voted.
 * @param type The type of vote to add, either 'upvote' or 'downvote'.
 *
 * @returns A Promise that resolves to an object containing either a success message or an error message,
 *          along with the updated upVotes and downVotes arrays.
 */
export const addVoteToQuestion = async (
  qid: string,
  username: string,
  type: 'upvote' | 'downvote',
): Promise<{ msg: string; upVotes: string[]; downVotes: string[] } | { error: string }> => {
  let updateOperation: QueryOptions;

  if (type === 'upvote') {
    updateOperation = [
      {
        $set: {
          upVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
              { $concatArrays: ['$upVotes', [username]] },
            ],
          },
          downVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              '$downVotes',
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
            ],
          },
        },
      },
    ];
  } else {
    updateOperation = [
      {
        $set: {
          downVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
              { $concatArrays: ['$downVotes', [username]] },
            ],
          },
          upVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              '$upVotes',
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
            ],
          },
        },
      },
    ];
  }

  try {
    const result = await QuestionModel.findOneAndUpdate({ _id: qid }, updateOperation, {
      new: true,
    });

    if (!result) {
      return { error: 'Question not found!' };
    }

    let msg = '';

    if (type === 'upvote') {
      msg = result.upVotes.includes(username)
        ? 'Question upvoted successfully'
        : 'Upvote cancelled successfully';
    } else {
      msg = result.downVotes.includes(username)
        ? 'Question downvoted successfully'
        : 'Downvote cancelled successfully';
    }

    return {
      msg,
      upVotes: result.upVotes || [],
      downVotes: result.downVotes || [],
    };
  } catch (err) {
    return {
      error:
        type === 'upvote'
          ? 'Error when adding upvote to question'
          : 'Error when adding downvote to question',
    };
  }
};

/**
 * Adds an answer to a question.
 *
 * @param {string} qid - The ID of the question to add an answer to
 * @param {Answer} ans - The answer to add
 *
 * @returns Promise<QuestionResponse> - The updated question or an error message
 */
export const addAnswerToQuestion = async (qid: string, ans: Answer): Promise<QuestionResponse> => {
  try {
    if (!ans || !ans.text || !ans.ansBy || !ans.ansDateTime) {
      throw new Error('Invalid answer');
    }
    const result = await QuestionModel.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [ans._id], $position: 0 } } },
      { new: true },
    );
    if (result === null) {
      throw new Error('Error when adding answer to question');
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding answer to question' };
  }
};

/**
 * Adds a comment to a question or answer.
 *
 * @param id The ID of the question or answer to add a comment to
 * @param type The type of the comment, either 'question' or 'answer'
 * @param comment The comment to add
 *
 * @returns A Promise that resolves to the updated question or answer, or an error message if the operation fails
 */
export const addComment = async (
  id: string,
  type: 'question' | 'answer',
  comment: Comment,
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!comment || !comment.text || !comment.commentBy || !comment.commentDateTime) {
      throw new Error('Invalid comment');
    }
    let result: QuestionResponse | AnswerResponse | null;
    if (type === 'question') {
      result = await QuestionModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    } else {
      result = await AnswerModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    }
    if (result === null) {
      throw new Error('Failed to add comment');
    }
    return result;
  } catch (error) {
    return { error: `Error when adding comment: ${(error as Error).message}` };
  }
};

/**
 * Gets a map of tags and their corresponding question counts.
 *
 * @returns {Promise<Map<string, number> | null | { error: string }>} - A map of tags to their
 *          counts, `null` if there are no tags in the database, or the error message.
 */
export const getTagCountMap = async (): Promise<Map<string, number> | null | { error: string }> => {
  try {
    const tlist = await TagModel.find();
    const qlist = await QuestionModel.find().populate({
      path: 'tags',
      model: TagModel,
    });

    if (!tlist || tlist.length === 0) {
      return null;
    }

    const tmap = new Map(tlist.map(t => [t.name, 0]));

    if (qlist != null && qlist !== undefined && qlist.length > 0) {
      qlist.forEach(q => {
        q.tags.forEach(t => {
          tmap.set(t.name, (tmap.get(t.name) || 0) + 1);
        });
      });
    }

    return tmap;
  } catch (error) {
    return { error: 'Error when construction tag map' };
  }
};

/**
 * Gets a list of all non deleted users from the database.
 *
 * @returns a list of all users.
 */
export const fetchAllUsers = async (): Promise<MultipleUserResponse> => {
  try {
    const ulist = await UserModel.find({ deleted: false }).populate([
      { path: 'following', model: UserModel },
      { path: 'followers', model: UserModel },
    ]);

    return ulist;
  } catch (error) {
    return { error: 'Error when fetching all users' };
  }
};

/**
 * Fetches a non-deleted user by their id.
 *
 * @param uid The id of the user being fetched.
 * @returns The user or an error if the user is not found.
 */
export const fetchUserById = async (uid: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOne({ _id: uid, deleted: false }).populate([
      { path: 'following', model: UserModel },
      { path: 'followers', model: UserModel },
      {
        path: 'outfits',
        populate: [
          { path: 'tops' },
          { path: 'bottoms' },
          { path: 'outerwear' },
          { path: 'accessories' },
          { path: 'shoes' },
        ],
      },
    ]);
    if (!user) {
      throw new Error(`Failed to fetch user with id ${uid}`);
    }
    return user;
  } catch (error) {
    return { error: `Error when fetching user: ${(error as Error).message}` };
  }
};

/**
 * Fetches a user by their username from the database if the user is not deleted.
 * @param username The username of the user being fetched.
 * @returns The user or an error if the user is not found.
 */
export const fetchUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOne({ username, deleted: false }).populate([
      {
        path: 'following',
        model: UserModel,
        populate: {
          path: 'outfits',
          model: OutfitModel,
        },
      },
      { path: 'followers', model: UserModel },
      { path: 'outfits', model: OutfitModel },
      { path: 'workouts', model: WorkoutModel },
    ]);

    if (!user) {
      throw new Error(`Failed to fetch user with username ${username}`);
    }
    return user;
  } catch (error) {
    return { error: `Error when fetching user: ${(error as Error).message}` };
  }
};

/**
 * Deletes a user by setting the user's deleted field to true.
 *
 * @param username The username of the user being deleted.
 * @returns A Promise that resolves to the deleted user, or an error message if the operation fails.
 */
export const updateDeletedStatus = async (username: string): Promise<UserResponse> => {
  const updateOperation = [
    {
      $set: {
        deleted: true,
      },
    },
  ];

  try {
    const result = await UserModel.findOneAndUpdate({ username }, updateOperation, {
      new: true,
    });

    if (!result) {
      return { error: 'User not found!' };
    }

    if (!result.deleted) {
      return { error: 'User not deleted!' };
    }

    return result;
  } catch (err) {
    return {
      error: `Error when deleting user with username ${username}`,
    };
  }
};

/**
 * Fetches the conversations in the db that involve the given participants, no matter the order.
 *
 * @param participants The users involved in the conversations being retrieved.
 * @param exact Boolean indicating if the conversations being retrieved should contain only and exactly the
 * users in the list (when exact is set to true) or if the conversations only need to contain the users (when
 * exact is set to false).
 * @returns A Promise that resolves to the list of conversations, or an error message if an error occurs.
 */
export const fetchConvosByParticipants = async (
  participants: User[],
  exact: boolean,
): Promise<MultipleConversationResponse> => {
  let findQuery: QueryOptions;

  // we want only these users to be in the conversation
  if (exact) {
    findQuery = { $all: participants, $size: participants.length };
  }
  // we want these users to be part of the conversation (additional people can be part of it, too)
  else {
    findQuery = { $all: participants };
  }
  try {
    // query the conversation db for the conversations with the given users
    const convos = await ConversationModel.find({
      users: findQuery,
    }).populate([
      { path: 'users', model: UserModel },
      {
        path: 'messages',
        model: MessageModel,
        populate: [
          { path: 'sender', model: UserModel },
          { path: 'readBy', model: UserModel },
        ],
      },
    ]);

    return convos;
  } catch (error) {
    return { error: 'Error when fetching the conversations' };
  }
};

/**
 * Checks for an existing conversation between the provided users and returns
 * it if it exists. If it does not exist, a new conversation is created and saved.
 *
 * @param user1 The first user in the conversation.
 * @param user2 The second user in the conversation.
 * @returns The conversation object between the two users.
 */
export const createOrFetchConversation = async (
  user1: User,
  user2: User,
): Promise<Conversation> => {
  // check for an existing conversation
  const findConvo = await fetchConvosByParticipants([user1, user2], true);

  if ('error' in findConvo) {
    throw new Error(findConvo.error as string);
  }

  if (findConvo.length > 1) {
    throw new Error('More than one conversation returned');
  }

  // no conversation exists, so we create a new one
  if (findConvo.length === 0) {
    const newConvo = {
      users: [user1, user2],
      messages: [],
      updatedAt: new Date(),
    };

    // save the new conversation
    const convoFromDb = await saveConversation(newConvo);
    if ('error' in convoFromDb) {
      throw new Error(convoFromDb.error as string);
    }
    return convoFromDb;
  }

  return findConvo[0];
};

/**
 * Checks if there exists a conversation in the db with the provided list of users.
 *
 * @param users The list of users involved in the conversation.
 * @returns `true` if there exists a conversation, `false` if there does not exist a conversation,
 * and throws an error if an error occurs during the check.
 */
export const doesConversationExist = async (users: User[]): Promise<boolean | Error> => {
  // fetch convo that contains every user
  const convos = await fetchConvosByParticipants(users, true);

  // if fetching the convo results in an error message, throw error
  if ('error' in convos) {
    throw new Error('Error occurred fetching conversation');
  }

  // if more than one convo is returned, there are duplicates in the db
  if (convos.length > 1) {
    throw new Error('Duplicate conversations exist in the database');
  }

  // exactly 1 valid conversation exists
  return convos.length === 1;
};

/**
 * Makes the first user follow the second user. Adds the second user to the first's following list, and
 * adds the first to the second's followers list.
 * @param uid the user id of the user following another.
 * @param userToFollowId the user id that is being followed
 * @returns Both users in a list format, where the user doing the following is at index 0 and the user being followed is
 * at index 1. Their respective following/followers lists are updated in these user objects being returned.
 */
export const followAnotherUser = async (
  uid: string,
  userToFollowId: string,
): Promise<MultipleUserResponse> => {
  try {
    const userResult = await UserModel.findOneAndUpdate(
      { _id: uid },
      { $addToSet: { following: userToFollowId } },
      {
        new: true,
      },
    ).populate([
      { path: 'following', model: UserModel },
      { path: 'followers', model: UserModel },
    ]);
    const followingResult = await UserModel.findOneAndUpdate(
      { _id: userToFollowId },
      { $addToSet: { followers: uid } },
      {
        new: true,
      },
    ).populate([
      { path: 'following', model: UserModel },
      { path: 'followers', model: UserModel },
    ]);
    if (!userResult) {
      return { error: 'User not found!' };
    }
    if (!followingResult) {
      return { error: 'Following user not found!' };
    }
    if (currentUser?.username === userResult.username) {
      currentUser = userResult;
    }
    return [userResult, followingResult];
  } catch (err) {
    return {
      error: `Error when ${uid} is following ${userToFollowId}`,
    };
  }
};

/**
 * Makes the first user unfollow the second user. Removes the second user to the first's following list, and
 * removes the first to the second's followers list.
 * @param uid the user id of the user unfollowing another.
 * @param userToFollowId the user id that is being unfollowed.
 * @returns Both users in a list format, where the user doing the unfollowing is at index 0 and the user being
 * unfollowed is at index 1. Their respective following/followers lists are updated in these user objects being returned.
 */
export const unfollowAnotherUser = async (
  uid: string,
  userToFollowId: string,
): Promise<MultipleUserResponse> => {
  try {
    const userResult = await UserModel.findOneAndUpdate(
      { _id: uid },
      { $pull: { following: userToFollowId } },
      {
        new: true,
      },
    ).populate([
      { path: 'following', model: UserModel },
      { path: 'followers', model: UserModel },
    ]);
    const unfollowingResult = await UserModel.findOneAndUpdate(
      { _id: userToFollowId },
      { $pull: { followers: uid } },
      {
        new: true,
      },
    ).populate([
      { path: 'following', model: UserModel },
      { path: 'followers', model: UserModel },
    ]);
    if (!userResult) {
      return { error: 'User not found!' };
    }
    if (!unfollowingResult) {
      return { error: 'Unfollowing user not found!' };
    }
    if (currentUser?.username === userResult.username) {
      currentUser = userResult;
    }
    return [userResult, unfollowingResult];
  } catch (err) {
    return {
      error: `Error when ${uid} is unfollowing ${userToFollowId}`,
    };
  }
};

/**
 * Removes the user with the given username from every other users list of followers
 * and following. This is for the use case of a user being deleted, where we need to
 * remove them from these lists.
 * @param username Username of the user being removed.
 * @returns Upon success, an object with a true bool. Upon failure, an object with an
 * error message.
 */
export const removeUserFromFollowerFollowingLists = async (
  username: string,
): Promise<RemoveUserResponse> => {
  try {
    // fetch the user being removed - they should not yet be marked as deleted
    const user = await fetchUserByUsername(username);

    if ('error' in user) {
      throw new Error(user.error as string);
    }

    // remove the user from every other user's following and followers lists
    const updateListsResult = await UserModel.updateMany(
      {
        deleted: false, // only need to look at the non-deleted users
        $or: [
          // only need to look at the users who have this user in their followers or following list
          { followers: user._id },
          { following: user._id },
        ],
      },
      {
        $pull: {
          followers: user._id,
          following: user._id,
        },
      },
    );

    // false acknowledgement means an error occurred
    if (!updateListsResult.acknowledged) {
      throw new Error('Update not acknowledged by server.');
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: `Error when user ${username} was being removed from others' following and followers lists: ${err}`,
    };
  }
};

/**
 * Sets the the current user in the application to the given user.
 * @param user the user that will be set to the current user.
 */
export const setCurrentUser = async (user: User) => {
  if (user !== null) {
    currentUser = user;
  }
};

/**
 * Gets the current user that is logged in to the application.
 * @returns the user that is logged in or null is no one is logged in.
 */
export const getCurrentUser = async (): Promise<User | null> => currentUser;

/**
 * Logs out the current user by explicitly setting the current user to null.
 */
export const logoutCurrentUser = async () => {
  currentUser = null;
};

/**
 * Ensures that each user in the supplied list is registered and active in the database.
 *
 * @param users The list of users being validated.
 * @returns `true` if all users are registered, otherwise `false`.
 */
export const areUsersRegistered = async (users: User[]): Promise<boolean> => {
  try {
    // fetch user associated with each username
    const promises = users.map(user => fetchUserByUsername(user.username));
    const usersFromDb = await Promise.all(promises);

    // check if any user is not found or marked as deleted
    for (const user of usersFromDb) {
      if ('error' in user || user.deleted) {
        return false;
      }
    }

    return true;
  } catch (error) {
    // return false if there is an error during the fetch process
    return false;
  }
};

/**
 * Adds a message to a conversation.
 * @param {Message} message - The message to add.
 * @returns Promise<ConversationResponse> - The updated conversation or an error message.
 */
export const addMessage = async (message: Message): Promise<ConversationResponse> => {
  try {
    if (!message || !message.messageContent || !message.sender || !message.sentAt || !message.cid) {
      throw new Error('Invalid message');
    }

    const result = await ConversationModel.findOneAndUpdate(
      { _id: new ObjectId(message.cid) },
      { $push: { messages: { $each: [message._id] } }, $set: { updatedAt: message.sentAt } },
      { new: true },
    ).populate([
      { path: 'users', model: UserModel },
      {
        path: 'messages',
        model: MessageModel,
        populate: [
          { path: 'sender', model: UserModel },
          { path: 'readBy', model: UserModel },
        ],
      },
    ]);

    if (result === null) {
      throw new Error('Error when adding message to conversation');
    }

    return result;
  } catch (error) {
    return { error: `Error when adding a message to conversation:  ${(error as Error).message}` };
  }
};

/**
 * Fetches a conversation by its id.
 * @param {string} cid The id of the conversation to fetch.
 * @returns The conversation or an error if the conversation is not found.
 */
export const fetchConversationById = async (cid: string): Promise<ConversationResponse> => {
  try {
    const conversation = await ConversationModel.findOne({ _id: new ObjectId(cid) }).populate([
      { path: 'users', model: UserModel },
      {
        path: 'messages',
        model: MessageModel,
        populate: [
          { path: 'sender', model: UserModel },
          { path: 'readBy', model: UserModel },
        ],
      },
    ]);

    if (!conversation) {
      throw new Error(`Failed to fetch converation with id ${cid}`);
    }
    return conversation;
  } catch (error) {
    return { error: `Error when fetching conversation: ${(error as Error).message}` };
  }
};

/**
 * Marks a message as read by the user passed in.
 *
 * @param mid The id of the message to mark as read.
 * @param user The user who is marking the message as read.
 * @returns The updates message object or an error if an issue occurs.
 */
export const markMessageAsRead = async (mid: string, user: User): Promise<MessageResponse> => {
  try {
    const result = await MessageModel.findOneAndUpdate(
      { _id: mid },
      { $addToSet: { readBy: user } },
      { new: true },
    );

    if (!result) {
      throw new Error('No message found');
    }

    return result;
  } catch (error) {
    return { error: `Error when marking message as read: ${(error as Error).message}` };
  }
};

/**
 * Function for handling the required aspects of sending a message, which involves 1) creating
 * a message to send, 2) saving that message to the db, and 3) adding the message to the conversation.
 *
 * @param conversation The conversation to which the message will be added.
 * @param user The sender of the message.
 * @param messageContent The string content of the message.
 */
export const saveAndAddMessage = async (
  conversation: Conversation,
  user: User,
  messageContent: string,
): Promise<Message> => {
  // create message object
  const message = {
    messageContent,
    sender: user,
    sentAt: new Date(),
    readBy: [user],
    cid: conversation._id!.toString(),
  };

  // save message
  const messageFromDb = await saveMessage(message);

  if ('error' in messageFromDb) {
    throw new Error(messageFromDb.error as string);
  }

  // add message to conversation
  const updatedConvoFromDb = await addMessage(messageFromDb);

  if ('error' in updatedConvoFromDb) {
    throw new Error(updatedConvoFromDb.error as string);
  }

  return messageFromDb;
};

/**
 * Attempts to delete the notification with the given id from the mongo db.
 * @param nid the id of the notification.
 * @returns a boolean promise representing if the notification was successfully deleted.
 */
export const deleteNotificationById = async (nid: string): Promise<boolean> => {
  try {
    const result = await NotificationModel.deleteOne({ _id: new ObjectId(nid) });

    if (!result.acknowledged || result.deletedCount < 1) {
      throw new Error('Notification not deleted.');
    }
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Saves a new notification to the database.
 *
 * @param {Notification} notification - The notification to save
 *
 * @returns {Promise<NotificationResponse>} - The saved notification, or an error notification if the save failed
 */
export const saveNotification = async (
  notification: Notification,
): Promise<NotificationResponse> => {
  try {
    const result = await NotificationModel.create(notification);
    return result;
  } catch (error) {
    return { error: 'Error when saving a notification' };
  }
};

/**
 * Fetches the notifications in the db for the given user, no matter the order.
 *
 * @param username The username of the user.
 * @returns A Promise that resolves to the list of Notifications, or an error message if an error occurs.
 */
export const fetchNotifsByUsername = async (
  username: string,
): Promise<MultipleNotificationResponse> => {
  try {
    const notifs = await NotificationModel.find({
      user: username,
    }).populate({
      path: 'message',
      model: MessageModel,
      populate: [
        { path: 'sender', model: UserModel },
        { path: 'readBy', model: UserModel },
      ],
    });

    return notifs;
  } catch (error) {
    return { error: 'Error when fetching the notifications' };
  }
};

/**
 * Sends an email to the specified email address. Uses the SendGrid API. If the limit
 * of 100 free emails is reached, the error from SendGrid is handled but the message
 * is still sent.
 * @param to Email to send the email to.
 * @param msgSender The user sending the message.
 */
export const sendEmail = async (
  to: string,
  msgSender: string,
  profileGraphic: number,
): Promise<SendEmailPayload> => {
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  if (sendGridApiKey) {
    sgMail.setApiKey(sendGridApiKey);
  } else {
    throw new Error('SENDGRID_API_KEY environment variable is not set');
  }

  const ccLink = 'https://fall24-project-fall24-team-project-group-3ck6.onrender.com/';

  const msg = {
    to,
    from: 'code_connect_neu@outlook.com',
    subject: `New CodeConnect Message from ${msgSender}!`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
      <!-- header with logo -->
      <div style="margin-bottom: 20px;">
        <img src="${ccLink}logos/code-connect-name.png" alt="CC Logo" width="200" style="vertical-align: middle;">
      </div>
      
      <!-- profile graphic and text -->
      <div style="margin-bottom: 20px;">
        <img src="${ccLink}profileGraphics/image${profileGraphic}" alt="Profile Graphic" style="border-radius: 50%; width: 80px; height: 80px; margin-bottom: 10px;">
        <p style="font-size: 16px; color: #333; margin: 0;">${msgSender} sent you a message!</p>
      </div>
      
      <!-- link to code connect website -->
      <a href=${ccLink} target="_blank" style="text-decoration: none;">
        <div style="background-color: #006aff; color: white; padding: 12px 20px; font-size: 16px; border-radius: 5px; display: inline-block;">
          Open Code Connect
        </div>
      </a>
      
      <!-- footer note -->
      <p style="font-size: 12px; color: #666; margin-top: 20px;">
        You'll need to use Code Connect to see and respond to ${msgSender}'s message. With Code Connect, you can send messages, and ask and answer questions.
      </p>
    </div>
  `,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: 'Email sent successfully!' };
  } catch (err) {
    // a Forbidden or Unauthorized error is returned when the email fails to be sent because of the
    // 100 email/day limit; here, we catch this to ensure that even though the email is not sent,
    // the message still goes through
    if ((err as Error).message === 'Forbidden' || (err as Error).message === 'Unauthorized') {
      return { success: true, message: 'Send limit reached - email not sent' };
    }
    return { success: false, message: `Failed to send email: ${(err as Error).message}` };
  }
};

/// //////////////////////////////////////// RUNNER APP ADDITIONS

/**
 * Saves a new top to the database.
 *
 * @param {Top} top - The top to save.
 *
 * @returns {Promise<TopResponse>} - The saved top, or an error message if the save failed.
 */
export const saveTop = async (top: Top): Promise<TopResponse> => {
  try {
    const result = await TopModel.create(top);
    return result;
  } catch (error) {
    return { error: 'Error when saving a top' };
  }
};

/**
 * Saves a new bottom to the database.
 *
 * @param {Bottom} bottom - The bottom to save.
 *
 * @returns {Promise<BottomResponse>} - The saved bottom, or an error message if the save failed.
 */
export const saveBottom = async (bottom: Bottom): Promise<BottomResponse> => {
  try {
    const result = await BottomModel.create(bottom);
    return result;
  } catch (error) {
    return { error: 'Error when saving a bottom' };
  }
};

/**
 * Saves a new outerwear item to the database.
 *
 * @param {Outerwear} outerwear - The outerwear to save.
 *
 * @returns {Promise<OuterwearResponse>} - The saved outerwear item, or an error message if the save failed.
 */
export const saveOuterwear = async (outerwear: Outerwear): Promise<OuterwearResponse> => {
  try {
    const result = await OuterwearModel.create(outerwear);
    return result;
  } catch (error) {
    return { error: 'Error when saving an outerwear item' };
  }
};

/**
 * Saves a new accessory to the database.
 *
 * @param {Accessory} accessory - The accessory to save.
 *
 * @returns {Promise<AccessoryResponse>} - The saved accessory, or an error message if the save failed.
 */
export const saveAccessory = async (accessory: Accessory): Promise<AccessoryResponse> => {
  try {
    const result = await AccessoryModel.create(accessory);
    return result;
  } catch (error) {
    return { error: 'Error when saving an accessory' };
  }
};

/**
 * Saves a new shoe to the database.
 *
 * @param {Shoe} shoe - The shoe to save.
 *
 * @returns {Promise<ShoeResponse>} - The saved shoe, or an error message if the save failed.
 */
export const saveShoe = async (shoe: Shoe): Promise<ShoeResponse> => {
  try {
    const result = await ShoeModel.create(shoe);
    return result;
  } catch (error) {
    return { error: 'Error when saving a shoe' };
  }
};

/**
 * Saves a new workout to the database.
 *
 * @param {Workout} workout - The workout to save.
 *
 * @returns {Promise<WorkoutResponse>} - The saved workout, or an error message if the save failed.
 */
export const saveWorkout = async (workout: Workout): Promise<WorkoutResponse> => {
  try {
    const result = await WorkoutModel.create(workout);
    return result;
  } catch (error) {
    return { error: 'Error when saving a workout' };
  }
};

/**
 * Adds a workout to a user's list of workouts.
 *
 * @param workout The workout being added.
 * @param runnerId The id of the user to which the workout is being added.
 * @returns {Promise<UserResponse>} - The updated user, or an error message if the update failed.
 */
export const addWorkout = async (workout: Workout, runnerId: string): Promise<UserResponse> => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: runnerId },
      { $addToSet: { workouts: workout } },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return { error: 'User not found!' };
    }

    return updatedUser;
  } catch (err) {
    return { error: `Error when adding a workout to user:  ${(err as Error).message}` };
  }
};

/**
 * Fetches an outfit by its id.
 *
 * @param oid The id of the outfit being fetched.
 * @returns The outfit or an error if the outfit is not found.
 */
export const fetchOutfitById = async (oid: string): Promise<OutfitResponse> => {
  try {
    const outfit = await OutfitModel.findOne({ _id: oid }).populate([
      { path: 'wearer', model: UserModel },
      { path: 'rating', model: RatingModel },
      { path: 'tops', model: TopModel },
      { path: 'bottoms', model: BottomModel },
      { path: 'outerwear', model: OuterwearModel },
      { path: 'accessories', model: AccessoryModel },
      { path: 'shoes', model: ShoeModel },
      { path: 'workout', model: WorkoutModel },
    ]);
    if (!outfit) {
      throw new Error(`Failed to fetch outfit with id ${oid}`);
    }
    return outfit;
  } catch (error) {
    return { error: `Error when fetching outfit: ${(error as Error).message}` };
  }
};

/**
 * Saves a new rating to the database.
 *
 * @param {Rating} rating - The rating to save.
 *
 * @returns {Promise<RatingResponse>} - The saved rating, or an error message if the save failed.
 */
export const saveRating = async (rating: Rating): Promise<RatingResponse> => {
  try {
    const result = await RatingModel.create(rating);
    return result;
  } catch (error) {
    return { error: 'Error when saving a rating' };
  }
};

/**
 * Fetches an workout by its id.
 *
 * @param wid The id of the workout being fetched.
 * @returns The workout or an error if the workout is not found.
 */
export const fetchWorkoutById = async (wid: string): Promise<WorkoutResponse> => {
  try {
    const workout = await WorkoutModel.findOne({ _id: wid }).populate([
      { path: 'runner', model: UserModel },
    ]);
    if (!workout) {
      throw new Error(`Failed to fetch workout with id ${wid}`);
    }
    return workout;
  } catch (error) {
    return { error: `Error when fetching workout: ${(error as Error).message}` };
  }
};

/**
 * Fetches a rating by its id.
 *
 * @param rid The id of the rating being fetched.
 * @returns The rating or an error if the rating is not found.
 */
export const fetchRatingById = async (rid: string): Promise<RatingResponse> => {
  try {
    const rating = await RatingModel.findOne({ _id: rid });
    if (!rating) {
      throw new Error(`Failed to fetch rating with id ${rid}`);
    }
    return rating;
  } catch (error) {
    return { error: `Error when fetching rating: ${(error as Error).message}` };
  }
};

/**
 * Fetches a top by its id.
 *
 * @param tid The id of the top being fetched.
 * @returns The top or an error if the top is not found.
 */
export const fetchTopById = async (tid: string): Promise<TopResponse> => {
  try {
    const top = await TopModel.findOne({ _id: tid }).populate([
      { path: 'outfits', model: OutfitModel },
    ]);
    if (!top) {
      throw new Error(`Failed to fetch top with id ${tid}`);
    }
    return top;
  } catch (error) {
    return { error: `Error when fetching top: ${(error as Error).message}` };
  }
};

/**
 * Fetches a bottom by its id.
 *
 * @param bid The id of the bottom being fetched.
 * @returns The bottom or an error if the bottom is not found.
 */
export const fetchBottomById = async (bid: string): Promise<BottomResponse> => {
  try {
    const bottom = await BottomModel.findOne({ _id: bid }).populate([
      { path: 'outfits', model: OutfitModel },
    ]);
    if (!bottom) {
      throw new Error(`Failed to fetch bottom with id ${bid}`);
    }
    return bottom;
  } catch (error) {
    return { error: `Error when fetching bottom: ${(error as Error).message}` };
  }
};

/**
 * Fetches an outerwear item by its id.
 *
 * @param oid The id of the outerwear item being fetched.
 * @returns The outerwear item or an error if the outerwear item is not found.
 */
export const fetchOuterwearById = async (oid: string): Promise<OuterwearResponse> => {
  try {
    const outerwear = await OuterwearModel.findOne({ _id: oid }).populate([
      { path: 'outfits', model: OutfitModel },
    ]);
    if (!outerwear) {
      throw new Error(`Failed to fetch outerwear item with id ${oid}`);
    }
    return outerwear;
  } catch (error) {
    return { error: `Error when fetching outerwear: ${(error as Error).message}` };
  }
};

/**
 * Fetches an accessory by its id.
 *
 * @param aid The id of the accessory being fetched.
 * @returns The accessory or an error if the accessory is not found.
 */
export const fetchAccessoryById = async (aid: string): Promise<AccessoryResponse> => {
  try {
    const accessory = await AccessoryModel.findOne({ _id: aid }).populate([
      { path: 'outfits', model: OutfitModel },
    ]);
    if (!accessory) {
      throw new Error(`Failed to fetch accessory with id ${aid}`);
    }
    return accessory;
  } catch (error) {
    return { error: `Error when fetching accessory: ${(error as Error).message}` };
  }
};

/**
 * Fetches a shoe by its id.
 *
 * @param sid The id of the shoe being fetched.
 * @returns The shoe or an error if the shoe is not found.
 */
export const fetchShoeById = async (sid: string): Promise<ShoeResponse> => {
  try {
    const shoe = await ShoeModel.findOne({ _id: sid }).populate([
      { path: 'outfits', model: OutfitModel },
    ]);
    if (!shoe) {
      throw new Error(`Failed to fetch shoe with id ${sid}`);
    }
    return shoe;
  } catch (error) {
    return { error: `Error when fetching shoe: ${(error as Error).message}` };
  }
};

/**
 * Saves a new outfit to the database.
 *
 * @param {Outfit} outfit - The outfit to save.
 *
 * @returns {Promise<OutfitResponse>} - The saved outfit, or an error message if the save failed.
 */
export const saveOutfit = async (outfit: Outfit): Promise<OutfitResponse> => {
  try {
    const result = await OutfitModel.create(outfit);
    return result;
  } catch (error) {
    return { error: `Error when saving an outfit: ${error}` };
  }
};

/**
 * Adds an outfit to a top's list of outfits.
 *
 * @param outfit The outfit being added.
 * @param top The top to which the outfit is being added.
 * @returns {Promise<TopResponse>} - The updated top, or an error message if the update failed.
 */
export const addOutfitToTop = async (outfit: Outfit, top: Top): Promise<TopResponse> => {
  try {
    const updatedTop = await TopModel.findOneAndUpdate(
      { _id: top._id },
      { $addToSet: { outfits: outfit } },
      {
        new: true,
      },
    );

    if (!updatedTop) {
      return { error: 'Top not found!' };
    }

    return updatedTop;
  } catch (err) {
    return { error: `Error when adding an outfit to top:  ${(err as Error).message}` };
  }
};

/**
 * Adds an outfit to a bottom's list of outfits.
 *
 * @param outfit The outfit being added.
 * @param bottom The bottom to which the outfit is being added.
 * @returns {Promise<BottomResponse>} - The updated bottom, or an error message if the update failed.
 */
export const addOutfitToBottom = async (outfit: Outfit, bottom: Bottom): Promise<TopResponse> => {
  try {
    const updatedBottom = await BottomModel.findOneAndUpdate(
      { _id: bottom._id },
      { $addToSet: { outfits: outfit } },
      {
        new: true,
      },
    );

    if (!updatedBottom) {
      return { error: 'Bottom not found!' };
    }

    return updatedBottom;
  } catch (err) {
    return { error: `Error when adding an outfit to bottom:  ${(err as Error).message}` };
  }
};

/**
 * Adds an outfit to a outerwear item's list of outfits.
 *
 * @param outfit The outfit being added.
 * @param outerwewar The outerwear to which the outfit is being added.
 * @returns {Promise<OuterwearResponse>} - The updated outerwear item, or an error message if the update failed.
 */
export const addOutfitToOuterwear = async (
  outfit: Outfit,
  outerwear: Outerwear,
): Promise<OuterwearResponse> => {
  try {
    const updatedOuterwear = await OuterwearModel.findOneAndUpdate(
      { _id: outerwear._id },
      { $addToSet: { outfits: outfit } },
      {
        new: true,
      },
    );

    if (!updatedOuterwear) {
      return { error: 'Outerwear item not found!' };
    }

    return updatedOuterwear;
  } catch (err) {
    return { error: `Error when adding an outfit to outerwear item:  ${(err as Error).message}` };
  }
};

/**
 * Adds an outfit to an accessory's list of outfits.
 *
 * @param outfit The outfit being added.
 * @param accessory The accessory to which the outfit is being added.
 * @returns {Promise<AccessoryResponse>} - The updated accessory, or an error message if the update failed.
 */
export const addOutfitToAccessory = async (
  outfit: Outfit,
  accessory: Accessory,
): Promise<AccessoryResponse> => {
  try {
    const updatedAccessory = await AccessoryModel.findOneAndUpdate(
      { _id: accessory._id },
      { $addToSet: { outfits: outfit } },
      {
        new: true,
      },
    );

    if (!updatedAccessory) {
      return { error: 'Accessory not found!' };
    }

    return updatedAccessory;
  } catch (err) {
    return { error: `Error when adding an outfit to accessory:  ${(err as Error).message}` };
  }
};

/**
 * Adds an outfit to a shoe's list of outfits.
 *
 * @param outfit The outfit being added.
 * @param shoe The shoe to which the outfit is being added.
 * @returns {Promise<ShoeResponse>} - The updated shoe, or an error message if the update failed.
 */
export const addOutfitToShoe = async (outfit: Outfit, shoe: Shoe): Promise<ShoeResponse> => {
  try {
    const updatedShoe = await ShoeModel.findOneAndUpdate(
      { _id: shoe._id },
      { $addToSet: { outfits: outfit } },
      {
        new: true,
      },
    );

    if (!updatedShoe) {
      return { error: 'Shoe not found!' };
    }

    return updatedShoe;
  } catch (err) {
    return { error: `Error when adding an outfit to shoe:  ${(err as Error).message}` };
  }
};

/**
 * Adds an outfit to a user's list of outfits.
 *
 * @param outfit The outfit being added.
 * @param userId The id of the user to which the outfit is being added.
 * @returns {Promise<UserResponse>} - The updated user, or an error message if the update failed.
 */
export const addOutfitToUser = async (outfit: Outfit, userId: string): Promise<UserResponse> => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { outfits: outfit } },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return { error: 'User not found!' };
    }

    return updatedUser;
  } catch (err) {
    return { error: `Error when adding an outfit to user:  ${(err as Error).message}` };
  }
};

export const extractOutfitItems = async (outfits: Outfit[]): Promise<AllOutfitItemsResponse> => {
  try {
    // use a set because outfits may have the same items
    const tops = new Set<Top>();
    const bottoms = new Set<Bottom>();
    const outerwears = new Set<Outerwear>();
    const accessories = new Set<Accessory>();
    const shoes = new Set<Shoe>();

    outfits.forEach(outfit => {
      outfit.tops.forEach(top => tops.add(top));
      outfit.bottoms.forEach(bottom => bottoms.add(bottom));
      outfit.outerwear.forEach(outerwear => outerwears.add(outerwear));
      outfit.accessories.forEach(accessory => accessories.add(accessory));
      shoes.add(outfit.shoes);
    });
    const allOutfitItems: AllOutfitItemsObject = {
      tops: Array.from(tops),
      bottoms: Array.from(bottoms),
      accessories: Array.from(accessories),
      outerwears: Array.from(outerwears),
      shoes: Array.from(shoes),
    };
    return allOutfitItems;
  } catch (error) {
    return { error: 'Error when fetching the outfit items' };
  }
};

export const fetchAllTopsByUser = async (uid: string): Promise<MultipleTopResponse> => {
  try {
    const tlist = await TopModel.find({ runner: uid }).populate([
      { path: 'outfits', model: OutfitModel },
    ]);

    return tlist;
  } catch (error) {
    return { error: 'Error when fetching all user tops' };
  }
};

export const fetchAllBottomsByUser = async (uid: string): Promise<MultipleBottomResponse> => {
  try {
    const blist = await BottomModel.find({ runner: uid }).populate([
      { path: 'outfits', model: OutfitModel },
    ]);

    return blist;
  } catch (error) {
    return { error: 'Error when fetching all user bottoms' };
  }
};

export const fetchAllAccessoriesByUser = async (
  uid: string,
): Promise<MultipleAccessoryResponse> => {
  try {
    const alist = await AccessoryModel.find({ runner: uid }).populate([
      { path: 'outfits', model: OutfitModel },
    ]);

    return alist;
  } catch (error) {
    return { error: 'Error when fetching all user accessories' };
  }
};

export const fetchAllOuterwearItemsByUser = async (
  uid: string,
): Promise<MultipleOuterwearItemResponse> => {
  try {
    const olist = await OuterwearModel.find({ runner: uid }).populate([
      { path: 'outfits', model: OutfitModel },
    ]);

    return olist;
  } catch (error) {
    return { error: 'Error when fetching all user outerwear items' };
  }
};

export const fetchAllShoesByUser = async (uid: string): Promise<MultipleShoeResponse> => {
  try {
    const slist = await ShoeModel.find({ runner: uid }).populate([
      { path: 'outfits', model: OutfitModel },
    ]);

    return slist;
  } catch (error) {
    return { error: 'Error when fetching all user shoes' };
  }
};

export const fetchAllWorkoutsByUser = async (uid: string): Promise<MultipleWorkoutsResponse> => {
  try {
    const wlist = await WorkoutModel.find({ runner: uid });

    return wlist;
  } catch (error) {
    return { error: 'Error when fetching all user workouts' };
  }
};

export const fetchOutfitsByUser = async (uid: string): Promise<MultipleOutfitResponse> => {
  try {
    const olist = await OutfitModel.find({ wearer: uid }).populate([
      { path: 'wearer', model: 'User' },
      { path: 'workout', model: 'Workout' },
      { path: 'rating', model: 'Rating' },
      { path: 'tops', model: 'Top' },
      { path: 'bottoms', model: 'Bottom' },
      { path: 'outerwear', model: 'Outerwear' },
      { path: 'accessories', model: 'Accessory' },
      { path: 'shoes', model: 'Shoe' },
    ]);

    return olist;
  } catch (error) {
    console.log(error, (error as Error).message);
    return { error: 'Error when fetching all user outfits' };
  }
};

export const fetchPartialOutfitsByUser = async (
  uid: string,
): Promise<OutfitData[] | { error: string }> => {
  try {
    const outfits = await OutfitModel.find({ wearer: uid })
      .select(['_id', 'wearer', 'dateWorn', 'location', 'workout', 'rating', 'imageUrl']) // only fetch these fields
      .populate([
        { path: 'wearer', select: 'username' },
        { path: 'workout', select: 'runType' },
        { path: 'rating', select: 'stars' },
      ])
      .lean();

    const outfitDataList: OutfitData[] = outfits.map(outfit => ({
      oid: outfit._id.toString(),
      wearerUsername: outfit.wearer.username,
      dateWorn: outfit.dateWorn,
      location: outfit.location,
      runType: outfit.workout?.runType.toString() ?? 'no run type',
      stars: outfit.rating?.stars.valueOf() ?? 0,
      imageUrl: outfit.imageUrl,
    }));

    return outfitDataList;
  } catch (error) {
    console.error(error);
    return { error: 'Error when fetching partial outfit data' };
  }
};

/**
 * Fetches the latitude longitude coordinates of a city, state, country string location.
 *
 * @param location The location of the place for which the coordinates are being fetched.
 * @returns The latitude, longitude coordinates of the location.
 */
export const fetchCoordinates = async (location: string): Promise<ForwardGeocodePayload> => {
  // TODO - may need some error handling here for when limit is reached
  const apiKey = process.env.OPENCAGEDATA_API_KEY;
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`,
  );
  const data = await response.json();
  return data.results[0]?.geometry;
};

/**
 * Fetches the static image url for the provided lat, lng coordinates of a geographic location,
 * using the MapBox Static Image API.
 *
 * @param lat The latitudinal number coordinate.
 * @param lng The longitudinal number coordinate.
 * @returns URL of a map location image.
 */
export const fetchStaticMapImage = async (lat: number, lng: number): Promise<string> => {
  // TODO - use private api key (currently using public)
  const apiToken = process.env.MAPBOX_API_TOKEN;

  const geoJson = JSON.stringify({
    type: 'Point',
    coordinates: [lng, lat],
  });

  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/geojson(${encodeURIComponent(
    geoJson,
  )})/${lng},${lat},12/500x300?access_token=${apiToken}`;

  return staticMapUrl;
};

export const fetchHistoricalWeatherData = async (
  lat: number,
  lng: number,
  dateTimeInfo: string,
): Promise<WeatherDay> => {
  const apiKey = process.env.VISUAL_CROSSING_API_KEY;

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lng}/${dateTimeInfo}?key=${apiKey}&include=hours&unitGroup=us`;

  const res = await fetch(url);

  console.log('fetch hist res: ', res);

  const data = await res.json();

  return data.days[0];
};

/**
 * Uploads an image to Cloudinary cloud storage.
 *
 * @param imageData Form data containing the image file data to upload.
 * @returns The HTTPS url of where the image is stored in Cloudinary or error if upload fails.
 */
export const uploadImageToCloudinary = async (buffer: Buffer): Promise<UploadApiResponse> => {
  // Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error || !result) {
        return reject(error || new Error('Cloudinary upload failed'));
      }
      return resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * Gets the newest outfits from a list, sorted by the date worn in descending order.
 *
 * @param {Outfit[]} olist - The list of outfits to sort
 *
 * @returns {Outfit[]} - The sorted list of outfits
 */
const sortOutfitsByNewest = (olist: Outfit[]): Outfit[] =>
  olist.sort((a, b) => {
    if (a.dateWorn > b.dateWorn) {
      return -1;
    }

    if (a.dateWorn < b.dateWorn) {
      return 1;
    }

    return 0;
  });

/**
 * Retrieves outfits from the database, ordered by the specified criteria.
 *
 * @param {OrderType} order - The order type to filter the outfits
 *
 * @returns {Promise<Outfit[]>} - Promise that resolves to a list of ordered outfits
 */
export const getOutfitsByOrder = async (order: OrderType): Promise<Outfit[]> => {
  try {
    const olist: Outfit[] = await OutfitModel.find().populate([
      { path: 'wearer', model: UserModel },
      { path: 'rating', model: RatingModel },
      { path: 'tops', model: TopModel },
      { path: 'bottoms', model: BottomModel },
      { path: 'outerwear', model: OuterwearModel },
      { path: 'accessories', model: AccessoryModel },
      { path: 'shoes', model: ShoeModel },
      { path: 'workout', model: WorkoutModel },
    ]);
    // if (order === 'active') {
    //   qlist = await QuestionModel.find().populate([
    //     { path: 'tags', model: TagModel },
    //     { path: 'answers', model: AnswerModel },
    //   ]);
    //   return sortQuestionsByActive(qlist);
    // }
    // qlist = await QuestionModel.find().populate([{ path: 'tags', model: TagModel }]);
    // if (order === 'unanswered') {
    //   return sortQuestionsByUnanswered(qlist);
    // }

    // TODO - add cases for other order criteria
    // if (order === 'newest') {
    return sortOutfitsByNewest(olist);
    // }
    // return sortQuestionsByMostViews(qlist);
  } catch (error) {
    return [];
  }
};

const checkKeywordInUser = (u: User, keyword: string): boolean =>
  u.username.includes(keyword) || u.firstName.includes(keyword) || u.lastName.includes(keyword);

const checkKeywordInOutfitItems = (outfitItems: OutfitItem[], keyword: string): boolean => {
  for (const item of outfitItems) {
    if (item.brand.toLowerCase().includes(keyword) || item.model.toLowerCase().includes(keyword)) {
      return true;
    }
  }
  return false;
};

/**
 * Checks if any keywords in the provided list exist in a given outfit's location, name
 * of the wearer of the outfit, and brands/models of outfit items.
 *
 * @param {Outfit} q - The outfit to check
 * @param {string[]} keywordlist - The list of keywords to check for
 *
 * @returns {boolean} - `true` if any keyword is present, `false` otherwise.
 */
const checkKeywordInOutfit = (o: Outfit, keywordlist: string[]): boolean => {
  for (const w of keywordlist) {
    const wLower = w.toLowerCase();
    if (
      o.location.toLowerCase().includes(wLower) ||
      checkKeywordInUser(o.wearer, wLower) ||
      checkKeywordInOutfitItems(o.tops, wLower) ||
      checkKeywordInOutfitItems(o.bottoms, wLower) ||
      checkKeywordInOutfitItems(o.outerwear, wLower) ||
      checkKeywordInOutfitItems(o.accessories, wLower) ||
      o.shoes.brand.toLowerCase().includes(wLower) ||
      o.shoes.model.toLowerCase().includes(wLower)
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Filters outfits based on a search string containing keywords.
 *
 * @param {Outfit[]} olist - The list of outfits to filter
 * @param {string} search - The search string containing keywords
 *
 * @returns {Outfit[]} - The filtered list of outfits matching the search criteria
 */
export const filterOutfitsBySearch = (olist: Outfit[], search: string): Outfit[] => {
  const searchKeyword = parseKeyword(search);

  if (!olist || olist.length === 0) {
    return [];
  }
  return olist.filter((o: Outfit) => {
    if (searchKeyword.length === 0) {
      return true;
    }

    return checkKeywordInOutfit(o, searchKeyword);
  });
};
