import { UploadApiResponse } from 'cloudinary';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ServerToClientEvents>;

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed';

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Object IDs of comments that have been added to the answer by users, or comments themselves if populated
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[] | ObjectId[];
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
  description: string;
}

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - he date and time when the question was asked.
 * - answers - Object IDs of answers that have been added to the question by users, or answers themselves if populated.
 * - views - An array of usernames that have viewed the question.
 * - upVotes - An array of usernames that have upvoted the question.
 * - downVotes - An array of usernames that have downvoted the question.
 * - comments - Object IDs of comments that have been added to the question by users, or comments themselves if populated.
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  askedBy: string;
  askDateTime: Date;
  answers: Answer[] | ObjectId[];
  views: string[];
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The username of the user who asked the question
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
    askedBy: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - body - The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the username of the user voting.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user voting.
 */
export interface VoteRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}

/**
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The username of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 *
 */
export interface Comment {
  _id?: ObjectId;
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
export interface AddCommentRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    comment: Comment;
  };
}

/**
 * Type representing the possible responses for a Comment-related operation.
 */
export type CommentResponse = Comment | { error: string };

/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: AnswerResponse | QuestionResponse | null;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a vote update event, which contains:
 * - qid - The unique identifier of the question.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update event, which contains:
 * - qid - The unique identifier of the question.
 * - answer - The updated answer.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: AnswerResponse;
}

/**
 * Interface for the request body when registering a new user.
 * - username - The username of the user registering.
 * - firstName - The first name of the user registering.
 * - lastName - The last name of the user registering.
 * - email - The email address of the user registering.
 * - password - The password of the user registering.
 * - profileGraphic: The number corresponding to which profile graphic they choose upon registering.
 * - gender: The gender of the user registering.
 * - age: The age of the user registering.
 */
export interface RegisterUserRequest {
  body: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profileGraphic: number;
    gender: string;
    age: number;
  };
}

/**
 * Interface for the request body when logging in as a user.
 * - username - The username of the user logging in.
 * - password - The password of the user logging in.
 */
export interface LoginUserRequest {
  body: {
    username: string;
    password: string;
  }
}

/**
 * Interface for the request body when deleting a user.
 * - username - The unique username of the user being deleted.
 */
export interface DeleteUserRequest {
  body: {
    username: string;
  };
}

/**
 * Interface for the request body when getting a user.
 * - username - The username of the user being fetched.
 */
export interface GetUserRequest {
  params: {
    username: string;
  };
}

/**
 * Interface for the request body when a user is following/unfollowing another.
 * - username - The id of the user following/unfollowing the other.
 * - userToFollowUsername - The id of the user being followed/unfollowed.
 */
export interface FollowUserRequest {
  body: {
    currentUserId: string;
    userToFollowId: string;
  };
}

/**
 * Type representing the possible responses for a User-related operation.
 */
export type UserResponse = User | { error: string };

/**
 * Type representing the possible responses for fetching numerous users.
 */
export type MultipleUserResponse = User[] | { error: string };

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
  conversationUpdate: (conversation: Conversation) => void;
  notificationsUpdate: (notification: NotificationUpdatePayload) => void;
  followingUpdate: (user: User, user2: User) => void;
}

/**
 * Interface representing a Notification document, which contains:
 * - _id - The unique identifier for the notification. Optional field
 * - user: The username of the user that has a notification.
 * - message: The message that the notification is for.
 */
 export interface Notification {
  _id?: ObjectId;
  user: string;
  message: Message;
}
 
// TODO - remove 

//  /**
//  * Interface representing an User document, which contains:
//  * - id: The unique identifier for the user.
//  * - username: The unique username for each user.
//  * - firstName: The first name of the user.
//  * - lastName: The last name of the user.
//  * - email: The email associated with the account.
//  * - password: The an ecrypted version of the user's password for the account.
//  * - profileGraphic: The number corresponding to which profile graphic they choose upon registering.
//  * - deleted: A boolean value representing if the account has been deleted. 
//  * - following: A list of of users that the user follows.
//  * - followers: A list of of users that follow the user.
//  */
// export interface User {
//   _id?: ObjectId;
//   username: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   profileGraphic: number;
//   deleted: boolean;
//   following: User[];
//   followers: User[];
// }

