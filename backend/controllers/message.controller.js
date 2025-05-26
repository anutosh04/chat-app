import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'



const sendMessage = async(req,res)=>{
    try {
        const {message} = req.body;
        const {id : recieverId} = req.params;
        const senderId= req.user._id
        
        let conversation = await Conversation.findOne({
            participants:{ $all: [senderId, recieverId] }
        })

        if(!conversation){
            conversation= await Conversation.create({
                participants: [senderId, recieverId]
            })
        }

        const newMessage=  await Message.create( {
            senderId,
            recieverId,
            message,
        });

        if (newMessage.message.trim() !== "") {
            await conversation.messages.push(newMessage._id);
        }
        
        await Promise.all([conversation.save(), newMessage]);

        res.status(201).json(newMessage);

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"internal server error"});
    }

}

const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages =  conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
export { getMessages, sendMessage };