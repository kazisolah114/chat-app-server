import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const { message } = req.body;
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        })
        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, recieverId]
            })
        }
        const newMessage = await Message.create({
            senderId,
            recieverId,
            message
        })
        if (newMessage) {
            gotConversation.messages.push(newMessage._id)
        }
        await gotConversation.save();

        // SOCKET.IO

        res.status(201).json({ newMessage })
    } catch (error) {
        res.status(401).json({ message: "There was an error while sending message!" })
    }
}

export const getMessage = async (req, res) => {
    try {
        const recieverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [recieverId, senderId] }
        }).populate("messages");
        res.status(200).json(conversation?.messages)
    } catch (error) {
        res.status(401).json({ message: "There was an error while sending message!" })
    }
}