/**
 * Interface representing a Conversation document, which contains:
 * - id: The unique identifier for the conversation.
 * - users: A list of users that are participating in the conversation.
 * - messages: A list of all the messages in the conversation.
 * - updatedAt: The date/time of the most recent message sent or received in the conversation.
 */
export interface Conversation {
  _id?: ObjectId;
  users: User[];
  messages: Message[];
  updatedAt: Date;
}

/**
 * Type representing the possible responses for fetching multiple conversations.
 */
export type MultipleConversationResponse = Conversation[] | { error: string };

/**
 * Interface representing the possible responses for a Conversation-related operation.
 */
export type ConversationResponse = Conversation | { error: string };

/**
 * Interface representing a Message document, which contains:
 * - id: The unique identifier for the message.
 * - messageContent: The content of the message.
 * - sender: The user who sent the message.
 * - sentAt: The date and time when the message was sent.
 * - readBy: A list of users that have read the message.
 * - cid: The unique identifier for the conversation that the message is being added to.
 */
export interface Message {
  _id?: ObjectId;
  messageContent: string;
  sender: User;
  sentAt: Date;
  readBy: User[];
  cid: string;
}

/**
 * Interface representing the blast message request body when sending a blast message to followers, which contains:
 * - uid: The user id of the user sending the blsat message.
 * - messageContent: The content of the message.
 */
export interface BlastMessageRequest extends Request {
  body: {
    uid: string, 
    messageContent: string,
  }
}

export interface BlastMessageRequest extends Request {
  body: {
    uid: string, 
    messageContent: string,
  }
}

/**
 * Interface representing the request body when sending a message, which contains:
 * - sentBy: The username of who sent the message.
 * - messageContent: The content of the message.
 * - cid: The unique identifier for the conversation that the message is being added to.
 */
export interface AddMessageRequest extends Request {
  body: {
    sentBy: string;
    messageContent: string;
    cid: string;
  };
}

/**
 * Interface representing the request body when marking a message as read, which contains:
 * - mid: The unique identifier for the message that is being marked as read.
 * - user: The unique identifier for the user that is marking the message as read.
 */
export interface MarkMessageAsReadRequest extends Request {
  body: {
    mid: string;
    uid: string;
  }
}

/**
 * Interface representing the possible responses for a Message-related operation.
 */
export type MessageResponse = Message | { error: string };

/** 
  * Interface for the request body when adding a new conversation.
 * - body - The conversation being added.
 */
export interface AddConversationRequest extends Request {
  body: Conversation;
}


/**
 * Interface for the request body when adding a new conversation.
 * - body - The conversation being added.
 */
export interface AddConversationRequest extends Request {
  body: Conversation;
}

/**
 * Interface for the request params when getting a conversation by id.
 * - cid - The id of the conversation being fetched.
 */
export interface GetConversationRequest {
  params: {
    cid: string;
  }
}

/**
 * Interface for the request parameter when fetching the conversations associated with a user given
 * their user ID.
 * - uid - The unique identifier of the user.
 */

export interface FindConversationsByUserIdRequest extends Request {
  params: {
    uid: string;
  };
}

/**
 * Interface representing the delete notification request body when deleting a notification, which contains:
 * - nid: The id of the notification being deleted.
 */
export interface DeleteNotificationRequest extends Request {
  body: {
    nid: string, 
  }
}

/**
 * Interface representing the possible responses for a Notification-related operation.
 */
export type NotificationResponse = Notification | { error: string };

/**
 * Type representing the possible responses for fetching numerous notifications.
 */
export type MultipleNotificationResponse = Notification[] | { error: string };

/**
 * Interface for the request parameter when fetching the notifications associated with a user given
 * their username.
 * - username - The unique identifier of the user.
 */

export interface FindNotificationsByUsernameRequest extends Request {
  params: {
    username: string;
  };
}

