import { ObjectId } from 'mongodb';
import { QueryOptions } from 'mongoose';
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
} from '../types';
import AnswerModel from './answers';
import QuestionModel from './questions';
import TagModel from './tags';
import CommentModel from './comments';
import UserModel from './users';
import ConversationModel from './conversations';
import MessageModel from './messages';

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
    const user = await UserModel.findOne({ _id: uid, deleted: false });
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
      { path: 'following', model: UserModel },
      { path: 'followers', model: UserModel },
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
 * @param uid The id of the user being deleted.
 * @returns A Promise that resolves to the deleted user, or an error message if the operation fails.
 */
export const updateDeletedStatus = async (uid: string): Promise<UserResponse> => {
  const updateOperation = [
    {
      $set: {
        deleted: true,
      },
    },
  ];

  try {
    const result = await UserModel.findOneAndUpdate({ _id: uid }, updateOperation, {
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
      error: `Error when deleting user with id ${uid}`,
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
      { path: 'messages', model: MessageModel },
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
 * @returns the user being followed with the follower in the follower list.
 */
export const followAnotherUser = async (
  uid: string,
  userToFollowId: string,
): Promise<UserResponse> => {
  try {
    const userResult = await UserModel.findOneAndUpdate(
      { _id: uid },
      { $push: { following: userToFollowId } },
      {
        new: true,
      },
    );
    const followingResult = await UserModel.findOneAndUpdate(
      { _id: userToFollowId },
      { $push: { followers: uid } },
      {
        new: true,
      },
    );
    if (!userResult) {
      return { error: 'User not found!' };
    }
    if (!followingResult) {
      return { error: 'Following user not found!' };
    }
    return followingResult;
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
 * @returns the user being unfollowed with the follower removed the follower list.
 */
export const unfollowAnotherUser = async (
  uid: string,
  userToFollowId: string,
): Promise<UserResponse> => {
  try {
    const userResult = await UserModel.findOneAndUpdate(
      { _id: uid },
      { $pull: { following: userToFollowId } },
      {
        new: true,
      },
    );
    const unfollowingResult = await UserModel.findOneAndUpdate(
      { _id: userToFollowId },
      { $pull: { followers: uid } },
      {
        new: true,
      },
    );
    if (!userResult) {
      return { error: 'User not found!' };
    }
    if (!unfollowingResult) {
      return { error: 'Unfollowing user not found!' };
    }
    return unfollowingResult;
  } catch (err) {
    return {
      error: `Error when ${uid} is unfollowing ${userToFollowId}`,
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
    );

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
      { path: 'messages', model: MessageModel },
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
): Promise<void> => {
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
};
