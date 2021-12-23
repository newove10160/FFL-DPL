const router = require("express").Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const Post = require('../models/Post');

//Create a notification
router.post("/", async (req, res) => {
    const newNotification = new Notification(req.body)
    try {
        const foundUser = await User.findById(newNotification.notification_receiver);
        const foundPost = await Post.findById(newNotification.postId);
        if (foundUser != null && foundPost != null) {
            await newNotification.save();
            res.status(201).json(newNotification);
        }
        else {
            res.status(409).json({ message: "Invalid ID" })
        }
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
});

//Fetch all notification for user
router.get('/:userId', async (req,res) => {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send('No user with that id.');

    try {
        const foundNotifications = await Notification.find({ notification_receiver: userId });

        if (foundNotifications != null && foundNotifications.length != 0) {
            res.status(200).json(foundNotifications);
        }
        else {
            res.status(404).json();
        }
    }

    catch(err){
        res.status(409).json({ message: err.message });
    }       
})

//Set all user's notifications to 'seen'
router.put('/:userId/seen', async (req,res) => {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send('No user with that id.');

    try {
        const foundNotifications = await Notification.updateMany({ notification_receiver: userId, notification_seen: false }, {notification_seen: true});
        res.status(200).json(foundNotifications);
    }

    catch(err){
        res.status(409).json({ message: err.message });
    }       
})

module.exports = router;