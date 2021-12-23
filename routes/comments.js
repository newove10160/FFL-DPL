const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment")

//Create a comment
router.post("/", async (req, res) => {
    const newComment = new Comment(req.body)
    try {
        const foundUser = await User.findById(newComment.commenter);
        const foundPost = await Post.findById(newComment.basePost);
        if (foundUser != null && foundPost != null) {
            await newComment.save();
            res.status(201).json(newComment);
        }
        else {
            res.status(409).json({ message: "Invalid ID" })
        }
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
});

//Get a specified comment
router.get('/:commentId', async (req, res) => {
    const { commentId } = req.params;
    try {
        const foundComment = await Comment.findById(commentId);

        if (!foundComment) {
            res.status(404).json("Comment not exists in Database.");
        }

        res.status(200).json(foundComment);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
})

//Edit a comment
router.put("/:commentId", async (req, res) => {
    const { commentId } = req.params
    const newComment = req.body;

    // if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(404).send('No comment with that id.');

    try {
        const foundUser = await User.findById(newComment.commenter);
        const foundPost = await Post.findById(newComment.basePost);
        if (foundUser != null && foundPost != null) {
            res.status(409).json({ message: "Invalid Input" })
        }
        else {
            const updatedComment = await Comment.findByIdAndUpdate(commentId, { ...commentContent, commentId }, { new: true });
            res.status(200).json(updatedComment);
        }

    }
    catch (err) {
        res.status(409).json({ message: err.message })
    }

})

//Delete a comment
router.delete("/:commentId", async (req, res) => {
    const { commentId } = req.params

    // if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(404).send('No comment with that id.');

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    res.json(deletedComment);
})

//Get comments by Post
router.get("/post/:postId", async (req, res) => {
    const { postId } = req.params

    // if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id.');

    try {
        const foundComments = await Comment.find({ basePost: postId });

        if (foundComments != null && foundComments.length != 0) {
            res.status(200).json(foundComments);
        }
        else {
            res.status(404).json();
        }
    }

    catch (err) {
        res.status(409).json({ message: err.message });
    }
})

module.exports = router;