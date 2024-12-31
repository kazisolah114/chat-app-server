export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const { message } = req.body;
        console.log(`sender: ${senderId}, reciever: ${recieverId}, message: ${message}`);
        
    } catch(error) {
        res.status(401).json({message: "An error occured while sending message!"});
    }
}