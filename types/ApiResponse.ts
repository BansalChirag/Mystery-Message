import { Message } from "@/models";

export interface ApiRepsonse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}