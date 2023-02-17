import { Message } from './../../common/Message/message';
export interface Chat {
    id?: string;
    chatIndex?: number;
    chatName: string;
    chatCreator: string;

    messages: Message[];
    public: boolean;
    members?: string[];
    isBotActive?: boolean;
}