/**
 * Interface representing the payload when there is an update made to a notification
 * - notification: the notification being updated
 * - type: whether the notification is being added or removed
 */
export interface NotificationUpdatePayload {
  notification: Notification;
  type: 'add' | 'remove';
}

/**
 * Type representing the possible responses for when a user is being removed from
 * the following/follower lists of other users.
 */
export type RemoveUserResponse = { success: boolean; error?: string };

/**
 * Interface representing the payload when an email is attempted to be sent.
 * - success: boolean, true upon success and false upon failure
 * - message: 'Email successfully sent!' upon success, or 'Failed to send email' with
 * error appended upon failure.
 */
export interface SendEmailPayload {
  success: boolean;
  message: string;
}

/**
 * Interface representing a User document, which contains:
 * - id: The unique identifier for the user.
 * - username: The unique username for each user.
 * - firstName: The first name of the user.
 * - lastName: The last name of the user.
 * - email: The email associated with the account.
 * - password: The an ecrypted version of the user's password for the account.
 * - profileGraphic: The number corresponding to which profile graphic they choose upon registering.
 * - deleted: A boolean value representing if the account has been deleted. 
 * - following: A list of of users that the user follows.
 * - followers: A list of of users that follow the user.
 * - outifts: The outfits the user has logged. 
 * - workouts: The workouts the user has logged.
 * - gender: The gender of the user. 
 * - age: The age of the user. 
 */
export interface User {
  _id?: ObjectId;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileGraphic: number;
  deleted: boolean;
  following: User[];
  followers: User[];
  outfits: Outfit[];
  workouts: Workout[];
  gender: string; 
  age: number;
}

/**
 * Interface representing an OutfitItem, which contains:
 * - id: The unique identifier for the outfit item.
 * - runner: The runner who created the outfit item.
 * - brand: The brand name of the outfit item.
 * - model: The model name of the outfit item.
 * - outfits: The list of outfits that the outfit item is a part of.
 */
export interface OutfitItem {
  _id?: string;
  runner: User;
  brand: string;
  model: string;
  outfits: Outfit[];
}

/**
 * Interface for the request parameter when fetching the outfit items associated with a user given
 * their user ID.
 * - uid - The unique identifier of the user.
 */

export interface FindOutfitItemsByUserIdRequest extends Request {
  params: {
    uid: string;
  };
}

/**
 * Interface for the request parameter when fetching an outfit by its id.
 * - oid - The unique identifier of the outfit.
 */

export interface FindOutfitByIdRequest extends Request {
  params: {
    oid: string;
  };
}

// used when getting all the outfit items a user has created for the create outfit page (when selecting existing itmes)
export interface AllOutfitItemsObject {
  tops: Top[];
  bottoms: Bottom[];
  accessories: Accessory[];
  outerwears: Outerwear[];
  shoes: Shoe[];
}

/**
 * Type representing the possible responses for fetching all outfit items.
 */
export type AllOutfitItemsResponse = AllOutfitItemsObject | { error: string };


/**
 * Interface representing an Outfit document, which contains:
 * - id: The unique identifier for the outfit.
 * - wearer: The user who wore and logged the outfit.
 * - dateWorn: The date/time for when an outfit was worn.
 * - location: The city/state/country location of where the outfit was worn.
 * - workout: The workout for which this outfit was worn.
 * - rating: The rating given to the outfit.
 * - tops: The tops worn in the outfit.
 * - bottoms: The bottoms worn in the outfit.
 * - outerwear: The outerwear worn in the outfit.
 * - accessories: The accessories worn in the outfit.
 * - shoe: The shoes worn in the outfit.
* - imageUrl: The url of where the outfit image is stored in the cloud (Cloudinary).
 */
export interface Outfit {
  _id?: ObjectId;
  wearer: User;
  dateWorn: Date;
  location: string;
  workout: Workout;
  rating: Rating;
  tops: Top[];
  bottoms: Bottom[];
  outerwear: Outerwear[];
  accessories: Accessory[];
  shoes: Shoe;
  imageUrl: string;
}

