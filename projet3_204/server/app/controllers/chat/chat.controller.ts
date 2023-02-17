import { Router } from 'express';
import { Service } from 'typedi';
import { Chat } from './../../../../common/chat/chat';
import { ChatCollectionService } from './../../../../server/app/services/chat/chat-collection.service';

@Service()
export class ChatController {
    router: Router;

    constructor(private chatService: ChatCollectionService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/addChat', async (req, res) => {
            this.chatService
                .addNewChat(req.body)
                .then((resReturnd) => {
                    res.json(resReturnd);
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });

        this.router.post('/addUserPublic', async (req, res) => {
            this.chatService
                .addChatNewUser(req.body, 'Public_Chat')
                .then((resReturnd) => {
                    res.json(resReturnd);
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });

        this.router.post('/addMessagePublic', async (req, res) => {
            this.chatService
                .addNewMessage('Public_Chat', req.body)
                .then((resReturnd) => {
                    res.json(resReturnd);
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });

        this.router.get('/getAllChats', async (req, res) => {
            this.chatService
                .getAllChats()
                .then((chats: Chat[]) => {
                    res.json(chats);
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });

        this.router.get('/getPublicChat', async (req, res) => {
            this.chatService
                .getPublicChat()
                .then((chats: Chat[]) => {
                    res.json(chats);
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });
    }
}
