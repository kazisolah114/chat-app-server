import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

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
        const receiverSocketId = getReceiverSocketId(recieverId);
        io.to(receiverSocketId).emit("newMessage", newMessage);

        res.status(201).json({ newMessage })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "There was an error while sending message!", error: error.message })
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
        console.log(error)
        res.status(500).json({ message: "There was an error while getting message!", error: error.message })
    }
}