/**
 * Interface for the request body when creating a new outfit.
 * - creatorId: The id of the user creating the outfit (i.e. the wearer).
 * - dateWorn: The date/time for when an outfit was worn.
 * - location: The city/state/country location of where the outfit was worn.
 * - workoutId: The id of the workout the outfit was worn in.
 * - ratingId: The id of the rating of the outfit.
 * - topIds: The list of ids of the tops worn as part of the outfit.
 * - bottomIds: The list of ids of the bottoms worn as part of the outfit.
 * - outerwearIds: The list of ids of the outerwear items worn as part of the outfit.
 * - accessoriesIds: The list of ids of the accessories worn as part of the outfit.
 * - shoeId: The id of the shoes worn in the outfit.
 * - imageUrl: The url of where the outfit image is stored in the cloud (Cloudinary).
 */
export interface CreateOutfitRequest {
  body: {
    creatorId: string;
    dateWorn: string;
    location: string;
    workoutId: string;
    ratingId: string;
    topIds: string[];
    bottomIds: string[];
    outerwearIds: string[];
    accessoriesIds: string[];
    shoesId: string;
    imageUrl: string;
  };
}

/**
 * Type representing the possible responses for a Outfit-related operation.
 */
export type OutfitResponse = Outfit | { error: string };

/**
 * Interface representing a Workout document, which contains:
 * - id: The unique identifier for the workout.
 * - runner: The user who logged the workout.
 * - runType: The type of run workout.
 * - distance: The distance (in miles) ran during the workout.
 * - duration: The time duration of the run workout.
 */
export interface Workout {
  _id?: ObjectId;
  runner: User;
  runType: String;
  distance: Number;
  duration: Number;
}

/**
 * Interface for the request body when creating a new workout.
 * - runnerId: The id of the user creating the workout (i.e. the runner).
 * - runType: The type of run workout.
 * - distance: The distance (in miles) ran during the workout.
 * - duration: The time duration of the run workout.
 */
export interface CreateWorkoutRequest {
  body: {
    runnerId: string;
    runType: string;
    distance: number;
    duration: number; 
  };
}

/**
 * Type representing the possible responses for a Workout-related operation.
 */
export type WorkoutResponse = Workout | { error: string };

/**
 * Interface for the request params when getting a workout by id.
 * - wid - The id of the workout being fetched.
 */
export interface GetWorkoutRequest {
  params: {
    wid: string;
  }
}

/**
 * Interface for the request parameter when fetching the workouts associated with a user given
 * their user ID.
 * - uid - The unique identifier of the user.
 */

export interface FindWorkoutsByUserIdRequest extends Request {
  params: {
    uid: string;
  };
}

/**
 * Type representing the possible responses for fetching numerous workouts.
 */
export type MultipleWorkoutsResponse = Workout[] | { error: string };


/**
 * Interface representing a Rating document, which contains:
 * - id: The unique identifier for the rating.
 * - stars: The number of stars (out of 5) allocated to the outfit.
 * - temperatureGauge: A measure of how the outfit performed in the weather conditions (
 * i.e. too cold, too warm, appropriate).
 */
export interface Rating {
  _id?: ObjectId;
  stars: Number;
  temperatureGauge: String;
}

/**
 * Interface for the request body when creating a new rating.
 * - stars: The number of stars given to the outfit (out of 5).
 * - temperatureGauge: The string representing how well the outfit did given the temperature 
 * conditions (too warm, too cold, appropriate).
 */
export interface CreateRatingRequest {
  body: {
    stars: number;
    temperatureGauge: string;
  };
}

/**
 * Type representing the possible responses for a Rating-related operation.
 */
export type RatingResponse = Rating | { error: string };

/**
 * Interface representing a Top document, which contains:
 * - id: The unique identifier for the top.
 * - runner: The runner who created the top.
 * - brand: The brand name of the top. 
 * - model: The model name of the top.
 * - outfits: The list of outfits that the top is a part of.
 */
export interface Top extends OutfitItem {}

