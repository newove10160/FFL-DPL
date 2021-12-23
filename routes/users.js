const User = require("..//models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update User
router.put("/:userId", async(req,res)=>{
    if(req.body.userId === req.params.userId || req.body.isAdmin) {
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.userId,
               { $set: req.body,}
        );
        res.status(200).json("Account has been updated")
        }catch(err){
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json.apply("you can update only your account")
    }
})
//delete User 
router.delete("/:userId", async(req,res)=>{
    if(req.body.userId === req.params.userId || req.body.isAdmin) {
        try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("Account has been deleted");
        }catch(err){
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can delete only your account")
    }
})
//get User
router.get("/", async (req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId 
        ? await User.findById(userId)
        : await User.findOne({username: username});
        const{password,updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
});

//update Username
router.put("/username/:id", async (req,res)=>{
    try{ 
        const username = await User.findById(req.params.id);
            await username.updateOne({$set:req.body});
            res.status(200).json("username updated")
        } catch (err){
            res.status(500).json(err);
        }
})

module.exports = router