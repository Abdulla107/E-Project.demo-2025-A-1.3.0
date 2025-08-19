const chatModel = require('../models/chat/chatModel');
const userModel = require('../models/userModel');
const { responseReturn } = require('../utiles/response');
const { mongo: { ObjectId } } = require('mongoose');


class chatController {


    admin_get_customer = async (req, res) => {

        try {
            const customers = await userModel.find();

            const lastMessages = await chatModel.aggregate([
                {
                    $sort: { createdAt: -1 } 
                },
                {
                    $group: {
                        _id: "$senderId",
                        lastMessageTime: { $first: "$createdAt" } 
                    }
                }
            ]);


            const lastMessageMap = {};
            lastMessages.forEach(msg => {
                lastMessageMap[msg._id] = msg.lastMessageTime;
            });

            const sortedCustomers = customers.map(c => {
                return {
                    ...c.toObject(), // Mongoose doc → plain object
                    lastMessageTime: lastMessageMap[c._id] || null
                }
            }).sort((a, b) => {
                // null means no message → will go down
                if (!a.lastMessageTime) return 1;
                if (!b.lastMessageTime) return -1;
                return new Date(b.lastMessageTime) - new Date(a.lastMessageTime); // descending
            });

            return responseReturn(res, 200, { customers: sortedCustomers });

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    send_message = async (req, res) => {

        const { senderName, sender, senderId, receverId, message, date, time } = req.body;


        try {
            if (!senderName || !sender || !message || !date || !time) {
                return responseReturn(res, 400 )
            }

            const add = await chatModel.create({
                senderName, sender, senderId, receverId, message, date, time
            })

            return responseReturn(res, 200, { message: 'Message send successfuly', add })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };


    get_message = async (req, res) => {
        const { Id } = req.params;

        try {
            if (!Id) {
                return responseReturn(res, 400)
            }
            const _id = new ObjectId(Id) 

            const chats = await chatModel.find({ 
                $or: [
                    { senderId: _id },
                    { receverId: _id }
                ]
            })
            return responseReturn(res, 200, { chats })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };

    get_admin_unSeen_message = async (req, res) => {

        try {
            const allUnseenMessages = await chatModel
                .find({ sender: 'customer', status: 'not saw' })
                .sort({ createdAt: -1 });

            if (!allUnseenMessages || allUnseenMessages.length === 0) {
                return responseReturn(res, 400, { error: 'unSeen message not found' });

            }

            const uniqueUnseenMessages = [];
            const seenSenderIds = new Set();

            for (const msg of allUnseenMessages) {
                const senderId = msg.senderId?.toString();
                if (!seenSenderIds.has(senderId)) {
                    uniqueUnseenMessages.push(msg);
                    seenSenderIds.add(senderId);
                }
            }

            const total_unSeen_message = uniqueUnseenMessages.length;
            const all_senderId = [...seenSenderIds];

            const senders = await userModel.find({ _id: { $in: all_senderId } }).select('_id image');

            const senderInfo = senders.map(user => ({
                customerId: user._id,
                image: user.image,
            }));

            const counts = await chatModel.aggregate([
                { $match: { sender: 'customer', status: 'not saw' } },
                {
                    $group: {
                        _id: "$senderId",
                        messageCount: { $sum: 1 }
                    }
                }
            ]);

            const senderMessageCount = counts.map(c => ({
                customerId: c._id,
                messageCount: c.messageCount
            }));

           
            return responseReturn(res, 200, {
                unSeen_message: uniqueUnseenMessages,
                total_unSeen_message,
                senderInfo,               
                senderMessageCount        
            });

        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }


    admin_update_message_status = async (req, res) => {

        const { senderId } = req.params;

        try {
            if (!senderId) {
                return responseReturn(res, 400,)
            }
            const id = new ObjectId(senderId) 

            const data = await chatModel.updateMany( 
                { senderId: id, status: 'not saw' }, 
                { status: 'saw' }, { new: true });

            if (data.acknowledged !== true || data.modifiedCount === 0) {
                return responseReturn(res, 400, { message: 'status update failed' })
               
            }

            return responseReturn(res, 200, { senderId, message: 'status update successfuly' })
        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    update_one_message_status = async (req, res) => {

        const { senderId } = req.params;

        try {
            if (!senderId) {
                return responseReturn(res, 400,)
            }
            const id = new ObjectId(senderId) 

            const data = await chatModel.updateOne(
                { senderId: id, status: 'not saw' }, 
                { status: 'saw' }, { new: true });

            if (data.acknowledged !== true || data.modifiedCount === 0) {
                return;
            }

            return responseReturn(res, 200, { message: 'status update successfuly' })
        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }


    get_user_unSaw_message = async (req, res) => {
        const { receverId } = req.params;

        try {
            if (!receverId) {
                return responseReturn(res, 400)
            }
            const id = new ObjectId(receverId) 

            const total_unSaw_message = await chatModel.find({ receverId: id, status: 'not saw' }).sort({ createdAt: - 1 }).countDocuments();

            if (!total_unSaw_message) {
                return responseReturn(res, 400)
            }
            return responseReturn(res, 200, { total_unSaw_message })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }


    user_update_message_status = async (req, res) => {

        const { receverId } = req.params;

        try {
            if (!receverId) {
                return responseReturn(res, 400,)
            }
            const id = new ObjectId(receverId) 

            const data = await chatModel.updateMany(
                { receverId: id, status: 'not saw' },
                { status: 'saw' }, { new: true });

            if (data.acknowledged !== true || data.modifiedCount === 0) {
                return responseReturn(res, 400, { message: 'status update failed' })
            }

            return responseReturn(res, 200, { message: 'status update successfuly' })
        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }


    user_update_one_message_status = async (req, res) => {

        const { receverId } = req.params;

        try {
            if (!receverId) {
                return responseReturn(res, 400,)
            }
            const id = new ObjectId(receverId) 

            const data = await chatModel.updateOne(
                { receverId: id, status: 'not saw' },
                { status: 'saw' }, { new: true });

            if (data.acknowledged !== true || data.modifiedCount === 0) {
                return;
            }

            return responseReturn(res, 200, { message: 'status update successfuly' })
        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };



}

module.exports = new chatController();