/**
 * Interface for the request body when creating a new top.
 * - runnerId: The id of the user creating the top (i.e. the wearer).
 * - brand: The brand name of the top.
 * - model: The model name of the top.
 */
export interface CreateTopRequest {
  body: {
    runnerId: string;
    brand: string;
    model: string;
  };
}

/**
 * Type representing the possible responses for a Top-related operation.
 */
export type TopResponse = Top | { error: string };

/**
 * Type representing the possible responses for fetching numerous tops.
 */
export type MultipleTopResponse = Top[] | { error: string };


/**
 * Interface representing a Botton document, which contains:
 * - id: The unique identifier for the bottom.
 * - runner: The runner who created the bottom.
 * - brand: The brand name of the bottom. 
 * - model: The model name of the bottom.
 * - outfits: The list of outfits that the bottom is a part of.
 */
export interface Bottom extends OutfitItem {}

/**
 * Interface for the request body when creating a new bottom.
 * - runnerId: The id of the user creating the bottom (i.e. the wearer).
 * - brand: The brand name of the bottom.
 * - model: The model name of the bottom.
 */
export interface CreateBottomRequest {
  body: {
    runnerId: string;
    brand: string;
    model: string;
  };
}

/**
 * Type representing the possible responses for a Bottom-related operation.
 */
export type BottomResponse = Bottom | { error: string };

/**
 * Type representing the possible responses for fetching numerous bottoms.
 */
export type MultipleBottomResponse = Bottom[] | { error: string };


/**
 * Interface representing an Accessory document, which contains:
 * - id: The unique identifier for the accessory.
 * - runner: The runner who created the accessory.
 * - brand: The brand name of the accessory. 
 * - model: The model name of the accessory.
 * - outfits: The list of outfits that the accessory is a part of.
 */
export interface Accessory extends OutfitItem {}

/**
 * Interface for the request body when creating a new accessory.
 * - runnerId: The id of the user creating the accessory (i.e. the wearer).
 * - brand: The brand name of the accessory.
 * - model: The model name of the accessory.
 */
export interface CreateAccessoryRequest {
  body: {
    runnerId: string;
    brand: string;
    model: string;
  };
}

/**
 * Type representing the possible responses for a Accessory-related operation.
 */
export type AccessoryResponse = Accessory | { error: string };

/**
 * Type representing the possible responses for fetching numerous accessories.
 */
export type MultipleAccessoryResponse = Accessory[] | { error: string };


/**
 * Interface representing an Outerwear document, which contains:
 * - id: The unique identifier for the outerwear item.
 * - runner: The runner who created the outerwear item.
 * - brand: The brand name of the outerwear item. 
 * - model: The model name of the outerwear item.
 * - outfits: The list of outfits that the outerwear item is a part of.
 */
export interface Outerwear extends OutfitItem {}

/**
 * Interface for the request body when creating a new outerwear item.
 * - runnerId: The id of the user creating the outerwear item (i.e. the wearer).
 * - brand: The brand name of the outerwear item.
 * - model: The model name of the outerwear item.
 */
export interface CreateOuterwearRequest {
  body: {
    runnerId: string;
    brand: string;
    model: string;
  };
}

/**
 * Type representing the possible responses for a Outerwear-related operation.
 */
export type OuterwearResponse = Outerwear | { error: string };

/**
 * Type representing the possible responses for fetching numerous outerwear items.
 */
export type MultipleOuterwearItemResponse = Outerwear[] | { error: string };


/**
 * Interface representing a Shoe document, which contains:
 * - id: The unique identifier for the shoe.
 * - runner: The runner who created the shoe.
 * - brand: The brand name of the shoe. 
 * - model: The model name of the shoe.
 * - outfits: The list of outfits that the shoe is a part of.
 */
export interface Shoe extends OutfitItem {}

/**
 * Interface for the request body when creating a new shoe.
 * - runnerId: The id of the user creating the shoe (i.e. the wearer).
 * - brand: The brand name of the shoe.
 * - model: The model name of the shoe.
 */
export interface CreateShoeRequest {
  body: {
    runnerId: string;
    brand: string;
    model: string;
  };
}

