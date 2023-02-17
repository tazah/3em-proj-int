/* eslint-disable no-unused-vars */
// import { Db } from 'mongodb';
import { Service } from 'typedi';
import { User } from '../../../../common/user/user';
// eslint-disable-next-line no-restricted-imports
import { DatabaseConnectionService } from '../database-connection/connection.service';
import { Chat } from './../../../../common/chat/chat';
import { Message } from './../../../../common/Message/message';

@Service()
export class ChatCollectionService {
    constructor(private databaseConnection: DatabaseConnectionService) {}

    //to add new chat
    async addNewChat(chat: Chat): Promise<any> {
        return await this.databaseConnection.database.collection('ChatHistory').insertOne(chat);
    }
    // to get all chats
    async getAllChats(): Promise<Chat[]> {
        return await this.databaseConnection.database.collection('ChatHistory').find({}).toArray();
    }
    // use it to get a specific chat by name
    async getChatBySocketIndex(chatIndex: number): Promise<Chat[]> {
        return await this.databaseConnection.database.collection('ChatHistory').find({ chatIndex: chatIndex }).sort({ chatName: -1 }).toArray();
    }

    // use it to get the public chat
    async getPublicChat(): Promise<Chat[]> {
        return await this.databaseConnection.database.collection('ChatHistory').find({ public: true }).toArray();
    }

    // use it to get all the private chats
    async getPrivateChats(): Promise<Chat[]> {
        return await this.databaseConnection.database.collection('ChatHistory').find({ public: false }).toArray();
    }

    // to get the chats of a client
    /*async getClientChats(ownerName: string): Promise<Chat[]> {
        const chats: Chat[] = await this.getAllChats();
        let owenChats: Chat[] = [];
        for (let chat = 0; chat < chats.length; chat++) {
            for (let user = 0; user < chats[chat].chatUsers.length; user++) {
                if (chats[chat].chatUsers[user].userName === ownerName) {
                    owenChats.push(chats[chat]);
                }
            }
        }
        return owenChats;
    }*/

    // to delete a chat by name
    async deleteChatByName(chatName: string) {
        return (await this.databaseConnection.database.collection('ChatHistory').findOneAndDelete({ chatName: chatName }, { sort: { chatName: -1 } }))
            .value;
    }
    // to delete a chat by it's creator name
    async deleteChatByOwner(chatCreatorName: string) {
        return (
            await this.databaseConnection.database
                .collection('ChatHistory')
                .findOneAndDelete({ chatCreator: chatCreatorName }, { sort: { chatName: -1 } })
        ).value;
    }

    // to add a user to a chat
    async addChatNewUser(newUser: User, chatName: string) {
        return await this.databaseConnection.database.collection('ChatHistory').updateOne({ chatName: chatName }, { $push: { chatUsers: newUser } });
    }

    async addNewMember(newUserName: string, chatIndex: number) {
        return await this.databaseConnection.database
            .collection('ChatHistory')
            .updateOne({ chatIndex: chatIndex }, { $push: { memebers: newUserName } });
    }

    // to delete a user from a chat
    async deleteChatUserr(chatName: string, userToDelete: string) {
        return await this.databaseConnection.database.collection('ChatHistory').updateOne({ name: chatName }, { $pull: { chatUsers: userToDelete } });
    }

    // to add a new message to an existant chat
    async addNewMessage(chatName: string, message: Message) {
        return await this.databaseConnection.database.collection('ChatHistory').updateOne({ chatName: chatName }, { $push: { messages: message } });
    }

    async addNewMessageByChatIndex(chatIndex: number, message: Message) {
        return await this.databaseConnection.database.collection('ChatHistory').updateOne({ chatIndex: chatIndex }, { $push: { messages: message } });
    }

    // to delete a specific message from an existant chat
    async deleteMessageFromChat(chatName: string, message: Message) {
        return await this.databaseConnection.database
            .collection('ChatHistory')
            .updateOne({ chatName: chatName, messages: message }, { $pull: { messages: message } });
    }
}
