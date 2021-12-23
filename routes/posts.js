const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", async (req, res)=>{
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update Post
router.put("/:id", async(req, res)=>{
    try{ 
    const post = await Post.findById(req.params.id);
        await post.updateOne({$set:req.body});
        res.status(200).json("post updated")
    } catch (err){
        res.status(500).json(err);
    }
});

//delete post
router.delete("/:id", async(req,res)=>{
    try{
    const post = await Post.findById(req.params.id);
    
        await post.deleteOne();
        res.status(200).json("post deleted")
    
    }catch (err){
        res.status(500).json(err);
    }
});

//like a post and dislike
router.put("/:id/like", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
    if(!post.likes.includes(req.body.userId)){
        await post.updateOne({$push:{likes: req.body.userId}});
        res.status(200).json("liked");
    }else{
        await post.updateOne({$pull:{likes: req.body.userId}});
        res.status(200).json("disliked");
    }
    } catch (error) {
        res.status(500).json(error);
    }
});

//get a post
router.get("/:id", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get timeline post
router.get("/timeline/:userId", async(req,res)=>{
    try {
        /*const currentUser = await User.findById(req.params.userId);*/
        const userPosts = await Post.find();
        /*const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId: friendId});
            })
        );*/
            res.status(200).json(userPosts);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get user's all post
router.get("/profile/:username", async(req,res)=>{
    try {
        const user = await User.findOne({username:req.params.username});
        const posts = await Post.find({userId: user._id});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});


//Get timeline's post by page
router.get("/feeds/page/:pageNo/size/:pageSize", async (req, res) => {
    let { userId, pageNo, pageSize } = req.params;
    pageNo = parseInt(pageNo);
    pageSize = parseInt(pageSize);
    if (pageNo <= 0) {
        pageNo = 1
    }
    if (pageSize <= 0) {
        pageSize = 10
    }
    try {
        const foundPage = await Post.find()
            .sort({ createdAt: 'desc' })
            .skip(pageSize * (pageNo - 1))
            .limit(pageSize)
        res.status(200).json(foundPage)
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
})

//Get user's post by page
router.get("/profile/:username/page/:pageNo/size/:pageSize", async(req,res)=>{
    let { username, pageNo, pageSize } = req.params;
    pageNo = parseInt(pageNo);
    pageSize = parseInt(pageSize);
    if (pageNo <= 0) {
        pageNo = 1
    }
    if (pageSize <= 0) {
        pageSize = 10
    }
    try {
        const user = await User.findOne({ username: username });
        const foundPage = await Post.find({ userId: user._id })
            .sort({ createdAt: 'desc' })
            .skip(pageSize * (pageNo - 1))
            .limit(pageSize)
        res.status(200).json(foundPage)
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
});

//Search posts by text
router.get("/feeds/search/:searchText", async (req, res) => {
    const { searchText } = req.params;
    try {
        const foundPosts = await Post.find({ desc:{$regex: searchText, $options: 'i'} })
                                     .sort({ createdAt: 'desc' });
        res.status(200).json(foundPosts);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
})

//Search by tags
router.get("/feeds/tag/:tagName", async (req, res) => {
    const { tagName } = req.params;
    try{
        const foundPosts = await Post.find({ tag: tagName })
                                     .sort({ createdAt: 'desc' });
        res.status(200).json(foundPosts);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
})




module.exports = router;