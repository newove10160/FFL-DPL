const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    basePost:{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    commenter:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commenterName:{
        type: String,
        ref: 'User',
        required: true
    },
    desc:{
          type:String,
          max:500,
    },
},
    { timestamps: true }
);
  
  module.exports = mongoose.model("Comment", CommentSchema);