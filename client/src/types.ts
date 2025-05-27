import { Socket } from 'socket.io-client';

export type FakeSOSocket = Socket<ServerToClientEvents>;

/**
 * Interface representing a User, which contains:
 * - id - The id of the user.
 * - username - The unique identifier of the user.
 * - firstName: The first name of the user.
 * - lastName: The last name of the user.
 * - email - The email of the user.
 * - password - The password of the user.
 * - profileGraphic: The number corresponding to which profile graphic they choose upon registering.
 * - deleted - Boolean inidicating if this user has been deleted.
 * - following - Usernames of users that this user is following.
 * - followers - Usernames of users that are following this user.
 * - outifts: The outfits the user has logged.
 * - workouts: The workouts the user has logged.
 * - gender: The gender of the user.
 * - age: The age of the user.
 */
export interface User {
  _id?: string;
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
 * Interface representing an Outfit, which contains:
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
 * - shoes: The shoes worn in the outfit.
 */
export interface Outfit {
  _id?: string;
  wearer?: User;
  dateWorn?: Date;
  location?: string;
  workout?: Workout;
  rating?: Rating;
  tops: Top[];
  bottoms: Bottom[];
  outerwear: Outerwear[];
  accessories: Accessory[];
  shoes?: Shoe;
}

/**
 * Interface represents the data for an outfit.
 * - oid: The unique identifier for the outfit.
 * - dateWorn: The date the outfit was worn.
 * - location: The location the outfit was worn.
 * - runType: The type of run for which the outfit was worn.
 * - stars: The number of stars given to the outfit.
 */
export interface OutfitData {
  oid: string;
  dateWorn: Date;
  location: string;
  runType: string;
  stars: number;
}

/**
 * Interface representing a Workout, which contains:
 * - id: The unique identifier for the workout.
 * - runner: The user who logged the workout.
 * - runType: The type of run workout.
 * - distance: The distance (in miles) ran during the workout.
 * - duration: The time duration of the run workout.
 */
export interface Workout {
  _id?: string;
  runner: User;
  runType: string;
  distance: number;
  duration: number;
}

/**
 * Interface representing a Rating for an outfit, which contains:
 * - id: The unique identifier for the rating.
 * - stars: The number of stars (out of 5) allocated to the outfit.
 * - temperatureGauge: A measure of how the outfit performed in the weather conditions (
 * i.e. too cold, too warm, appropriate).
 */
export interface Rating {
  _id?: string;
  stars: number;
  temperatureGauge: string;
}

/**
 * Interface representing an OutfitItem, which contains:
 * - id: The unique identifier for the outfit item.
 * - runner: The runner who created the outfit item.
 * - brand: The brand name of the outfit item.
 * - model: The model name of the outfit item.
 * - s3PhotoUrl: The URL link to the S3 bucket where the outfit item photo is stored.
 * - outfits: The list of outfits that the outfit item is a part of.
 */
export interface OutfitItem {
  _id?: string;
  runner: User;
  brand: string;
  model: string;
  s3PhotoUrl: string;
  outfits: Outfit[];
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
 * Interface representing a Top, which contains:
 * - id: The unique identifier for the top.
 * - runner: The runner who created the top.
 * - brand: The brand name of the top.
 * - model: The model name of the top.
 * - s3PhotoUrl: The URL link to the S3 bucket where the top photo is stored.
 * - outfits: The list of outfits that the top is a part of.
 */
export interface Top extends OutfitItem {}

/**
 * Interface representing a Botton, which contains:
 * - id: The unique identifier for the bottom.
 * - runner: The runner who created the bottom.
 * - brand: The brand name of the bottom.
 * - model: The model name of the bottom.
 * - s3PhotoUrl: The URL link to the S3 bucket where the bottom photo is stored.
 * - outfits: The list of outfits that the bottom is a part of.
 */
export interface Bottom extends OutfitItem {}

/**
 * Interface representing an Accessory, which contains:
 * - id: The unique identifier for the accessory.
 * - runner: The runner who created the accessory.
 * - brand: The brand name of the accessory.
 * - model: The model name of the accessory.
 * - s3PhotoUrl: The URL link to the S3 bucket where the accessory photo is stored.
 * - outfits: The list of outfits that the accessory is a part of.
 */
export interface Accessory extends OutfitItem {}

/**
 * Interface representing an Outerwear object, which contains:
 * - id: The unique identifier for the outerwear item.
 * - runner: The runner who created the outerwear item.
 * - brand: The brand name of the outerwear item.
 * - model: The model name of the outerwear item.
 * - s3PhotoUrl: The URL link to the S3 bucket where the outerwear photo is stored.
 * - outfits: The list of outfits that the outerwear item is a part of.
 */
export interface Outerwear extends OutfitItem {}

/**
 * Interface representing a Shoe, which contains:
 * - id: The unique identifier for the shoe.
 * - runner: The runner who created the shoe.
 * - brand: The brand name of the shoe.
 * - model: The model name of the shoe.
 * - s3PhotoUrl: The URL link to the S3 bucket where the shoe photo is stored.
 * - outfits: The list of outfits that the shoe is a part of.
 */
export interface Shoe extends OutfitItem {}

/**
 * Enum representing the possible ordering options for questions.
 * and their display names.
 */
export const orderTypeDisplayName = {
  newest: 'Newest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
} as const;

/**
 * Type representing the keys of the orderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type OrderType = keyof typeof orderTypeDisplayName;

/**
 * Interface represents a comment.
 *
 * text - The text of the comment.
 * commentBy - Username of the author of the comment.
 * commentDateTime - Time at which the comment was created.
 */
export interface Comment {
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface representing a tag associated with a question.
 *
 * @property name - The name of the tag.
 * @property description - A description of the tag.
 */
export interface Tag {
  _id?: string;
  name: string;
  description: string;
}

/**
 * Interface represents the data for a tag.
 *
 * name - The name of the tag.
 * qcnt - The number of questions associated with the tag.
 */
export interface TagData {
  name: string;
  qcnt: number;
}

/**
 * Interface representing the voting data for a question, which contains:
 * - qid - The ID of the question being voted on
 * - upVotes - An array of user IDs who upvoted the question
 * - downVotes - An array of user IDs who downvoted the question
 */
export interface VoteData {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Comments associated with the answer.
 */
export interface Answer {
  _id?: string;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[];
}

/**
 * Interface representing the structure of a Question object.
 *
 * - _id - The unique identifier for the question.
 * - tags - An array of tags associated with the question, each containing a name and description.
 * - answers - An array of answers to the question
 * - title - The title of the question.
 * - views - An array of usernames who viewed the question.
 * - text - The content of the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - The date and time when the question was asked.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 * - comments - Comments associated with the question.
 */
export interface Question {
  _id?: string;
  tags: Tag[];
  answers: Answer[];
  title: string;
  views: string[];
  text: string;
  askedBy: string;
  askDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[];
}

/**
 * Interface representing the payload for a vote update socket event.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

export interface AnswerUpdatePayload {
  qid: string;
  answer: Answer;
}

export interface CommentUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: Question) => void;
  answerUpdate: (update: AnswerUpdatePayload) => void;
  viewsUpdate: (question: Question) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (update: CommentUpdatePayload) => void;
  conversationUpdate: (conversation: Conversation) => void;
  notificationsUpdate: (notification: NotificationUpdatePayload) => void;
  followingUpdate: (user: User, user2: User) => void;
}

/**
 * Interface representing a Notification document, which contains:
 * - _id - The unique identifier for the notification. Optional field.
 * - user: The username of the user that has a notification.
 * - message: The message_id that the notification is for.
 */
export interface Notification {
  _id?: string;
  user: string;
  message: Message;
}

/**
 * Interface representing the structure of a Conversation object.
 *
 * - _id - The unique identifier for the conversation.
 * - users - An array of users who are participating in the conversation.
 * - messages - An array of messages that have been sent in the conversation.
 * - updatedAt - The date and time when the conversation was last updated.
 */
export interface Conversation {
  _id?: string;
  users: User[];
  messages: Message[];
  updatedAt: Date;
}

/**
 * Interface representing the structure of a Message object.
 *
 * - _id - The unique identifier for the message.
 * - messageContent - The content of the message.
 * - sender - The user who sent the message.
 * - sentAt - The date and time when the message was sent.
 * - readBy - An array of users that have read the message.
 * - cid - The conversation ID that the message belongs to.
 */
export interface Message {
  _id?: string;
  messageContent: string;
  sender: User;
  sentAt: Date;
  readBy: User[];
  cid: string;
}

/**
 * Represents the inputs for SearchUser component
 * - setAlert: function that sets the alert text for an error.
 * - navigate: function that allows to set the router navigation within the dashboard layout
 * - setConversations: function sets conversations displayed on conversation page.
 * - conversations: conversations displayed on conversation page.
 */
export interface SearchUsersProps {
  setAlert: (alert: string) => void;
  navigate: (path: string | URL) => void;
  setConversations: (conversations: Conversation[]) => void;
  conversations: Conversation[];
}

/**
 * Represent the inputs for DashboardNavigation
 * - navigate: function that allows to set the router navigation within the dashboard layout
 * - setConversations: function sets conversations displayed on conversation page.
 * - conversations: conversations displayed on conversation page.
 */
export interface DashboardNavigationProps {
  navigate: (path: string | URL) => void;
  setConversations: (conversations: Conversation[]) => void;
  conversations: Conversation[];
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
 * Represent the inputs for ClothingItemForm.
 * - clothingItem: string of the clothing item = 'top', 'bottom', etc
 * - nextClothingItem: string of the clothing item that will be created next
 */
export interface ClothingItemFormProps {
  clothingItem: string;
  nextClothingItem: string;
}