/**
 * Type representing the possible responses for a Shoe-related operation.
 */
export type ShoeResponse = Shoe | { error: string };

/**
 * Type representing the possible responses for fetching numerous shoes.
 */
export type MultipleShoeResponse = Shoe[] | { error: string };

/**
 * Type representing the possible responses for fetching numerous outfits.
 */
export type MultipleOutfitResponse = Outfit[] | { error: string };

/**
 * Interface represents the data for an outfit.
 * - oid: The unique identifier for the outfit.
 * - wearerUsername: The username of the wearer of the outfit.
 * - dateWorn: The date the outfit was worn.
 * - location: The location the outfit was worn.
 * - runType: The type of run for which the outfit was worn.
 * - stars: The number of stars given to the outfit.
 * - imageUrl: Url of outfit image stored in s3.
 */
export interface OutfitData {
  oid: string;
  wearerUsername: string;
  dateWorn: Date;
  location: string;
  runType: string;
  stars: number;
  imageUrl: string;
}

/**
 * Type representing the possible responses for fetching numerous partial outfits.
 */
export type MultipleOutfitDataResponse = OutfitData[] | { error: string };

/**
 * Interface for the request parameter when fetching the coordinates of a city, state, country location.
 * - location - The location for which the coordinates are being fetched.
 */

export interface ForwardGeocodeRequest extends Request {
  body: {
    location: string;
  };
}

/**
 * Interface for the request parameter when generating a static map image of lat, lng coordinates.
 * - coordianates - The lat, lng coordinates for which the map image is being generated.
 */

export interface GenerateStaticMapImageRequest extends Request {
  body: {
    coordinates: LocationCoordinates;
  };
}

/**
 * Interface representing the payload when a location is forward geocoded.
 * - lat: The latitudinal coordinate of the location being geocoded.
 * - lng: The longitudinal coordinate of the location being geocoded.
 */
export interface ForwardGeocodePayload {
  lat: string;
  lng: string;
}

/**
 * Interface for representing a LocationCoordinate object.
 * - lat: latituginal coordinate of location
 * - lng: longitudinal coordinate of location
 */
export interface LocationCoordinates {
  lat: number;
  lng: number;
}

/**
 * Interface for the request parameter when getting the historical weather data of a location, date, time.
 * - coordianates - The lat, lng coordinates for which the map image is being generated.
 * - dateTimeInfo - The date and time of the day for which the weather info reflects.
 */

export interface GetHistoricalWeatherDataRequest extends Request {
  body: {
    coordinates: LocationCoordinates;
    dateTimeInfo: Date;
  };
}

/**
 * Interface for data representing one specific hour of weather.
 */
export interface HourlyWeather {
  datetime: string;
  temp: number;
  feelslike: number;
  humidity: number;
  dew: number;
  windspeed: number;
  windgust: number;
  winddir: number;
  pressure: number;
  visibility: number;
  cloudcover: number;
  uvindex: number;
  conditions: string;
  icon: string;
};

/**
 * Interface for data representing an entire day's weather.
 */
export interface WeatherDay {
  datetime: string;
  tempmax: number;
  tempmin: number;
  temp: number;
  conditions: string;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
  hours: HourlyWeather[];
};

/**
 * Interface for the request parameter when fetching the username of a user given
 * their user ID.
 * - uid - The unique identifier of the user.
 */

export interface FindUserByUserIdRequest extends Request {
  params: {
    uid: string;
  };
}

/**
 * Interface for the request body when uploading an image to Cloudinary.
 * - imageToUpload: Form data containing the image file to upload.
 */
export interface UploadImageRequest {
  body: {
    imageToUpload: FormData;
  };
}

/**
 * Type representing the possible responses for an image upload-related operation.
 */
export type UploadImageResponse = UploadApiResponse | { error: string };

/**
 * Interface for the request query to find outfits using a search string, which contains:
 * - order - The order in which to sort the outfits
 * - search - The search string used to find outfits
 */
export interface FindOutfitRequest extends Request {
  query: {
    order: OrderType;
    search: string;
  };
}