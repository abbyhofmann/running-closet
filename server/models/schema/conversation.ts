import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Conversation collection.
 * 
 * This schema defines the structure of conversation used to define conversations between different users.
 * Each conversation includes the following fields:
 * - `users`: The users who are participating in the conversation.
 */
const conversationSchema: Schema = new Schema(
    {  
        users: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
    },
    { collection: 'Conversation' }
);

export default conversationSchema;